<template>
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
        image/png"
          v-bind:files="files"
          v-on:addfile="upload"
        />
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
    ><v-row>
      <v-col dense v-for="v in items" :key="v[0]">
        <v-card class="mx-auto" max-width="360">
          <v-img :src="v.document.image" height="200px"></v-img>

          <v-card-title>
            {{ v.document.name }}
          </v-card-title>

          <v-card-subtitle>
            {{ v.document.owner }}
          </v-card-subtitle>
          <v-card-text>{{ v.document.owner }}</v-card-text>
          <v-card-actions>
            <!-- <v-bottom-sheet v-model="privacySheet">
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
<v-icon>{{ tile.img }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet> -->
            <v-bottom-sheet v-model="shareSheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="orange lighten-2"
                  v-show="v.document.kind === 'StorageAsset'"
                >
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-subheader>Share</v-subheader>
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

                <v-list-item
                  v-for="tile in shareTiles"
                  :key="tile.title"
                  @click="tile.click(v.cid)"
                >
                  <v-list-item-avatar>
                    <v-icon color="orange lighten-2">{{ tile.img }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet>
            <v-bottom-sheet v-model="exportSheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  color="orange lighten-2"
                  v-show="v.document.kind === 'StorageAsset'"
                >
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
                    <v-icon color="orange lighten-2">{{ tile.img }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet>

            <!-- <v-bottom-sheet v-model="mintSheet">
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
                    <v-icon>{{ tile.img }}</v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-bottom-sheet> -->

            <v-spacer></v-spacer>

            <v-btn icon @click="historyBlocks(v.cid)">
              <v-icon>{{
                show ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show" v-if="historyItems">
              <v-divider></v-divider>
              <v-card-text>
                History
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
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
    <v-alert type="info" v-if="this.items < 1 && !loading">
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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { QrcodeCapture } from 'vue-qrcode-reader'
//@ts-ignore
import { CUFEBuilder } from '../cufe'
import { BrowserQRCodeReader } from '@zxing/browser'

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
  lastValueFrom,
  map,
  merge,
  of,
  Subject,
  tap,
  timestamp,
} from 'rxjs'
import { getPredefinedBootstrapNodes } from 'js-waku'
import { ethers } from 'ethers'
import Dexie, { liveQuery, Table } from 'dexie'
import helper from '~/utils/helper'
import AnconProtocolClient from '~/lib/AnconProtocol/AnconProtocolClient'
import { v4 as uuidv4 } from 'uuid'
import Web3 from 'web3'
import {
  getWhatsAppClickToChatLink,
  shareTextToWhatsApp,
  shareTextViaNativeSharing,
} from 'share-text-to-whatsapp'

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
  snackbar = false
  snackbarText = ''
  privacySheet = false
  exportSheet = false
  shareSheet = false
  mintSheet = false
  privacyTiles = [
    {
      img: 'mdi-certificate',
      title: 'W3C Verified Credentials',
      click: (cid) => {
        this.privacySheet = false
      },
    },
  ]
  exportTiles = [
    {
      title: 'Anchor data asset',
      img: 'mdi-note-plus',
      click: (cid) => {
        this.exportSheet = false
        this.$nextTick(() => {
          this.postBlockToAncon(cid)
        })
      },
    },
    {
      title: 'Mint',
      img: 'mdi-transition-masked',
      click: (cid) => {
        this.exportSheet = false
      },
    },
    {
      img: 'mdi-swap-horizontal',
      title: 'Mint and sell',
      click: (cid) => {
        this.exportSheet = false
      },
    },
  ]
  shareTiles = [
    {
      img: 'mdi-message',
      title: 'Send asset',
      click: (cid) => {
        this.shareSheet = false
        this.$nextTick(() => {
          this.pushAssetToTopic(cid)
        })
      },
    },
    // {
    //   img: 'inbox.png',
    //   title: 'Telegram',
    //   click: (cid) => {
    //     this.shareSheet = false
    //   },
    // },
    {
      img: 'mdi-whatsapp',
      title: 'Whatsapp',
      click: (cid) => {
        this.shareSheet = false
        this.$nextTick(() => {
          this.sendTextToWhatsapp(cid)
        })
      },
    },
  ]
  mintTiles = []
  result = ''
  selected: any
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
  show: any = false
  items: any = []
  files = []
  selectedFile: any = {}
  defaultAddress: any
  db: any
  // @ts-ignore
  historySubscription: Subject<any>
  // @ts-ignore
  personalBlocksSubscription: Subject<any>
  // @ts-ignore
  incomingSubscriptions: Subject<any>
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

  menu = false
  contacts = [
    '0xeeC58E89996496640c8b5898A7e0218E9b6E90cB',
    '0x63e6EdFBA95aB3f0854fE1A93f96FAB1aa04b8Fb', //backup
    '0xc932911a1aaC9BA60FDcbe77045364A8170B7558',
  ]
  x = 0
  search = null
  y = 0

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
    // sign message
    const { signature, digest } = await this.sign(
      JSON.stringify(model.document)
    )
    const block = {
      ...model.document,
      image: cidFromIpfs.image,
      kind: 'StorageBlock',
      signature,
      digest,
      timestamp: new Date().getTime(),
      issuer: this.defaultAddress,
    }

    // @ts-ignore
    //    const shareCid = await this.getDb.ipfs.uploadFile(block)

    this.shareSheet = false
    setTimeout(() => {
      const data = {
        message: model.document.name,
        title: `Sharing data asset from du. app`,
        url: block.image,
      } as any

      shareTextViaNativeSharing(data, () => {
        const lnk = getWhatsAppClickToChatLink(`
      Sharing data asset from du. app
      ${data.url}
      `)

        this.add(cid, `Shared whatsapp message`, this.defaultAddress, block)
        this.snackbarText = `Asset succesfully sent to ${this.selectedRecipient}`
        this.snackbar = true

        window.open(lnk, '_blank')
      })
    }, 50)
  }

  async pushAssetToTopic(cid: string) {
    this.shareSheet = false
    this.snackbarText = `Sending asset to ${this.selectedRecipient}...`
    this.snackbar = true
    const blockCodec = {
      name: 'cbor',
      code: '0x71',
      encode: async (obj) => encode(obj),
      decode: (buffer) => decode(buffer),
    }

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
      issuer: this.defaultAddress,
    }

    // @ts-ignore
    const kex = await this.getDb.requestKeyExchangePublicKey(
      `/xdvdigital/1/${this.selectedRecipient}-kex/cbor`,
      {
        blockCodec,
      }
    )

    const sub = this.incomingSubscriptions.subscribe(async (res: any) => {
      // @ts-ignore
      const pubsub = await this.getDb.createTopicPubsub(
        `/xdvdigital/1/${this.selectedRecipient}/cbor`,
        {
          blockCodec,
          canPublish: true,
          canSubscribe: true,
          encryptionPubKey: res.encryptionPublicKey,
        }
      )
      //TODO: encryption public key caching
      // @ts-ignore
      this.add(
        cid,
        `Sent message to ${this.selectedRecipient}`,
        this.defaultAddress,
        block
      )

      // @ts-ignore
      pubsub.publish(block)
      this.snackbarText = `Asset succesfully sent to ${this.selectedRecipient}`
      this.snackbar = true

      pubsub.close()
      sub.unsubscribe()
    })
  }

  async sign(data: any) {
    this.loading = true
    this.loadingText = this.signingLoadingText
    const b = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data))

    const res = await this.getWalletconnect().send({
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [this.getWalletconnect().accounts[0], b],
    })

    const signature = res

    this.loading = false
    this.loadingText = this.defaultLoadingText
    return { digest: b, signature }
  }
  async postBlockToAncon(cid: string) {
    this.exportSheet = false
    this.snackbarText = 'Exporting to Ancon Node...'
    this.snackbar = true
    const model = await (this as any).getDb.get(cid)

    // @ts-ignore

    const did = await this.getDb.ancon.createDid()
    // @ts-ignore

    const dagblock = await this.getDb.ancon.createDagBlock({
      // @ts-ignore
      message: model.document,
      topic: 'xdvdigital',
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
  async createDocumentNode(_file) {
    try {
      // setLoading(true);
      // setStatus(2);
      let uuid = uuidv4()

      // //Initializing Ancon instance
      // setMintingStatus("Checking if account is enrolled...");

      // const getKeyRes = await getKey(address)

      // if (!getKeyRes) {
      //   //  setMintingStatus(
      //   //    "An enrollment error has ocurred",
      //   //    error.message
      //   //  );
      //   throw new Error(
      //     `Enrollment error, visit ${process.env.REACT_APP_ANCON_TOOLS_URL} to enroll.`
      //   )
      // }
      //Subiendo archivo de imagen a Ancon Node
      // setMintingStatus("Uploading file to Ancon nodes...");

      const uploadFileRes = await this.anconUploadFile(_file)

      if (uploadFileRes.error) {
        // setMintingStatus("An error has ocurred", uploadFileRes.error);
        throw new Error(`Error. ${uploadFileRes.error}`)
      }

      // setMintingStatus("Requesting Ancon metadata creation...");

      //Create metadata

      // const anconMetadataObject = await anconCreateMetadata(
      //   uploadFileRes,
      //   address,
      //   uuid,
      //   _file
      // );
      // console.log("ancon", anconMetadataObject);
      // setMintingStatus("Creando transacción en la blockchain...");

      const { AnconNFTContract, AnconTokenContract } = helper.getContracts(
        this.getWalletconnect()
      )

      const bob = AnconNFTContract.defaultAccount

      // const getDagResponse = await fetch(
      //   `${anconAPIurl}/v0/dag/${anconMetadataObject.proofCid}/`
      // );

      // if (getDagResponse.status === 400) {
      //   throw new Error("Metadata error. 400 Bad Request.");
      // }
      // const getDagResponseJSON = await getDagResponse.json();
      // setMintingStatus("Waiting for approval of blockchain funds...");

      // let allowed = await AnconTokenContract.methods
      //   //@ts-ignore
      //   .allowance(bob, AnconNFTContract._address)
      //   .call()
      // console.log('allowed', allowed)
      const serviceFee = await AnconNFTContract.methods
        .serviceFeeForContract()
        .call()

      const max_amount = Web3.utils.toWei('100000', 'ether').toString()

      // if (allowed == '0' && serviceFee != '0') {
      //   let gasAmount = await AnconTokenContract.methods
      //     //@ts-ignore
      //     .approve(AnconNFTContract._address, max_amount)
      //     .estimateGas({ from: bob })

      //   await AnconTokenContract.methods
      //     //@ts-ignore
      //     .approve(AnconNFTContract._address, max_amount)
      //     .send({
      //       gas: gasAmount,
      //       from: bob,
      //     })
      //   console.log('allowed')
      // }

      // setMintingStatus("Minting...");
      const royalty2 = 0
      const params = [
        bob, //user address
        uuid, //static uuid
        royalty2, //royalty fee percent from 0 to 10000, 1 = 0.01%, 10000 = 100.00%
      ]
      const gasAmount = await AnconNFTContract.methods
        .mint(...params)
        .estimateGas({ from: bob })

      const txmint = await AnconNFTContract.methods.mint(...params).send({
        gas: gasAmount,
        from: bob,
      })

      // setMintingStatus("Ending...");

      // const currentBlock = await web3Provider.eth.getBlockNumber();

      // const response = await AnconNFTContract.getPastEvents(
      //   "Transfer",
      //   {
      //     toBlock: "latest",
      //     fromBlock: currentBlock - 10,
      //     filter: {
      //       from: "0x0000000000000000000000000000000000000000",
      //       //this line to get the ones from a specific address
      //       to: address,
      //     },
      //   }
      // );

      // const blockItem = response.reverse()[0];

      // await sleep(11000);
      // const getUpdatedDagRes = await fetch(
      //   `${anconAPIurl}/v0/topics?topic=uuid:${uuid}&from=${indexerAddress}`
      // );

      // const getUpdatedDagResJSON = await getUpdatedDagRes.json();

      // setStatus(3);
      // setLoading(false);

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

      // setStep(true);
    } catch (e) {
      // setStatus(4);
      // setModal(true);
      // setMintingStatus(e.message);
      // setLoading(false);
      console.log(e)
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

  async historyBlocks(cid) {
    this.show = !this.show
    // @ts-ignore
    const q = await this.getDb.getBlocksByTableName$('history', (h) => {
      return () => h.where({ cid: cid }).toArray()
    })

    q.subscribe((value) => {
      if (value.length > 0) this.historyItems = value[0].refs.slice(0, 5)
    })
  }

  async bindSubscriptions() {
    this.topic = this.defaultTopic
    this.personalBlocksSubscription.subscribe({
      next: async (value: any) => {
        const p = value.filter(
          (x) =>
            x.document.kind == 'StorageAsset' ||
            x.document.kind == 'StorageBlock'
        )

        this.loading = false
        this.items = await Promise.all(p)
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
  }
  async mounted() {
    this.loading = true
    const walletconnect = (this as any).getWalletconnect()

    // walletconnect.on('accountsChanged', () => this.bindSubscriptions)
    await this.bindSubscriptions()
  }
}
</script>
