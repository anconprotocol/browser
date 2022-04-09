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
          >Network {{ network }} Address
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

export default {
  name: 'DefaultLayout',
  Ancon: AnconProtocolClient,
  created: async function () {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      rpc: { 56: 'https://bsc-dataseed.binance.org/' },
      chainId: 56,
    })

    // Subscribe to accounts change
    provider.on('accountsChanged', async (accounts) => {
      this.address = accounts[0]
      const peer =
        '/dns4/waku.did.pa/tcp/8000/wss/p2p/16Uiu2HAmN96WgFsyepE3tLw67i3j6BdBo3xPF6MQ2hjmbaW5TUoB'
      try {
        //   const trans = await this.Ancon.getTransaction()

        const trans = await getTransaction(accounts[0], provider)
        const pubkey = await this.Ancon.getPubKey(trans)
        await this.db.initialize({
          wakuconnect: {
            bootstrap: { peers: [peer] },
            libp2p: {
              config: {
                pubsub: {
                  enabled: true,
                  emitSelf: true,
                },
              },
            },
          },
          withWallet: {},
          withWeb3: {
            provider: new ethers.providers.Web3Provider(provider),
            pubkey: pubkey[2],
            pubkeySig: pubkey[3],
            defaultAddress: accounts[0],
          },
        })
      } catch (e) {
        console.error(e)
      }
      await this.createDefaults(accounts)
      //      await this.aggregate()

      this.historyBlocks()
      await this.localBlocks()
      await this.subscribeTopics()
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
      onHistoryCancel: null,
      onPersonalCancel: null,
      onIncomingCancel: null,
      onIncoming: new Subject(),
      onPersonal: new Subject(),
      onHistory: new Subject(),
      db: new ParkyDB(),
      walletconnect: new WalletConnectProvider({
        rpc: { 56: 'https://bsc-dataseed.binance.org/' },
        chainId: 56,
      }),
      network: '',
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
      title: '[el segundo -- p2p data markets -- alpha]',
      topics: [
        '0xeeC58E89996496640c8b5898A7e0218E9b6E90cB',
        '0x63e6EdFBA95aB3f0854fE1A93f96FAB1aa04b8Fb', //backup
      ],
    }
  },
  methods: {
    historyBlocks: async function () {
      const q = await this.db.getBlocksByTableName$('history', (h) => {
        return () => h.toArray()
      })

      this.onHistoryCancel = q.subscribe((v) => {
        this.onHistory.next(v)
      })
    },
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
      const blockCodec = {
        name: 'cbor',
        code: '0x71',
        encode: async (obj) => encode(obj),
        decode: (buffer) => decode(buffer),
      }

      this.defaultAddress = accounts[0]
      this.defaultTopic = `/xdvdigital/1/${this.defaultAddress}/cbor`
    },
    subscribeTopics: async function () {
      // @ts-ignore
      const pubsub = await this.db.createTopicPubsub(this.defaultTopic)
      this.currentAccountTopic = pubsub
      debugger
      this.onIncomingCancel = pubsub.onBlockReply$.subscribe((v) =>
        this.onIncoming.next(v)
      )
    },
  },
}
</script>
