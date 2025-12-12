/* eslint-disable react/prop-types */
import { useEffect } from "react";

const CountDown = ({ isActive, setIsActive, seconds, setSeconds }) => {
  // Start the countdown when `isActive` is true
  useEffect(() => {
    let timer;
    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1); // decrease seconds by 1
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false); // stop the countdown when it reaches 0
    }

    return () => clearInterval(timer); // clear timer on cleanup
  }, [isActive, seconds]);

  const handleRestart = () => {
    setSeconds(30);
    setIsActive(true);
  };

  return (
    <button
      type="button"
      onClick={() => handleRestart()}
      className={`w-full py-3 text-sm font-[700] rounded-[12px] transition
    ${
      seconds > 0
        ? "bg-gray-500 border-gray-400 text-gray-300 cursor-not-allowed opacity-70"
        : "bg-transparent border-[1px] border-[#CACACA] text-white hover:opacity-90"
    }
  `}
      disabled={seconds > 0}
    >
      <div className="flex justify-center items-center">
        <span className="mr-1">
          {seconds > 0
            ? `Resend in 00:${seconds}s`
            : "Didn’t receive the OTP? Resend"}
        </span>
      </div>
    </button>
  );
};

export default CountDown;
