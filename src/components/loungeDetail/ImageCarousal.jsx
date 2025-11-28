/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import {
  loginSideImg,
  loungeImg,
  NoInternetImage,
  qrSnap,
} from "../../assets/export";

const images = [loungeImg, qrSnap, NoInternetImage, loginSideImg];

export default function ImageCarousel({ height }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);

  return (
    <div className="w-full p-4">
      {/* Main Carousel */}
      <Swiper
        ref={swiperRef}
        modules={[Thumbs, Navigation]}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        className={`rounded-xl overflow-hidden h-[${height}] mb-4 relative`}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="object-cover w-full h-full"
              />

              {/* Left Arrow */}
              <button
                onClick={() => swiperRef.current?.swiper.slidePrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 transition-all shadow-md"
                aria-label="Previous slide"
              >
                <IoChevronBack size={24} />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => swiperRef.current?.swiper.slideNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 transition-all shadow-md"
                aria-label="Next slide"
              >
                <IoChevronForward size={24} />
              </button>
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
