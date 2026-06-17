import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import ConfirmationModal from "../global/ConfirmationModal";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import {
  useAuthMe,
  useBookingDetails,
  useCancelBooking,
} from "../../hooks/queries/useQueries";

const formatLabel = (value) =>
  String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
  if (!value) return "-";

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return String(value);
  }

  return dateValue.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatTime = (value) => {
  if (!value) return "-";

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return String(value);
  }

  return dateValue.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatCurrency = (amount, currency = "usd") => {
  if (amount === undefined || amount === null || amount === "") return "-";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "USD").toUpperCase(),
    }).format(Number(amount));
  } catch {
    return `${amount}`;
  }
};

const isRenderableImage = (value) =>
  typeof value === "string" &&
  (value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("//") ||
    value.startsWith("data:") ||
    value.startsWith("/"));

const getStatusClasses = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "pending" || normalized === "awaiting_payment") {
    return "bg-amber-100 text-amber-700";
  }

  if (normalized === "approved" || normalized === "confirmed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized === "completed") {
    return "bg-blue-100 text-blue-700";
  }

  if (normalized === "cancelled" || normalized === "rejected") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-gray-100 text-gray-700";
};

const formatTable = (table, index) => {
  if (!table) return `Table ${index + 1}`;

  if (typeof table === "string") {
    return table;
  }

  const typeLabel = table.type
    ? `${String(table.type).charAt(0).toUpperCase()}${String(table.type).slice(1)} `
    : "";
  const identifier =
    table.code ||
    (table.tableNumber !== undefined && table.tableNumber !== null
      ? `T${table.tableNumber}`
      : "") ||
    table.name ||
    "";

  return `${typeLabel}${identifier}`.trim() || `Table ${index + 1}`;
};

