/* eslint-disable react/prop-types */
import { useCallback } from "react";

const DateInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  id,
  name,
  maxLength,
}) => {
  // helper to forward a synthetic event so parent handlers expecting e.target.value still work
  const forwardChange = useCallback(
    (val) => {
      if (typeof onChange === "function") {
        onChange({ target: { name, value: val } });
      }
    },
    [onChange, name]
  );

  const sanitizeAndValidate = useCallback(
    (raw) => {
      const digits = (raw || "").toString().replace(/\D/g, "");

      // Determine field type by name
      const n = (name || "").toLowerCase();
      if (n.includes("day")) {
        // allow 1-31, but allow partial typing
        if (digits === "") return "";
        // prevent leading zeros like '00'
        const num = parseInt(digits, 10);
        if (Number.isNaN(num)) return "";
        // allow single digit 1-9, two digits up to 31
        if (digits.length === 1) {
          if (num >= 0 && num <= 9) return String(num);
        }
        if (digits.length <= 2) {
          if (num >= 1 && num <= 31) return String(num);
          return null; // invalid - don't update
        }
        return null;
      }

      if (n.includes("month")) {
        // allow 1-12, partial typing
        if (digits === "") return "";
        const num = parseInt(digits, 10);
        if (Number.isNaN(num)) return "";
        if (digits.length === 1) {
          // allow 0-9 (0 will be corrected/blocked on two-digit)
          return String(num);
        }
        if (digits.length <= 2) {
          if (num >= 1 && num <= 12) return String(num);
          return null;
        }
        return null;
      }

      if (n.includes("year")) {
        // allow up to 4 digits, only numbers
        if (digits === "") return "";
        if (digits.length > 4) return null;
        if (digits.length < 4) return digits; // allow partial
        // when length === 4, validate reasonable range
        const num = parseInt(digits, 10);
        const min = 1900;
        const max = new Date().getFullYear() + 5;
        if (num >= min && num <= max) return String(num);
        return null;
      }

      // default: just return digits truncated to maxLength if provided
      if (maxLength) return digits.slice(0, maxLength);
      return digits;
    },
    [name, maxLength]
  );

  const handleKeyDown = (e) => {
    // allow navigation and control keys
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Tab",
    ];
    if (allowedKeys.includes(e.key)) return;
    // block non-digit
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    const validated = sanitizeAndValidate(raw);
    if (validated === null) {
      // invalid input - do nothing (prevents the value update)
      return;
    }
    forwardChange(validated);
  };

  const handlePaste = (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const validated = sanitizeAndValidate(pasted);
    if (validated === null) {
      e.preventDefault();
      return;
    }
    // allow paste and then forward sanitized value
    forwardChange(validated);
    e.preventDefault();
  };

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      maxLength={maxLength}
      required={true}
      className={`w-full px-4 py-2.5 text-sm rounded-[14px] bg-transparent ring-1 ring-[#CACACA] 
            focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#CACACA]`}
    />
  );
};

export default DateInput;
