import { AptosAccount, HexString } from 'aptos'
import React, { ReactNode, useContext, useEffect } from 'react'

import { Footer } from '@/common/components/Footer'
import { HeaderPage } from '@/common/components/Header'
import { NetworkContext } from '@/common/context'
import { getData, setData } from '@/common/hooks/useLocalstorage'

export const LayoutPage: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const {
    secretKeyContext: [_, setSecretKeyContext],
    addressContext: [address, setAddressContext],
  } = useContext(NetworkContext)

  useEffect(() => {
    const secretKeyLocal = getData('secretKey')
    if (secretKeyLocal) {
      const account = new AptosAccount(new HexString(JSON.parse(secretKeyLocal)).toUint8Array())
      setAddressContext(account.address().toString())
      setSecretKeyContext(JSON.parse(secretKeyLocal))
    } else {
      const account = new AptosAccount()
      setSecretKeyContext(HexString.fromUint8Array(account.signingKey.secretKey).toString())
      setAddressContext(account.address().toString())
      setData('secretKey', JSON.stringify(HexString.fromUint8Array(account.signingKey.secretKey).toString()))
    }
  }, [])

  return (
    <>
      <HeaderPage />
      {children}
      <Footer />
    </>
  )
}
