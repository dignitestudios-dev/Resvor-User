/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import DatePickerField from "../global/DatePickerField";
import { useState } from "react";
// import TimePickerField from "../global/TimePickerField";
import InputField from "../auth/InputField";
import Button from "./../global/Button";
import SelectField from "../global/SelectField";
import { ErrorToast } from "../global/Toaster";
import PhoneInput from "../auth/PhoneInput";
import { phoneFormatter, phoneToE164 } from "../../lib/helpers";

const BookingModal = ({ onClose, onNext, loungeId, operatingHours, bookingData }) => {
  const initialDisplay = bookingData?.displayData || {};

  const [startDate, setStartDate] = useState(
    bookingData?.apiPayload?.bookingDate ? new Date(bookingData.apiPayload.bookingDate) : null
  );
  const [startTime, setStartTime] = useState(initialDisplay.time || "");
  const [endTime, setEndTime] = useState(initialDisplay.endTime || "");

  // Parse format: can be string ("1:30 PM - 6:00 PM") or object ({ open: "11:30 AM", close: "2:30 AM" })
  const parseTimeRange = (hours) => {
    if (!hours) return { start: "", end: "", openLabel: "", closeLabel: "" };

    const toHHMM = (t) => {
      const s = (t || "").trim();
      const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (m12) {
        let h = parseInt(m12[1], 10);
        const min = m12[2];
        const p = m12[3].toUpperCase();
        if (p === "AM" && h === 12) h = 0;
        if (p === "PM" && h !== 12) h += 12;
        return `${String(h).padStart(2, "0")}:${min}`;
      }
      const m24 = s.match(/^(\d{1,2}):(\d{2})$/);
      if (m24) return `${String(parseInt(m24[1], 10)).padStart(2, "0")}:${m24[2]}`;
      return "";
    };

    if (typeof hours === "object" && hours.open && hours.close) {
      return {
        start: toHHMM(hours.open),
        end: toHHMM(hours.close),
        openLabel: hours.open,
        closeLabel: hours.close,
      };
    }

    if (typeof hours === "string") {
      const parts = hours.split(/\s+-\s+/);
      const startLabel = parts[0]?.trim() || "";
      const endLabel = parts[1]?.trim() || "";
      return {
        start: toHHMM(startLabel),
        end: toHHMM(endLabel || startLabel),
        openLabel: startLabel || hours,
        closeLabel: endLabel || startLabel || hours,
      };
    }

    return { start: "", end: "", openLabel: "", closeLabel: "" };
  };

  // ── Overnight-aware time helpers ──────────────────────────────────────────
  // Convert "HH:MM" → minutes since midnight (integer)
  const toMinutes = (hhmm) => {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  // Returns true if the time range crosses midnight (e.g. open 1:30 PM, close 12:48 AM)
  const isOvernightRange = (openHHMM, closeHHMM) => {
    const openMin = toMinutes(openHHMM);
    const closeMin = toMinutes(closeHHMM);
    if (openMin === null || closeMin === null) return false;
    return closeMin < openMin; // close is numerically earlier → crosses midnight
  };

  // Is a given "HH:MM" within [openHHMM, closeHHMM] accounting for overnight wrap?
  const isTimeInRange = (valHHMM, openHHMM, closeHHMM) => {
    if (!valHHMM || !openHHMM || !closeHHMM) return true; // can't validate → pass
    const val = toMinutes(valHHMM);
    const open = toMinutes(openHHMM);
    let close = toMinutes(closeHHMM);
    if (val === null || open === null || close === null) return true;

    if (isOvernightRange(openHHMM, closeHHMM)) {
      // Wrap: times after midnight are treated as open + 1440
      close += 1440;
      const normalised = val < open ? val + 1440 : val;
      return normalised >= open && normalised <= close;
    }
    return val >= open && val <= close;
  };

  const { start: minTime, end: maxTime, openLabel, closeLabel } = parseTimeRange(operatingHours);

  // If today is selected, enforce a 1-hour grace period / buffer from current time
  const getNowWithBuffer = () => {
    const now = new Date();
    const buffer = new Date(now.getTime() + 60 * 60 * 1000); // add 1 hour
    const isNextDay = buffer.getDate() !== now.getDate();
    return {
      timeStr: isNextDay
        ? "25:00"
        : `${String(buffer.getHours()).padStart(2, "0")}:${String(buffer.getMinutes()).padStart(2, "0")}`,
      label: buffer.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const isToday = (date) => {
    if (!date) return false;
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  // Effective min = max(lounge open, current time + 1 hour buffer) when today; else just lounge open
  const effectiveMinTime = isToday(startDate)
    ? (() => {
      const { timeStr } = getNowWithBuffer();
      if (!minTime) return timeStr;
      return timeStr > minTime ? timeStr : minTime;
    })()
    : minTime;

  const effectiveMinLabel = isToday(startDate)
    ? (() => {
      const { timeStr, label } = getNowWithBuffer();
      if (!minTime || timeStr > minTime) return `${label} (1-hour buffer)`;
      return openLabel;
    })()
    : openLabel;

  const isBufferEnforced = isToday(startDate) && (!minTime || getNowWithBuffer().timeStr > minTime);

  const formatDateTimeToUTC = (date, timeStr, isNextDay = false) => {
    if (!date || !timeStr) return null;
    try {
      const d = new Date(date);
      if (isNextDay) {
        d.setDate(d.getDate() + 1);
      }
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return null;

      const localDate = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        hours,
        minutes,
        0,
        0
      );

      return localDate.toISOString();
    } catch {
      return null;
    }
  };

  const isEndNextDay = Boolean(
    startTime &&
    endTime &&
    (isOvernightRange(minTime, maxTime)
      ? endTime <= maxTime && startTime >= minTime
      : endTime < startTime)
  );

  const formattedDate = formatDateTimeToUTC(startDate, startTime);
  const formattedStartTime = formatDateTimeToUTC(startDate, startTime);
  const formattedEndTime = formatDateTimeToUTC(startDate, endTime, isEndNextDay);

  const [formData, setFormData] = useState({
    name: initialDisplay.name || "",
    email: initialDisplay.email || "",
    phone: initialDisplay.phone ? initialDisplay.phone.replace(/\D/g, "").slice(-10) : "",
    guestCount: initialDisplay.guestCountRaw || "",
    children: initialDisplay.childrenRaw || "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validateName = (val) => {
    if (!val) return "Name is required";
    if (val.trim().length === 0) return "Name cannot be empty or only spaces";
    if (!/^[\p{L}' -]+$/u.test(val)) return "Name can only contain letters, spaces, hyphens (-), and apostrophes (') ";
    return "";
  };

  const validateEmail = (val) => {
    if (!val) return "Email is required";
    const emailRegex = /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9][A-Za-z0-9._+-]*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(val)) return "Invalid email format";
    if (/\.@/.test(val)) return "Invalid email format"; // no dot before @
    const parts = val.split("@");
    if (parts.length === 2 && /^[.-]/.test(parts[1])) return "Invalid email format";
    return "";
  };

  const validatePhone = (val) => {
    if (!val) return "Phone number is required";
    const clean = val.replace(/\D/g, "");
    if (clean.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
  };

  const validateGuestCount = (val) => {
    if (!val) return "Guest count is required";
    const num = Number(val);
    if (isNaN(num) || num <= 0) return "Valid guest count required";
    return "";
  };

  const validateChildren = (val) => {
    if (val) {
      const num = Number(val);
      if (isNaN(num) || num < 0) return "Children count must be 0 or a positive number";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleanVal = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: cleanVal }));
      setFormErrors((prev) => ({ ...prev, phone: validatePhone(cleanVal) }));
      return;
    }

    if (name === "guestCount" || name === "children") {
      const cleanVal = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({ ...prev, [name]: cleanVal }));
      setFormErrors((prev) => ({
        ...prev,
        [name]: name === "guestCount" ? validateGuestCount(cleanVal) : validateChildren(cleanVal)
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      setFormErrors((prev) => ({ ...prev, name: validateName(value) }));
    } else if (name === "email") {
      setFormErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Real-time check using overnight-aware logic
  const checkTimeInRange = (val, field) => {
    if (!val) return "";
    // First check the effective minimum (buffer or open time)
    if (effectiveMinTime) {
      const valMin = toMinutes(val);
      const effMin = toMinutes(effectiveMinTime);
      // For overnight ranges, times before opening that wrap need the +1440 trick
      let normalisedVal = valMin;
      if (isOvernightRange(effectiveMinTime, maxTime) && valMin !== null && effMin !== null && valMin < effMin) {
        normalisedVal = valMin + 1440;
      }
      if (valMin !== null && effMin !== null && normalisedVal < effMin) {
        return isBufferEnforced
          ? `${field} must be at least 1 hour in the future (after ${effectiveMinLabel})`
          : `${field} must be at or after opening time (${openLabel})`;
      }
    }
    if (!isTimeInRange(val, effectiveMinTime || minTime, maxTime)) {
      return `${field} cannot exceed closing time (${closeLabel})`;
    }
    return "";
  };

  // Validates that end time is strictly after start time (overnight-aware)
  const checkEndAfterStart = (start, end) => {
    if (!start || !end) return "";
    if (isOvernightRange(minTime, maxTime)) {
      // Both in evening portion: end must be > start
      // Both in early-morning portion: end must be > start
      // start in evening, end in early-morning: always valid (crosses midnight)
      const startIsEvening = start >= minTime; // e.g. >= "11:30"
      const endIsEvening = end >= minTime;
      const startIsMorning = start <= maxTime; // e.g. <= "02:30"
      const endIsMorning = end <= maxTime;

      if (startIsEvening && endIsEvening && end <= start)
        return "End time must be after start time";
      if (startIsMorning && endIsMorning && end <= start)
        return "End time must be after start time";
      // start evening, end morning = valid (crosses midnight)
      // start morning, end evening = invalid (going backwards)
      if (startIsMorning && endIsEvening)
        return "End time must be after start time";
    } else {
      if (end <= start) return "End time must be after start time";
    }
    return "";
  };

  const handleStartTimeChange = (e) => {
    const val = e.target.value;
    setStartTime(val);
    const err = checkTimeInRange(val, "Start time");
    setFormErrors((p) => {
      const nextErrors = { ...p, startTime: err || "" };
      if (endTime) {
        const endErr = checkTimeInRange(endTime, "End time") || checkEndAfterStart(val, endTime);
        nextErrors.endTime = endErr || "";
      }
      return nextErrors;
    });
  };

  const handleEndTimeChange = (e) => {
    const val = e.target.value;
    setEndTime(val);
    const rangeErr = checkTimeInRange(val, "End time");
    const orderErr = !rangeErr ? checkEndAfterStart(startTime, val) : "";
    setFormErrors((p) => ({ ...p, endTime: rangeErr || orderErr || "" }));
  };

  // Blur: clear error only — don't clamp for overnight ranges to avoid wrong auto-correction
  const handleStartTimeBlur = () => {
    if (!startTime) return;
    const err = checkTimeInRange(startTime, "Start time");
    if (!err) {
      setFormErrors((p) => ({ ...p, startTime: "" }));
    }
  };

  const handleEndTimeBlur = () => {
    if (!endTime) return;
    const rangeErr = checkTimeInRange(endTime, "End time");
    const orderErr = !rangeErr ? checkEndAfterStart(startTime, endTime) : "";
    if (!rangeErr && !orderErr) {
      setFormErrors((p) => ({ ...p, endTime: "" }));
    } else {
      setFormErrors((p) => ({ ...p, endTime: rangeErr || orderErr }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!startDate) errors.date = "Date is required";
    if (!startTime) errors.startTime = "Start time is required";
    if (!endTime) errors.endTime = "End time is required";

    const nameErr = validateName(formData.name);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    const guestErr = validateGuestCount(formData.guestCount);
    if (guestErr) errors.guestCount = guestErr;

    const childErr = validateChildren(formData.children);
    if (childErr) errors.children = childErr;

    // Operating hours + past-time validation (overnight-aware)
    const startErr = checkTimeInRange(startTime, "Start time");
    if (startErr) errors.startTime = startErr;

    const endErr = checkTimeInRange(endTime, "End time") || checkEndAfterStart(startTime, endTime);
    if (endErr) errors.endTime = endErr;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      ErrorToast("Please fill all required fields correctly.");
      return;
    }

    const displayData = {
      name: formData.name,
      email: formData.email,
      phone: phoneFormatter(formData.phone),
      date: startDate ? startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }) : "",
      time: startTime,
      endTime: endTime,
      guestCount: `${formData.guestCount} Guests`,
      children: formData.children || "None",
      guestCountRaw: formData.guestCount,
      childrenRaw: formData.children,
    };

    const apiPayload = {
      loungeId,
      bookingDate: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      guestCount: Number(formData.guestCount),
      childrenCount: formData.children ? Number(formData.children) : 0,
      guestName: formData.name,
      guestEmail: formData.email,
      guestPhone: phoneToE164(formData.phone),
    };

    if (onNext) onNext({ displayData, apiPayload });
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 h-[570px] overflow-y-auto  ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Book Now</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="px-8 py-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex flex-col gap-2 "
          >
            <div className="w-full">
              <DatePickerField
                label="Select Date"
                value={startDate}
                onChange={(val) => { setStartDate(val); setFormErrors(p => ({ ...p, date: "" })); }}
              />
              {formErrors.date && <p className="text-red-600 text-[12px] mt-1">{formErrors.date}</p>}
            </div>
          </div>
          <div className="w-full flex mt-2 items-start gap-2 px-1">
            <div className="w-full">
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                Start Time
              </label>
              <input
                type="time"
                data-slot="input"
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${formErrors.startTime ? "ring-red-600" : "ring-[#CACACA]"
                  } focus:ring-2 focus:ring-gray-200 focus:outline-none`}
                value={startTime}
                onChange={handleStartTimeChange}
                onBlur={handleStartTimeBlur}
              />
              {minTime && maxTime && (
                <p className="text-[11px] text-[#727272] mt-1">
                  Allowed: {effectiveMinLabel} – {closeLabel}
                </p>
              )}
              {formErrors.startTime && <p className="text-red-600 text-[12px] mt-1">{formErrors.startTime}</p>}
            </div>
            <div className="w-full">
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                End Time
              </label>
              <input
                type="time"
                data-slot="input"
                min={!isOvernightRange(minTime, maxTime) && startTime ? startTime : undefined}
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${formErrors.endTime ? "ring-red-600" : "ring-[#CACACA]"
                  } focus:ring-2 focus:ring-gray-200 focus:outline-none`}
                value={endTime}
                onChange={handleEndTimeChange}
                onBlur={handleEndTimeBlur}
              />
              {minTime && maxTime && (
                <p className="text-[11px] text-[#727272] mt-1">
                  Allowed: {effectiveMinLabel} – {closeLabel}
                </p>
              )}
              {formErrors.endTime && <p className="text-red-600 text-[12px] mt-1">{formErrors.endTime}</p>}
            </div>
          </div>
          <div>
            <div className="px-1 py-2">
              <InputField
                label="Full Name"
                text="name"
                placeholder="Full Name"
                type="text"
                id={`name`}
                name={`name`}
                maxLength={30}
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
                touched={!!formErrors.name}
              />
            </div>
            <div className="px-1 py-2">
              <InputField
                label="Email address"
                text="email"
                placeholder="example@gamil.com"
                type="email"
                id={`email`}
                name={`email`}
                maxLength={30}
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                touched={!!formErrors.email}
              />
            </div>
            <div className="px-1 py-2">
              <PhoneInput
                label="Phone number"
                id="phone"
                name="phone"
                value={phoneFormatter(formData.phone)}
                onChange={handleInputChange}
                onBlur={() => {
                  setFormErrors((prev) => ({
                    ...prev,
                    phone: validatePhone(formData.phone),
                  }));
                }}
                error={formErrors.phone}
                touched={!!formErrors.phone}
                labelColor="text-[#181818]"
                textColor="text-black"
                countryCodeColor="text-black"
                placeholderColor="placeholder:text-[#727272]"
                borderColor="border-[#CACACA]"
                bgColor="bg-transparent"
                autoComplete="off"
              />
            </div>
            <div className="w-full flex items-start gap-2 px-1">
              <div className="w-full">
                <InputField
                  label="Guest Count"
                  text="guest"
                  placeholder="Add here"
                  type="text"
                  id={`guest`}
                  name={`guestCount`}
                  maxLength={4}
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  error={formErrors.guestCount}
                  touched={!!formErrors.guestCount}
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Children (if any)"
                  text="children"
                  placeholder="Add here"
                  type="text"
                  id={`children`}
                  name={`children`}
                  maxLength={4}
                  value={formData.children}
                  onChange={handleInputChange}
                  error={formErrors.children}
                  touched={!!formErrors.children}
                />
              </div>
            </div>



            <div className="mt-4 px-1 flex gap-2">
              <Button text="Next" type="button" onClick={handleNext} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
