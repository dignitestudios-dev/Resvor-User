/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import FilterSelectableField from "../global/FilterSelectableField";
import { useState } from "react";
import Button from "../global/Button";
import TagsInputField from "../onBoarding/TagsInputField";
import { binIcon } from "../../assets/export";
import ServicesModal from "./ServicesModal";

const EventServiceModal = ({ onClose, onNext, loungeServices, eventServices, onClickBack }) => {
  const [serviceModalData, setServiceModalData] = useState(
    eventServices?.selectedPackage || []
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);
  const [selectedSeating, setSelectedSeating] = useState(
    eventServices?.selectedSeating || []
  );

  const [instruction, setInstruction] = useState(
    eventServices?.instruction || ""
  );
  const handleSelectSeating = (option) => {
    const name = option?.name || option;

    setSelectedSeating((prev) => {
      const exists = prev.some((item) => item.name === name);

      if (exists) {
        return prev.filter((item) => item.name !== name);
      } else {
        return [...prev, { name }];
      }
    });
  };
  const handleRemoveService = (id) => {
    setServiceModalData((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  const handleNext = () => {
    const eventData = {
      selectedSeating: selectedSeating,
      selectedPackage: serviceModalData,
      instruction: instruction,
    };
    onNext(eventData);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[440px] pb-2  ">
        <div
          className={`flex justify-between items-center  px-8 pt-4 border-b-2 border-b-gray-300`}
        >
          <h2 className="text-[28px] font-bold mb-4">Request Event</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="px-8 py-4">
          {/* <div className="my-2 mx-1">
            <FilterSelectableField
              label="Preferred Seating Area"
              placeholder={"Choose preferences"}
              options={["Indoor VIP section", "Outdoor Terrace", "Vip Lounge"]}
              value={selectedSeating}
              onChange={handleSelectSeating}
            />
          </div> */}
          <div className="mx-1">
            <label className="block text-[14px] font-[500] text-[#181818] mb-1">
              Select Services & Packages
            </label>

            <TagsInputField
              setModalIsOpen={setModalIsOpen}
              text="Add Services and Packages"
            />
            {serviceModalData && serviceModalData.length > 0 && (
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
                        {service.title} ({new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((service.price || 0) / 100)})
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
                  placeholder="Add text here"
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
      </div>
    </div>
  );
};

export default EventServiceModal;
