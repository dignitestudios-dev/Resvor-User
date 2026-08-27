/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const FilterSelectableField = ({
  label,
  options = [],
  placeholder,
  value = [],
  onChange,
  isMulti = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortedOptions, setSortedOptions] = useState([]);
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

  // Sort options when dropdown is opened so checked items are grouped at the top (only for multi-select)
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && isMulti) {
      if (!prevIsOpenRef.current || sortedOptions.length !== options.length) {
        const initialSorted = [...(options || [])].sort((a, b) => {
          const aKey = a?.title ?? a;
          const bKey = b?.title ?? b;

          const aChecked = valueRef.current?.some((item) => {
            const itemKey = item?.name ?? item?.title ?? item;
            return itemKey === aKey;
          });

          const bChecked = valueRef.current?.some((item) => {
            const itemKey = item?.name ?? item?.title ?? item;
            return itemKey === bKey;
          });

          if (aChecked && !bChecked) return -1;
          if (!aChecked && bChecked) return 1;
          return 0;
        });
        setSortedOptions(initialSorted);
      }
    } else {
      setSortedOptions(options || []);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, options, sortedOptions.length, isMulti]);

  const isOptionSelected = (option) => {
    const optionKey = option?.title ?? option?.name ?? option;

    if (Array.isArray(value)) {
      return value.some((item) => {
        const itemKey = item?.name ?? item?.title ?? item;
        return itemKey === optionKey;
      });
    }

    if (value) {
      const valKey = value?.name ?? value?.title ?? value;
      return valKey === optionKey;
    }

    return false;
  };

  const getDisplayText = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return null;
    }

    if (Array.isArray(value)) {
      if (!isMulti) {
        const single = value[0];
        return single?.title || single?.name || single;
      }
      return (
        value
          .map((item) => item?.title || item?.name || item)
          .slice(0, 2)
          .join(", ") + (value.length > 2 ? " ..." : "")
      );
    }

    return value?.title || value?.name || value;
  };

  const displayText = getDisplayText();

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
        className="border border-[#CACACA] px-4 py-2.5 rounded-[15px] overflow-auto flex flex-wrap gap-2 cursor-pointer text-[#727272]"
      >
        <div className="flex-1 overflow-hidden">
          {!displayText ? (
            <span className="flex items-center text-[14px] text-[#CACACA] font-light">
              {placeholder}
            </span>
          ) : (
            <div
              className="text-[#181818] text-[14px] font-[500] px-1 whitespace-nowrap overflow-hidden text-ellipsis"
              title={
                Array.isArray(value)
                  ? value
                      .map((item) => item?.title || item?.name || item)
                      .join(", ")
                  : displayText
              }
            >
              {displayText}
            </div>
          )}
        </div>
        {isOpen ? (
          <IoIosArrowUp size={22} color="#727272" className="shrink-0 self-center" />
        ) : (
          <IoIosArrowDown size={22} color="#727272" className="shrink-0 self-center" />
        )}
      </div>

      {/* Dropdown List */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[220px] mt-2" : "max-h-0"
        }`}
      >
        {isOpen && (
          <div className="border border-[#CACACA] rounded-[12px] max-h-[220px] overflow-y-auto bg-white shadow-md divide-y divide-gray-100">
            {sortedOptions?.map((option) => {
              const optionKey = option?.title ?? option?.name ?? option;
              const isChecked = isOptionSelected(option);

              if (!isMulti) {
                // Single Select Mode: No checkbox, click to select and close
                return (
                  <div
                    key={option?._id || optionKey}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`flex px-4 py-2.5 hover:bg-gray-100 cursor-pointer items-center justify-between text-sm transition-colors ${
                      isChecked
                        ? "bg-blue-50/70 text-[#012C57] font-semibold"
                        : "text-[#565656]"
                    }`}
                  >
                    <span>
                      {option?.title || option}{" "}
                      {option.price && (
                        <span className="pl-2 text-xs text-gray-500">
                          ({option.price})
                        </span>
                      )}
                    </span>
                    {isChecked && (
                      <svg
                        className="w-4 h-4 text-[#012C57] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                );
              }

              // Multi Select Mode: Checkbox
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
                  <span className="ml-3 text-[14px] text-[#565656]">
                    {option?.title || option}{" "}
                    {option.price && (
                      <span className="pl-4 text-xs text-gray-500">
                        ({option.price})
                      </span>
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
