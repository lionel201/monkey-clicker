import { Button, Divider, Input, Tooltip, Typography } from 'antd'
import { AptosAccount, HexString, Network } from 'aptos'
import { useContext, useEffect, useState } from 'react'

import { ModalWarningImportWallet } from '@/common/components/Modals/ModalWarningImportWallet'
import { NetworkContext } from '@/common/context'
import { setData } from '@/common/hooks/useLocalstorage'
import { useModal } from '@/common/hooks/useModal'
import { TickleStep } from '@/common/components/TickleStep'
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'
import useClient from '@/common/hooks/useClient'
import { copyToClipboard, ellipseAddress, formatNumberBalance } from '@/utils'
import { Avatar, CopyIcon } from '@/common/components/Icons/common'
import { useQuery } from '@tanstack/react-query'
import useBalanceToken from '@/common/hooks/useBalanceToken'
import BigNumber from 'bignumber.js'
import useContract from '@/common/hooks/useContract'
import { faucetClient } from '@/config/aptosClient'
import { ModalTransferToken } from '@/common/components/Modals/ModalTransferToken'

export enum WARNING_MODE {
  NEW_WALLET,
  IMPORT_WALLET,
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [copyText, setCopyText] = useState('Copy')
  const [mode, setMode] = useState(WARNING_MODE.NEW_WALLET)
  const [secretKey, setSecretKey] = useState<HexString | string>('')
  const [isImport, setIsImport] = useState<boolean>(false)
  const [secretKeyInput, setSecretKeyInput] = useState<HexString | string>('')
  const [error, setError] = useState('')
  const [isImportSuccess, setIsImportSuccess] = useState<boolean>(false)
  const { show, setShow, toggle } = useModal()
  const { show: showSendToken, setShow: setShowSendToken, toggle: toggleSendToken } = useModal()
  const { CLICKER_RESOURCE_ACCOUNT, aptos } = useClient()
  const { getBalanceCoin } = useBalanceToken()
  const { view } = useContract()
  const {
    networkContext: [network],
    addressContext: [addressContext, setAddressContext],
    secretKeyContext: [secretKeyContext, setSecretKeyContext],
  } = useContext(NetworkContext)

  useEffect(() => {
    setSecretKey(secretKeyContext)
  }, [secretKeyContext])

  const { data: aptBalance = 0, refetch } = useQuery({
    queryKey: ['getAptBalance', addressContext],
    queryFn: async () => {
      const balance = await getBalanceCoin(addressContext.toString(), '0x1::aptos_coin::AptosCoin')
      return BigNumber(balance).div(BigNumber(10).pow(8)).toNumber()
    },
  })

  const { data: current_plays = 0 } = useQuery({
    queryKey: ['currentPlays', addressContext],
    queryFn: async () => {
      const payload = {
        function: `${CLICKER_RESOURCE_ACCOUNT}::clickr::current_plays`,
        typeArguments: [],
        functionArguments: [addressContext.toString()],
      }
      const res = await view(payload)
      return Number(res[0])
    },
    enabled: !!secretKey,
  })

  const handleShowImport = async () => {
    try {
      setLoading(true)
      const privateKey = new Ed25519PrivateKey(secretKeyInput as any)
      const account = Account.fromPrivateKey({ privateKey })
      if (account) {
        setMode(WARNING_MODE.IMPORT_WALLET)
        setShow(true)
        setLoading(false)
      }
    } catch (e: any) {
      setLoading(false)
      setIsImportSuccess(false)
      setError(e.message)
    }
  }

  const handleShowWarningNewWallet = () => {
    setMode(WARNING_MODE.NEW_WALLET)
    setShow(true)
  }

