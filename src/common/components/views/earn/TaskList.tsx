import { Button, Card, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import Slider from 'react-slick'

interface Props {
  title: string
}

import { BallIcon, FishBone, HandDogIcon, HeartIcon, LeftIcon, RightIcon } from '@/common/components/Icons/common'
import Image from 'next/image'

const settings = {
  dots: false,
  navs: true,
  infinite: true,
  speed: 500,
  autoplay: false,
  autoplaySpeed: 3000,
  variableWidth: false,
  // centerMode:true,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        rows: 1,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        rows: 1,
      },
    },
    {
      breakpoint: 1065,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        rows: 1,
      },
    },
    {
      breakpoint: 765,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        rows: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 1,
      },
    },
  ],
}

export const TaskList: React.FunctionComponent<Props> = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef: any = useRef()

  const data = [1, 2, 3, 4, 5, 6]

  const handleNext = () => {
    sliderRef?.current.slickNext()
  }

  const handlePrev = () => {
    sliderRef?.current.slickPrev()
  }

  return (
    <div>
      <div className="flex justify-between items-center mt-8">
        <Typography className="text-[#000] font-medium text-xl">{title}</Typography>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrev}
            className="border-[2px] border-[#EEC5C7] p-0 px-3 h-9 flex items-center rounded-[25px]"
          >
            <LeftIcon />
          </Button>
          <Button
            onClick={handleNext}
            className="border-[2px] border-[#EEC5C7] flex items-center p-0 px-3 h-9 rounded-[25px]"
          >
            <RightIcon />
          </Button>
        </div>
      </div>
      <Slider
        beforeChange={(currentSlide, nextSlide) => {
          setCurrentIndex(nextSlide)
        }}
        ref={sliderRef}
        {...settings}
        className="slider_subs transform_y mt-4"
      >
        {data.map((item, i) => (
          <Card key={i} className={'border-[2px] border-[#EEC5C7] rounded-[30px] relative z-20'}>
            <div className={'absolute top-3 right-16'}>
              <BallIcon />
            </div>
            <div className={'absolute top-0 right-0 z-10 rounded-[30px]'}>
              <HandDogIcon />
            </div>
            <div className={'absolute top-[70px] right-3 z-10 '}>
              <FishBone />
            </div>
            <Image src={require('@/common/assets/images/twitter.png')} alt={''} />
            <h1 className={'text-[#000] font-bold text-2xl mt-6'}>Follow X</h1>
            <p className={'text-[#000]'}>Retweet a daily tweet to earn HEART</p>
            <div className={'flex mt-8'}>
              <span className={'bg-[#F5EEEC] border flex gap-2 items-center border-[#EEC5C7] rounded-[25px] px-3 py-2'}>
                <span className={'text-[#000000] font-medium'}>+50,000</span>
                <HeartIcon className={'w-[15px] h-auto'} />
              </span>
            </div>
          </Card>
        ))}
      </Slider>
    </div>
  )
}
export default TaskList
