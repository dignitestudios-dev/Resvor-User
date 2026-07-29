/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";
import InputField from "../auth/InputField";
import Button from "../global/Button";
import { mapImg, userImage } from "../../assets/export";
import { useState, useRef } from "react";
import TagsInputField from "../onBoarding/TagsInputField";
import TagsModal from "../onBoarding/TagsModal";
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

const EditProfileModal = ({
  onClose,
  onSave,
  isPending = false,
  initialData = {},
}) => {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);


  const dobData = initialData?.specialDates?.find(
    (item) => item.occasion === "DOB"
  );


  const [formData, setFormData] = useState({
    name:
      `${initialData?.firstName || ""} ${initialData?.lastName || ""
        }`.trim(),

    email: initialData?.email || "",

    phone: initialData?.phoneNumber || "",

    location: initialData?.location || "",

    // ISO date string for DOB, e.g. "1995-06-15"
    birthday: dobData?.date ? new Date(dobData.date).toISOString().split("T")[0] : "",

    // Extra special dates from TagsModal (non-DOB)
    specialDates: [],
  });

  // Pre-fill initialData for TagsModal so existing DOB shows up
  const tagsModalInitialData = (() => {
    if (!formData.birthday) return undefined;
    const d = new Date(formData.birthday);
    if (isNaN(d.getTime())) return undefined;
    return {
      dobDate: {
        day: String(d.getDate()),
        month: String(d.getMonth() + 1),
        year: String(d.getFullYear()),
      },
      specialDates: formData.specialDates ?? [],
    };
  })();

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file type
      if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
        const errorMsg = "Only JPEG and PNG formats are allowed";
        ErrorToast(errorMsg);
        return;
      }

      // Check file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        const errorMsg = "File size must not exceed 10MB";
        ErrorToast(errorMsg);
        return;
      }

      // Check image resolution (215x215)
      const isValidResolution = await validateImageResolution(file);
      if (!isValidResolution) {
        const errorMsg = "Image resolution must be at least 215x215";
        ErrorToast(errorMsg);
        return;
      }

      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Called by TagsModal when the user clicks "Continue"
  // payload: { dobDate: { day, month, year }, specialDates: [...] }
  const handleTagsFieldValue = (field, value) => {
    if (field === "specialDatesData") {
      const { dobDate, specialDates } = value ?? {};

      // Parse DOB back to an ISO date string
      if (dobDate?.day && dobDate?.month) {
        const year = dobDate.year || new Date().getFullYear();
        const iso = `${year}-${String(dobDate.month).padStart(2, "0")}-${String(dobDate.day).padStart(2, "0")}`;
        setFormData((prev) => ({
          ...prev,
          birthday: iso,
          specialDates: specialDates ?? [],
        }));
      }

      closeModal();
    }
  };

  const handleSave = () => {
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Build specialDates array: DOB first, then any extras
    const specialDates = [];
    if (formData.birthday) {
      specialDates.push({ occasion: "DOB", date: formData.birthday });
    }
    if (Array.isArray(formData.specialDates)) {
      formData.specialDates.forEach((d) => {
        if (d.title && d.day && d.month) {
          const year = d.year || new Date().getFullYear();
          specialDates.push({
            occasion: d.title,
            date: `${year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`,
          });
        }
      });
    }

    const fields = { firstName, lastName, specialDates };

    // Pass structured fields + raw image file up to ProfileDetail
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
              accept="image/*"
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





          {/* Birthday */}

          <div className="mt-6 grid grid-cols-2 gap-6">


            <div>

              <label className="block text-[14px] font-medium mb-2">
                Add birthday and special dates
              </label>


              <TagsInputField
                setModalIsOpen={
                  setModalIsOpen
                }
              />



              {formData.birthday && (

                <div className="border rounded-xl p-3 mt-2">

                  Date of Birth:

                  {" "}

                  {new Date(
                    formData.birthday
                  ).toLocaleDateString()}


                </div>

              )}


            </div>




            <div>

              <img
                src={mapImg}
                alt="map"
                className="rounded-lg"
              />

            </div>


          </div>





          {/* Save */}

          <div className="mt-8 flex justify-center">


            <div className="w-[40%]">


              <Button

                text={
                  isPending
                    ? "Saving..."
                    : "Save"
                }

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
          initialData={tagsModalInitialData}
          setFieldValue={handleTagsFieldValue}
          setFieldError={() => { }} // no-op – errors shown inside TagsModal
        />
      )}



    </div>
  );
};


export default EditProfileModal;