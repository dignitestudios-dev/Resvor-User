import React from "react";

const WelcomeModal = ({ isOpen, onStart, onSkip }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-[24px] p-8 max-w-[460px] w-full text-center shadow-2xl flex flex-col items-center gap-5">
        {/* Halo Emoji Graphic */}
        <div className="w-24 h-24 flex items-center justify-center relative my-2">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Halo Ring */}
            <ellipse
              cx="50"
              cy="20"
              rx="28"
              ry="8"
              stroke="#3B82F6"
              strokeWidth="6"
              fill="none"
              className="animate-pulse"
            />
            {/* Emoji Head */}
            <circle cx="50" cy="58" r="32" fill="url(#emojiGradient)" />
            {/* Eyes */}
            <path
              d="M 38 52 Q 43 45 48 52"
              stroke="#2C1810"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 52 52 Q 57 45 62 52"
              stroke="#2C1810"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Smile */}
            <path
              d="M 40 65 Q 50 75 60 65"
              stroke="#2C1810"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            <defs>
              <linearGradient
                id="emojiGradient"
                x1="20"
                y1="26"
                x2="80"
                y2="90"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FFC837" />
                <stop offset="60%" stopColor="#FF8008" />
                <stop offset="100%" stopColor="#FF5E62" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-[30px] font-bold text-[#181818] tracking-tight leading-tight">
          Welcome To Resvor!
        </h2>

        {/* Description */}
        <p className="text-[#555555] text-[15px] font-normal leading-relaxed max-w-[380px]">
          Here’s a quick walkthrough to help you manage bookings, track guests,
          and maximize Resvor’s tools.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onStart}
            className="flex-1 bg-[#000033] hover:bg-[#000055] text-white py-3.5 px-4 rounded-[14px] text-[14px] font-semibold transition-all duration-200 shadow-md cursor-pointer active:scale-95"
          >
            Start Walkthrough
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="flex-1 bg-[#F2F2F5] hover:bg-[#E5E5EA] text-[#252525] py-3.5 px-4 rounded-[14px] text-[14px] font-semibold transition-all duration-200 cursor-pointer active:scale-95"
          >
            Skip For Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
