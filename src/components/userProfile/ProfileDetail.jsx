import { HiOutlinePencilSquare } from "react-icons/hi2";
import { userImage } from "../../assets/export";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import AuthSuccessModal from "../auth/AuthSuccessModal";

const ProfileDetail = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

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
