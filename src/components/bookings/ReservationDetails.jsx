import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import ConfirmationModal from "../global/ConfirmationModal";
import SendInvitationModal from "../flayer/SendInvitationModal";
import FlayerFeeModal from "../flayer/FlayerFeeModal";
import AuthSuccessModal from "../auth/AuthSuccessModal";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import DisputeModal from "./DisputeModal";
import ViewDisputeModal from "./ViewDisputeModal";
import RejectedModal from "./RejectedModal";
import { useCancelEvent, useCreateDispute, useEventDetails, useCreateCampaign } from "../../hooks/queries/useQueries";

// ── dispute eligibility helper ────────────────────────────────────────────────
const checkDisputeEligibility = (event) => {
  if (!event) return { eligible: false, message: "No event data" };

  if (event?.isDisputed || event?.disputeStatus || event?.dispute) {
    return { eligible: false, message: "Dispute already filed", isDisputed: true };
  }

  if (["rejected", "cancelled"].includes(event.status)) {
    return { eligible: false, message: "Dispute can't be filed for this event" };
  }

  const rawEndTime = event?.endDateTime || event?.endTime;
  const dateStr = event?.startDateTime || event?.bookingDate || event?.date;

  let endDateTime = null;

  if (rawEndTime) {
    let year, month, day, hours = 0, minutes = 0;

    if (dateStr) {
      const dObj = new Date(dateStr);
      if (!isNaN(dObj.getTime())) {
        if (typeof dateStr === "string" && dateStr.includes("T")) {
          const datePart = dateStr.split("T")[0];
          const [y, m, d] = datePart.split("-").map(Number);
          year = y;
          month = m - 1;
          day = d;
        } else {
          year = dObj.getFullYear();
          month = dObj.getMonth();
          day = dObj.getDate();
        }
      }
    }

    if (typeof rawEndTime === "string" && rawEndTime.includes("T")) {
      const directDate = new Date(rawEndTime);
      if (!isNaN(directDate.getTime())) {
        const datePart = rawEndTime.split("T")[0];
        const timePart = rawEndTime.split("T")[1];
        if (datePart && timePart) {
          const [y, m, d] = datePart.split("-").map(Number);
          const [h, min] = timePart.split(":").map(Number);
          year = y;
          month = m - 1;
          day = d;
          hours = h;
          minutes = min;
        } else {
          hours = directDate.getUTCHours();
          minutes = directDate.getUTCMinutes();
        }
      }
    } else if (typeof rawEndTime === "string") {
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
      endDateTime = new Date(year, month, day, hours, minutes, 0, 0);
    } else {
      const direct = new Date(rawEndTime);
      if (!isNaN(direct.getTime())) {
        endDateTime = direct;
      }
    }
  } else if (dateStr) {
    const baseDate = new Date(dateStr);
    if (!isNaN(baseDate.getTime())) {
      endDateTime = baseDate;
    }
  }

  if (!endDateTime) {
    return { eligible: true, message: "" };
  }

  const now = new Date();
  const diffInMs = now.getTime() - endDateTime.getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  if (diffInMs < 0) {
    return {
      eligible: false,
      message: "Dispute can only be filed after the event end time",
      notStarted: true,
    };
  }

  if (diffInMs > twentyFourHoursInMs) {
    return {
      eligible: false,
      message: "Dispute window expired (24 hours passed after event end time)",
      expired: true,
    };
  }

  return { eligible: true, message: "" };
};

const formatLabel = (value) =>
  String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
  if (!value) return "-";

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "-";

  return dateValue.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
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

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "-";

  return dateValue.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatCurrency = (amount, currency = "usd") => {
  if (amount === undefined || amount === null || amount === "") return "-";

  try {
    const num = Number(amount);
    if (Number.isNaN(num)) return String(amount);

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "USD").toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    const num = Number(amount);
    return !Number.isNaN(num) ? `$${num.toFixed(2)}` : `${amount}`;
  }
};

