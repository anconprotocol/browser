c<template>
  <v-container fluid>
    <div></div>
    <v-row>
      <v-col>
        <file-pond
          name="test"
          ref="pond"
          label-idle="Drop files here..."
          v-bind:allow-multiple="false"
          accepted-file-types="image/jpeg,
        image/png, image/gif, application/pdf"
          v-bind:files="files"
          v-on:addfile="handleUpload"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="10" md="8">
        <v-sheet class="py-4 px-1">
          <v-chip-group active-class="primary--text">
            <v-chip v-for="tag in tags" :key="tag" @click="selectChip(tag)">
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row
      v-show="loading"
      class="fill-height"
      align-content="center"
      justify="center"
    >
      <v-col class="text-subtitle-1 text-center" cols="12">
        {{ loadingText }}
      </v-col>
      <v-col cols="6">
        <v-progress-linear
          color="orange accent-4"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-col> </v-row
    ><v-container fluid>
      <v-card v-show="showMint" class="mx-auto">
        <v-card-title>
          <span class="text-h5">Mint Asset</span>
        </v-card-title>
        <v-card-text>
          NFT ERC-721 Address
          <v-combobox
            v-model="selectedNFTAddress"
            :items="nfts"
            :search-input.sync="search"
            hide-selected
            label="Search for an option"
            persistent-hint
            small-chips
            solo
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{ search }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-list subheader>
            <v-subheader>Mint and marketplaces services available</v-subheader>

            <v-list-item @click="mintAncon(selectedItem.cid)">
              <v-list-item-avatar>
                <v-img src="ancon.svg"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Ancon</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="opensea.svg"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>OpenSea</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="rarible.png"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Rarible</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon color="indigo">mdi-ethereum </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Custom ERC-721</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="orange accent-4"
            text
            @click="handleDisplay('showMint', false)"
          >
            Back
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="showShare" class="mx-auto">
        <v-card-title>
          <span class="text-h5">Share Asset</span>
        </v-card-title>
        <v-card-text>
          Recipient
          <v-combobox
            v-model="selectedRecipient"
            :items="contacts"
            :search-input.sync="search"
            hide-selected
            label="Search for an option"
            persistent-hint
            small-chips
            solo
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{ search }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-list subheader>
            <v-subheader>Share services available</v-subheader>

            <v-list-item @click="sendTextToWhatsapp(selectedItem.cid)">
              <v-list-item-avatar>
                <v-icon color="green accent-4"> mdi-whatsapp </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Whatsapp</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="pushAssetToTopic(selectedItem.cid)">
              <v-list-item-avatar>
                <v-img src="favicon.ico"> </v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>du. secure share</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="sendToAncon(selectedItem.cid)">
              <v-list-item-avatar>
                <v-img src="ancon.svg"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Ancon (anchored data)</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="sendToIpfs(selectedItem.cid)">
              <v-list-item-avatar>
                <v-icon color="teal accent-4">mdi-cube-outline </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>IPFS</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="orange accent-4"
            text
            @click="handleDisplay('showShare', false)"
          >
            Back
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="showProvenanceSigning" class="mx-auto">
        <v-card-title>
          <span class="text-h5">Content authenticity</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item @click="signWithWebAuthn(selectedItem.cid)">
              <v-list-item-avatar>
                <v-icon color="indigo">mdi-fingerprint </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Add Webauthn / Fido2</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="orange accent-4"
            text
            @click="handleDisplay('showProvenanceSigning', false)"
          >
            Back
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="showHistory" class="mx-auto">
        <v-card-title>
          <span class="text-h5">Asset History</span>
        </v-card-title>
        <v-card-text>
          <div v-if="historyItems">
            <v-timeline align-top dense>
              <v-timeline-item
                v-for="message in historyItems"
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
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange accent-4" text @click="openHistory(true)">
            Back
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-show="showInfo" class="mx-auto">
        <v-card-title key="p">
          <span class="text-h5">Asset Information</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-list-item key="cid" two-line>
                <v-list-item-content key="cid-c">
                  <v-list-item-title>Cid</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.meta.cid
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line key="kind">
                <v-list-item-content>
                  <v-list-item-title>Kind</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.document.kind
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line key="ref">
                <v-list-item-content>
                  <v-list-item-title>Reference</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.ref
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line key="owner">
                <v-list-item-content>
                  <v-list-item-title>Owner</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.document.owner
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item> </v-col
            ><v-col>
              <v-list-item two-line key="name">
                <v-list-item-content>
                  <v-list-item-title>Name</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.document.name
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line key="desc">
                <v-list-item-content>
                  <v-list-item-title>Description</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.document.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line key="date">
                <v-list-item-content>
                  <v-list-item-title>Last modified</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.document.timestamp | formatDate
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line key="src">
                <v-list-item-content>
                  <v-list-item-title>Sources</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedInfoItem.document.sources
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item></v-col
            ></v-row
          >
        </v-card-text>
        <v-card-actions key="actions">
          <v-btn color="orange accent-4" text @click="infoAsset(true)">
            Back
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-row dense v-show="showAssets"
        ><v-col v-for="v in items" :key="v.cid">
          <v-card class="mx-auto" max-width="360">
            <v-img
              :src="v.document.image"
              height="200px"
              @click="infoAsset(v)"
            ></v-img>

            <v-card-title>
              {{ v.document.name }}
            </v-card-title>

            <v-card-subtitle>
              {{ getOwner(v.document.owner) }}
            </v-card-subtitle>
            <v-card-text>{{ v.document.description }}</v-card-text>
            <v-card-actions>
              <!-- <v-btn
                icon
                @click="handleDisplay('showProvenanceSigning', true, v)"
                color="orange lighten-2"
                v-show="v.document.kind === 'StorageAsset'"
              >
                <v-icon>mdi-file-certificate</v-icon>
              </v-btn> -->
              <v-btn
                icon
                @click="handleDisplay('showShare', true, v)"
                color="orange lighten-2"
                v-show="v.document.kind === 'StorageAsset'"
              >
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>

              <v-btn
                icon
                @click="handleDisplay('showMint', true, v)"
                color="orange lighten-2"
                v-show="v.document.kind === 'StorageAsset' && canSignTransaction"
              >
                <v-icon>mdi-export-variant</v-icon>
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn icon @click="openHistory(v.cid)">
                <v-icon>{{ 'mdi-history' }}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-alert type="info" v-if="this.items < 1">
      There are no documents yet. Add a document.</v-alert
    >
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Asset</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="selectedEdit.options.description"
                    label="Description"
                    solo-inverted
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="selectedEdit.options.sources"
                    label="Sources (separate by comma)"
                    solo-inverted
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange accent-4" text @click="upload"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { QrcodeCapture, QrcodeStream } from 'vue-qrcode-reader'
import { whatsapp, tw, telegram } from 'vanilla-sharing'

