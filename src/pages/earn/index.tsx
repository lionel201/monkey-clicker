import React from 'react'

import { DogHand, HeartIcon } from '@/common/components/Icons/common'
import TaskList from '@/common/components/views/earn/TaskList'

const Page: React.FunctionComponent = () => {
  return (
    <>
      <div className={'absolute right-[220px] hidden md:block top-[100px]'}>
        <DogHand />
      </div>
      <div className={'absolute right-[180px] hidden md:block rotate-[-60deg] top-[140px]'}>
        <DogHand className={'w-[35px] h-auto'} />
      </div>
      <div className={'absolute right-[170px]  hidden md:block top-[190px]'}>
        <DogHand className={'w-[35px] h-auto'} />
      </div>
      <div className={'absolute right-[100px] hidden md:block top-[190px]'}>
        <DogHand className={'w-[35px] h-auto'} />
      </div>
      <div className="container max-w-[1440px] md:mx-auto w-full px-4 lg:px-8 relative ">
        <div className="min-h-screen pb-20 pt-20">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-[#000000] font-bold text-3xl">Earn more HEART</h1>
            <HeartIcon className="w-[30px] h-auto" />
          </div>
          <div className={'mt-10 pb-20'}>
            <TaskList title={'Daily Task'} />
            <TaskList title={'Onboarding Task'} />
            <TaskList title={'Social Task'} />
          </div>
        </div>
      </div>
    </>
  )
}
export default Page
