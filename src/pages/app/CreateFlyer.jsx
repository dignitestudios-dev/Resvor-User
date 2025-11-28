import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import InputField from "../../components/auth/InputField";
import DatePickerField from "../../components/global/DatePickerField";
import TimePickerField from "../../components/global/TimePickerField";
import FilterSelectableField from "../../components/global/FilterSelectableField";
import RichTextEditor from "../../components/global/RichTextEditor";
import { cardTemplates } from "../../static/MockData";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import Button from "../../components/global/Button";
import FlayerFeeModal from "../../components/flayer/FlayerFeeModal";
import ProceedFlayerModal from "../../components/flayer/ProceedFlayerModal";
import SendInvitationModal from "../../components/flayer/SendInvitationModal";
import AuthSuccessModal from "../../components/auth/AuthSuccessModal";

const CreateFlyer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventType: [],
    eventDate: null,
    startTime: null,
    endTime: null,
    address: "",
    city: "",
    additionalInfo: "",
  });

  const [selectedCard, setSelectedCard] = useState(cardTemplates[0]);
  const [sendProceed, setSendProceed] = useState(false);
  const [isFlayerFee, setIsFlayerFee] = useState(false);
  const [sendInvitationModal, setSendInvitationModal] = useState(false);
  const [openField, setOpenField] = useState(null);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventTypeChange = (option) => {
    setFormData((prev) => ({ ...prev, eventType: [option] }));
    // setFormData((prev) => {
    //   const exists = prev.eventType.some((item) => item.id === option._id);
    //   if (exists) {
    //     return {
    //       ...prev,
    //       eventType: prev.eventType.filter((item) => item.id !== option._id),
    //     };
    //   } else {
    //     return {
    //       ...prev,
    //       eventType: [...prev.eventType, { name: option.name, id: option._id }],
    //     };
    //   }
    // });
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, eventDate: date }));
  };

  const handleStartTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, startTime: time }));
  };

  const handleEndTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, endTime: time }));
  };

  const handleAdditionalInfoChange = (value) => {
    setFormData((prev) => ({ ...prev, additionalInfo: value }));
  };

  const handleProceedInvitation = () => {
    setSendProceed(false);
    setIsFlayerFee(true);
  };

  const handleFlayerFee = () => {
    setIsFlayerFee(false);
    setSendInvitationModal(true);
  };

  //   const handleSaveFlyer = () => {
  //     console.log(
  //       "Saving flyer with data:",
  //       formData,
  //       "Selected card:",
  //       selectedCard
  //     );
  //     // Add API call or action here
  //   };

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            Profile
          </h2>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div className=" mx-auto px-10 py-10 bg-[#F5F5F5] rounded-xl -mt-[16em] shadow-sm">
          <div className="grid grid-cols-2 justify-items-end gap-8">
            {/* Left Column: Event Details Form */}
            <div className="space-y-6 w-[420px] justify-self-start">
              <div className="w-[300px]">
                <h2 className="text-[22px] font-bold text-[#333333] mb-2">
                  Event Details
                </h2>
                <p className="text-[14px] text-[#333333] mb-6">
                  Select text on the invitation to customize the font, size, and
                  color.
                </p>
              </div>

              {/* Event Title */}
              <div>
                <InputField
                  label="Event Title"
                  text="eventTitle"
                  placeholder="Enter event title"
                  type="text"
                  id="eventTitle"
                  name="eventTitle"
                  maxLength={100}
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                />
              </div>

              {/* Event Type & Date */}
              <div className="grid grid-cols-2 gap-4">
                <FilterSelectableField
                  label="Event Type"
                  placeholder="Select event type"
                  options={[
                    "Birthday Party",
                    "Wedding",
                    "Corporate Event",
                    "Festival",
                  ]}
                  value={formData.eventType}
                  onChange={handleEventTypeChange}
                />
                <div>
                  <DatePickerField
                    label="Event Date"
                    value={formData.eventDate}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <TimePickerField
                  text="Start Time"
                  label="Select Time"
                  value={formData.startTime}
                  onChange={handleStartTimeChange}
                  open={openField === "start"}
                  onOpen={() =>
                    setOpenField(openField === "start" ? null : "start")
                  }
                  position={"-left-4"}
                />
                <TimePickerField
                  text="End Time"
                  label="Select time"
                  value={formData.endTime}
                  onChange={handleEndTimeChange}
                  open={openField === "end"}
                  onOpen={() =>
                    setOpenField(openField === "end" ? null : "end")
                  }
                  position={"-right-6"}
                />
              </div>

              {/* Location Section */}
              <div>
                <h3 className="text-[16px] font-bold text-[#181818] mb-3">
                  Location
                </h3>

                <div className="space-y-4">
                  <InputField
                    label="Address"
                    text="address"
                    placeholder="Enter address"
                    type="text"
                    id="address"
                    name="address"
                    maxLength={120}
                    value={formData.address}
                    onChange={handleInputChange}
                  />

                  <InputField
                    label="City"
                    text="city"
                    placeholder="Enter city"
                    type="text"
                    id="city"
                    name="city"
                    maxLength={50}
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Card Preview */}
            <div className="space-y-6 w-[385px] justify-self-end ">
              <h2 className="text-[28px] font-bold text-[#181818] mb-2">
                Card Preview
              </h2>

              {/* Card Display */}
              <div className="border-2 border-gray-200 rounded-lg p-6 flex items-center justify-center h-[360px] bg-[#F9F9F9]">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                />
              </div>

              {/* Card Template Carousel */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#181818] mb-2">
                  Select Card Template
                </h3>
                <div className="relative">
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={12}
                    slidesPerView={5}
                    navigation={{
                      prevEl: ".swiper-button-prev-custom",
                      nextEl: ".swiper-button-next-custom",
                    }}
                    className="w-full"
                  >
                    {cardTemplates.map((template) => (
                      <SwiperSlide key={template.id}>
                        <div
                          onClick={() => setSelectedCard(template)}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedCard.id === template.id
                              ? "border-[#0B0E52]"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-14 object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:shadow-lg transition">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:shadow-lg transition">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Rich Text Editor */}
          <div className="mt-8">
            <RichTextEditor
              value={formData.additionalInfo}
              onChange={handleAdditionalInfoChange}
            />
          </div>
          <div className="w-[320px] mt-4">
            <Button
              text="Send"
              type="button"
              onClick={() => setSendProceed(true)}
            />
          </div>
        </div>
        {sendProceed && (
          <ProceedFlayerModal
            onClose={() => setSendProceed(false)}
            onClick={handleProceedInvitation}
          />
        )}
        {isFlayerFee && (
          <FlayerFeeModal
            onClick={handleFlayerFee}
            onClose={() => setIsFlayerFee(false)}
          />
        )}
        {sendInvitationModal && (
          <SendInvitationModal
            onClick={() => setSendInvitationModal(false)}
            onClose={() => setSendInvitationModal(false)}
            handleSuccess={() => {
              setSendInvitationModal(false);
              setIsSuccess(true);
            }}
          />
        )}
        {isSuccess && (
          <AuthSuccessModal
            onClick={() => {
              navigate("/app/flyers");
            }}
            title="Invitation sent"
            description="your invitation sent to all guests"
          />
        )}
      </div>
    </>
  );
};

export default CreateFlyer;
