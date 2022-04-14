import Web3 from 'web3'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
const AnconNFT = require('../contracts/AnconNFT.sol/AnconNFT.json')
const NFTEX = require('../contracts/NFTEX.sol/NFTEX.json')
const AnconToken = require('../contracts/ANCON.sol/ANCON.json')
const AnconProtocol = require('../contracts/AnconProtocol.json')

class helper {
  static getContracts(_provider, account) {
    const web3 = new Web3(_provider)
    web3.eth.defaultAccount = account || _provider.accounts[0]
    const anconNFTContractAddress = $nuxt.context.env.AnconNFT
    const _anconNFTContract = new web3.eth.Contract(
      AnconNFT.abi,
      anconNFTContractAddress
    )

    const web3provider = new ethers.providers.Web3Provider(
      web3.currentProvider    
    )

    const c = new ethers.Contract(
      _anconNFTContract._address,
      AnconNFT.abi,
      web3provider.getSigner()
    )
    // const marketPlaceContractAddress = process.env.REACT_APP_MarketplaceAddress
    // const _marketPlaceContract = new web3.eth.Contract(
    //   NFTEX.abi,
    //   marketPlaceContractAddress
    // )
    const anconTokenContractAddress = $nuxt.context.env.AnconToken
    const _anconTokenContract = new web3.eth.Contract(
      AnconToken.abi,
      anconTokenContractAddress
    )
    // const anconProtocolContractAddress =
    //   process.env.REACT_APP_AnconProtocolAddress
    // const _anconProtocolContract = new web3.eth.Contract(
    //   AnconProtocol.abi,
    //   anconProtocolContractAddress
    // )

    return {
      web3,
      // Wallet: wallet,A
      AnconNFTContract: _anconNFTContract,
      AnconNFTContract_ethers: c,
      // MarketPlaceContract: _marketPlaceContract,
      AnconTokenContract: _anconTokenContract,
      // AnconProtocolContract: _anconProtocolContract,
    }
  }
  // static async getOrderBlockNumber(contracts, tokenId) {
  //   const lastBlock = await contracts.web3.eth.getBlockNumber()
  //   let response = 0
  //   for (let i = 0; i < lastBlock / 5000; i++) {
  //     const sub = i * 4999
  //     const events = await contracts.MarketPlaceContract.getPastEvents(
  //       'MakeOrder',
  //       {
  //         toBlock: lastBlock - sub,
  //         fromBlock: lastBlock - sub - 4999,
  //         filter: {
  //           token: process.env.REACT_APP_AnconNFTAddress,
  //         },
  //       }
  //     )
  //     if (events.length > 0) {
  //       for (const e of events) {
  //         if (e.returnValues.id.toString() == tokenId) {
  //           const owner = await contracts.AnconNFTContract.methods
  //             .ownerOf(e.returnValues.id)
  //             .call()
  //           console.log('owner', owner, 'hash', e.returnValues.hash)
  //           if (owner == process.env.REACT_APP_MarketplaceAddress) {
  //             response = e.blockNumber
  //             i = lastBlock / 5000 + 1
  //             break
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return response
  // }
  static async getSigner(_provider) {
    const web3 = new Web3(_provider)
    web3.eth.defaultAccount = wallet.address
    const ethersInstance = new ethers.providers.Web3Provider(
      web3.currentProvider
    )
    return ethersInstance.getSigner()
  }
  static toHumanDate(_timestamp) {
    const d = new Date(0)
    d.setUTCSeconds(_timestamp)
    return d.toDateString()
  }
}
export default helper
