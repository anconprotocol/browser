<template>
  <v-container>
    <v-tabs color="pink accent-2" right>
      <v-tab>Public</v-tab>
      <v-tab>Share</v-tab>
      <v-tab>Personal</v-tab>
      <v-tab-item v-for="n in 3" :key="n">
        <v-container fluid> </v-container>
      </v-tab-item>
    </v-tabs>
    <v-card max-width="2000" class="mx-auto">
      <v-container>
        <Personal v-if="this.key == 1" />
        <Shared v-if="this.key == 2" />
        <Public v-if="this.key == 3" />
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { QrcodeCapture } from 'vue-qrcode-reader'
//@ts-ignore
import { decode } from 'jsonwebtoken'
import { CUFEBuilder } from './cufe'
import { BrowserQRCodeReader } from '@zxing/browser'
import * as reader from 'promise-file-reader'
//@ts-ignore
import BarcodeDetector from 'barcode-detector'
import 'pdfjs-dist/legacy/build/pdf.worker.entry'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.js'
import { ParkyDB } from 'parkydb'
import Public from './tag/public.vue'
import Personal from './tag/personal.vue'
import Shared from './tag/shared.vue'

@Component({
  components: {
    QrcodeCapture,
    Personal,
    Public,
    Shared,
  },
})
export default class Main extends Vue {
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

  steps = [
    {
      text: 'Dashboard',
      disabled: false,
      href: '/',
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

  async mounted() {}
}
</script>
