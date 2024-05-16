import { useQuery } from '@tanstack/react-query'
import { Button, Checkbox, notification, Progress, Radio, Switch, Typography } from 'antd'
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
import { Account, Ed25519PrivateKey, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk'
import CountdownClaim from '@/common/components/CountdownClaim'
import { CLAIM_START_TIME } from '@/common/consts'
import { getData, setData } from '@/common/hooks/useLocalstorage'

const maxFoodAmount = 500

const Page: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(true)
  const [sequenceNumber, setSequenceNumber] = useState('1')
  const [totalPlays, setTotalPlays] = useState(0)
  const [totalFood, setTotalFood] = useState(0)
  const [accountIsCreated, setAccountIsCreated] = useState(true)
  const [isClaimStarted, setIsClaimStarted] = useState(getDiff(CLAIM_START_TIME * 1000) < 0)
  const [autoClickInterval, setAutoClickInterval] = useState<any>(null)

  const [auto, setAuto] = useState(false)
  const { view, simulateTransaction } = useContract()
  const { aptosClient, CLICKER_RESOURCE_ACCOUNT, aptos } = useClient()

  const {
    secretKeyContext: [secretKey],
  } = useContext(NetworkContext)

  useEffect(() => {
    setData('auto', 'false')
    setAuto(false)
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

  const { data: current_plays = 0, refetch } = useQuery({
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

  useEffect(() => {
    ;(async () => {
      if (auto) {
        const interval = setInterval(function () {
          handleAutoClick()
        }, 1000)
        setAutoClickInterval(interval)
      } else {
        clearInterval(autoClickInterval)
      }
    })()
  }, [auto])

  const handleAutoClick = async () => {
    const privateKey = new Ed25519PrivateKey(secretKey as any)
    const account = Account.fromPrivateKey({ privateKey })
    const payloads: InputGenerateTransactionPayloadData[] = []
    for (let i = 0; i < 5; i += 1) {
      const txn: InputGenerateTransactionPayloadData = {
        function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::play`,
        functionArguments: [],
      }
      payloads.push(txn)
    }
    await aptos.transaction.batch.forSingleAccount({ sender: account, data: payloads })
    await refetch()
  }

  const { data: totalCrrPlay = 0 } = useQuery({
    queryKey: ['currentTotalPlays', secretKey],
    queryFn: async () => {
      const payload = {
        function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::curr_total_plays`,
        typeArguments: [],
        functionArguments: [],
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

  const handleChangeAuto = (checked: boolean) => {
    console.log(`switch to ${checked}`)
    setData('auto', checked ? 'true' : 'false')
    setAuto(checked)
  }

  return (
    <div className="game-layout relative z-10 flex  justify-center py-10">
      <div>
        <div className={'text-center'}>
          <div className={'flex justify-center'}>
            <CountdownClaim
              endAt={CLAIM_START_TIME}
              onMomentChange={() => {
                setIsClaimStarted(true)
              }}
            />
          </div>
          <p className={'text-[#000000] mt-3'}>You can claim the token at the end of the Campaign</p>
          <Button
            disabled={!isClaimStarted}
            className={
              'bg-[#CA5C3B] text-[#fff] disabled:bg-[#F7D9D0] border-0 text-base rounded-full px-5 h-10 mt-5 min-w-[120px]'
            }
          >
            Claim
          </Button>
        </div>
        {!loading ? (
          <div className={'mt-16'}>
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
                <Typography className="text-5xl text-[#CA5C3B] font-black font-pacifico">
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
              <div className={'flex flex-col'}>
                <div className="flex items-center pointer-events-none gap-3 mt-10 relative px-5 sm:px-0">
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
                <div className={'text-center block'}>
                  <div className={'text-[#000000] font-medium'}>Auto Tickle</div>
                  <Switch checked={auto} onChange={handleChangeAuto} />
                </div>
              </div>

              <div className={'text-center mt-5 text-[#000000]'}>
                <div>Total transactions: {formatNumberBalance(totalCrrPlay, 0)}</div>
                <div>Total accounts: 1,234,458</div>
              </div>
              <span className="preloader"></span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default Page
