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
            max-height="250"
          >
            <v-card-title>{{ invoiceQr }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0"> {{ cufe }} </v-card-subtitle>
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
            max-height="250"
          >
            <v-card-title>{{ cedulaQr }}</v-card-title>
          </v-img>
          <v-card-subtitle class="pb-0"> Rogelio  Morrell </v-card-subtitle>

          <v-card-text class="text--primary">
            <div>8-713-2230</div>

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
          <v-card-subtitle class="pb-0"> Emitido por Farmacias  Arrochas </v-card-subtitle>
<!-- 
          <v-card-text class="text--primary">
            <div>Whitehaven Beach</div>

            <div>Whitsunday Island, Whitsunday Islands</div>
          </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center" cols="12">
        <v-card class="mx-auto">
          <v-card-subtitle class="pb-0"> Verificacion  exitosa </v-card-subtitle>

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
import { decode } from 'jsonwebtoken'
import { CUFEBuilder } from './cufe'
import { BrowserQRCodeReader } from '@zxing/browser'
import * as reader from 'promise-file-reader'
import BarcodeDetector from 'barcode-detector'

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
  cufe: string
  selectedCedula: any

  async scanInvoice() {
    const codeReader = new BrowserQRCodeReader()
    const el = this.$refs.invoice as any
    const img = BrowserQRCodeReader.prepareImageElement(el.image)
    img.width = 200
    img.height = 200
    const resultImage = await codeReader.decodeFromImageElement(img)

    debugger
  }

  async loadInvoice() {
    if (!this.selected) return
    // const datauri = await reader.readAsDataURL(this.selected)
    this.invoiceQr = this.selected.name
    this.invoiceQRImage = URL.createObjectURL(this.selected)

    // pick barcode formats. Other formats will be ignored
    const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] })
    // directly pass an image element, video element, ...
    const [{ rawValue }] = await barcodeDetector.detect(this.selected)

    this.decode(rawValue)
  }

  async readCAFE() {
    const codeReader = new BrowserQRCodeReader()
  }
  async scanCedula() {
    if (!this.selectedCedula) return
    // const datauri = await reader.readAsDataURL(this.selectedCedula)
    this.cedulaQr = this.selectedCedula.name
    this.cedulaQRImage = URL.createObjectURL(this.selectedCedula)
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

      console.log(fe)
      this.cufe = o.cufe
    }
    console.log(result)
  }
}
</script>
