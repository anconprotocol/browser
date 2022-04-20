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
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <v-toolbar-title
        v-text="title"
        class="font-weight-black display-1"
        @click="home()"
      />
      <v-spacer />

      <v-spacer />

      <v-btn v-if="connected" v-on:click="disconnect">Disconnect </v-btn>
      <v-btn v-if="!connected" v-on:click="connect"> Connect </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
          <!-- <v-img :src="avatar" height="32" max-height="32" width="32" max-width="32" ></v-img> -->

        <v-subheader v-if="connected"
          >          
          <v-row dense
            >
            <v-col xs>Network {{ network.name }}</v-col>

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
        <Nuxt v-if="connected"/>
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <v-row>
        <v-col>&copy; {{ new Date().getFullYear() }} IFESA</v-col>
        <v-col align="right"><a href="privacy">Privacy</a></v-col></v-row
      >
    </v-footer>
    <v-dialog v-model="showConnect" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Connect with</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item @click="signInWithWebAuthn()">
              <v-list-item-avatar>
                <v-icon color="white accent-4">mdi-fingerprint </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Smartphone</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="connect()">
              <v-list-item-avatar>
                <v-img src="wc.svg"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>WalletConnect</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange accent-4" text @click="showConnect = false">
            Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import WalletConnectProvider from '@walletconnect/web3-provider'
import "reflect-metadata";
import * as hashicon from 'hashicon'
import { base58btc } from 'multiformats/bases/base58'

import { ethers } from 'ethers'
import { ParkyDB } from 'parkydb'
import AnconProtocolClient from '../lib/AnconProtocol/AnconProtocolClient'
import { Subject } from 'rxjs'
import { decode, encode } from 'cbor-x'
import { defaultResolvers } from 'parkydb/src/resolvers'
import VueQrcode from '@chenfengyuan/vue-qrcode'
const PromiseFileReader = require('promise-file-reader')
import EthCrypto from 'eth-crypto'
import { v4 as uuidv4 } from 'uuid'
//@ts-ignore
import { WebauthnHardwareClient } from 'parkydb/lib/core/webauthnClient'
import { WebauthnHardwareAuthenticate } from 'parkydb/lib/core/webauthnServer'
import Web3 from 'web3'
import { toUtf8String } from '@ethersproject/strings'
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
      this.canSignTransaction = true
      try {
        this.network = await web3provider.getNetwork()
        await this.db.initialize({
          graphql: { resolvers: defaultResolvers },
          enableSync: true,
          wakuconnect: {
            bootstrap: { peers: [$nuxt.context.env.WakuLibp2p] },
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

      this.connected = this.walletconnect.connected
      this.showConnect = false
      
    }
    // Subscribe to accounts change
    provider.on('accountsChanged', bootstrap)

    // Subscribe to chainId change
    provider.on('chainChanged', window.location.reload)

    this.walletconnect = provider
  },
  mounted: function () {
    
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
      defaultAddress: () => this.defaultAddress,
      currentAccountTopic: this.currentAccountTopic,
      canSignTransaction: this.canSignTransaction,
      connected:() => this.connected,
      getAncon: () => this.Ancon,
    }
  },
  data() {
    return {
      avatar: null,
      connected: false,
      showConnect: false,
      canSignTransaction: true,
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
    bootstrap: async function () {
      const web3provider = new ethers.providers.Web3Provider(
        new Web3(this.$nuxt.context.env.BSC_MAINNET).currentProvider
      )
      // read only
      // create new identity for waku messaging
      const identity = EthCrypto.createIdentity()
      // this.address = identity.address
      this.canSignTransaction = false

      try {
        // this.network = await web3provider.getNetwork()
        await this.db.initialize({
          graphql: { resolvers: defaultResolvers },
          enableSync: true,
          wakuconnect: {
            bootstrap: { peers: [$nuxt.context.env.WakuLibp2p] },
          },
          withWallet: {
            password: '', /// Not used
          },
          withWeb3: {
            provider: web3provider,
            defaultAddress: identity.address,
          },       
          withIpfs: {
            gateway: 'https://ipfs.infura.io',
            api: this.$nuxt.context.env.IPFS,
          },
        })
      } catch (e) {
        console.error(e)
      }
    },
    signInWithWebAuthn: async function () {
      try {
        // @ts-ignore
        const fido2server = new WebauthnHardwareAuthenticate()
        fido2server.initialize({
          rpId: this.$nuxt.context.env.WebAuthn,
          rpName: 'du.',
          rpIcon: '',
         // attestation: 'direct',
          authenticatorRequireResidentKey: false,
          authenticatorUserVerification: 'required',
   ///       cryptoParams: [-257],
        })

        await this.bootstrap()
        // Fido2 client settings, user is the user address + origin
        const fido2client = new WebauthnHardwareClient(fido2server, this.db)
        const origin = window.location.origin

        let didacct
        let didkey
        let pubkey
        let jwk
        const uid = uuidv4()
        const mess = ethers.utils.toUtf8Bytes(
          'Sign-in with a FIDO2 WebAuthn device'
        )
        const res = await fido2client.registerSign(
          origin,
          uid,
          uid,
          mess,
          async ({ publicKey, publicKeyJwk, prevCounter }) => {
            pubkey = publicKey
            jwk = publicKeyJwk
            didkey = base58btc.encode(publicKey)
            didacct = {
              did: `did:key:${didkey}`,
            }
          },
          false
        )
        let i = hashicon(didkey, 100).toDataURL()

        // @ts-ignore
        await this.db.putBlock({
          cid: didacct.did,
          address: didacct.did,
          kind: 'Fido2IdentityBlock',
          image: i,
          uid,
          type: 'did',
          publicKeyJwk: jwk,
          pubkey: didkey,
          digest: ethers.utils.sha256(mess),
          signature: res.signature,
          // authenticatorData: res.authenticatorData,
          // clientData: res.clientDataJSON.,
          owner: didacct.did,
          name: didacct.did,
          description: 'did key generated from webauthn device',
        })

        this.network = 'did-key'
        this.defaultAddress = this.address = didacct.did

        await this.createDefaults([this.address])

        await this.localBlocks()
        await this.subscribeTopics()

        this.connected = true
        this.showConnect = false
      } catch (e) {
        console.error(e)
        
      }
    },
    connect: async function () {
      if (!this.walletconnect.connected) {
        await this.walletconnect.enable()
      }
    },
    disconnect: async function () {
      console.log('Disconnect')
      this.walletconnect.disconnect()
      location.reload()
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
    home: function () {
      window.location.href = '/'
    },

    subscribeTopics: async function () {
      this.avatar = hashicon(this.defaultAddress, 32).toDataURL()

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
        isCRDT: false,
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
          isCRDT: false,
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
