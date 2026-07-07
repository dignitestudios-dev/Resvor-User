/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import DateInput from "../auth/DateInput";
import AuthInput from "../auth/AuthInput";

const TagsModal = ({
  isOpen,
  onClose,
  setFieldValue,
  setFieldError,
  initialData,
}) => {
  const [specialDates, setSpecialDates] = useState([]);
  const [dobDate, setDobDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setDobDate(
        initialData?.dobDate || {
          day: "",
          month: "",
          year: "",
        }
      );

      setSpecialDates(initialData?.specialDates || []);
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = (datesList = specialDates, checkDob = true) => {
    const newErrors = {};

    if (checkDob) {
      if (!dobDate.day || !dobDate.month) {
        newErrors.dob = "Birthday is required (Day and Month)";
      }
    }

    const specialDatesErrors = [];
    datesList.forEach((date, index) => {
      const itemErrors = {};
      if (!date.title || !date.title.trim()) {
        itemErrors.title = "Title is required";
      }
      if (!date.day || !date.month) {
        itemErrors.date = "Day and Month are required";
      }
      if (Object.keys(itemErrors).length > 0) {
        specialDatesErrors[index] = itemErrors;
      }
    });

    if (specialDatesErrors.length > 0) {
      newErrors.specialDates = specialDatesErrors;
    }

    return newErrors;
  };

  const clearSpecialDateError = (index, field) => {
    setErrors((prev) => {
      if (!prev.specialDates || !prev.specialDates[index]) return prev;
      const newSpecErrors = [...prev.specialDates];
      if (newSpecErrors[index]) {
        newSpecErrors[index] = { ...newSpecErrors[index] };
        delete newSpecErrors[index][field];
        if (Object.keys(newSpecErrors[index]).length === 0) {
          newSpecErrors[index] = undefined;
        }
      }
      const hasRemaining = newSpecErrors.some((item) => item && Object.keys(item).length > 0);
      return {
        ...prev,
        specialDates: hasRemaining ? newSpecErrors : undefined,
      };
    });
  };

  const handleChange = (index, field, value) => {
    const updated = [...specialDates];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSpecialDates(updated);

    if (field === "title") {
      clearSpecialDateError(index, "title");
    } else if (field === "day" || field === "month") {
      clearSpecialDateError(index, "date");
    }
  };

  const handleDobChange = (field, value) => {
    setDobDate((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors.dob) {
      setErrors((prev) => ({
        ...prev,
        dob: undefined,
      }));
    }
  };

  const handleAddMore = () => {
    const newErrors = validate(specialDates, false);
    if (newErrors.specialDates && newErrors.specialDates.length > 0) {
      setErrors(newErrors);
      return;
    }

    if (specialDates.length < 3) {
      setSpecialDates([
        ...specialDates,
        {
          title: "",
          day: "",
          month: "",
          year: "",
        },
      ]);
    }
  };

  const handleRemove = (index) => {
    const updated = specialDates.filter((_, i) => i !== index);
    setSpecialDates(updated);

    if (errors.specialDates) {
      const updatedErrors = errors.specialDates.filter((_, i) => i !== index);
      const hasRemaining = updatedErrors.some((item) => item && Object.keys(item).length > 0);
      setErrors((prev) => ({
        ...prev,
        specialDates: hasRemaining ? updatedErrors : undefined,
      }));
    }
  };

  const handleDateData = () => {
    const newErrors = validate(specialDates, true);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.dob) {
        setFieldError("specialDatesData", newErrors.dob);
      } else {
        setFieldError("specialDatesData", "Please fill all required fields for special dates.");
      }
      return;
    }

    const payload = {
      dobDate,
      specialDates,
    };

    setFieldValue("specialDatesData", payload);
    setFieldError("specialDatesData", "");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-h-[680px] max-w-[515px] p-10 relative">
        <button
          type="button"
          className="absolute top-5 right-6"
          onClick={onClose}
        >
          <RxCross2 className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-[28px] font-bold mb-4">
          Add Birthday & Special Date
        </h2>

        <p className="text-[#565656] text-[16px]">
          Tell us about your special dates so we can send you exclusive lounge
          offers and curated invitations.
        </p>

        <div className="max-h-[500px] overflow-auto scrollbar-custom">
          {/* Birthday */}
          <label className="block text-[14px] font-[500] text-[#181818] mb-2 mt-6">
            When Is Your Birthday?
            <span className="text-[#CACACA]"> (required)</span>
          </label>

          <div className="flex justify-between items-center gap-2 p-1">
            <DateInput
              text="month"
              placeholder="Month"
              type="text"
              id="month"
              name="month"
              maxLength={2}
              value={dobDate.month}
              onChange={(e) => handleDobChange("month", e.target.value)}
              hasError={!!errors.dob}
            />

            <DateInput
              text="day"
              placeholder="Day"
              type="text"
              id="day"
              name="day"
              maxLength={2}
              value={dobDate.day}
              onChange={(e) => handleDobChange("day", e.target.value)}
              hasError={!!errors.dob}
            />

            <DateInput
              text="year"
              placeholder="Year (optional)"
              type="text"
              id="year"
              name="year"
              maxLength={4}
              value={dobDate.year}
              onChange={(e) => handleDobChange("year", e.target.value)}
            />
          </div>
          {errors.dob && (
            <p className="text-red-600 text-[12px] mt-1 px-1">{errors.dob}</p>
          )}

          {/* Special Dates */}
          {specialDates.map((date, index) => (
            <div
              key={index}
              className="border-b border-gray-200 pb-4 mb-4"
            >
              <label className="block text-[14px] font-[500] text-[#181818] mb-2 mt-6">
                Title for Special Date
              </label>

              <div className="px-1">
                <AuthInput
                  textColor={true}
                  text="specialDate"
                  placeholder="e.g. Anniversary"
                  type="text"
                  id={`specialDate-${index}`}
                  name={`specialDate-${index}`}
                  maxLength={30}
                  value={date.title}
                  onChange={(e) =>
                    handleChange(index, "title", e.target.value)
                  }
                  error={errors.specialDates?.[index]?.title}
                  touched={!!errors.specialDates?.[index]?.title}
                />
              </div>

              <label className="block text-[14px] font-[500] text-[#181818] mb-2 mt-6">
                Add Date
                <span className="text-[#CACACA]"> (required)</span>
              </label>

              <div className="flex justify-between items-center gap-2 p-1">
                <DateInput
                  text="month"
                  placeholder="Month"
                  type="text"
                  id={`month-${index}`}
                  name={`month-${index}`}
                  maxLength={2}
                  value={date.month}
                  onChange={(e) =>
                    handleChange(index, "month", e.target.value)
                  }
                  hasError={!!errors.specialDates?.[index]?.date}
                />

                <DateInput
                  text="day"
                  placeholder="Day"
                  type="text"
                  id={`day-${index}`}
                  name={`day-${index}`}
                  maxLength={2}
                  value={date.day}
                  onChange={(e) =>
                    handleChange(index, "day", e.target.value)
                  }
                  hasError={!!errors.specialDates?.[index]?.date}
                />

                <DateInput
                  text="year"
                  placeholder="Year (optional)"
                  type="text"
                  id={`year-${index}`}
                  name={`year-${index}`}
                  maxLength={4}
                  value={date.year}
                  onChange={(e) =>
                    handleChange(index, "year", e.target.value)
                  }
                />
              </div>
              {errors.specialDates?.[index]?.date && (
                <p className="text-red-600 text-[12px] mt-1 px-1">
                  {errors.specialDates[index].date}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add More */}
          {specialDates.length < 3 && (
            <div className="p-1">
              <button
                type="button"
                onClick={handleAddMore}
                className="flex items-center gap-2 pt-3 cursor-pointer"
              >
                <p className="text-[#181818] text-[14px] font-[500]">
                  + Add More Special Dates
                </p>
              </button>
            </div>
          )}

          {/* Continue */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleDateData}
              className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] px-4 py-3 rounded-[12px] w-[97%]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsModal;