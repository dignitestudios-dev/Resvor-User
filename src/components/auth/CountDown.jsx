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
      className="w-full py-3 bg-transparent border-[1px] border-[#CACACA] text-white text-sm font-[700] rounded-[12px] hover:opacity-90 transition"
    >
      <div className="flex justify-center items-center">
        <span className="mr-1">
          Resend Code {seconds > 0 && "00:" + seconds + "s"}
        </span>
      </div>
    </button>
  );
};

export default CountDown;
