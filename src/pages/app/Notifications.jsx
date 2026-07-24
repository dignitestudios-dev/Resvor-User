import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useNotifications } from "../../hooks/queries/useQueries";
import moment from "moment";

const Notifications = () => {
  const navigate = useNavigate();
  const [selectTab, setSelectTab] = useState("all");
  const { data: notificationsData, isLoading } = useNotifications();
  const notifications = notificationsData?.data || [];

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
          <div className="flex gap-1">
            {/* <button type="button" onClick={() => navigate(-1)}>
                  <FaArrowLeftLong color="white" size={20} />
                </button> */}
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              Notifications
            </h2>
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-40">
        <div
          className=" mx-auto pt-6 bg-white rounded-xl -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="w-full border-b-2 border-gray-100 ">
            <div className="flex justify-start items-center gap-4 mx-6 pb-2">
              <button
                onClick={() => handleSelect("all")}
                className={` ${selectTab === "all"
                  ? "text-indigo-950 font-bold"
                  : "text-gray-500"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => handleSelect("read")}
                className={` ${selectTab === "read"
                  ? "text-indigo-950 font-bold"
                  : "text-gray-500"
                  } `}
              >
                Read
              </button>
              <button
                onClick={() => handleSelect("unread")}
                className={` ${selectTab === "unread"
                  ? "text-indigo-950 font-bold"
                  : "text-gray-500"
                  } `}
              >
                Unread
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-4 h-[430px] overflow-y-auto">
              {Array(4)
                .fill()
                .map((_, index) => (
                  <div key={index}>
                    <div className="flex items-center w-[85%] py-3 border-gray-100">
                      <div className="bg-white flex p-2 max-w-[95%]">
                        <div className="py-3 px-2">
                          <div className="w-[100px] h-[20px] bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="w-[180px] h-[20px] bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-[7%] flex flex-col items-center">
                        <div className="w-[50px] h-[10px] bg-gray-200 rounded animate-pulse mb-2"></div>
                      </div>
                    </div>
                    <hr className="h-px my-2 ml-20 w-[90%] bg-gray-100 border" />
                  </div>
                ))}
            </div>
          ) : (
            <div>
              {filteredTasks?.length > 0 ? (
                <div className=" h-[430px] overflow-y-auto ">
                  {filteredTasks?.map((item, index) => (
                    <div
                      className="pl-8 cursor-pointer hover:bg-gray-50 transition-colors"
                      key={item._id || index}
                      onClick={() => handleNotificationClick(item)}
                    >
                      <div className="flex justify-between items-center py-2 w-[95%] border-gray-100">
                        <div className="bg-white flex w-[95%]">
                          {/* <div className="py-3 px-2 mt-1">
                  <img
                    src={task.image}
                    alt="profile"
                    className="w-[55px] h-[55px] rounded-full mx-2"
                  />
                </div> */}

                          <div className="py-3 px-2">
                            <h1 className="text-[16px] text-[#787F8C] font-bold">
                              {item?.title}
                            </h1>
                            <p className="text-[16px] text-[#18181880] ">
                              {item?.description}
                            </p>
                          </div>
                        </div>

                        <div className="w-[20%] flex flex-col items-center">
                          <p className="text-[14px] text-[#717171] mb-2">
                            {item?.createdAt
                              ? moment(item.createdAt).format("MM-DD-YYYY")
                              : item?.createdAt}
                          </p>
                          {/* unread indicator */}
                          {!(item?.isRead ?? item?.read) ? (
                            <span className="bg-indigo-950 rounded-full px-2 text-[14px] text-white">
                              1
                            </span>
                          ) : null}
                          {/* {unReadLoadingId === item._id ? (
                        <p className="text-xs text-gray-500">Loading...</p>
                      ) : (
                        <span className="flex items-center pt-1">
                          <p className="text-green-600 pr-1">Mark As Read</p>
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#62466b] rounded cursor-pointer"
                            onChange={() => handleMarkAsRead(item?._id)}
                          />
                        </span>
                      )} */}
                        </div>
                      </div>
                      <hr className="h-px my-2 ml-2 w-[90%] bg-gray-100 border" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[430px] flex items-center justify-center text-gray-500 font-medium">No record found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
