import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";
import { binIcon, editIcon } from "../../assets/export";
import { useState, useMemo, useEffect, useRef } from "react";
import AddGuestModal from "../../components/guestBook/AddGuestModal";
import EditGuestModal from "../../components/guestBook/EditGuestModal";
import DeleteGuestModal from "../../components/guestBook/DeleteGuestModal";
import Pagination from "../../components/global/Pagination";
import { useGuestBook } from "../../hooks/queries/useQueries";
import { useTableQuery } from "../../hooks/useTableQuery";
import { useQueryClient } from "@tanstack/react-query";

const GuestBook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addGuest, setAddGuest] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [guestToDelete, setGuestToDelete] = useState(null);

  const { query, setPage, setSearch } = useTableQuery({
    defaultValues: {
      page: 1,
      search: "",
    },
  });

  const [searchTerm, setSearchTerm] = useState(query.search || "");
  const isTypingRef = useRef(false);

  // Sync external URL changes (e.g. browser back/forward or reset)
  useEffect(() => {
    if (!isTypingRef.current) {
      setSearchTerm(query.search || "");
    }
  }, [query.search]);

  // Debounce search input (400ms) with replace to avoid cluttering browser history
  useEffect(() => {
    if (searchTerm === (query.search || "")) {
      isTypingRef.current = false;
      return;
    }

    isTypingRef.current = true;
    const timer = setTimeout(() => {
      setSearch(searchTerm, { replace: true });
      isTypingRef.current = false;
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, query.search, setSearch]);

  const limit = 5;

  const guestbookParams = useMemo(() => ({
    page: query.page,
    limit,
    ...(query.search.trim() ? { search: query.search.trim() } : {}),
  }), [query.page, limit, query.search]);

  const { data: guestbookResponse, isLoading, isFetching } = useGuestBook(guestbookParams);

  const users = useMemo(() => guestbookResponse?.data || [], [guestbookResponse?.data]);
  const pagination = guestbookResponse?.pagination || {
    currentPage: query.page,
    totalPages: 1,
    totalItems: users.length,
    itemsPerPage: limit,
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

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
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
  }, [users, sortConfig]);

  // Client-side search fallback to ensure immediate match even if backend ignores search param
  const displayUsers = useMemo(() => {
    if (!query.search?.trim()) return sortedUsers;
    const term = query.search.toLowerCase().trim();
    return sortedUsers.filter((u) => {
      const name = (u.fullName || `${u.firstName || ""} ${u.lastName || ""}`).toLowerCase();
      const email = (u.email || "").toLowerCase();
      const lounge = (u.loungeId?.name || "").toLowerCase();
      const phone = (u.phoneNumber || "").toLowerCase();
      return name.includes(term) || email.includes(term) || lounge.includes(term) || phone.includes(term);
    });
  }, [sortedUsers, query.search]);

  const handleConfirmDelete = () => {
    queryClient.invalidateQueries({ queryKey: ["guestbook"] });
    setGuestToDelete(null);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    isTypingRef.current = false;
    setSearch(searchTerm, { replace: true });
  };

  const formatGuestDate = (dateVal) => {
    if (!dateVal) return "-";
    const d = new Date(dateVal);
    if (Number.isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
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
          {/* Search Toolbar */}
          <div className="p-4 px-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md flex items-center gap-2">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by name, email, or lounge..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#010067]/20 focus:border-[#010067] transition"
                />
              </div>
              <button
                type="submit"
                className="bg-[#010067] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>
            {query.search && (
              <button
                type="button"
                onClick={() => {
                  isTypingRef.current = false;
                  setSearchTerm("");
                  setSearch("", { replace: true });
                }}
                className="text-xs text-gray-500 hover:text-gray-800 self-center font-medium cursor-pointer"
              >
                Clear Search ({query.search})
              </button>
            )}
          </div>

          {/* Desktop View */}
          <div
            className={`bg-white hidden md:block overflow-y-auto min-h-[300px] transition-opacity duration-200 ${
              isFetching ? "opacity-75" : "opacity-100"
            }`}
          >
            {isLoading && !users.length ? (
              <div className="flex justify-center items-center h-[300px] text-gray-500 text-[14.82px]">
                Loading guests...
              </div>
            ) : (
              <table className="w-full table-fixed">
                <thead className="sticky top-0 z-0">
                  <tr className="bg-[#E8E8FF] text-[14.82px]">
                    <th
                      onClick={() => requestSort("loungeId")}
                      className="w-[20%] pl-8 pr-4 py-5 text-left font-[500] cursor-pointer"
                    >
                      Lounge
                    </th>
                    <th
                      onClick={() => requestSort("fullName")}
                      className="w-[28%] px-4 py-5 text-left font-[500] cursor-pointer"
                    >
                      Full Name
                    </th>
                    <th className="w-[24%] px-4 py-5 text-left font-[500]">
                      Email
                    </th>
                    <th className="w-[16%] px-4 py-5 text-left font-[500]">
                      Created Date
                    </th>
                    <th className="w-[12%] px-4 py-5 text-left font-[500]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex justify-center items-center h-[240px] text-gray-500 text-[14.82px]">
                          {query.search ? "No matching guests found" : "Nothing here yet. Add a new guest to get started"}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayUsers.map((user) => {
                      const displayName =
                        user.fullName ||
                        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                        "Guest";

                      const photoUrl =
                        typeof user?.photo === "object" && user?.photo?.location
                          ? user.photo.location
                          : typeof user?.photo === "string"
                          ? user.photo
                          : null;

                      const initials = (
                        (user?.firstName?.[0] || "") +
                        (user?.lastName?.[0] || displayName?.[0] || "G")
                      ).toUpperCase();

                      return (
                        <tr
                          key={user._id}
                          className="border-b border-[#D4D4D4] text-[14.82px]"
                        >
                          <td className="pl-8 pr-4 py-6 font-semibold">
                            <div
                              className="truncate max-w-[180px]"
                              title={user.loungeId?.name || "N/A"}
                            >
                              {user.loungeId?.name || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex items-center gap-3 min-w-0">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt={displayName}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-[#0F2232] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                  {initials}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p
                                  className="font-semibold text-gray-900 leading-tight truncate"
                                  title={displayName}
                                >
                                  {displayName}
                                </p>
                                {user.phoneNumber && (
                                  <p className="text-xs text-gray-500 mt-1 truncate">
                                    {user.phoneNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-gray-700">
                            <div
                              className="truncate max-w-[200px]"
                              title={user.email}
                            >
                              {user.email || "-"}
                            </div>
                          </td>

                          <td className="px-4 py-6 text-gray-700">
                            {formatGuestDate(
                              user.specialDates?.length > 0
                                ? (user.specialDates[0]?.date || user.specialDates[0])
                                : user.createdAt
                            )}
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
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile View */}
          <div
            className={`space-y-4 md:hidden p-4 transition-opacity duration-200 ${
              isFetching ? "opacity-75" : "opacity-100"
            }`}
          >
            {isLoading && !users.length ? (
              <div className="text-center py-10">Loading guests...</div>
            ) : displayUsers.length === 0 ? (
              <div className="text-center py-10">
                {query.search ? "No matching guests found" : "Nothing here yet. Add a new guest to get started"}
              </div>
            ) : (
              displayUsers.map((user) => {
                const displayName =
                  user.fullName ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  "Guest";

                const photoUrl =
                  typeof user?.photo === "object" && user?.photo?.location
                    ? user.photo.location
                    : typeof user?.photo === "string"
                    ? user.photo
                    : null;

                const initials = (
                  (user?.firstName?.[0] || "") +
                  (user?.lastName?.[0] || displayName?.[0] || "G")
                ).toUpperCase();

                return (
                  <div
                    key={user._id}
                    className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition"
                  >
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#0F2232] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-gray-900 font-semibold truncate" title={displayName}>
                          {displayName}
                        </h4>
                        {user.phoneNumber && (
                          <p className="text-xs text-gray-500 truncate">{user.phoneNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500 text-sm font-medium">Lounge</span>
                      <span className="text-gray-800 font-semibold truncate max-w-[200px]">
                        {user.loungeId?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500 text-sm font-medium">Email</span>
                      <span className="text-gray-800 truncate max-w-[200px]">{user.email || "-"}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500 text-sm font-medium">Date</span>
                      <span className="text-gray-800">
                        {formatGuestDate(
                          user.specialDates?.length > 0
                            ? (user.specialDates[0]?.date || user.specialDates[0])
                            : user.createdAt
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-gray-500 text-sm font-medium">Action</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setEditGuest(user)} type="button">
                          <img src={editIcon} alt="edit" className="w-5" />
                        </button>
                        <button type="button" onClick={() => setGuestToDelete(user)}>
                          <img src={binIcon} alt="delete" className="w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls Section */}
          <Pagination
            currentPage={query.page}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.totalItems ?? users.length}
            itemsPerPage={limit}
            onPageChange={setPage}
            isLoading={isFetching}
          />
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