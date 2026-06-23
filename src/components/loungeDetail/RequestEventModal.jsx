/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import DatePickerField from "../global/DatePickerField";
import { useState } from "react";
import InputField from "../auth/InputField";
import Button from "./../global/Button";
import SelectField from "../global/SelectField";
import { ErrorToast } from "../global/Toaster";

const eventTypeOptions = [
  "Birthday Party",
  "Wedding",
  "Engagement",
  "Ceremony",
  "Meeting",
  "Private Party",
  "Maintenance",
  "Closed",
  "Other",
];

const RequestEventModal = ({ onClose, onNext, operatingHours, eventData }) => {
  const [startDate, setStartDate] = useState(
    eventData?.startDateTime ? new Date(eventData.startDateTime) : null
  );
  const [startTime, setStartTime] = useState(eventData?.startTime || null);

  // Parse API format: "1:30 PM - 6:00 PM"  OR plain "9:00 AM" / "21:00"
  const parseTimeRange = (rangeStr) => {
    if (!rangeStr) return { start: "", end: "", openLabel: "", closeLabel: "" };

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

    const parts = rangeStr.split(/\s+-\s+/);
    const startLabel = parts[0]?.trim() || "";
    const endLabel   = parts[1]?.trim() || "";

    return {
      start: toHHMM(startLabel),
      end:   toHHMM(endLabel || startLabel),
      openLabel:  startLabel || rangeStr,
      closeLabel: endLabel   || startLabel || rangeStr,
    };
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

  // const [selectedType, setSelectedType] = useState([]);

  const [formData, setFormData] = useState({
    eventType: eventData?.eventType || "",
    eventName: eventData?.eventName || "",
    name: eventData?.name || "",
    email: eventData?.email || "",
    phone: eventData?.phone || "",
    guestCount: eventData?.guestCount ? String(eventData.guestCount) : "",
    preferredMusic: eventData?.preferredMusic === "None" ? "" : eventData?.preferredMusic || "",
    specialRequest: eventData?.specialRequest === "None" ? "" : eventData?.specialRequest || "",
    budget: eventData?.budget ? String(eventData.budget) : "",
    ticketAtDoor: eventData?.ticketAtDoor === "None" ? "" : eventData?.ticketAtDoor || "",
    description: eventData?.description || "",
  });

  const [endDate, setEndDate] = useState(eventData?.endTime || "");
  const [formErrors, setFormErrors] = useState({});

  // const handleSelect = (option) => {
  //   const name = option?.name || option;
  //   setSelectedType([name]);
  //   // setSelectedType((prev) => {
  //   //   const exists = prev.some((item) => item.name === name);

  //   //   if (exists) {
  //   //     return prev.filter((item) => item.name !== name);
  //   //   } else {
  //   //     return [...prev, { name }];
  //   //   }
  //   // });
  // };

  const validateName = (val) => {
    if (!val) return "Full name is required";
    if (val.trim().length === 0) return "Full name cannot be empty or only spaces";
    if (!/^[\p{L}' -]+$/u.test(val)) return "Full name can only contain letters, spaces, hyphens (-), and apostrophes (') ";
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
    if (val.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
  };

  const validateGuestCount = (val) => {
    if (!val) return "Guest count is required";
    const num = Number(val);
    if (isNaN(num) || num <= 0) return "Enter a valid guest count";
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

    if (name === "guestCount") {
      const cleanVal = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({ ...prev, guestCount: cleanVal }));
      setFormErrors((prev) => ({ ...prev, guestCount: validateGuestCount(cleanVal) }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === "name") {
      setFormErrors((prev) => ({ ...prev, name: validateName(value) }));
    } else if (name === "email") {
      setFormErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Real-time operating hours + past-time check
  const checkTimeInRange = (val, field) => {
    if (!val) return "";
    if (effectiveMinTime && val < effectiveMinTime)
      return isBufferEnforced
        ? `${field} must be at least 1 hour in the future (after ${effectiveMinLabel})`
        : `${field} must be at or after opening time (${openLabel})`;
    if (maxTime && val > maxTime)
      return `${field} cannot exceed closing time (${closeLabel})`;
    return "";
  };

  const handleStartTimeChange = (e) => {
    const val = e.target.value;
    setStartTime(val);
    setFormErrors((p) => ({ ...p, startTime: checkTimeInRange(val, "Start time") }));
  };

  const handleEndTimeChange = (e) => {
    const val = e.target.value;
    setEndDate(val);
    setFormErrors((p) => ({ ...p, endTime: checkTimeInRange(val, "End time") }));
  };

  // Clamp to valid range on blur
  const handleStartTimeBlur = () => {
    if (!startTime) return;
    if (effectiveMinTime && startTime < effectiveMinTime) {
      setStartTime(effectiveMinTime <= "23:59" ? effectiveMinTime : "");
      setFormErrors((p) => ({ ...p, startTime: "" }));
    }
    if (maxTime && startTime > maxTime) { setStartTime(maxTime); setFormErrors((p) => ({ ...p, startTime: "" })); }
  };

  const handleEndTimeBlur = () => {
    if (!endDate) return;
    if (effectiveMinTime && endDate < effectiveMinTime) {
      setEndDate(effectiveMinTime <= "23:59" ? effectiveMinTime : "");
      setFormErrors((p) => ({ ...p, endTime: "" }));
    }
    if (maxTime && endDate > maxTime) { setEndDate(maxTime); setFormErrors((p) => ({ ...p, endTime: "" })); }
  };

  const handleEventTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      eventType: value,
    }));

    if (formErrors.eventType) {
      setFormErrors((prev) => ({
        ...prev,
        eventType: "",
      }));
    }
  };

  const normalizeEventType = (value) => {
    const normalized = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    const aliasMap = {
      birthday_party: "birthday",
      birthday: "birthday",
      wedding: "wedding",
      engagement: "engagement",
      ceremony: "ceremony",
      meeting: "meeting",
      private_party: "private_party",
      "private party": "private_party",
      maintenance: "maintenance",
      closed: "closed",
      other: "other",
    };

    return aliasMap[normalized] || normalized;
  };

  const validate = () => {
    const errors = {};
    const normalizedEventType = normalizeEventType(formData.eventType);

    if (!formData.eventType) {
      errors.eventType = "Event type is required";
    } else if (![
      "birthday",
      "wedding",
      "engagement",
      "ceremony",
      "meeting",
      "private_party",
      "maintenance",
      "closed",
      "other",
    ].includes(normalizedEventType)) {
      errors.eventType = "Enter a valid event type";
    }
    if (!formData.eventName) errors.eventName = "Event name is required";
    if (!startDate) errors.startDate = "Date is required";
    if (!startTime) errors.startTime = "Start time is required";
    if (!endDate) errors.endTime = "End time is required";
    const nameErr = validateName(formData.name);
    if (nameErr) errors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errors.phone = phoneErr;

    const guestErr = validateGuestCount(formData.guestCount);
    if (guestErr) errors.guestCount = guestErr;
    if (!formData.budget) {
      errors.budget = "Budget is required";
    } else if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
      errors.budget = "Enter a valid budget";
    }

    // Operating hours + past-time validation
    if (effectiveMinTime && startTime && startTime < effectiveMinTime) {
      errors.startTime = isBufferEnforced
        ? `Start time must be at least 1 hour in the future (after ${effectiveMinLabel})`
        : `Start time must be at or after opening time (${openLabel})`;
    }
    if (maxTime && startTime && startTime > maxTime) {
      errors.startTime = `Start time must be before closing time (${closeLabel})`;
    }
    if (effectiveMinTime && endDate && endDate < effectiveMinTime) {
      errors.endTime = isBufferEnforced
        ? `End time must be at least 1 hour in the future (after ${effectiveMinLabel})`
        : `End time must be at or after opening time (${openLabel})`;
    }
    if (maxTime && endDate && endDate > maxTime) {
      errors.endTime = `End time cannot exceed closing time (${closeLabel})`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      ErrorToast("Please fill all the required fields.");
      return;
    }

    // Prepare startDateTime and endDateTime
    const startDateTime = new Date(startDate);
    const [startH, startM] = startTime.split(":");
    startDateTime.setHours(parseInt(startH), parseInt(startM));

    const endDateTime = new Date(startDate);
    const [endH, endM] = endDate.split(":");
    endDateTime.setHours(parseInt(endH), parseInt(endM));

    const eventData = {
      title: formData.eventName,
      eventName: formData.eventName,
      eventType: formData.eventType,
      description: formData.description || formData.eventName,
      date: startDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      startTime: startTime,
      endTime: endDate,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      guestCount: Number(formData.guestCount),
      preferredMusic: formData.preferredMusic || "None",
      specialRequest: formData.specialRequest || "None",
      budget: Number(formData.budget),
      ticketAtDoor: formData.ticketAtDoor || "None",
      instructions: formData.instructions || "",
    };
    onNext(eventData);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 h-[650px] overflow-y-scroll ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Request Event</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="px-8 py-4">
          <div className=" mx-1">
            <SelectField
              label="Event Type"
              name={`eventType`}
              placeholder="Select Event Type"
              value={formData.eventType}
              onChange={handleEventTypeChange}
              error={formErrors.eventType}
              touched={!!formErrors.eventType}
              options={eventTypeOptions}
            />
          </div>
          <div className=" mx-1 pt-2">
            <InputField
              label="Event Name"
              text="eventName"
              placeholder="Event Name"
              type="text"
              id={`eventName`}
              name={`eventName`}
              maxLength={30}
              value={formData.eventName}
              onChange={handleInputChange}
              error={formErrors.eventName}
              touched={!!formErrors.eventName}
            />
          </div>
          <div className=" mx-1 pt-2">
            <InputField
              label="Description"
              text="description"
              placeholder="Event description"
              type="text"
              id={`description`}
              name={`description`}
              maxLength={100}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="my-2 mx-1">
            <DatePickerField
              label="Select Date"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                setFormErrors((prev) => ({ ...prev, startDate: "" }));
              }}
            />
            {formErrors.startDate && (
              <p className="text-red-600 text-[12px] mt-1">{formErrors.startDate}</p>
            )}
          </div>
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <div className="w-full">
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                Start Time
              </label>
              <input
                type="time"
                data-slot="input"
                min={effectiveMinTime && effectiveMinTime <= "23:59" ? effectiveMinTime : undefined}
                max={maxTime || undefined}
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${
                  formErrors.startTime ? "ring-red-500" : "ring-[#CACACA]"
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
              {formErrors.startTime && (
                <p className="text-red-600 text-[12px] mt-1">{formErrors.startTime}</p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                End Time
              </label>
              <input
                type="time"
                data-slot="input"
                min={effectiveMinTime && effectiveMinTime <= "23:59" ? effectiveMinTime : undefined}
                max={maxTime || undefined}
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${
                  formErrors.endTime ? "ring-red-500" : "ring-[#CACACA]"
                } focus:ring-2 focus:ring-gray-200 focus:outline-none`}
                value={endDate}
                onChange={handleEndTimeChange}
                onBlur={handleEndTimeBlur}
              />
              {effectiveMinTime && maxTime && (
                <p className="text-[11px] text-[#727272] mt-1">
                  Allowed: {effectiveMinLabel} – {closeLabel}
                </p>
              )}
              {formErrors.endTime && (
                <p className="text-red-600 text-[12px] mt-1">{formErrors.endTime}</p>
              )}
            </div>
            
          </div>
          <div className="w-full flex items-center gap-2 my-2 px-1">
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
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <InputField
              label="Phone number"
              text="phone"
              placeholder="Phone number"
              type="text"
              id={`phone`}
              name={`phone`}
              maxLength={10}
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
              touched={!!formErrors.phone}
            />
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
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <InputField
              label="Preferred Music Genre"
              text="music"
              placeholder="Add here"
              type="text"
              id={`music`}
              name={`preferredMusic`}
              maxLength={30}
              value={formData.preferredMusic}
              onChange={handleInputChange}
            />
            <InputField
              label="Special Requests"
              text="special"
              placeholder="Add here"
              type="text"
              id={`special`}
              name={`specialRequest`}
              maxLength={30}
              value={formData.specialRequest}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex items-center gap-2 my-2 px-1">
            <InputField
              label="Budget"
              text="budget"
              placeholder="Add here"
              type="text"
              id={`budget`}
              name={`budget`}
              maxLength={30}
              value={formData.budget}
              onChange={handleInputChange}
              error={formErrors.budget}
              touched={!!formErrors.budget}
            />
            <InputField
              label="Ticket at door (optional)"
              text="ticket"
              placeholder="Add here"
              type="text"
              id={`ticket`}
              name={`ticketAtDoor`}
              maxLength={30}
              value={formData.ticketAtDoor}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <div className="mt-4 px-1">
              <Button text="Next" type="button" onClick={handleNext} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestEventModal;
