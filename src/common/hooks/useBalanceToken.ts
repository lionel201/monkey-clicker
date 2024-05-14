import useClient from '@/common/hooks/useClient'
type Coin = { coin: { value: string } }

const useBalanceToken = () => {
  const { aptos } = useClient()

  const getBalanceCoin = async (walletAddress: string, tokenAddress: string | null) => {
    try {
      if (tokenAddress) {
        const resource: any = await aptos.getAccountResource<Coin>({
          accountAddress: walletAddress,
          resourceType: `0x1::coin::CoinStore<${tokenAddress}>`,
        })
        return Number(resource.coin.value)
      } else {
        return 0
      }
    } catch (e) {
      console.log(e)
      return 0
    }
  }
  return { getBalanceCoin }
}

export default useBalanceToken
