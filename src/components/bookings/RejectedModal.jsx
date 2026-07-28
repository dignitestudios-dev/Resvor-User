/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";

const RejectedModal = ({ isOpen, onClose, rejectionReason }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A150F80] p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[500px] rounded-[16px] bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-[20px] font-bold text-[#181818]">
            Rejected Reason
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-800 transition"
          >
            <RxCross2 className="text-[24px]" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-rose-50 border border-rose-100 rounded-[12px] p-4 mb-6 max-w-full overflow-hidden">
          <p className="text-[14px] text-gray-700 leading-relaxed break-all break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
            {rejectionReason || "No rejection reason provided."}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-[12px] bg-[#212935] text-white text-[14px] font-semibold hover:bg-[#151b24] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectedModal;
