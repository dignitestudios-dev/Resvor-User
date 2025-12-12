import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { binIcon, editIcon } from "../../assets/export";
import { useState } from "react";
import AddGuestModal from "../../components/guestBook/AddGuestModal";
import EditGuestModal from "../../components/guestBook/EditGuestModal";
import DeleteGuestModal from "../../components/guestBook/DeleteGuestModal";

const GuestBook = () => {
  const navigate = useNavigate();
  const [addGuest, setAddGuest] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [guestToDeleteIndex, setGuestToDeleteIndex] = useState(null);
  const [users, setUsers] = useState([
    {
      name: "John Doe",
      date: "12-05-25",
      location: "Steve",
      status: "Active",
    },
    {
      name: "Jane Smith",
      date: "12-05-25",
      location: "Michael",
      status: "Active",
    },
    {
      name: "Michael Johnson",
      date: "12-05-25",
      location: "John",
      status: "Active",
    },
    {
      name: "Emily Davis",
      date: "12-05-25",
      location: "Michael",
      status: "Inactive",
    },
  ]);

  const handleConfirmDelete = () => {
    if (guestToDeleteIndex !== null) {
      setUsers((prev) => prev.filter((_, i) => i !== guestToDeleteIndex));
      setGuestToDeleteIndex(null);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
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
        <div className="flex items-center justify-between w-full px-5 lg:px-40 gap-3">
          <div className="flex gap-1">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              Guestbook
            </h2>
          </div>
          <div className="w-[140px]">
            <button
              type="button"
              onClick={() => setAddGuest(true)}
              className="w-full py-3 bg-[#F4F4FF] text-black text-sm font-[700] rounded-[12px] hover:opacity-90 transition"
            >
              <div className="flex justify-center items-center">
                <span className="mr-1">Add New</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div className=" mx-auto bg-white rounded-xl -mt-[16em] border-[1px] border-[#b9b9b95f]">
          <div className="bg-white rounded-xl hidden md:block overflow-x-auto overflow-y-auto min-h-[300px]">
            {users.length === 0 ? (
              <div className="flex justify-center items-center h-[300px] text-gray-500 text-[14.82px]">
                No record found
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 z-0">
                  <tr className="bg-[#E8E8FF] text-[14.82px]">
                    <th
                      onClick={() => requestSort("name")}
                      className="pl-8 pr-4 py-5 text-left text-nowrap font-[500] "
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
                      Full Name
                    </th>
                    <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                      Special Date
                    </th>
                    <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="mt-10">
                  {sortedUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#D4D4D4] text-[14.82px]"
                    >
                      <td className="pl-8 pr-4 py-6">
                        <div className="flex items-center gap-3">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-4 py-6">{user.location}</td>
                      <td className={"px-4 py-6 "}>{user.date}</td>
                      <td className="px-4 py-6 text-nowrap underline cursor-pointer">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditGuest(user)}
                            type="button"
                            className="cursor-pointer"
                          >
                            <img
                              src={editIcon}
                              alt="edit"
                              className="w-5 hover:bg-slate-50 hover:p-[1px] hover:rounded-full"
                            />
                          </button>
                          <button onClick={() => setGuestToDeleteIndex(index)}>
                            <img
                              src={binIcon}
                              alt="delete"
                              className="w-5 hover:bg-slate-50 hover:p-[1px] hover:rounded-full"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="space-y-4 md:hidden">
            {users.map((user, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition "
              >
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm font-medium">
                    Lounge Name
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {user.name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm font-medium">
                    Location
                  </span>
                  <span className="text-gray-800">{user.location}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm font-medium">
                    Date Joined
                  </span>
                  <span className="text-gray-800">{user.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm font-medium">
                    Action
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditGuest(user)}
                      type="button"
                      className="cursor-pointer"
                    >
                      <img
                        src={editIcon}
                        alt="edit"
                        className="w-5 hover:bg-slate-50 hover:p-[1px] hover:rounded-full"
                      />
                    </button>
                    <button onClick={() => setGuestToDeleteIndex(idx)}>
                      <img
                        src={binIcon}
                        alt="delete"
                        className="w-5 hover:bg-slate-50 hover:p-[1px] hover:rounded-full"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {addGuest && <AddGuestModal onClose={() => setAddGuest(false)} />}
        {editGuest && (
          <EditGuestModal
            guestData={editGuest}
            onClose={() => setEditGuest(null)}
          />
        )}

        {guestToDeleteIndex !== null && (
          <DeleteGuestModal
            onClose={() => setGuestToDeleteIndex(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </>
  );
};

export default GuestBook;
