/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";
import InputField from "../auth/InputField";
import Button from "../global/Button";
import { mapImg, userImage } from "../../assets/export";
import { useState } from "react";
import TagsInputField from "../onBoarding/TagsInputField";
import TagsModal from "../onBoarding/TagsModal";
import { useUpdateProfile } from "../../hooks/queries/useQueries";
import { useQueryClient } from "@tanstack/react-query";

const EditProfileModal = ({
  onClose,
  onClick,
  initialData = {},
}) => {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dateModalData, setDateModalData] = useState("");

  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending } =
    useUpdateProfile();


  const dobData = initialData?.specialDates?.find(
    (item) => item.occasion === "DOB"
  );


  const [formData, setFormData] = useState({
    name:
      `${initialData?.firstName || ""} ${
        initialData?.lastName || ""
      }`.trim(),

    email: initialData?.email || "",

    phone: initialData?.phoneNumber || "",

    location: initialData?.location || "",

    birthday: dobData?.date || "",
  });



  const closeModal = () => {
    setModalIsOpen(false);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSave = () => {

    const nameParts = formData.name.trim().split(" ");


    const payload = {

      firstName: nameParts[0] || "",

      lastName:
        nameParts.slice(1).join(" ") || "",


      specialDates: formData.birthday
        ? [
            {
              occasion: "DOB",
              date: formData.birthday,
            },
          ]
        : [],

    };


    updateProfile(payload, {

      onSuccess: () => {

        queryClient.invalidateQueries([
          "profile",
        ]);

        onClick?.();

        onClose();

      },


      onError: (error) => {

        console.log(
          "Update profile error:",
          error
        );

      },

    });

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

          <div className="relative">

            <img
  src={
    initialData?.profilePicture?.location ||
    userImage
  }
  alt="avatar"
  className="w-28 h-28 rounded-full object-cover"
/>


            <button
              type="button"
              className="absolute bottom-2 left-20 bg-white rounded-full shadow p-2"
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



              <InputField

                label="Location"

                text="location"

                placeholder="Enter address here"

                type="text"

                id="location"

                name="location"

                value={formData.location}

                onChange={handleChange}

              />


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
  setFieldValue={(field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }}
  setDateModalData={(data) => {
    setDateModalData(data);

    if (data?.dobDate) {
      const { day, month, year } = data.dobDate;

      setFormData((prev) => ({
        ...prev,
        birthday: `${year}-${month}-${day}`,
      }));
    }
  }}
/>

      )}



    </div>
  );
};


export default EditProfileModal;