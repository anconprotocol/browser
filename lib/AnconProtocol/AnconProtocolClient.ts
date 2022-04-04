import { ethers } from 'ethers'
import Web3 from 'web3'
import { XDVNFT__factory } from './types/ethers-contracts'
import { AnconProtocol__factory } from './types/ethers-contracts/factories/AnconProtocol__factory'

const AnconToken = require('../../contracts/ANCON.sol/ANCON.json')
declare let window: any

export default class AnconProtocolClient {
  prov: ethers.providers.Web3Provider
  network: ethers.providers.Network | any
  signer: ethers.providers.JsonRpcSigner
  postProofCid: string
  address: string
  provider: any
  anconAddress: string
  daiAddress: string
  xdvnftAdress: string
  provWeb3: Web3
  moniker: string
  url: string

  /**
   * needs to be initiliaze with a provider and an address
   */
  constructor(provider: any, address: string) {
    const url: any = process.env.REACT_APP_ANCON_API_URL
    this.url = url
    this.provider = provider
    this.prov = new ethers.providers.Web3Provider(provider)
    this.provWeb3 = new Web3(provider)
    this.address = address
    this.signer = this.prov.getSigner()
    this.network = ''
    this.postProofCid = ''
    this.anconAddress = ''
    this.daiAddress = ''
    this.xdvnftAdress = ''
    this.moniker = this.provWeb3.utils.keccak256('anconprotocol')
  }

  async initialize() {
    await this.getNetwork()
  }
  /**
   * @returns returns the network the user is in
   */
  async getNetwork() {
    const network = await this.prov.getNetwork()
    this.network = network
    await this.getContractAddresses(network)
  }

  async lookupGatewayUri(propName: any, cid: string) {
    console.log(propName)
    const { services, ...restData } = propName
    try {
      const scheme = services.otroCid
      const urls = this.mapUriSchemeToUrl(scheme, cid)
      return urls
    } catch (error) {
      console.log(error)
      return [`${this.url}/v0/dag/${cid}`]
    }
  }

  async mapUriSchemeToUrl(uriScheme: any, cid: string) {
    const urls = []
    switch (uriScheme) {
      case 'ancon':
        //@ts-ignore
        urls.push(`${this.url}/v0/dag/${cid}`)
        break

      case 'ancon+ipfs':
        urls.push(
          //@ts-ignore
          `${this.url}/v0/dag/${cid}`,
          `https://ipfs.io/api/v0/dag/get?arg=${cid}`
        )
        break
      case 'ipfs':
        //@ts-ignore
        urls.push(`https://ipfs.io/api/v0/dag/get?arg=${cid}`)
        break
    }
    return urls
  }

  async getContractAddresses(network: any) {
    console.log('getting contracts', this.network)
    let anconAddress: any
    let daiAddress: any
    let xdvnftAdress: any
    switch (this.network.chainId) {
      case 56:
        anconAddress = process.env.REACT_APP_AnconProtocolAddress
        daiAddress = process.env.REACT_APP_AnconProtocolAddress
        xdvnftAdress = process.env.REACT_APP_AnconProtocolAddress
        break
      // bnbt
      case 97:
        anconAddress = process.env.REACT_APP_ANCON_bnbt
        daiAddress = process.env.REACT_APP_DAI_bnbt
        xdvnftAdress = process.env.REACT_APP_XDVNFT_bnbt
        break
      // kovan
      case 42:
        anconAddress = process.env.REACT_APP_ANCON_kovan
        daiAddress = process.env.REACT_APP_DAI_kovan
        xdvnftAdress = process.env.REACT_APP_XDVNFT_kovan
        break
      // mumbai
      case 80001:
        anconAddress = process.env.REACT_APP_ANCON_mumbai
        daiAddress = process.env.REACT_APP_DAI_mumbai
        xdvnftAdress = process.env.REACT_APP_XDVNFT_mumbai
        break
    }
    this.anconAddress = anconAddress
    this.daiAddress = daiAddress
    this.xdvnftAdress = xdvnftAdress
    console.log('contracts', anconAddress)
    return {
      ancon: this.anconAddress,
      dai: this.daiAddress,
      xdv: this.xdvnftAdress,
    }
  }
  /**
   *
   * @param address address to get the did from
   * @returns encoded did
   */
  async getDidTransaction() {
    const rawDid = await fetch(
      `${this.url}/v0/did/raw:did:ethr:${this.network.name}:${this.address}`
    )
    const encodedDid = await rawDid.json()
    const content: any = await Object?.values(encodedDid.contentHash)[0]
    encodedDid['content'] = content
    return encodedDid
  }

