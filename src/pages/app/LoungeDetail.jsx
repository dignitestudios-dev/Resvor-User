import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import ImageCarousel from "../../components/loungeDetail/ImageCarousal";
import { likedIcon, likeIcon, msgIcon } from "../../assets/export";
import { IoLocation } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import Button from "../../components/global/Button";
import { useEffect, useState } from "react";
import LoungeDetailTabs, { getLoungeTabs } from "../../components/loungeDetail/LoungeDetailTabs";
import BookingModal from "../../components/loungeDetail/BookingModal";
import BookingDetailsModal from "../../components/loungeDetail/BookingDetailsModal";
import RequestEventModal from "../../components/loungeDetail/RequestEventModal";
import EventDetailsModal from "../../components/loungeDetail/EventDetailsModal";
import AuthSuccessModal from "../../components/auth/AuthSuccessModal";
import EventAcceptedModal from "../../components/loungeDetail/EventAcceptedModal";
import EventSummaryModal from "../../components/loungeDetail/EventSummaryModal";
import EventConfirmedModal from "../../components/loungeDetail/EventConfirmedModal";
import EventServiceModal from "../../components/loungeDetail/EventServiceModal";
import BookingServiceModal from "../../components/loungeDetail/BookingServiceModal";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import {
  useFavorites,
  useLoungeDetails,
  useToggleFavorite,
  useInitiateChat,
} from "../../hooks/queries/useQueries";

