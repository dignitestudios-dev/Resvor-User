/* eslint-disable react/prop-types */
import { useEffect } from "react";

const TextCountDown = ({ isActive, setIsActive, seconds, setSeconds }) => {
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

  return (
    <span className="countdown">
      <p className="xxl:text-[22px] xxl:mt-4 text-[13px] text-white font-bold">
        0:{seconds}
      </p>
    </span>
  );
};

export default TextCountDown;
