import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import ImageCarousel from "../../components/loungeDetail/ImageCarousal";
import { likeIcon, msgIcon } from "../../assets/export";
import { IoLocation } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import Button from "../../components/global/Button";
import { tabs } from "../../static/LoungeDetailTabs";
import { useState } from "react";
import LoungeDetailTabs from "../../components/loungeDetail/LoungeDetailTabs";
import BookingModal from "../../components/loungeDetail/BookingModal";
import BookingDetailsModal from "../../components/loungeDetail/BookingDetailsModal";
import RequestEventModal from "../../components/loungeDetail/RequestEventModal";
import EventDetailsModal from "../../components/loungeDetail/EventDetailsModal";
import AuthSuccessModal from "../../components/auth/AuthSuccessModal";
import EventAcceptedModal from "../../components/loungeDetail/EventAcceptedModal";
import EventSummaryModal from "../../components/loungeDetail/EventSummaryModal";
import EventConfirmedModal from "../../components/loungeDetail/EventConfirmedModal";

const LoungeDetail = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [isBooking, setIsBooking] = useState(false);
  const [isEventRequest, setIsEventRequest] = useState(false);
  const [isEventDetails, setIsEventDetails] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [isBookingDetails, setIsBookingDetails] = useState(false);
  const [isEventSubmit, setIsEventSubmit] = useState(false);
  const [isEventAccepted, setIsEventAccepted] = useState(false);
  const [isEventSummary, setISEventSummary] = useState(false);
  const [isEventConfirmed, setIsEventConfirmed] = useState(false);

  const [bookingData, setBookingData] = useState(null);

  const navigate = useNavigate();

  const handleEventRequestNext = (data) => {
    setEventData(data);
    setIsEventRequest(false);
    setIsEventDetails(true);
  };

  const handleEventDetailsClose = () => {
    setIsEventDetails(false);
    setEventData(null);
    setIsEventSubmit(true);
  };

  const handleBookingNext = (data) => {
    setBookingData(data);
    setIsBooking(false);
    setIsBookingDetails(true);
  };

  const handleBookingDetailsClose = () => {
    setIsBookingDetails(false);
    setBookingData(null);
  };

  const handleEventSubmit = () => {
    setIsEventSubmit(false);
    setIsEventAccepted(true);
  };

  const handleEventAccepted = () => {
    setIsEventAccepted(false);
    setISEventSummary(true);
  };

  const handleEventSummary = () => {
    setISEventSummary(false);
    setIsEventConfirmed(true);
  };

  const handleEventConfirmed = () => {
    setIsEventConfirmed(false);
    navigate("/app/home");
  };

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            Lounge Details
          </h2>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div className=" mx-auto px-6 py-10 bg-white shadow-md rounded-xl -mt-[16em]">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[400px]">
              <ImageCarousel height={"300px"} />
            </div>
            <div className="px-6 mt-10">
              <div className="flex justify-between items-center">
                <p className="text-[24px] font-[600]">Highbar Rooftop NYC</p>
                <div className="flex gap-2">
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate("/app/chat")}
                  >
                    <img src={msgIcon} alt="msg" className="w-10" />
                  </div>
                  <div className="cursor-pointer">
                    <img src={likeIcon} alt="like" className="w-10" />
                  </div>
                </div>
              </div>
              <p className="py-1">
                Tags:{" "}
                <span className="h-[28px] px-2 py-1 text-[14px] rounded-full font-medium bg-[#E6E6F0] text-[#010067] mr-1">
                  Rooftop
                </span>
                <span className="h-[28px] px-2 py-1 text-[14px] rounded-full font-medium bg-[#E6E6F0] text-[#010067]">
                  Abcd
                </span>
              </p>
              <ul className="space-y-2 list-none">
                <li className="flex items-center gap-2 text-gray-700">
                  <IoLocation className="text-xl text-[#010067]" />
                  <span>Times Square, New York, NY</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <FaClock className="text-md text-[#010067]" />
                  <span>Operating Hours: 5 PM - 2 AM</span>
                </li>
              </ul>
              <p className="text-[#010067] text-[19px] font-semibold mt-2">
                Description
              </p>
              <p className="text-[#6B6B6B] text-[15px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                adipiscing elit, sed do eiusmod tempor labore et dolore magna
                aliqua eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed adipiscing elit, sed do eiusmod tempor labore et dolore
                magna aliqua eiusmod tempor incididunt ut labore et dolore magna
                aliqua. labore et dolore Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed ad
              </p>
              <div className="flex justify-between items-center gap-2 w-[50%] py-4">
                <div className="w-full">
                  <button
                    onClick={() => setIsEventRequest(true)}
                    className="bg-[#21293514] text-[#212935] font-semibold text-[13px] rounded-[8px] w-full py-2 flex-1"
                  >
                    Request Event
                  </button>
                </div>
                <div className="w-full">
                  <Button
                    type="button"
                    text="Book Now"
                    onClick={() => setIsBooking(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#F9F9F9] rounded-[4px] mt-4">
            <LoungeDetailTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
          </div>
        </div>
        {isBooking && (
          <BookingModal
            onClose={() => setIsBooking(false)}
            onNext={handleBookingNext}
          />
        )}
        {isBookingDetails && (
          <BookingDetailsModal
            onClose={handleBookingDetailsClose}
            bookingData={bookingData}
            onNext={() => {
              setIsBookingDetails(false);
              setISEventSummary(true);
            }}
          />
        )}
        {isEventRequest && (
          <RequestEventModal
            onClose={() => setIsEventRequest(false)}
            onNext={handleEventRequestNext}
          />
        )}
        {isEventDetails && (
          <EventDetailsModal
            onClickBack={() => {
              setIsEventDetails(false);
              setIsEventRequest(true);
            }}
            onClick={() => setIsEventDetails(false)}
            onClose={handleEventDetailsClose}
            eventData={eventData}
          />
        )}
        {isEventSubmit && (
          <AuthSuccessModal
            onClick={() => {
              setIsEventSubmit(false);
              handleEventSubmit();
            }}
            title="Request submitted!"
            description="Your request has been sent to the lounge manager for review. You’ll receive a response within 24 hours."
          />
        )}
        {isEventAccepted && (
          <EventAcceptedModal
            onClose={() => setIsEventAccepted(false)}
            onClick={handleEventAccepted}
          />
        )}
        {isEventSummary && (
          <EventSummaryModal
            onClick={handleEventSummary}
            onClose={() => setISEventSummary(false)}
          />
        )}
        {isEventConfirmed && (
          <EventConfirmedModal
            onClick={handleEventConfirmed}
            onClose={() => setIsEventConfirmed}
          />
        )}
      </div>
    </>
  );
};

export default LoungeDetail;