export default function BookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: authData } = useAuthMe();
  const {
    data: bookingResponse,
    isLoading,
    isError,
    error,
  } = useBookingDetails(id);
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const booking = bookingResponse?.data ?? bookingResponse;
  const normalizedStatus = String(booking?.status || "").toLowerCase();
  const isCancelable =
    booking && !["cancelled", "completed", "rejected"].includes(normalizedStatus);

  const bookingDate = formatDate(
    booking?.bookingDate || booking?.startDateTime || booking?.startTime
  );
  const startTime = formatTime(booking?.startTime || booking?.startDateTime);
  const endTime = formatTime(booking?.endTime || booking?.endDateTime);
  const timeRange =
    startTime !== "-" && endTime !== "-"
      ? `${startTime} - ${endTime}`
      : startTime !== "-"
      ? startTime
      : endTime;

  const tableIds = Array.isArray(booking?.tableIds) ? booking.tableIds : [];
  const seatingArea = tableIds.length > 0 ? tableIds.map(formatTable).join(", ") : "-";

  const bookingUser =
    booking?.userId && typeof booking.userId === "object"
      ? booking.userId
      : authData?.data || {};

  const userName = [
    bookingUser?.firstName || bookingUser?.name,
    bookingUser?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "-";

  const userEmail = bookingUser?.email || "-";
  const userPhone =
    bookingUser?.phone || bookingUser?.phoneNumber || bookingUser?.mobile || "-";

  const displayedLoungeName = booking?.loungeId?.name || "Venue not available";
  const displayedAddress =
    booking?.loungeId?.location?.address ||
    booking?.loungeId?.address ||
    booking?.loungeId?.city ||
    booking?.location?.address ||
    "Location not available";
  const displayedImage =
    [booking?.loungeId?.images?.[0]?.location, booking?.loungeId?.image]
      .find(isRenderableImage) ||
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60";
  const statusLabel = formatLabel(booking?.status);
  const paymentStatus = formatLabel(booking?.paymentStatus);

  const handleCancelBooking = () => {
    if (!isCancelable || isCancelling) return;
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    cancelBooking(id, {
      onSuccess: (response) => {
        setShowCancelModal(false);
        SuccessToast(response?.message || "Booking cancelled successfully.");
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking-details", id] });
      },
      onError: (requestError) => {
        ErrorToast(
          requestError?.response?.data?.message ||
            "Failed to cancel this booking."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5]">
        <p className="text-gray-500 font-semibold text-lg">
          Loading booking details...
        </p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5] px-4">
        <div className="max-w-md w-full rounded-[16px] bg-white p-6 shadow-sm text-center">
          <p className="text-[20px] font-semibold text-[#181818]">
            {error?.response?.data?.message || "Booking details not found."}
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 w-full rounded-[12px] bg-[#212935] px-4 py-2 text-white text-[14px] font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-start w-full px-5 lg:px-40 gap-3">
          <div className="flex justify-between items-center w-full gap-4">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => navigate(-1)}>
                <FaArrowLeftLong color="white" size={20} />
              </button>
              <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
                Booking Details
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCancelBooking}
              disabled={!isCancelable || isCancelling}
              className={`px-6 py-2 rounded-[12px] text-[12px] font-semibold border transition ${
                isCancelable && !isCancelling
                  ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                  : "border-gray-200 bg-white text-gray-400 cursor-not-allowed"
              }`}
            >
              {isCancelling
                ? "Cancelling..."
                : isCancelable
                ? "Cancel Booking"
                : statusLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-40">
        <div
          className="mx-auto p-4 bg-white rounded-[16px] -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="p-4 bg-[#F5F5F5] rounded-xl">
            <h2 className="text-[24px] font-semibold text-gray-800 mb-4">
              Reservation Overview
            </h2>

            <div className="bg-[#FFFFFF] rounded-[24px] p-5 space-y-6">
              <div className="flex flex-col md:flex-row gap-8 pb-5 border-b border-[#0000001A]">
                <img
                  src={displayedImage}
                  alt="Venue"
                  className="rounded-xl w-[368px] h-[212px] object-cover"
                />

                <div className="flex-1 mt-[10px] md:mt-[38px]">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[24px] font-semibold text-[#000000]">
                      {displayedLoungeName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${getStatusClasses(
                        booking?.status
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <p className="mt-2 text-[14px] text-[#505050] break-all">
                    Booking ID: {booking?._id || id}
                  </p>

                  <div className="flex items-center gap-1 mt-4">
                    <IoLocation className="text-xl text-[#010067]" />
                    <p className="text-[#505050] text-[16px] font-[500]">
                      {displayedAddress}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <p className="text-[#727272]">Booking Date</p>
                      <p className="font-semibold text-[#181818]">
                        {bookingDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#727272]">Time Range</p>
                      <p className="font-semibold text-[#181818]">{timeRange}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Booking Date
                  </p>
                  <p className="text-[#000000] text-[15px]">{bookingDate}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Start Time
                  </p>
                  <p className="text-[#000000] text-[15px]">{startTime}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    End Time
                  </p>
                  <p className="text-[#000000] text-[15px]">{endTime}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Guest Count
                  </p>
                  <p className="text-[#000000] text-[15px]">
                    {booking?.guestCount ?? "-"}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Seating Area
                  </p>
                  <p className="text-[#000000] text-[15px]">{seatingArea}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Status
                  </p>
                  <p className="text-[#000000] text-[15px]">{statusLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#0000001A] text-sm">
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Special Request
                  </p>
                  <p className="text-[#000000] text-[15px]">
                    {formatLabel(booking?.specialRequest)}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Payment Status
                  </p>
                  <p className="text-[#000000] text-[15px]">
                    {paymentStatus}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#0000001A] text-sm">
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Amount Paid
                  </p>
                  <p className="text-[#000000] text-[15px]">
                    {formatCurrency(booking?.amountPaid, booking?.currency)}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Currency
                  </p>
                  <p className="text-[#000000] text-[15px] uppercase">
                    {booking?.currency || "-"}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Created At
                  </p>
                  <p className="text-[#000000] text-[15px]">
                    {formatDate(booking?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-[24px] font-semibold text-[#252525] mb-4">
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm bg-[#FFFFFF] rounded-[16px] px-6 pt-6 pb-4">
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Name
                  </p>
                  <p className="text-[#000000] text-[16px]">{userName}</p>
                </div>
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Email Address
                  </p>
                  <p className="text-[#000000] text-[16px] break-all">
                    {userEmail}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Phone Number
                  </p>
                  <p className="text-[#000000] text-[16px]">{userPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showCancelModal}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking?"
        confirmText="Yes"
        cancelText="No"
        loading={isCancelling}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={confirmCancelBooking}
      />
    </>
  );
}
