import { AptosAccount, HexString, Network } from 'aptos'
import React, { ReactNode, useContext, useEffect } from 'react'

import { Footer } from '@/common/components/Footer'
import { HeaderPage } from '@/common/components/Header'
import { NetworkContext } from '@/common/context'
import { getData, setData } from '@/common/hooks/useLocalstorage'
import { faucetClient } from '@/config/aptosClient'

export const LayoutPage: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const {
    networkContext: [network],
    secretKeyContext: [secretKey, setSecretKeyContext],
    addressContext: [_, setAddressContext],
  } = useContext(NetworkContext)

  useEffect(() => {
    const secretKeyLocal = getData('secretKey')
    if (secretKeyLocal) {
      const account = new AptosAccount(new HexString(JSON.parse(secretKeyLocal)).toUint8Array())
      setAddressContext(account.address().toString())
      setSecretKeyContext(JSON.parse(secretKeyLocal))
    } else {
      generateNewAccount()
    }
  }, [secretKey])

  const generateNewAccount = async () => {
    try {
      const account = new AptosAccount()
      if (network === Network.TESTNET) {
        await faucetClient.fundAccount(account.address().toString(), 100_000_000)
      }
      setSecretKeyContext(HexString.fromUint8Array(account.signingKey.secretKey).toString())
      setAddressContext(account.address().toString())
      setData('secretKey', JSON.stringify(HexString.fromUint8Array(account.signingKey.secretKey).toString()))
    } catch (e) {
      console.log('e', e)
    }
  }

  return (
    <>
      <HeaderPage />
      <div className={'min-h-screen'}>{children}</div>
      <Footer />
    </>
  )
}
