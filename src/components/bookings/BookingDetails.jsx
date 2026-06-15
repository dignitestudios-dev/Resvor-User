import { FaArrowLeftLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import { useAuthMe, useBookings } from "../../hooks/queries/useQueries";

export default function BookingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: authData } = useAuthMe();
  const { data: bookingsResponse, isLoading } = useBookings({ page: 1, limit: 100 });

  const booking = bookingsResponse?.data?.find((b) => b._id === id);

  const dateStr = booking?.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    : "-";

  const formatTimeStr = (isoStr) => {
    if (!isoStr) return "";
    const dateObj = new Date(isoStr);
    return dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const startTimeStr = formatTimeStr(booking?.startTime);
  const endTimeStr = formatTimeStr(booking?.endTime);
  const timeRange = startTimeStr && endTimeStr ? `${startTimeStr} - ${endTimeStr}` : "-";

  const seatingArea = booking?.tableIds?.length > 0
    ? booking.tableIds.map(t => `${t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : "Regular"} (${t.code || `T${t.tableNumber}`})`).join(", ")
    : "-";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5]">
        <p className="text-gray-500 font-semibold text-lg">Loading booking details...</p>
      </div>
    );
  }

  // If page is loaded but booking not found in active list, show a warning or fallback.
  // We can fallback to mock values to prevent a blank page.
  const nameVal = authData?.data?.name || "Mike Smith";
  const emailVal = authData?.data?.email || "designer@gmail.com";
  const phoneVal = authData?.data?.phone || authData?.data?.phoneNumber || "1 462 849 558";

  const displayedLoungeName = booking?.loungeId?.name || "Testing Lounge";
  const displayedAddress = booking?.loungeId?.location?.address || "Times Square, New York, NY";
  const displayedDate = booking ? dateStr : "26 Dec, 2024";
  const displayedTime = booking ? timeRange : "06:00pm";
  const displayedGuests = booking ? `${booking.guestCount} Guests` : "6 Guests";
  const displayedTable = booking ? seatingArea : "Table No 15";
  const displayedSpecialRequest = booking ? booking.specialRequest : "The standard Lorem Ipsum passage, m ipsum dolor sit amet, cectetur adipiscing elit, sed do eiusmod.";

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-start w-full px-5 lg:px-40 gap-3">
          <div className="flex gap-1">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              Booking Details
            </h2>
          </div>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div
          className=" mx-auto p-4 bg-white rounded-[16px] -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="p-4 bg-[#F5F5F5] rounded-xl">
            {/* Header */}
            <h2 className="text-[24px] font-semibold text-gray-800 mb-4">
              Reservation Details
            </h2>

            <div className="bg-[#FFFFFF] rounded-[24px] p-5">
              {/* Top Section */}
              <div className="flex flex-col md:flex-row gap-8  pb-5">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60%22"
                  alt="Venue"
                  className="rounded-xl w-[368px] h-[212px] object-cover"
                />

                <div className="flex-1 mt-[38px]">
                  <h3 className="text-[24px] font-semibold text-[#000000]">
                    {displayedLoungeName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-[#E6E6F0] text-[#010067] rounded-full text-sm ">
                      Rooftop
                    </span>
                    <span className="px-3 py-1 bg-[#E6E6F0] text-[#010067] rounded-full text-sm ">
                      R&B
                    </span>
                    <span className="px-3 py-1 bg-[#E6E6F0] text-[#010067] rounded-full text-sm ">
                      Bottle Service
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <IoLocation className="text-xl text-[#010067]" />
                    <p className="text-[#505050] text-[16px] font-[500] ">
                      {displayedAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservation Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-5 text-sm">
                <div className="space-y-6">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Check-in Date
                  </p>
                  <p className="text-[#000000] text-[16px]">{displayedDate}</p>
                </div>
                <div className="space-y-6">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Check-in Time
                  </p>
                  <p className="text-[#000000] text-[16px]">{displayedTime}</p>
                </div>
                <div className="space-y-6">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Guest Count
                  </p>
                  <p className="text-[#000000] text-[16px]">{displayedGuests}</p>
                </div>
                <div className="space-y-6">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Children (If Any)
                  </p>
                  <p className="text-[#000000] text-[16px]">None</p>
                </div>
                <div className="space-y-6">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Table
                  </p>
                  <p className="text-[#000000] text-[16px]">{displayedTable}</p>
                </div>
              </div>

              {/* Packages and Seating */}
              <div className="flex flex-col md:flex-row justify-between mt-6 border-t-2 border-[#0000001A] pt-4 text-sm">
                <div className="flex-1 py-2">
                  <p className="font-semibold text-[18px] text-[#252525] mb-1 py-2">
                    Services and Packages
                  </p>
                  <div className="flex gap-8 mt-2">
                    <p className="h-10 pt-2 text-[#000000] text-[16px] font-[500]">
                      Food and Drink Package
                    </p>
                    <p className="h-10 pt-2 text-[#000000] text-[16px] font-[500] border-l-2 border-l-[#0000002d] pl-6">
                      Bottle Package
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 border-t-2 border-[#0000001A] pt-4 text-sm">
                <p className="font-semibold text-[18px] text-[#252525] mb-2 py-2">
                  Any Instructions{" "}
                  <span className="text-gray-400 font-[400]">(Optional)</span>
                </p>
                <p className="text-[#000000] text-[16px] font-[500] ">
                  {displayedSpecialRequest}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-4">
              <h2 className="text-[24px] font-semibold text-[#252525] mb-4">
                User Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm bg-[#FFFFFF] rounded-[16px] px-6 pt-6 pb-4">
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Name
                  </p>
                  <p className="text-[#000000] text-[16px]">{nameVal}</p>
                </div>
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Email Address
                  </p>
                  <p className="text-[#000000] text-[16px] break-all">{emailVal}</p>
                </div>
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Phone Number
                  </p>
                  <p className="text-[#000000] text-[16px]">{phoneVal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
