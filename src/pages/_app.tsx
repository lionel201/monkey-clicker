import '@/styles/globals.css'

import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'

import { LayoutPage } from '@/common/components/Layout/LayoutPage'
import NetworkContextProvider from '@/common/context/NetworkContextProvider'
import queryClient from '@/config/queryClient'
import { useEffect } from 'react'
import { telegram } from '@/common/hooks/telegramBot'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    telegram.ready()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkContextProvider>
        <LayoutPage>
          <Component {...pageProps} />
        </LayoutPage>
      </NetworkContextProvider>
    </QueryClientProvider>
  )
}
