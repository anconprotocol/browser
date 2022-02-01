<template>
  <v-row>
    <v-col class="text-center">
      <qrcode-capture @decode="onDecode" :capture="selected.value" />
    </v-col>
  </v-row>
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
  selected = ''
  onDecode(result: any) {
    this.result = result

    if (result.indexOf('jwt') > 0) {
      const fe = decode(result.split('jwt')[1].split('=')[1])

      const builder = new CUFEBuilder();
      const o = builder.fromCUFE(fe.chFE)



      console.log(fe)
    }
    console.log(result)
  }
}
</script>
