/* eslint-disable react/prop-types */
import moment from "moment/moment";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { IoCalendarOutline } from "react-icons/io5";

import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = ({
  label = "Select Date",
  value,
  onChange,
  minDate = null,
  maxDate = null,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative w-full">
      <label className="text-[14] text-[#181818] font-[500] block">Date</label>

      {/* Display Field */}
      <div
        className="border border-[#BEBEBE] rounded-[16px] mt-2
        px-3 py-2 flex items-center justify-between text-sm cursor-pointer hover:border-gray-200 transition"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span className={"text-[#727272]"}>
          {value ? moment(value).format("MM-DD-YYYY") : label}
        </span>
        <IoCalendarOutline className="text-blue-950 text-[20px]" />
      </div>

      {/* Date Picker Popup */}
      {showPicker && (
        <div className="absolute z-50 mt-2 rounded-lg  p-2">
          <DatePicker
            selected={value}
            onChange={(date) => {
              onChange(date);
              setShowPicker(false);
            }}
            minDate={minDate}
            maxDate={maxDate}
            inline
            calendarClassName="dark-datepicker"
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerField;
