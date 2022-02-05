<template>
  <v-container>
    <v-row>
      <v-col class="text-center" cols="6">
        <v-file-input
          show-size
          accept="image/*"
          counter
          v-model="selected"
          @change="loadInvoice"
          label="QR Factura"
        ></v-file-input>
      </v-col>
      <v-col class="text-center" cols="6">
        <v-card class="mx-auto">
          <v-img
            class="white--text align-end"
            v-bind:src="invoiceQRImage"
            ref="invoice"
            max-height="220"
          >
            <v-card-title>{{ invoiceQr }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0" v-if="cufe.chFE"
            >CUFE {{ cufe.chFE }}
            <v-icon v-if="cufe.verified" large color="darken-3 green"
              >mdi-certificate</v-icon
            >
          </v-card-subtitle>
          <!-- 
          <v-card-text class="text--primary">
            <div>Whitehaven Beach</div>

            <div>Whitsunday Island, Whitsunday Islands</div>
          </v-card-text> -->

          <v-card-actions>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="blue-grey"
              class="ma-2 white--text"
              @click="openDGI"
            >
              Descargar Auxiliar de Factura (DGI)
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-file-input
          show-size
          counter
          accept="image/*"
          v-model="selectedCedula"
          @change="scanCedula"
          label="QR Cedula"
        ></v-file-input>
      </v-col>
      <v-col class="text-center" cols="6">
        <v-card class="mx-auto">
          <v-img
            class="white--text align-end"
            v-bind:src="cedulaQRImage"
            ref="cedula"
            max-height="220"
          >
            <v-card-title>{{ cedulaQr }}</v-card-title>
          </v-img>
          <v-card-subtitle class="pb-0"> {{ cedulaId.name }} </v-card-subtitle>

          <v-card-text class="text--primary" v-if="cedulaId.id">
            <div>{{ cedulaId.id }}</div>
            <div>Exipira {{ cedulaId.expiration }}</div>
            <div>Emitida en {{ cedulaId.province }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center" cols="6">
        <v-file-input
          show-size
          accept="application/pdf"
          counter
          v-model="selectedCafe"
          label="CAFE"
          @change="readCAFE"
        ></v-file-input>
      </v-col>
      <v-col class="text-center" cols="6">
        <v-card class="mx-auto">
          <v-card-subtitle class="pb-0"> </v-card-subtitle>
          
          <v-card-text class="text--primary" v-if="cafeModel.issuer.ruc">
            <div>Emitida por {{ cafeModel.issuer.name }} ({{ cafeModel.issuer.ruc }} DV {{ cafeModel.issuer.dv }})</div>
            <div>Direccion {{ cafeModel.issuer.address }}</div>
            <div>{{ cafeModel.recipient.type }} {{ cafeModel.recipient.name }} ({{ cafeModel.recipient.ruc }}) </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center" cols="12">
        <v-card class="mx-auto">
          <v-card-subtitle class="pb-0" v-if="cedulaId.id === cafeModel.recipient.ruc"> Verificacion exitosa </v-card-subtitle>
          <v-card-subtitle class="pb-0" v-if="cedulaId.id !== cafeModel.recipient.ruc"> Factura no concuerda con cedula de identidad </v-card-subtitle>

          <v-card-actions>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="blue-grey"
              class="ma-2 white--text"
              @click="openMintNFT"
            >
              Certificar como Documento Verificable
            </v-btn>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="blue-grey"
              class="ma-2 white--text"
              @click="openMintNFT"
            >
              Certificar como NFT
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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

@Component({
  components: {
    QrcodeCapture,
  },
})
export default class Scan extends Vue {
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
  cafeModel = {issuer: {}, recipient: {},}

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
      }
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
}
</script>
