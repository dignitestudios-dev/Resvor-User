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
    endTime = "06:00pm",
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

    // Collect service/package IDs from selected services
    const servicePackageIds = (bookingServiceData?.selectedPackage || [])
      .map((item) => item._id || item.id)
      .filter(Boolean);

    const finalPayload = {
      // Core booking fields
      loungeId:    bookingApiPayload.loungeId,
      bookingDate: bookingApiPayload.bookingDate,
      startTime:   bookingApiPayload.startTime,
      endTime:     bookingApiPayload.endTime,
      guestCount:  Number(bookingApiPayload.guestCount),

      // Tables
      tableIds: selectedTableIds,

      // Guest contact info (collected in BookingModal step 1)
      guestName:    bookingApiPayload.guestName  || undefined,
      guestEmail:   bookingApiPayload.guestEmail || undefined,
      guestPhone:   bookingApiPayload.guestPhone || undefined,
      childrenCount: bookingApiPayload.childrenCount ?? 0,

      // Services & packages (collected in BookingServiceModal step 2)
      servicePackageIds: servicePackageIds.length > 0 ? servicePackageIds : undefined,

      // Instructions / special request (from step 2 textarea)
      instructions:
        bookingServiceData?.instruction || undefined,
      specialRequest:
        bookingServiceData?.specialRequest ||
        bookingServiceData?.instruction ||
        bookingApiPayload?.specialRequest ||
        undefined,
    };

    // Remove undefined keys so the API doesn't get null noise
    Object.keys(finalPayload).forEach(
      (key) => finalPayload[key] === undefined && delete finalPayload[key]
    );

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
      <div className="bg-white rounded-[12px] w-full max-w-[440px] mx-4 pb-2 h-[640px] overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 border-b-2 border-b-gray-300">
          <h2 className="text-[28px] font-bold mb-4">Book Now</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="px-8 pt-6 pb-2">
          <h3 className="text-[16px] font-bold text-[#181818] mb-3">
            Booking Overview
          </h3>

          <div className="space-y-2.5 text-[14px] border-b-2 border-b-gray-300 pb-4 mb-4">
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Name</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{name}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Email Address</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{email}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="font-medium text-[#727272] shrink-0">Phone Number</span>
              <span className="text-[#000000] font-semibold text-right break-all max-w-[65%]">{phone}</span>
            </div>
          </div>

          <div className="space-y-2.5 border-b-2 border-b-gray-300 pb-4 mb-4">
            <div className="flex justify-between gap-4 items-start">
              <span className="text-[14px] font-medium text-[#727272] shrink-0">Date</span>
              <span className="text-[14px] text-[#000000] font-semibold text-right break-all max-w-[65%]">{date}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="text-[14px] font-medium text-[#727272] shrink-0">Time</span>
              <span className="text-[14px] text-[#000000] font-semibold text-right break-all max-w-[65%]">{time} – {endTime}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="text-[14px] font-medium text-[#727272] shrink-0">Guest Count</span>
              <span className="text-[14px] text-[#000000] font-semibold text-right break-all max-w-[65%]">{guestCount}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="text-[14px] font-medium text-[#727272] shrink-0">Children (If any)</span>
              <span className="text-[14px] text-[#000000] font-semibold text-right break-all max-w-[65%]">{children}</span>
            </div>
            <div className="flex justify-between gap-4 items-start">
              <span className="text-[14px] font-medium text-[#727272] shrink-0">Table</span>
              <span className="text-[14px] text-[#000000] font-semibold text-right break-all max-w-[65%]">
                {bookingServiceData?.selectedSeating
                  ?.map((seat) => seat.title || seat.name)
                  .join(", ") || "-"}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-[16px] text-[#000000] mb-3">
              Services and Packages
            </p>
            <div className="space-y-2 text-[14px] bg-gray-50 p-3 rounded-lg border border-gray-200">
              {bookingServiceData?.selectedPackage?.length > 0 ? (
                bookingServiceData.selectedPackage.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 items-start text-gray-700">
                    <span className="break-all max-w-[65%]">{item.title}</span>
                    <span className="font-semibold text-gray-900 shrink-0">${item.price}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No services or packages selected.</p>
              )}
            </div>
          </div>

          {bookingServiceData?.instruction && (
            <div className="mb-6">
              <p className="font-semibold text-[#181818] mb-2">
                Any Instruction{" "}
                <span className="text-[#727272] text-[11px]">(optional)</span>
              </p>
              <p className="text-[#6B6B6B] text-[12px] leading-5 break-words max-h-[100px] overflow-y-auto">
                {bookingServiceData.instruction}
              </p>
            </div>
          )}

          <div className="space-y-3 mt-6">
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
