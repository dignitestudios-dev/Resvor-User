import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { binIcon, editIcon } from "../../assets/export";
import AuthButton from "../../components/auth/AuthButton";
import { useState } from "react";
import AddGuestModal from "../../components/guestBook/AddGuestModal";
import EditGuestModal from "../../components/guestBook/EditGuestModal";
import DeleteGuestModal from "../../components/guestBook/DeleteGuestModal";

const GuestBook = () => {
  const navigate = useNavigate();
  const [addGuest, setAddGuest] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [guestToDeleteIndex, setGuestToDeleteIndex] = useState(null);
  const [users, setUsers] = useState([
    {
      name: "John Doe",
      date: "12-05-25",
      location: "Dallas, TX – 802 PainEase Plaza",
      status: "Active",
    },
    {
      name: "Jane Smith",
      date: "12-05-25",
      location: "Chicago, IL – 1204 Windy Lane",
      status: "Active",
    },
    {
      name: "Michael Johnson",
      date: "12-05-25",
      location: "San Francisco, CA – 55 Market Street",
      status: "Active",
    },
    {
      name: "Emily Davis",
      date: "12-05-25",
      location: "New York, NY – 9 Empire Blvd",
      status: "Inactive",
    },
  ]);

  const handleConfirmDelete = () => {
    if (guestToDeleteIndex !== null) {
      setUsers((prev) => prev.filter((_, i) => i !== guestToDeleteIndex));
      setGuestToDeleteIndex(null);
    }
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
            <AuthButton
              text="Add New"
              onClick={() => setAddGuest(true)}
              type="button"
            />
          </div>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div className=" mx-auto  bg-white rounded-xl -mt-[16em] border-[1px] border-[#b9b9b95f]">
          <div className="bg-white rounded-xl hidden md:block overflow-x-auto overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#E8E8FF] text-[14.82px]">
                  <th className="pl-8 pr-4 py-5 text-left text-nowrap font-[500] ">
                    Lounge Name
                  </th>
                  <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                    Location
                  </th>
                  <th className="px-4 py-5 text-left text-nowrap font-[500] ">
                    Date Joined
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
                    className="border-b border-[#D4D4D4] text-[14.82px]"
                  >
                    <td className="pl-8 pr-4 py-6">
                      <div className="flex items-center gap-3">{user.name}</div>
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
