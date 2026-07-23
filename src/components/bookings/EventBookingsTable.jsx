/* eslint-disable react/prop-types */
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";

const formatDate = (value) => {
  if (!value || value === "-") return "-";
  if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
};

const formatTime = (value) => {
  if (!value || value === "-") return "-";
  if (typeof value === "string" && (value.includes("AM") || value.includes("PM"))) return value;
  if (typeof value === "string" && (value.includes("T") || value.includes("Z"))) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });
    }
  }
  return String(value);
};

const EventBookingsTable = ({ events, onSort, sortConfig }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-xl hidden md:block overflow-x-auto overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-0">
            <tr className="bg-[#E8E8FF] text-[14.82px] text-[#202224]">
              <th
                onClick={() => onSort("name")}
                className="pr-4 pl-6 py-5 text-left text-nowrap font-[500] "
              >
                Event Name{" "}
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Venue
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Event Date
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Event Time
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Guest Count
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Event Type
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Budget
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Status
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="mt-10">
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-20 text-[#727272] text-[15px] font-medium"
                >
                  No records found.
                </td>
              </tr>
            )}
            {events.map((event, index) => (
              <tr
                key={event._id || index}
                className="border-b border-[#D4D4D4] text-[14.82px] text-[#181818]"
              >
                <td className="pr-4 pl-6 py-6">
                  <div className="flex items-center gap-3">{event.name}</div>
                </td>
                <td className="px-4 py-6">{event.location}</td>
                <td className="px-4 py-6">{formatDate(event.date)}</td>
                <td className="px-4 py-6">{formatTime(event.time)}</td>
                <td className="px-4 py-6">{event.guestLimit}</td>
                <td className="px-4 py-6">{event.eventType}</td>
                <td className="px-4 py-6">{event.budget}</td>
                <td className="px-4 py-6">{event.status}</td>
                <td className="px-4 py-6 text-nowrap underline cursor-pointer">
                  <div
                    onClick={() =>
                      navigate(`/app/reservationDetails/${event._id || index}`)
                    }
                    className="flex items-center gap-2"
                  >
                    <IoIosArrowForward className="text-[#212935] text-[20px] ml-2" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {events.length === 0 ? (
          <div className="text-center py-10 text-[#727272] text-[15px] font-medium">
            No records found.
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={event._id || index}
              className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition"
            >
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">
                  Event Name
                </span>
                <span className="text-gray-800 font-semibold">{event.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Venue</span>
                <span className="text-gray-800">{event.location}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Date</span>
                <span className="text-gray-800">{formatDate(event.date)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Time</span>
                <span className="text-gray-800">{formatTime(event.time)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">
                  Guest Count
                </span>
                <span className="text-gray-800">{event.guestLimit}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">
                  Event Type
                </span>
                <span className="text-gray-800">{event.eventType}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Budget</span>
                <span className="text-gray-800">{event.budget}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">Status</span>
                <span className="text-gray-800">{event.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-medium">Action</span>
                <div className="flex items-center gap-2">
                  <div
                    onClick={() =>
                      navigate(`/app/reservationDetails/${event._id || index}`)
                    }
                    className="flex items-center gap-2"
                  >
                    <IoIosArrowForward className="text-[#212935] text-[20px] ml-2" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default EventBookingsTable;
