import { Button, Layout, Menu } from 'antd'
import { Network } from 'aptos'
import { default as classNames, default as cx } from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

import { routes } from '@/common/components/Header/routers'
import { Logo } from '@/common/components/Icons/common'
import { NetworkContext } from '@/common/context'
import { getData, setData } from '@/common/hooks/useLocalstorage'
import { Squash as Hamburger } from 'hamburger-react'

import styles from './Header.module.scss'

const { Header } = Layout

export const HeaderPage: React.FunctionComponent = () => {
  const [pageName, setPageName] = useState('')
  const [network, setNetwork] = useState('')
  const [isOpen, setOpen] = useState(false)

  const router = useRouter()

  const {
    networkContext: [networkContext, setNetworkContext],
  } = useContext(NetworkContext)

  useEffect(() => {
    const netWorkLocal = getData('network')
    if (netWorkLocal) {
      setNetworkContext(netWorkLocal as Network)
      setNetwork(netWorkLocal)
    } else {
      setNetwork(networkContext as Network)
    }
  }, [networkContext])

  useEffect(() => {
    setPageName(router.pathname.replace('/', ''))
  }, [router])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <Header className="z-20 w-full flex items-center pb-0 bg-[#FFF] h-[60px]  sm:h-[75px] px-0 mobile:py-2 relative">
      {isOpen && (
        <div
          className={`header-nav-mobile top-[60px] sm:top-[70px] ${isOpen ? 'headerNav_mobileOpen' : 'headerNav_mobileClosed'}`}
        >
          <div className={'h-full w-full py-4 px-5'}>
            <ul className={'space-y-0'}>
              {routes.map(({ path, name }) => {
                return (
                  <li>
                    <Link
                      href={`/${path}`}
                      onClick={() => setOpen(false)}
                      className={` font-bold text-base ${pageName === path ? 'text-[#CA5C3B]' : 'text-[#8C8C8C]'}`}
                    >
                      {name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
      <div className="md:container max-w-[1536px] md:mx-auto w-full px-4 lg:px-8">
        <div className="mx-auto h-full w-full top-0 left-0 flex items-center justify-between relative">
          <div className={classNames('left-0 top-0 flex items-center relative')}>
            <Link href="/" className={classNames('h-full flex items-center justify-center')}>
              <div className="flex items-center gap-2 relative">
                <Logo className={'w-[50px] sm:w-[78px]'} />
              </div>
            </Link>
          </div>
          <div className="grow items-center justify-start h-full hidden sm:block pl-16">
            <Menu
              theme="light"
              className={cx(
                styles.menu,
                ' justify-center h-[75px] items-center min-w-[200px] w-full !bg-transparent hidden sm:flex',
              )}
            >
              <Menu
                theme="light"
                className={cx(
                  styles.menu,
                  ' justify-center h-[75px] items-center min-w-[200px] w-full !bg-transparent hidden sm:flex',
                )}
              >
                {routes.map(({ name, path }) => {
                  return (
                    <Menu.Item className={`${pageName === path && 'menu-active'} h-full mx-2 pr-2`} key={name}>
                      <Link
                        href={`/${path}` || '/'}
                        className="h6 font-medium text-[#8C8C8C] relative flex items-center h-full"
                        style={{ fontSize: '16px' }}
                      >
                        {name}
                      </Link>
                    </Menu.Item>
                  )
                })}
              </Menu>
            </Menu>
          </div>
          <div className=" h-full w-fit flex items-center gap-x-2">
            <div className="bg-[#ff000026] flex rounded-full p-1">
              <Button
                onClick={() => {
                  setNetwork(Network.MAINNET)
                  setData('network', Network.MAINNET)
                }}
                className={`${network == Network.MAINNET ? 'bg-[#CA5C3B] text-[#fff]' : 'bg-transparent text-[#000]'}  rounded-full border-0`}
              >
                Mainnet
              </Button>
              <Button
                onClick={() => {
                  setNetwork(Network.TESTNET)
                  setData('network', Network.TESTNET)
                }}
                className={`${network == Network.TESTNET ? 'bg-[#CA5C3B] text-[#fff]' : 'bg-transparent text-[#000]'} border-0 rounded-full`}
              >
                Testnet
              </Button>
            </div>
            <div className={'block md:hidden'}>
              <Hamburger color={'#CA5C3B'} size={24} toggled={isOpen} toggle={setOpen} />
            </div>
          </div>
        </div>
      </div>
    </Header>
  )
}
