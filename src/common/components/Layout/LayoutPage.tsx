import React, { ReactNode } from 'react'

import { HeaderPage } from '@/common/components/Header'
import { Footer } from '@/common/components/Footer'

export const LayoutPage: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <HeaderPage />
      {children}
      <Footer />
    </>
  )
}
