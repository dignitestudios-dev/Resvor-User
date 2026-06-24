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

  // Parse API format: "1:30 PM - 6:00 PM"  OR plain "9:00 AM" / "21:00"
  const parseTimeRange = (rangeStr) => {
    if (!rangeStr) return { start: "", end: "", label: "" };

    const toHHMM = (t) => {
      const s = (t || "").trim();
      // 12-hour: "1:30 PM", "09:00 AM"
      const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (m12) {
        let h = parseInt(m12[1], 10);
        const min = m12[2];
        const p = m12[3].toUpperCase();
        if (p === "AM" && h === 12) h = 0;
        if (p === "PM" && h !== 12) h += 12;
        return `${String(h).padStart(2, "0")}:${min}`;
      }
      // 24-hour: "21:00"
      const m24 = s.match(/^(\d{1,2}):(\d{2})$/);
      if (m24) return `${String(parseInt(m24[1], 10)).padStart(2, "0")}:${m24[2]}`;
      return "";
    };

    // Split "1:30 PM - 6:00 PM" on " - " (space-dash-space)
    const parts = rangeStr.split(/\s+-\s+/);
    const startLabel = parts[0]?.trim() || "";
    const endLabel   = parts[1]?.trim() || "";

    return {
      start: toHHMM(startLabel),
      end:   toHHMM(endLabel || startLabel),   // fallback if no range
      openLabel:  startLabel || rangeStr,
      closeLabel: endLabel   || startLabel || rangeStr,
    };
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
    const openMin  = toMinutes(openHHMM);
    const closeMin = toMinutes(closeHHMM);
    if (openMin === null || closeMin === null) return false;
    return closeMin < openMin; // close is numerically earlier → crosses midnight
  };

  // Is a given "HH:MM" within [openHHMM, closeHHMM] accounting for overnight wrap?
  const isTimeInRange = (valHHMM, openHHMM, closeHHMM) => {
    if (!valHHMM || !openHHMM || !closeHHMM) return true; // can't validate → pass
    const val   = toMinutes(valHHMM);
    const open  = toMinutes(openHHMM);
    let   close = toMinutes(closeHHMM);
    if (val === null || open === null || close === null) return true;

    if (isOvernightRange(openHHMM, closeHHMM)) {
      // Wrap: times after midnight are treated as open + 1440
      close += 1440;
      const normalised = val < open ? val + 1440 : val;
      return normalised >= open && normalised <= close;
    }
    return val >= open && val <= close;
  };

  const { start: minTime, end: maxTime, openLabel, closeLabel } = parseTimeRange(operatingHours?.open);

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

  const formatDateTime = (date, timeStr) => {
    if (!date || !timeStr) return null;
    try {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      const [hours, minutes] = timeStr.split(':');
      return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
    } catch {
      return null;
    }
  };

  const formattedDate = formatDateTime(startDate, startTime); 
  const formattedStartTime = formatDateTime(startDate, startTime);
  const formattedEndTime = formatDateTime(startDate, endTime);

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
      const valMin  = toMinutes(val);
      const effMin  = toMinutes(effectiveMinTime);
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

  const handleStartTimeChange = (e) => {
    const val = e.target.value;
    setStartTime(val);
    setFormErrors((p) => ({ ...p, startTime: checkTimeInRange(val, "Start time") }));
  };

  const handleEndTimeChange = (e) => {
    const val = e.target.value;
    setEndTime(val);
    setFormErrors((p) => ({ ...p, endTime: checkTimeInRange(val, "End time") }));
  };

  // Blur: clear error only — don't clamp for overnight ranges to avoid wrong auto-correction
  const handleStartTimeBlur = () => {
    if (!startTime) return;
    if (isTimeInRange(startTime, effectiveMinTime || minTime, maxTime)) {
      setFormErrors((p) => ({ ...p, startTime: "" }));
    }
  };

  const handleEndTimeBlur = () => {
    if (!endTime) return;
    if (isTimeInRange(endTime, effectiveMinTime || minTime, maxTime)) {
      setFormErrors((p) => ({ ...p, endTime: "" }));
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

    const endErr = checkTimeInRange(endTime, "End time");
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
                onChange={(val) => { setStartDate(val); setFormErrors(p => ({...p, date: ""})); }}
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
                // Don't set min/max when range is overnight — browser can't handle cross-midnight ranges
                min={!isOvernightRange(minTime, maxTime) && effectiveMinTime ? effectiveMinTime : undefined}
                max={!isOvernightRange(minTime, maxTime) && maxTime ? maxTime : undefined}
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${
                  formErrors.startTime ? "ring-red-600" : "ring-[#CACACA]"
                } focus:ring-2 focus:ring-gray-200 focus:outline-none`}
                value={startTime}
                onChange={handleStartTimeChange}
                onBlur={handleStartTimeBlur}
              />
              {effectiveMinTime && maxTime && (
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
                min={!isOvernightRange(minTime, maxTime) && effectiveMinTime ? effectiveMinTime : undefined}
                max={!isOvernightRange(minTime, maxTime) && maxTime ? maxTime : undefined}
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${
                  formErrors.endTime ? "ring-red-600" : "ring-[#CACACA]"
                } focus:ring-2 focus:ring-gray-200 focus:outline-none`}
                value={endTime}
                onChange={handleEndTimeChange}
                onBlur={handleEndTimeBlur}
              />
              {effectiveMinTime && maxTime && (
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
