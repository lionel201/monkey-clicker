import { Button, Divider, Dropdown, Input, Menu, Modal, notification, Typography } from 'antd'
import React, { useContext, useState } from 'react'
import { AddressIcon, DownIcon, RightIcon2 } from '@/common/components/Icons/common'
import { TokenItem } from '@/common/components/TokenItem'
import Image from 'next/image'
import useBalanceToken from '@/common/hooks/useBalanceToken'
import { NetworkContext } from '@/common/context'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import InputCurrency from '@/common/components/inputCurrency'
import useClient from '@/common/hooks/useClient'
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'
import Link from 'next/link'

interface Props {
  isModalOpen: boolean
  handleClose: () => void
  refetch: () => void
}

const tokens = [
  {
    symbol: 'APT',
    decimal: 8,
    address: '0x1::aptos_coin::AptosCoin',
    image: require('@/common/assets/images/apt.jpg'),
  },
]

export const ModalTransferToken: React.FunctionComponent<Props> = ({ isModalOpen, handleClose, refetch }) => {
  const [loading, setLoading] = useState(false)
  const [tokenSelected, setTokenSelected] = useState<any>(null)
  const [receiver, setReceiver] = useState('')
  const [amount, setAmount] = useState(0)
  const { getBalanceCoin } = useBalanceToken()
  const [error, setError] = useState('')
  const { aptos } = useClient()
  const {
    networkContext: [network],
    addressContext: [addressContext],
    secretKeyContext: [secretKey],
  } = useContext(NetworkContext)

  const { data: balance = 0 } = useQuery({
    queryKey: ['getAptBalance', addressContext, tokenSelected],
    queryFn: async () => {
      const balance = await getBalanceCoin(addressContext.toString(), '0x1::aptos_coin::AptosCoin')
      return BigNumber(balance).div(BigNumber(10).pow(8)).toNumber()
    },
    enabled: !!tokenSelected && !!addressContext,
  })

  const max = () => {
    setAmount(balance)
  }

  const validate = () => {
    if (!tokenSelected) {
      setError('Please select token.')
      return false
    }
    if (!amount) {
      setError('Please enter amount.')
      return false
    }
    if (amount > balance) {
      setError(`Insufficient balance of ${tokenSelected.symbol}`)
      return false
    }
    if (!receiver) {
      setError('Please enter receiver address.')
      return false
    }
    return true
  }

  const handleSend = async () => {
    if (!validate()) {
      return
    }
    try {
      setLoading(true)
      const privateKey = new Ed25519PrivateKey(secretKey)
      const account = Account.fromPrivateKey({ privateKey })
      const transaction = await aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: '0x1::aptos_account::transfer_coins',
          typeArguments: [tokenSelected.address],
          functionArguments: [receiver, BigNumber(amount).times(BigNumber(10).pow(8)).toString()],
        },
      })
      const pendingTransaction = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      })
      if (pendingTransaction) {
        console.log('pendingTransaction', pendingTransaction.hash)
        setAmount(0)
        notification.success({
          icon: <Image className={'w-[40px] h-auto'} src={require('@/common/assets/images/Icon.png')} alt={''} />,
          message: <div className={'text-[#344054] font-semibold'}>Transaction created</div>,
          description: (
            <Link
              className={'flex items-center gap-2'}
              href={`https://explorer.aptoslabs.com/txn/${pendingTransaction.hash}?network=${network}`}
            >
              <span className={'text-[#CA5C3B] font-semibold'}>View transaction</span>
              <RightIcon2 />
            </Link>
          ),
        })
        refetch()
      }
    } catch (e) {
      setLoading(false)
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onCancel={handleClose} centered visible={isModalOpen} footer={false} closable={false} width={450}>
      <div>
        <h1 className={'text-xl text-[#000] text-center font-semibold'}>Send Coins</h1>
        <Divider className={'border-t-[#fff]'} />
        <div>
          <div className={'text-[#344054] font-medium px-2'}>Asset</div>
          <Dropdown
            className={'mt-1'}
            overlay={
              <Menu className={'bg-[#fff] border border-[#D0D5DD] rounded-bl-[8px] rounded-br-[8px] '}>
                {tokens.map((item, index) => {
                  return (
                    <Menu.Item
                      onClick={() => {
                        setTokenSelected(item)
                        setError('')
                      }}
                      key={index}
                      className={'px-2'}
                    >
                      <TokenItem token={item} />
                    </Menu.Item>
                  )
                })}
              </Menu>
            }
            trigger={['click']}
            placement="bottomLeft"
          >
            <div
              className={
                'w-full bg-[#fff] border border-[#D0D5DD] cursor-pointer flex justify-between items-center rounded-[8px] p-3'
              }
            >
              {tokenSelected ? (
                <div className={'flex items-center gap-2'}>
                  <div>
                    <Image className={'w-[25px]'} src={tokenSelected.image} alt={''} />
                  </div>
                  <Typography className={'font-medium'}>{tokenSelected.symbol}</Typography>
                </div>
              ) : (
                <div>Choose Token</div>
              )}
              <DownIcon />
            </div>
          </Dropdown>
          <div className={'text-[#344054] font-medium mt-4 px-2'}>Amount</div>
          <div className={'bg-[#fff] rounded-[8px] flex items-center border px-3 border-[#D0D5DD] h-12'}>
            <InputCurrency
              inputAmount={amount > 0 ? amount.toString() : ''}
              onInputChange={(value) => {
                setError('')
                setAmount(value)
              }}
              max={balance}
            />
            <Button onClick={max} className={'border-[#667085] text-[#667085] font-bold rounded-[100px]'}>
              Max
            </Button>
          </div>

          <div className={'flex justify-between mt-3 text-[#475467] px-2'}>
            <div>Estimated Gas Fee</div>
            <div>--</div>
          </div>
          <div className={'text-[#344054] mt-4 font-medium px-2'}>Recipient Address</div>
          <Input
            onChange={(e) => {
              setReceiver(e.target.value)
              setError('')
            }}
            placeholder={'Enter Address'}
            className={'border-[#D0D5DD] mt-1 text-[#667085] text-lg placeholder:text-[#667085] rounded-[8px] h-12'}
            suffix={<AddressIcon />}
          />
          {error && <p className={'text-red-500 mt-2'}>{error}</p>}
          <div className={'flex gap-4 mt-5'}>
            <Button
              onClick={handleClose}
              className={'text-[#CA5C3B] flex-1 border-[#CA5C3B] bg-transparent rounded-[100px] h-11 font-medium'}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              disabled={loading}
              onClick={handleSend}
              className={'bg-[#CA5C3B] flex-1 border-0 rounded-[100px] text-[#fff] h-11 font-medium'}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
