/* eslint-disable react/prop-types */
import { useMemo, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { IoCalendarOutline } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomInput = forwardRef(
  ({ value, onClick, placeholder, hasError, disabled, id, name }, ref) => (
    <div
      ref={ref}
      onClick={disabled ? undefined : onClick}
      id={id}
      data-name={name}
      className={`w-full px-4 py-2.5 text-sm rounded-[14px] bg-transparent ring-1 cursor-pointer flex items-center justify-between transition select-none ${
        hasError
          ? "ring-red-500 focus:ring-red-500"
          : "ring-[#CACACA] hover:ring-gray-400"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`${
          value
            ? "text-[#181818] font-normal text-[13px]"
            : "text-[#CACACA] font-light text-[12px]"
        }`}
      >
        {value || placeholder}
      </span>
      <IoCalendarOutline className="text-[#012C57] text-[18px] flex-shrink-0" />
    </div>
  )
);

CustomInput.displayName = "CustomInput";

const DateInput = ({
  value,
  onChange,
  placeholder = "Select Date",
  id,
  name,
  hasError,
  disabled = false,
  minDate = null,
  maxDate = null,
  startYear = 1920,
  endYear = new Date().getFullYear() + 10,
}) => {
  // Convert value { day, month, year } or Date object to Date instance
  const selectedDate = useMemo(() => {
    if (!value) return null;
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    if (typeof value === "object" && value.day && value.month) {
      const day = parseInt(value.day, 10);
      const month = parseInt(value.month, 10) - 1;
      const year = value.year
        ? parseInt(value.year, 10)
        : new Date().getFullYear();
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) return d;
      }
    }
    return null;
  }, [value]);

  const yearsList = useMemo(() => {
    const list = [];
    for (let y = endYear; y >= startYear; y--) {
      list.push(y);
    }
    return list;
  }, [startYear, endYear]);

  const handleDateChange = (date) => {
    if (!date) {
      if (typeof onChange === "function") {
        onChange({ day: "", month: "", year: "" });
      }
      return;
    }

    const dateObj = {
      day: String(date.getDate()),
      month: String(date.getMonth() + 1),
      year: String(date.getFullYear()),
    };

    if (typeof onChange === "function") {
      onChange(dateObj);
    }
  };

  return (
    <div className="w-full relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        dateFormat="MM/dd/yyyy"
        showPopperArrow={false}
        portalId="root"
        popperPlacement="bottom-start"
        calendarClassName="resvor-datepicker"
        popperClassName="resvor-datepicker-popper"
        customInput={
          <CustomInput
            placeholder={placeholder}
            hasError={hasError}
            disabled={disabled}
            id={id}
            name={name}
          />
        }
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          const currentYear = date.getFullYear();
          const currentMonth = date.getMonth();

          return (
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-l from-[#012C57] to-[#061523] text-white">
              <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 transition cursor-pointer text-white flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center gap-2">
                {/* Month Dropdown */}
                <select
                  value={MONTH_NAMES[currentMonth]}
                  onChange={({ target: { value: val } }) =>
                    changeMonth(MONTH_NAMES.indexOf(val))
                  }
                  className="bg-white/10 text-white font-medium text-[12px] border border-white/30 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  {MONTH_NAMES.map((m) => (
                    <option key={m} value={m} className="text-gray-900 bg-white">
                      {m}
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={currentYear}
                  onChange={({ target: { value: val } }) =>
                    changeYear(Number(val))
                  }
                  className="bg-white/10 text-white font-medium text-[12px] border border-white/30 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y} className="text-gray-900 bg-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 transition cursor-pointer text-white flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          );
        }}
      />
    </div>
  );
};

export default DateInput;
