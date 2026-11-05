/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";
import InputField from "../auth/InputField";
import Button from "../global/Button";
import { binIcon, userImage } from "../../assets/export";
import { useState, useRef } from "react";
import TagsInputField from "../onBoarding/TagsInputField";
import TagsModal from "../onBoarding/TagsModal";
import ImageCropperModal from "../global/ImageCropperModal";
import { ErrorToast } from "../global/Toaster";

const validateImageResolution = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.onload = () => {
        if (img.width >= 215 && img.height >= 215) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = () => resolve(false);
      img.src = e.target.result;
    };

    reader.onerror = () => resolve(false);
    reader.readAsDataURL(file);
  });
};

const parseUserSpecialDates = (userSpecialDates) => {
  if (!Array.isArray(userSpecialDates) || userSpecialDates.length === 0) return null;

  let dobDate = null;
  const specialDates = [];

  userSpecialDates.forEach((item) => {
    if (!item?.date) return;

    let day = "", month = "", year = "";

    const dStr = String(item.date).trim();
    const cleanDateStr = dStr.includes("T") ? dStr.split("T")[0] : dStr;
    const parts = cleanDateStr.split(/[-/]/);

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        year = parts[0];
        month = String(parseInt(parts[1], 10));
        day = String(parseInt(parts[2], 10));
      } else {
        // MM-DD-YYYY or DD-MM-YYYY
        month = String(parseInt(parts[0], 10));
        day = String(parseInt(parts[1], 10));
        year = parts[2];
      }
    }

    if (!day || !month) {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        day = String(d.getDate());
        month = String(d.getMonth() + 1);
        year = String(d.getFullYear());
      }
    }

    if (item.occasion === "DOB") {
      dobDate = { day, month, year };
    } else {
      specialDates.push({
        title: item.occasion || "",
        day,
        month,
        year,
      });
    }
  });

  if (!dobDate && specialDates.length === 0) return null;
  return { dobDate, specialDates };
};

