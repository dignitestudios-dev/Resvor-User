/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { HiOutlineXMark } from "react-icons/hi2";
import { danger, logout } from "../../assets/export";

const CancelSubscriptionModal = ({
  isOpen,
  setIsOpen,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Cancel Subscription"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      className="flex items-center justify-center border-none outline-none z-[1000]"
      overlayClassName="fixed inset-0 bg-[#C6C6C6]/50 backdrop-blur-sm z-[1000] flex justify-center items-center"
    >
      <div className="bg-white rounded-[16px] shadow-lg p-2 w-[450px] flex flex-col justify-center gap-3">
        <div className="flex justify-end w-full p-2">
          <button
            onClick={() => setIsOpen(false)}
            disabled={loading}
            aria-label="Close"
          >
            <HiOutlineXMark size={23} />
          </button>
        </div>

        <div className="flex items-center px-5 flex-col gap-2 mb-4">
          <div className="w-full flex justify-center">
            <img src={danger} className="w-20" />
          </div>
          <h2 className="text-[#181818] font-bold text-[20px]">
            Cancel Subscription
          </h2>
          <p className="text-[#565656] text-[16px]">
            Are you sure you want to cancel this subscription plan?
          </p>

          <div className="flex gap-3 items-center mt-3">
            <button
              className="bg-[#EE3131] text-white text-[13px] font-semibold rounded-[12px] px-10 py-3 disabled:opacity-60 w-[170px]"
              onClick={() => onConfirm && onConfirm()}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Proceed Now"}
            </button>
            <button
              className="bg-[#21293514] text-[#212935] text-[13px] font-bold rounded-[12px] px-10 py-3 w-[170px]"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CancelSubscriptionModal;
