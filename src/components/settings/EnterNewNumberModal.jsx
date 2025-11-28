/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import { useState } from "react";
import PhoneInput from "../auth/PhoneInput";

const EnterNewNumberModal = ({ onClose, onNext }) => {
  const [newNumber, setNewNumber] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setNewNumber(value);
    if (value) {
      setError("");
    }
  };

  const handleNext = () => {
    if (!newNumber || newNumber.trim() === "") {
      setError("Please enter a new phone number");
      return;
    }
    // Pass the new number to parent
    onNext(newNumber);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-4 overflow-y-auto">
        <div className="flex justify-end items-center px-8 pt-4">
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full pt-2 px-20">
          <div className="pt-2 space-y-2 text-center">
            <h2 className="text-[36px] font-semibold capitalize">
              Enter New Number
            </h2>
            <p className="text-[#565656] text-[16px]">
              Please enter your new phone number.
            </p>
          </div>

          <label htmlFor="newNumber" className="text-[14px] font-[500] -mb-4">
            Phone Number
          </label>

          <div>
            <PhoneInput
              placeholderText="text-black"
              id="newNumber"
              name="newNumber"
              value={newNumber}
              onChange={handleChange}
              onBlur={() => {}}
              error={error}
              touched={!!error}
              autoComplete="off"
            />
            {/* {error && <p className="text-red-500 text-[12px] mt-2">{error}</p>} */}
          </div>
        </div>

        <div className="mt-8 mx-20">
          <Button text="Next" type="button" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default EnterNewNumberModal;
