/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";

const EventDetailsModal = ({
  onClose,
  eventData,
  serviceData,
  onClickBack,
  onClick,
}) => {
  console.log("🚀 ~ EventDetailsModal ~ serviceData:", serviceData);
  const {
    eventType = "Birthday Party",
    date = "26 Dec, 2024",
    startTime = "06:00 PM",
    endTime = "06:00 PM",
    name = "Mike Smith",
    email = "designer@gmail.com",
    phone = "1 462 849 558",
    guestCount = "30 Guests",
    preferredMusic = "Hip Hop, R&B, Rock",
    specialRequest = "Birthday Signage",
    budget = "$1000",
    ticketAtDoor = "None",
  } = eventData || {};


  const formatTime = (time) => {
    if (!time) return "-";

    // Already in 12-hour format
    if (typeof time === "string" && /AM|PM/i.test(time)) {
      return time;
    }

    // HH:mm or HH:mm:ss
    if (typeof time === "string" && time.includes(":") && !time.includes("T")) {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), 0, 0);

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // ISO date
    const date = new Date(time);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    return time;
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-full max-w-[440px] mx-4 pb-2 h-[650px] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-4 border-b-2 border-b-gray-300">
          <h2 className="text-[28px] font-bold mb-4">Event Details</h2>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="cursor-pointer"
          >
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>        {/* Content */}
        <div className="px-8 pt-6 pb-2">
          {/* Booking & Personal Overview */}
          <div className="space-y-2.5 text-[14px] border-b-2 border-b-gray-300 pb-4 mb-4">
            <h3 className="text-[16px] font-bold text-[#181818] mb-3">
              Booking & Personal Overview
            </h3>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Event Type</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{eventType}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Date</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{date}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Time</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">
                {formatTime(startTime)} – {formatTime(endTime)}
              </span>          </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Name</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{name}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Email Address</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{email}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Phone Number</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{phone}</span>
            </div>
          </div>

          {/* Event Details & Budget */}
          <div className="space-y-2.5 text-[14px] border-b-2 border-b-gray-300 pb-4 mb-4">
            <h3 className="text-[16px] font-bold text-[#181818] mb-3">
              Event Details & Budget
            </h3>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Guest Count</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{guestCount}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Preferred Music</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{preferredMusic}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Special Request</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{specialRequest}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Budget</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{budget}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Ticket at Door</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">
                {typeof ticketAtDoor === "boolean" ? (ticketAtDoor ? "Yes" : "No") : ticketAtDoor}
              </span>
            </div>
          </div>

          {/* Services & Seating Area */}
          <div className="mb-4">
            <p className="font-semibold text-[16px] text-[#000000] mb-3">
              Services, Packages & Seating
            </p>
            <div className="grid grid-cols-2 gap-3 text-[14px] bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <p className="font-bold text-gray-800 mb-1">Services/Packages</p>
                {serviceData?.selectedPackage?.length > 0 ? (
                  serviceData.selectedPackage.map((item) => (
                    <p
                      key={item.id}
                      className="text-gray-700 text-sm break-words max-w-[150px]"
                    >
                      {item.title} -{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format((item.price || 0) / 100)}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs">None</p>
                )}
              </div>
              <div className="border-l border-gray-300 pl-3">
                <p className="font-bold text-gray-800 mb-1">Preferred Seating</p>
                {serviceData?.selectedSeating?.length > 0 ? (
                  serviceData.selectedSeating.map((item, index) => (
                    <p key={index} className="text-gray-700 text-sm break-words max-w-[150px]">
                      {item.name || item.title}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs">None</p>
                )}
              </div>
            </div>
          </div>

          {serviceData?.instruction && (
            <div className="mb-6">
              <p className="font-semibold text-[#000000] mb-1">
                Any Instruction{" "}
                <span className="text-[#727272] text-[11px]">(optional)</span>
              </p>
              <p className="text-[#6B6B6B] text-[12px] leading-5 break-words max-h-[100px] overflow-y-auto">
                {serviceData?.instruction}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 mt-6">
            <Button text="Send Request" type="button" onClick={onClick} />
            <button
              onClick={onClickBack}
              className="w-full bg-[#E8E8E8] text-[#181818] text-[14px] rounded-[8px] py-2 font-semibold hover:bg-[#D8D8D8] transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
