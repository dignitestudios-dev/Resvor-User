/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import PhoneInput from "../auth/PhoneInput";
import { useState } from "react";

const ChangeNumberModal = ({ onClose, onNext }) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    if (value) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!phone || phone.trim() === "") {
    //   setError("Please enter your phone number");
    //   return;
    // }
    // Pass phone to parent and move to OTP step
    onNext(phone);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-8 overflow-y-auto">
        <div className="flex justify-end items-center px-8 pt-4 ">
          <div onClick={() => onClose()} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 w-full pt-2 px-20">
            <div className="pt-2 space-y-2 text-center">
              <h2 className="text-[36px] font-semibold  capitalize">
                change Number
              </h2>
              <p className="text-[#565656] text-[16px]">
                Please enter your current phone number.
              </p>
            </div>
            <label htmlFor="number" className="text-[14px] font-[500] -mb-4">
              Phone Number
            </label>
            <PhoneInput
              id="number"
              name="number"
              value={phone}
              onChange={handleChange}
              onBlur={() => {}}
              error={error}
              touched={!!error}
              autoComplete="off"
            />
            {error && <p className="text-red-500 text-[12px]">{error}</p>}
          </div>
          <div className="mt-8 mx-20">
            <Button text="Next" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeNumberModal;
