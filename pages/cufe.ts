// @ts-nocheck
import moment from 'moment'
import { Matches, IsInt, IsEnum, IsDate, IsString } from 'class-validator'
const checkdigit = require('checkdigit')
import {
  CUFE,
  RucType,
  TipoAmbiente,
  TipoEmision,
  TipoRuc,
} from 'ifesa-dgi-factura-electronica'

export class CUFEBuilder {
  cufeSequence = '0'.repeat(64)
  constructor(private cufe?: CUFE) {}

  fromCUFE(raw: string) {
    // raw = 'FE
    // 01
    // 2
    // 0000000346-266-7647
    // 0-13S5372022013100000641580020315161596221'
    raw = raw.substring(2)
    const tipoDocumento = raw.substring(0, 2)
    const tipoContribuyente = raw.substring(2, 3)
    const ruc = raw.substring(3, 23)
    const dv = raw.substring(23, 26)
    const codSucursal = raw.substring(26, 30)
    const fechaEmision = raw.substring(30, 38)
    const nrodf = raw.substring(38, 48)
    const ptofac = raw.substring(48, 51)
    const tipoEmis = raw.substring(51, 53)
    const iAmb = raw.substring(53, 54)
    const securityCode = raw.substring(54, 63)
    const cufeSequence = [
      tipoDocumento,
      tipoContribuyente,
      ruc,
      dv,
      codSucursal,
      fechaEmision,
      nrodf,
      ptofac,
      tipoEmis,
      iAmb,
      securityCode,
    ].join('')
    const mod10 = this.asciify(cufeSequence)
    const digit = checkdigit.mod10.create(mod10)
    return {
      cufe: cufeSequence,
      dv: digit,
      verified: raw === cufeSequence + digit,
    }
  }
  /**
   * turns to ascii
   * @param val
   */
  asciify(val: string) {
    //@ts-ignore
    let arr = []
    for (let i = 0; i < val.length; i++) {
      let char = parseInt(val.charAt(i), 10)
      if (
        ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(
          val.charAt(i)
        ) === -1
      ) {
        char = val.charCodeAt(i)
      }

      if (char > 9) {
        //@ts-ignore
        arr = [parseInt(char.toFixed().substring(1, 2), 10), ...arr]
      } else {
        //@ts-ignore
        arr = [char, ...arr]
      }
    }
    return arr.reverse().join('')
  }

  /**
   * creates a cufe
   * @param securityCode security code
   */
  create(securityCode?: any) {
    // securityCode = securityCode || Math.floor(Math.random()*10e8);
    // tipo documento
    const tipoDocumento = this.cufe.iDoc.toString().padStart(2, '0')

    // tipo contribuyente
    const tipoContribuyente = this.cufe.dTipoRuc.toString()

    // ruc
    const ruc = this.cufe.dRUC.dRuc

    // dv
    const dv = this.cufe.dRUC.dDV.padStart(this.cufe.dRUC.dDV.length + 1, '-')

    // cod sucursal
    const codSucursal = this.cufe.dSucEm.padStart(4, '0')

    // fecha
    const fechaEmision = moment(this.cufe.dFechaEm).format('YYYYMMDD')

    // nro df
    const nrodf = this.cufe.dNroDF.padStart(10, '0')

    // ptr fac
    const ptofac = this.cufe.dPtoFacDF.padStart(3, '0')
    const tipoEmis = this.cufe.iTpEmis.padStart(2, '0')
    // const dseg = Math.floor(Math.random()*10e8);

    this.cufeSequence = [
      tipoDocumento,
      tipoContribuyente,
      ruc,
      dv,
      codSucursal,
      fechaEmision,
      nrodf,
      ptofac,
      tipoEmis,
      this.cufe.iAmb,
      securityCode,
    ].join('')

    const mod10 = this.asciify(this.cufeSequence)
    const digit = checkdigit.mod10.create(mod10)

    return { cufe: this.cufeSequence, dv: digit }
  }
}
