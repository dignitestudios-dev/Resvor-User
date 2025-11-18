/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";

const VerifyNewNumberOtpModal = ({ onClose, onNext, newNumber }) => {
  const inputs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  const handleChange = (e, index) => {
    const { value } = e.target;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      // Move to next only if next is empty
      const nextIndex = index + 1;
      if (nextIndex < otp.length && !newOtp[nextIndex]) {
        inputs.current[nextIndex].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputs.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    onNext(otpCode);
  };

  const handleResendOtp = () => {
    setOtp(Array(6).fill(""));
    setError("");
    // API call to resend OTP would go here
    console.log("Resend OTP for new number:", newNumber);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] pb-4 overflow-y-auto">
        <div className="flex justify-end items-center px-8 pt-4">
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full pt-4 px-16">
          <div className="py-2 space-y-2 text-center">
            <h2 className="text-[36px] font-semibold mb-2 capitalize">
              Verify New Number
            </h2>
            <p className="text-[#565656] text-[16px]">
              Please enter OTP code sent to your new phone number.
            </p>
          </div>

          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[460px] md:w-[550px] w-[320px] mt-2 mb-8">
            <div className="xxl:w-[600px] xxl:m-4 grid grid-cols-6 gap-20 xl:w-[340px] lg:w-[360px] md:w-[550px] w-full">
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
                  className="xxl:h-[79px] xxl:w-[79px] h-[70px] w-[70px] rounded-[12px] outline-none text-center border-[1px] border-[#BEBEBE] placeholder:text-[#E6E6F0] placeholder:text-[16px] xxl:placeholder:text-[20px] focus-within:border-[#CACACA] flex items-center justify-center"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-[14px] text-center">{error}</p>
            )}

            <div className="flex items-center justify-center gap-2 pl-4 mt-4 mb-3 relative z-10">
              <p className="text-center text-[14px] leading-[21.6px]">
                Didn&apos;t receive the code yet?
                <span
                  onClick={handleResendOtp}
                  className="font-[600] pl-1 cursor-pointer text-blue-950"
                >
                  Resend now
                </span>
              </p>
            </div>

            <div className="w-full flex justify-center pl-4 mt-4 space-y-4">
              <div className="w-[360px]">
                <Button text="Verify" type="button" onClick={handleVerify} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyNewNumberOtpModal;
