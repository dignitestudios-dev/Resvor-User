/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import InputField from "../auth/InputField";
import PhoneInput from "../auth/PhoneInput";
import { useFormik } from "formik";
import { useState, useRef } from "react";
import LoungeSelectField from "../global/LoungeSelectField";
import { useLounges } from "../../hooks/queries/useQueries";
import { useAddGuest } from "../../hooks/mutations/OnboardingMutations";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import { guestbookSchema } from "../../schema/app/appSchema";
import { useQueryClient } from "@tanstack/react-query";
import { FiCamera, FiPlus, FiTrash2 } from "react-icons/fi";
import { phoneFormatter, phoneToE164 } from "../../lib/helpers";

const MONTHS = [
  { value: "1", label: "January (01)" },
  { value: "2", label: "February (02)" },
  { value: "3", label: "March (03)" },
  { value: "4", label: "April (04)" },
  { value: "5", label: "May (05)" },
  { value: "6", label: "June (06)" },
  { value: "7", label: "July (07)" },
  { value: "8", label: "August (08)" },
  { value: "9", label: "September (09)" },
  { value: "10", label: "October (10)" },
  { value: "11", label: "November (11)" },
  { value: "12", label: "December (12)" },
];

const AddGuestModal = ({ onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [specialDates, setSpecialDates] = useState([]);
  const [newDateTitle, setNewDateTitle] = useState("");
  const [newDateVal, setNewDateVal] = useState("");

  const { mutate: addGuestMutation, isPending } = useAddGuest();
  const { data: loungesResponse, isLoading: isLoadingLounges } = useLounges();

  const loungeOptions =
    loungesResponse?.data?.map((lounge) => ({
      label: lounge.name,
      value: lounge._id,
    })) || [];

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        ErrorToast("Image size cannot exceed 5MB.");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddSpecialDate = () => {
    if (!newDateTitle.trim() || !newDateVal) {
      ErrorToast("Please enter both title and date for the special date.");
      return;
    }
    if (newDateTitle.trim().length > 30) {
      ErrorToast("Special date title cannot exceed 30 characters.");
      return;
    }
    setSpecialDates((prev) => [
      ...prev,
      { title: newDateTitle.trim(), date: newDateVal },
    ]);
    setNewDateTitle("");
    setNewDateVal("");
  };

  const handleRemoveSpecialDate = (index) => {
    setSpecialDates((prev) => prev.filter((_, i) => i !== index));
  };

  const {
    values,
    handleBlur,
    handleChange,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthMonth: "",
      details: "",
      lounge: "",
    },
    validationSchema: guestbookSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      formData.append("loungeId", values.lounge);
      formData.append("firstName", values.firstName.trim());
      formData.append("lastName", values.lastName.trim());
      formData.append("email", values.email.trim());

      if (values.phoneNumber) {
        const formattedE164 = phoneToE164(values.phoneNumber);
        formData.append("phoneNumber", formattedE164);
      }
      if (values.birthMonth) {
        formData.append("birthMonth", values.birthMonth);
      }
      if (values.details) {
        formData.append("details", values.details.trim());
      }
      const cleanedSpecialDates = specialDates.map((item) => ({
        title: item.title,
        date: item.date
          ? item.date.includes("T")
            ? item.date.split("T")[0]
            : item.date
          : "",
      }));

      if (cleanedSpecialDates.length > 0) {
        formData.append("specialDates", JSON.stringify(cleanedSpecialDates));
      }
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      addGuestMutation(formData, {
        onSuccess: (response) => {
          console.log("Guest added:", response);
          SuccessToast("Guest added successfully!");
          queryClient.invalidateQueries({ queryKey: ["guestbook"] });
          onClose();
        },
        onError: (error) => {
          console.log("Add guest failed:", error);
          ErrorToast(error?.response?.data?.message || error?.message || "Failed to add guest.");
        },
      });
    },
  });

  const handlePhoneChange = (e) => {
    const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFieldValue("phoneNumber", cleanVal);
  };
  const today = new Date();

  const maxDate = today.toISOString().split("T")[0];

  const minDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] h-auto max-h-[90vh] w-[580px] max-w-full pb-8 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-b-[#0000001a]">
          <h2 className="text-[24px] font-bold text-[#181818]">Add New Guest</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
          >
            <RxCross2 className="text-[24px] text-[#181818]" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto px-8 pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Photo Upload Section */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden group">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Guest preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiCamera className="text-gray-400 text-2xl" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-700">Guest Photo</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="guest-photo-upload"
                  />
                  <label
                    htmlFor="guest-photo-upload"
                    className="cursor-pointer text-xs font-semibold px-3 py-1.5 bg-[#0F2232] text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs text-red-500 font-semibold px-2 py-1.5 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name *"
                placeholder="e.g. Grace"
                id="firstName"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
                maxLength={40}
              />
              <InputField
                label="Last Name *"
                placeholder="e.g. Hopper"
                id="lastName"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                touched={touched.lastName}
                maxLength={40}
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Email address *"
                placeholder="e.g. grace@example.com"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                maxLength={60}
              />
              <div>
                <PhoneInput
                  label="Phone Number"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneFormatter(values.phoneNumber)}
                  onChange={handlePhoneChange}
                  onBlur={handleBlur}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                  labelColor="text-black"
                  textColor="text-black"
                  countryCodeColor="text-black"
                  placeholderColor="placeholder:text-gray-400"
                  borderColor="border-[#CACACA]"
                  bgColor="bg-white"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Lounge Name & Birth Month */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LoungeSelectField
                label="Lounge Name *"
                placeholder={isLoadingLounges ? "Loading lounges..." : "Select lounge..."}
                name="lounge"
                value={values.lounge}
                onChange={(value) => {
                  setFieldValue("lounge", value);
                  setFieldTouched("lounge", true, false);
                }}
                error={errors.lounge}
                touched={touched.lounge}
                options={loungeOptions}
              />

              <div className="flex flex-col">
                <label className="text-[14px] font-[500] text-black mb-2">
                  Birth Month
                </label>
                <select
                  name="birthMonth"
                  value={values.birthMonth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full px-4 py-3 text-sm rounded-[12px] border border-[#CACACA] bg-white text-gray-800 focus:outline-none focus:border-black"
                >
                  <option value="">Select Birth Month</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Dates Section */}
            <div className="border border-gray-200 rounded-[12px] p-4 bg-gray-50/50">
              <span className="text-sm font-semibold text-gray-800 block mb-2">
                Special Dates
              </span>

              {specialDates.length > 0 && (
                <div className="flex flex-col gap-2 mb-3 max-h-[240px] overflow-y-auto pr-2">
                  {specialDates.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    >
                      <div>
                        <span className="font-semibold text-gray-800 mr-2">
                          {item.title}:
                        </span>
                        <span className="text-gray-600">{item.date}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialDate(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                  type="text"
                  placeholder="Title (e.g. Birthday)"
                  value={newDateTitle}
                  maxLength={30}
                  onChange={(e) => setNewDateTitle(e.target.value)}
                  className="w-full sm:w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none"
                />
                <input
                  type="date"
                  value={newDateVal}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setNewDateVal(e.target.value)}
                  className="w-full sm:w-1/2 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSpecialDate}
                  className="w-full sm:w-auto px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg text-sm flex items-center justify-center gap-1 shrink-0"
                >
                  <FiPlus size={16} /> Add
                </button>
              </div>
            </div>

            {/* Details / Preferences */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[14px] font-[500] text-black">
                  Details / Notes
                </label>
                <span className="text-xs text-gray-400">
                  {values.details?.length || 0}/300
                </span>
              </div>
              <textarea
                name="details"
                id="details"
                rows={3}
                placeholder="e.g. Prefers VIP seating, dietary preferences..."
                value={values.details}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2.5 text-sm rounded-[12px] border border-[#CACACA] bg-white focus:outline-none focus:border-black resize-none"
                maxLength={300}
              />
              {errors.details && touched.details && (
                <p className="text-red-600 text-xs mt-1">{errors.details}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <Button
                text={isPending ? "Adding Guest..." : "Confirm"}
                type="submit"
                disabled={isPending}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGuestModal;
