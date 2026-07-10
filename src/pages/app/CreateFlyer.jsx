import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import InputField from "../../components/auth/InputField";
import DatePickerField from "../../components/global/DatePickerField";
import TimePickerField from "../../components/global/TimePickerField";
import FilterSelectableField from "../../components/global/FilterSelectableField";
import RichTextEditor from "../../components/global/RichTextEditor";
import { cardTemplates, flyerData } from "../../static/MockData";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { createFlyerSchema } from "../../schema/app/appSchema";
import Button from "../../components/global/Button";
import FlayerFeeModal from "../../components/flayer/FlayerFeeModal";
import ProceedFlayerModal from "../../components/flayer/ProceedFlayerModal";
import SendInvitationModal from "../../components/flayer/SendInvitationModal";
import AuthSuccessModal from "../../components/auth/AuthSuccessModal";
import html2canvas from "html2canvas";
import { useCreateCampaign } from "../../hooks/mutations/OnboardingMutations";
import { SuccessToast, ErrorToast } from "../../components/global/Toaster";
import { eventTypes } from "../../static/LoungeDetailTabs";

/* ─────────────────────────────────────────────────────────────
   Utilities
───────────────────────────────────────────────────────────── */
const formatDate = (date) => {
  if (!date) return "";
  try {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(date);
  }
};

const formatTime = (time) => {
  if (!time) return "";
  if (typeof time === "string") return time;
  try {
    const d = new Date(time);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(time);
  }
};

