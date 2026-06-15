/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import DatePickerField from "../global/DatePickerField";
import { useState } from "react";
// import TimePickerField from "../global/TimePickerField";
import InputField from "../auth/InputField";
import Button from "./../global/Button";
import SelectField from "../global/SelectField";
import { ErrorToast } from "../global/Toaster";

const BookingModal = ({ onClose, onNext, loungeId }) => {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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
    name: "",
    email: "",
    phone: "",
    guestCount: "",
    children: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!startDate) errors.date = "Date is required";
    if (!startTime) errors.startTime = "Start time is required";
    if (!endTime) errors.endTime = "End time is required";
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone) errors.phone = "Phone is required";
    if (!formData.guestCount) {
      errors.guestCount = "Guest count is required";
    } else if (isNaN(formData.guestCount) || Number(formData.guestCount) <= 0) {
      errors.guestCount = "Valid guest count required";
    }

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
      phone: formData.phone,
      date: startDate ? startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }) : "",
      time: startTime,
      guestCount: `${formData.guestCount} Guests`,
      children: formData.children || "None",
    };

    const apiPayload = {
      loungeId,
      bookingDate: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      guestCount: Number(formData.guestCount),
    };

    if (onNext) onNext({ displayData, apiPayload });
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 h-[570px] overflow-y-auto  ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Make Reservation</h2>
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
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${formErrors.startTime ? "ring-red-600" : "ring-[#CACACA]"}
  focus:ring-2 focus:ring-gray-200 focus:outline-none  placeholder:font-light placeholder:text-[12px] placeholder:text-[#E6E6F0]
  }`}
                value={startTime}
                onChange={(e) => { setStartTime(e.target.value); setFormErrors(p => ({...p, startTime: ""})); }}
              />
              {formErrors.startTime && <p className="text-red-600 text-[12px] mt-1">{formErrors.startTime}</p>}
            </div>
               <div className="w-full">
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
               End Time
              </label>
              <input
                type="time"
                data-slot="input"
                className={`text-black w-full px-4 py-2 text-sm rounded-[15px] bg-white/10 backdrop-blur-[28.9px] ring-1 ${formErrors.endTime ? "ring-red-600" : "ring-[#CACACA]"}
  focus:ring-2 focus:ring-gray-200 focus:outline-none  placeholder:font-light placeholder:text-[12px] placeholder:text-[#E6E6F0]
  }`}
                value={endTime}
                onChange={(e) => { setEndTime(e.target.value); setFormErrors(p => ({...p, endTime: ""})); }}
              />
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
            </div>
            <div className="w-full flex items-start gap-2 px-1">
              <InputField
                label="Guest Count"
                text="guest"
                placeholder="Add here"
                type="number"
                id={`guest`}
                name={`guestCount`}
                maxLength={30}
                value={formData.guestCount}
                onChange={handleInputChange}
                error={formErrors.guestCount}
                touched={!!formErrors.guestCount}
              />
              <InputField
                label="Children (if any)"
                text="children"
                placeholder="Add here"
                type="number"
                id={`children`}
                name={`children`}
                maxLength={30}
                value={formData.children}
                onChange={handleInputChange}
              />
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
