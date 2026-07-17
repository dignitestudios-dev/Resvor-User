import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { flyerData } from "../../static/MockData";

const TemplateCarousel = ({ onSelectTemplate, selectedId: propSelectedId }) => {
  const swiperRef = useRef(null);
  const [localSelectedId, setLocalSelectedId] = useState(1);
  const selectedId = propSelectedId !== undefined ? propSelectedId : localSelectedId;

  // Use templates from MockData constants
  const templates = flyerData;

  const handlePrev = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleSelectTemplate = (template) => {
    if (propSelectedId === undefined) {
      setLocalSelectedId(template.id);
    }
    onSelectTemplate(template);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Previous template"
          type="button"
        >
          <ChevronLeft size={24} className="text-[#333333]" />
        </button>

        {/* Carousel */}
        <div className="flex-1 overflow-hidden">
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={4}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
            }}
            loop={false}
            className="w-full"
          >
            {templates.map((template) => (
              <SwiperSlide key={template.id}>
                <div
                  onClick={() => handleSelectTemplate(template)}
                  className="cursor-pointer group py-1"
                >
                  <div
                    className={`rounded-[12px] border-2 transition-all p-1.5 bg-white overflow-hidden hover:bg-gray-50 flex items-center justify-center ${selectedId === template.id
                      ? "border-[#0B0E52]"
                      : "border-transparent"
                      }`}
                  >
                    <div className="border border-[#F4F4F4] rounded-[10px] overflow-hidden w-full">
                      <img
                        src={template.image}
                        alt={template.name || `Template ${template.id}`}
                        className="w-full h-[60px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Next template"
          type="button"
        >
          <ChevronRight size={24} className="text-[#333333]" />
        </button>
      </div>
    </div>
  );
};

export default TemplateCarousel;
