/* eslint-disable react/prop-types */

import { useState } from "react";
import { FaRegClock } from "react-icons/fa6";

const TimePickerField = ({
  label = "Select Time",
  text,
  value,
  onChange,
  open,
  onOpen,
  position,
}) => {
  const [dateTimeError, setDateTimeError] = useState(false);
  console.log("🚀 ~ TimePickerField ~ dateTimeError:", dateTimeError);

  return (
    <div className="relative w-full">
      <label className="text-[14px] text-[#181818] font-[500] block">
        {text}
      </label>

      {/* Display Field */}
      <div
        className="border border-[#BEBEBE] rounded-[16px] mt-2
        px-3 py-2 flex items-center justify-between text-sm cursor-pointer hover:border-gray-200 transition"
        onClick={onOpen}
      >
        <span className={value ? "text-[#727272]" : "text-[#727272]"}>
          {value || label}
        </span>
        <FaRegClock className="text-blue-950 text-[20px]" />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute z-50 mt-2 shadow-lg p-2 bg-white w-[400px] ${position}`}
        >
          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                "8:00 AM",
                "9:00 AM",
                "10:00 AM",
                "11:00 AM",
                "12:00 PM",
                "1:00 PM",
                "2:00 PM",
                "3:00 PM",
                "4:00 PM",
                "5:00 PM",
                "6:00 PM",
                "7:00 PM",
              ].map((time) => {
                const isSelected = time === value;
                return (
                  <button
                    onClick={() => {
                      onChange(time);
                      setDateTimeError(false);
                    }}
                    key={time}
                    className={`border rounded-[16px] px-2 py-3 text-sm ${
                      isSelected
                        ? "bg-gradient-to-l from-[#012C57] to-[#061523] text-white"
                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePickerField;
