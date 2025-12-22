/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function LoungeSelectField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  name,
  options = [],
  disabled = false,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref}>
      <label className="block text-[14px] font-[500] text-[#181818] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Trigger */}
      <div
        onClick={() => !disabled && setIsOpen((p) => !p)}
        className={`w-full px-4 py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-[#CACACA]
          focus-within:ring-2 focus-within:ring-gray-200 cursor-pointer flex justify-between items-center
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={`text-[#727272] ${!value && "text-[12px]"}`}>
          {value || placeholder}
        </span>

        {isOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="mt-2 border border-[#CACACA] rounded-[15px] bg-white shadow-sm overflow-hidden">
          {/* Search */}
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lounge..."
            className="w-full px-4 py-2 text-sm border-b outline-none placeholder:text-[12px]"
          />

          {/* Options */}
          <div className="max-h-[180px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearch("");
                    onBlur?.({ target: { name } });
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    option === value ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">
                No lounges found
              </div>
            )}
          </div>
        </div>
      )}

      {error && touched && (
        <p className="text-red-600 text-[12px] mt-1">{error}</p>
      )}
    </div>
  );
}
