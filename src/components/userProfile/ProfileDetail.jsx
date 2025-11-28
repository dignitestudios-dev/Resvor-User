import { HiOutlinePencilSquare } from "react-icons/hi2";
import { qrSnap, userImage } from "../../assets/export";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import AuthSuccessModal from "../auth/AuthSuccessModal";
import { FaQrcode } from "react-icons/fa6";

const ProfileDetail = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isQrCode, setIsQrCode] = useState(false);
  const handleDownload = () => {
    // qrSnap is an imported image path (URL). Create an anchor and click it to download.
    try {
      const link = document.createElement("a");
      link.href = qrSnap;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // fallback: open the image in a new tab
      window.open(qrSnap, "_blank");
    }
  };

  return (
    <div className="bg-[#F5F5F5] rounded-[16px] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-[24px] text-[#252525] font-[600]">
          Personal Details
        </p>
        <div
          onClick={() => setIsEditOpen(true)}
          className="bg-white p-1 rounded-md cursor-pointer"
        >
          <HiOutlinePencilSquare className=" text-[#292D32] text-[18px]" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img src={userImage} className="w-18 h-18 rounded-full" />
        <p className="text-[20px] text-[#252525] font-[600]">Mike Smith</p>
      </div>
      <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-2">
        <div className="bg-white rounded-[12px] p-4">
          <p className="text-[14px] font-[500] text-[#9E9E9E]">Email Address</p>
          <p className="text-[16px] text-[#252525]">abc123@gmail.com</p>
        </div>
        <div className="bg-white rounded-[12px] p-4">
          <p className="text-[14px] font-[500] text-[#9E9E9E]">Phone Number</p>
          <p className="text-[16px] text-[#252525]">+123456789</p>
        </div>
      </div>
      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[14px] font-[500] text-[#9E9E9E]">Location</p>
        <p className="text-[16px] text-[#252525]">+123456789, abc123 , xyz</p>
      </div>
      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[14px] font-[500] text-[#9E9E9E]">
          Birthday and Special Dates
        </p>
        <p className="text-[16px] text-[#252525]">+123456789, abc123 , xyz</p>
      </div>
      <div
        onClick={() => setIsQrCode(true)}
        className="underline w-[180px] p-1 rounded-md cursor-pointer flex items-center gap-1"
      >
        View QR code
        <FaQrcode className=" text-[#292D32] text-[18px]" />
      </div>

      {isQrCode && (
        <div className="fixed -inset-6 bg-[#0A150F80] z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-[12px] w-[440px] h-[300px] flex flex-col items-center justify-center gap-4 p-4">
            {/* Close Button */}
            <button
              className="absolute top-3 right-6 text-gray-500 hover:text-gray-700 text-xl "
              onClick={() => setIsQrCode(false)} // <-- pass a handler to close modal
            >
              X
            </button>

            {/* Image */}
            <img
              src={qrSnap}
              alt="success"
              className="max-w-full max-h-full object-contain"
            />

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-[#252525] text-white px-4 py-2 rounded-md text-sm"
            >
              Download
            </button>
          </div>
        </div>
      )}

      {isEditOpen && (
        <EditProfileModal
          onClick={() => {
            setIsEditOpen(false);
            setIsUpdated(true);
          }}
          onClose={() => setIsEditOpen(false)}
        />
      )}
      {isUpdated && (
        <AuthSuccessModal
          isOpen={isUpdated}
          onClick={() => {
            setIsUpdated(false);
          }}
          title="Profile Updated"
          description="Your profile has been updated successfully."
        />
      )}
    </div>
  );
};

export default ProfileDetail;
