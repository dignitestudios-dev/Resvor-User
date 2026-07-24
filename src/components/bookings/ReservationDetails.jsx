import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import ConfirmationModal from "../global/ConfirmationModal";
import SendInvitationModal from "../flayer/SendInvitationModal";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import DisputeModal from "./DisputeModal";
import ViewDisputeModal from "./ViewDisputeModal";
import { useCancelEvent, useCreateDispute, useEventDetails } from "../../hooks/queries/useQueries";

// ── dispute eligibility helper ────────────────────────────────────────────────
const checkDisputeEligibility = (event) => {
  if (!event) return { eligible: false, message: "No event data" };

  if (event?.isDisputed || event?.disputeStatus || event?.dispute) {
    return { eligible: false, message: "Dispute already filed", isDisputed: true };
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
    year: "numeric",
    month: "short",
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "USD").toUpperCase(),
    }).format(Number(amount));
  } catch {
    return `${amount}`;
  }
};

const getStatusClasses = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "pending") {
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

export default function ReservationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [sendInvitation, setSendInvitation] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showViewDisputeModal, setShowViewDisputeModal] = useState(false);

  const {
    data: eventResponse,
    isLoading,
    isError,
    error,
  } = useEventDetails(id);

  const event = eventResponse?.data;
  const { mutate: cancelEvent, isPending: isCancelling } = useCancelEvent();
  const { mutate: createDispute, isPending: isFilingDispute } = useCreateDispute();

  const disputeId =
    (typeof event?.disputeId === "object" ? event?.disputeId?._id : event?.disputeId) ||
    (typeof event?.dispute === "object" ? event?.dispute?._id : event?.dispute) ||
    null;

  const disputeEligibility = checkDisputeEligibility(event);

  const organizerName = [
    event?.userId?.firstName,
    event?.userId?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "-";

  const eventDate = formatDate(event?.startDateTime);
  const startTime = formatTime(event?.startDateTime);
  const endTime = formatTime(event?.endDateTime);
  const eventType = formatLabel(event?.eventType);
  const eventStatus = formatLabel(event?.status);
  const paymentStatus = formatLabel(event?.paymentStatus);
  const isCancelable =
    event &&
    !["cancelled", "completed"].includes(String(event.status || "").toLowerCase());

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
                  className="px-5 py-2.5 rounded-[12px] text-[12px] font-semibold border border-gray-200 bg-white/20 text-gray-300 cursor-not-allowed"
                >
                  Dispute Available After Event Ends
                </button>
              ) : disputeEligibility.expired ? (
                <button
                  type="button"
                  disabled
                  title="Dispute window expired (24 hours passed after event end time)"
                  className="px-5 py-2.5 rounded-[12px] text-[12px] font-semibold border border-gray-200 bg-white/20 text-gray-300 cursor-not-allowed"
                >
                  Dispute Expired
                </button>
              ) : null}

              <button
                className="px-6 py-3 rounded-[12px] text-[12px] font-semibold bg-purple-50 text-[#181818]"
                type="button"
                onClick={() => setSendInvitation(true)}
              >
                Send Invite
              </button>
              <button
                type="button"
                onClick={handleCancelEvent}
                disabled={!isCancelable || isCancelling}
                className={`px-8 py-3 rounded-[12px] text-[12px] font-semibold border transition ${isCancelable && !isCancelling
                  ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                  : "border-gray-200 bg-white text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isCancelling
                  ? "Cancelling..."
                  : isCancelable
                    ? "Cancel Event"
                    : eventStatus}
              </button>
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
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
                  alt="Event venue"
                  className="rounded-xl w-[368px] h-[212px] object-cover"
                />

                <div className="flex-1 mt-[10px] md:mt-[38px]">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[24px] font-semibold text-[#000000]">
                      {event?.title || "-"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${getStatusClasses(
                        event?.status
                      )}`}
                    >
                      {eventStatus}
                    </span>
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

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <p className="text-[#727272]">Organizer</p>
                      <p className="font-semibold text-[#181818]">
                        {organizerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#727272]">Organizer Email</p>
                      <p className="font-semibold text-[#181818] break-all">
                        {event?.userId?.email || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
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
                <div className="space-y-3">
                  <p className="font-semibold text-[#000000] text-[16px]">
                    Budget
                  </p>
                  <p className="text-[#000000] text-[15px]">
                    {formatCurrency(event?.budget, event?.currency)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#0000001A] text-sm">
                <div>
                  <p className="text-black font-semibold mb-2">Preferred Music</p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {event?.preferredMusic || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-black font-semibold mb-2">Special Request</p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {event?.specialRequest || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-black font-semibold mb-2">Budget</p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {formatCurrency(event?.budget, event?.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-black font-semibold mb-2">
                    Ticket at Door{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {typeof event?.ticketAtDoor === "boolean"
                      ? event.ticketAtDoor
                        ? "Yes"
                        : "No"
                      : event?.ticketAtDoor || "None"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 mb-8">
                <p className="text-black font-semibold mb-2">
                  Services and Packages
                </p>
                <div className="flex gap-12">
                  {event?.servicePackageIds?.length > 0 ? (
                    event?.servicePackageIds?.map((service, index) => (
                      <div key={service?._id || service?.id || index}>
                        <p className="text-gray-600 text-sm font-semibold">
                          {service.name}
                        </p>
                        <p className="text-gray-600 text-sm font-semibold">
                          {service.description}
                        </p>
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
                <p className="font-semibold mb-3">
                  Any Instructions{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {event?.description || "No instructions provided"}
                </p>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-3 mt-6 text-gray-800">User Information</h2>

            <div className="bg-white rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <p className="text-black font-semibold mb-2">Name</p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {organizerName && organizerName !== "-" ? organizerName : event?.guestName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-black font-semibold mb-2">Email Address</p>
                  <p className="text-gray-600 text-sm font-semibold break-all">
                    {event?.userId?.email || event?.guestEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-black font-semibold mb-2">Phone Number</p>
                  <p className="text-gray-600 text-sm font-semibold">
                    {event?.userId?.phone || event?.userId?.phoneNumber || event?.guestPhone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sendInvitation && (
        <SendInvitationModal
          onClick={() => setSendInvitation(false)}
          onClose={() => setSendInvitation(false)}
          handleSuccess={() => setSendInvitation(false)}
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
    </>
  );
}
