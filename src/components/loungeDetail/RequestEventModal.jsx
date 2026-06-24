/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import DatePickerField from "../global/DatePickerField";
import InputField from "../auth/InputField";
import Button from "./../global/Button";
import SelectField from "../global/SelectField";
import { ErrorToast } from "../global/Toaster";
import { useFormik } from "formik";
import { requestEventSchema } from "../../schema/app/appSchema";
import PhoneInput from "../auth/PhoneInput";
import { phoneFormatter, phoneToE164 } from "../../lib/helpers";

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

  // useFormik setup
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    setFieldError,
  } = useFormik({
    initialValues: {
      eventType: eventData?.eventType || "",
      eventName: eventData?.eventName || "",
      description: eventData?.description || "",
      startDate: eventData?.startDateTime ? new Date(eventData.startDateTime) : null,
      startTime: eventData?.startTime || "",
      endTime: eventData?.endTime || "",
      name: eventData?.name || "",
      email: eventData?.email || "",
      phone: eventData?.phone || "",
      guestCount: eventData?.guestCount ? String(eventData.guestCount) : "",
      preferredMusic: eventData?.preferredMusic === "None" ? "" : eventData?.preferredMusic || "",
      specialRequest: eventData?.specialRequest === "None" ? "" : eventData?.specialRequest || "",
      budget: eventData?.budget ? String(eventData.budget) : "",
      ticketAtDoor: typeof eventData?.ticketAtDoor === "boolean" ? eventData.ticketAtDoor : false,
    },
    validationSchema: requestEventSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      // Validate time bounds reactively
      const minCheck = checkTimeInRange(values.startTime, "Start time");
      const maxCheck = checkTimeInRange(values.endTime, "End time");

      if (minCheck || maxCheck) {
        if (minCheck) setFieldError("startTime", minCheck);
        if (maxCheck) setFieldError("endTime", maxCheck);
        ErrorToast("Please fill all the required fields correctly.");
        return;
      }

      // Prepare startDateTime and endDateTime
      const startDateTime = new Date(values.startDate);
      const [startH, startM] = values.startTime.split(":");
      startDateTime.setHours(parseInt(startH), parseInt(startM));

      const endDateTime = new Date(values.startDate);
      const [endH, endM] = values.endTime.split(":");
      endDateTime.setHours(parseInt(endH), parseInt(endM));

      const finalEventData = {
        title: values.eventName,
        eventName: values.eventName,
        eventType: values.eventType,
        description: values.description || values.eventName,
        date: values.startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
        startTime: values.startTime,
        endTime: values.endTime,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        name: values.name,
        email: values.email,
        phone: phoneToE164(values.phone),
        guestCount: Number(values.guestCount),
        preferredMusic: values.preferredMusic || "None",
        specialRequest: values.specialRequest || "None",
        budget: Number(values.budget),
        ticketAtDoor: values.ticketAtDoor,
        instructions: values.instructions || "",
      };
      onNext(finalEventData);
    },
  });

  // Effective min = max(lounge open, current time + 1 hour buffer) when today; else just lounge open
  const effectiveMinTime = isToday(values.startDate)
    ? (() => {
        const { timeStr } = getNowWithBuffer();
        if (!minTime) return timeStr;
        return timeStr > minTime ? timeStr : minTime;
      })()
    : minTime;

  const effectiveMinLabel = isToday(values.startDate)
    ? (() => {
        const { timeStr, label } = getNowWithBuffer();
        if (!minTime || timeStr > minTime) return `${label} (1-hour buffer)`;
        return openLabel;
      })()
    : openLabel;

  const isBufferEnforced = isToday(values.startDate) && (!minTime || getNowWithBuffer().timeStr > minTime);

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
    setFieldValue("startTime", val);
    const err = checkTimeInRange(val, "Start time");
    if (err) {
      setFieldError("startTime", err);
    } else {
      setFieldError("startTime", "");
    }
  };

  const handleEndTimeChange = (e) => {
    const val = e.target.value;
    setFieldValue("endTime", val);
    const err = checkTimeInRange(val, "End time");
    if (err) {
      setFieldError("endTime", err);
    } else {
      setFieldError("endTime", "");
    }
  };

  // Clamp to valid range on blur
  const handleStartTimeBlur = (e) => {
    handleBlur(e);
    const val = values.startTime;
    if (!val) return;
    if (effectiveMinTime && val < effectiveMinTime) {
      const clamped = effectiveMinTime <= "23:59" ? effectiveMinTime : "";
      setFieldValue("startTime", clamped);
      setFieldError("startTime", "");
    }
    if (maxTime && val > maxTime) {
      setFieldValue("startTime", maxTime);
      setFieldError("startTime", "");
    }
  };

  const handleEndTimeBlur = (e) => {
    handleBlur(e);
    const val = values.endTime;
    if (!val) return;
    if (effectiveMinTime && val < effectiveMinTime) {
      const clamped = effectiveMinTime <= "23:59" ? effectiveMinTime : "";
      setFieldValue("endTime", clamped);
      setFieldError("endTime", "");
    }
    if (maxTime && val > maxTime) {
      setFieldValue("endTime", maxTime);
      setFieldError("endTime", "");
    }
  };

  // Form input cleaners for numeric-only inputs
  const handlePhoneChange = (e) => {
    const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFieldValue("phone", cleanVal);
  };

  const handleGuestCountChange = (e) => {
    const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFieldValue("guestCount", cleanVal);
  };

  const handleBudgetChange = (e) => {
    const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 8);
    setFieldValue("budget", cleanVal);
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
        <form onSubmit={handleSubmit} className="px-8 py-4">
          <div className=" mx-1">
            <SelectField
              label="Event Type"
              name={`eventType`}
              placeholder="Select Event Type"
              value={values.eventType}
              onChange={(val) => setFieldValue("eventType", val)}
              error={errors.eventType}
              touched={touched.eventType}
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
              value={values.eventName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.eventName}
              touched={touched.eventName}
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
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
            />
          </div>
          <div className="my-2 mx-1">
            <DatePickerField
              label="Select Date"
              value={values.startDate}
              onChange={(date) => {
                setFieldValue("startDate", date);
              }}
            />
            {touched.startDate && errors.startDate && (
              <p className="text-red-600 text-[12px] mt-1">{errors.startDate}</p>
            )}
          </div>
          <div className="w-full flex items-start gap-2 my-2 px-1">
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
                  touched.startTime && errors.startTime ? "ring-red-500" : "ring-[#CACACA]"
                } focus:ring-2 focus:ring-gray-200 focus:outline-none`}
                value={values.startTime}
                onChange={handleStartTimeChange}
                onBlur={handleStartTimeBlur}
              />
              {effectiveMinTime && maxTime && (
                <p className="text-[11px] text-[#727272] mt-1">
                  Allowed: {effectiveMinLabel} – {closeLabel}
                </p>
              )}
              {touched.startTime && errors.startTime && (
                <p className="text-red-600 text-[12px] mt-1">{errors.startTime}</p>
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
                  touched.endTime && errors.endTime ? "ring-red-500" : "ring-[#CACACA]"
                } focus:ring-2 focus:ring-gray-200 focus:outline-none`}
                value={values.endTime}
                onChange={handleEndTimeChange}
                onBlur={handleEndTimeBlur}
              />
              {effectiveMinTime && maxTime && (
                <p className="text-[11px] text-[#727272] mt-1">
                  Allowed: {effectiveMinLabel} – {closeLabel}
                </p>
              )}
              {touched.endTime && errors.endTime && (
                <p className="text-red-600 text-[12px] mt-1">{errors.endTime}</p>
              )}
            </div>
            
          </div>
          <div className="w-full flex items-start gap-2 my-2 px-1">
            <div className="w-full">
              <InputField
                label="Full Name"
                text="name"
                placeholder="Full Name"
                type="text"
                id={`name`}
                name={`name`}
                maxLength={30}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
              />
            </div>
            <div className="w-full">
              <InputField
                label="Email address"
                text="email"
                placeholder="example@gamil.com"
                type="email"
                id={`email`}
                name={`email`}
                maxLength={30}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
              />
            </div>
          </div>
          <div className="w-full flex items-start gap-2 my-2 px-1">
            <div className="w-full">
              <PhoneInput
                label="Phone number"
                id="phone"
                name="phone"
                value={phoneFormatter(values.phone)}
                onChange={handlePhoneChange}
                onBlur={handleBlur}
                error={errors.phone}
                touched={touched.phone}
                labelColor="text-[#181818]"
                textColor="text-black"
                countryCodeColor="text-black"
                placeholderColor="placeholder:text-[#727272]"
                borderColor="border-[#CACACA]"
                bgColor="bg-transparent"
                autoComplete="off"
              />
            </div>
            <div className="w-full">
              <InputField
                label="Guest Count"
                text="guest"
                placeholder="Add here"
                type="text"
                id={`guest`}
                name={`guestCount`}
                maxLength={4}
                value={values.guestCount}
                onChange={handleGuestCountChange}
                onBlur={handleBlur}
                error={errors.guestCount}
                touched={touched.guestCount}
              />
            </div>
          </div>
          <div className="w-full flex items-start gap-2 my-2 px-1">
            <div className="w-full">
              <InputField
                label="Preferred Music Genre"
                text="music"
                placeholder="Add here"
                type="text"
                id={`music`}
                name={`preferredMusic`}
                maxLength={30}
                value={values.preferredMusic}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.preferredMusic}
                touched={touched.preferredMusic}
              />
            </div>
            <div className="w-full">
              <InputField
                label="Special Requests"
                text="special"
                placeholder="Add here"
                type="text"
                id={`special`}
                name={`specialRequest`}
                maxLength={30}
                value={values.specialRequest}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.specialRequest}
                touched={touched.specialRequest}
              />
            </div>
          </div>
          <div className="w-full flex items-start gap-2 my-2 px-1">
            <div className="w-full">
              <InputField
                label="Budget"
                text="budget"
                placeholder="Add here"
                type="text"
                id={`budget`}
                name={`budget`}
                maxLength={5}
                value={values.budget}
                onChange={handleBudgetChange}
                onBlur={handleBlur}
                error={errors.budget}
                touched={touched.budget}
              />
            </div>
            <div className="w-full">
              <SelectField
                label="Ticket at door (optional)"
                name="ticketAtDoor"
                placeholder="Select Option"
                value={values.ticketAtDoor}
                onChange={(val) => setFieldValue("ticketAtDoor", val)}
                error={errors.ticketAtDoor}
                touched={touched.ticketAtDoor}
                options={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
              />
            </div>
          </div>

          <div>
            <div className="mt-4 px-1">
              <Button text="Next" type="submit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestEventModal;
