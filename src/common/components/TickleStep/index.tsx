import React from 'react'
import { Col, Row, Typography } from 'antd'
import { BallIcon, FishBone, LineStep, LineStep2, MouseIcon, StepBox } from '@/common/components/Icons/common'

export const TickleStep: React.FunctionComponent = () => {
  return (
    <div className={'mt-8 text-center max-w-[1140px] mx-auto'}>
      <p className={'text-[#000] text-base font-semibold mt-10'}>How to deposit and start to play the game</p>
      <Row gutter={[32, 32]} className={'mt-10 sm:mt-20'}>
        <Col xs={24} xl={8}>
          <div>
            <div className={'flex justify-center'}>
              <div className={'relative'}>
                <div className={'absolute hidden sm:block -top-10 left-14'}>
                  <LineStep />
                </div>
                <div className={'absolute bottom-0 -right-1'}>
                  <FishBone />
                </div>
                <StepBox />
                <Typography
                  className={
                    'text-5xl text-[#fff] font-medium absolute flex justify-center w-full bottom-[50%] translate-y-2/4'
                  }
                >
                  01
                </Typography>
              </div>
            </div>
            <Typography className={'text-[#080708] font-semibold text-base mt-4'}>Auto generate your Wallet</Typography>
            <p className={'text-[#08070899] max-w-[250px] mx-auto font-medium mt-2'}>
              Click the “ New Wallet” button below to auto generate your Tickle Wallet
            </p>
          </div>
        </Col>
        <Col xs={24} xl={8}>
          <div>
            <div className={'flex justify-center'}>
              <div className={'relative'}>
                <div className={'absolute hidden sm:block -bottom-5 left-20'}>
                  <LineStep2 />
                </div>
                <div className={'absolute top-4 right-3'}>
                  <MouseIcon className={'w-[50px] h-auto'} />
                </div>
                <StepBox />
                <Typography
                  className={
                    'text-5xl text-[#fff] font-medium absolute flex justify-center w-full bottom-[50%] translate-y-2/4'
                  }
                >
                  02
                </Typography>
              </div>
            </div>
            <Typography className={'text-[#080708] font-semibold text-base mt-4'}>Backup your Tickle Wallet</Typography>
            <p className={'text-[#08070899] max-w-[250px] mx-auto font-medium mt-2'}>
              Copy your secret key and keep it safe, this allows you to restore your wallet.
            </p>
          </div>
        </Col>
        <Col xs={24} xl={8}>
          <div>
            <div className={'flex justify-center'}>
              <div className={'relative'}>
                <div className={'absolute -bottom-4 -right-3'}>
                  <BallIcon className={'w-[50px] h-auto'} />
                </div>
                <StepBox />
                <Typography
                  className={
                    'text-5xl text-[#fff] font-medium absolute flex justify-center w-full bottom-[50%] translate-y-2/4'
                  }
                >
                  03
                </Typography>
              </div>
            </div>
            <Typography className={'text-[#080708] font-semibold text-base mt-4'}>
              Deposit your APT and start
            </Typography>
            <p className={'text-[#08070899] max-w-[250px] mx-auto font-medium mt-2'}>
              Send APT to your Tickle Wallet to pay the network fee and start to tickle.
            </p>
          </div>
        </Col>
      </Row>
    </div>
  )
}
