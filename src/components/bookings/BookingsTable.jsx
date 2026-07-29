/* eslint-disable react/prop-types */
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";

const formatLabel = (value) =>
  String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

const statusClasses = (status) => {
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

const formatDate = (value) => {
  if (!value || value === "-") return "-";
  if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTime = (value) => {
  if (!value || value === "-") return "-";
  let str = String(value);
  if (typeof value === "string" && (value.includes("T") || value.includes("Z"))) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      str = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  }
  return str.replace(/(\d)\s*(AM|PM)/gi, "$1 $2").replace(/\u202f/g, " ");
};

const BookingsTable = ({ users }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Desktop table ── */}
      <div className="bg-white rounded-xl hidden md:block overflow-x-auto">
        <table className="w-full table-fixed text-[13.5px]">
          <colgroup>
            <col style={{ width: "18%" }} /> {/* Lounge Name */}
            <col style={{ width: "17%" }} /> {/* Location */}
            <col style={{ width: "11%" }} /> {/* Date */}
            <col style={{ width: "14%" }} /> {/* Time */}
            <col style={{ width: "8%" }} /> {/* Guests */}
            <col style={{ width: "14%" }} /> {/* Seating */}
            <col style={{ width: "11%" }} /> {/* Status */}
            <col style={{ width: "7%" }} /> {/* Action */}
          </colgroup>

          <thead className="sticky top-0 z-0">
            <tr className="bg-[#E8E8FF] text-[13px] text-[#202224]">
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Lounge Name
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Location
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Time
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Guests
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Seating Area
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-20 text-[#727272] text-[15px] font-medium"
                >
                  No records found.
                </td>
              </tr>
            )}
            {users.map((user, index) => (
              <tr
                key={user._id || index}
                className="border-b border-[#D4D4D4] hover:bg-gray-50 transition text-[#181818]"
              >
                <td className="px-4 py-4 truncate max-w-0">
                  <span title={user.name}>{user.name}</span>
                </td>
                <td className="px-4 py-4 truncate max-w-0">
                  <span title={user.location}>{user.location}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{formatDate(user.date)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-[12.5px]">
                  {formatTime(user.time)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  {user.guestLimit}
                </td>
                <td className="px-4 py-4 truncate max-w-0">
                  <span title={user.seatingArea}>{user.seatingArea}</span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusClasses(
                      user.status
                    )}`}
                  >
                    {formatLabel(user.status)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/app/bookingDetails/${user._id || index}`)
                    }
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
                    title="View details"
                  >
                    <IoIosArrowForward className="text-[#212935] text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="space-y-4 md:hidden p-4">
        {users.map((user, idx) => (
          <div
            key={user._id || idx}
            className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition"
          >
            {[
              ["Lounge Name", user.name],
              ["Location", user.location],
              ["Date", formatDate(user.date)],
              ["Time", formatTime(user.time)],
              ["Guests", user.guestLimit],
              ["Seating Area", user.seatingArea],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm font-medium">
                  {label}
                </span>
                <span className="text-gray-800 text-right max-w-[55%] truncate">
                  {val}
                </span>
              </div>
            ))}
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Status</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusClasses(
                  user.status
                )}`}
              >
                {formatLabel(user.status)}
              </span>
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() =>
                  navigate(`/app/bookingDetails/${user._id || idx}`)
                }
                className="flex items-center gap-1 text-[#212935] text-sm font-medium"
              >
                View Details
                <IoIosArrowForward className="text-[18px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookingsTable;
