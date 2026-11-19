import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import BookingsTable from "../../components/bookings/BookingsTable";
import EventBookingsTable from "../../components/bookings/EventBookingsTable";
import StatusDropdown from "../../components/global/StatusDropdown";
import Pagination from "../../components/global/Pagination";
import { useBookings, useEvents } from "../../hooks/queries/useQueries";
import { useTableQuery } from "../../hooks/useTableQuery";

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
    .replace(/\u202f/g, " ");
};

const formatDisplayLabel = (value) =>
  String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

const formatEventStatus = (value) => {
  const normalized = String(value || "").toLowerCase();
  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return statusMap[normalized] || formatDisplayLabel(value);
};

// ── component ─────────────────────────────────────────────────────────────────

const MyBooking = () => {
  const navigate = useNavigate();

  const { query, setPage, setFilter, updateQuery } = useTableQuery({
    defaultValues: {
      tab: "bookings",
      status: "all",
      page: 1,
    },
  });

  const activeTab = query.tab === "events" ? "events" : "bookings";
  const activeStatusFilter = query.status || "all";
  const limit = 10;

  const bookingsApiParams = useMemo(() => ({
    page: query.page,
    limit,
    ...(activeStatusFilter && activeStatusFilter !== "all" ? { status: activeStatusFilter.toLowerCase() } : {}),
  }), [query.page, limit, activeStatusFilter]);

  const eventsApiParams = useMemo(() => ({
    page: query.page,
    limit,
    ...(activeStatusFilter && activeStatusFilter !== "all" ? { status: activeStatusFilter.toLowerCase() } : {}),
  }), [query.page, limit, activeStatusFilter]);

  const { data: bookingsResponse, isLoading: isBookingsLoading, isFetching: isBookingsFetching } = useBookings(
    bookingsApiParams,
    { enabled: activeTab === "bookings" }
  );
  const { data: eventsResponse, isLoading: isEventsLoading, isFetching: isEventsFetching } = useEvents(
    eventsApiParams,
    { enabled: activeTab === "events" }
  );

  const bookingsData = bookingsResponse?.data || [];
  const eventsData = eventsResponse?.data || [];

  const bookingsPagination = bookingsResponse?.pagination || {
    currentPage: query.page,
    totalPages: 1,
    totalItems: bookingsData.length,
    itemsPerPage: limit,
  };

  const eventsPagination = eventsResponse?.pagination || {
    currentPage: query.page,
    totalPages: 1,
    totalItems: eventsData.length,
    itemsPerPage: limit,
  };

  const handleTabChange = (newTab) => {
    updateQuery({ tab: newTab, status: "all", page: 1 });
  };

  const handleStatusChange = (newStatus) => {
    const val = (newStatus || "").toLowerCase();
    setFilter("status", val === "all" ? "" : val);
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
        .replace(/\u202f/g, " ");
    };

    const startTimeStr = fmtTime(booking.startTime);
    const endTimeStr = fmtTime(booking.endTime);
    const time = startTimeStr && endTimeStr ? `${startTimeStr} - ${endTimeStr}` : startTimeStr || endTimeStr || "-";

    let status = "Pending";
    if (booking.status === "completed") {
      status = "Completed";
    } else if (booking.status === "awaiting_payment" || booking.status === "pending") {
      status = "Pending";
    } else if (booking.status === "confirmed") {
      status = "Confirmed";
    } else if (booking.status === "approved") {
      status = "Approved";
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
      rejectionReason: event.rejectionReason || "",
    };
  });

  // ── filter ──────────────────────────────────────────────────────────────────
  const activeRows = activeTab === "bookings" ? bookingRows : eventRows;
  const activeInitialLoading =
    activeTab === "bookings"
      ? isBookingsLoading && !bookingsData.length
      : isEventsLoading && !eventsData.length;
  const activeFetching = activeTab === "bookings" ? isBookingsFetching : isEventsFetching;
  const activePagination = activeTab === "bookings" ? bookingsPagination : eventsPagination;

  const filteredRows =
    activeStatusFilter && activeStatusFilter !== "all"
      ? activeRows.filter(
          (row) =>
            String(row.status || "").toLowerCase() ===
            activeStatusFilter.toLowerCase()
        )
      : activeRows;

  const totalRecords =
    activeStatusFilter &&
    activeStatusFilter !== "all" &&
    activePagination.totalItems === activeRows.length
      ? filteredRows.length
      : (activePagination.totalItems ?? filteredRows.length);

  const currentDropdownValue =
    activeStatusFilter && activeStatusFilter !== "all"
      ? activeStatusFilter.charAt(0).toUpperCase() + activeStatusFilter.slice(1)
      : "All";

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
                className={`text-[12px] py-3 px-6 rounded-l-2xl w-full ${
                  activeTab === "bookings"
                    ? " bg-[#FFFFFF] text-[#222246]"
                    : " bg-[#222246] text-white"
                }`}
                onClick={() => handleTabChange("bookings")}
              >
                My Reservations
              </button>

              <button
                className={`text-[12px] px-6 rounded-r-2xl w-full ${
                  activeTab === "events"
                    ? "bg-[#FFFFFF] text-[#222246]"
                    : "bg-[#222246] text-white"
                }`}
                onClick={() => handleTabChange("events")}
              >
                My Events
              </button>
            </div>

            {activeTab === "bookings" ? (
              <div className="text-white absolute top-40 right-44 z-20 w-[180px]">
                <StatusDropdown
                  value={currentDropdownValue}
                  onChange={handleStatusChange}
                  options={["All", "Pending", "Confirmed", "Completed", "Cancelled"]}
                />
              </div>
            ) : (
              <div className="text-white absolute top-40 right-44 z-20 w-[180px]">
                <StatusDropdown
                  value={currentDropdownValue}
                  onChange={handleStatusChange}
                  options={["All", "Pending", "Confirmed", "Completed", "Rejected", "Cancelled"]}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-40 mt-12">
        <div className="mx-auto bg-white rounded-xl -mt-[16em] border-[1px] border-[#b9b9b95f] min-h-[200px]">
          {activeInitialLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
              Loading {activeTab === "bookings" ? "bookings" : "events"}...
            </div>
          ) : activeTab === "bookings" ? (
            <div className={`transition-opacity duration-200 ${activeFetching ? "opacity-75" : "opacity-100"}`}>
              <BookingsTable
                users={filteredRows}
              />
              <Pagination
                currentPage={query.page}
                totalPages={bookingsPagination.totalPages || 1}
                totalItems={totalRecords}
                itemsPerPage={limit}
                onPageChange={setPage}
                isLoading={activeFetching}
              />
            </div>
          ) : (
            <div className={`transition-opacity duration-200 ${activeFetching ? "opacity-75" : "opacity-100"}`}>
              <EventBookingsTable
                events={filteredRows}
              />
              <Pagination
                currentPage={query.page}
                totalPages={eventsPagination.totalPages || 1}
                totalItems={totalRecords}
                itemsPerPage={limit}
                onPageChange={setPage}
                isLoading={activeFetching}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBooking;
