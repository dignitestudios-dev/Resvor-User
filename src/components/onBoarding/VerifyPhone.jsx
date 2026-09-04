/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import AuthButton from "../auth/AuthButton";
import { forgotLogo } from "../../assets/export";
import TextCountDown from "./TextCountDown";
import AuthSuccessModal from "../auth/AuthSuccessModal";
import { LogOutIcon } from "lucide-react";
import { useVerifyPhone } from "../../hooks/mutations/OnboardingMutations";
import { ErrorToast } from "../global/Toaster";
import Cookies from "js-cookie";
import { setStoredTokenType } from "../../lib/authSession";
import { phoneFormatter } from "../../lib/helpers";
import ChangePhoneModal from "./ChangePhoneModal";

const VerifyPhone = ({ handleNext, handlePrevious, phoneNumber, setPhoneNumber }) => {
  const inputs = useRef([]);
  const verifyPhoneMutation = useVerifyPhone();

  const [currentPhone, setCurrentPhone] = useState(
    () => phoneNumber || localStorage.getItem("user_phone_number") || ""
  );
  const [isChangePhoneOpen, setIsChangePhoneOpen] = useState(false);

  useEffect(() => {
    if (phoneNumber) {
      setCurrentPhone(phoneNumber);
    }
  }, [phoneNumber]);

  const displayPhone = currentPhone ? (phoneFormatter(currentPhone) || currentPhone) : "";

  const [otp, setOtp] = useState(Array(5).fill(""));
  const isOtpComplete = otp.every((digit) => digit !== "");
  const isValidOtp = otp.join("").length === 5;

  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(30);
  const [requestSendModal, setRequestSendModal] = useState(false);

  const handleCloseSuccessModal = () => {
    setRequestSendModal(false);
    handleNext("complete_preferences");
  };

  useEffect(() => {
    let timer;
    if (requestSendModal) {
      timer = setTimeout(() => {
        handleCloseSuccessModal();
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [requestSendModal]);

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

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteData) return;

    const newOtp = [...otp];
    const startIndex = pasteData.length === otp.length ? 0 : index;

    for (let i = 0; i < pasteData.length; i++) {
      if (startIndex + i < otp.length) {
        newOtp[startIndex + i] = pasteData[i];
      }
    }
    setOtp(newOtp);

    const focusIndex = Math.min(startIndex + pasteData.length - 1, otp.length - 1);
    if (inputs.current[focusIndex]) {
      inputs.current[focusIndex].focus();
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
    if (!isOtpComplete || !isValidOtp) return;
    try {
      const response = await verifyPhoneMutation.mutateAsync({ otp: otp.join("") });

      if (response?.success) {
        // Persist any token returned by this step
        const token = response?.data?.token || response?.data?.accessToken;
        const tokenType = response?.data?.tokenType;
        if (token) {
          Cookies.set("token", token, { expires: 7 });
          localStorage.setItem("token", token);
        }
        if (tokenType) {
          Cookies.set("tokenType", tokenType, { expires: 7 });
          localStorage.setItem("tokenType", tokenType);
          setStoredTokenType(tokenType);
        }
        setRequestSendModal(true);
      } else {
        ErrorToast(response?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Phone verification error:", err);
      ErrorToast(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp(Array(5).fill("")); // Reset OTP fields
      handleRestart();
    } catch (err) {
      console.log("🚀 ~ handleResendOtp ~ err:", err);
    }
  };

  const handleRestart = () => {
    setSeconds(30);
    setIsActive(true);
  };

  const handlePhoneUpdated = (newPhone) => {
    setCurrentPhone(newPhone);
    if (setPhoneNumber) {
      setPhoneNumber(newPhone);
    }
    setOtp(Array(5).fill(""));
    handleRestart();
  };

  return (
    <div className="grid lg:grid-cols-1 grid-cols-1 w-full text-white">
      <div className=" absolute top-4 right-4">
        <button
          className="group relative bg-white rounded-md p-2 cursor-pointer"
          type="button"
          onClick={() => handlePrevious()}
        >
          {/* Tooltip text */}
          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 scale-0 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            Logout
          </span>

          <LogOutIcon color="black" size={24} />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center h-auto ">
        <div>
          <img src={forgotLogo} alt="logo" className="w-[220px]" />
        </div>
        <div className="mt-4 py-4 space-y-3 xxl:w-[450px] xxl:ml-12 text-center">
          <p className=" xxl:text-[48px] text-[32px] font-[600] capitalize">
            verification
          </p>
          <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-[#E6E6E6] max-w-[440px]">
            {displayPhone ? (
              <>
                A One-Time Password (OTP) has been sent to your registered phone{" "}
                <span className="font-semibold text-white">{displayPhone}</span>.
                Please enter it to proceed.
              </>
            ) : (
              "Please enter OTP sent to your phone."
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[400px] md:w-[550px] w-[320px] mt-4">
            <div className="xxl:w-[600px] xxl:m-4 grid grid-cols-5 sm:gap-20 gap-4 xl:w-[340px] lg:w-[360px] md:w-[550px] w-full ">
              {otp.map((digit, index) => (
                <input
                  inputMode="numeric"
                  key={index}
                  // type="password"
                  placeholder=""
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  ref={(el) => (inputs.current[index] = el)}
                  className="xxl:h-[79px] xxl:w-[79px] md:h-[70px] md:w-[70px] w-[60px] h-[60px] rounded-[12px] outline-none text-center border-[1px] bg-white/10 backdrop-blur-[28.9px] placeholder:text-[#E6E6F0]
                placeholder:text-[16px] xxl:placeholder:text-[20px] focus-within:border-[#CACACA] flex items-center justify-center"
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2  mt-4 mb-3 relative z-10">
              <p className="text-center text-[14px] leading-[21.6px] text-white ">
                {isActive ? "OTP resend in" : "Didn’t receive the OTP?"}
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
                    className="font-[600] pl-1 cursor-pointer"
                  >
                    Resend
                    {/* {resendLoading ? "Resending..." : "Resend"} */}
                  </span>
                )}
              </p>
            </div>
            <div className="w-full flex justify-center pl-4 mt-3 space-y-4 ">
              <div className="w-[360px] space-y-3">
                <AuthButton
                  text="Verify"
                  loading={verifyPhoneMutation.isPending}
                  disabled={!isOtpComplete || !isValidOtp || verifyPhoneMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setIsChangePhoneOpen(true)}
                  className="w-full text-center text-[14px] text-[#CACACA] hover:text-white underline font-[500] transition cursor-pointer"
                >
                  Change phone number
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {requestSendModal && (
        <AuthSuccessModal
          isOpen={requestSendModal}
          onClick={handleCloseSuccessModal}
          title="Number verified"
          description="Your number has been verified successfully."
        />
      )}
      {isChangePhoneOpen && (
        <ChangePhoneModal
          isOpen={isChangePhoneOpen}
          onClose={() => setIsChangePhoneOpen(false)}
          currentPhoneNumber={currentPhone}
          onSuccess={handlePhoneUpdated}
        />
      )}
    </div>
  );
};

export default VerifyPhone;
