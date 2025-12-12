import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const Notifications = () => {
  const [selectTab, setSelectTab] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Task Assigned",
      description:
        "Lorem ipsum dolor sit amet consectetur. In volutpat et mattis ut tristique viverra blandit.",
      createdAt: "12-03-2025",
      read: false,
    },
    {
      id: 2,
      title: "Shift Approved",
      description:
        "Your requested shift change has been approved by the manager.",
      createdAt: "11-20-2025",
      read: true,
    },
    {
      id: 3,
      title: "New Message from Manager",
      description: "Please check the updated schedule for next week.",
      createdAt: "11-18-2025",
      read: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (val) => {
    setSelectTab(val);
  };
  // derive filtered tasks from notifications and selected tab
  const filteredTasks = notifications.filter((n) => {
    if (selectTab === "all") return true;
    if (selectTab === "read") return n.read === true;
    if (selectTab === "unread") return n.read === false;
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
                className={` ${
                  selectTab === "all"
                    ? "text-indigo-950 font-bold"
                    : "text-gray-500"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleSelect("read")}
                className={` ${
                  selectTab === "read"
                    ? "text-indigo-950 font-bold"
                    : "text-gray-500"
                } `}
              >
                Read
              </button>
              <button
                onClick={() => handleSelect("unread")}
                className={` ${
                  selectTab === "unread"
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
                    <div className="pl-8" key={index}>
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
                            {item?.createdAt}
                          </p>
                          {/* unread indicator */}
                          {!item?.read ? (
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
                <div className="h-[430px]">No record found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