  async signMessage() {
    const rawDid = await fetch(
      `${this.url}/v0/did/raw:did:ethr:${this.network.name}:${this.address}`
    )
    const encodedDid = await rawDid.json()
    return encodedDid
  }

  /**
   *
   * @param proof the fetch object proof
   * @returns retunrn the to abi Proof
   */
  toAbiProof(proof: any) {
    proof.key = ethers.utils.hexlify(ethers.utils.base64.decode(proof.key))

    proof.value = ethers.utils.hexlify(ethers.utils.base64.decode(proof.value))

    proof.leaf.prefix = ethers.utils.hexlify(
      ethers.utils.base64.decode(proof.leaf.prefix)
    )
    proof.leaf.hash = 1
    proof.path = proof.path.map((x: any) => {
      let suffix
      if (!!x.suffix) {
        suffix = ethers.utils.hexlify(ethers.utils.base64.decode(x.suffix))
        return {
          valid: true,
          prefix: ethers.utils.hexlify(ethers.utils.base64.decode(x.prefix)),
          suffix: suffix,
          hash: 1,
        }
      } else {
        return {
          valid: true,
          prefix: ethers.utils.hexlify(ethers.utils.base64.decode(x.prefix)),
          hash: 1,
          suffix: '0x',
        }
      }
    })
    proof.leaf.prehash_key = 0
    proof.leaf.len = proof.leaf.length
    proof.valid = true
    proof.leaf.valid = true

    return proof
  }

  /**
   *
   * @param transactionHash transaction hash of a normal transfer made by the user
   * @returns an array containing [recoveredAddress, sentAddress, pubkey]
   */
  async getPubKey(transactionHash: string) {
    // gets the transaction
    const transaction: any = await this.prov.getTransaction(transactionHash)
    // joins the sig
    const sig = ethers.utils.joinSignature({
      r: transaction.r,
      s: transaction.s,
      v: transaction.v,
    })

    const txData = {
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit,
      value: transaction.value,
      nonce: transaction.nonce,
      data: transaction.data,
      chainId: transaction.chainId,
      to: transaction.to,
    }

    const rsTx = await ethers.utils.resolveProperties(txData)
    // returns RLP encoded tx
    const raw = ethers.utils.serializeTransaction(rsTx)
    // not sure about this step but it made it work
    const msgHash = ethers.utils.keccak256(raw)
    // create binary hash
    const msgBytes = ethers.utils.arrayify(msgHash)

    const pubkey = ethers.utils.recoverPublicKey(msgBytes, sig)

    const recoveredAddress = ethers.utils.recoverAddress(msgBytes, sig)

    return [recoveredAddress, transaction.from, pubkey]
  }

  /**
   *
   * @param proofEndpoint the endpoint to be called, ex:did/web
   * @param requestOptions the request options to be called
   * @param enrolling optional argument to receive also the user key and height
   * @returns an object {cid, ipfs} if enrolling returns {did, key, height}
   */
  async postProof(
    proofEndpoint: string,
    requestOptions: any,
    enrolling?: boolean
  ) {
    //   url to be called
    const url = `${this.url}/v0/${proofEndpoint}`

    // fetch
    const rawResponse = await fetch(url, requestOptions)

    //   jsoned response
    const response = await rawResponse.json()

    this.postProofCid = response.cid

    const proofCid: string = response.cid
    const ipfs: string = response.ipfs

    let result
    switch (enrolling) {
      case true:
        const did = await this.getDidTransaction()
        const content: any = await Object?.values(did.contentHash)[0]
        result = {
          did: did.content,
          proofKey: did.key,
          proofHeight: did.height,
          proofCid,
          ipfs,
        }
        return result
    }
    return { proofCid, ipfs }
  }

  /**
   *
   * @param key proof key
   * @param height proof height
   * @returns the to abi proof
   */
  async getProof(key: string, height: string) {
    const rawResult = await fetch(
      `${this.url}/v0/proof/${key}?height=${height}`
    )
    const result = await rawResult.json()
    const abiedProof = await this.toAbiProof({
      ...result[0].Proof.exist,
    })
    return abiedProof
  }

