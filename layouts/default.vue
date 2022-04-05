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
      <div>Network {{ network }}</div>
      <v-spacer />
      <div>Address {{ address }}</div>
      <!-- <v-btn> Connect </v-btn> -->
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

export default {
  name: 'DefaultLayout',
  Ancon: AnconProtocolClient,
  mounted: async function () {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      infuraId: '92ed13edfad140409ac24457a9c4e22d',
    })
    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts) => {
      console.log(accounts)
      this.address = accounts[0]
    })

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId) => {
      this.network = chainId
      console.log(chainId)
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
    })
    //  Enable session (triggers QR Code modal)
    await provider.enable()

    const web3 = new Web3(window.ethereum)
    //    this.web3Provider = new ethers.providers.Web3Provider(web3.currentProvider)
    this.web3Provider = web3.currentProvider

    console.log(this.web3Provider)

    this.db = new ParkyDB()
    const peer =    '/dns4/waku.did.pa/tcp/8000/wss/p2p/16Uiu2HAmN96WgFsyepE3tLw67i3j6BdBo3xPF6MQ2hjmbaW5TUoB'
    try {
      //   const trans = await this.Ancon.getTransaction()

      //   // the pubkey from ancon
      //   const getPubKey = await this.Ancon.getPubKey(trans)

      //   const pubkey = getPubKey[2]
      // Configure and load ParkyDB
    await this.db.initialize({
        wakuconnect: { bootstrap: { peers: [peer] } },
        withWeb3: {
          provider: this.web3Provider,
          defaultAddress: web3.defaultAccount,
          pubkey: '',
        },
      })
    } catch (e) {
      console.error(e)
    }

    // // @ts-ignore
    // let id = await this.db.putBlock(payload)

    // if (typeof id !== 'string') id = id.cid
    // const res = await this.db.get(id, null)
    // const q = await this.db.query({
    //   cid: id,
    //   query: `
    // query{
    //    block(cid: "${id}") {
    //      network
    //      key
    //    }
    // }
    // `,
    // })
  },
  provide: function () {
    return {
      web3: this.web3Provider,
      db: this.db,
    }
  },
  data() {
    return {
      db: new ParkyDB(),
      web3: '',
      network: '1',
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
    }
  },
}
</script>
