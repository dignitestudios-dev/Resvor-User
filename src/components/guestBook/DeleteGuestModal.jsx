/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import { binIcon } from "../../assets/export";

const DeleteGuestModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] max-w-[95%] pb-4 overflow-hidden">
        <div className="flex justify-end px-6 pt-4">
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[22px] text-[#181818]" />
          </div>
        </div>

        <div className="flex flex-col items-center px-8 py-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <img src={binIcon} alt="bin" className="w-10 h-10" />
          </div>

          <h3 className="text-[20px] font-bold text-black mb-2">
            Delete This Guest
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want delete this Guest. Please confirm to proceed.
          </p>

          <div className="flex gap-3 w-full">
            <Button
              onClick={onClose}
              className="flex-1 h-12 bg-white border border-gray-300 text-gray-700"
              text="Cancel"
            />
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-2  bg-red-600 hover:opacity-90 text-white text-[13px] rounded-lg w-full"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteGuestModal;
