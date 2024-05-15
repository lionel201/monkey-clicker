import { useQuery } from '@tanstack/react-query'
import { notification, Progress, Typography } from 'antd'
import { AptosAccount, HexString } from 'aptos'
import React, { useContext, useEffect, useState } from 'react'

import {
  CatDefault,
  CatTicker,
  CatTickleLimit,
  HandIcon,
  HeartIcon,
  LineIcon,
  MouseIcon,
} from '@/common/components/Icons/common'
import { NetworkContext } from '@/common/context'
import useClient from '@/common/hooks/useClient'
import useContract from '@/common/hooks/useContract'
import { getDiff, pop } from '@/common/utils'
import { formatNumberBalance } from '@/utils'
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'

const maxFoodAmount = 500

const Page: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true)
  const [sequenceNumber, setSequenceNumber] = useState('1')
  const [totalPlays, setTotalPlays] = useState(0)
  const [totalFood, setTotalFood] = useState(0)
  const [accountIsCreated, setAccountIsCreated] = useState(true)
  const { view } = useContract()
  const { aptosClient, CLICKER_RESOURCE_ACCOUNT, aptos } = useClient()

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
      const privateKey = new Ed25519PrivateKey(secretKey)
      const account = Account.fromPrivateKey({ privateKey })
      if (account) {
        setAccountIsCreated(true)
      }
      const genesisAccount = await aptosClient.getAccount(account.accountAddress.toString())
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
      const privateKey = new Ed25519PrivateKey(secretKey)
      const account = Account.fromPrivateKey({ privateKey })
      const payload = {
        function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::current_plays`,
        typeArguments: [],
        functionArguments: [account.accountAddress.toString()],
      }
      const res = await view(payload)
      return Number(res[0])
    },
    enabled: !!secretKey,
  })

  const { data: endTime = 0, isFetching } = useQuery({
    queryKey: ['isEnded', secretKey],
    queryFn: async () => {
      const payload = {
        function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::end_time`,
        typeArguments: [],
        functionArguments: [],
      }
      const res = await view(payload)
      return Number(res[0])
    },
    enabled: !!secretKey,
  })

  useEffect(() => {
    setLoading(isFetching)
  }, [isFetching])

  const isEnded = getDiff(endTime * 1000) < 0

  useEffect(() => {
    setTotalPlays(current_plays)
  }, [current_plays])

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

  const handleClick = async (e: any) => {
    if (totalFood >= 500) {
      return
    }
    if (isEnded) {
      notification.error({ message: <div className="max-h-[70px] overflow-y-auto">Time ended!</div> })
      return
    }
    if (!secretKey) {
      notification.error({ message: <div className="max-h-[70px] overflow-y-auto">Account not found!</div> })
      return
    }
    try {
      setTotalPlays(totalPlays + 1)
      setTotalFood(totalFood + 1)
      pop(e)
      setSequenceNumber(String(Number(sequenceNumber) + 1))
      const privateKey = new Ed25519PrivateKey(secretKey as any)
      const account = Account.fromPrivateKey({ privateKey })
      const rawTxn = await aptos.transaction.build.simple({
        sender: account.accountAddress.toString(),
        data: {
          function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::play`,
          typeArguments: [],
          functionArguments: [],
        },
        options: { accountSequenceNumber: Number(sequenceNumber) },
      })
      const simulate = await simulateTransaction(account, rawTxn)
      console.log('simulate', simulate)
      await aptos.signAndSubmitTransaction({
        signer: account,
        transaction: rawTxn,
      })
    } catch (e: any) {
      console.log(e.message)
      notification.error({ message: <div className="max-h-[70px] overflow-y-auto"> {e.message}</div> })
    }
  }

  return (
    <div className="game-layout relative flex  justify-center items-center py-10">
      {!loading ? (
        <div>
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
            <div className="flex justify-center no-select mt-10">
              <div
                onClick={async (e) => {
                  if (accountIsCreated) {
                    await handleClick(e)
                  } else {
                    notification.error({ message: 'You need to fund the game wallet with apt first.' })
                  }
                }}
                className="w-[320px] no-select sm:w-[420px] tickle-box h-[320px] sm:h-[420px] flex justify-center items-center bg-[#EEC5C7] rounded-full"
              >
                <div>
                  <div className={'cat pointer-events-none w-[200px] h-[200px] flex items-center justify-center'}>
                    {totalFood === 0 && <CatDefault className={'w-[150px] sm:w-[200px] h-auto'} />}
                    {totalFood === maxFoodAmount && <CatTickleLimit className={'w-[150px] sm:w-[180px] h-auto'} />}
                    {totalFood > 0 && totalFood < maxFoodAmount && (
                      <CatTicker className={'w-[200px] sm:w-[255px] h-auto'} />
                    )}
                  </div>
                  <div
                    className={
                      'text-xl sm:text-2xl no-select font-bold pointer-events-none cursor-not-allowed text-[#FFFFFF] text-center mt-5'
                    }
                  >
                    {totalFood === maxFoodAmount && 'meowwwwww......'}
                    {totalFood !== maxFoodAmount && 'Tickle me to Earn'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center pointer-events-none gap-3 mt-10">
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
      ) : null}
    </div>
  )
}
export default Page
