import { Button, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import Slider from 'react-slick'

import { LeftIcon, RightIcon } from '@/common/components/Icons/common'

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

export const TaskList: React.FunctionComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef: any = useRef()

  const data = [1, 2, 3, 4, 5, 6]

  return (
    <div>
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
      <Slider
        beforeChange={(currentSlide, nextSlide) => {
          setCurrentIndex(nextSlide)
        }}
        ref={sliderRef}
        {...settings}
        className="slider_subs transform_y mt-8"
      >
        {data.map((item, i) => (
          <div key={i} className={''}></div>
        ))}
      </Slider>
    </div>
  )
}
export default TaskList