  async fetchDag(cid: string, retries: number, propName: any) {
    const urls = await this.lookupGatewayUri(propName, cid)
    console.log('fecth', urls)
    let timesFetched = 0
    let responseFectchDag: any
    // checks the cid in ipfs
    const runIpfs = async () => {
      const rawIpfsFetch = await fetch(
        `https://ipfs.io/api/v0/dag/get?arg=${cid}`
      )
      if (
        rawIpfsFetch.status === 400 ||
        rawIpfsFetch.status === 404 ||
        rawIpfsFetch.status === 500
      )
        return 'not found'

      const response = await rawIpfsFetch.json()
      timesFetched = retries
      responseFectchDag = response
      return response
    }

    const run = async () => {
      const rawResponse = await fetch(urls[0])
      if (
        rawResponse.status === 400 ||
        rawResponse.status === 404 ||
        rawResponse.status === 500
      ) {
        if (urls.length < 1) return 'not found'

        // if there is another url try to fecthid
        return await runIpfs()
      }
      return await rawResponse.json()
    }

    while (timesFetched < retries) {
      // if it is the firs time dont sleep
      if (timesFetched !== 0) await sleep(5000)
      await run()
      timesFetched += 1
      console.log('sleeping...')
    }
    return responseFectchDag
    // const rawResponse = await fetch(
    //   `${this.url}/v0/dagjson/${id}/`
    // );
    // const response = await rawResponse.json();
    // const cid = await Object?.values(response.contentHash)[0];
    // return {
    //   cid: cid as string,
    //   proofKey: response.key as string,
    //   proofHeight: response.height as string,
    // };
  }

  /**
   *
   * @param cid did return from get proof
   * @param proof the to abi proof
   * @returns the result of the enrollment
   */
  async EnrollL2Account(cid: string, proofKey: string) {
    // try {
    const anconContractReader = AnconProtocol__factory.connect(
      this.anconAddress,
      this.prov
    )

    const contract2 = AnconProtocol__factory.connect(
      this.anconAddress,
      this.signer
    )

    // encoded to utf8
    const UTF8_cid = ethers.utils.toUtf8Bytes(cid)

    // get proof
    const getProof = await anconContractReader.getProof(UTF8_cid)

    if (getProof !== '0x') {
      return 'proof already exist'
    }

    await this.getPastEvents()
    // check the hashes
    const rawLastHash = await fetch(`${this.url}/v0/proofs/lasthash`)
    const lasthash = await rawLastHash.json()
    const version = lasthash.lastHash.version

    const proof = await this.getProof(proofKey, version)

    // estimate gas
    const gasLimit = await contract2.estimateGas.enrollL2Account(
      this.moniker,
      proof.key,
      UTF8_cid,
      proof
    )

    const decimalRate = gasLimit.toNumber() * 1.2
    const rate = Math.floor(decimalRate)
    // enroll based on the network
    let enroll
    switch (this.network.chainId) {
      case 97:
        enroll = await contract2.enrollL2Account(
          this.moniker,
          proof.key,
          UTF8_cid,
          proof,
          {
            gasLimit: rate.toString(),
          }
        )

        break
      case 42:
        enroll = await contract2.enrollL2Account(
          this.moniker,
          proof.key,
          UTF8_cid,
          proof,
          {
            gasPrice: '400000000000',
            gasLimit: 900000,
            from: this.address,
          }
        )
        break
      case 56:
        enroll = await contract2.enrollL2Account(
          this.moniker,
          proof.key,
          UTF8_cid,
          proof,
          {
            gasLimit: rate.toString(),
          }
        )
        break
      case 80001:
        enroll = await contract2.enrollL2Account(
          this.moniker,
          proof.key,
          UTF8_cid,
          proof,
          {
            gasLimit: rate.toString(),
          }
        )

        break
    }
    await enroll?.wait(1)
    console.log(enroll)
    return enroll
  }

  /**
   *
   * @returns returns true when the protocol is updated
   */
  async getPastEvents() {
    console.log('contract', this.anconAddress)
    // instiate the contract
    const AnconReader = await AnconProtocol__factory.connect(
      this.anconAddress,
      this.prov
    )

    // filter the contract
    const filter = await AnconReader.filters.HeaderUpdated()

    // get the from
    const from = await this.prov.getBlockNumber()

    // query the filter
    let result = await AnconReader.queryFilter(filter, from)

    // checking hashes
    const rawLastHash = await fetch(`${this.url}/v0/proofs/lasthash`)
    const lasthash = await rawLastHash.json()
    const decodedlastHash = ethers.utils.hexlify(
      ethers.utils.base64.decode(lasthash.lastHash.hash)
    )

    let relayHash = await AnconReader.getProtocolHeader(this.moniker)
    let time = Date.now()
    try {
      const maxTime = Date.now() + 2800000
      while (time < maxTime) {
        result = await AnconReader.queryFilter(filter, from)
        relayHash = await AnconReader.getProtocolHeader(this.moniker)
        console.log(result, relayHash, decodedlastHash)
        if (relayHash == decodedlastHash) {
          break
        }

        time = Date.now()

        await sleep(10000)
      }
    } catch (error) {
      console.log('error', error)
    }
    return true
  }