const LoungeDetail = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [isBooking, setIsBooking] = useState(false);
  const [isEventRequest, setIsEventRequest] = useState(false);
  const [isEventServices, setIsEventServices] = useState(false);

  const [isEventDetails, setIsEventDetails] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [eventServices, setEventServices] = useState(null);
  const [isBookingServices, setIsBookingServices] = useState(false);

  const [isBookingDetails, setIsBookingDetails] = useState(false);
  const [bookingServiceData, setBookingServiceData] = useState(null);
  const [isEventSubmit, setIsEventSubmit] = useState(false);
  const [isEventAccepted, setIsEventAccepted] = useState(false);
  const [isEventSummary, setISEventSummary] = useState(false);
  const [isEventConfirmed, setIsEventConfirmed] = useState(false);
  const [liked, setLiked] = useState(false);

  const [bookingData, setBookingData] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: loungeResponse,
    isLoading,
  } = useLoungeDetails(id);
  const { data: favoritesResponse } = useFavorites({
    enabled: !!id,
  });
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavorite();
  const { mutate: initiateChat, isPending: isInitiatingChat } =
    useInitiateChat();

  const lounge = loungeResponse?.data;

  useEffect(() => {
    const isFavoriteFromServer = Boolean(
      lounge?.isFavorite ||
      favoritesResponse?.data?.some((favorite) => favorite._id === lounge?._id)
    );

    setLiked(isFavoriteFromServer);
  }, [favoritesResponse?.data, lounge?.isFavorite, lounge?._id]);

  const handleEventRequestNext = (data) => {
    setEventData(data);
    setIsEventRequest(false);
    setIsEventServices(true);
    setIsEventDetails(false);
  };

  const handleServiceRequestNext = (data) => {
    setEventServices(data);
    setIsEventServices(false);
    setIsEventDetails(true);
  };

  const handleEventDetailsClose = () => {
    setIsEventDetails(false);
    setIsEventSubmit(true);
  };

  const handleChatClick = () => {
    if (!id || isInitiatingChat) return;
    initiateChat(
      { loungeId: id },
      {
        onSuccess: (response) => {
          const chat = response?.data;
          navigate("/app/chat", { state: { chatId: chat?._id, chat } });
        },
        onError: () => {
          // fallback: still navigate to chat list
          navigate("/app/chat");
        },
      }
    );
  };

  const handleFavoriteClick = () => {
    if (!lounge?._id || isTogglingFavorite) return;

    const nextValue = !liked;
    setLiked(nextValue);

    toggleFavorite(lounge._id, {
      onSuccess: (response) => {
        SuccessToast(
          response?.message ||
          (nextValue
            ? "Lounge added to favorites."
            : "Lounge removed from favorites.")
        );
      },
      onError: (requestError) => {
        setLiked(!nextValue);
        ErrorToast(
          requestError?.response?.data?.message ||
          "Unable to update favorite lounge."
        );
      },
    });
  };

  const normalizeEventType = (value) => {
    const normalized = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    const aliasMap = {
      birthday_party: "birthday",
      birthday: "birthday",
      wedding: "wedding",
      engagement: "engagement",
      ceremony: "ceremony",
      meeting: "meeting",
      private_party: "private_party",
      "private party": "private_party",
      maintenance: "maintenance",
      closed: "closed",
      other: "other",
    };

    return aliasMap[normalized] || normalized;
  };

  const handleBookingNext = (data) => {
    setBookingData(data);
    setIsBooking(false);
    setIsBookingServices(true);
  };

  const handleBookingServiceNext = (data) => {
    setIsBookingDetails(true);
    setIsBookingServices(false);
    setBookingServiceData(data);
  };

  const handleBookingDetailsClose = () => {
    setIsBookingDetails(false);
    setBookingData(null);
    setBookingServiceData(null);
  };

  const handleBookingConfirmed = () => {
    setIsBookingDetails(false);
    setBookingData(null);
    setBookingServiceData(null);
    navigate("/app/bookings");
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
    navigate("/app/bookings");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Generate the tabs array structure properly using fetched data hook reference
  const currentTabsConfig = getLoungeTabs(lounge);

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
        <div className="mx-auto px-6 py-10 bg-white shadow-md rounded-xl -mt-[16em]">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[400px]">
              <ImageCarousel
                images={lounge?.images || []}
                height={"300px"}
              />
            </div>

            <div className="px-6 mt-10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[24px] font-[600] flex-1 min-w-0 truncate">
                  {lounge?.name || "-"}
                </p>

                <div className="flex gap-2 shrink-0">
                  <div
                    className={`cursor-pointer flex items-center justify-center ${isInitiatingChat ? "opacity-60 pointer-events-none" : ""
                      }`}
                    onClick={handleChatClick}
                  >
                    {isInitiatingChat ? (
                      <div className="w-10 h-10 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-[#010067] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <img src={msgIcon} alt="msg" className="w-10 h-10" />
                    )}
                  </div>

                  <div
                    onClick={handleFavoriteClick}
                    className={`cursor-pointer ${isTogglingFavorite ? "opacity-70 pointer-events-none" : ""}`}
                  >
                    <img
                      src={liked ? likedIcon : likeIcon}
                      alt="like"
                      className="w-10 h-10"
                    />
                  </div>
                </div>

              </div>

              <p className="py-1 flex items-center gap-2 flex-wrap">
                Tags:
                {lounge?.tags?.length ? (
                  lounge.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="h-[28px] px-2 py-1 text-[14px] rounded-full font-medium bg-[#E6E6F0] text-[#010067]"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span>-</span>
                )}
              </p>

              <ul className="space-y-2 list-none">
                <li className="flex items-center gap-2 text-gray-700">
                  <IoLocation className="text-xl text-[#010067]" />
                  <span>{lounge?.location?.address || "-"}</span>
                </li>

                <li className="flex items-center gap-2 text-gray-700">
                  <FaClock className="text-md text-[#010067]" />
                  <span>
                    Operating Hours:{" "}
                    {lounge?.operatingHours?.open || "-"} -{" "}
                    {lounge?.operatingHours?.close || "-"}
                  </span>
                </li>
              </ul>

              {/* <p className="text-[#010067] text-[19px] font-semibold mt-2">
                Description
              </p>

              <p className="text-[#6B6B6B] text-[15px]">
                {lounge?.description || "-"}
              </p> */}

              <div className="flex justify-between items-center gap-2 w-[50%] py-4">
                <div className="w-full">
                  <button
                    onClick={() => {
                      setEventData(null);
                      setEventServices(null);
                      setIsEventRequest(true);
                    }}
                    className="bg-[#21293514] text-[#212935] font-semibold text-[13px] rounded-lg w-full py-2.5 flex-1"
                  >
                    Request Event
                  </button>
                </div>

                <div className="w-full">
                  <Button
                    type="button"
                    text="Book Now"
                    onClick={() => {
                      setBookingData(null);
                      setBookingServiceData(null);
                      setIsBooking(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F9F9F9] rounded-[4px] mt-4">
            <LoungeDetailTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={currentTabsConfig}
            />
          </div>
        </div>

        {isBooking && (
          <BookingModal
            loungeId={id}
            operatingHours={lounge?.operatingHours}
            onClose={() => setIsBooking(false)}
            onNext={handleBookingNext}
            bookingData={bookingData}
          />
        )}

        {isBookingServices && (
          <BookingServiceModal
            loungeId={id}
            bookingData={bookingData}
            bookingServiceData={bookingServiceData}
            loungeServices={lounge?.services || []}
            floorPlan={lounge?.floorPlan}
            onClose={() => setIsBookingServices(false)}
            onNext={handleBookingServiceNext}
            onClickBack={() => {
              setIsBookingServices(false);
              setIsBooking(true);
            }}
          />
        )}

        {isBookingDetails && (
          <BookingDetailsModal
            onClose={handleBookingDetailsClose}
            bookingData={bookingData}
            bookingServiceData={bookingServiceData}
            onNext={handleBookingConfirmed}
            onClickBack={() => {
              setIsBookingDetails(false);
              setIsBookingServices(true);
            }}
          />
        )}

        {isEventRequest && (
          <RequestEventModal
            onClose={() => setIsEventRequest(false)}
            onNext={handleEventRequestNext}
            operatingHours={lounge?.operatingHours}
            eventData={eventData}
          />
        )}

        {isEventServices && (
          <EventServiceModal
            loungeServices={lounge?.services || []}
            eventServices={eventServices}
            onClose={() => setIsEventServices(false)}
            onNext={handleServiceRequestNext}
            onClickBack={() => {
              setIsEventServices(false);
              setIsEventRequest(true);
            }}
          />
        )}

        {isEventDetails && (
          <EventDetailsModal
            onClickBack={() => {
              setIsEventDetails(false);
              setIsEventServices(true);
            }}
            onClick={handleEventDetailsClose}
            onClose={() => setIsEventDetails(false)}
            eventData={eventData}
            serviceData={eventServices}
          />
        )}

        {/* {isEventSubmit && (
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
        )} */}

        {isEventSubmit && (
          <EventSummaryModal
            apiPayload={
              {
                loungeId: id,
                title: eventData?.title || eventData?.eventName || "",
                eventType: normalizeEventType(eventData?.eventType),
                guestCount: Number(eventData?.guestCount),
                budget: Number(eventData?.budget),
                preferredMusic: eventData?.preferredMusic,
                specialRequest:
                  eventData?.specialRequest ||
                  eventServices?.instruction ||
                  "",
                startDateTime:
                  typeof eventData?.startDateTime === "string"
                    ? eventData.startDateTime
                    : eventData?.startDateTime?.toISOString?.() || "",
                endDateTime:
                  typeof eventData?.endDateTime === "string"
                    ? eventData.endDateTime
                    : eventData?.endDateTime?.toISOString?.() || "",
                ticketAtDoor: eventData?.ticketAtDoor,
                servicePackageIds: (eventServices?.selectedPackage || []).map(
                  (pkg) => pkg.id || pkg._id
                ),
              }}
            services={eventServices}
            onClick={handleEventSummary}
            onClose={() => setISEventSummary(false)}
          />
        )}

        {isEventConfirmed && (
          <EventConfirmedModal
            onClick={handleEventConfirmed}
            onClose={() => setIsEventConfirmed(false)}
          />
        )}
      </div>
    </>
  );
};

export default LoungeDetail;
