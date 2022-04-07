<template>
  <v-container fluid>
    <div></div>
    <v-row>
      <v-col cols="6">
        <v-breadcrumbs :items="steps">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
      <v-col align="right"> </v-col
    ></v-row>
    <v-row>
      <v-col>
        <file-pond
          name="test"
          ref="pond"
          label-idle="Drop files here..."
          v-bind:allow-multiple="false"
          accepted-file-types="image/jpeg, image/png"
          server="/api"
          v-bind:files="files"
          v-on:processfile="upload"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col dense v-for="v in items" :key="v[0]">
        <v-card class="mx-auto" max-width="344">
          <v-img :src="v.document.image" height="200px"></v-img>

          <v-card-title>
            {{ v.document.name }}
          </v-card-title>

          <v-card-subtitle>
            {{ v.document.description }}
          </v-card-subtitle>

          <v-card-actions>
            <v-bottom-sheet v-model="privacySheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="orange lighten-2">
                  <v-icon>mdi-shield-key</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-subheader>Privacy</v-subheader>
                <v-list-item
                  v-for="tile in privacyTiles"
                  :key="tile.title"
                  @click="tile.click(v.cid)"
                >
                  <v-list-item-avatar>
                    <v-avatar size="32px" tile>
                      <img
                        :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                        :alt="tile.title"
                      />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet>
            <v-bottom-sheet v-model="shareSheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="orange lighten-2">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-subheader>Share</v-subheader>
                <v-list-item
                  v-for="tile in shareTiles"
                  :key="tile.title"
                  @click="tile.click(v.cid)"
                >
                  <v-list-item-avatar>
                    <v-avatar size="32px" tile>
                      <img
                        :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                        :alt="tile.title"
                      />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet>
            <v-bottom-sheet v-model="exportSheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="orange lighten-2">
                  <v-icon>mdi-export-variant</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-subheader>Export</v-subheader>
                <v-list-item
                  v-for="tile in exportTiles"
                  :key="tile.title"
                  @click="tile.click(v.cid)"
                >
                  <v-list-item-avatar>
                    <v-avatar size="32px" tile>
                      <img
                        :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                        :alt="tile.title"
                      />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet>

            <v-bottom-sheet v-model="mintSheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="orange lighten-2">
                  <v-icon>mdi-collage</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-subheader>Mint</v-subheader>
                <v-list-item
                  v-for="tile in mintTiles"
                  :key="tile.title"
                  @click="mintSheet = false"
                >
                  <v-list-item-avatar>
                    <v-avatar size="32px" tile>
                      <img
                        :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                        :alt="tile.title"
                      />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet>

            <v-spacer></v-spacer>

            <v-btn
              v-if="historyItems && historyItems[v.cid] != undefined"
              icon
              @click="showHistory(v.cid)"
            >
              <v-icon>{{
                show ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div
              v-show="show"
              v-if="historyItems && historyItems[v.cid] != undefined"
            >
              <v-divider></v-divider>
              <v-card-text>
                History
                <v-timeline align-top dense>
                  <v-timeline-item
                    v-for="message in messages.refs"
                    :key="message.time"
                    :color="message.color"
                    small
                  >
                    <div>
                      <div class="font-weight-normal">
                        <strong>{{ message.from }}</strong> @{{
                          message.time | formatDate
                        }}
                      </div>
                      <div>{{ message.message }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
    <v-alert type="info" v-if="this.items < 1">
      There is no documents yet. Add a document.</v-alert
    >
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { QrcodeCapture } from 'vue-qrcode-reader'
//@ts-ignore
import { CUFEBuilder } from '../cufe'
import { BrowserQRCodeReader } from '@zxing/browser'
import loadImage from 'blueimp-load-image'
import * as reader from 'promise-file-reader'
//@ts-ignore
import BarcodeDetector from 'barcode-detector'
import { decode, encode } from 'cbor-x'
import 'pdfjs-dist/legacy/build/pdf.worker.entry'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.js'
import { BlockValue, DAGJsonService, ParkyDB } from 'parkydb'
const PromiseFileReader = require('promise-file-reader')

import { StorageAsset } from '../documentModel'
// Import Vue FilePond
import vueFilePond from 'vue-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { map, merge, of, tap, timestamp } from 'rxjs'
import { getPredefinedBootstrapNodes } from 'js-waku'
import { ethers } from 'ethers'
import Dexie, { liveQuery, Table } from 'dexie'
import helper from '~/utils/helper'
import AnconProtocolClient from '~/lib/AnconProtocol/AnconProtocolClient'
import getTransaction from '../../lib/AnconProtocol/GetTransaction'

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)

@Component({
  components: {
    QrcodeCapture,
    FilePond,
  },
  inject: [
    'getDb',
    'web3',
    'getWalletconnect',
    'getDefaultTopics',
    'getDefaultAddress',
    'getAncon',
  ],
})
export default class Personal extends Vue.extend({
  filters: {
    formatDate: (date: Date) => Intl.DateTimeFormat('us-EN').format(date),
  },
}) {
  snackbar = false
  snackbarText = ''
  privacySheet = false
  exportSheet = false
  shareSheet = false
  mintSheet = false
  privacyTiles = [
    {
      img: 'keep.png',
      title: 'Android Hardware Sign',
      click: (cid) => {
        this.privacySheet = false
      },
    },
    {
      img: 'inbox.png',
      title: 'iOS Hardware Sign',
      click: (cid) => {
        this.privacySheet = false
      },
    },
    {
      img: 'hangouts.png',
      title: 'W3C Verified Credentials',
      click: (cid) => {
        this.privacySheet = false
      },
    },
  ]
  exportTiles = [
    {
      img: 'keep.png',
      title: 'Ancon',
      click: (cid) => {
        this.exportSheet = false
        this.postBlockToAncon(cid)
      },
    },
    {
      img: 'inbox.png',
      title: 'IPFS',
      click: (cid) => {
        this.exportSheet = false
      },
    },
    {
      img: 'hangouts.png',
      title: 'Filecoin',
      click: (cid) => {
        this.exportSheet = false
      },
    },
  ]
  shareTiles = [
    {
      img: 'keep.png',
      title: 'Ancon Browser',
      click: async (cid) => {
        this.pushAssetToTopic(cid)
      },
    },
    {
      img: 'inbox.png',
      title: 'Telegram',
      click: (cid) => {
        this.shareSheet = false
      },
    },
    {
      img: 'hangouts.png',
      title: 'Whatsapp',
      click: (cid) => {
        this.shareSheet = false
      },
    },
  ]
  mintTiles = [
    {
      img: 'keep.png',
      title: 'Ancon Marketplace',
      click: (cid) => {
        this.mintSheet = false
      },
    },
    {
      img: 'inbox.png',
      title: 'Opensea',
      click: (cid) => {
        this.mintSheet = false
      },
    },
    {
      img: 'hangouts.png',
      title: 'Rarible',
      click: (cid) => {
        this.mintSheet = false
      },
    },
  ]
  messages = [
    {
      from: 'You',
      message:
        'Cross chain duplicated document on Ancon Marketplace 0x541d8c31947c56697c29a11381f3ea17dff0334c2639b4bf796c4aa6f0e1c016 ',
      time: '10:59am',
      color: 'deep-purple lighten-1',
    },
    {
      from: 'You',
      message:
        'Minted document on OpenSea 0x7cb3e26b09c10236ead75765ba1320a4113a587077d812850e02acb9af8fb8ad ',
      time: '10:55am',
      color: 'deep-purple lighten-1',
    },
    {
      from: 'You',
      message: 'Shared document with Bob',
      time: '10:50am',
      color: 'deep-purple lighten-1',
    },
    {
      from: 'Bob',
      message: `Liked the document`,
      time: '10:42am',
      color: 'green',
    },
    {
      from: 'You',
      message: 'Shared document with Bob',
      time: '10:37am',
      color: 'deep-purple lighten-1',
    },
    {
      from: 'You',
      message: 'Uploaded asset to personal',
      time: '9:47am',
      color: 'deep-purple lighten-1',
    },
  ]
  result = ''
  selected: any
  loading = false
  invoiceQr = ''
  steps = [
    {
      text: 'Dashboard',
      disabled: false,
      href: '/',
    },
    {
      text: 'Personal',
      disabled: true,
      href: 'breadcrumbs_link_2',
    },
  ]
  show: any = false
  items: any = []
  files = []
  selectedFile: any = {}
  address: any
  db: any
  pubsub: any
  topic = ''
  getWalletconnect: any
  historyItems: any = {}
  Ancon: AnconProtocolClient | undefined
  // getWalletconnect(): any {}
  // @ts-ignore
  // getWalletconnect(): any {}
  // @ts-ignore
  // getWalletconnect(): any {}
  // @ts-ignore
  // getWalletconnect(): any {}
  // @ts-ignore

  async fetchItems() {
    const uri = `https://api.ancon.did.pa/v0/topics?topic=@uuidIndexMainnet&from=0x6502781e4024D1FeBaBc8CdD18fA74f4e1954651`
    const res = await fetch(uri)
    const output = await res.json()
    this.items = Object.entries(output.content).filter(
      (v: any, k: any) => v[1].currentOrderHash
    )
  }

  async handleFilePondInit() {}
  async upload(err, file) {
    this.selectedFile = file.file

    const payload = {
      name: this.selectedFile.name,
      kind: 'StorageAsset',
      owner: '',
      sources: [],
      description: '',
      timestamp: new Date().getTime(),
      image: await PromiseFileReader.readAsDataURL(file.file),
    } as StorageAsset

    // @ts-ignore
    let { id, model } = await this.db.putBlock(payload, {
      kind: 'StorageAsset',
      topic: this.topic,
    })

    if (!!model) {
      // @ts-ignore
      model = await this.db.get(id)
    }

    console.log(model)
  }

  async pushAssetToTopic(cid: string) {
    this.shareSheet = false
    this.snackbarText = 'Sending image   to Luis Sanchez'
    this.snackbar = true
    const model = await this.db.get(cid, null)
    // const b64 = await PromiseFileReader.readAsDataURL(model.document.image)
    // model.document.image = b64

    // sign message {signature, digest / hash, }z
    const { signature, digest } = await this.sign(
      JSON.stringify(model.document)
    )

    const block = {
      ...model.document,
      kind: 'StorageBlock',
      signature,
      digest,
      timestamp: new Date().getTime(),
      issuer: this.getWalletconnect().accounts[0],
    }

    const defaultTopic = `/xdvdigital/1/${
      this.getWalletconnect().accounts[0]
    }/cbor`
    // @ts-ignore
    const url = $nuxt.context.env.WakuRPC
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'id',
        method: 'post_waku_v2_relay_v1_message',
        params: [
          this.getWalletconnect().accounts[0],
          {
            payload: ethers.utils.hexlify(encode(block)),
            timestamp: block.timestamp,
            contentTopic: defaultTopic,
          },
        ],
      }),
    })
    const output = await res.json()
    this.add(
      cid,
      'Push Asset to Topic',
      this.getWalletconnect().accounts[0],
      output
    )

    this.snackbarText = 'Image succesfully sent'
    this.snackbar = true
  }

  async sign(data: any) {
    // sign message {signature, digest / hash, }
    const b = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data))

    const res = await this.getWalletconnect().send({
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [this.getWalletconnect().accounts[0], b],
    })

    const signature = res

    return { digest: b, signature }
  }
  async postBlockToAncon(cid: string) {
    this.exportSheet = false
    this.snackbarText = 'Exporting to Ancon Node...'
    this.snackbar = true
    const model = await (this as any).getDb().get(cid)

    // @ts-ignore

    const did = await this.createAnconDid({
      // @ts-ignore
      api: $nuxt.context.env.AnconAPI,
      chainId: 'bnb',
      from: this.getWalletconnect().accounts[0],
    })

    const dagblock = await this.createAnconBlock({
      // @ts-ignore
      api: $nuxt.context.env.AnconAPI,
      chainId: 'bnb',
      message: model.document,
      topic: 'xdvdigital',
      from: this.getWalletconnect().accounts[0],
    })
    this.add(
      cid,
      'Publish to ipfs',
      this.getWalletconnect().accounts[0],
      dagblock
    )

    this.snackbarText = 'Finished export to Ancon Node'
    this.snackbar = true
  }

  async createAnconBlock(options: any) {
    const { signature, digest } = await this.sign(
      JSON.stringify(options.message)
    )
    const payload = {
      path: '/',
      from: `did:ethr:${options.chainId}:${options.from}`,
      signature,
      topic: options.topic,
      data: options.message,
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
    const rawResponse = await fetch(`${options.api}/v0/dag`, requestOptions)

    return rawResponse.json()
  }

  async mintAsset(cid: string) {
    const model = await (this as any).getDb().get(cid, null)

    // sign message {signature, digest / hash, }

    // const block = {
    //   ...model.document,
    //   kind: 'StorageBlock',
    //   signature,
    //   digest,
    //   timestamp: new Date().getTime(),
    //   issuer,
    // }

    // putBlock VerifiableStorageBlock { network: 'did:ethr:bnbt' }
  }
  async subscribeTopics() {
    const w = await this.db.getWallet()

    const accountA = (await w.getAccounts())[0]

    // default topic
    //@ts-ignore
    // this.topic = `/xdvdigital/1/${accountA}/cbor`

    const blockCodec = {
      name: 'cbor',
      code: '0x71',
      encode: async (obj: any) => encode(obj),
      decode: (buffer: any) => decode(buffer),
    }
    const pubsub = await this.db.aggregate([this.topic], {
      from: accountA,
      middleware: {
        incoming: [tap()],
        outgoing: [map((v: BlockValue) => v.document)],
      },
      blockCodec,
    })

    // if (this.pubsub != null) this.pubsub.unsubscribe()
    this.pubsub = pubsub

    this.pubsub.onBlockReply$.subscribe((block) => {
      if (block.topic == this.topic) {
        console.log(block)
      }
    })
  }

  async showHistory(_cid) {
    this.show = !this.show
    this.messages = this.historyItems[_cid]
  }

  async add(_cid, _action, _user, metadata) {
    const model = await (this as any).getDb().db.history.get({ cid: _cid })

    const event = {
      message: _action,
      time: new Date().getTime(),
      from: _user,
      metadata,
    }
    const init = {
      cid: _cid,
      refs: [event],
    }
    if (model) {
      const update = {
        cid: _cid,
        refs: [...model.refs, event],
      }
      ;(this as any).getDb().db.history.update(_cid, update)
    } else {
      ;(this as any).getDb().db.history.put(init)
    }
  }

  async createAnconDid(options) {
    const w = this.getWalletconnect().accounts[0]
    let from = options.from

    const trans = await getTransaction(w, this.getWalletconnect())
    const pubkey = await (this as any).getAncon().getPubKey(trans)

    //Hasta aqui logré que funcionada el code
    const base58Encode = ethers.utils.base58.encode(pubkey[2])
    const message = `#Welcome to Ancon Protocol!

    For more information read the docs https://anconprotocol.github.io/docs/

    To make free posts and gets to the DAG Store you have to enroll and pay the service fee

    This request will not trigger a blockchain transaction or cost any gas fees.
    by signing this message you accept the terms and conditions of Ancon Protocol
    `
    const { signature } = await this.sign(message)
    const payload = {
      ethrdid: `did:ethr:${options.chainId}:${from}`,
      pub: base58Encode,
      signature: signature,
      message: message,
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
    const rawResponse = await fetch(`${options.api}/v0/did`, requestOptions)
    return rawResponse.json()
  }

  async mounted() {
    const db = (this as any).getDb()
    const walletconnect = (this as any).getWalletconnect()
    const defaultTopics = (this as any).getDefaultTopics()
    const defaultAddress = (this as any).getDefaultAddress()
    const Ancon = (this as any).getAncon()

    console.log(walletconnect.connected)

    this.topic = `/xdvdigital/1/0xeeC58E89996496640c8b5898A7e0218E9b6E90cB/cbor`

    const peer =
      '/dns4/waku.did.pa/tcp/8000/wss/p2p/16Uiu2HAmN96WgFsyepE3tLw67i3j6BdBo3xPF6MQ2hjmbaW5TUoB'
    // await this.walletconnect.enable()
    // const url = 'http://waku.did.pa:8545'
    // await fetch(url, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     jsonrpc: '2.0',
    //     id: 'id',
    //     method: 'post_waku_v2_relay_v1_subscriptions',
    //     params: [[this.topic]],
    //   }),
    // })

    // setInterval(async () => {
    //   const res = await fetch(url, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       jsonrpc: '2.0',
    //       id: 'id',
    //       method: 'get_waku_v2_relay_v1_messages',
    //       params: [[this.topic]],
    //     }),
    //   })
    //   const messages  = await res.json()
    //   console.log(messages)
    // }, 5000)
    await db.initialize({
      wakuconnect: { bootstrap: { peers: [peer] } },
      withWallet: {
        autoLogin: true,
        password: 'zxcvb',
        // seed: ethers.Wallet.createRandom().mnemonic.phrase,
      },
    })

    const obs$ = await db.queryBlocks$((blocks) => {
      return () => blocks.toArray()
    })

    obs$.subscribe(async (i: any) => {
      const p = i.filter((x) => x.document.kind == 'StorageAsset')

      this.items = await Promise.all(p)
      console.log(this.items)
    }, console.error)

    const history = await db.db.history.toArray()

    liveQuery(() => history).subscribe(async (i: any) => {
      let x
      i.forEach((i: any) => {
        x = {
          [i.cid]: { ...i },
          refs: i.refs,
          ...x,
        }
      })
      this.historyItems = x
    }, console.error)

    this.db = db

    await this.subscribeTopics()
  }
}
</script>
