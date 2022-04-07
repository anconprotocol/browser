<template>
  <v-container>
    <v-breadcrumbs :items="steps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card class="mx-auto" max-width="2000">
      <v-row>
        <v-col dense>
          <v-card class="mx-auto" max-width="400" min-height="400">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  PancakeSwap
                </v-list-item-title>
                <v-list-item-subtitle
                  >Sold 51 NFT, 4 currently listed</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col class="text-h2"> $ 1, 000 </v-col>
              </v-row>
            </v-card-text>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-send</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>Publish from personal</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-clock</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle
                >Enabled arbitrage bot $USDC-$ANCON</v-list-item-subtitle
              >
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-alarm</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle
                >Subscribing $ETH > $5000</v-list-item-subtitle
              >
            </v-list-item>
            <v-list class="transparent">
              <v-list-item v-for="item in forecast" :key="item.day">
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn text> View details </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col dense>
          <v-card class="mx-auto" max-width="400" min-height="400">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5"> OpenSea </v-list-item-title>
                <v-list-item-subtitle
                  >Sold 501 NFT, 499 currently listed</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col class="text-h2"> $ 104, 000 </v-col>
              </v-row>
            </v-card-text>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-send</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>Publish from personal</v-list-item-subtitle>
            </v-list-item>

            <v-list class="transparent">
              <v-list-item v-for="item in forecast" :key="item.day">
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn @click="createDocumentNode" text> View Details </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col dense>
          <v-card class="mx-auto" max-width="400" min-height="400">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  Uniswap V3
                </v-list-item-title>
                <v-list-item-subtitle
                  >No NFT marketplace yet</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col class="text-h2"> $ 0 </v-col>
              </v-row>
            </v-card-text>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-send</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>Go to DApp</v-list-item-subtitle>
            </v-list-item>

            <v-list class="transparent">
              <v-list-item v-for="item in forecast" :key="item.day">
                <v-list-item-title>{{ item.day }}</v-list-item-title>

                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-subtitle class="text-right">
                  {{ item.temp }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-card-actions class="mx-auto" height="100">
              <v-btn text> View Details </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { QrcodeCapture } from 'vue-qrcode-reader'
//@ts-ignore
import { decode } from 'jsonwebtoken'
import { CUFEBuilder } from '../cufe'
import { BrowserQRCodeReader } from '@zxing/browser'
import * as reader from 'promise-file-reader'
//@ts-ignore
import BarcodeDetector from 'barcode-detector'
import 'pdfjs-dist/legacy/build/pdf.worker.entry'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.js'
import { ParkyDB } from 'parkydb'
import { v4 as uuidv4 } from 'uuid'
import Web3 from 'web3'
import AnconProtocolClient from '../../lib/AnconProtocol/AnconProtocolClient'
import helper from '../../utils/helper'

const payload = {
  commitHash: 'xg8pyBr3McqYlUgxAqV0t3s6TRcP+B7MHyPTtyVKMJw=',
  contentHash: {
    '/': 'baguqeerahiqryfzwbjc2fn7is4k2uupilwtoxabtb6noifnwxznxszuvrg6a',
  },
  digest: '0x5ab3124ede7a511fbc7c6302b164d1547aefda8b5909b6bb637c7da025c3ffaf',
  height: 207,
  issuer: '0x32A21c1bB6E7C20F547e930b53dAC57f42cd25F6',
  key: 'YW5jb25wcm90b2NvbC91c2Vycy9kaWQ6ZXRocjpibmJ0OjB4MzJBMjFjMWJCNkU3QzIwRjU0N2U5MzBiNTNkQUM1N2Y0MmNkMjVGNi9iYWd1cWVlcmFoaXFyeWZ6d2JqYzJmbjdpczRrMnV1cGlsd3RveGFidGI2bm9pZm53eHpueHN6dXZyZzZh',
  lastBlockHash: {
    '/': 'baguqeeraw4ssfjictj2b47cccep2oioytbjistjke2xuaa35qgdoivtgrwra',
  },
  network: 'anconprotocol',
  parentHash: {
    '/': 'baguqeerakv6jersryhhanjaihmb2ncdujajxt7gpkfzs7rkur7lo4s5uecwa',
  },
  rootKey:
    'YW5jb25wcm90b2NvbC91c2Vycy9kaWQ6ZXRocjpibmJ0OjB4MzJBMjFjMWJCNkU3QzIwRjU0N2U5MzBiNTNkQUM1N2Y0MmNkMjVGNg==',
  signature:
    '0xa628e3e256a187453c55ffbebc189ec4464c6c0d874a278272d224dbbaa4f6f028d3550651c33edf7af0ea8b3f3806d09ba9135034a61dd1a651c67f83cb06a51b',
  timestamp: 1645384767,
  content: {
    blockchainTokenId: '8',
    blockchainTxHash:
      '0x977dd680952c4f7da1040d12a0a2c9e68a60f6158edee20b1591f91372030670',
    creator: '0x32A21c1bB6E7C20F547e930b53dAC57f42cd25F6',
    currentOrderHash: '',
    description: 'me and friends',
    fileExtension: 'jpg',
    image: 'baguqeerar56ywt7p3qbbf6wiqgja5ybvkblz4wx37vyybthr2jl65d657jha',
    name: 'Sweden 90s',
    owner: '0x32A21c1bB6E7C20F547e930b53dAC57f42cd25F6',
    price: '',
    sources: [
      'https://tensta.did.pa/v0/file/baguqeerar56ywt7p3qbbf6wiqgja5ybvkblz4wx37vyybthr2jl65d657jha/',
    ],
    tags: 'Diseño grafico',
    uuid: '854198e4-1c09-4c27-8103-2ae54adfc681',
  },
}

@Component({
  components: {
    QrcodeCapture,
  },
  inject: ['db', 'web3', 'walletconnect'],
})
export default class Public extends Vue {
  bob = new ParkyDB()
  result = ''
  selected: any
  loading = false
  invoiceQr = ''
  cedulaQr = ''
  invoiceQRImage: any
  cedulaQRImage: any
  invoice: any
  cedula: any
  cedulaId = {}
  cufe = {}
  selectedCedula: any
  feURL = ''
  cafeModel = { issuer: {}, recipient: {} }
  db: any
  web3: any
  walletconnect: any

  steps = [
    {
      text: 'Dashboard',
      disabled: false,
      href: '/',
    },
    {
      text: 'Public',
      disabled: true,
      href: 'breadcrumbs_link_2',
    },
  ]

  openDGI() {
    window.open(this.feURL, '_blank')
  }
  async scanInvoice() {
    const codeReader = new BrowserQRCodeReader()
    const el = this.$refs.invoice as any
    const img = BrowserQRCodeReader.prepareImageElement(el.image)
    img.width = 200
    img.height = 200
    const resultImage = await codeReader.decodeFromImageElement(img)
  }

  async loadInvoice() {
    if (!this.selected) return
    this.invoiceQr = this.selected.name
    this.invoiceQRImage = URL.createObjectURL(this.selected)

    const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] })
    const [{ rawValue }] = await barcodeDetector.detect(this.selected)

    this.feURL = rawValue
    setTimeout(() => {
      this.decode(rawValue)
    })
  }

  async readCAFE() {
    const b = await reader.readAsArrayBuffer(this.selectedCafe as any)
    const doc = await getDocument(b as any).promise
    const page = await doc.getPage(1)
    const result = await page.getTextContent()

    const items = result.items
      .filter((i: any) => !i.hasEOL && i.str.length > 1)
      .map((i: any) => i.str)

    this.cafeModel = {
      issuer: {
        name: items[3],
        ruc: items[5],
        dv: items[7],
        address: items[9],
      },
      recipient: {
        type: items[11],
        name: items[13],
        ruc: items[15],
      },
    }
  }
  selectedCafe(selectedCafe: any) {
    throw new Error('Method not implemented.')
  }
  async scanCedula() {
    if (!this.selectedCedula) return
    // const datauri = await reader.readAsDataURL(this.selectedCedula)
    this.cedulaQr = this.selectedCedula.name
    this.cedulaQRImage = URL.createObjectURL(this.selectedCedula)

    setTimeout(async () => {
      const codeReader = new BrowserQRCodeReader()
      const el = this.$refs.cedula as any
      const img = BrowserQRCodeReader.prepareImageElement(el.image)
      const resultImage = await codeReader.decodeFromImageElement(img)

      const items = (resultImage as any).text.split('|')
      this.cedulaId = {
        id: items[0],
        name: `${items[1]} ${items[2]}`,
        dob: items[6],
        province: items[5],
        expiration: items[15],
        issued: items[14],
      }
    })
  }
  async openMintNFT() {
    const codeReader = new BrowserQRCodeReader()
  }

  decode(result: any) {
    this.result = result
    this.cufe = ''

    if (result.indexOf('jwt') > 0) {
      const fe = decode(result.split('jwt')[1].split('=')[1])

      const builder = new CUFEBuilder()
      const o = builder.fromCUFE(fe.chFE)

      this.cufe = { ...fe, ...o }
    }
  }

  async mounted() {
    // const accountB = accounts[0]
    // const id = await this.bob.putBlock(payload)
    // debugger
    // const res = await this.bob.get(id, null)
    // const q = await this.bob.query({
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
    // console.log(q)
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
        this.walletconnect
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
}
</script>
