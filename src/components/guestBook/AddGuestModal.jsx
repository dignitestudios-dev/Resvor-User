/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import InputField from "../auth/InputField";
import PhoneInput from "../auth/PhoneInput";
import SelectField from "../global/SelectField";
import { useFormik } from "formik";
import { useState, useRef, useMemo } from "react";
import LoungeSelectField from "../global/LoungeSelectField";
import { useLounges } from "../../hooks/queries/useQueries";
import { useAddGuest } from "../../hooks/mutations/OnboardingMutations";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import { guestbookSchema } from "../../schema/app/appSchema";
import { useQueryClient } from "@tanstack/react-query";
import { FiCamera, FiPlus, FiTrash2 } from "react-icons/fi";
import { normalizePhoneDigits, phoneFormatter, phoneToE164 } from "../../lib/helpers";
import usaStatesCities from "../../data/usa_states_cities.json";

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

const stateOptions = Object.keys(usaStatesCities).map((state) => ({
  label: state,
  value: state,
}));

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
      company: "",
      title: "",
      website: "",
      nickname: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "United States (USA)",
      },
      socialNetwork: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
      phoneNumber: "",
      birthMonth: "",
      details: "",
      lounge: "",
    },
    validationSchema: guestbookSchema,
    onSubmit: (values) => {
      const cleanedSpecialDates = specialDates.map((item) => ({
        title: item.title,
        date: item.date
          ? item.date.includes("T")
            ? item.date.split("T")[0]
            : item.date
          : "",
      }));

      const payload = {
        loungeId: values.lounge,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        title: values.title.trim(),
        website: values.website.trim(),
        address: {
          street: values.address.street?.trim() || "",
          city: values.address.city?.trim() || "",
          state: values.address.state?.trim() || "",
          zip: values.address.zip?.trim() || "",
          country: values.address.country?.trim() || "United States (USA)",
        },
        nickname: values.nickname.trim(),
        socialNetwork: {
          facebook: values.socialNetwork.facebook?.trim() || "",
          twitter: values.socialNetwork.twitter?.trim() || "",
          linkedin: values.socialNetwork.linkedin?.trim() || "",
          instagram: values.socialNetwork.instagram?.trim() || "",
        },
        ...(values.phoneNumber ? { phoneNumber: phoneToE164(values.phoneNumber) } : {}),
        ...(values.birthMonth ? { birthMonth: Number(values.birthMonth) } : {}),
        ...(values.details?.trim() ? { details: values.details.trim() } : {}),
        specialDates: cleanedSpecialDates,
        ...(photoFile ? { photo: photoFile } : {}),
      };

      addGuestMutation(payload, {
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

  const cityOptions = useMemo(() => {
    const rawCities = values.address?.state
      ? usaStatesCities[values.address.state] || []
      : [];
    const seen = new Set();
    const list = [];
    for (const c of rawCities) {
      const trimmed = typeof c === "string" ? c.trim() : "";
      if (trimmed && !seen.has(trimmed.toLowerCase())) {
        seen.add(trimmed.toLowerCase());
        list.push({ label: trimmed, value: trimmed });
      }
    }
    return list;
  }, [values.address?.state]);

  const handlePhoneChange = (e) => {
    const cleanVal = normalizePhoneDigits(e.target.value);
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
      <div className="bg-white rounded-[16px] h-auto max-h-[90vh] w-[620px] max-w-full pb-8 flex flex-col shadow-2xl">
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
                placeholder="e.g. Ava"
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
                placeholder="e.g. Khan"
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
                placeholder="e.g. ava@example.com"
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

            {/* Nickname & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Nickname *"
                placeholder="e.g. Av"
                id="nickname"
                name="nickname"
                value={values.nickname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.nickname}
                touched={touched.nickname}
                maxLength={50}
              />
              <InputField
                label="Website *"
                placeholder="e.g. https://example.com"
                id="website"
                name="website"
                value={values.website}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.website}
                touched={touched.website}
                maxLength={100}
              />
            </div>

            {/* Company & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Company *"
                placeholder="e.g. Acme Inc."
                id="company"
                name="company"
                value={values.company}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.company}
                touched={touched.company}
                maxLength={60}
              />
              <InputField
                label="Title *"
                placeholder="e.g. Product Manager"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                maxLength={60}
              />
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

            {/* Address Section */}
            <div className="flex flex-col gap-4 border border-gray-200 rounded-[12px] p-4 bg-gray-50/50">
              <span className="text-sm font-semibold text-gray-800">
                Address
              </span>
              <InputField
                label="Street"
                placeholder="e.g. 123 Main Street"
                id="address.street"
                name="address.street"
                value={values.address?.street}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.address?.street}
                touched={touched.address?.street}
                maxLength={120}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <SelectField
                  label="State"
                  placeholder="Select State"
                  name="address.state"
                  value={values.address?.state}
                  onChange={(val) => {
                    setFieldValue("address.state", val);
                    if (!val) {
                      setFieldValue("address.city", "");
                    }
                    setFieldTouched("address.state", true, false);
                  }}
                  onBlur={() => setFieldTouched("address.state", true, false)}
                  error={errors.address?.state}
                  touched={touched.address?.state}
                  options={stateOptions}
                  searchable={true}
                  isClearable={true}
                />
                <SelectField
                  label={values.address?.state ? "City *" : "City"}
                  placeholder={
                    values.address?.state
                      ? "Select City"
                      : "Select State first"
                  }
                  name="address.city"
                  value={values.address?.city}
                  disabled={!values.address?.state}
                  onChange={(val) => {
                    setFieldValue("address.city", val);
                    setFieldTouched("address.city", true, false);
                  }}
                  onBlur={() => setFieldTouched("address.city", true, false)}
                  error={errors.address?.city}
                  touched={touched.address?.city}
                  options={cityOptions}
                  searchable={true}
                  isClearable={true}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Zip Code"
                  placeholder="e.g. 90210"
                  id="address.zip"
                  name="address.zip"
                  value={values.address?.zip}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.address?.zip}
                  touched={touched.address?.zip}
                  maxLength={20}
                />
                <InputField
                  label="Country"
                  placeholder="United States (USA)"
                  id="address.country"
                  name="address.country"
                  value={values.address?.country || "United States (USA)"}
                  disabled
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.address?.country}
                  touched={touched.address?.country}
                  maxLength={60}
                />
              </div>
            </div>

            {/* Social etworks Section */}
            <div className="flex flex-col gap-4 border border-gray-200 rounded-[12px] p-4 bg-gray-50/50">
              <span className="text-sm font-semibold text-gray-800">
                Social Networks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                  id="socialNetwork.facebook"
                  name="socialNetwork.facebook"
                  value={values.socialNetwork?.facebook}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.socialNetwork?.facebook}
                  touched={touched.socialNetwork?.facebook}
                  maxLength={200}
                />
                <InputField
                  label="Twitter / X"
                  placeholder="https://x.com/username"
                  id="socialNetwork.twitter"
                  name="socialNetwork.twitter"
                  value={values.socialNetwork?.twitter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.socialNetwork?.twitter}
                  touched={touched.socialNetwork?.twitter}
                  maxLength={200}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  id="socialNetwork.linkedin"
                  name="socialNetwork.linkedin"
                  value={values.socialNetwork?.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.socialNetwork?.linkedin}
                  touched={touched.socialNetwork?.linkedin}
                  maxLength={200}
                />
                <InputField
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                  id="socialNetwork.instagram"
                  name="socialNetwork.instagram"
                  value={values.socialNetwork?.instagram}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.socialNetwork?.instagram}
                  touched={touched.socialNetwork?.instagram}
                  maxLength={200}
                />
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
