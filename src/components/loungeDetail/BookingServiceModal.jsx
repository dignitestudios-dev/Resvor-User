/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import FilterSelectableField from "../global/FilterSelectableField";
import { useState, useEffect } from "react";
import Button from "../global/Button";
import TagsInputField from "../onBoarding/TagsInputField";
import { binIcon } from "../../assets/export";
import ServicesModal from "./ServicesModal";
import FloorPlanModal from "./FloorPlanModal";
import { useAvailableTables } from "../../hooks/queries/useQueries";

const BookingServiceModal = ({
  onClose,
  onNext,
  loungeId,
  bookingData,
  bookingServiceData,
  loungeServices,
  onClickBack,
  floorPlan,
}) => {
  const [serviceModalData, setServiceModalData] = useState(
    bookingServiceData?.selectedPackage || []
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [floorPlanModal, setFloorPlanModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const closeModal = () => setModalIsOpen(false);

  const [selectedTable, setSelectedTable] = useState(
    bookingServiceData?.selectedSeating || []
  );
  const [instruction, setInstruction] = useState(
    bookingServiceData?.instruction || ""
  );

  console.log("BookingServiceModal props:", { loungeId, bookingData });
  console.log("Fetching tables with:", {
    loungeId,
    date: bookingData?.apiPayload?.bookingDate,
    startTime: bookingData?.apiPayload?.startTime,
    endTime: bookingData?.apiPayload?.endTime
  });

  const { data: tablesResponse, isLoading: isLoadingTables } = useAvailableTables(
    loungeId,
    bookingData?.apiPayload?.bookingDate,
    bookingData?.apiPayload?.startTime,
    bookingData?.apiPayload?.endTime
  );

  const availableTables = tablesResponse?.data || [];
  const tableOptions = availableTables.map(t => ({
    title: `${t.code || `Table ${t.tableNumber}`} (${t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : ''} - Cap: ${t.capacity || 'N/A'})`,
    _id: t._id
  }));

  const handleSelect = (option) => {
    const title = option?.title || option;
    setSelectedTable((prev) => {
      const exists = prev.some((item) => (item.title || item.name) === title);
      const nextVal = exists
        ? prev.filter((item) => (item.title || item.name) !== title)
        : [...prev, { title, _id: option._id || option.id }];

      if (nextVal.length > 0) {
        setFormErrors((prevErr) => ({ ...prevErr, table: "" }));
      }
      return nextVal;
    });
  };

  const handleRemoveService = (id) => {
    setServiceModalData((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  // Clear service validation error when service is selected
  useEffect(() => {
    if (serviceModalData && serviceModalData.length > 0) {
      setFormErrors((prev) => ({ ...prev, service: "" }));
    }
  }, [serviceModalData]);

  const handleNext = () => {
    const errors = {};
    if (!selectedTable || selectedTable.length === 0) {
      errors.table = "Please select at least one table.";
    }
    if (!serviceModalData || serviceModalData.length === 0) {
      errors.service = "Please select at least one service or package.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      ErrorToast("Please select both a table and a service to proceed.");
      return;
    }

    const eventData = {
      selectedSeating: selectedTable,
      selectedPackage: serviceModalData,
      instruction: instruction,
      tableIds: selectedTable.map(t => t._id).filter(Boolean),
      specialRequest: instruction || undefined,
    };
    onNext(eventData);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Book Now</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="px-8 py-4 relative">
          <div
            onClick={() => setFloorPlanModal(true)}
            className="absolute underline text-[12px] text-indigo-950 rounded-md cursor-pointer right-0 pr-10 top-6 z-50"
          >
            View Floor Plan
          </div>
          <div className="my-2 mx-1 ">
            <FilterSelectableField
              label="Select table"
              placeholder={isLoadingTables ? "Loading..." : "Select table"}
              options={tableOptions}
              value={selectedTable}
              onChange={handleSelect}
            />
            {formErrors.table && (
              <p className="text-red-600 text-[12px] mt-1">{formErrors.table}</p>
            )}
            {(!bookingData?.apiPayload?.bookingDate) && (
              <p className="text-[12px] text-gray-500 mt-1">Date and time required to see tables.</p>
            )}
          </div>
          <div className="mx-1">
            <label className="block text-[14px] font-[500] text-[#181818] mb-1">
              Select Services & Packages
            </label>

            <TagsInputField
              setModalIsOpen={setModalIsOpen}
              text="Add Services and Packages"
            />
            {formErrors.service && (
              <p className="text-red-600 text-[12px] mt-1">{formErrors.service}</p>
            )}
            {serviceModalData.length > 0 && (
              <div
                className="flex items-end border border-gray-400 text-sm rounded-[13px] 
               overflow-hidden p-[2px] mt-1.5"
              >
                {/* SERVICES LIST */}
                <div className="flex flex-wrap py-1 pl-4 w-[80%] text-[#FFFFFF] font-thin text-[14px]">
                  {serviceModalData.map((service) => {
                    const svcId = service.id || service._id;
                    return (
                      <span
                        key={svcId}
                        className="bg-blue-950 rounded-full px-3 py-1 mr-2 mb-1 inline-flex items-center gap-2"
                      >
                        {service.title} (${service.price})
                        {/* Small bin icon inside each tag */}
                        <button onClick={() => handleRemoveService(svcId)}>
                          <img src={binIcon} className="w-4 h-4" alt="remove" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="px-1 mt-2">
            <div>
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                Any Instructions{" "}
                <span className="text-[12px] text-[#727272]">(optional)</span>
              </label>
              <div className="relative">
                <textarea
                  type="text"
                  name="instructions"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Add here"
                  maxLength={250}
                  className={`w-full px-4 py-2 text-sm rounded-[15px] bg-transparent ring-1 ring-[#CACACA] 
                          focus:ring-2 focus:ring-gray-200 focus:outline-none pr-12 placeholder:font-light placeholder:text-[12px] placeholder:text-[#727272] `}
                ></textarea>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-4 px-1 space-y-2">
              <Button text="Next" type="button" onClick={handleNext} />
              {onClickBack && (
                <button
                  type="button"
                  onClick={onClickBack}
                  className="w-full bg-[#E8E8E8] text-[#181818] text-[14px] rounded-[8px] py-2 font-semibold hover:bg-[#D8D8D8] transition"
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </div>
        {modalIsOpen && (
          <ServicesModal
            isOpen={modalIsOpen}
            onClose={closeModal}
            setServiceModalData={setServiceModalData}
            initialSelectedServices={serviceModalData}
            loungeServices={loungeServices}
          />
        )}
        {floorPlanModal && (
          <FloorPlanModal
            onClose={() => setFloorPlanModal(false)}
            floorPlan={floorPlan}
            availableTables={availableTables}
          />
        )}
      </div>
    </div>
  );
};

export default BookingServiceModal;
