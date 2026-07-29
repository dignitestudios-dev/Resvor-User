import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import ConfirmationModal from "../global/ConfirmationModal";
import DisputeModal from "./DisputeModal";
import ViewDisputeModal from "./ViewDisputeModal";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import {
  useBookingDetails,
  useCancelBooking,
  useCreateDispute,
} from "../../hooks/queries/useQueries";

// ── dispute eligibility helper ────────────────────────────────────────────────
const checkDisputeEligibility = (booking) => {
  if (!booking) return { eligible: false, message: "No booking data" };

  if (booking?.isDisputed || booking?.disputeStatus || booking?.dispute) {
    return { eligible: false, message: "Dispute already filed", isDisputed: true };
  }

  const rawEndTime = booking?.endTime || booking?.endDateTime;
  const dateStr = booking?.bookingDate || booking?.startDateTime || booking?.date;

  let endDateTime = null;

  if (rawEndTime) {
    if (typeof rawEndTime === "string" && (rawEndTime.includes("T") || rawEndTime.includes("Z"))) {
      const parsed = new Date(rawEndTime);
      if (!isNaN(parsed.getTime())) {
        endDateTime = parsed;
      }
    } else if (rawEndTime instanceof Date) {
      if (!isNaN(rawEndTime.getTime())) {
        endDateTime = rawEndTime;
      }
    }
  }

  if (!endDateTime && rawEndTime && dateStr) {
    let year, month, day;
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        year = d.getUTCFullYear();
        month = d.getUTCMonth();
        day = d.getUTCDate();
      }
    } else if (typeof dateStr === "string" && dateStr.includes("-")) {
      const parts = dateStr.split("T")[0].split("-").map(Number);
      if (parts.length >= 3) {
        year = parts[0];
        month = parts[1] - 1;
        day = parts[2];
      }
    } else if (dateStr instanceof Date) {
      year = dateStr.getUTCFullYear();
      month = dateStr.getUTCMonth();
      day = dateStr.getUTCDate();
    }

    let hours = 0, minutes = 0;
    if (typeof rawEndTime === "string") {
      const timeParts = String(rawEndTime).match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)?/i);
      if (timeParts) {
        let h = parseInt(timeParts[1], 10);
        const min = parseInt(timeParts[2], 10);
        const ampm = timeParts[4];
        if (ampm) {
          if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
          if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
        }
        hours = h;
        minutes = min;
      }
    }

    if (year !== undefined && month !== undefined && day !== undefined) {
      endDateTime = new Date(Date.UTC(year, month, day, hours, minutes, 0, 0));
    }
  }

  if (!endDateTime && dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      endDateTime = d;
    }
  }

  if (!endDateTime) {
    return { eligible: true, message: "" };
  }

  const now = new Date();
  const diffInMs = now.getTime() - endDateTime.getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  // 1. Before booking end time: Not allowed to file dispute yet
  if (diffInMs < 0) {
    return {
      eligible: false,
      message: "Dispute can only be filed after the booking end time",
      notStarted: true,
    };
  }

  // 2. After 24 hours after booking end time: Dispute window expired
  if (diffInMs > twentyFourHoursInMs) {
    return {
      eligible: false,
      message: "Dispute window expired (24 hours passed after booking end time)",
      expired: true,
    };
  }

  // 3. Within 24-hour window after booking end time: Allowed
  return { eligible: true, message: "" };
};

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

  if (typeof value === "string" && (value.includes("T") || value.includes("Z"))) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  if (typeof value === "string" && value.includes(":")) {
    const [hoursStr, minutesStr] = value.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Issue #12 — no currency suffix, just $symbol, always 2 decimal places
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === "") return "-";
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
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
  const s = String(status || "").toLowerCase().replace(/_/g, " ");
  if (s === "confirmed" || s === "approved" || s === "upcoming") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (s === "pending" || s === "approval") {
    return "bg-amber-100 text-amber-700";
  }
  if (s === "awaiting payment" || s === "awaiting_payment") {
    return "bg-purple-100 text-purple-700";
  }
  if (s === "completed") {
    return "bg-blue-100 text-blue-700";
  }
  if (s === "rejected" || s === "cancelled") {
    return "bg-rose-100 text-rose-700";
  }
  if (s === "expired") {
    return "bg-orange-100 text-orange-700";
  }
  if (s === "refunded") {
    return "bg-teal-100 text-teal-700";
  }
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
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showViewDisputeModal, setShowViewDisputeModal] = useState(false);

  const {
    data: bookingResponse,
    isLoading,
    isError,
    error,
  } = useBookingDetails(id);
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { mutate: createDispute, isPending: isFilingDispute } = useCreateDispute();

  const booking = bookingResponse?.data ?? bookingResponse;
  console.log("🚀 ~ BookingDetails ~ booking:", booking);

  const disputeId =
    (typeof booking?.disputeId === "object" ? booking?.disputeId?._id : booking?.disputeId) ||
    (typeof booking?.dispute === "object" ? booking?.dispute?._id : booking?.dispute) ||
    null;

  const disputeEligibility = checkDisputeEligibility(booking);
  const normalizedStatus = String(booking?.status || "").toLowerCase();
  const isCancelable =
    booking && !["cancelled", "completed", "rejected"].includes(normalizedStatus);

  // ── dates / times ──────────────────────────────────────────────────────────
  const bookingDate = formatDate(
    booking?.bookingDate || booking?.startDateTime || booking?.startTime
  );
  const startTime = formatTime(booking?.startTime || booking?.startDateTime);
  const endTime = formatTime(booking?.endTime || booking?.endDateTime);
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
    booking?.guestEmail ||
    booking?.email ||
    (booking?.userId && typeof booking.userId === "object"
      ? booking.userId.email
      : "") ||
    "-";

  const contactPhone =
    booking?.contactPhone ||
    booking?.guestPhone ||
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
  const displayedImage = booking?.loungeId?.logo?.location

  // ── Issue #5 — lounge location: widen lookup ──────────────────────────────
  const displayedAddress = (() => {
    const parts = [];
    const loc = lounge?.location;
    if (loc?.address) return loc.address;
    if (loc?.street) parts.push(loc.street);
    if (loc?.city) parts.push(loc.city);
    if (loc?.state) parts.push(loc.state);
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
    ...(lounge?.tags || []),
    ...(lounge?.amenities || []),
    ...(lounge?.features || []),
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

  const servicePackages = Array.isArray(booking?.servicePackageIds)
    ? booking.servicePackageIds
    : [];

  // ── Issue #11 — payment amounts (in cents, converted to USD) ────────────
  const isAwaitingPayment =
    normalizedStatus === "awaiting_payment" || normalizedStatus === "pending";
  const amountPaid = Number(booking?.amountPaid ?? 0) / 100;
  const rawTotalPrice = Number(booking?.totalPrice ?? booking?.totalAmount ?? booking?.amount ?? 0);
  const totalPrice = rawTotalPrice > 0 ? (rawTotalPrice > 1000 ? rawTotalPrice / 100 : rawTotalPrice) : 0;

  const statusLabel = formatLabel(booking?.status);
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

  const handleCreateDispute = ({ reason }) => {
    const sourceId = booking?._id || booking?.id || id;
    const isEventBooking = Boolean(booking?.isEvent || booking?.eventType || booking?.sourceModel === "Event");
    const sourceModel = booking?.sourceModel || (isEventBooking ? "Event" : "Booking");

    createDispute(
      {
        sourceId,
        sourceModel,
        reason,
      },
      {
        onSuccess: (response) => {
          setShowDisputeModal(false);
          SuccessToast(response?.message || "Dispute submitted successfully.");
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          queryClient.invalidateQueries({ queryKey: ["booking-details", id] });
        },
        onError: (requestError) => {
          ErrorToast(
            requestError?.response?.data?.message ||
            "Failed to submit dispute. Please try again."
          );
        },
      }
    );
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

            <div className="flex items-center gap-3">
              {disputeId ? (
                <button
                  type="button"
                  onClick={() => setShowViewDisputeModal(true)}
                  className="px-5 py-2 rounded-[12px] text-[12px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                >
                  View Dispute
                </button>
              ) : disputeEligibility.isDisputed ? (
                <button
                  type="button"
                  onClick={() => setShowViewDisputeModal(true)}
                  className="px-5 py-2 rounded-[12px] text-[12px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                >
                  View Dispute
                </button>
              ) : disputeEligibility.eligible ? (
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(true)}
                  className="px-5 py-2 rounded-[12px] text-[12px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                >
                  File Dispute
                </button>
              ) : disputeEligibility.notStarted ? (
                <button
                  type="button"
                  disabled
                  title="Dispute can only be filed after the booking end time"
                  className="px-5 py-2 rounded-[12px] text-[12px] font-semibold border border-gray-200 bg-white/20 text-gray-300 cursor-not-allowed"
                >
                  Dispute Available After Event Ends
                </button>
              ) : disputeEligibility.expired ? (
                // <button
                //   type="button"
                //   disabled
                //   title="Dispute window expired (24 hours passed after booking end time)"
                //   className="px-5 py-2 rounded-[12px] text-[12px] font-semibold border border-gray-200 bg-white/20 text-gray-300 cursor-not-allowed"
                // >
                //   Dispute Expired
                // </button>
                null
              ) : null}

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={!isCancelable || isCancelling}
                className={`px-6 py-2 rounded-[12px] text-[12px] font-semibold border transition ${isCancelable && !isCancelling
                  ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                  : "border-gray-200 bg-white text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isCancelling ? "Cancelling…" : isCancelable ? "Cancel Booking" : statusLabel}
              </button>
            </div>
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
                  {/* <p className="mt-2 text-[13px] text-[#505050] break-all">
                    Booking ID: {booking?._id || id}
                  </p> */}

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


                </div>
              </div>

              {/* Guest details row — Issue #6 children count, Issue #8 no dupe date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 text-sm pb-5 border-b border-[#0000001A]">
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-[#000000] text-[15px]">Guests</p>
                  <p className="text-[#505050] text-[14px]">{booking?.guestCount ?? "-"}</p>
                </div>
                {/* Issue #6 — children count */}
                {(booking?.childrenCount ?? 0) > 0 && (
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-[#000000] text-[15px]">Children</p>
                    <p className="text-[#505050] text-[14px]">{booking.childrenCount}</p>
                  </div>
                )}
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-[#000000] text-[15px]">Seating Area</p>
                  <p className="text-[#505050] text-[14px] break-words">{seatingArea}</p>
                </div>
                {/* <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-[#000000] text-[15px]">Payment</p>
                  <p className="text-[#505050] text-[14px] break-words">{paymentStatusLabel}</p>
                </div> */}
              </div>
              {/* Issue #11 & #12 — financial summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pb-5 border-b border-[#0000001A]">
                {isAwaitingPayment ? (
                  // For pending/awaiting payment show Amount Due
                  <>
                    <div className="space-y-1 min-w-0">
                      <p className="font-semibold text-[#000000] text-[15px]">Amount Due</p>
                      <p className="text-amber-600 font-semibold text-[14px] break-words">
                        {formatCurrency(totalPrice || amountPaid)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {amountPaid > 0 && (
                      <div className="space-y-1 min-w-0">
                        <p className="font-semibold text-[#000000] text-[15px]">Amount Paid</p>
                        <p className="text-emerald-600 font-semibold text-[14px] break-words">
                          {formatCurrency(amountPaid)}
                        </p>
                      </div>
                    )}
                    {totalPrice > 0 && (
                      <div className="space-y-1 min-w-0">
                        <p className="font-semibold text-[#000000] text-[15px]">Total Price</p>
                        <p className="text-[#505050] text-[14px] break-words">{formatCurrency(totalPrice)}</p>
                      </div>
                    )}
                  </>
                )}
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-[#000000] text-[15px]">Booked On</p>
                  <p className="text-[#505050] text-[14px] break-words">{formatDate(booking?.createdAt)}</p>
                </div>
              </div>

              {/* Issue #9 — "Any Instructions" (renamed from "Special Request") */}
              {booking?.specialRequest && (
                <div className="space-y-1 pb-5 border-b border-[#0000001A]">
                  <p className="font-semibold text-[#000000] text-[15px]">Any Instructions</p>
                  <p className="text-[#505050] text-[14px] break-words whitespace-pre-wrap">{booking.specialRequest}</p>
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
                          ? ` — ${formatCurrency(Number(svc?.price ?? 0) / 100)}`
                          : "";
                      return (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[12px] font-medium break-words"
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
                  <p className="text-[#505050] text-[14px] break-words whitespace-pre-wrap">
                    {typeof bookingPackage === "object"
                      ? bookingPackage.name || bookingPackage.title || JSON.stringify(bookingPackage)
                      : String(bookingPackage)}
                    {typeof bookingPackage === "object" && bookingPackage.price !== undefined
                      ? ` — ${formatCurrency(bookingPackage.price)}`
                      : ""}
                  </p>
                </div>
              )}

              {servicePackages.length > 0 && (
                <div className="space-y-3 pb-5 border-b border-[#0000001A]">
                  <p className="font-semibold text-[#000000] text-[15px]">
                    Service Packages
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {servicePackages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="flex-1 min-w-[260px] max-w-[340px] rounded-lg bg-gray-50 border border-gray-100 p-3.5"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-[#181818] text-[15px] break-words">
                            {pkg.name}
                          </h4>

                          <span className="text-[#010067] font-semibold text-[14px]">
                            ({formatCurrency(Number(pkg?.price ?? 0) / 100)})
                          </span>
                        </div>

                        {pkg.description && (
                          <p className="mt-1 text-[13px] leading-5 text-[#505050] break-words whitespace-pre-wrap">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ── Section: User Information — Issue #13 ─────────────────── */}
            <div className="mt-4">
              <h2 className="text-[24px] font-semibold text-[#252525] mb-3">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-white rounded-[16px] px-6 pt-6 pb-4">
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-[#000000] text-[16px]">Name</p>
                  <p className="text-[#505050] text-[15px] break-words">{contactName}</p>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-[#000000] text-[16px]">Email Address</p>
                  <p className="text-[#505050] text-[15px] break-all">{contactEmail}</p>
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-[#000000] text-[16px]">Phone Number</p>
                  <p className="text-[#505050] text-[15px] break-words">{contactPhone}</p>
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

      <DisputeModal
        isOpen={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        onSubmit={handleCreateDispute}
        loading={isFilingDispute}
      />

      <ViewDisputeModal
        isOpen={showViewDisputeModal}
        onClose={() => setShowViewDisputeModal(false)}
        disputeId={disputeId}
      />
    </>
  );
}
