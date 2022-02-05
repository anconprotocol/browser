<template>
  <v-container>
    <v-row>
      <v-col class="text-center" cols="6">
        <v-file-input
          show-size
          accept="image/*"
          counter
          v-model="selected"
          multiple
          label="Archivo"
        ></v-file-input>
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="blue-grey"
          class="ma-2 white--text"
          @click="scanInvoice"
        >
          Leer QR Factura
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-col>
      <v-col class="text-center" cols="6">
        <v-card class="mx-auto">

          <v-card-subtitle class="pb-0"> Number 10 </v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Whitehaven Beach</div>

            <div>Whitsunday Island, Whitsunday Islands</div>
          </v-card-text>

          <v-card-actions >
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="blue-grey"
              class="ma-2 white--text"
              @click="scanInvoice"
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
          v-model="selected"
          multiple
          label="Archivo"
        ></v-file-input>
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="blue-grey"
          class="ma-2 white--text"
          @click="scanCedula"
        >
          Leer QR Cedula
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-col>
      <v-col class="text-center" cols="6">
        <v-card class="mx-auto">

          <v-card-subtitle class="pb-0"> Number 10 </v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Whitehaven Beach</div>

            <div>Whitsunday Island, Whitsunday Islands</div>
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
          v-model="selected"
          multiple
          label="Archivo"
        ></v-file-input>
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="blue-grey"
          class="ma-2 white--text"
          @click="scanInvoice"
        >
          Subir Auxiliar de Factura (CAFE)
          <v-icon right dark> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-col>
      <v-col class="text-center" cols="6">
        <v-card class="mx-auto">

          <v-card-subtitle class="pb-0"> Number 10 </v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Whitehaven Beach</div>

            <div>Whitsunday Island, Whitsunday Islands</div>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center" cols="12">
        <v-card class="mx-auto">
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Top 10 Australian beaches</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0"> Number 10 </v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Whitehaven Beach</div>

            <div>Whitsunday Island, Whitsunday Islands</div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="blue-grey"
              class="ma-2 white--text"
              @click="scanInvoice"
            >
              Certificar como Documento Verificable
            </v-btn>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="blue-grey"
              class="ma-2 white--text"
              @click="scanInvoice"
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
@Component({
  components: {
    QrcodeCapture,
  },
})
export default class Scan extends Vue {
  result = ''
  selected: File | undefined
  loading = false
  onDecode(result: any) {
    this.result = result

    if (result.indexOf('jwt') > 0) {
      const fe = decode(result.split('jwt')[1].split('=')[1])

      const builder = new CUFEBuilder()
      const o = builder.fromCUFE(fe.chFE)

      console.log(fe)
    }
    console.log(result)
  }
}
</script>
