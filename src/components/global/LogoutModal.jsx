/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { HiOutlineXMark } from "react-icons/hi2";
import { useNavigate } from "react-router"; // ✅ fix
import { logout } from "../../assets/export";

const LogOutModal = ({ isOpen, setIsOpen, onConfirm, loading = false }) => {
  const navigate = useNavigate(); // (not used now, kept if you need close+navigate on "No")

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Log Out"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
      className="flex items-center justify-center border-none outline-none z-[1000]"
      overlayClassName="fixed inset-0 bg-[#C6C6C6]/50 backdrop-blur-sm z-[1000] flex justify-center items-center"
    >
      <div className="bg-white rounded-[16px] shadow-lg p-2 w-[380px] flex flex-col justify-center gap-3">
        <div className="flex justify-end w-full p-2">
          {/* <button
            onClick={() => setIsOpen(false)}
            disabled={loading}
            aria-label="Close"
          >
            <HiOutlineXMark size={23} />
          </button> */}
        </div>

        <div className="flex items-center px-5 flex-col gap-2 mb-4">
          <div className="w-full flex justify-center">
            <img src={logout} className="w-12" />
          </div>
          <h2 className="text-[#181818] font-bold text-[20px]">Log out</h2>
          <p className="text-[#565656] text-[16px]">
            Are you sure you want to log out?
          </p>

          <div className="flex gap-3 items-center mt-3">
            <button
              className="bg-[#21293514] text-[#212935] rounded-[8px] px-10 p-2"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              No
            </button>

            <button
              className="bg-[#EE3131] text-white rounded-[8px] px-10 p-2 disabled:opacity-60"
              onClick={() => onConfirm && onConfirm()}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogOutModal;