/* ─────────────────────────────────────────────────────────────
   FlyerCard — portrait card: full-bleed background + overlay
───────────────────────────────────────────────────────────── */
const FlyerCard = ({ formData, selectedCard, flyerRef }) => {
  const timeStr = [formatTime(formData.startTime), formatTime(formData.endTime)]
    .filter(Boolean)
    .join(" – ");

  const locationStr = [formData.address, formData.city].filter(Boolean).join(", ");

  const hasAnyData =
    !!formData.eventTitle ||
    !!formData.eventDate ||
    !!formData.startTime ||
    !!formData.endTime ||
    !!formData.address ||
    !!formData.city;

  const titleIsLong = formData.eventTitle && formData.eventTitle.length > 30;

  return (
    <div
      ref={flyerRef}
      className="relative w-[380px] h-[520px] rounded-[20px] overflow-hidden shadow-2xl shrink-0 select-none font-serif"
    >
      {/* ── Full-bleed background image ── */}
      <img
        src={selectedCard.image}
        alt={selectedCard.name}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover object-center block"
      />

      {/* ── Gradient + content: only when user has entered something ── */}
      {hasAnyData && (
        <>
          {/* Darkening gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/75 pointer-events-none" />

          {/* Content panel */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/10 px-7 py-7 flex flex-col items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

            {/* Gold top accent bar */}
            <div className="w-12 h-[3px] rounded-full bg-gradient-to-r from-[#c9a84c] via-[#f0d080] to-[#c9a84c] mb-5" />

            {/* Event Title */}
            <h1
              className={`text-white font-bold leading-snug text-center mb-5 tracking-wide break-words drop-shadow-lg w-full ${titleIsLong ? "text-lg" : "text-[22px]"
                }`}
            >
              {formData.eventTitle ||
                "Share operational announcements, policy updates, reminders, and promotions."}
            </h1>

            {/* Thin divider */}
            <div className="w-full h-px bg-white/20 mb-5" />

            {/* Details rows */}
            <div className="flex flex-col gap-2.5 w-full">
              {/* Date */}
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] text-white/60 font-semibold font-sans min-w-[60px]">
                  Date:
                </span>
                <span className="text-[13px] text-white/90 font-sans">
                  {formData.eventDate ? formatDate(formData.eventDate) : "—"}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] text-white/60 font-semibold font-sans min-w-[60px]">
                  Time:
                </span>
                <span className="text-[13px] text-white/90 font-sans">
                  {timeStr || "—"}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2.5">
                <span className="text-[13px] text-white/60 font-semibold font-sans min-w-[60px] shrink-0">
                  Location:
                </span>
                <span className="text-[13px] text-white/90 font-sans leading-snug break-words">
                  {locationStr || "—"}
                </span>
              </div>
            </div>

            {/* Gold bottom accent bar */}
            <div className="w-12 h-[3px] rounded-full bg-gradient-to-r from-[#c9a84c] via-[#f0d080] to-[#c9a84c] mt-5" />
          </div>
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
const CreateFlyer = () => {
  const navigate = useNavigate();
  const { flyerId } = useParams();
  const flyerRef = useRef(null);
  const flyerBlobRef = useRef(null); // stores captured flyer PNG blob for API

  const { mutate: createCampaign, isPending: isSendingCampaign } = useCreateCampaign();

  // Resolve the clicked flyer from Flyers page (if any) to use as initial preview
  const initialCard = flyerId
    ? flyerData.find((f) => String(f.id) === String(flyerId)) || cardTemplates[0]
    : cardTemplates[0];

  const [selectedCard, setSelectedCard] = useState(initialCard);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [sendProceed, setSendProceed] = useState(false);
  const [isFlayerFee, setIsFlayerFee] = useState(false);
  const [sendInvitationModal, setSendInvitationModal] = useState(false);
  const [openField, setOpenField] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ── useFormik Setup ── */
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      eventTitle: "",
      eventType: [],
      eventDate: null,
      startTime: null,
      endTime: null,
      address: "",
      city: "",
      additionalInfo: "",
    },
    validationSchema: createFlyerSchema,
    onSubmit: () => {
      handleSend();
    },
  });

  /* ── Modal flow ── */
  const handleProceedInvitation = () => {
    setSendProceed(false);
    setIsFlayerFee(true);
  };

  const handleFlayerFee = () => {
    setIsFlayerFee(false);
    setSendInvitationModal(true);
  };

  /* ── Capture flyer → store blob → open Proceed modal ── */
  const handleSend = async () => {
    if (!flyerRef.current) { setSendProceed(true); return; }
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(flyerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      canvas.toBlob(
        (blob) => {
          flyerBlobRef.current = blob; // keep for API payload
          setIsGenerating(false);
          setSendProceed(true);
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Flyer export failed:", err);
      setIsGenerating(false);
      setSendProceed(true);
    }
  };

  /* ── Build FormData & POST /campaigns ── */
  const handleSubmitCampaign = (recipients) => {
    const payload = new FormData();

    // required fields
    payload.append("channel", "email");

    // recipients array: recipients[0], recipients[1] …
    recipients.forEach((email, index) => {
      payload.append(`recipients[${index}]`, email);
    });

    payload.append("additionalInfo", values.additionalInfo);

    // attach the captured flyer PNG
    if (flyerBlobRef.current) {
      const flyerFile = new File(
        [flyerBlobRef.current],
        "event-flyer.png",
        { type: "image/png" }
      );
      payload.append("image", flyerFile);
    }

    createCampaign(payload, {
      onSuccess: () => {
        SuccessToast("Campaign sent successfully!");
        setSendInvitationModal(false);
        setIsSuccess(true);
      },
      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          "Failed to send campaign. Please try again.";
        ErrorToast(message);
      },
    });
  };

  /* ── Download flyer ── */
  const handleDownloadFlyer = async () => {
    if (!flyerRef.current) return;
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(flyerRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${values.eventTitle || "event"}-flyer.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* ── Page Header ── */}
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            Campaign and Flyers
          </h2>
        </div>
      </div>

      <div className="px-5 lg:px-40">
        <div className="mx-auto px-10 py-10 bg-[#F5F5F5] rounded-xl -mt-[16em] shadow-sm">

          <div className="flex gap-10 items-start">

            {/* ── LEFT: Form ── */}
            <div className="flex-1 space-y-6 min-w-0">
              <div>
                <h2 className="text-[22px] font-bold text-[#333333] mb-1">Event Details</h2>
                <p className="text-[13px] text-[#777]">
                  Fill in the fields below — the flyer updates in real time.
                </p>
              </div>

              <div>
                <FilterSelectableField
                  label="Event Type"
                  placeholder="Select event type"
                  options={eventTypes}
                  value={values.eventType}
                  onChange={(option) => {
                    setFieldValue("eventType", [option]);
                    setFieldTouched("eventType", true, false);
                  }}
                />
                {touched.eventType && errors.eventType && (
                  <p className="text-red-600 text-[12px] mt-1">{errors.eventType}</p>
                )}
              </div>

              {/* Event Title */}
              <InputField
                label="Event Title"
                text="eventTitle"
                placeholder="Enter event title"
                type="text"
                id="eventTitle"
                name="eventTitle"
                maxLength={100}
                value={values.eventTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.eventTitle}
                touched={touched.eventTitle}
              />

              {/* Event Type & Date */}
              {/* Start & End Time */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <DatePickerField
                    label="Event Date"
                    value={values.eventDate}
                    minDate={tomorrow}
                    onChange={(date) => {
                      setFieldValue("eventDate", date);
                      setFieldTouched("eventDate", true, false);
                    }}
                  />
                  {touched.eventDate && errors.eventDate && (
                    <p className="text-red-600 text-[12px] mt-1">{errors.eventDate}</p>
                  )}
                </div>
                <div>
                  <TimePickerField
                    text="Start Time"
                    label="Select Time"
                    value={values.startTime}
                    onChange={(time) => {
                      setFieldValue("startTime", time);
                      setFieldTouched("startTime", true, false);
                      setOpenField(null);
                    }}
                    open={openField === "start"}
                    onOpen={() => setOpenField(openField === "start" ? null : "start")}
                    position={"-left-4"}
                  />
                  {touched.startTime && errors.startTime && (
                    <p className="text-red-600 text-[12px] mt-1">{errors.startTime}</p>
                  )}
                </div>
                <div>
                  <TimePickerField
                    text="End Time"
                    label="Select time"
                    value={values.endTime}
                    onChange={(time) => {
                      setFieldValue("endTime", time);
                      setFieldTouched("endTime", true, false);
                      setOpenField(null);
                    }}
                    open={openField === "end"}
                    onOpen={() => setOpenField(openField === "end" ? null : "end")}
                    position={"-right-6"}
                  />
                  {touched.endTime && errors.endTime && (
                    <p className="text-red-600 text-[12px] mt-1">{errors.endTime}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-[16px] font-bold text-[#181818] mb-3">Location</h3>
                <div className="space-y-4">
                  <InputField
                    label="Address"
                    text="address"
                    placeholder="Enter address"
                    type="text"
                    id="address"
                    name="address"
                    maxLength={120}
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.address}
                    touched={touched.address}
                  />
                  <InputField
                    label="City (Optional)"
                    text="city"
                    placeholder="Enter city"
                    type="text"
                    id="city"
                    name="city"
                    maxLength={50}
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.city}
                    touched={touched.city}
                  />
                </div>
              </div>

              {/* Card Template Picker */}
              {/* <div>
                <h3 className="text-[16px] font-bold text-[#181818] mb-3">
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

                  <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:shadow-lg transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow hover:shadow-lg transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div> */}

              {/* Additional Info */}
              <div>
                <RichTextEditor
                  value={values.additionalInfo}
                  onChange={(val) => {
                    setFieldValue("additionalInfo", val);
                  }}
                />
              </div>

              {/* Send Button */}
              <div className="w-[320px]">
                <Button
                  text={isGenerating || isSendingCampaign ? "Please wait…" : "Send"}
                  type="button"
                  onClick={handleSubmit}
                  disabled={isGenerating || isSendingCampaign}
                />
              </div>
            </div>

            {/* ── RIGHT: Flyer Preview ── */}
            <div className="shrink-0 w-[430px] sticky top-6">

              {/* Preview header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[22px] font-bold text-[#181818]">Card Preview</h2>
                  <p className="text-[12px] text-[#888] mt-0.5">Updates as you type</p>
                </div>

                {/* Download button */}
                <button
                  type="button"
                  onClick={handleDownloadFlyer}
                  disabled={isGenerating}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white border-none transition-opacity ${isGenerating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#0B0E52] to-[#1a1f7a] cursor-pointer hover:opacity-90"
                    }`}
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                          className="opacity-75"
                        />
                      </svg>
                      Generating…
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </>
                  )}
                </button>
              </div>

              {/* Flyer stage */}
              <div className=" rounded-[20px] px-6 py-8 flex justify-center items-center min-h-[590px] shadow-inner">
                <FlyerCard
                  formData={values}
                  selectedCard={selectedCard}
                  flyerRef={flyerRef}
                />
              </div>

              {/* Template label */}
              <p className="text-center mt-2.5 text-[12px] text-[#888] italic">
                Template: {selectedCard.name}
              </p>
            </div>
          </div>
        </div>

        {/* ── Modals ── */}
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
            onClick={handleSubmitCampaign}
            onClose={() => setSendInvitationModal(false)}
            handleSuccess={() => {
              setSendInvitationModal(false);
              setIsSuccess(true);
            }}
            isLoading={isSendingCampaign}
          />
        )}
        {isSuccess && (
          <AuthSuccessModal
            onClick={() => navigate("/app/flyers")}
            title="Invitation sent"
            description="your invitation sent to all guests"
          />
        )}
      </div>
    </>
  );
};

export default CreateFlyer;