const EditProfileModal = ({
  onClose,
  onSave,
  isPending = false,
  initialData = {},
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState(null);
  const [rawFileToCrop, setRawFileToCrop] = useState(null);
  const fileInputRef = useRef(null);

  const [specialDatesData, setSpecialDatesData] = useState(() =>
    parseUserSpecialDates(initialData?.specialDates)
  );

  const [formData, setFormData] = useState({
    name: `${initialData?.firstName || ""} ${initialData?.lastName || ""}`.trim(),
    email: initialData?.email || "",
    phone: initialData?.phoneNumber || "",
    location: initialData?.location || "",
  });

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file type: JPG, JPEG, PNG, WEBP
      if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
        ErrorToast("Only JPG, JPEG, PNG, and WEBP formats are allowed.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Check file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        ErrorToast("File size must not exceed 10MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Check image resolution (must be at least 215x215)
      const isValidResolution = await validateImageResolution(file);
      if (!isValidResolution) {
        ErrorToast("Image resolution must be at least 215x215.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Open cropping modal before uploading
      const objectUrl = URL.createObjectURL(file);
      setCropSourceImage(objectUrl);
      setRawFileToCrop(file);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedFile, croppedPreviewUrl) => {
    setSelectedImageFile(croppedFile);
    setPreviewImage(croppedPreviewUrl);
    setIsCropperOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCloseCropper = () => {
    setIsCropperOpen(false);
    if (cropSourceImage) {
      URL.revokeObjectURL(cropSourceImage);
      setCropSourceImage(null);
    }
    setRawFileToCrop(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Called by TagsModal when the user clicks "Continue"
  const handleTagsFieldValue = (field, value) => {
    if (field === "specialDatesData") {
      setSpecialDatesData(value);
      closeModal();
    }
  };

  const handleSave = () => {
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const specialDatesPayload = [];
    if (specialDatesData?.dobDate?.day && specialDatesData?.dobDate?.month) {
      const dob = specialDatesData.dobDate;
      const year = dob.year || new Date().getFullYear();
      specialDatesPayload.push({
        occasion: "DOB",
        date: `${dob.month}-${dob.day}-${year}`,
      });
    }

    if (Array.isArray(specialDatesData?.specialDates)) {
      specialDatesData.specialDates.forEach((d) => {
        if (d.title && d.day && d.month) {
          const year = d.year || new Date().getFullYear();
          specialDatesPayload.push({
            occasion: d.title,
            date: `${d.month}-${d.day}-${year}`,
          });
        }
      });
    }

    const fields = { firstName, lastName, specialDates: specialDatesPayload };

    onSave?.(fields, selectedImageFile ?? undefined);
  };



  return (
    <div className="fixed -inset-6 bg-[#0A150F80] z-50 flex items-center justify-center">


      <div className="bg-white rounded-[12px] w-[880px] max-w-[95%] overflow-y-auto">


        {/* Header */}

        <div className="flex justify-between items-center px-8 pt-4">

          <h2 className="text-[28px] font-bold mb-4">
            Edit Profile
          </h2>


          <div
            onClick={onClose}
            className="cursor-pointer"
          >

            <RxCross2 className="text-[28px]" />

          </div>

        </div>




        <div className="px-8 py-6">


          {/* Profile image */}

          <div className="relative inline-block">

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
            />

            <img
              src={
                previewImage ||
                initialData?.profilePicture?.location ||
                userImage
              }
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            />


            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 left-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition cursor-pointer"
            >

              <AiOutlinePlus />

            </button>

          </div>




          {/* Inputs */}

          <div className="flex items-start gap-6 px-2 mt-4">

            <div className="flex-1 grid grid-cols-2 gap-6">


              <InputField

                label="Full Name"

                text="name"

                placeholder="Full Name"

                type="text"

                id="name"

                name="name"

                value={formData.name}

                onChange={handleChange}

                maxLength={60}

              />



              <InputField

                label="Email Address"

                text="email"

                disabled

                type="email"

                id="email"

                name="email"

                value={formData.email}

              />



              <InputField

                label="Phone Number"

                text="phone"

                disabled

                type="text"

                id="phone"

                name="phone"

                value={formData.phone}

              />


              {/* 
              <InputField

                label="Location"

                text="location"

                placeholder="Enter address here"

                type="text"

                id="location"

                name="location"

                value={formData.location}

                onChange={handleChange}

              /> */}


            </div>

          </div>





          {/* Birthday and Special Dates */}
          <div className="mt-6">
            <div>
              <label className="block text-[14px] font-medium mb-2">
                Add Birthday and Special Dates
              </label>

              <TagsInputField setModalIsOpen={setModalIsOpen} />

              {specialDatesData && (
                <div className="border border-gray-300 rounded-[13px] overflow-hidden mt-2 divide-y divide-gray-200">
                  {/* DOB Row */}
                  {specialDatesData?.dobDate && (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50">
                      <div className="text-[#181818] text-[14px] font-medium">
                        <span className="mr-2 font-semibold"> Birthday:</span>
                        {specialDatesData.dobDate.day}-
                        {specialDatesData.dobDate.month}
                        {specialDatesData.dobDate.year ? `-${specialDatesData.dobDate.year}` : ""}
                      </div>
                    </div>
                  )}

                  {/* Special Dates Rows */}
                  {Array.isArray(specialDatesData?.specialDates) &&
                    specialDatesData.specialDates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 px-4 py-2.5">
                        <div className="text-[#181818] text-[14px] font-medium break-all break-words min-w-0 pr-2">
                          <span className="mr-2 font-semibold">{date.title}:</span>
                          {date.day} - {date.month}
                          {date.year ? ` - ${date.year}` : ""}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = specialDatesData.specialDates.filter((_, i) => i !== index);
                            setSpecialDatesData({
                              ...specialDatesData,
                              specialDates: updated,
                            });
                          }}
                          className="cursor-pointer"
                        >
                          <img src={binIcon} alt="bin" className="w-5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Save */}
          <div className="mt-8 flex justify-center">
            <div className="w-[40%]">
              <Button
                text={isPending ? "Saving..." : "Save"}
                type="button"
                disabled={isPending}
                onClick={handleSave}
              />
            </div>
          </div>
        </div>
      </div>

      {modalIsOpen && (
        <TagsModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          initialData={specialDatesData}
          setFieldValue={handleTagsFieldValue}
          setFieldError={() => { }}
        />
      )}

      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropSourceImage}
        originalFile={rawFileToCrop}
        onClose={handleCloseCropper}
        onCropComplete={handleCropComplete}
      />



    </div>
  );
};


export default EditProfileModal;