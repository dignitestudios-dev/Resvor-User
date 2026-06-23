import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import ConfirmationModal from "../global/ConfirmationModal";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import {
  useBookingDetails,
  useCancelBooking,
} from "../../hooks/queries/useQueries";

// ── helpers ───────────────────────────────────────────────────────────────────

const formatLabel = (value) =>
  String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

// MM/DD/YYYY — Issue #2
const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Issue #12 — no currency suffix, just $symbol
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "-";
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
};

const isRenderableImage = (value) =>
  typeof value === "string" &&
  (value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("//") ||
    value.startsWith("data:") ||
    value.startsWith("/"));

const getStatusClasses = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "pending" || s === "awaiting_payment") return "bg-amber-100 text-amber-700";
  if (s === "approved" || s === "confirmed")       return "bg-emerald-100 text-emerald-700";
  if (s === "completed")                            return "bg-blue-100 text-blue-700";
  if (s === "cancelled" || s === "rejected")        return "bg-rose-100 text-rose-700";
  return "bg-gray-100 text-gray-700";
};

const formatTable = (table, index) => {
  if (!table) return `Table ${index + 1}`;
  if (typeof table === "string") return table;
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

// ── component ──────────────────────────────────────────────────────────────────

export default function BookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  // ── dates / times ──────────────────────────────────────────────────────────
  const bookingDate = formatDate(
    booking?.bookingDate || booking?.startDateTime || booking?.startTime
  );
  const startTime = formatTime(booking?.startTime || booking?.startDateTime);
  const endTime   = formatTime(booking?.endTime   || booking?.endDateTime);
  const timeRange =
    startTime !== "-" && endTime !== "-"
      ? `${startTime} – ${endTime}`
      : startTime !== "-"
      ? startTime
      : endTime;

  // ── seating ────────────────────────────────────────────────────────────────
  const tableIds = Array.isArray(booking?.tableIds) ? booking.tableIds : [];
  const seatingArea = tableIds.length > 0 ? tableIds.map(formatTable).join(", ") : "-";

  // ── Issue #13 — prefer booking-level contact fields over populated userId ──
  const contactName =
    booking?.contactName ||
    booking?.guestName ||
    (booking?.userId && typeof booking.userId === "object"
      ? [booking.userId.firstName || booking.userId.name, booking.userId.lastName]
          .filter(Boolean)
          .join(" ")
          .trim()
      : "") ||
    "-";

  const contactEmail =
    booking?.contactEmail ||
    booking?.email ||
    (booking?.userId && typeof booking.userId === "object"
      ? booking.userId.email
      : "") ||
    "-";

  const contactPhone =
    booking?.contactPhone ||
    booking?.phoneNumber ||
    booking?.phone ||
    (booking?.userId && typeof booking.userId === "object"
      ? booking.userId.phone ||
        booking.userId.phoneNumber ||
        booking.userId.mobile
      : "") ||
    "-";

  // ── Issue #4 — lounge cover image: widen lookup ───────────────────────────
  const lounge = booking?.loungeId;
  const displayedImage =booking?.loungeId?.logo?.location

  // ── Issue #5 — lounge location: widen lookup ──────────────────────────────
  const displayedAddress = (() => {
    const parts = [];
    const loc = lounge?.location;
    if (loc?.address) return loc.address;
    if (loc?.street)  parts.push(loc.street);
    if (loc?.city)    parts.push(loc.city);
    if (loc?.state)   parts.push(loc.state);
    if (parts.length) return parts.join(", ");
    return (
      lounge?.address ||
      lounge?.city ||
      booking?.location?.address ||
      "Location not available"
    );
  })();

  // ── Issue #14 — lounge tags / amenities ───────────────────────────────────
  const loungeTags = [
    ...(lounge?.tags      || []),
    ...(lounge?.amenities || []),
    ...(lounge?.features  || []),
  ].filter(Boolean);

  // ── Issue #10 — services & package ───────────────────────────────────────
  const bookingServices = Array.isArray(booking?.services)
    ? booking.services
    : Array.isArray(booking?.serviceIds)
    ? booking.serviceIds
    : [];
  const bookingPackage =
    booking?.package ||
    booking?.packageId ||
    null;

  // ── Issue #11 — payment amounts ──────────────────────────────────────────
  const isAwaitingPayment =
    normalizedStatus === "awaiting_payment" || normalizedStatus === "pending";
  const amountPaid  = Number(booking?.amountPaid  ?? 0);
  const totalPrice  = Number(booking?.totalPrice  ?? booking?.totalAmount ?? booking?.amount ?? 0);

  const statusLabel  = formatLabel(booking?.status);
  const paymentStatusLabel = formatLabel(booking?.paymentStatus);

  // ── actions ────────────────────────────────────────────────────────────────
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
          requestError?.response?.data?.message || "Failed to cancel this booking."
        );
      },
    });
  };

  // ── loading / error states ─────────────────────────────────────────────────
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

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Header banner */}
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
              {isCancelling ? "Cancelling…" : isCancelable ? "Cancel Booking" : statusLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="px-5 lg:px-40">
        <div
          className="mx-auto p-4 bg-white rounded-[16px] -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="p-4 bg-[#F5F5F5] rounded-xl space-y-4">

            {/* ── Section: Reservation Overview ─────────────────────────── */}
            <h2 className="text-[24px] font-semibold text-gray-800">
              Reservation Overview
            </h2>

            <div className="bg-white rounded-[24px] p-5 space-y-6">

              {/* Top: image + core info */}
              <div className="flex flex-col md:flex-row gap-8 pb-5 border-b border-[#0000001A]">
                {/* Issue #4 — dynamic cover image */}
                <img
                  src={displayedImage}
                  alt="Venue cover"
                  className="rounded-xl w-full md:w-[368px] h-[212px] object-cover flex-shrink-0"
                />

                <div className="flex-1 mt-[10px] md:mt-[38px]">
                  {/* Name + single status badge — Issue #7 */}
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[22px] font-semibold text-[#000000]">
                      {lounge?.name || "Venue not available"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${getStatusClasses(
                        booking?.status
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <p className="mt-2 text-[13px] text-[#505050] break-all">
                    Booking ID: {booking?._id || id}
                  </p>

                  {/* Issue #5 — address */}
                  <div className="flex items-start gap-1 mt-3">
                    <IoLocation className="text-xl text-[#010067] mt-0.5 flex-shrink-0" />
                    <p className="text-[#505050] text-[15px] font-[500]">
                      {displayedAddress}
                    </p>
                  </div>

                  {/* Issue #8 — date + time shown ONCE here only */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <p className="text-[#727272]">Booking Date</p>
                      <p className="font-semibold text-[#181818]">{bookingDate}</p>
                    </div>
                    <div>
                      <p className="text-[#727272]">Time Range</p>
                      <p className="font-semibold text-[#181818]">{timeRange}</p>
                    </div>
                  </div>

                  {/* Issue #14 — lounge tags */}
                  {loungeTags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {loungeTags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#E8E8FF] text-[#222246] text-[12px] font-medium"
                        >
                          {typeof tag === "object" ? tag.name || tag.label || JSON.stringify(tag) : tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Guest details row — Issue #6 children count, Issue #8 no dupe date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm pb-5 border-b border-[#0000001A]">
                <div className="space-y-1">
                  <p className="font-semibold text-[#000000] text-[15px]">Guests</p>
                  <p className="text-[#505050] text-[14px]">{booking?.guestCount ?? "-"}</p>
                </div>
                {/* Issue #6 — children count */}
                {(booking?.childrenCount ?? 0) > 0 && (
                  <div className="space-y-1">
                    <p className="font-semibold text-[#000000] text-[15px]">Children</p>
                    <p className="text-[#505050] text-[14px]">{booking.childrenCount}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="font-semibold text-[#000000] text-[15px]">Seating Area</p>
                  <p className="text-[#505050] text-[14px]">{seatingArea}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-[#000000] text-[15px]">Payment</p>
                  <p className="text-[#505050] text-[14px]">{paymentStatusLabel}</p>
                </div>
              </div>

              {/* Issue #9 — "Any Instructions" (renamed from "Special Request") */}
              {booking?.specialRequest && (
                <div className="space-y-1 pb-5 border-b border-[#0000001A]">
                  <p className="font-semibold text-[#000000] text-[15px]">Any Instructions</p>
                  <p className="text-[#505050] text-[14px]">{booking.specialRequest}</p>
                </div>
              )}

              {/* Issue #10 — Services */}
              {bookingServices.length > 0 && (
                <div className="space-y-2 pb-5 border-b border-[#0000001A]">
                  <p className="font-semibold text-[#000000] text-[15px]">Selected Services</p>
                  <div className="flex flex-wrap gap-2">
                    {bookingServices.map((svc, i) => {
                      const label =
                        typeof svc === "object"
                          ? svc.name || svc.title || svc.label || `Service ${i + 1}`
                          : String(svc);
                      const price =
                        typeof svc === "object" && (svc.price !== undefined)
                          ? ` — ${formatCurrency(svc.price)}`
                          : "";
                      return (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[12px] font-medium"
                        >
                          {label}{price}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Issue #10 — Package */}
              {bookingPackage && (
                <div className="space-y-1 pb-5 border-b border-[#0000001A]">
                  <p className="font-semibold text-[#000000] text-[15px]">Package</p>
                  <p className="text-[#505050] text-[14px]">
                    {typeof bookingPackage === "object"
                      ? bookingPackage.name || bookingPackage.title || JSON.stringify(bookingPackage)
                      : String(bookingPackage)}
                    {typeof bookingPackage === "object" && bookingPackage.price !== undefined
                      ? ` — ${formatCurrency(bookingPackage.price)}`
                      : ""}
                  </p>
                </div>
              )}

              {/* Issue #11 & #12 — financial summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {isAwaitingPayment ? (
                  // For pending/awaiting payment show Amount Due
                  <>
                    <div className="space-y-1">
                      <p className="font-semibold text-[#000000] text-[15px]">Amount Due</p>
                      <p className="text-amber-600 font-semibold text-[14px]">
                        {formatCurrency(totalPrice || amountPaid)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {amountPaid > 0 && (
                      <div className="space-y-1">
                        <p className="font-semibold text-[#000000] text-[15px]">Amount Paid</p>
                        <p className="text-emerald-600 font-semibold text-[14px]">
                          {formatCurrency(amountPaid)}
                        </p>
                      </div>
                    )}
                    {totalPrice > 0 && (
                      <div className="space-y-1">
                        <p className="font-semibold text-[#000000] text-[15px]">Total Price</p>
                        <p className="text-[#505050] text-[14px]">{formatCurrency(totalPrice)}</p>
                      </div>
                    )}
                  </>
                )}
                <div className="space-y-1">
                  <p className="font-semibold text-[#000000] text-[15px]">Booked On</p>
                  <p className="text-[#505050] text-[14px]">{formatDate(booking?.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* ── Section: User Information — Issue #13 ─────────────────── */}
            <div className="mt-4">
              <h2 className="text-[24px] font-semibold text-[#252525] mb-3">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-white rounded-[16px] px-6 pt-6 pb-4">
                <div className="space-y-1">
                  <p className="font-semibold text-[#000000] text-[16px]">Name</p>
                  <p className="text-[#505050] text-[15px]">{contactName}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-[#000000] text-[16px]">Email Address</p>
                  <p className="text-[#505050] text-[15px] break-all">{contactEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-[#000000] text-[16px]">Phone Number</p>
                  <p className="text-[#505050] text-[15px]">{contactPhone}</p>
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
