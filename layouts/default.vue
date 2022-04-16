<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="true"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant" ali>
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'left' : 'right'}` }}</v-icon>
      </v-btn> -->
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="purple darken-4"
      class="orange--text"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" class="font-weight-black display-1" />
      <v-spacer />

      <v-spacer />

      <v-btn v-if="this.walletconnect.connected" v-on:click="disconnect"
        >Disconnect
      </v-btn>
      <v-btn v-if="!this.walletconnect.connected" v-on:click="connect">
        Connect
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-subheader v-if="this.walletconnect.connected"
          ><v-row dense
            ><v-col xs>Network {{ network.name }}</v-col>

            <v-col xs cols="12"
              >Address
              {{
                `${address.substring(0, 8)}...${address.substring(
                  address.length - 8
                )}`
              }}</v-col
            ></v-row
          >

          <vue-qrcode :value="address" :options="{ width: 55 }"></vue-qrcode>
        </v-subheader>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span
        >&copy; {{ new Date().getFullYear() }} Industrias de Firmas Electronicas
        SA</span
      >
    </v-footer>
  </v-app>
</template>

<script>
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
import { ParkyDB } from 'parkydb'
import AnconProtocolClient from '../lib/AnconProtocol/AnconProtocolClient'
import { Subject } from 'rxjs'
import { decode, encode } from 'cbor-x'
import { defaultResolvers} from 'parkydb/lib/resolvers'
import VueQrcode from '@chenfengyuan/vue-qrcode'
const PromiseFileReader = require('promise-file-reader')
import EthCrypto from 'eth-crypto'



export default {
  name: 'DefaultLayout',
  components: {
    VueQrcode,
  },
  Ancon: AnconProtocolClient,
  created: async function () {
    //  Create WalletConnect Provider
    let provider = new WalletConnectProvider({
      infuraId: '92ed13edfad140409ac24457a9c4e22d',
      rpc: { 56: this.$nuxt.context.env.BSC_MAINNET },
      chainId: 1,
    })
    const web3provider = new ethers.providers.Web3Provider(provider)

    const bootstrap = async (accounts) => {
      this.address = accounts[0]

      try {
        this.network = await web3provider.getNetwork()
        await this.db.initialize({
    graphql: { resolvers: defaultResolvers},

          enableSync: true,
          wakuconnect: {
            bootstrap: { peers: [$nuxt.context.env.WakuLibp2p] },
            // libp2p: {
            //   config: {
            //     pubsub: {
            //       enabled: true,
            //       emitSelf: true,
            //     },
            //   },
            // },
          },
          withWallet: {
            password: '', /// Not used
          },
          withWeb3: {
            provider: web3provider,
            defaultAddress: accounts[0],
          },
          withAncon: {
            api: this.$nuxt.context.env.AnconAPI,
            walletconnectProvider: provider,
            from: accounts[0],
          },
          withIpfs: {
            gateway: 'https://ipfs.infura.io',
            api: this.$nuxt.context.env.IPFS,
          },
        })
      } catch (e) {
        console.error(e)
      }
      await this.createDefaults(accounts)

      await this.localBlocks()
      await this.subscribeTopics()

      this.Ancon = new AnconProtocolClient(
        this.walletconnect,
        this.walletconnect.accounts[0]
      )

      this.Ancon.initialize()
    }
    // Subscribe to accounts change
    provider.on('accountsChanged', bootstrap)

    // Subscribe to chainId change
    provider.on('chainChanged', window.location.reload)

    this.walletconnect = provider

    this.connect()
  },
  provide: function () {
    return {
      getWalletconnect: () => this.walletconnect,
      web3: null,
      getDb: this.db,
      incomingSubscriptions: this.onIncoming,
      personalBlocksSubscription: this.onPersonal,
      historySubscription: this.onHistory,
      defaultTopic: this.defaultTopic,
      defaultAddress: this.defaultAddress,
      currentAccountTopic: this.currentAccountTopic,
      getAncon: () => this.Ancon,
    }
  },
  data() {
    return {
      qrDialog: false,
      defaultAddress: '',
      defaultTopic: '',
      currentAccountTopic: null,
      keyexPubsub: null,
      onHistoryCancel: null,
      onPersonalCancel: null,
      onIncomingCancel: null,
      onKeyexCancel: null,
      onKeyex: new Subject(),
      onIncoming: new Subject(),
      onPersonal: new Subject(),
      onHistory: new Subject(),
      db: new ParkyDB('du'),
      walletconnect: new WalletConnectProvider({
        infuraId: '92ed13edfad140409ac24457a9c4e22d',
        rpc: {
          56: this.$nuxt.context.env.BSC_MAINNET,
          97: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
          137: 'https://polygon-rpc.com/',
          80001: 'https://matic-mumbai.chainstacklabs.com',
          1313161554: 'https://mainnet.aurora.dev',
          1313161555: 'https://testnet.aurora.dev',
          100: 'https://rpc.gnosischain.com/',
        },
        chainId: 1,
      }),
      network: '',
      address: '',
      keyExchangeTopic: '',
      clipped: false,
      drawer: false,
      fixed: false,

      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      show: '',
      title: 'du.',
      topics: [
        '0xeeC58E89996496640c8b5898A7e0218E9b6E90cB',
        '0x63e6EdFBA95aB3f0854fE1A93f96FAB1aa04b8Fb', //backup
      ],
    }
  },
  methods: {
    localBlocks: async function () {
      const q = await this.db.queryBlocks$((blocks) => {
        return () => blocks.toArray()
      })

      this.onPersonalCancel = q.subscribe((v) => {
        this.onPersonal.next(v)
      })
    },
    connect: async function () {
      console.log('Connect')
      if (!this.walletconnect.connected) await this.walletconnect.enable()
    },
    disconnect: function () {
      console.log('Disconnect')
      this.walletconnect.disconnect()
    },
    aggregate: async function () {
      const url = $nuxt.context.env.WakuRPC
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'id',
          method: 'post_waku_v2_relay_v1_subscriptions',
          params: [this.topics],
        }),
      })

      setInterval(async () => {
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'id',
            method: 'get_waku_v2_relay_v1_messages',
            params: [this.topics[0]],
          }),
        })
        const messages = await res.json()
        console.log(messages)
      }, 5000)
    },
    createDefaults: async function (accounts) {
      this.defaultAddress = accounts[0]
      this.defaultTopic = `/xdvdigital/1/${this.defaultAddress}/cbor`
      this.keyExchangeTopic = `/xdvdigital/1/${this.defaultAddress}-kex/cbor`
    },
    sign: async function (data) {
      // sign message {signature, digest / hash, }
      const b = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data))
      const res = await this.walletconnect.send({
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_sign',
        params: [this.walletconnect.accounts[0], b],
      })

      const signature = res

      return { digest: b, signature }
    },
    subscribeTopics: async function () {
      const w = EthCrypto.createIdentity()
      const encBlockCodec = {
        name: 'cbor',
        code: '0x71',
        encode: async (obj) => {
          const cipher = await EthCrypto.encryptWithPublicKey(
            w.publicKey,
            hexlify(encode(obj))
          )
          return cipher
        },
        decode: async (buffer) => {
          let cipher
          cipher = await EthCrypto.cipher.parse(decode(buffer))

          const plain = await EthCrypto.decryptWithPrivateKey(
            w.privateKey,
            cipher
          )

          return JSON.parse(plain)
        },
      }
      // @ts-ignore
      const pubsub = await this.db.createTopicPubsub(this.defaultTopic, {
        blockCodec: encBlockCodec,
        canSubscribe: true,
        isKeyExchangeChannel: false,
        // sigKey: w.privateKey, // !!! Very important
        canPublish: true,
        isCRDT: true,
      })
      this.currentAccountTopic = pubsub
      this.onIncomingCancel = pubsub.onBlockReply$.subscribe(async (v) => {
        // @ts-ignore

        await this.db.putBlock(v.decoded.payload)
        this.onIncoming.next(v)
      })

      const blockCodec = {
        name: 'cbor',
        code: '0x71',
        encode: async (obj) => encode(obj),
        decode: (buffer) => decode(buffer),
      }
      // @ts-ignore
      const keyex = (this.keyexPubsub = await this.db.emitKeyExchangePublicKey(
        this.keyExchangeTopic,
        {
          blockCodec,
          isCRDT: true,
          pk: w.privateKey,
          pub: w.publicKey,
        }
      ))
      this.onKeyexCancel = this.keyexPubsub.subscribe((v) => {
        // no op
        this.onIncoming.next(v)
      })


    },
  },
}
</script>
