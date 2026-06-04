/* eslint-disable react/prop-types */
import { useState, useRef, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";

export default function ImageCarousel({ images = [], height = "300px" }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);

  // Normalize images so component works with multiple APIs
  const normalizedImages = useMemo(() => {
    if (!Array.isArray(images)) return [];

    return images
      .map((img) => {
        if (typeof img === "string") return img;       // already URL
        if (img?.location) return img.location;        // API format
        return null;
      })
      .filter(Boolean);
  }, [images]);

  if (!normalizedImages.length) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {/* Main Carousel */}
      <Swiper
        ref={swiperRef}
        modules={[Thumbs, Navigation]}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        loop={normalizedImages.length > 1}
        style={{ height }}
        className="rounded-xl overflow-hidden mb-4 relative"
      >
        {normalizedImages.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="object-cover w-full h-full"
              />

              {/* Left Arrow */}
              {normalizedImages.length > 1 && (
                <button
                  onClick={() => swiperRef.current?.swiper.slidePrev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-md"
                >
                  <IoChevronBack size={24} />
                </button>
              )}

              {/* Right Arrow */}
              {normalizedImages.length > 1 && (
                <button
                  onClick={() => swiperRef.current?.swiper.slideNext()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-md"
                >
                  <IoChevronForward size={24} />
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      {normalizedImages.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={8}
          slidesPerView={5}
          watchSlidesProgress
          className="thumbs-swiper"
        >
          {normalizedImages.map((src, index) => (
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
                  className="object-cover w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}