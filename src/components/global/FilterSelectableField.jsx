/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const FilterSelectableField = ({
  label,
  options = [],
  placeholder,
  value = [],
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full transition-all duration-300"
    >
      {label && (
        <label className="block mb-1 text-[14px] font-[500] text-[#181818]">
          {label}
        </label>
      )}

      {/* Dropdown Trigger */}
      <div
        onClick={toggleDropdown}
        className="border border-[#CACACA] px-4 py-2 rounded-[15px] overflow-auto flex flex-wrap gap-2 cursor-pointer text-[#727272]"
      >
        <div className="flex-1 overflow-hidden">
          {value.length === 0 ? (
            <span className="flex items-center text-[16px] font-thin">
              {placeholder}
            </span>
          ) : (
            <div
              className="text-[#727272] text-[14px] font-[500] px-3 py-1 rounded-[10px] whitespace-nowrap overflow-hidden text-ellipsis"
              title={value.map((item) => item?.name || item).join(", ")} // tooltip for all
            >
              {value
                .map((item) => item?.name || item)
                .slice(0, 2)
                .join(", ")}
              {value.length > 2 && " ..."}
            </div>
          )}
        </div>
        {isOpen ? (
          <IoIosArrowUp size={26} color="#727272" className="shrink-0 pt-1" />
        ) : (
          <IoIosArrowDown size={26} color="#727272" className="shrink-0 pt-1" />
        )}
      </div>

      {/* Dropdown List (now takes space instead of absolute) */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[200px] mt-2" : "max-h-0"
        }`}
      >
        {isOpen && (
          <div className="border border-[#CACACA] rounded-[8px] max-h-[200px] overflow-y-auto text-[#727272]">
            {options?.map((option) => {
              // derive a stable key for option (works for objects and strings)
              const optionKey = option?.title ?? option;

              const isChecked = value?.some((item) => {
                const itemKey = item?.name ?? item?.title ?? item;
                return itemKey === optionKey;
              });

              return (
                <label
                  key={option?._id || optionKey}
                  className="flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={() => onChange(option)}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <div
                      className={`w-4 h-4 mt-[2px] rounded border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-gray-200 border-blue-800"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="w-3 h-3 text-black"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3">
                    {option?.title || option}{" "}
                    {option.price && (
                      <span className="pl-4">({option.price})</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSelectableField;
