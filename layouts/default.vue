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
          >Network {{ network.name }} Address
          {{
            `${address.substring(0, 6)}...${address.substring(
              address.length - 6
            )}`
          }}</v-subheader
        >
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
import Web3 from 'web3'
import { ParkyDB } from 'parkydb'
import AnconProtocolClient from '../lib/AnconProtocol/AnconProtocolClient'
import { map, merge, Subject, tap, timestamp } from 'rxjs'
import { decode, encode } from 'cbor-x'
import Dexie, { liveQuery, Table } from 'dexie'
import getTransaction from '../lib/AnconProtocol/GetTransaction'
import loadImage from 'blueimp-load-image'
import { SiweMessage } from 'siwe'
// import { generatePrivateKey, getPublicKey } from 'js-waku'

const PromiseFileReader = require('promise-file-reader')

export default {
  name: 'DefaultLayout',
  Ancon: AnconProtocolClient,
  created: async function () {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      infuraId: '92ed13edfad140409ac24457a9c4e22d',
      rpc: { 56: 'https://bsc-dataseed.binance.org/' },
      chainId: 1,
    })
    const web3provider = new ethers.providers.Web3Provider(provider)

    // Subscribe to accounts change
    provider.on('accountsChanged', async (accounts) => {
      this.address = accounts[0]

      try {
        const domain = window.location.host
        const origin = window.location.origin

        this.network = await web3provider.getNetwork()

        const message = new SiweMessage({
          domain,
          address: this.address,
          statement: 'Sign in with Ethereum to the app.',
          uri: origin,
          version: '1',
          chainId: this.network.chainId,
        })
        const siweMessage = message.prepareMessage()
        const { digest, signature } = await this.sign(siweMessage)

        const verifyRes = await fetch(
          `${$nuxt.context.env.AnconAPI}siwe/verify`,
          {
            body: JSON.stringify({
              message: siweMessage,
              signature,
            }),
            method: 'POST',
          }
        )

        const result = await verifyRes.json()
        const pubkey = result.publicKey
        await this.db.initialize({
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
            autoLogin: true,
            password: 'zxcvb', /// TODO! Remove this, use ephemeral enc keys
          },
          withWeb3: {
            provider: web3provider,
            pubkey: pubkey,
            //      pubkeySig: pubkey[3],
            defaultAddress: accounts[0],
          },
          withAncon: {
            pubkey: pubkey,
            api: $nuxt.context.env.AnconAPI,
            walletconnectProvider: provider,
            from: accounts[0],
          },
          withIpfs: {
            gateway: 'https://ipfs.infura.io',
            api: 'https://ipfs.infura.io:5001',
          },
        })
        this.pubkey = pubkey
      } catch (e) {
        console.error(e)
      }
      await this.createDefaults(accounts)

      await this.localBlocks()
      await this.subscribeTopics()
    })

    // Subscribe to chainId change
    provider.on('chainChanged', async (chainId) => {
      this.network = await web3provider.getNetwork()
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
    })

    this.walletconnect = provider
    //  Enable session (triggers QR Code modal)
    this.walletconnect.connected ? null : await this.walletconnect.enable()

    //    this.web3Provider = new ethers.providers.Web3Provider(web3.currentProvider)
    // this.web3Provider = web3.currentProvider

    // console.log(this.web3Provider)

    this.Ancon = new AnconProtocolClient(
      this.walletconnect,
      this.walletconnect.accounts[0]
    )

    this.Ancon.initialize()
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
      db: new ParkyDB(),
      walletconnect: new WalletConnectProvider({
        infuraId: '92ed13edfad140409ac24457a9c4e22d',
        rpc: {
          56: 'https://bsc-dataseed.binance.org/',
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
      pubkey: '',
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
    connect: function () {
      console.log('Connect')
      this.walletconnect.enable()
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
      const w = ethers.Wallet.createRandom()
      const blockCodec = {
        name: 'cbor',
        code: '0x71',
        encode: async (obj) => encode(obj),
        decode: (buffer) => decode(buffer),
      }
      // @ts-ignore
      const pubsub = await this.db.createTopicPubsub(this.defaultTopic, {
        blockCodec,
        canSubscribe: true,
        isKeyExchangeChannel: false,
        sigKey: w.privateKey, // !!! Very important
        canPublish: true,
        isCRDT: true,
      })
      this.currentAccountTopic = pubsub
      this.onIncomingCancel = pubsub.onBlockReply$.subscribe(async (v) => {
        // @ts-ignore
        await this.db.putBlock(v.decoded.payload)
        this.onIncoming.next(v)
      })
      // @ts-ignore
      const keyex = (this.keyexPubsub = await this.db.emitKeyExchangePublicKey(
        this.keyExchangeTopic,
        {
          blockCodec,
          isCRDT: true,
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
