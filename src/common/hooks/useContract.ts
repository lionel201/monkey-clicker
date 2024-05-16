import useClient from '@/common/hooks/useClient'
import { Account } from '@aptos-labs/ts-sdk'

interface ViewRequests {
  function: string
  typeArguments: any[]
  functionArguments: any[]
}

const useContract = () => {
  const { aptos } = useClient()

  const view = async (payload: any) => {
    return await aptos.view({ payload })
  }

  const simulateTransaction = async (account: Account, rawTxn: any) => {
    try {
      const userTransaction = await aptos.transaction.simulate.simple({
        signerPublicKey: account.publicKey,
        transaction: rawTxn,
      })
      if (!userTransaction[0].success) {
        return false
      } else {
        return true
      }
    } catch (e) {
      console.log('eee', e)
      throw e
    }
  }

  return { view, simulateTransaction }
}

export default useContract
