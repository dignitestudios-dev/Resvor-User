/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

export default function StatusDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full transition-all duration-300"
    >
      <label className="block mb-1 text-[14px] font-[500] text-[#181818]">
        Status
      </label>

      {/* Trigger */}
      <div
        onClick={toggleDropdown}
        className="border border-[#CACACA] px-4 py-2 rounded-[15px] flex justify-between items-center cursor-pointer text-[#727272]"
      >
        <span className="text-[14px] text-white">{value || "All"}</span>
        {isOpen ? (
          <IoIosArrowUp size={22} color="white" />
        ) : (
          <IoIosArrowDown size={22} color="white" />
        )}
      </div>

      {/* Dropdown */}
      <div
        className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[200px] mt-2" : "max-h-0"
          }`}
      >
        {isOpen && (
          <div className="border border-[#CACACA] rounded-[8px] max-h-[200px] overflow-y-auto text-[#727272] bg-white">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option === "All" ? "" : option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${value === option || (option === "All" && value === "")
                  ? "font-semibold text-black"
                  : ""
                  }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