const getStatusClasses = (status) => {
  const s = String(status || "").toLowerCase().replace(/_/g, " ");
  if (s === "completed") return { backgroundColor: "#DCFCE7", color: "#22C55E" };
  if (s === "confirmed") return { backgroundColor: "#DBEAFE", color: "#3B82F6" };
  if (s === "expired") return { backgroundColor: "#F3F4F6", color: "#6B7280" };
  if (s === "rejected") return { backgroundColor: "#FEE2E2", color: "#EF4444" };
  if (s === "approved") return { backgroundColor: "#D1FAE5", color: "#10B981" };
  if (s === "published") return { backgroundColor: "#E0E7FF", color: "#6366F1" };
  if (s === "cancelled") return { backgroundColor: "#FEE2E2", color: "#DC2626" };
  if (s === "upcoming") return { backgroundColor: "#EDE9FE", color: "#8B5CF6" };
  if (s === "pending" || s === "approval") return { backgroundColor: "#FEF3C7", color: "#F59E0B" };
  if (s === "awaiting payment" || s === "awaiting_payment") return { backgroundColor: "#EDE9FE", color: "#8B5CF6" };
  if (s === "refunded") return { backgroundColor: "#CCFBF1", color: "#0D9488" };
  return { backgroundColor: "#F3F4F6", color: "#6B7280" };
};

const createFallback1pxFile = () => {
  const byteCharacters = atob(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  );
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/png" });
  return new File([blob], "event-invitation.png", { type: "image/png" });
};

const generateEventInvitationBanner = (event) => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    // Dark navy / royal blue gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, "#061523");
    grad.addColorStop(0.5, "#0B0E52");
    grad.addColorStop(1, "#012C57");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative inner border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    // Brand tag
    ctx.fillStyle = "#A5B4FC";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("RESVOR EVENT INVITATION", 70, 95);

    // Event title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 52px sans-serif";
    const title = String(event?.title || event?.name || "Special Event");
    const displayTitle = title.length > 35 ? title.slice(0, 32) + "..." : title;
    ctx.fillText(displayTitle, 70, 185);

    // Venue name
    const venue = event?.loungeId?.name || "Exclusive Lounge";
    ctx.fillStyle = "#E0E7FF";
    ctx.font = "32px sans-serif";
    ctx.fillText(`📍 ${venue}`, 70, 260);

    // Date & Time
    const rawDate = event?.startDateTime || event?.date;
    const dateStr = rawDate
      ? new Date(rawDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
    const timeStr = rawDate
      ? new Date(rawDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    if (dateStr || timeStr) {
      ctx.fillStyle = "#CBD5E1";
      ctx.font = "28px sans-serif";
      ctx.fillText(`🗓 ${dateStr} ${timeStr ? `• ${timeStr}` : ""}`, 70, 325);
    }

    // Event type badge
    if (event?.eventType) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(70, 375, 220, 48, 10);
      } else {
        ctx.rect(70, 375, 220, 48);
      }
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(String(event.eventType).toUpperCase(), 95, 407);
    }

    // Invitation message
    ctx.fillStyle = "#94A3B8";
    ctx.font = "22px sans-serif";
    ctx.fillText(
      "You are cordially invited! We look forward to seeing you.",
      70,
      520
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], "event-invitation.png", { type: "image/png" }));
        } else {
          resolve(createFallback1pxFile());
        }
      }, "image/png");
    });
  } catch {
    return Promise.resolve(createFallback1pxFile());
  }
};

const fetchImageAsFile = async (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      const mime = blob.type || "image/png";
      const ext = mime.split("/")[1] || "png";
      return new File([blob], `event-image.${ext}`, { type: mime });
    }
  } catch (err) {
    // S3 or cross-origin fetch may be blocked by CORS
  }
  return null;
};

const getCampaignImageFile = async (imageUrl, event) => {
  if (imageUrl) {
    try {
      const file = await fetchImageAsFile(imageUrl);
      if (file && file.size > 0) return file;
    } catch {
      // Ignore
    }
  }
  return generateEventInvitationBanner(event);
};

