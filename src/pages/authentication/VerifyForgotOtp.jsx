import { useNavigate } from "react-router";
import AuthButton from "../../components/auth/AuthButton";
import { forgotLogo } from "../../assets/export";
import { useRef, useState } from "react";
import CountDown from "../../components/auth/CountDown";

const VerifyForgotOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputs = useRef([]);

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
    navigate("/auth/update-password");
  };

  return (
    <div className="grid lg:grid-cols-1 grid-cols-1 w-full text-white">
      <div className="flex flex-col justify-center items-center h-auto ">
        <div>
          <img src={forgotLogo} alt="logo" className="w-[220px]" />
        </div>
        <div className="mt-4 py-4 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
          <p className=" xxl:text-[48px] text-[32px] font-[600] capitalize">
            check your email
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] w-[304px] ">
            We have sent a password recover instructions to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[360px] md:w-[550px] w-[320px] mt-4">
            <div className="xxl:w-[600px] xxl:m-4 grid grid-cols-6 gap-16 xl:w-[300px] lg:w-[360px] md:w-[550px] w-full ">
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
                  className="xxl:h-[79px] xxl:w-[79px] h-[49px] w-[49px] rounded-[12px] outline-none text-center border-[1px] border-[#D9D9D9] placeholder:text-[#181818]
                placeholder:text-[16px] xxl:placeholder:text-[20px] focus-within:border-[#8A8A8A] flex items-center justify-center"
                />
              ))}
            </div>
            <div className="xxl:w-[600px] lg:w-[370px] md:w-[550px] w-full mt-3 space-y-4 ">
              <AuthButton text="Verify" />
              <CountDown
                isActive={isActive}
                setIsActive={setIsActive}
                seconds={seconds}
                setSeconds={setSeconds}
              />
            </div>
          </div>
        </form>
      </div>
      {/* {requestModal && (
        <RequestModal setIsOpen={setRequestModal} isLogin={true} />
      )} */}
    </div>
  );
};

export default VerifyForgotOtp;
