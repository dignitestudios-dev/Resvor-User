/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import AuthButton from "../auth/AuthButton";
// import { forgotLogo } from "../../assets/export";
import TextCountDown from "./TextCountDown";
import AuthSuccessModal from "../auth/AuthSuccessModal";
import { FaArrowLeftLong } from "react-icons/fa6";

const VerifyPhone = ({ handleNext, handlePrevious }) => {
  const inputs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [requestSendModal, setRequestSendModal] = useState(false);

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
    setRequestSendModal(true);
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
    <div className="grid lg:grid-cols-1 grid-cols-1 w-full text-white">
      <div className="flex justify-start items-center">
        <button type="button" onClick={() => handlePrevious()}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center h-auto ">
        {/* <div>
          <img src={forgotLogo} alt="logo" className="w-[220px]" />
        </div> */}
        <div className="mt-4 py-4 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
          <p className=" xxl:text-[48px] text-[32px] font-[600] capitalize">
            verification
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] w-[304px] ">
            Please enter OTP code sent your phone.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[460px] md:w-[550px] w-[320px] mt-4">
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
                  className="xxl:h-[79px] xxl:w-[79px] h-[70px] w-[70px] rounded-[12px] outline-none text-center border-[1px] bg-white/10 backdrop-blur-[28.9px] placeholder:text-[#E6E6F0]
                placeholder:text-[16px] xxl:placeholder:text-[20px] focus-within:border-[#CACACA] flex items-center justify-center"
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2  mt-4 mb-3 relative z-10">
              <p className="text-center text-[16px] leading-[21.6px] text-white ">
                Didn&apos;t receive the code yet?
                {isActive ? (
                  <TextCountDown
                    isActive={isActive}
                    setIsActive={setIsActive}
                    seconds={seconds}
                    setSeconds={setSeconds}
                  />
                ) : (
                  <span
                    type="button"
                    // disabled={resendLoading}
                    onClick={handleResendOtp}
                    className=" font-medium pl-1 cursor-pointer"
                  >
                    Resend
                    {/* {resendLoading ? "Resending..." : "Resend"} */}
                  </span>
                )}
              </p>
            </div>
            <div className="w-full flex justify-center pl-4 mt-3 space-y-4 ">
              <div className="w-[360px] ">
                <AuthButton text="Verify" />
              </div>
            </div>
          </div>
        </form>
      </div>
      {requestSendModal && (
        <AuthSuccessModal
          isOpen={requestSendModal}
          onClick={() => {
            setRequestSendModal(false);
            handleNext();
          }}
          title="Number verified"
          description="Your number has been verified successfully."
        />
      )}
    </div>
  );
};

export default VerifyPhone;
