import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useState } from "react";
import BookingsTable from "../../components/bookings/BookingsTable";
import EventBookingsTable from "../../components/bookings/EventBookingsTable";
import StatusDropdown from "../../components/global/StatusDropdown";
import { useBookings } from "../../hooks/queries/useQueries";

const MyBooking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [statusFilter, setStatusFilter] = useState("");

  const { data: bookingsResponse, isLoading } = useBookings({ page: 1, limit: 100 });
  const bookingsData = bookingsResponse?.data || [];

  const users = bookingsData.map((booking) => {
    const seatingArea = booking.tableIds?.length > 0
      ? booking.tableIds.map(t => `${t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : "Regular"} (${t.code || `T${t.tableNumber}`})`).join(", ")
      : "Regular";

    const location = booking.loungeId?.location?.address || "Address not available";

    const dateStr = booking.bookingDate
      ? new Date(booking.bookingDate).toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" }).replace(/\//g, '-')
      : "-";

    const formatTimeStr = (isoStr) => {
      if (!isoStr) return "";
      const dateObj = new Date(isoStr);
      return dateObj.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true }).replace(" ", "");
    };

    const startTimeStr = formatTimeStr(booking.startTime);
    const endTimeStr = formatTimeStr(booking.endTime);
    const time = startTimeStr && endTimeStr ? `${startTimeStr} - ${endTimeStr}` : "-";

    let status = "Pending";
    if (booking.status === "completed") {
      status = "Completed";
    } else if (booking.status === "awaiting_payment" || booking.status === "pending") {
      status = "Pending";
    } else if (booking.status === "confirmed") {
      status = "Upcoming";
    }

    return {
      _id: booking._id,
      name: booking.loungeId?.name || "Testing Lounge",
      date: dateStr,
      time: time,
      guestLimit: String(booking.guestCount || 0).padStart(2, '0'),
      seatingArea: seatingArea,
      location: location,
      status: status,
      eventType: booking.specialRequest || "-",
    };
  });

  const filteredUsers = statusFilter
    ? users.filter((u) => u.status === statusFilter)
    : users;

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    // Convert guestLimit to number for numeric sorting
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
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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
          <div className="flex flex-col ">
            <div className="w-[320px] flex ">
              <button
                className={`text-[12px] py-3 px-6 rounded-l-2xl w-full ${
                  activeTab === "bookings"
                    ? " bg-[#FFFFFF] text-[#222246]"
                    : " bg-[#222246] text-white"
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                My Reservations
              </button>

              <button
                className={`text-[12px] px-6 rounded-r-2xl w-full ${
                  activeTab === "events"
                    ? "bg-[#FFFFFF] text-[#222246]"
                    : "bg-[#222246] text-white"
                }`}
                onClick={() => setActiveTab("events")}
              >
                My Events
              </button>
            </div>
            {activeTab === "bookings" ? (
              <div className="text-white absolute top-40 right-44 z-50 w-[180px]">
                <StatusDropdown
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["All", "Completed", "Pending"]}
                />
              </div>
            ) : (
              <div className="text-white absolute top-40 right-44 z-50 w-[180px]">
                <StatusDropdown
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["All", "Approval", "Upcoming"]}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-40 mt-12">
        <div
          className=" mx-auto bg-white rounded-xl -mt-[16em] border-[1px] border-[#b9b9b95f] min-h-[200px]"
          // style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
              Loading bookings...
            </div>
          ) : activeTab === "bookings" ? (
            <BookingsTable
              users={sortedUsers}
              onSort={requestSort}
              sortConfig={sortConfig}
            />
          ) : (
            <EventBookingsTable
              events={sortedUsers}
              onSort={requestSort}
              sortConfig={sortConfig}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MyBooking;
