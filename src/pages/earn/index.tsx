import React from 'react'

import { HeartIcon } from '@/common/components/Icons/common'
import TaskList from '@/common/components/views/earn/TaskList'

const Page: React.FunctionComponent = () => {
  return (
    <div className="md:container max-w-[1536px] md:mx-auto w-full px-4 lg:px-8">
      <div className="min-h-screen py-20">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-[#000000] font-bold text-3xl">Earn more HEART</h1>
          <HeartIcon className="w-[30px] h-auto" />
        </div>
        <div className={'mt-10'}>
          <TaskList title={'Daily Task'} />
          <TaskList title={'Onboarding Task'} />
          <TaskList title={'Social Task'} />
        </div>
      </div>
    </div>
  )
}
export default Page
