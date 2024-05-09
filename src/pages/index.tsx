import { useQuery } from '@tanstack/react-query'
import { notification, Progress, Typography } from 'antd'
import { AptosAccount, HexString } from 'aptos'
import React, { useContext, useEffect, useState } from 'react'

import { CatTicker, HandIcon, HeartIcon, LineIcon, MouseIcon } from '@/common/components/Icons/common'
import { CLICKER_RESOURCE_ACCOUNT } from '@/common/consts'
import { NetworkContext } from '@/common/context'
import useClient from '@/common/hooks/useClient'
import useContract from '@/common/hooks/useContract'

const maxFoodAmount = 500

const Page: React.FunctionComponent = () => {
  const [sequenceNumber, setSequenceNumber] = useState('1')
  const [totalPlays, setTotalPlays] = useState(0)
  const [totalFood, setTotalFood] = useState(0)
  const [accountIsCreated, setAccountIsCreated] = useState(true)
  const { view } = useContract()
  const { aptosClient } = useClient()

  const {
    secretKeyContext: [secretKey],
  } = useContext(NetworkContext)

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalFood > 0) {
        setTotalFood(totalFood - 1)
      }
    }, 1000)

    //Clearing the interval
    return () => clearInterval(interval)
  }, [totalFood])

  useEffect(() => {
    ;(async () => {
      try {
        const account = new AptosAccount(new HexString(secretKey as any).toUint8Array())
        if (account) {
          setAccountIsCreated(true)
        }
        const genesisAccount = await aptosClient.getAccount(account.address())
        console.log('genesisAccount.sequence_number', genesisAccount.sequence_number)
        setSequenceNumber(genesisAccount.sequence_number)
      } catch (e: any) {
        console.log(e)
        if (e.message.includes('Account not found')) {
          setAccountIsCreated(false)
        } else {
          notification.error({ message: <div className="max-h-[70px] overflow-y-auto"> {e.message}</div> })
        }
      }
    })()
  }, [])

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

  function pop(e: any) {
    const amount = 1
    if (e.clientX === 0 && e.clientY === 0) {
      const bbox = e.target.getBoundingClientRect()
      const x = bbox.left + bbox.width / 2
      const y = bbox.top + bbox.height / 2
      for (let i = 0; i < 30; i++) {
        createParticle(x, y, e.target.dataset.type)
      }
    } else {
      for (let i = 0; i < amount; i++) {
        createParticle(e.clientX, e.clientY + window.scrollY, 'mario')
      }
    }
  }

  function createParticle(x: number, y: number, type: string) {
    const particle = document.createElement('particle')
    document.body.appendChild(particle)
    const width = 30
    const height = width
    const destinationY = -300
    const rotation = 0
    const delay = 100
    const arr = ['/apple.png', '/banana.png', '/peach.png', '/watermelon.png', '/strawberry.png']
    const image = arr[Math.floor(Math.random() * arr.length)]
    particle.style.backgroundImage = `url(${image})`
    particle.style.width = `${width}px`
    particle.style.height = `${height}px`
    const animation = particle.animate(
      [
        {
          transform: `translateY(50%) translate(${x}px, ${y}px) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translateY(50%) translate(${x}px, ${y + destinationY}px) rotate(${rotation}deg)`,
          opacity: 0.5,
        },
      ],
      {
        duration: 500,
        easing: 'cubic-bezier(0, 1, .57, 1)',
        delay,
      },
    )
    animation.onfinish = removeParticle
  }

  function removeParticle(e: any) {
    e.srcElement.effect.target.remove()
  }

  const handleClick = async (e: any) => {
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
          <Typography className="text-5xl text-[#000000] font-black font-pacifico">{totalPlays}</Typography>
        </div>
        <div className="flex justify-center mt-10">
          <div
            onClick={async (e) => {
              if (accountIsCreated) {
                await handleClick(e)
              } else {
                notification.error({ message: 'Account has not been created.' })
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
                  'text-2xl no-select font-bold pointer-events-none cursor-not-allowed text-[#FFFFFF] text-center mt-5'
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
