import React, { useContext } from 'react'
import Image from 'next/image'
import { Typography } from 'antd'
import { formatNumberBalance } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useBalanceToken from '@/common/hooks/useBalanceToken'
import { NetworkContext } from '@/common/context'

interface Props {
  token: any
}

export const TokenItem: React.FunctionComponent<Props> = ({ token }) => {
  const { getBalanceCoin } = useBalanceToken()
  const {
    addressContext: [addressContext],
  } = useContext(NetworkContext)

  const { data: aptBalance = 0 } = useQuery({
    queryKey: ['getAptBalance', addressContext],
    queryFn: async () => {
      const balance = await getBalanceCoin(addressContext.toString(), '0x1::aptos_coin::AptosCoin')
      return BigNumber(balance).div(BigNumber(10).pow(8)).toNumber()
    },
  })

  return (
    <div className={'flex justify-between cursor-pointer hover:bg-[#cccccc5e] transition p-3'}>
      <div className={'flex items-center gap-2'}>
        <div>
          <Image className={'w-[25px]'} src={token.image} alt={''} />
        </div>
        <Typography className={'font-medium'}>{token.symbol}</Typography>
      </div>
      <Typography className={'font-medium'}>{formatNumberBalance(aptBalance, 4)}</Typography>
    </div>
  )
}
