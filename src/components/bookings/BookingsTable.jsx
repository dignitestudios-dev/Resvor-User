/* eslint-disable react/prop-types */
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";
// import { binIcon, editIcon } from "../../assets/export";

const BookingsTable = ({ users, onSort, sortConfig }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-white rounded-xl hidden md:block overflow-x-auto overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-0">
            <tr className="bg-[#E8E8FF] text-[14.82px] text-[#202224]">
              {/* <th className="px-4 py-5 text-left text-nowrap font-[500]">#</th> */}
              <th
                onClick={() => onSort("name")}
                className="pr-4 pl-8 py-5 text-left text-nowrap font-[500] "
              >
                Lounge Name{" "}
                {sortConfig.key === "name" ? (
                  sortConfig.direction === "asc" ? (
                    <span className="cursor-pointer">↑</span>
                  ) : (
                    <span className="cursor-pointer">↓</span>
                  )
                ) : (
                  ""
                )}
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Location
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Date
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Time
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Guest Count
              </th>
              <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                Seating Area
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
            {users.map((user, index) => (
              <tr
                key={index}
                className="border-b border-[#D4D4D4] text-[14.82px] text-[#181818]"
              >
                {/* <td className="px-4 py-6">{index + 1}</td> */}
                <td className="pr-4 pl-8 py-6">
                  <div className="flex items-center gap-3">
                    {/* <div className="p-0.5 bg-linear-to-bl from-[#29ABE2] to-[#63CFAC] rounded-full">
                          <div
                            className="rounded-full bg-cover bg-center border border-white"
                            style={{
                              backgroundImage: `url(${"/images/profile.jpg"})`,
                            }}
                          />
                        </div> */}
                    {user.name}
                  </div>
                </td>
                <td className="px-4 py-6">{user.location}</td>
                <td className="px-4 py-6">{user.date}</td>
                <td className="px-4 py-6">{user.time}</td>
                <td className="px-4 py-6">{user.guestLimit}</td>

                <td className={"px-4 py-6 "}>{user.seatingArea}</td>
                <td className={"px-4 py-6 "}>{user.status}</td>

                <td className="px-4 py-6 text-nowrap underline cursor-pointer">
                  <div
                    onClick={() => navigate(`/app/bookingDetails/${index}`)}
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
        {users.map((user, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition"
          >
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">
                Lounge Name
              </span>
              <span className="text-gray-800 font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">
                Location
              </span>
              <span className="text-gray-800">{user.location}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Date</span>
              <span className="text-gray-800">{user.date}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Time</span>
              <span className="text-gray-800">{user.time}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">
                Guest Count
              </span>
              <span className="text-gray-800">{user.guestLimit}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">
                Seating Area
              </span>
              <span className="text-gray-800">{user.seatingArea}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm font-medium">Status</span>
              <span className="text-gray-800">{user.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm font-medium">Action</span>
              <div className="flex items-center gap-2">
                <div
                  onClick={() => navigate(`/app/bookingDetails/${idx}`)}
                  className="flex items-center gap-2"
                >
                  <IoIosArrowForward className="text-[#212935] text-[20px] ml-2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookingsTable;
