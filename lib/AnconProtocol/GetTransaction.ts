import { ethers } from 'ethers'
declare let window: any
// get transaction
const getTransaction = async (address: string, provider: any) => {
  // const [errorModal, setErrorModal] = useRecoilState(errorState);
  console.log('getting transaction from address', address)

  const prov = new ethers.providers.Web3Provider(provider)
  const network = await prov.getNetwork()

  try {
    let rawList
    switch (network.chainId) {
      case 97:
        rawList = await fetch(
          `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_BSC_KEY}`
        )
        break
      case 56:
        rawList = await fetch(
          `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_BSC_KEY}`
        )
        break
      case 42:
        rawList = await fetch(
          `https://api-kovan.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHER_KEY}`
        )
        break
      case 80001:
        rawList = await fetch(
          `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_MUMBAI_KEY}`
        )
        break
      default:
        rawList = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=6271351&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHER_KEY}`
        )
        break
    }
    const list = await rawList.json()

    let item
    for (item of list.result) {
      if (item.from.toLowerCase() == address.toLowerCase()) {
        return item.hash
      }
      continue
    }
    throw new Error('no transaction found')
  } catch (error) {
    console.log('no transaction found')
  }
}

export default getTransaction
