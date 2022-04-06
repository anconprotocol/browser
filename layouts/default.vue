<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
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
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="pink">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-row v-if="this.walletconnect.connected">
        <div>Network {{ network }}</div>
        <v-spacer />
        <div>Address {{ address }}</div>
        <v-spacer />
      </v-row>

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
import { map, merge, tap, timestamp } from 'rxjs'
import { decode, encode } from 'cbor-x'

export default {
  name: 'DefaultLayout',
  Ancon: AnconProtocolClient,
  mounted: async function () {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      rpc: { 56: 'https://bsc-dataseed.binance.org/' },
      chainId: 56,
    })

    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts) => {
      this.address = accounts[0]
    })

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId) => {
      this.network = chainId
      //  console.log(chainId)
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
    })

    this.walletconnect = provider
    //  Enable session (triggers QR Code modal)
    await provider.enable()

    //    this.web3Provider = new ethers.providers.Web3Provider(web3.currentProvider)
    // this.web3Provider = web3.currentProvider

    // console.log(this.web3Provider)

    this.db = new ParkyDB()
    const peer =
      '/dns4/waku.did.pa/tcp/8000/wss/p2p/16Uiu2HAmN96WgFsyepE3tLw67i3j6BdBo3xPF6MQ2hjmbaW5TUoB'
    try {
      //   const trans = await this.Ancon.getTransaction()

      //   // the pubkey from ancon
      //   const getPubKey = await this.Ancon.getPubKey(trans)

      //   const pubkey = getPubKey[2]
      // Configure and load ParkyDB
      if (localStorage.getItem('xdv:keyring_exists') === 'true') {
      }
      await this.db.initialize({
        wakuconnect: {
          bootstrap: { peers: [peer] },
        },
        withWallet: {
          autoLogin: true,
          password: 'zxcvb',
          seed: ethers.Wallet.createRandom().mnemonic.phrase,
        },
      })
    } catch (e) {
      console.error(e)
    }

    await this.createDefaultTopic()
    await this.aggregate([])
  },
  provide: function () {
    return {
      getWalletconnect: () => this.walletconnect,
      web3: null,
      getDb: () => this.db,
      getDefaultTopics: () => this.topics,
      getDefaultAddress: () => this.walletconnect.accounts[0],
    }
  },
  data() {
    return {
      db: new ParkyDB(),
      walletconnect: new WalletConnectProvider({
        rpc: { 56: 'https://bsc-dataseed.binance.org/' },
        chainId: 56,
      }),
      network: '56',
      address: '',
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
      title: 'xdv.digital [codename everdid]',
      topics: [
        '0xeeC58E89996496640c8b5898A7e0218E9b6E90cB',
        '0x63e6EdFBA95aB3f0854fE1A93f96FAB1aa04b8Fb', //backup
      ],
    }
  },
  methods: {
    connect: function () {
      console.log('Connect')
      this.walletconnect.enable()
    },
    disconnect: function () {
      console.log('Disconnect')
      this.walletconnect.disconnect()
    },
    aggregate: async function (topics) {
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
    createDefaultTopic: async function () {
      const blockCodec = {
        name: 'cbor',
        code: '0x71',
        encode: async (obj) => encode(obj),
        decode: (buffer) => decode(buffer),
      }

      const w = await this.db.getWallet()

      const accountA = (await w.getAccounts())[0]
      const defaultTopic = `/xdvdigital/1/${accountA}/cbor`

      // const pubsub = await this.db.createChannelPubsub(defaultTopic, {
      //   from: accountA,
      //   middleware: {
      //     incoming: [tap()],
      //     outgoing: [tap()],
      //   },
      //   blockCodec,
      // })
    },
  },
}
</script>
