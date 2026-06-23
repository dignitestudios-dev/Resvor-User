/* eslint-disable react/prop-types */
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";

const statusClasses = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "upcoming") return "bg-emerald-100 text-emerald-700";
  if (s === "pending") return "bg-amber-100 text-amber-700";
  if (s === "completed") return "bg-blue-100 text-blue-700";
  if (s === "rejected" || s === "cancelled") return "bg-rose-100 text-rose-700";
  return "bg-gray-100 text-gray-600";
};

const BookingsTable = ({ users, onSort, sortConfig }) => {
  const navigate = useNavigate();

  const SortIcon = ({ col }) =>
    sortConfig.key === col ? (
      <span className="ml-1 text-[11px]">
        {sortConfig.direction === "asc" ? "↑" : "↓"}
      </span>
    ) : null;

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
            <col style={{ width: "8%" }}  /> {/* Guests */}
            <col style={{ width: "14%" }} /> {/* Seating */}
            <col style={{ width: "11%" }} /> {/* Status */}
            <col style={{ width: "7%" }}  /> {/* Action */}
          </colgroup>

          <thead className="sticky top-0 z-0">
            <tr className="bg-[#E8E8FF] text-[13px] text-[#202224]">
              <th
                onClick={() => onSort("name")}
                className="px-4 py-4 text-left font-[500] cursor-pointer select-none whitespace-nowrap"
              >
                Lounge Name <SortIcon col="name" />
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Location
              </th>
              <th
                onClick={() => onSort("date")}
                className="px-4 py-4 text-left font-[500] cursor-pointer select-none whitespace-nowrap"
              >
                Date <SortIcon col="date" />
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Time
              </th>
              <th
                onClick={() => onSort("guestLimit")}
                className="px-4 py-4 text-left font-[500] cursor-pointer select-none whitespace-nowrap"
              >
                Guests <SortIcon col="guestLimit" />
              </th>
              <th className="px-4 py-4 text-left font-[500] whitespace-nowrap">
                Seating Area
              </th>
              <th
                onClick={() => onSort("status")}
                className="px-4 py-4 text-left font-[500] cursor-pointer select-none whitespace-nowrap"
              >
                Status <SortIcon col="status" />
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
                <td className="px-4 py-4 whitespace-nowrap">{user.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-[12.5px]">
                  {user.time}
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
                    {user.status}
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
              ["Date", user.date],
              ["Time", user.time],
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
                {user.status}
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
