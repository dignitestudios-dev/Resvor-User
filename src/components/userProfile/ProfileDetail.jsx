import { HiOutlinePencilSquare } from "react-icons/hi2";
import { qrSnap, userImage } from "../../assets/export";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import AuthSuccessModal from "../auth/AuthSuccessModal";
import { FaQrcode } from "react-icons/fa6";

const ProfileDetail = ({ user, loading }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isQrCode, setIsQrCode] = useState(false);

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = qrSnap;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(qrSnap, "_blank");
    }
  };


  const formattedBirthday = user?.specialDates?.find(
    (item) => item.occasion === "DOB"
  );

  const birthday = formattedBirthday
    ? new Date(formattedBirthday.date).toLocaleDateString()
    : "N/A";


  if (loading) {
    return (
      <div className="bg-[#F5F5F5] rounded-[16px] p-6 space-y-4 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-1/2" />
        <div className="h-16 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    );
  }


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
          <HiOutlinePencilSquare className="text-[#292D32] text-[18px]" />
        </div>
      </div>


      <div className="flex items-center gap-3">
        <img
  src={user?.profilePicture?.location || userImage}
          className="w-10 h-10 rounded-full object-cover"
          alt="profile"
        />

        <p className="text-[20px] text-[#252525] font-[600]">
          {user?.firstName} {user?.lastName}
        </p>
      </div>


      <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-2">

        <div className="bg-white rounded-[12px] p-4">
          <p className="text-[14px] font-[500] text-[#9E9E9E]">
            Email Address
          </p>

          <p className="text-[16px] text-[#252525]">
            {user?.email || "N/A"}
          </p>
        </div>


        <div className="bg-white rounded-[12px] p-4">
          <p className="text-[14px] font-[500] text-[#9E9E9E]">
            Phone Number
          </p>

          <p className="text-[16px] text-[#252525]">
            {user?.phoneNumber || "N/A"}
          </p>
        </div>

      </div>


      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[14px] font-[500] text-[#9E9E9E]">
          Location
        </p>

        <p className="text-[16px] text-[#252525]">
          N/A
        </p>
      </div>


      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[14px] font-[500] text-[#9E9E9E]">
          Birthday and Special Dates
        </p>

        <p className="text-[16px] text-[#252525]">
          {birthday}
        </p>
      </div>


      <div
        onClick={() => setIsQrCode(true)}
        className="underline w-[180px] p-1 rounded-md cursor-pointer flex items-center gap-1"
      >
        View QR code
        <FaQrcode className="text-[#292D32] text-[18px]" />
      </div>



      {isQrCode && (
        <div className="fixed -inset-6 bg-[#0A150F80] z-50 flex items-center justify-center">

          <div className="relative bg-white rounded-[12px] w-[440px] h-[300px] flex flex-col items-center justify-center gap-4 p-4">

            <button
              className="absolute top-3 right-6 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setIsQrCode(false)}
            >
              X
            </button>


            <img
              src={qrSnap}
              alt="QR Code"
              className="max-w-full max-h-full object-contain"
            />


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
  initialData={user}
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