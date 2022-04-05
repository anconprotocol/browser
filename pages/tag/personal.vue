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
          <v-img :src="v.canvas" height="200px"></v-img>

          <v-card-title>
            {{ v.document.name }}
          </v-card-title>

          <v-card-subtitle>
            {{ v.document.description }}
          </v-card-subtitle>

          <v-card-actions>
            <v-btn
              color="orange lighten-2"
              @click="pushAssetToTopic(v.cid)"
              text
            >
              Push to topic
            </v-btn>
            <v-btn
              color="orange lighten-2"
              @click="pushAssetToTopic(v.cid)"
              text
            >
              Publish
            </v-btn>
            <v-btn
              color="orange lighten-2"
              @click="pushAssetToTopic(v.cid)"
              text
            >
              Mint
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn icon @click="show = !show">
              <v-icon>{{
                show ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>

              <v-card-text>
                You're going to do his laundry? I've got to find a way to
                escape.
                <v-timeline align-top dense>
                  <v-timeline-item
                    v-for="message in messages"
                    :key="message.time"
                    :color="message.color"
                    small
                  >
                    <div>
                      <div class="font-weight-normal">
                        <strong>{{ message.from }}</strong> @{{ message.time }}
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
import { map, merge, tap, timestamp } from 'rxjs'

import { ethers } from 'ethers'

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
  inject: ['db', 'web3', 'walletconnect'],
})
export default class Personal extends Vue {
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
  // @ts-ignore
  walletconnect: any

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
      image: file.file,
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
    const model = await this.db.get(cid, null)
    const b64 = await PromiseFileReader.readAsDataURL(model.document.image)
    model.document.image = b64
    // sign message {signature, digest / hash, }
    const { signature, digest } = await this.sign(model.document)

    const block = {
      ...model.document,
      kind: 'StorageBlock',
      signature,
      digest,
      timestamp: new Date().getTime(),
      issuer: this.walletconnect.accounts[0],
    }
    // putBlock
    const { id, _ } = await this.db.putBlock(block, {
      kind: 'StorageBlock',
      topic: this.topic,
    })
  }

  async sign(data: any) {
    // sign message {signature, digest / hash, }
    const digest = ethers.utils.hashMessage(JSON.stringify(data))

    const res = await this.walletconnect.send({
      id: 1,
      jsonrpc: '2.0',
      method: 'personal_sign',
      params: [digest, this.walletconnect.accounts[0]],
    })

    const signature = res

    return { digest, signature }
  }
  async postBlockToAncon(cid: string, topic: string) {
    const model = await this.db.get(cid, null)

    const { signature, digest } = await this.sign(model.document)
    const block = {
      ...model.document,
      kind: 'StorageBlock',
      signature,
      digest,
      timestamp: new Date().getTime(),
      issuer: this.walletconnect[0],
    }

    // putBlock
    const { id, _ } = await this.db.putBlock(block, {
      kind: 'StorageBlock',
      topic: this.topic,
    })
  }

  async createDid(pubkey: Uint8Array) {
    // encode the pub key
    const base58Encode = ethers.utils.base58.encode(pubkey)

    const message = `#Welcome to Ancon Protocol!

    For more information read the docs https://anconprotocol.github.io/docs/

    To make free posts and gets to the DAG Store you have to enroll and pay the service fee

    This request will not trigger a blockchain transaction or cost any gas fees.
    by signing this message you accept the terms and conditions of Ancon Protocol
    `
    const { signature, digest } = await this.sign(message)

    //post to get the did
    const payload = {
      ethrdid: `did:ethr:${this.walletconnect.chainId}:${this.walletconnect.accounts[0]}`,
      pub: base58Encode,
      signature: signature,
      message: message,
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }

    // fetch
    const rawResponse = await fetch(
      // @ts-ignore
      `${$nuxt.context.env.AnconAPI}/v0/did`,
      requestOptions
    )
    //   json response
    const response = await rawResponse.json()
    return response
  }

  async createAnconBlock(data: any) {
    const { signature, digest } = await this.sign(data)

    const payload = {
      path: '/',
      from: `did:ethr:${this.walletconnect.chainId}:${this.walletconnect.accounts[0]}`,
      signature,
      data,
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }

    // fetch
    const rawResponse = await fetch(
      // @ts-ignore
      `${$nuxt.context.env.AnconAPI}/v0/dag`,
      requestOptions
    )
    //   json response
    const response = await rawResponse.json()
    return response
  }

  async mintAsset(cid: string) {
    const model = await this.db.get(cid, null)

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
  async createTopic() {
    const w = await this.db.getWallet()

    const accountA = (await w.getAccounts())[0]

    // default topic
    //@ts-ignore
    // this.topic = `/xdvdigital/1/${accountA}/dag-json`
    this.topic = `/xdvdigital/1/0xeeC58E89996496640c8b5898A7e0218E9b6E90cB/dag-json`

    // Writes a DAG JSON block
    // const id = await this.db.putBlock({ ...payload, topic })
    const dagjson = new DAGJsonService()
    // // Fetch an existing DAG block
    // const res = await this.db.get(id)
    // debugger
    const blockCodec = {
      name: 'dag-json',
      code: '0x0129',
      encode: async (obj: any) => (await dagjson.build(obj)).bytes,
      decode: (buffer: any) => buffer,
    }
    const pubsub = await this.db.createChannelPubsub(this.topic, {
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
      debugger
      if (block.topic == this.topic) {
        console.log(block)
      }
    })
  }

  async mounted() {
    await this.walletconnect.enable()
    const peer =
      '/dns4/waku.did.pa/tcp/8000/wss/p2p/16Uiu2HAmN96WgFsyepE3tLw67i3j6BdBo3xPF6MQ2hjmbaW5TUoB'

    await this.db.initialize({
      wakuconnect: { bootstrap: { peers: [peer] } },
      withWallet: {
        autoLogin: true,
        password: 'zxcvb',
        // seed: ethers.Wallet.createRandom().mnemonic.phrase,
      },
    })

    const obs$ = await this.db.queryBlocks$((blocks) => {
      return () => blocks.toArray()
    })

    obs$.subscribe(async (i: any) => {
      const p = i
        .filter((x) => x.document.kind == 'StorageAsset')
        .map(async (x: any) => ({
          ...x,
          canvas: await PromiseFileReader.readAsDataURL(x.document.image),
        }))

      this.items = await Promise.all(p)
      console.log(this.items)
    }, console.error)

    await this.createTopic()
  }
}
</script>
