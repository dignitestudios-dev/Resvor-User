import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { binIcon, editIcon } from "../../assets/export";
import { useState } from "react";
import AddGuestModal from "../../components/guestBook/AddGuestModal";
import EditGuestModal from "../../components/guestBook/EditGuestModal";
import DeleteGuestModal from "../../components/guestBook/DeleteGuestModal";
import { useGuestBook } from "../../hooks/queries/useQueries";
import { useQueryClient } from "@tanstack/react-query";

const GuestBook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addGuest, setAddGuest] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [guestToDelete, setGuestToDelete] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 5;

  // Pass currentPage to your hook so TanStack Query refetches when the page updates
  const { data: guestbookResponse, isLoading } = useGuestBook(currentPage, limit);

  const users = guestbookResponse?.data || [];
  const pagination = guestbookResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  };

  const [sortConfig, setSortConfig] = useState({
    key: "fullName",
    direction: "asc",
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valA = a[sortConfig.key] || "";
    let valB = b[sortConfig.key] || "";

    if (sortConfig.key === "loungeId") {
      valA = a.loungeId?.name || "";
      valB = b.loungeId?.name || "";
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleConfirmDelete = () => {
    queryClient.invalidateQueries({ queryKey: ["guestbook"] });
    setGuestToDelete(null);
  };

  // Pagination Change Handlers
  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
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

      <div className="px-5 lg:px-40 pb-10">
        <div className="mx-auto bg-white rounded-xl -mt-[16em] border-[1px] border-[#b9b9b95f] overflow-hidden">
          {/* Desktop View */}
          <div className="bg-white hidden md:block overflow-y-auto min-h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px] text-gray-500 text-[14.82px]">
                Loading guests...
              </div>
            ) : (
              <table className="w-full table-fixed">
                <thead className="sticky top-0 z-0">
                  <tr className="bg-[#E8E8FF] text-[14.82px]">
                    <th
                      onClick={() => requestSort("loungeId")}
                      className="w-1/5 pl-8 pr-4 py-5 text-left font-[500] cursor-pointer break-words"
                    >
                      Lounge
                    </th>
                    <th
                      onClick={() => requestSort("fullName")}
                      className="w-1/5 px-4 py-5 text-left font-[500] cursor-pointer break-words"
                    >
                      Full Name
                    </th>
                    <th className="w-1/5 px-4 py-5 text-left font-[500] break-words">
                      Email
                    </th>
                    <th className="w-1/5 px-4 py-5 text-left font-[500] break-words">
                      Created Date
                    </th>
                    <th className="w-1/5 px-4 py-5 text-left font-[500] break-words">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex justify-center items-center h-[240px] text-gray-500 text-[14.82px]">
                          Nothing here yet. Add a new guest to get started
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-[#D4D4D4] text-[14.82px]"
                      >
                        <td className="pl-8 pr-4 py-6 font-semibold break-words">
                          {user.loungeId?.name || "N/A"}
                        </td>
                        <td className="px-4 py-6 break-words">{user.fullName}</td>
                        <td className="px-4 py-6 break-all">{user.email}</td>

                        <td className="px-4 py-6 break-words">
                          {user.specialDates?.length > 0
                            ? user.specialDates[0]
                            : new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-6 text-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditGuest(user)}
                              type="button"
                            >
                              <img
                                src={editIcon}
                                alt="edit"
                                className="w-5 hover:bg-slate-50 hover:p-[1px] hover:rounded-full"
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => setGuestToDelete(user)}
                            >
                              <img
                                src={binIcon}
                                alt="delete"
                                className="w-5 hover:bg-slate-50 hover:p-[1px] hover:rounded-full"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile View */}
          <div className="space-y-4 md:hidden p-4">
            {isLoading ? (
              <div className="text-center py-10">Loading guests...</div>
            ) : sortedUsers.length === 0 ? (
              <div className="text-center py-10">Nothing here yet. Add a new guest to get started</div>
            ) : (
              sortedUsers.map((user) => (
                <div
                  key={user._id}
                  className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">Lounge</span>
                    <span className="text-gray-800 font-semibold">
                      {user.loungeId?.name || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">Full Name</span>
                    <span className="text-gray-800">{user.fullName}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">Email</span>
                    <span className="text-gray-800">{user.email}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500 text-sm font-medium">Date</span>
                    <span className="text-gray-800">
                      {user.specialDates?.length > 0
                        ? user.specialDates[0]
                        : new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm font-medium">Action</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditGuest(user)} type="button">
                        <img src={editIcon} alt="edit" className="w-5" />
                      </button>
                      <button type="button" onClick={() => setGuestToDelete(user)}>
                        <img src={binIcon} alt="delete" className="w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls Section */}
          {!isLoading && sortedUsers.length > 0 && (
            <div className="flex items-center justify-between border-t border-[#D4D4D4] bg-white px-6 py-4">
              <div className="text-sm text-gray-500">
                Showing page <span className="font-semibold text-gray-800">{pagination.currentPage}</span> of{" "}
                <span className="font-semibold text-gray-800">{pagination.totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {addGuest && <AddGuestModal onClose={() => setAddGuest(false)} />}

        {editGuest && (
          <EditGuestModal guestData={editGuest} onClose={() => setEditGuest(null)} />
        )}

        {guestToDelete && (
          <DeleteGuestModal
            guest={guestToDelete}
            onClose={() => setGuestToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </>
  );
};

export default GuestBook;