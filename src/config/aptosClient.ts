import { AptosClient, FaucetClient } from 'aptos'
import { NODE_URL, TESTNET_FAUCET_URL, TESTNET_NODE_URL } from './aptosConstants'

export const faucetClient = new FaucetClient(TESTNET_NODE_URL, TESTNET_FAUCET_URL)
export const aptosClient = new AptosClient(NODE_URL)
