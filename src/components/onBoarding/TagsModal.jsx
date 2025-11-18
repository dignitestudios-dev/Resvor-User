/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import DateInput from "../auth/DateInput";
// import { HiOutlinePlus } from "react-icons/hi";
import AuthInput from "../auth/AuthInput";
import { useState } from "react";

const TagsModal = ({ isOpen, onClose, setDateModalData }) => {
  const [specialDates, setSpecialDates] = useState([]);
  const [dobDate, setDobDate] = useState({ day: "", month: "", year: "" });

  // handle input change for each field
  const handleChange = (index, field, value) => {
    const updated = [...specialDates];
    updated[index][field] = value;
    setSpecialDates(updated);
  };

  const handleDobChange = (field, value) => {
    setDobDate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // add new special date set (max 3)
  const handleAddMore = () => {
    if (specialDates.length < 3) {
      setSpecialDates([
        ...specialDates,
        { title: "", day: "", month: "", year: "" },
      ]);
    }
  };

  // remove a set (optional)
  const handleRemove = (index) => {
    const updated = specialDates.filter((_, i) => i !== index);
    setSpecialDates(updated);
  };

  const handleDateData = () => {
    setDateModalData({ dobDate: dobDate, specialDates: specialDates });
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

        <div className="max-h-[540px] overflow-auto scrollbar-custom  ">
          <label className="block text-[14px] font-[500] text-[#181818] mb-2 mt-6">
            When Is Your Birthday?{" "}
            <span className="text-[#CACACA]">(required)</span>
          </label>
          <div className="flex justify-between items-center gap-2 p-1">
            <DateInput
              text="day"
              placeholder="Day"
              type="text"
              id={`day`}
              name={`day`}
              maxLength={2}
              value={dobDate.day}
              onChange={(e) => handleDobChange("day", e.target.value)}
            />
            <DateInput
              text="month"
              placeholder="Month"
              type="text"
              id={`month`}
              name={`month`}
              maxLength={2}
              value={dobDate.month}
              onChange={(e) => handleDobChange("month", e.target.value)}
            />
            <DateInput
              text="year"
              placeholder="Year (optional)"
              type="text"
              id={`year`}
              name={`year`}
              maxLength={4}
              value={dobDate.year}
              onChange={(e) => handleDobChange("year", e.target.value)}
            />
          </div>
          <div>
            {specialDates.map((date, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                <div>
                  <label className="block text-[14px] font-[500] text-[#181818] mb-2 mt-6">
                    Title for Special Date
                  </label>
                  <div className="px-1">
                    <AuthInput
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-[500] text-[#181818] mb-2 mt-6">
                    When Is Your Birthday?{" "}
                    <span className="text-[#CACACA]">(required)</span>
                  </label>
                  <div className="flex justify-between items-center gap-2 p-1">
                    <DateInput
                      text="day"
                      placeholder="Day"
                      type="text"
                      id={`day-${index}`}
                      name={`day-${index}`}
                      value={date.day}
                      onChange={(e) =>
                        handleChange(index, "day", e.target.value)
                      }
                    />
                    <DateInput
                      text="month"
                      placeholder="Month"
                      type="text"
                      id={`month-${index}`}
                      name={`month-${index}`}
                      value={date.month}
                      onChange={(e) =>
                        handleChange(index, "month", e.target.value)
                      }
                    />
                    <DateInput
                      text="year"
                      placeholder="Year (optional)"
                      type="text"
                      id={`year-${index}`}
                      name={`year-${index}`}
                      value={date.year}
                      onChange={(e) =>
                        handleChange(index, "year", e.target.value)
                      }
                    />
                  </div>
                </div>

                {specialDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Add More Button */}
            {specialDates.length < 3 && (
              <div className="p-1">
                <button
                  type="button"
                  onClick={handleAddMore}
                  className="flex items-center gap-2 pt-3 cursor-pointer"
                >
                  <p className="text-[#181818] text-[14px] font-[500]">
                    + Add more Special Dates
                  </p>
                </button>
              </div>
            )}

            {/* Just for debugging */}
            <pre className="text-xs mt-4 bg-gray-50 p-2 rounded">
              {JSON.stringify(specialDates, null, 2)}
            </pre>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDateData}
              className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] px-4 py-3 rounded-[12px] w-[97%]"
            >
              Add Date And Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsModal;
