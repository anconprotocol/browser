<template>
  <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-card
    class="mx-auto"
    max-width="344" v-for="(v, k) in items" :key="k"
  >
    <v-img
      :src="v.sources[0]"
      height="200px"
    ></v-img>

    <v-card-title>
      {{ v.name }}
    </v-card-title>

    <v-card-subtitle>
      {{ v.description }} 
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
      >
        Publish
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
  </v-card>
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


@Component({
  components: {
    QrcodeCapture,
  },
})
export default class Personal extends Vue {
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
  items = []

  async fetchItems() {
      const uri = `https://api.ancon.did.pa/v0/topics?topic=@uuidIndexMainnet&from=0x6502781e4024D1FeBaBc8CdD18fA74f4e1954651`;
    const res = await fetch(uri)
    const output = await res.json()
    this.items = output.content;
  }

  async mounted() {
       await this.fetchItems();
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
}
</script>
