import { Button, Typography } from 'antd'
import React from 'react'

import { HeartIcon, LeftIcon, RightIcon } from '@/common/components/Icons/common'

const Page: React.FunctionComponent = () => {
  return (
    <div className="md:container max-w-[1536px] md:mx-auto w-full px-4 lg:px-8">
      <div className="min-h-screen py-20">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-[#000000] font-bold text-3xl">Earn more HEART</h1>
          <HeartIcon className="w-[30px] h-auto" />
        </div>
        <div className="flex justify-between items-center mt-8">
          <Typography className="text-[#000] font-medium text-xl">Daily Task</Typography>
          <div className="flex items-center gap-2">
            <Button className="border-[2px] border-[#EEC5C7] p-0 px-3 h-9 rounded-[25px]">
              <LeftIcon />
            </Button>
            <Button className="border-[2px] border-[#EEC5C7] p-0 px-3 h-9 rounded-[25px]">
              <RightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Page
