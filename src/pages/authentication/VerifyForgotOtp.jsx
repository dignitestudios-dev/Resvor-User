import { useLocation, useNavigate } from "react-router";
import AuthButton from "../../components/auth/AuthButton";
import { forgotLogo } from "../../assets/export";
import { useRef, useState } from "react";
import CountDown from "../../components/auth/CountDown";
import { FaArrowLeftLong } from "react-icons/fa6";

const VerifyForgotOtp = () => {
  const location = useLocation();
  const email = location?.state?.email;

  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(5).fill(""));
  const inputs = useRef([]);

  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(30);

  const handleChange = (e, index) => {
    const { value } = e.target;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/auth/update-password");
  };

  return (
    <div className="w-full flex flex-col items-center text-white px-4 py-6 relative">
      <div className="flex justify-start items-center absolute top-4 left-28">
        <button type="button" onClick={() => navigate(-1)}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div>
      {/* Logo */}
      <img
        src={forgotLogo}
        alt="logo"
        className="w-[140px] sm:w-[170px] lg:w-[220px] mb-4"
      />

      {/* Title */}
      <div className="text-center space-y-2 max-w-[38%] mb-6">
        <p className="text-[24px] sm:text-[32px] lg:text-[42px] font-semibold">
          Verify OTP
        </p>
        <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-[#E6E6E6]">
          A One-Time Password (OTP) has been sent to your registered email (
          {email}). Please enter it to proceed.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center"
      >
        {/* OTP Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-6 lg:gap-6 flex-wrap mb-5 w-full ">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="password"
              maxLength="1"
              value={digit}
              placeholder=""
              inputMode="numeric"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputs.current[index] = el)}
              className="
            h-[40px] w-[40px]    
            sm:h-[50px] sm:w-[50px]
            md:h-[55px] md:w-[55px]
            lg:h-[70px] lg:w-[70px]
            text-center text-[16px] sm:text-[18px] lg:text-[20px]
            rounded-[10px] bg-transparent border border-[#D9D9D9]
            placeholder:text-white
            outline-none text-white focus:border-[#8A8A8A]
          "
            />
          ))}
        </div>

        {/* Button & Countdown */}
        <div
          className=" w-full 
          max-w-[300px]
          sm:max-w-[350px]
          md:max-w-[400px]
          lg:max-w-[450px]
          xl:max-w-[450px]
          flex flex-col gap-4"
        >
          <AuthButton text="Verify" />
          <CountDown
            isActive={isActive}
            setIsActive={setIsActive}
            seconds={seconds}
            setSeconds={setSeconds}
          />
          <button
            onClick={() => navigate("/auth/forget-password")}
            type="button"
            className=" px-4 py-2 text-sm font-semibold text-red-500 
             border border-red-400 rounded-lg 
             hover:bg-red-50 hover:text-red-600 
             transition-colors duration-200 ease-in-out"
          >
            Wrong email? Change it
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyForgotOtp;
