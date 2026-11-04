/* eslint-disable react/prop-types */
import { normalizePhoneDigits, phoneFormatter } from "../../lib/helpers";

const PhoneInput = ({
  value,
  onChange,
  onBlur,
  id,
  name,
  isDisabled = false,
  autoComplete,
  error,
  touched,
  label,
  labelColor = "text-white",
  textColor = "text-white",
  countryCodeColor = "text-[#E6E6F0]",
  placeholderColor = "placeholder:text-[#E6E6F0]",
  borderColor = "border-[#CACACA]",
  bgColor = "bg-white/10",
}) => {
  const handleKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData ? e.clipboardData.getData("text") : "";
    const clean = normalizePhoneDigits(pastedText);
    const formatted = phoneFormatter(clean);
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name,
          id,
          value: formatted,
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    const clean = normalizePhoneDigits(rawValue);
    const formatted = phoneFormatter(clean);
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name,
          id,
          value: formatted,
        },
      });
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor="" className={`text-[14px] font-[500] ${labelColor} block mb-2`}>
          {label}
        </label>
      )}
      <div
        className={`flex items-center p-0 w-full pl-2 outline-none font-[500] rounded-[15px]
      border ${borderColor} placeholder:text-[12px] placeholder:font-[400]
      ${placeholderColor} ${countryCodeColor} ${bgColor} backdrop-blur-[28.9px] h-full px-3 text-sm`}
      >
        <span className="text-xl pr-2">
          <img
            src="https://flagcdn.com/w320/us.png"
            alt="US flag"
            className="w-6 h-4 mr-2"
          />
        </span>

        <span className="text-[12px] font-[400] w-[40px] text-center">{`+1`}</span>

        <div className="border-l h-6 mx-2"></div>

        <input
          type="text"
          className={`w-full ${textColor} py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-transparent 
            focus:ring-2 focus:ring-transparent focus:outline-none placeholder:font-light placeholder:text-[12px] ${placeholderColor}`}
          placeholder="123-456-7890"
          value={value}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onBlur={onBlur}
          onKeyPress={handleKeyPress}
          id={id}
          maxLength={14}
          name={name}
          disabled={isDisabled}
          autoComplete={autoComplete}
        />
      </div>
      {error && touched && (
        <p className="text-red-600 text-[12px] mt-3">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;
