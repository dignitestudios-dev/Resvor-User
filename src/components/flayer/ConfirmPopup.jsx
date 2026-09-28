/* eslint-disable react/prop-types */
import { successCheck } from "../../assets/export";
import { RxCross2 } from "react-icons/rx";

const ConfirmPopup = ({
  isOpen,
  onClose,
  title = "Invitation Sent",
  description = "Your invitation has been sent successfully.",
  buttonText = "View Campaign History",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] shadow-2xl p-8 w-[480px] max-w-full text-center relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <RxCross2 className="text-[22px]" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center pt-2 pb-4">
          <img
            src={successCheck}
            alt="Success Check"
            className="w-[100px] sm:w-[120px] object-contain drop-shadow-md"
          />
        </div>

        {/* Text */}
        <div className="space-y-2 mb-6">
          <h2 className="text-[28px] font-bold text-[#181818] capitalize">
            {title}
          </h2>
          <p className="text-[15px] text-[#565656]">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full max-w-xs py-3 px-6 rounded-xl bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[14px] font-semibold hover:opacity-90 transition shadow-md cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
