import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useState } from "react";
import BookingsTable from "../../components/bookings/BookingsTable";
import EventBookingsTable from "../../components/bookings/EventBookingsTable";

const MyBooking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const users = [
    {
      name: "John Doe",
      date: "12-05-25",
      time: "08:00 09:00",
      guestLimit: "04",
      seatingArea: "Rooftop",
      location: "Dallas, TX – 802 PainEase Plaza",
      status: "Active",
      eventType: "Birthday Party",
    },
    {
      name: "Jane Smith",
      date: "12-05-25",
      time: "08:00 09:00",
      guestLimit: "04",
      seatingArea: "Rooftop",
      location: "Chicago, IL – 1204 Windy Lane",
      status: "Active",
      eventType: "Birthday Party",
    },
    {
      name: "Michael Johnson",
      date: "12-05-25",
      time: "08:00 09:00",
      guestLimit: "04",
      seatingArea: "Rooftop",
      location: "San Francisco, CA – 55 Market Street",
      status: "Active",
      eventType: "Birthday Party",
    },
    {
      name: "Emily Davis",
      date: "12-05-25",
      time: "08:00 09:00",
      guestLimit: "04",
      seatingArea: "Rooftop",
      location: "New York, NY – 9 Empire Blvd",
      status: "Inactive",
      eventType: "Birthday Party",
    },
  ];

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-between w-full px-5 lg:px-40 gap-3">
          <div className="flex gap-1">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              My Bookings
            </h2>
          </div>
          <div className="w-[280px] flex ">
            <button
              className={`text-[12px] py-3 px-6 rounded-l-2xl w-full ${
                activeTab === "bookings"
                  ? " bg-[#FFFFFF] text-[#222246]"
                  : " bg-[#222246] text-white"
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              Bookings
            </button>

            <button
              className={`text-[12px] px-6 rounded-r-2xl w-full ${
                activeTab === "events"
                  ? "bg-[#FFFFFF] text-[#222246]"
                  : "bg-[#222246] text-white"
              }`}
              onClick={() => setActiveTab("events")}
            >
              Event Bookings
            </button>
          </div>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div
          className=" mx-auto bg-white rounded-xl -mt-[16em] border-[1px] border-[#b9b9b95f]"
          // style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          {activeTab === "bookings" ? (
            <BookingsTable users={users} />
          ) : (
            <EventBookingsTable events={users} />
          )}
        </div>
      </div>
    </>
  );
};

export default MyBooking;
