/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";

const PasswordOtpModal = ({ onClose, onClick, onNext }) => {
  console.log("🚀 ~ PasswordOtpModal ~ onClose:", onClose);
  const inputs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(30);

  const handleChange = (e, index) => {
    const { value } = e.target;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next only if next is empty
      const nextIndex = index + 1;
      if (nextIndex < otp.length && !newOtp[nextIndex]) {
        inputs.current[nextIndex].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // prevent default backspace behavior
      const newOtp = [...otp];

      if (otp[index]) {
        // Just clear current input if not already empty
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move focus back and clear previous
        inputs.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If onNext exists, use it (for multi-step flow); otherwise use onClick
    if (onNext) {
      onNext(otp.join(""));
    } else if (onClick) {
      onClick();
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp(Array(6).fill("")); // Reset OTP fields
      handleRestart();
    } catch (err) {
      console.log("🚀 ~ handleResendOtp ~ err:", err);
    }
  };

  const handleRestart = () => {
    setSeconds(30);
    setIsActive(true);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] pb-4 overflow-y-auto">
        <div className="flex justify-end items-center px-8 pt-4 ">
          <div onClick={() => onClose()} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        {/* <div>
          <img src={forgotLogo} alt="logo" className="w-[220px]" />
        </div> */}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 w-full pt-4 px-16">
            <div className="py-2 space-y-2 text-center">
              <h2 className="text-[36px] font-semibold mb-2 capitalize">
                Verification
              </h2>
              <p className="text-[#565656] text-[16px]">
                Please enter OTP code sent to your Email and Number.
              </p>
            </div>

            <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[460px] md:w-[550px] w-[320px] mt-2 mb-8">
              <div className="xxl:w-[600px] xxl:m-4 grid grid-cols-6 gap-20 xl:w-[340px] lg:w-[360px] md:w-[550px] w-full ">
                {otp.map((digit, index) => (
                  <input
                    inputMode="numeric"
                    key={index}
                    type="password"
                    placeholder="0"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputs.current[index] = el)}
                    className="xxl:h-[79px] xxl:w-[79px] h-[70px] w-[70px] rounded-[12px] outline-none text-center border-[1px] border-[#BEBEBE] placeholder:text-[#E6E6F0]
                placeholder:text-[16px] xxl:placeholder:text-[20px] focus-within:border-[#CACACA] flex items-center justify-center"
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 pl-4 mt-4 mb-3 relative z-10">
                <p className="text-center text-[14px] leading-[21.6px] ">
                  Didn&apos;t receive the code yet?
                  <span
                    type="button"
                    className="font-[600] pl-1 cursor-pointer text-blue-950"
                  >
                    Resend now
                  </span>
                </p>
              </div>
              <div className="w-full flex justify-center pl-4 mt-4 space-y-4 ">
                <div className="w-[360px] ">
                  <button
                    onClick={onClick}
                    className="flex-1 py-3 bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-semibold rounded-[12px] w-full"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordOtpModal;
