/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { useCreateEvent } from "../../hooks/queries/useQueries";
import { SuccessToast, ErrorToast } from "../global/Toaster";

const EventSummaryModal = ({ onClose, onClick, apiPayload, services }) => {
  const { mutate: createEvent, isPending } = useCreateEvent();

  const handlePayNow = () => {
    if (!apiPayload) {
      ErrorToast("Missing event data.");
      return;
    }

    createEvent(apiPayload, {
      onSuccess: (data) => {
        SuccessToast("Event request created successfully!");
        if (onClick) onClick(data);
      },
      onError: (err) => {
        ErrorToast(err.response?.data?.message || "Failed to create event request.");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 overflow-y-auto ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Book Now</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="flex flex-col  lg:h-auto md:h-screen px-8 mb-4">
          <div className="space-y-3 xxl:w-[400px] xxl:ml-12">
            <p className="text-[16px] text-[#181818] font-semibold mt-2">
              Payment Method
            </p>
            <div className="p-4 bg-[#F1F1F1] rounded-xl">
              <p className="text-[16px] text-[#181818] font-semibold  pb-2 border-b border-b-gray-300">
                Event Summary
              </p>
              {services?.selectedPackage?.map((pkg) => (
                <div
                  key={pkg.id || pkg._id}
                  className="flex justify-between items-center mt-3"
                >
                  <p className="text-[14px] font-[500] text-[#18181880]">
                    {pkg.title}
                  </p>

                  <p className="text-[16px] text-[#4B4B4B]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format((pkg.price || 0) / 100)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-300">
                <p className="text-[15px] font-semibold text-[#181818]">
                  Total
                </p>

                <p className="text-[18px] font-bold text-[#181818]">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    (services?.selectedPackage?.reduce(
                      (total, pkg) => total + (pkg.price || 0),
                      0
                    ) || 0) / 100
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handlePayNow}
              disabled={isPending}
              className={`bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-bold px-4 py-3 rounded-[12px] w-[97%] ${isPending ? 'opacity-70' : ''}`}
            >
              {isPending ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSummaryModal;
