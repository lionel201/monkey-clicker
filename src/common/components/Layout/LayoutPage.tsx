import { AptosAccount, HexString, Network } from 'aptos'
import React, { ReactNode, useContext, useEffect } from 'react'

import { Footer } from '@/common/components/Footer'
import { HeaderPage } from '@/common/components/Header'
import { NetworkContext } from '@/common/context'
import { getData, setData } from '@/common/hooks/useLocalstorage'
import { faucetClient } from '@/config/aptosClient'
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'

export const LayoutPage: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const {
    networkContext: [network],
    secretKeyContext: [secretKey, setSecretKeyContext],
    addressContext: [_, setAddressContext],
  } = useContext(NetworkContext)

  useEffect(() => {
    ;(async () => {
      try {
        const secretKeyLocal = getData('secretKey')
        if (secretKeyLocal) {
          const privateKey = new Ed25519PrivateKey(secretKey)
          const account = Account.fromPrivateKey({ privateKey })
          setAddressContext(account.accountAddress.toString())
          setSecretKeyContext(JSON.parse(secretKeyLocal))
        } else {
          await generateNewAccount()
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [secretKey])

  const generateNewAccount = async () => {
    try {
      const account = Account.generate()
      if (network === Network.TESTNET) {
        try {
          await faucetClient.fundAccount(account.accountAddress.toString(), 100_000_000)
        } catch (e) {
          console.log(e)
        }
      }
      setSecretKeyContext(HexString.fromUint8Array(account.privateKey.toUint8Array()).toString())
      setAddressContext(account.accountAddress.toString())
      setData('secretKey', JSON.stringify(HexString.fromUint8Array(account.privateKey.toUint8Array()).toString()))
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
