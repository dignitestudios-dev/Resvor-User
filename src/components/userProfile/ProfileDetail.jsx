import { HiOutlinePencilSquare } from "react-icons/hi2";
import { userImage } from "../../assets/export";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import AuthSuccessModal from "../auth/AuthSuccessModal";
import { FaQrcode } from "react-icons/fa6";
import QRCode from "react-qr-code";
import axios from "../../axios";

const ProfileDetail = ({ user, loading }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isQrCode, setIsQrCode] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");

  const handleOpenQrModal = async () => {
    setIsQrCode(true);
    setQrLoading(true);
    setQrError("");
    try {
      const res = await axios.get("/vip-pass/my");
      const url = res?.data?.data?.qrUrl || res?.data?.qrUrl;
      if (url) {
        setQrUrl(url);
      } else {
        setQrError("QR Code URL not found.");
      }
    } catch (err) {
      console.error("Error fetching VIP pass:", err);
      setQrError(err?.response?.data?.message || "Failed to retrieve VIP pass");
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownload = () => {
    try {
      const svg = document.getElementById("vip-qr-code");
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        canvas.width = img.width || 200;
        canvas.height = img.height || 200;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "vip-pass-qr.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = url;
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  const formattedBirthday = user?.specialDates?.find(
    (item) => item.occasion === "DOB",
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
          <p className="text-[14px] font-[500] text-[#9E9E9E]">Email Address</p>

          <p className="text-[16px] text-[#252525]">{user?.email || "N/A"}</p>
        </div>

        <div className="bg-white rounded-[12px] p-4">
          <p className="text-[14px] font-[500] text-[#9E9E9E]">Phone Number</p>

          <p className="text-[16px] text-[#252525]">
            {user?.phoneNumber || "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[14px] font-[500] text-[#9E9E9E]">Location</p>

        <p className="text-[16px] text-[#252525]">N/A</p>
      </div>

      <div className="bg-white rounded-[12px] p-4">
        <p className="text-[14px] font-[500] text-[#9E9E9E]">
          Birthday and Special Dates
        </p>

        <p className="text-[16px] text-[#252525]">{birthday}</p>
      </div>

      <div
        onClick={handleOpenQrModal}
        className="underline w-[180px] p-1 rounded-md cursor-pointer flex items-center gap-1"
      >
        View QR code
        <FaQrcode className="text-[#292D32] text-[18px]" />
      </div>

      {isQrCode && (
        <div className="fixed -inset-6 bg-[#0A150F80] z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-[12px] w-[440px] min-h-[320px] flex flex-col items-center justify-center gap-4 p-6">
            <button
              className="absolute top-3 right-6 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setIsQrCode(false)}
            >
              ✕
            </button>

            {qrLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-[#252525] rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-[500]">Loading VIP Pass...</p>
              </div>
            ) : qrError ? (
              <div className="text-center space-y-3">
                <p className="text-red-500 text-sm font-[500]">{qrError}</p>
                <button
                  onClick={handleOpenQrModal}
                  className="bg-[#252525] text-white px-4 py-2 rounded-md text-sm font-[500]"
                >
                  Retry
                </button>
              </div>
            ) : qrUrl ? (
              <>
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <QRCode id="vip-qr-code" value={qrUrl} size={180} />
                </div>

                <button
                  onClick={handleDownload}
                  className="bg-[#252525] text-white px-4 py-2 rounded-md text-sm font-[500]"
                >
                  Download
                </button>
              </>
            ) : null}
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