  const handleImport = async () => {
    try {
      const privateKey = new Ed25519PrivateKey(secretKeyInput as any)
      const account = Account.fromPrivateKey({ privateKey })
      if (account) {
        setData('secretKey', JSON.stringify(HexString.fromUint8Array(account.privateKey.toUint8Array()).toString()))
        setAddressContext(account.accountAddress.toString())
        setSecretKeyContext(HexString.fromUint8Array(account.privateKey.toUint8Array()).toString())
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

  const faucetAptTestnet = async (accountAddress: string) => {
    if (network === Network.TESTNET) {
      try {
        await faucetClient.fundAccount(accountAddress.toString(), 100_000_000)
      } catch (e) {
        console.log(e)
      }
    }
  }

  const handleGenerateNewWallet = async () => {
    try {
      const account = Account.generate()
      setSecretKeyContext(account.accountAddress.toString())
      setSecretKey(HexString.fromUint8Array(account.privateKey.toUint8Array()).toString())
      setData('secretKey', JSON.stringify(HexString.fromUint8Array(account.privateKey.toUint8Array()).toString()))
      await faucetAptTestnet(account.accountAddress.toString())
      setIsImportSuccess(true)
      toggle()
    } catch (e) {
      setIsImportSuccess(false)
      console.log(e)
    }
  }

  const handleCopy = (value: string) => {
    setCopyText('Copied!')
    setTimeout(() => {
      setCopyText('Copy')
    }, 1000)
    copyToClipboard(value)
  }

  return (
    <div className="pt-10 sm:pt-20 pb-20 px-5">
      <h1 className="text-[#000000] text-center text-2xl sm:text-3xl font-semibold">Your Tickle Wallet</h1>
      <TickleStep />
      <div className={'max-w-[580px] mx-auto '}>
        <Typography className="text-[#000000] font-semibold mt-16 text-lg text-center ">Your Aptos address:</Typography>
        <p className="mt-3 font-medium text-center ">
          This is the Aptos address of your Ticklr wallet. Send $APT to this address to fund your Ticklr wallet and
          start your game.
        </p>
        <div
          style={{ wordBreak: 'break-word' }}
          className="bg-[#EEC5C7]  text-[#000] border-0 mt-8 min-h-14 p-5 rounded-[16px]"
        >
          <div className={'flex justify-between w-full items-center'}>
            <div className={'font-medium'}>
              <div className={'text-base'}>Home</div>
              <div className={'flex items-center gap-2'}>
                <div>Account ({ellipseAddress(addressContext.toString(), 5)})</div>
                <Tooltip title={copyText}>
                  <div onClick={() => handleCopy(addressContext.toString())} className={'cursor-pointer'}>
                    <CopyIcon />
                  </div>
                </Tooltip>
              </div>
            </div>
            <Avatar />
          </div>
          <Divider className={'border-t border-[#F9F4F3]'} />
          <div className={'flex justify-between text-base font-medium'}>
            <div>APT Balance</div>
            <span className={'font-bold'}>{formatNumberBalance(aptBalance, 2)}</span>
          </div>
          <div className={'flex justify-between text-base font-medium mt-5'}>
            <div>$HEART Balance</div>
            <span className={'font-bold text-[#CA5C3B] exo-2'}>{formatNumberBalance(current_plays, 0)} </span>
          </div>
          <Button
            onClick={() => setShowSendToken(true)}
            className={'font-medium bg-[#CA5C3B] rounded-[100px] text-base text-[#fff] w-full border-0 mt-5 h-11'}
          >
            Send
          </Button>
        </div>

        <div className="text-center max-w-[580px] mx-auto mt-10">
          <h1 className="text-[#000000] text-center text-2xl font-semibold">Your secret key:</h1>
          <div className={'space-y-1'}>
            <p className="mt-3 font-medium">
              This is the private key of your Ticklr wallet. Import it into a Aptos mobile or browser wallet to withdraw
              the $HEART you mine.
            </p>
            <p className="font-medium">
              Your Ticklr wallet is stored in your browser, only you have access to it. Clearing cookies will delete
              your wallet, and we cannot recover it for you.
            </p>
          </div>
          <p className="font-medium">Copy your secret key and keep it safe, this allows you to restore your wallet.</p>
          <div
            style={{ wordBreak: 'break-word' }}
            className="bg-[#ff000026] text-[#000] gap-2 font-medium justify-center text-center border-0 mt-8 min-h-14 flex items-start rounded-[16px] p-5"
          >
            {secretKey as string}
            <Tooltip title={copyText}>
              <div onClick={() => handleCopy(secretKey.toString())} className={'cursor-pointer'}>
                <CopyIcon />
              </div>
            </Tooltip>
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
                  loading={loading}
                  disabled={loading}
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
      </div>
      <ModalWarningImportWallet
        loading={loading}
        isModalOpen={!!show}
        handleClose={toggle}
        onOk={() => (mode === WARNING_MODE.IMPORT_WALLET ? handleImport() : handleGenerateNewWallet())}
      />
      <ModalTransferToken isModalOpen={!!showSendToken} handleClose={toggleSendToken} refetch={refetch} />
    </div>
  )
}
