import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useNotifications } from "../../hooks/queries/useQueries";
import moment from "moment";

const Notifications = () => {
  const navigate = useNavigate();
  const [selectTab, setSelectTab] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: notificationsData, isLoading } = useNotifications(page, limit);
  const notifications = notificationsData?.data || [];

  const pagination = notificationsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const handleSelect = (val) => {
    setSelectTab(val);
  };

  const handleNotificationClick = (item) => {
    const resourceType =
      item?.metadata?.resourceType || item?.resourceType;
    const resource = item?.metadata?.resource || item?.resource;

    if (resourceType === "Event" && resource) {
      navigate(`/app/reservationDetails/${resource}`);
    } else if (resourceType === "Booking" && resource) {
      navigate(`/app/bookingDetails/${resource}`);
    }
  };

  // derive filtered tasks from notifications and selected tab
  const filteredTasks = notifications.filter((n) => {
    const isRead = n.isRead ?? n.read;
    if (selectTab === "all") return true;
    if (selectTab === "read") return isRead === true;
    if (selectTab === "unread") return isRead === false;
    return true;
  });

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-between w-full px-5 lg:px-40 gap-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="cursor-pointer">
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              Notifications
            </h2>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-40">
        <div
          className="mx-auto pt-6 bg-white rounded-xl -mt-[16em] mb-12"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          {/* Filter Tabs */}
          <div className="w-full border-b-2 border-gray-100 pb-2 mb-4 px-6">
            <div className="flex justify-start items-center gap-6">
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={`text-base font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                  selectTab === "all"
                    ? "text-indigo-950 border-indigo-950 font-bold"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => handleSelect("read")}
                className={`text-base font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                  selectTab === "read"
                    ? "text-indigo-950 border-indigo-950 font-bold"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
              >
                Read
              </button>
              <button
                type="button"
                onClick={() => handleSelect("unread")}
                className={`text-base font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                  selectTab === "unread"
                    ? "text-indigo-950 border-indigo-950 font-bold"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="p-6 divide-y divide-gray-100 min-h-[300px]">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="py-4 flex justify-between items-center animate-pulse">
                    <div className="space-y-2 flex-1 pr-4">
                      <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                      <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
            </div>
          ) : (
            <div>
              {filteredTasks?.length > 0 ? (
                <div className="divide-y divide-gray-100 px-6 min-h-[300px]">
                  {filteredTasks.map((item, index) => (
                    <div
                      key={item._id || index}
                      onClick={() => handleNotificationClick(item)}
                      className="flex justify-between items-start py-4 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex-1 pr-4">
                        <h2 className="text-base text-gray-900 font-semibold">
                          {item?.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {item?.description || item?.message}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0 ml-4">
                        <p className="text-xs text-gray-500 mb-1">
                          {item?.createdAt
                            ? moment(item.createdAt).format("MM-DD-YYYY hh:mm A")
                            : item?.createdAt || ""}
                        </p>
                        {!(item?.isRead ?? item?.read) && (
                          <span className="bg-indigo-950 text-white text-xs font-semibold rounded-full px-2.5 py-0.5 mt-1">
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 font-medium">
                  No record found
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredTasks.length > 0 && (
            <div className="flex items-center justify-between border-t border-[#D4D4D4] bg-white px-6 py-4 rounded-b-xl mt-4">
              <div className="text-sm text-gray-500">
                Showing page <span className="font-semibold text-gray-800">{pagination.currentPage}</span> of{" "}
                <span className="font-semibold text-gray-800">{pagination.totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
