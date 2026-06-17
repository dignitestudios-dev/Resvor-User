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

const RequestEventModal = ({ onClose, onNext }) => {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);

  // const [selectedType, setSelectedType] = useState([]);

  const [formData, setFormData] = useState({
    eventType: "",
    eventName: "",
    name: "",
    email: "",
    phone: "",
    guestCount: "",
    preferredMusic: "",
    specialRequest: "",
    budget: "",
    ticketAtDoor: "",
    description: "",
  });

  const [endDate, setEndDate] = useState("");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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
    if (!formData.name) errors.name = "Full name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.guestCount) {
      errors.guestCount = "Guest count is required";
    } else if (isNaN(formData.guestCount) || Number(formData.guestCount) <= 0) {
      errors.guestCount = "Enter a valid guest count";
    }
    if (!formData.budget) {
      errors.budget = "Budget is required";
    } else if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
      errors.budget = "Enter a valid budget";
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
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${formErrors.startTime ? "ring-red-500" : "ring-[#CACACA]"}
  focus:ring-2 focus:ring-gray-200 focus:outline-none  placeholder:font-light placeholder:text-[12px] placeholder:text-[#E6E6F0]
  }`}
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setFormErrors((prev) => ({ ...prev, startTime: "" }));
                }}
              />
              {formErrors.startTime && (
                <p className="text-red-600 text-[12px] mt-1">{formErrors.startTime}</p>
              )}
            </div>

            {/* <TimePickerField
              text="Start Time"
              label="Select Time"
              value={startTime}
              onChange={setStartTime}
              open={openField === "start"}
              onOpen={() =>
                setOpenField(openField === "start" ? null : "start")
              }
              position={"-left-4"}
            />*/}

            <div className="w-full">
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                End Time
              </label>
              <input
                type="time"
                data-slot="input"
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${formErrors.endTime ? "ring-red-500" : "ring-[#CACACA]"}
  focus:ring-2 focus:ring-gray-200 focus:outline-none  placeholder:font-light placeholder:text-[12px] placeholder:text-[#E6E6F0]
  }`}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setFormErrors((prev) => ({ ...prev, endTime: "" }));
                }}
              />
              {formErrors.endTime && (
                <p className="text-red-600 text-[12px] mt-1">{formErrors.endTime}</p>
              )}
            </div>
            {/*
            <TimePickerField
              text="End Time"
              label="Select Time"
              value={endDate}
              onChange={setEndDate}
              open={openField === "end"}
              onOpen={() => setOpenField(openField === "end" ? null : "end")}
              position={"-right-6"}
            /> */}
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
              maxLength={30}
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
              maxLength={30}
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
