'use client'
import { Network } from 'aptos'
import { PropsWithChildren, useState } from 'react'

import { getData } from '@/common/hooks/useLocalstorage'

import { NetworkContext } from '.'

const NetworkContextProvider = ({ children }: PropsWithChildren) => {
  const networkContext = useState<Network>((getData('network') as Network) ?? Network.TESTNET)
  const secretKeyContext = useState<string>(getData('secretKey') ? JSON.parse(getData('secretKey') as any) : '')

  return <NetworkContext.Provider value={{ networkContext, secretKeyContext }}>{children}</NetworkContext.Provider>
}

export default NetworkContextProvider