export default function ReservationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [sendInvitation, setSendInvitation] = useState(false);
  const [pendingRecipients, setPendingRecipients] = useState([]);
  const [isFlayerFee, setIsFlayerFee] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showViewDisputeModal, setShowViewDisputeModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);

  const {
    data: eventResponse,
    isLoading,
    isError,
    error,
  } = useEventDetails(id);

  const event = eventResponse?.data;
  console.log("🚀 ~ ReservationDetails ~ event:", event)
  const { mutate: cancelEvent, isPending: isCancelling } = useCancelEvent();
  const { mutate: createDispute, isPending: isFilingDispute } = useCreateDispute();
  const { mutate: createCampaign, isPending: isSendingCampaign } = useCreateCampaign();

  const disputeId =
    (typeof event?.disputeId === "object" ? event?.disputeId?._id : event?.disputeId) ||
    (typeof event?.dispute === "object" ? event?.dispute?._id : event?.dispute) ||
    null;

  const disputeEligibility = checkDisputeEligibility(event);

  const organizerName =
    
    event?.name ||
    event?.guestName ||
    event?.contactName ||
    "-";

  const organizerEmail =

    event?.guestEmail ||
    event?.contactEmail ||
    "-";

  const organizerPhone =
  
    event?.guestPhone ||
    event?.userId?.phone ||
    event?.userId?.phoneNumber ||
    event?.userId?.mobile ||
    "N/A";

  const eventInstructions =
    event?.specialRequest ||
    "No instructions provided";
  const eventDescription =
    event?.description ||
    "No description provided";

  const eventDate = formatDate(event?.startDateTime || event?.date);
  const startTime = formatTime(event?.startDateTime || event?.startTime);
  const endTime = formatTime(event?.endDateTime || event?.endTime);
  const eventType = formatLabel(event?.eventType);
  const eventStatus = formatLabel(event?.status);
  // const paymentStatus = formatLabel(event?.paymentStatus);
  const currentStatus = String(event?.status || "").toLowerCase();
  const eventOverviewImage =
    event?.image?.location ||
    event?.image ||
    event?.flyer ||
    event?.loungeId?.logo?.location ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80";
  console.log("🚀 ~ ReservationDetails ~ currentStatus:", currentStatus)
  const hideSendInvite = [
    "pending",
    "approval",
    "rejected",
    "completed",
    "cancelled",
    "expired",
    "refunded",
  ].includes(currentStatus);
  const isCancelable = currentStatus === "confirmed";

  const handleCancelEvent = () => {
    if (!isCancelable || isCancelling) return;
    setShowCancelModal(true);
  };

  const confirmCancelEvent = () => {
    cancelEvent(id, {
      onSuccess: (response) => {
        setShowCancelModal(false);
        SuccessToast(response?.message || "Event cancelled successfully.");
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: ["event-details", id] });
      },
      onError: (requestError) => {
        ErrorToast(
          requestError?.response?.data?.message ||
          "Failed to cancel this event."
        );
      },
    });
  };

  const handleCreateDispute = ({ reason }) => {
    const sourceId = event?._id || event?.id || id;

    createDispute(
      {
        sourceId,
        sourceModel: "Event",
        reason,
      },
      {
        onSuccess: (response) => {
          setShowDisputeModal(false);
          SuccessToast(response?.message || "Dispute submitted successfully.");
          queryClient.invalidateQueries({ queryKey: ["events"] });
          queryClient.invalidateQueries({ queryKey: ["event-details", id] });
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

  const handleProceedInvitation = (recipients) => {
    setPendingRecipients(recipients);
    setSendInvitation(false);
    setIsFlayerFee(true);
  };

  const handleSubmitCampaign = async (recipients) => {
    if (!recipients || recipients.length === 0) {
      ErrorToast("Please select at least one recipient.");
      return;
    }

    const payload = new FormData();
    payload.append("channel", "email");
    recipients.forEach((email, index) => {
      payload.append(`recipients[${index}]`, email);
    });

    const info = event?.title
      ? `Event Invitation: ${event.title}`
      : "Event Invitation";
    payload.append("additionalInfo", event?.description || info);
    if (event?._id || id) {
      payload.append("eventId", event?._id || id);
    }

    try {
      const imageFile = await getCampaignImageFile(eventOverviewImage, event);
      if (imageFile) {
        payload.append("image", imageFile);
      }
    } catch (err) {
      console.warn("Failed to attach event overview image:", err);
    }

    if (!payload.get("image")) {
      payload.append("image", createFallback1pxFile());
    }

    createCampaign(payload, {
      onSuccess: () => {
        SuccessToast("Campaign sent successfully!");
        setIsFlayerFee(false);
        setIsSuccess(true);
      },
      onError: (err) => {
        const message =
          err?.response?.data?.message ||
          "Failed to send campaign. Please try again.";
        ErrorToast(message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5]">
        <p className="text-gray-500 font-semibold text-lg">
          Loading event details...
        </p>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5] px-4">
        <div className="max-w-md w-full rounded-[16px] bg-white p-6 shadow-sm text-center">
          <p className="text-[20px] font-semibold text-[#181818]">
            {error?.response?.data?.message || "Event details not found."}
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
                Event Details
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {disputeId ? (
                <button
                  type="button"
                  onClick={() => setShowViewDisputeModal(true)}
                  className="px-5 py-2.5 rounded-[12px] text-[12px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                >
                  View Dispute
                </button>
              ) : disputeEligibility.isDisputed ? (
                <button
                  type="button"
                  onClick={() => setShowViewDisputeModal(true)}
                  className="px-5 py-2.5 rounded-[12px] text-[12px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                >
                  View Dispute
                </button>
              ) : disputeEligibility.eligible ? (
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(true)}
                  className="px-5 py-2.5 rounded-[12px] text-[12px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm"
                >
                  File Dispute
                </button>
              ) : disputeEligibility.notStarted ? (
                <button
                  type="button"
                  disabled
                  title="Dispute can only be filed after the event end time"
                  className="px-5 py-2.5 rounded-[12px] text-[12px] font-semibold border border-white/30 bg-white/10 text-white/70 cursor-not-allowed"
                >
                  Dispute Available After Event Ends
                </button>
              ) : disputeEligibility.expired ? (
                <button
                  type="button"
                  disabled
                  title="Dispute window expired (24 hours passed after event end time)"
                  className="px-5 py-2.5 rounded-[12px] text-[12px] font-semibold border border-white/30 bg-white/10 text-white/70 cursor-not-allowed"
                >
                  Dispute Expired
                </button>
              ) : null}

              {!hideSendInvite && (
                <button
                  className="px-6 py-3 rounded-[12px] text-[12px] font-semibold bg-[#F4F4FF] hover:bg-[#E8E8FF] text-[#222246] transition cursor-pointer shadow-sm"
                  type="button"
                  onClick={() => setSendInvitation(true)}
                >
                  Send Invite
                </button>
              )}
              {/* {currentStatus === "rejected" && (
                <button
                  type="button"
                  onClick={() => setShowRejectedModal(true)}
                  className="px-6 py-3 rounded-[12px] text-[12px] font-semibold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer shadow-sm"
                >
                  View Reason
                </button>
              )} */}
              {currentStatus === "confirmed" && (
                <button
                  type="button"
                  onClick={handleCancelEvent}
                  disabled={isCancelling}
                  className="px-8 py-3 rounded-[12px] text-[12px] font-semibold border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Event"}
                </button>
              )}
            </div>
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
              Event Overview
            </h2>

            <div className="bg-[#FFFFFF] rounded-[24px] p-5 space-y-6">
              <div className="flex flex-col md:flex-row gap-8 pb-5 border-b border-[#0000001A]">
                <img
                  src={eventOverviewImage}
                  alt="Event venue"
                  className="rounded-xl w-[368px] h-[212px] object-cover"
                />

                <div className="flex-1 mt-[10px] md:mt-[38px]">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[24px] font-semibold text-[#000000]">
                      {event?.title || "-"}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-[12px] font-semibold capitalize"
                      style={getStatusClasses(event?.status)}
                    >
                      {eventStatus}
                    </span>
                    {currentStatus === "rejected" && (
                      <button
                        type="button"
                        onClick={() => setShowRejectedModal(true)}
                        className="px-3.5 py-1 text-[12px] font-semibold rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 transition cursor-pointer border border-rose-300"
                      >
                        View Reason
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-[#E6E6F0] text-[#010067] rounded-full text-sm">
                      {eventType}
                    </span>
                    <span className="px-3 py-1 bg-[#E6E6F0] text-[#010067] rounded-full text-sm">
                      {event?.loungeId?.name || "Venue not available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-4">
                    <IoLocation className="text-xl text-[#010067]" />
                    <p className="text-[#505050] text-[16px] font-[500]">
                      {event?.loungeId?.name || "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] break-all pt-1">
                    <p>{eventDescription}</p>
                  </div>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
                    <div>
                      <p className="text-[#727272]">Organizer</p>
                      <p className="font-semibold text-[#181818]">
                        {organizerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#727272]">Organizer Email</p>
                      <p className="font-semibold text-[#181818] break-all">
                        {organizerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#727272]">Organizer Phone</p>
                      <p className="font-semibold text-[#181818] break-all">
                        {organizerPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Event Type
                  </p>
                  <p className="text-[#000000] text-[15px]">{eventType}</p>
                </div>
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Event Date
                  </p>
                  <p className="text-[#000000] text-[15px]">{eventDate}</p>
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
                    {event?.guestCount ?? "-"}
                  </p>
                </div>
                {/* <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Budget
                  </p>
                  <p className="text-[#000000] text-[15px]">
                    {formatCurrency(event?.budget, event?.currency)}
                  </p>
                </div> */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#0000001A] text-sm">
                <div className="min-w-0">
                  <p className="text-black font-semibold mb-2">Budget</p>
                  <p className="text-gray-600 text-sm font-semibold break-words">
                    {formatCurrency(event?.budget, event?.currency)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-black font-semibold mb-2">Preferred Music</p>
                  <p className="text-gray-600 text-sm font-semibold break-words whitespace-pre-wrap">
                    {event?.preferredMusic || "N/A"}
                  </p>
                </div>
                {/* <div className="min-w-0">
                  <p className="text-black font-semibold mb-2">Special Request</p>
                  <p className="text-gray-600 text-sm font-semibold break-words whitespace-pre-wrap">
                    {event?.specialRequest || "None"}
                  </p>
                </div> */}
                <div className="min-w-0">
                  <p className="text-black font-semibold mb-2">
                    Ticket at Door{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </p>
                  <p className="text-gray-600 text-sm font-semibold break-words">
                    {typeof event?.ticketAtDoor === "boolean"
                      ? event.ticketAtDoor
                        ? "Yes"
                        : "No"
                      : event?.ticketAtDoor || "None"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 mb-8">
                <p className="text-black font-semibold mb-3">
                  Services and Packages
                </p>
                <div className="flex flex-wrap gap-4">
                  {event?.servicePackageIds?.length > 0 ? (
                    event?.servicePackageIds?.map((service, index) => (
                      <div
                        key={service?._id || service?.id || index}
                        className="flex-1 min-w-[240px] max-w-[340px] rounded-lg bg-gray-50 border border-gray-100 p-3.5"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-[#181818] text-[15px] break-words">
                            {service.name}
                          </h4>
                          {service.price !== undefined && service.price !== null && (
                            <span className="text-[#010067] font-semibold text-[14px]">
                              ({formatCurrency(Number(service?.price ?? 0) / (service?.price > 1000 ? 100 : 1), event?.currency)})
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="mt-1 text-[13px] leading-5 text-gray-600 break-words whitespace-pre-wrap">
                            {service.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm font-semibold">
                      No services selected
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="font-semibold mb-3 text-black">
                  Any Instructions{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </p>
                <p className="text-gray-700 leading-relaxed text-sm break-words whitespace-pre-wrap">
                  {eventInstructions}
                </p>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-3 mt-6 text-gray-800">User Information</h2>

            <div className="bg-white rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <p className="text-black font-semibold mb-2">Name</p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {organizerName}
                  </p>
                </div>
                <div>
                  <p className="text-black font-semibold mb-2">Email Address</p>
                  <p className="text-gray-600 text-sm font-semibold break-all">
                    {organizerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-black font-semibold mb-2">Phone Number</p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {organizerPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sendInvitation && (
        <SendInvitationModal
          onProceed={handleProceedInvitation}
          onClick={handleProceedInvitation}
          onClose={() => setSendInvitation(false)}

        />
      )}

      {isFlayerFee && (
        <FlayerFeeModal
          onClick={() => handleSubmitCampaign(pendingRecipients)}
          onClose={() => setIsFlayerFee(false)}
          isLoading={isSendingCampaign}
        />
      )}

      {isSuccess && (
        <AuthSuccessModal
          onClick={() => setIsSuccess(false)}
          title="Invitation sent"
          description="Your invitation has been sent to all guests."
        />
      )}

      <ConfirmationModal
        isOpen={showCancelModal}
        title="Cancel Event"
        description="Are you sure you want to cancel this event?"
        confirmText="Yes"
        cancelText="No"
        loading={isCancelling}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={confirmCancelEvent}
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

      <RejectedModal
        isOpen={showRejectedModal}
        onClose={() => setShowRejectedModal(false)}
        rejectionReason={event?.rejectionReason}
      />
    </>
  );
}
