import Web3 from 'web3'
import {
  LimitOrder,
  LimitOrderBuilder,
  LimitOrderProtocolFacade,
  LimitOrderSignature,
  Web3ProviderConnector,
} from '@1inch/limit-order-protocol'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'

const contractAddress = '0x5fa31604fc5dcebfcac2481f9fa59d174126e5e6'
const walletAddress = '0x4758822de63992df27cacf1ba11417bbacace033'
const chainId = 1

export class CreateLimitOrder {
  connector: Web3ProviderConnector

  constructor(
    private provider: WalletConnectProvider,
    private chainId: any,
    private defaultAddress: string
  ) {
    this.connector = new Web3ProviderConnector(new Web3(provider as any))
  }

  /**
   * 
   * @param options 
   * @returns 
   */
  async fill(options: {
    limitOrder: LimitOrder
    limitOrderSignature: LimitOrderSignature
    makerAmount: string
    takerAmount: string
    thresholdAmount: string
  }) {
    const {
      limitOrder,
      limitOrderSignature,
      makerAmount,
      takerAmount,
      thresholdAmount,
    } = options

    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(
      contractAddress,
      this.connector
    )

    // Create a call data for fill the limit order
    const callData = limitOrderProtocolFacade.fillLimitOrder(
      limitOrder,
      limitOrderSignature,
      makerAmount,
      takerAmount,
      thresholdAmount
    )

    
    // Send transaction for the order filling
    // Must be implemented
    return this.sendTransaction({
      from: walletAddress,
      gas: 210_000, // Set your gas limit
      gasPrice: 40000, // Set your gas price
      to: contractAddress,
      data: callData,
    })
  }
  /**
   * 
   * @param options 
   * @returns 
   */
  async create(options: {
    makerAssetAddress: string
    takerAssetAddress: string
    makerAmount: string
    takerAmount: string
    takerAddress: string
    isPublicSale: boolean
  }) {
    const limitOrderBuilder = new LimitOrderBuilder(
      contractAddress,
      this.chainId,
      this.connector
    )

    const {
      makerAssetAddress,
      takerAssetAddress,
      makerAmount,
      takerAmount,
      takerAddress,
      isPublicSale,
    } = options
    // Create a limit order and it's signature
    const limitOrder = limitOrderBuilder.buildLimitOrder({
      // NFT token address
      makerAssetAddress,
      // USDT token address
      takerAssetAddress,
      // Seller wallet address
      makerAddress: this.defaultAddress,
      takerAddress: isPublicSale ? undefined : takerAddress,
      makerAmount,
      takerAmount,
      predicate: '0x0',
      permit: '0x0',
      interaction: '0x0',
    })
    const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(
      limitOrder
    )
    const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(
      walletAddress,
      limitOrderTypedData
    )

    return {
      limitOrder,
      limitOrderSignature,
      limitOrderTypedData,
    }
  }

  /**
   * 
   * @param data 
   * @returns 
   */
  async sign(data: any) {
    const b = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data))

    const res = await this.provider.send({
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [this.provider.accounts[0], b],
    })

    const signature = res
    return { digest: b, signature }
  }

  /**
   * 
   * @param data 
   * @returns 
   */
  async signTypedData(data: object) {
    // https://docs.walletconnect.com/json-rpc-api-methods/ethereum#eth_signtypeddata
    const res = await this.provider.send({
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_signTypedData',
      params: [this.provider.accounts[0], data],
    })

    return { result: res }
  }

  /**
   * 
   * @param data 
   * @returns 
   */
  async sendTransaction(data: object) {
    // https://docs.walletconnect.com/json-rpc-api-methods/ethereum#eth_sendTransaction
    const res = await this.provider.send({
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_sendTransaction',
      params: [this.provider.accounts[0], data],
    })

    return { result: res }
  }
}
