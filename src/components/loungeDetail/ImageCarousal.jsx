/* eslint-disable react/prop-types */
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/thumbs";
import {
  loginSideImg,
  loungeImg,
  NoInternetImage,
  qrSnap,
} from "../../assets/export";

const images = [loungeImg, qrSnap, NoInternetImage, loginSideImg];

export default function ImageCarousel({ height }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="w-full p-4">
      {/* Main Carousel */}
      <Swiper
        modules={[Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        className={`rounded-xl overflow-hidden h-[${height}] mb-4`}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="object-cover w-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Carousel */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        spaceBetween={8}
        slidesPerView={5}
        watchSlidesProgress
        className="thumbs-swiper"
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="cursor-pointer opacity-60 transition-opacity duration-300 
                       [&.swiper-slide-thumb-active]:opacity-100 
                       [&.swiper-slide-thumb-active]:border-2 
                       [&.swiper-slide-thumb-active]:border-blue-500 
                       rounded-lg overflow-hidden"
          >
            <div className="relative w-full h-20 bg-gray-100">
              <img
                src={src}
                alt={`Thumb ${index + 1}`}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
