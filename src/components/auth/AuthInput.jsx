/* eslint-disable react/prop-types */
// src/components/Input.jsx
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  showToggle = false,
  className,
  onBlur,
  error,
  touched,
  name,
  maxLength,
  disabled,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-[14px] font-[500] text-white mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          disabled={disabled}
          type={showToggle ? (showPassword ? "text" : "password") : type}
          value={value}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          onBlur={onBlur}
          maxLength={maxLength}
          required={required}
          className={`w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ring-[#CACACA]
  focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#E6E6F0] ${
    className || ""
  }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-5 top-2.5 text-gray-200 hover:text-gray-400"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      {error && touched && <p className="text-red-600 text-[12px]">{error}</p>}
    </div>
  );
}
