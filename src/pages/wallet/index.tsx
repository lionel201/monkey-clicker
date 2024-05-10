import { Button, Input, Typography } from 'antd'
import { AptosAccount, HexString } from 'aptos'
import { useContext, useEffect, useState } from 'react'

import { ModalWarningImportWallet } from '@/common/components/Modals/ModalWarningImportWallet'
import { NetworkContext } from '@/common/context'
import { setData } from '@/common/hooks/useLocalstorage'
import { useModal } from '@/common/hooks/useModal'

export enum WARNING_MODE {
  NEW_WALLET,
  IMPORT_WALLET,
}

export default function Home() {
  const [mode, setMode] = useState(WARNING_MODE.NEW_WALLET)
  const [secretKey, setSecretKey] = useState<HexString | string>('')
  const [isImport, setIsImport] = useState<boolean>(false)
  const [secretKeyInput, setSecretKeyInput] = useState<HexString | string>('')
  const [error, setError] = useState('')
  const [isImportSuccess, setIsImportSuccess] = useState<boolean>(false)
  const { show, setShow, toggle } = useModal()

  const {
    addressContext: [addressContext, setAddressContext],
    secretKeyContext: [secretKeyContext, setSecretKeyContext],
  } = useContext(NetworkContext)

  useEffect(() => {
    setSecretKey(secretKeyContext)
  }, [secretKeyContext])

  const handleShowImport = () => {
    try {
      const account = new AptosAccount(new HexString(secretKeyInput as any).toUint8Array())
      if (account) {
        setMode(WARNING_MODE.IMPORT_WALLET)
        setShow(true)
      }
    } catch (e: any) {
      setIsImportSuccess(false)
      setError(e.message)
    }
  }

  const handleShowWarningNewWallet = () => {
    setMode(WARNING_MODE.NEW_WALLET)
    setShow(true)
  }

  const handleImport = () => {
    try {
      const account = new AptosAccount(new HexString(secretKeyInput as any).toUint8Array())
      console.log('account', account)
      if (account) {
        setData('secretKey', JSON.stringify(HexString.fromUint8Array(account.signingKey.secretKey).toString()))
        setAddressContext(account.address().toString())
        setSecretKeyContext(HexString.fromUint8Array(account.signingKey.secretKey).toString())
        setIsImportSuccess(true)
        setIsImport(false)
        toggle()
      }
    } catch (e: any) {
      console.log(e.message)
      setIsImportSuccess(false)
      setError(e.message)
    }
  }

  const handleGenerateNewWallet = () => {
    try {
      const account = new AptosAccount()
      setSecretKeyContext(account.address().toString())
      setSecretKey(HexString.fromUint8Array(account.signingKey.secretKey).toString())
      setData('secretKey', JSON.stringify(HexString.fromUint8Array(account.signingKey.secretKey).toString()))
      setIsImportSuccess(true)
      toggle()
    } catch (e) {
      setIsImportSuccess(false)
      console.log(e)
    }
  }

  return (
    <div className="pt-10 sm:pt-20 pb-20 px-5">
      <div className="text-center max-w-[570px] mx-auto">
        <h1 className="text-[#000000] text-center text-2xl font-semibold">Wallet</h1>
        <Typography className="text-[#000000] font-semibold mt-10 text-lg">Your Aptos address:</Typography>
        <p className="mt-3">
          This is the Aptos address of your spam wallet. Send $APT to this address to fund your wallet and start mining.
        </p>
        <div
          style={{ wordBreak: 'break-word' }}
          className="bg-[#ff000026] flex items-center justify-center text-[#000] text-center border-0 mt-8 min-h-14 p-5 rounded-[16px]"
        >
          {addressContext.toString() as any}
        </div>
      </div>
      <div className="text-center max-w-[570px] mx-auto mt-10">
        <h1 className="text-[#000000] text-center text-2xl font-semibold">Your secret key:</h1>
        <p className="mt-3">
          This is the private key of your spam wallet. Import it into a Aptos mobile or browser wallet to withdraw the
          $APT you mine.
        </p>
        <div
          style={{ wordBreak: 'break-word' }}
          className="bg-[#ff000026] text-[#000] border-0 mt-8 min-h-14 flex items-center rounded-[16px] p-5"
        >
          {secretKey as string}
        </div>

        <p className="text-[#FF6464] mt-3">{`Don't share your secret key with anyone`}</p>
        <div className="mt-10 flex justify-center gap-2">
          <Button
            onClick={handleShowWarningNewWallet}
            className="bg-[#CA5C3B] text-[#fff] border-0 font-medium rounded-[100px] h-10 min-w-[100px]"
          >
            New Wallet
          </Button>
          <Button
            onClick={() => {
              setIsImport(true)
              setIsImportSuccess(false)
            }}
            className="bg-transparent border-[#CA5C3B] text-[#CA5C3B] font-medium rounded-[100px] h-10 min-w-[100px]"
          >
            Import
          </Button>
        </div>
        {isImport && (
          <div className="mt-10 text-center">
            <Typography className="text-[text-[#000000]] font-semibold  text-lg">Import wallet</Typography>
            <p className="mt-5">Paste your secret key and click the import button.</p>
            <Input
              value={secretKeyInput as string}
              onChange={(e) => {
                setSecretKeyInput(e.target.value)
                setError('')
              }}
              className="max-w-[300px] text-center mt-5 h-12 rounded-[16px]"
            />
            <div>
              <Button
                onClick={handleShowImport}
                className="bg-[#CA5C3B] text-[#fff] mt-5 border-0 font-medium rounded-[100px] h-10 min-w-[100px]"
              >
                Import
              </Button>
              {error && (
                <div className="text-[#FF6464] text-base mt-5">
                  <p>Invalid secret key:</p>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {isImportSuccess && <p className="text-[#90ee90] font-semibold text-base mt-5">Success</p>}
      </div>
      <div className="text-center mt-14">
        <Typography className="text-[#000000] font-semibold  text-lg">Back up your secret key!</Typography>
        <p className="font-medium mt-3">Your spam wallet is stored in your browser, only you have access to it.</p>
        <p className="font-medium">Clearing cookies will delete your wallet, and we cannot recover it for you.</p>
        <p className="font-medium">Copy your secret key and keep it safe, this allows you to restore your wallet.</p>
      </div>
      <ModalWarningImportWallet
        isModalOpen={!!show}
        handleClose={toggle}
        onOk={() => (mode === WARNING_MODE.IMPORT_WALLET ? handleImport() : handleGenerateNewWallet())}
      />
    </div>
  )
}
