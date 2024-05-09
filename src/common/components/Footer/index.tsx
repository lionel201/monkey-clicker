import Link from 'next/link'
import React from 'react'

export const Footer: React.FunctionComponent = () => {
  return (
    <div className="md:container max-w-[1536px] md:mx-auto w-full px-4 lg:px-8 py-5">
      <div className="flex flex-col sm:flex-row items-center gap-2 justify-between text-[#000000]">
        <div>© 2024 TickleToEarn</div>
        <div className={'flex gap-4'}>
          <Link href="">Terms of Service</Link>
          <Link href="">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
