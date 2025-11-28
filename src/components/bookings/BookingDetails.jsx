import { FaArrowLeftLong } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { useNavigate } from "react-router";

export default function BookingDetails() {
  const navigate = useNavigate();
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
                    Highbar Rooftop NYC
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
                      Times Square, New York, NY
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
                  <p className="text-[#000000] text-[16px]">26 Dec, 2024</p>
                </div>
                <div className="space-y-6">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Check-in Time
                  </p>
                  <p className="text-[#000000] text-[16px]">06:00 PM</p>
                </div>
                <div className="space-y-6">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Guest Count
                  </p>
                  <p className="text-[#000000] text-[16px]">30 Guests</p>
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
                  <p className="text-[#000000] text-[16px]">Table No 15</p>
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
                  The standard Lorem Ipsum passage, m ipsum dolor sit amet,
                  cectetur adipiscing elit, sed do eiusmod. The standard Lorem
                  Ipsum passage, m ipsum dolor sit amet, cectetur adipiscing
                  elit, sed do eiusmod. The standard Lorem Ipsum passage, m
                  ipsum dolor sit amet, cectetur adipiscing elit, sed do
                  eiusmod. The standard.
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
                  <p className="text-[#000000] text-[16px]">Mike Smith</p>
                </div>
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Email Address
                  </p>
                  <p className="text-[#000000] text-[16px]">
                    designer@gmail.com
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="font-semibold text-[#000000] text-[18px]">
                    Phone Number
                  </p>
                  <p className="text-[#000000] text-[16px]">+1 462 849 558</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
