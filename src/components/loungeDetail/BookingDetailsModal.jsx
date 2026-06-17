/* eslint-disable react/prop-types */
import { useCreateBooking } from "../../hooks/queries/useQueries";
import { RxCross2 } from "react-icons/rx";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import Button from "../global/Button";

const BookingDetailsModal = ({
  onClose,
  bookingData,
  onNext,
  onClickBack,
  bookingServiceData,
}) => {
  const { mutate: createBooking, isPending } = useCreateBooking();

  const bookingOverview = bookingData?.displayData || bookingData || {};
  const {
    name = "Mike Smith",
    email = "designer@gmail.com",
    phone = "1 462 849 558",
    date = "26 Dec, 2024",
    time = "06:00pm",
    guestCount = "6 Guests",
    children = "None",
  } = bookingOverview;

  const bookingApiPayload = bookingData?.apiPayload || null;
  const selectedTableIds =
    bookingServiceData?.tableIds ||
    bookingServiceData?.selectedSeating
      ?.map((item) => item?._id)
      .filter(Boolean) ||
    [];

  const handleConfirmBooking = () => {
    if (!bookingApiPayload?.loungeId) {
      ErrorToast("Missing booking data.");
      return;
    }

    const finalPayload = {
      ...bookingApiPayload,
      guestCount: Number(bookingApiPayload.guestCount),
      tableIds: selectedTableIds,
      specialRequest:
        bookingServiceData?.specialRequest ||
        bookingServiceData?.instruction ||
        bookingApiPayload?.specialRequest ||
        undefined,
    };

    if (
      !finalPayload.bookingDate ||
      !finalPayload.startTime ||
      !finalPayload.endTime ||
      !finalPayload.guestCount
    ) {
      ErrorToast("Booking information is incomplete.");
      return;
    }

    createBooking(finalPayload, {
      onSuccess: (response) => {
        SuccessToast(response?.message || "Booking created successfully.");
        if (onNext) {
          onNext(response);
        }
      },
      onError: (requestError) => {
        ErrorToast(
          requestError?.response?.data?.message ||
            "Failed to create booking."
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2 h-[640px] overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 border-b-2 border-b-gray-300">
          <h2 className="text-[28px] font-bold mb-4">Make Reservation</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="px-8 py-6">
          <h3 className="text-[16px] font-bold text-[#181818] mb-3">
            Booking Overview
          </h3>

          <div className="grid grid-cols-3 gap-3 text-[12px] border-b-2 border-b-gray-300 pb-2 mb-4">
            <div>
              <p className="font-medium text-[14px] text-[#000000] mb-1">
                Name
              </p>
              <p className="text-[#000000]">{name}</p>
            </div>
            <div className="border-l-2 border-b-gray-300 pl-1">
              <p className="font-medium text-[14px] text-[#000000] mb-1">
                Email Address
              </p>
              <p className="text-[#000000] break-all">{email}</p>
            </div>
            <div className="border-l-2 border-b-gray-300 pl-1">
              <p className="font-medium text-[14px] text-[#000000] mb-1">
                Phone Number
              </p>
              <p className="text-[#000000]">{phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4 border-b-2 border-b-gray-300 pb-2">
            <div>
              <p className="text-[13px] text-[#9B9B9B] mb-1">Date</p>
              <p className="font-semibold text-[14px] text-[#000000]">{date}</p>
            </div>
            <div>
              <p className="text-[13px] text-[#9B9B9B] mb-1">Time</p>
              <p className="font-semibold text-[14px] text-[#000000]">{time}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[12px] border-b-2 border-b-gray-300 pb-2 mb-4">
            <div>
              <p className="font-medium text-[14px] text-[#000000] mb-1">
                Guest Count
              </p>
              <p className="text-[#000000]">{guestCount}</p>
            </div>
            <div>
              <p className="font-medium text-[14px] text-[#000000] mb-1">
                Children (If any)
              </p>
              <p className="text-[#000000]">{children}</p>
            </div>
            <div>
              <p className="font-medium text-[14px] text-[#000000] mb-1">
                Table
              </p>
              <p className="text-[#000000] whitespace-pre-wrap">
                {bookingServiceData?.selectedSeating
                  ?.map((seat) => seat.title || seat.name)
                  .join(", ") || "-"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-[16px] text-[#000000] mb-3">
              Services and Packages
            </p>
            <div className="grid grid-cols-2 gap-3 text-[12px] border-b-2 border-b-gray-300 pb-2 mb-4">
              <div>
                {bookingServiceData?.selectedPackage?.length > 0 &&
                  bookingServiceData?.selectedPackage?.map((item) => (
                    <p key={item.id} className="text-[#000000]">
                      {item.title} - {item.price}$
                    </p>
                  ))}
              </div>
              <div className="border-l-2 border-b-gray-300 pl-1 py-2">
                {bookingServiceData?.selectedSeating?.map((item, index) => (
                  <p key={index} className="text-[#000000]">
                    {item.name || item.title}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {bookingServiceData?.instruction && (
            <div className="mb-6">
              <p className="font-semibold text-[#181818] mb-2">
                Any Instruction{" "}
                <span className="text-[#727272] text-[11px]">(optional)</span>
              </p>
              <p className="text-[#6B6B6B] text-[12px] leading-5">
                {bookingServiceData.instruction}
              </p>
            </div>
          )}

          <div className="space-y-3 mt-8">
            <Button
              text={isPending ? "Processing..." : "Confirm Booking"}
              type="button"
              onClick={handleConfirmBooking}
              disabled={isPending}
            />
            <button
              onClick={onClickBack}
              className="w-full bg-[#E8E8E8] text-[#181818] text-[14px] rounded-[8px] py-2 font-semibold hover:bg-[#D8D8D8] transition disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
