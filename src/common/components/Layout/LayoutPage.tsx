import React, { ReactNode } from 'react'

import { Footer } from '@/common/components/Footer'
import { HeaderPage } from '@/common/components/Header'

export const LayoutPage: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <HeaderPage />
      {children}
      <Footer />
    </>
  )
}
