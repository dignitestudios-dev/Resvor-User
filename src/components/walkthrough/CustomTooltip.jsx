import React from "react";

const CustomTooltip = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  isLastStep,
  tooltipProps,
}) => {
  return (
    <div
      {...tooltipProps}
      className="relative bg-white rounded-[20px] p-6 max-w-[380px] w-full shadow-2xl border border-gray-100 font-sans z-[99999]"
    >
      {/* Title */}
      {step.title && (
        <h3 className="text-[17px] font-bold text-[#181818] mb-2 leading-snug">
          {step.title}
        </h3>
      )}

      {/* Description */}
      <div className="text-[14px] text-[#555555] font-normal leading-relaxed mb-6">
        {step.content}
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          {...skipProps}
          type="button"
          className="bg-[#EFEFEF] hover:bg-gray-200 text-[#333333] px-6 py-2.5 rounded-[12px] text-[13px] font-semibold transition-all duration-200 cursor-pointer active:scale-95 outline-none"
        >
          Skip
        </button>

        <button
          {...primaryProps}
          type="button"
          className="bg-[#000033] hover:bg-[#000055] text-white px-6 py-2.5 rounded-[12px] text-[13px] font-semibold transition-all duration-200 cursor-pointer active:scale-95 outline-none shadow-sm"
        >
          {isLastStep ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default CustomTooltip;
