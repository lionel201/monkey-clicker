import { AptosClient, CoinClient, FungibleAssetClient, IndexerClient, Network, Provider } from 'aptos'
import { useContext, useMemo } from 'react'

import {
  // DEVNET_NODE_URL,
  MAINNET_INDEXER_URL,
  MAINNET_NODE_URL,
  TESTNET_INDEXER_URL,
  TESTNET_NODE_URL,
} from '@/config/aptosConstants'
import { NetworkContext } from '@/common/context'
import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk'

const useClient = () => {
  const {
    networkContext: [networkContext],
  } = useContext(NetworkContext)

  const { aptosClient } = useMemo(() => {
    return {
      aptosClient:
        networkContext === Network.TESTNET ? new AptosClient(TESTNET_NODE_URL) : new AptosClient(MAINNET_NODE_URL),
    }
  }, [])

  const CLICKER_RESOURCE_ACCOUNT_TESTNET = '0xff9659c0da82a6701e5641584a05ca03576bed4c994ab677dd6d12fe679f6615'
  const CLICKER_RESOURCE_ACCOUNT_MAINNET = '0xff9659c0da82a6701e5641584a05ca03576bed4c994ab677dd6d12fe679f6615'

  const CLICKER_RESOURCE_ACCOUNT =
    networkContext === Network.TESTNET ? CLICKER_RESOURCE_ACCOUNT_TESTNET : CLICKER_RESOURCE_ACCOUNT_MAINNET
  const aptosConfig = new AptosConfig({
    network: networkContext === Network.TESTNET ? Network.TESTNET : Network.MAINNET,
    fullnode: networkContext === Network.TESTNET ? TESTNET_NODE_URL : MAINNET_NODE_URL,
  })

  const aptos = new Aptos(aptosConfig)
  const provider = new Provider(networkContext === Network.TESTNET ? Network.TESTNET : Network.MAINNET)
  const coinClient = new CoinClient(provider)
  const fungibleAsset = new FungibleAssetClient(provider)
  const indexerClient = new IndexerClient(
    networkContext === Network.TESTNET ? TESTNET_INDEXER_URL : MAINNET_INDEXER_URL,
  )
  return { coinClient, aptosClient, fungibleAsset, provider, indexerClient, CLICKER_RESOURCE_ACCOUNT, aptos }
}

export default useClient
