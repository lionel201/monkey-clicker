import { useQuery } from '@tanstack/react-query'
import { notification, Progress, Typography } from 'antd'
import { AptosAccount, HexString } from 'aptos'
import React, { useContext, useEffect, useState } from 'react'

import { CatTicker, HandIcon, HeartIcon, LineIcon, MouseIcon } from '@/common/components/Icons/common'
import { NetworkContext } from '@/common/context'
import useClient from '@/common/hooks/useClient'
import useContract from '@/common/hooks/useContract'
import { getDiff, pop } from '@/common/utils'
import { formatNumberBalance } from '@/utils'

const maxFoodAmount = 500

const Page: React.FunctionComponent = () => {
  const [sequenceNumber, setSequenceNumber] = useState('1')
  const [totalPlays, setTotalPlays] = useState(0)
  const [totalFood, setTotalFood] = useState(0)
  const [accountIsCreated, setAccountIsCreated] = useState(true)
  const { view } = useContract()
  const { aptosClient, CLICKER_RESOURCE_ACCOUNT } = useClient()

  const {
    secretKeyContext: [secretKey],
  } = useContext(NetworkContext)

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalFood > 0) {
        setTotalFood(totalFood - 1)
      }
    }, 500)

    //Clearing the interval
    return () => clearInterval(interval)
  }, [totalFood])

  useEffect(() => {
    ;(async () => {
      await getAccountInfo()
    })()
  }, [secretKey])

  const getAccountInfo = async () => {
    try {
      const account = new AptosAccount(new HexString(secretKey as any).toUint8Array())
      if (account) {
        setAccountIsCreated(true)
      }
      const genesisAccount = await aptosClient.getAccount(account.address())
      setSequenceNumber(genesisAccount.sequence_number)
    } catch (e: any) {
      console.log(e)
      if (e.message.includes('Account not found')) {
        setAccountIsCreated(false)
      }
    }
  }

  const { data: current_plays = 0 } = useQuery({
    queryKey: ['currentPlays', secretKey],
    queryFn: async () => {
      const account = new AptosAccount(new HexString(secretKey as any).toUint8Array())
      const payload = {
        function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::current_plays`,
        type_arguments: [],
        arguments: [account.address().toString()],
      }
      const res = await view(payload)
      return Number(res[0])
    },
    enabled: !!secretKey,
  })

  const { data: endTime = 0 } = useQuery({
    queryKey: ['isEnded', secretKey],
    queryFn: async () => {
      const account = new AptosAccount(new HexString(secretKey as any).toUint8Array())
      const payload = {
        function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::end_time`,
        type_arguments: [],
        arguments: [],
      }
      const res = await view(payload)
      return Number(res[0])
    },
    enabled: !!secretKey,
  })

  const isEnded = getDiff(endTime * 1000) < 0

  console.log('endTime', endTime)

  useEffect(() => {
    setTotalPlays(current_plays)
  }, [current_plays])

  const simulateTransaction = async (account: AptosAccount, rawTxn: any) => {
    try {
      const userTransactions = await aptosClient.simulateTransaction(account, rawTxn, {
        estimateGasUnitPrice: true,
        estimateMaxGasAmount: true,
        estimatePrioritizedGasUnitPrice: true,
      })
      const userTransaction = userTransactions[0]
      if (!userTransaction.success) {
        return false
      } else {
        return true
      }
    } catch (e) {
      throw e
    }
  }

  const handleClick = async (e: any) => {
    if (isEnded) {
      notification.error({ message: <div className="max-h-[70px] overflow-y-auto">Time ended!</div> })
      return null
    }
    if (!secretKey) {
      notification.error({ message: <div className="max-h-[70px] overflow-y-auto">Account not found!</div> })
      return null
    }
    try {
      setTotalPlays(totalPlays + 1)
      setTotalFood(totalFood + 1)
      pop(e)
      setSequenceNumber(String(Number(sequenceNumber) + 1))
      const account = new AptosAccount(new HexString(secretKey as any).toUint8Array())
      const rawTxn = await aptosClient.generateTransaction(
        account.address(),
        {
          function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::play`,
          type_arguments: [],
          arguments: [],
        },
        {
          sequence_number: sequenceNumber,
        },
      )
      const simulate = await simulateTransaction(account, rawTxn)
      console.log('simulate', simulate)
      const tx = await aptosClient.signAndSubmitTransaction(account, rawTxn)
    } catch (e: any) {
      console.log(e.message)
      notification.error({ message: <div className="max-h-[70px] overflow-y-auto"> {e.message}</div> })
    }
  }

  return (
    <div className="game-layout relative flex  justify-center items-center py-10">
      <div className={'absolute bottom-0 hidden sm:block left-0'}>
        <LineIcon />
        <div className={'absolute -right-20 top-5'}>
          <MouseIcon />
        </div>
      </div>
      <div className="min-w-[350px] ">
        <div className="flex justify-center items-center gap-3">
          <div>
            <HeartIcon />
          </div>
          <Typography className="text-5xl text-[#000000] font-black font-pacifico">
            {formatNumberBalance(totalPlays, 0)}
          </Typography>
        </div>
        <div className="flex justify-center mt-10">
          <div
            onClick={async (e) => {
              if (accountIsCreated) {
                await handleClick(e)
              } else {
                notification.error({ message: 'You need to fund the game wallet with apt first.' })
              }
            }}
            className="w-[320px] sm:w-[420px] tickle-box h-[320px] sm:h-[420px] flex justify-center items-center bg-[#EEC5C7] rounded-full"
          >
            <div>
              <div className={'cat'}>
                <CatTicker className={'w-[200px] sm:w-[255px] h-auto'} />
              </div>
              <div
                className={
                  'text-xl sm:text-2xl no-select font-bold pointer-events-none cursor-not-allowed text-[#FFFFFF] text-center mt-5'
                }
              >
                Tickle me to Earn
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-10">
          <span className="text-[#080708] text-lg no-select exo-2">{totalFood}</span>
          <Progress
            className=""
            percent={(totalFood / maxFoodAmount) * 100}
            trailColor="#101119"
            showInfo={false}
            status="active"
            strokeColor={{
              '0%': '#FC90FF',
              '100%': '#6C48FF',
            }}
            strokeWidth={14}
          />
          <HandIcon />
        </div>
        <span className="preloader"></span>
      </div>
    </div>
  )
}
export default Page
