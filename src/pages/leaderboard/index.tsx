import React from 'react'
import { Button, Card, Col, Row, Typography } from 'antd'
import { HeartIcon, Ticker1, Ticker2 } from '@/common/components/Icons/common'
import { Top1Icon, Top2Icon, Top3Icon } from '@/common/components/Icons/rank'
import { ellipseAddress } from '@/utils'

const Page: React.FunctionComponent = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <>
      <div className={'absolute left-0 top-[20%]'}>
        <Ticker1 />
      </div>
      <div className={'absolute left-0 top-[10%]'}>
        <Ticker2 />
      </div>
      <div className="container max-w-[1440px] md:mx-auto w-full px-4 lg:px-8 relative pt-20 pb-20">
        <div className={'max-w-[600px] mx-auto'}>
          <Card className={'border-[#EEC5C7] rounded-[16px]'}>
            <h1 className={'text-[#000000] text-center text-2xl font-bold'}>Total HEART Balance</h1>
            <div className={'flex justify-center gap-3 mt-5'}>
              <HeartIcon className={'w-[30px] h-auto'} />
              <Typography className={'text-4xl text-[#CA5C3B] font-bold'}>789,153,525</Typography>
            </div>
          </Card>
          <div className={'mt-10'}>
            <h1 className={'text-2xl font-medium text-[#000]'}>Leaderboard</h1>
            <div className={'bg-[#fff] rounded-[12px] border border-[#EEC5C7] mt-4'}>
              <Row className={'py-3 px-4 border-b border-[#EEC5C7]'}>
                <Col span={3}></Col>
                <Col className={'text-[#475467] text-center font-semibold'} span={17}>
                  Wallet Address
                </Col>
                <Col className={'text-[#475467] text-end font-semibold'} span={4}>
                  HEART
                </Col>
              </Row>
              {data.map((item) => {
                return (
                  <Row className={'py-5 px-4 border-b border-[#EEC5C7]'}>
                    <Col span={3}>
                      <div className={'flex  font-medium items-center'}>
                        <Typography className={''}>{item}</Typography>
                        {item === 1 && <Top1Icon />}
                        {item === 2 && <Top2Icon />}
                        {item === 3 && <Top3Icon />}
                      </div>
                    </Col>
                    <Col className={'text-[#101828] text-center font-semibold'} xs={13} xl={17}>
                      <div className={'hidden sm:block'}>
                        {ellipseAddress('0x291318036cbef849b2524a3b2d2a6c64a73da3ae13377526f7fd46876764f6cf', 10)}
                      </div>
                      <div className={'block sm:hidden'}>
                        {ellipseAddress('0x291318036cbef849b2524a3b2d2a6c64a73da3ae13377526f7fd46876764f6cf', 6)}
                      </div>
                    </Col>
                    <Col className={'text-[#101828] text-end font-semibold'} xs={8} xl={4}>
                      9,153,233
                    </Col>
                  </Row>
                )
              })}
              <div className={'flex justify-between items-center p-5'}>
                <Typography className={'text-[#344054] font-medium'}>Page 1 of 10</Typography>
                <div className={'flex items-center gap-3'}>
                  <Button className={'border-[#EEC5C7] rounded-[8px] font-medium text-[#344054] h-9'}>Previous</Button>
                  <Button className={'border-[#EEC5C7] rounded-[8px] font-medium text-[#344054] h-9'}>Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
