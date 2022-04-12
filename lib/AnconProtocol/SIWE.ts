import { ethers } from 'ethers'
import { SiweMessage } from 'siwe'

export class Siwe {
  address: any
  constructor(private walletconnect: any, private api: string) {
    this.address = this.walletconnect.accounts[0]
  }

  async getSIWEPublicKey() {
    const web3provider = new ethers.providers.Web3Provider(
      this.walletconnect
    )

    const network = await web3provider.getNetwork()
    const domain = window.location.host
    const origin = window.location.origin

    const message = new SiweMessage({
      domain,
      address: this.address,
      statement: 'Sign in with Ethereum to the app.',
      uri: origin,
      version: '1',
      chainId: network.chainId,
    })
    const siweMessage = message.prepareMessage()
    const { digest, signature } = await this.sign(siweMessage)
    const verifyRes = await fetch(`${this.api}siwe/verify`, {
      body: JSON.stringify({
        message: siweMessage,
        signature,
      }),
      method: 'POST',
    })
    const result = await verifyRes.json()
    return result.publicKey
  }

  async sign(data) {
    // sign message {signature, digest / hash, }
    const b = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data))
    const res = await this.walletconnect.send({
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [this.walletconnect.accounts[0], b],
    })

    const signature = res

    return { digest: b, signature }
  }
}
