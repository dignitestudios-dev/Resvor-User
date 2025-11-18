/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";

const DeleteAccountModal = ({ onClose, onNext }) => {
  const handleContinue = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-4 overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 ">
          <div></div>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full pt-4 px-8 text-center">
          <h2 className="text-[36px] font-semibold ">Delete Account</h2>
          <p className="text-[16px] text-[#212121] font-[500]">
            We will send 5 digits code to david@mail.com
          </p>
          <p className="text-[#565656] text-[14px]">
            Your data will be removed from our database permanently.
          </p>
          <div className="my-8 mx-20">
            <Button text="Continue" type="button" onClick={handleContinue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