//@ts-ignore
import { WebauthnHardwareClient } from 'parkydb/lib/core/webauthnClient'
import { WebauthnHardwareAuthenticate } from 'parkydb/lib/core/webauthnServer'
//@ts-ignore
import { decode, encode } from 'cbor-x'
import 'pdfjs-dist/legacy/build/pdf.worker.entry'
const PromiseFileReader = require('promise-file-reader')
import { BrowserQRCodeReader } from '@zxing/browser'
import EthCrypto from 'eth-crypto'

import { ERC721Block, IPFSBlock, StorageAsset } from '../documentModel'
// Import Vue FilePond
import vueFilePond from 'vue-filepond'

import FilePondPluginImageFilter from 'filepond-plugin-image-filter'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import {
  async,
  debounce,
  from,
  interval,
  lastValueFrom,
  map,
  mergeMap,
  Subject,
  take,
  takeUntil,
  tap,
  timeout,
} from 'rxjs'

import { Siwe } from '../../lib/AnconProtocol/SIWE'
import { ethers } from 'ethers'
import helper from '~/utils/helper'
import AnconProtocolClient from '~/lib/AnconProtocol/AnconProtocolClient'
import { v4 as uuidv4 } from 'uuid'
import Web3 from 'web3'

import { arrayify, hexlify } from 'ethers/lib/utils'
// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginImageFilter
)

