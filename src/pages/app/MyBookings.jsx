import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useState } from "react";
import BookingsTable from "../../components/bookings/BookingsTable";
import EventBookingsTable from "../../components/bookings/EventBookingsTable";
import StatusDropdown from "../../components/global/StatusDropdown";
import { useBookings, useEvents } from "../../hooks/queries/useQueries";

// ── helpers ──────────────────────────────────────────────────────────────────

const formatDateLabel = (isoValue) => {
  if (!isoValue) return "-";
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return "-";
  // MM/DD/YYYY in local timezone
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTimeLabel = (isoValue) => {
  if (!isoValue) return "";
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "");
};

const formatDisplayLabel = (value) =>
  String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

const formatEventStatus = (value) => {
  const normalized = String(value || "").toLowerCase();
  const statusMap = {
    pending: "Approval",
    approved: "Upcoming",
    confirmed: "Upcoming",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return statusMap[normalized] || formatDisplayLabel(value);
};

// ── component ─────────────────────────────────────────────────────────────────

const MyBooking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState("");

  // Pagination states
  const [bookingsPage, setBookingsPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const limit = 10;

  const { data: bookingsResponse, isLoading: isBookingsLoading } = useBookings(
    { page: bookingsPage, limit },
    { enabled: activeTab === "bookings" }
  );
  const { data: eventsResponse, isLoading: isEventsLoading } = useEvents(
    { page: eventsPage, limit },
    { enabled: activeTab === "events" }
  );

  const bookingsData = bookingsResponse?.data || [];
  const eventsData = eventsResponse?.data || [];

  const bookingsPagination = bookingsResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const eventsPagination = eventsResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const handlePrevBookingsPage = () => {
    if (bookingsPagination.currentPage > 1) {
      setBookingsPage((prev) => prev - 1);
    }
  };

  const handleNextBookingsPage = () => {
    if (bookingsPagination.currentPage < bookingsPagination.totalPages) {
      setBookingsPage((prev) => prev + 1);
    }
  };

  const handlePrevEventsPage = () => {
    if (eventsPagination.currentPage > 1) {
      setEventsPage((prev) => prev - 1);
    }
  };

  const handleNextEventsPage = () => {
    if (eventsPagination.currentPage < eventsPagination.totalPages) {
      setEventsPage((prev) => prev + 1);
    }
  };

  // ── bookings rows ──────────────────────────────────────────────────────────
  const bookingRows = bookingsData.map((booking) => {
    const seatingArea =
      booking.tableIds?.length > 0
        ? booking.tableIds
          .map((t) => {
            const label = t.type
              ? t.type.charAt(0).toUpperCase() + t.type.slice(1)
              : "Regular";
            const code = t.code || (t.tableNumber != null ? `T${t.tableNumber}` : "");
            return code ? `${label} (${code})` : label;
          })
          .join(", ")
        : "Regular";

    const location =
      booking.loungeId?.location?.address ||
      booking.loungeId?.address ||
      booking.loungeId?.city ||
      "Address not available";

    // MM/DD/YYYY
    const dateStr = booking.bookingDate
      ? formatDateLabel(booking.bookingDate)
      : "-";

    const fmtTime = (isoStr) => {
      if (!isoStr) return "";
      const d = new Date(isoStr);
      if (Number.isNaN(d.getTime())) return String(isoStr);
      return d
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(" ", "");
    };

    const startTimeStr = fmtTime(booking.startTime);
    const endTimeStr = fmtTime(booking.endTime);
    const time = startTimeStr && endTimeStr ? `${startTimeStr} - ${endTimeStr}` : startTimeStr || endTimeStr || "-";

    let status = "Pending";
    if (booking.status === "completed") {
      status = "Completed";
    } else if (booking.status === "awaiting_payment" || booking.status === "pending") {
      status = "Pending";
    } else if (booking.status === "confirmed" || booking.status === "approved") {
      status = "Upcoming";
    } else if (booking.status === "cancelled" || booking.status === "rejected") {
      status = "Cancelled";
    }

    return {
      _id: booking._id,
      name: booking.loungeId?.name || "Testing Lounge",
      date: dateStr,
      time,
      guestLimit: String(booking.guestCount || 0).padStart(2, "0"),
      seatingArea,
      location,
      status,
      eventType: booking.specialRequest || "-",
    };
  });

  // ── event rows ─────────────────────────────────────────────────────────────
  const eventRows = eventsData.map((event) => {
    const startTime = formatTimeLabel(event.startDateTime);
    const endTime = formatTimeLabel(event.endDateTime);

    return {
      _id: event._id,
      name: event.title || "-",
      location: event.loungeId?.name || "Venue not available",
      date: formatDateLabel(event.startDateTime),
      time: startTime && endTime ? `${startTime} - ${endTime}` : "-",
      guestLimit: String(event.guestCount || 0).padStart(2, "0"),
      eventType: formatDisplayLabel(event.eventType),
      budget:
        event.budget !== undefined && event.budget !== null
          ? `$${event.budget}`
          : "-",
      status: formatEventStatus(event.status),
    };
  });

  // ── filter + sort ──────────────────────────────────────────────────────────
  const activeRows = activeTab === "bookings" ? bookingRows : eventRows;
  const activeStatusFilter = activeTab === "bookings" ? bookingStatusFilter : eventStatusFilter;
  const activeLoading = activeTab === "bookings" ? isBookingsLoading : isEventsLoading;

  const filteredRows = activeStatusFilter
    ? activeRows.filter((row) => row.status === activeStatusFilter)
    : activeRows;

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (sortConfig.key === "guestLimit") {
      valA = parseInt(valA, 10);
      valB = parseInt(valB, 10);
    }
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-between w-full px-5 lg:px-40 gap-3 mt-3">
          <div className="flex gap-1">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              My Bookings
            </h2>
          </div>

          <div className="flex flex-col">
            <div className="w-[320px] flex">
              <button
                className={`text-[12px] py-3 px-6 rounded-l-2xl w-full ${activeTab === "bookings"
                  ? " bg-[#FFFFFF] text-[#222246]"
                  : " bg-[#222246] text-white"
                  }`}
                onClick={() => setActiveTab("bookings")}
              >
                My Reservations
              </button>

              <button
                className={`text-[12px] px-6 rounded-r-2xl w-full ${activeTab === "events"
                  ? "bg-[#FFFFFF] text-[#222246]"
                  : "bg-[#222246] text-white"
                  }`}
                onClick={() => setActiveTab("events")}
              >
                My Events
              </button>
            </div>

            {activeTab === "bookings" ? (
              <div className="text-white absolute top-40 right-44 z-20 w-[180px]">
                <StatusDropdown
                  value={bookingStatusFilter}
                  onChange={(status) => {
                    setBookingStatusFilter(status);
                    setBookingsPage(1);
                  }}
                  options={["All", "Completed", "Pending", "Upcoming", "Cancelled"]}
                />
              </div>
            ) : (
              <div className="text-white absolute top-40 right-44 z-20 w-[180px]">
                <StatusDropdown
                  value={eventStatusFilter}
                  onChange={(status) => {
                    setEventStatusFilter(status);
                    setEventsPage(1);
                  }}
                  options={["All", "Approval", "Upcoming", "Completed", "Rejected"]}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-40 mt-12">
        <div className="mx-auto bg-white rounded-xl -mt-[16em] border-[1px] border-[#b9b9b95f] min-h-[200px]">
          {activeLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
              Loading {activeTab === "bookings" ? "bookings" : "events"}...
            </div>
          ) : activeTab === "bookings" ? (
            <>
              <BookingsTable
                users={sortedRows}
                onSort={requestSort}
                sortConfig={sortConfig}
              />
              {!isBookingsLoading && sortedRows.length > 0 && (
                <div className="flex items-center justify-between border-t border-[#D4D4D4] bg-white px-6 py-4 rounded-b-xl">
                  <div className="text-sm text-gray-500">
                    Showing page <span className="font-semibold text-gray-800">{bookingsPagination.currentPage}</span> of{" "}
                    <span className="font-semibold text-gray-800">{bookingsPagination.totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrevBookingsPage}
                      disabled={bookingsPagination.currentPage === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNextBookingsPage}
                      disabled={bookingsPagination.currentPage === bookingsPagination.totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <EventBookingsTable
                events={sortedRows}
                onSort={requestSort}
                sortConfig={sortConfig}
              />
              {!isEventsLoading && sortedRows.length > 0 && (
                <div className="flex items-center justify-between border-t border-[#D4D4D4] bg-white px-6 py-4 rounded-b-xl">
                  <div className="text-sm text-gray-500">
                    Showing page <span className="font-semibold text-gray-800">{eventsPagination.currentPage}</span> of{" "}
                    <span className="font-semibold text-gray-800">{eventsPagination.totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrevEventsPage}
                      disabled={eventsPagination.currentPage === 1}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNextEventsPage}
                      disabled={eventsPagination.currentPage === eventsPagination.totalPages}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBooking;