  async mintNft(
    hexData: string,
    metadataCid: string,
    userProofKey: string,
    userProofHeight: string
  ) {
    console.log('beggining minting')

    const xdvReader = XDVNFT__factory.connect(this.xdvnftAdress, this.prov)
    const xdvSigner = XDVNFT__factory.connect(this.xdvnftAdress, this.signer)
    const anconReader = AnconProtocol__factory.connect(
      this.anconAddress,
      this.prov
    )

    const dai = new this.provWeb3.eth.Contract(AnconToken.abi, this.daiAddress)
    // check the allowance
    const allowance = await dai.methods
      .allowance(this.address, xdvSigner.address)
      .call()
    await sleep(7000)

    const did = await this.getDidTransaction()

    /* prepare the packet and user proof
     */
    // prepare packet proof
    const packetProof = await this.getProof(userProofKey, userProofHeight)

    // prepare user proof
    const userProof = await this.getProof(did.content, userProofHeight)

    // hash the data
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'string'],
      [this.address, metadataCid]
    )

    // start minting
    let mint
    switch (this.network.chainId) {
      case 97:
      case 80001:
        // tries two times in case it fails
        if (allowance == 0) {
          await dai.methods
            .approve(xdvSigner.address, '1000000000000000000000')
            .send({
              gasPrice: '22000000000',
              gas: 400000,
              from: this.address,
            })
        }
        try {
          mint = await xdvSigner.mintWithProof(
            packetProof.key,
            hexData,
            userProof,
            packetProof
          )
        } catch (error) {
          sleep(5000)
          console.log('failed, trying again...', error)
          mint = await xdvSigner.mintWithProof(
            packetProof.key,
            hexData,
            userProof,
            packetProof
          )
        }
        break
      case 42:
        // if (allowance == 0) {
        await dai.methods
          .approve(xdvSigner.address, '1000000000000000000000')
          .send({
            gasPrice: '200000000000',
            gas: 700000,
            from: this.address,
          })
        // }
        // tries two times in case it fails
        try {
          mint = await xdvSigner.mintWithProof(
            packetProof.key,
            hexData,
            userProof,
            packetProof,

            {
              gasPrice: '200000000000',
              gasLimit: 900000,
              from: this.address,
            }
          )
          console.log(mint)
        } catch (error) {
          console.log('failed, trying again...', error)
          sleep(5000)
          mint = await xdvSigner.mintWithProof(
            packetProof.key,
            hexData,
            userProof,
            packetProof,

            {
              gasPrice: '200000000000',
              gasLimit: 900000,
              from: this.address,
            }
          )
        }
        break
    }
    mint?.wait(1)
    return mint
  }
  async getTransaction() {
    // const [errorModal, setErrorModal] = useRecoilState(errorState);
    console.log('getting transaction from address', this.address)
    console.log(this.network.chainId, 'net')
    try {
      let rawList
      switch (this.network.chainId) {
        case 97:
          rawList = await fetch(
            `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${this.address}&startblock=1&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_BSC_KEY}`
          )
          break
        case 56:
          rawList = await fetch(
            `https://api.bscscan.com/api?module=account&action=txlist&address=${this.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_BSC_KEY}`
          )
          break
        case 42:
          rawList = await fetch(
            `https://api-kovan.etherscan.io/api?module=account&action=txlist&address=${this.address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHER_KEY}`
          )
          break
        case 80001:
          rawList = await fetch(
            `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${this.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_MUMBAI_KEY}`
          )
          break
        default:
          rawList = await fetch(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${this.address}&startblock=6271351&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHER_KEY}`
          )
          break
      }
      const list = await rawList.json()

      console.log('list', list)
      let item

      for (item of list.result) {
        if (item.from.toLowerCase() == this.address.toLowerCase()) {
          return item.hash
        }
        continue
      }
      throw new Error('no transaction found')
    } catch (error) {
      console.log('no transaction found')
      return 'not found'
    }
  }
}

export function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