@Component({
  components: {
    QrcodeCapture,
    FilePond,
    QrcodeStream,
  },

  watch: {
    model: {
      handler(val, prev) {
        this.$data.contacts.push(val)

        this.$data.model = val
      },
    },
  },
  inject: [
    'canSignTransaction',
    'getDb',
    'web3',
    'getWalletconnect',
    'defaultTopic',
    'defaultAddress',
    'incomingSubscriptions',
    'personalBlocksSubscription',
    'historySubscription',
    'getAncon',
    'currentAccountTopic',
  ],
})
export default class Personal extends Vue.extend({
  filters: {
    formatDate: (date: Date) => Intl.DateTimeFormat('us-EN').format(date),
  },
}) {
  keys = {
    '': 'StorageAsset',
    'My Assets': 'StorageAsset',
    Received: 'StorageBlock',
    IPFS: 'IpfsBlock',
    Ancon: 'AnconBlock',
    'ERC-721': 'ERC721Block',
    'Identities': 'AddressBlock'
  }
  editItem = {
    description: '',
    sources: '',
  }
  snackbar = false
  snackbarText = ''

  result = ''

  loading = false
  defaultLoadingText = 'Loading...'
  signingLoadingText = 'Please sign and review message using WalletConnect...'
  loadingText = 'Loading...'
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
  tags = ['My Assets', 'Received', 'IPFS', 'Ancon', 'ERC-721']
  selectedChip = ''
  showQRScanner = false
  show: any = false
  dialog: any = false
  items: any = []
  files = []
  selectedFile: any = {}
  selectedInfoItem: any = { document: {}, meta: { ref: '' } }
  defaultAddress: any
  db: any
  // @ts-ignore
  historySubscription: Subject<any>
  // @ts-ignore
  personalBlocksSubscription: Subject<any>
  // @ts-ignore
  incomingSubscriptions: Subject<any>
  // @ts-ignore
  anconNFTsubscription: Subject<any>
  pubsub: any
  topic = ''
  getWalletconnect: any
  historyItems: any = {}
  Ancon: AnconProtocolClient | undefined
  defaultTopic: string = ''
  currentAccountTopic: any
  onAccountTopicIncomingCancel: any
  recipients: boolean = false
  colors = ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange']
  editing = null
  editingIndex = -1
  selectedRecipient = '0xeeC58E89996496640c8b5898A7e0218E9b6E90cB'
  nonce = 0
  selectedNFTAddress = this.$nuxt.context.env.AnconNFT
  menu = false
  contacts = [
    '0xeeC58E89996496640c8b5898A7e0218E9b6E90cB',
    '0x63e6EdFBA95aB3f0854fE1A93f96FAB1aa04b8Fb', //backup
    '0xc932911a1aaC9BA60FDcbe77045364A8170B7558',
  ]
  nfts = [this.$nuxt.context.env.AnconNFT]
  x = 0
  search = null
  y = 0
  editDialog = false
  selectedEdit: any = {
    options: {},
  }
  showInfo: any = false
  showAssets: any = true
  showHistory = false
  showShare: any = false
  selectedItem: any
  showMint: boolean = false
  showProvenanceSigning = false
  canSignTransaction: any
  edit(index, item) {
    if (!this.editing) {
      this.editing = item
      this.editingIndex = index
    } else {
      this.editing = null
      this.editingIndex = -1
    }
  }
  filter(item, queryText, itemText) {
    if (item.header) return false

    const hasValue = (val) => (val != null ? val : '')

    const text = hasValue(itemText)
    const query = hasValue(queryText)

    return (
      text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    )
  }

  async signWithWebAuthn(cid) {
    // this.loading = true
    this.loadingText = this.signingLoadingText

    // @ts-ignore
    const model = await this.getDb.get(cid, null)

    // Fido2 server settings, rp*** is the data asset
    // @ts-ignore
    const fido2server = new WebauthnHardwareAuthenticate({})
    fido2server.initialize({
      rpId: this.$nuxt.context.env.WebAuthn,
      rpName: 'du.',
      rpIcon: '',
      attestation: 'none',
      authenticatorRequireResidentKey: false,
      authenticatorUserVerification: 'required',
    })

    // Fido2 client                                    settings, user is the user address + origin
    // @ts-ignore
    const fido2client = new WebauthnHardwareClient(fido2server, this.getDb)
    const origin = window.location.origin
    // @ts-ignore
    const res = await fido2client.registerSign(
      origin,
      model.cid,
      this.defaultAddress(),
      model.dag.bytes
    )

    this.loading = false
    // this.loadingText = this.defaultLoadingText
    return { digest: '', ...res }
  }

  async fetchAnconTopic(topic, address) {
    const uri = `https://api.ancon.did.pa/v0/topics?topic=${topic}&from=${address}`
    const res = await fetch(uri)
    const output = await res.json()
    this.items = Object.entries(output.content).filter(
      (v: any, k: any) => v[1].currentOrderHash
    )
  }

  async handleFilePondInit() {}

  async handleUpload(err, file) {
    this.selectedFile = file
    this.selectedEdit = {
      options: {
        description: '',
        sources: '',
      },
    }
    if (this.editDialog) {
      this.editDialog = false
    } else {
      this.editDialog = true
    }
  }
  async upload() {
    this.editDialog = false

    const { source } = this.selectedFile
    const payload = {
      name: source.name,
      kind: 'StorageAsset',
      owner: this.defaultAddress(),
      sources: this.selectedEdit.options.sources.split(','),
      description: this.selectedEdit.options.description,
      timestamp: new Date().getTime(),
      image: await PromiseFileReader.readAsDataURL(source),
    } as StorageAsset

    // @ts-ignore
    let { id, model } = await this.getDb.putBlock(payload, {
      kind: 'StorageAsset',
      topic: this.topic,
    })
    if (!!model) {
      // @ts-ignore
      model = await this.getDb.get(id)
    }

    console.log(model)
  }

  async sendTextToWhatsapp(cid: string) {
    // @ts-ignore
    const model = await this.getDb.get(cid, null)

    const fileAsBlob = await fetch(model.document.image)
    const file = await fileAsBlob.blob()

    // @ts-ignore
    const cidFromIpfs = await this.getDb.ipfs.uploadFile(file)
    // // sign message
    // const { signature, digest } = await this.sign(
    //   JSON.stringify(model.document)
    // )
    const block = {
      ...model.document,
      image: cidFromIpfs.image,
      kind: 'StorageBlock',
      // signature,
      // digest,
      timestamp: new Date().getTime(),
      issuer: this.defaultAddress(),
    }

    // @ts-ignore
    //    const shareCid = await this.getDb.ipfs.uploadFile(block)

    this.shareSheet = false

    // const data = {
    //   message: model.document.name,
    //   title: `Sharing data asset from du. app`,
    //   url: block.image,
    // } as any

    whatsapp({
      url: block.image,
      title: `Sharing data asset from du. app`,
      // phone: string,
    })

    this.add(cid, `Shared whatsapp message`, this.defaultAddress(), block)
    this.snackbarText = `Asset succesfully sent to ${this.selectedRecipient}`
    this.snackbar = true
  }

  async pushAssetToTopic(cid: string) {
    try {
      this.loading = true
      this.loadingText = this.signingLoadingText

      this.snackbarText = `Sending asset to ${this.selectedRecipient}...`
      this.snackbar = true
      // @ts-ignore
      const model = await this.getDb.get(cid, null)

      if (model.document.kind !== 'StorageAsset') {
        this.snackbarText = 'Invalid asset, must be stored in personal'
        this.snackbar = true
        return
      }
      const fileAsBlob = await fetch(model.document.image)
      const file = await fileAsBlob.blob()
      // @ts-ignore
      const cidFromIpfs = await this.getDb.ipfs.uploadFile(file)
      // sign message
      const { signature, digest } = await this.signWithWebAuthn(cid)
      const block = {
        ...model.document,
        image: cidFromIpfs.image,
        kind: 'StorageBlock',
        signature,
        // digest,
        timestamp: new Date().getTime(),
        issuer: this.defaultAddress(),
      }
      const blockCodec = {
        name: 'cbor',
        code: '0x71',
        encode: async (obj) => encode(obj),
        decode: (buffer) => decode(buffer),
      }

      // @ts-ignore
      const kex = await this.getDb.requestKeyExchangePublicKey(
        `/xdvdigital/1/${this.selectedRecipient}-kex/cbor`,
        {
          blockCodec,
        }
      )

      const sub = kex.subscribe(async (encryptionPubKey: any) => {
        const encBlockCodec = {
          name: 'cbor',
          code: '0x71',
          encode: async (obj) => {
            const enc = await EthCrypto.encryptWithPublicKey(
              encryptionPubKey as any as any,
              //@ts-ignore
              JSON.stringify(obj)
            )

            const x = await EthCrypto.cipher.stringify(enc)
            return encode(x)
          },
          decode: (buffer) => {
            decode(buffer)
          },
        }
        // @ts-ignore
        const pubsub = await this.getDb.createTopicPubsub(
          `/xdvdigital/1/${this.selectedRecipient}/cbor`,
          {
            blockCodec: encBlockCodec,
            isKeyExchangeChannel: false,
            canPublish: true,
            canSubscribe: true,
          }
        )
        // @ts-ignore
        this.add(
          cid,
          `Sent message to ${this.selectedRecipient}`,
          this.defaultAddress(),
          block
        )

        this.loading = false
        this.loadingText = this.defaultLoadingText
        // @ts-ignore
        pubsub.publish(block)
        this.snackbarText = `Asset succesfully sent to ${this.selectedRecipient}`
        this.snackbar = true

        pubsub.close()
        sub.unsubscribe()
      })
    } catch (e) {
      this.loading = false
      this.showShare = true
      this.snackbarText = `${e}`
      this.snackbar = true
    }
  }

  async sign(data: any) {
    this.loading = true
    this.loadingText = this.signingLoadingText
    const b = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data))

    const res = await this.getWalletconnect().send({
      id: new Date().getTime(),
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [this.getWalletconnect().accounts[0], b],
    })

    const signature = res

    this.loading = false
    this.loadingText = this.defaultLoadingText
    return { digest: b, signature }
  }

  async sendToIpfs(cid: string) {
    try {
      this.snackbarText = 'Uploading to IPFS...'
      this.snackbar = true
      const model = await (this as any).getDb.get(cid)

      const fileAsBlob = await fetch(model.document.image)
      const file = await fileAsBlob.blob()

      // @ts-ignore
      const cidFromIpfs = await this.getDb.ipfs.uploadFile(file)
      // sign message
      const { signature, digest } = await this.signWithWebAuthn(cid)
      const block = {
        ...model.document,
        image: cidFromIpfs.image,
        kind: 'StorageBlock',
        signature,
        // digest,
        timestamp: new Date().getTime(),
        issuer: this.defaultAddress(),
      }

      const body = new FormData()
      body.append('file', JSON.stringify(block))

      const ipfsAddRes = await fetch(
        `${this.$nuxt.context.env.IPFS}api/v0/add?pin=true`,
        {
          body,
          method: 'POST',
        }
      )

      const ipfsAddResJSON = await ipfsAddRes.json()

      const cidipfs = ipfsAddResJSON.Hash

      this.add(cid, 'Publish to ipfs', this.getWalletconnect().accounts[0], {
        cid: cidipfs,
      })

      // @ts-ignore
      await this.getDb.putBlock({
        cid: cidipfs,
        kind: 'IpfsBlock',
        ref: cid,
      } as IPFSBlock)

      this.snackbarText = 'Upload completed'
      this.snackbar = true
    } catch (e) {
      this.loading = false
      this.showShare = true
      this.snackbarText = `${e}`
      this.snackbar = true
    }
  }

  async sendToAncon(cid: string) {
    try {
      this.snackbarText = 'Uploading to Ancon...'
      this.snackbar = true
      const model = await (this as any).getDb.get(cid)
      this.loading = true
      this.loadingText = this.signingLoadingText

      const fileAsBlob = await fetch(model.document.image)
      const file = await fileAsBlob.blob()
      // @ts-ignore
      const cidFromIpfs = await this.getDb.ipfs.uploadFile(file)
      model.document.image = cidFromIpfs.image
      const api = this.$nuxt.context.env.AnconAPI + '/'
      const siwe = new Siwe(this.getWalletconnect(), api)

      const pubkey = await siwe.getSIWEPublicKey()
      const web3provider = new ethers.providers.Web3Provider(
        this.getWalletconnect()
      )
      const network = await web3provider.getNetwork()
      const didacct = {
        ethrdid: `did:ethr:${network.name}:${
          this.getWalletconnect().accounts[0]
        }`,
      }
      // @ts-ignore
      await this.getDb.ancon.createDid(didacct, pubkey, 'Welcome tu du.xdv.digital!')
      // @ts-ignore

      const dagblock = await this.getDb.ancon.createDagBlock(didacct.ethrdid, {
        // @ts-ignore
        message: model.document,
        topic: undefined,
        // topic: 'du.xdv.digital',
      })

      this.add(
        cid,
        'Publish to ancon',
        this.getWalletconnect().accounts[0],
        dagblock
      )

      // @ts-ignore
      await this.getDb.putBlock({
        cid: dagblock.cid,
        // topic: 'du.xdv.digital',
        kind: 'AnconBlock',
        ref: cid,
      })
      this.loading = false
      this.loadingText = this.defaultLoadingText

      this.snackbarText = 'Upload completed'
      this.snackbar = true
    } catch (e) {
      this.loading = false
      this.showShare = true
      console.error(e)
      this.snackbarText = `${e}`
      this.snackbar = true
    }
  }

  async mintAsset(cid: string) {
    const model = await (this as any).getDb.get(cid, null)

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

  /**
   * Uploads a file to Ancon protocole nodes
   * @param {FileListObject} _file filelist object
   * @returns {(Object|Promise)} ancon file post response object
   */
  async anconUploadFile(_file) {
    const content = _file[0]

    const body = new FormData()
    body.append('file', content)

    const ipfsAddRes = await fetch(
      'https://ipfs.infura.io:5001/api/v0/add?pin=true',
      {
        body,
        method: 'POST',
      }
    )

    const ipfsAddResJSON = await ipfsAddRes.json()

    const cid = ipfsAddResJSON.Hash

    const imageUrl = `https://ipfs.io/ipfs/${cid}`
    return {
      image: imageUrl,
      cid: cid,
      error: false,
    }
  }

  /**
   * Initiates the nft upload & mint main process & modal state handling
   * @param {FileListObject} _file uploaded file object
   */
  async mintAncon(cid) {
    try {
      this.showMint = false
      let uuid = uuidv4()

      this.snackbarText = 'Uploading to Ancon...'
      this.snackbar = true

      const account = this.getWalletconnect().accounts[0]
      const { AnconNFTContract, AnconTokenContract, AnconNFTContract_ethers } =
        helper.getContracts(this.getWalletconnect())
      const readOnlyContracts = helper.getContracts(
        new Web3(this.$nuxt.context.env.BSC_MAINNET),
        account
      )

      let fn = await readOnlyContracts.AnconTokenContract.methods
        //@ts-ignore
        .allowance(account, AnconNFTContract._address)
      const allowed = await fn.call()
      console.log('allowed', allowed)
      fn =
        await readOnlyContracts.AnconNFTContract.methods.serviceFeeForContract()
      let serviceFee = await fn.call()

      const max_amount = Web3.utils.toWei('100000', 'ether').toString()

      if (allowed === '0' && serviceFee !== '0') {
        let gasAmount = await AnconTokenContract.methods
          //@ts-ignore
          .approve(AnconNFTContract._address, max_amount)
          .estimateGas({ from: account })

        await AnconTokenContract.methods
          //@ts-ignore
          .approve(AnconNFTContract._address, max_amount)
          .send({
            gas: gasAmount,
            from: account,
          })
        console.log('allowed')
      }

      const model = await (this as any).getDb.get(cid)
      this.loading = true
      this.loadingText = this.signingLoadingText

      const fileAsBlob = await fetch(model.document.image)
      const file = await fileAsBlob.blob()
      // @ts-ignore
      const cidFromIpfs = await this.getDb.ipfs.uploadFile(file)
      model.document.image = cidFromIpfs.image
      const api = this.$nuxt.context.env.AnconAPI + '/'
      this.loadingText = 'Requesting metadata creation...'
      // @ts-ignore
      const dagblock = await this.getDb.ancon.createDagBlock({
        // @ts-ignore
        message: { uuid, ...model.document },
      })

      // @ts-ignore
      await this.getDb.ancon.createDagBlock({
        // @ts-ignore
        message: { uuid, metadata: dagblock.cid },
        topic: '/du.xdv.digital/' + cid + '/metadata/json',
      })
debugger
      this.loadingText = 'Minting...'
      const royalty2 = 0
      const params = [
        account, //user address
        dagblock.cid,
      ]
      const gasAmount = await readOnlyContracts.AnconNFTContract.methods
        .mint(...params)
        .estimateGas({ from: account })
      setTimeout(async () => {
        const tx = await AnconNFTContract_ethers.functions.mint(...params, {
          gasLimit: gasAmount,
          from: account,
        })
      })

      this.add(cid, 'Minted Ancon NFT', account, {
        dagblock,
      })
      this.loadingText = this.defaultLoadingText
      this.loading = false
      this.snackbarText = 'Asset minted as Ancon NFT'
      this.snackbar = true
      this.showMint = true

      // setSuccessData({
      //   ...successData,
      //   txLink:
      //     "https://testnet.bscscan.com/tx/" +
      //     getUpdatedDagResJSON.content.blockchainTxHash,
      //   tokenCid: "",
      //   creatorAddr: address,
      //   imageCid: uploadFileRes.cid,
      //   sourceLink: getUpdatedDagResJSON.content.sources[0],
      //   anconTx: "",
      //   uuidLink: `${anconAPIurl}/v0/topics?topic=uuid:${uuid}&from=${indexerAddress}`,
      //   uuid: uuid,
      // });
    } catch (e) {
      this.loading = false
      this.showMint = true
      this.snackbarText = `${e}`
      this.snackbar = true
    }
  }

  async add(_cid, _action, _user, metadata) {
    const model = await (this as any).getDb.db.history.get({ cid: _cid })

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
      ;(this as any).getDb.db.history.update(_cid, update)
    } else {
      ;(this as any).getDb.db.history.put(init)
    }
  }

  async openHistory(cid) {
    this.showAssets = !this.showAssets
    this.showHistory = !this.showHistory
    this.showMint = false
    this.showShare = false
    this.showInfo = false
    if (this.showHistory) {
      // @ts-ignore
      const q = await this.getDb.getBlocksByTableName$('history', (h) => {
        return () => h.where({ cid: cid }).toArray()
      })

      q.subscribe((value) => {
        if (value.length > 0) this.historyItems = value[0].refs.slice(0, 5)
      })
    }
  }

  async selectChip(selected) {
    this.showAssets = true
    this.showHistory = false
    this.showMint = false
    this.showShare = false
    this.showInfo = false
    this.selectedChip = selected
    // @ts-ignore
    const blocks = await this.getDb.getBlocksByTableName$('blockdb', (b) => {
      return () =>
        b.where({ 'document.kind': this.keys[this.selectedChip] }).toArray()
    })

    const c = blocks.subscribe(async (i) => {
      const loaded = await this.postFilter(i)
      this.items = await Promise.all(loaded)
      c.unsubscribe()
    })
  }
  async postFilter(items) {
    let r = items
    console.log(items)
    if (this.keys[this.selectedChip] === 'IpfsBlock') {
      r = items.map(async (i: any) => {
        try {
          // @ts-ignore
          const ipfsAddRes = await fetch(
            `https://ipfs.infura.io/ipfs/${i.document.cid}`
          )

          const data = await ipfsAddRes.json()
          return { document: data, ...i.document }
        } catch (e) {}
      })
    } else if (this.keys[this.selectedChip] === 'AnconBlock') {
      r = items.map(async (i: any) => {
        try {
          const result = await fetch(
            `${this.$nuxt.context.env.AnconAPI}/v0/dag/${i.document.cid}/`
          )
          const data = await result.json()

          return { document: data.content, ...i.document }
        } catch (e) {}
      })
    } else if (this.keys[this.selectedChip] === 'ERC721Block') {
      r = items.map(async (i: any) => {
        try {
          debugger
          const result = await fetch(
            `${this.$nuxt.context.env.AnconAPI}/v0/dag/${i.document.cid}/`
          )
          const data = await result.json()

          return { document: data.content, ...i.document }
        } catch (e) {}
      })
    }

    return r
  }
  async bindSubscriptions() {
    this.topic = this.defaultTopic

    this.personalBlocksSubscription.subscribe({
      next: async (value: any) => {
        let p = value.filter(
          (x) => x.document.kind === this.keys[this.selectedChip]
        )

        this.postFilter(p)
        this.items = await Promise.all(p)
        this.loading = false
      },
    })

    this.historySubscription.subscribe({
      next: (value: any) => {
        this.historyItems = value.refs.slice(0, 5)
      },
    })

    this.incomingSubscriptions.subscribe({
      next: (block) => {
        // TODO: switch statement or filer by topic
        console.log(`[incoming]`, block)
      },
    })

    if (this.canSignTransaction) {
      const { AnconNFTContract, AnconNFTContract_ethers } = helper.getContracts(
        new Web3(this.$nuxt.context.env.BSC_MAINNET),
        this.getWalletconnect().accounts[0]
      )

      const time$ = interval(9650).pipe(take(25))
      const block = await AnconNFTContract_ethers.provider.getBlockNumber()
      time$
        .pipe(
          mergeMap((i: any) => {
            return AnconNFTContract.getPastEvents('AddMintInfo', {
              filter: { to: this.getWalletconnect().accounts[0] },
              fromBlock: block - i * 2000,
              toBlock: block - (i - 1) * 2000,
            })
          }),
          mergeMap((p) => p)
        )
        .subscribe({
          next: async (tx: any) => {
            //            console.log(tokenUri)
            // TODO: Search by tokenuri
            // @ts-ignore
            await this.getDb.putBlock({
              txid: tx.transactionHash,

              image: tx.returnValues.uri,
              tokenAddress: tx.address,
              tokenId: tx.returnValues.tokenId,
              kind: 'ERC721Block',
              minterAddress: tx.returnValues.creator,
            } as ERC721Block)
          },
        })
    }
  }
  async mounted() {
    const cancel = setTimeout(async () => {
      await this.bindSubscriptions()
      this.loading = false
    }, 1500)
  }

  async handleDisplay(key, show, item) {
    if (!!item) {
      this.selectedItem = item
    }
    this.showProvenanceSigning =
      this.showAssets =
      this.showMint =
      this.showHistory =
      this.showShare =
        false
    this[key] = show
    if (show === false) this.showAssets = true
  }

  async infoAsset(item: any) {
    if (this.showInfo) {
      this.showInfo = false
    } else {
      this.selectedInfoItem = {
        ...item,
        meta: {
          cid: item.cid,
        },
      }
      this.showInfo = true
    }
    this.showAssets = !this.showAssets
  }

  async scanAddress() {
    const codeReader = new BrowserQRCodeReader()
    const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices()

    // choose your media device (webcam, frontal camera, back camera, etc.)
    const selectedDeviceId = videoInputDevices[0].deviceId
    console.log(`Started decode from camera with id ${selectedDeviceId}`)
    // const previewElem = document.querySelector('#test-area-qr-code-webcam > video');
    // you can use the controls to stop() the scan or switchTorch() if available
    const controls = await codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      undefined,
      (result, error, controls) => {
        // use the result and error values to choose your actions
        // you can also use controls API in this scope like the controls
        // returned from the method.
        this.contacts.push(result as any)
      }
    )

    // stops scanning after 20 seconds
    setTimeout(() => controls.stop(), 20000)
  }

  getOwner(address) {
    if (address === this.getWalletconnect().accounts[0]) {
      return `Owned by me`
    } else {
      return `Owned by  ${address.substring(0, 8)}...${address.substring(
        address.length - 8
      )}`
    }
  }
  async decodeQR(cid) {
    return async (res) => {
      this.selectedRecipient = res

      await this.pushAssetToTopic(cid)
    }
  }

  async onScanQR(promise) {
    try {
      await promise
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        this.snackbarText = 'ERROR: you need to grant camera access permission'
      } else if (error.name === 'NotFoundError') {
        this.snackbarText = 'ERROR: no camera on this device'
      } else if (error.name === 'NotSupportedError') {
        this.snackbarText = 'ERROR: secure context required (HTTPS, localhost)'
      } else if (error.name === 'NotReadableError') {
        this.snackbarText = 'ERROR: is the camera already in use?'
      } else if (error.name === 'OverconstrainedError') {
        this.snackbarText = 'ERROR: installed cameras are not suitable'
      } else if (error.name === 'StreamApiNotSupportedError') {
        this.snackbarText = 'ERROR: Stream API is not supported in this browser'
      } else if (error.name === 'InsecureContextError') {
        this.snackbarText =
          'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
      } else {
        this.snackbarText = `ERROR: Camera error (${error.name})`
      }
      this.snackbar = true
    }
  }
}
</script>
