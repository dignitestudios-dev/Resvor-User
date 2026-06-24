/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import InputField from "../auth/InputField";
import { useFormik } from "formik";
import { changPasswordValues } from "../../init/app/appValues";
import { changePasswordSchema } from "../../schema/app/appSchema";
import { useState } from "react";
import TagsModal from "../onBoarding/TagsModal";
import LoungeSelectField from "../global/LoungeSelectField";
import { useLounges, useAuthMe } from "../../hooks/queries/useQueries";
import { addGuest } from "../../hooks/api/Post";
import { useAddGuest } from "../../hooks/mutations/OnboardingMutations";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import { guestbookSchema } from "../../schema/app/appSchema";
// import { ErrorToast, SuccessToast } from "../global/Toaster";
import { useQueryClient } from "@tanstack/react-query"; // <-- IMPORT THIS

const AddGuestModal = ({ onClose }) => {
  const [dateModalData, setDateModalData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
const queryClient = useQueryClient(); // <-- INITIALIZE QUERY CLIENT
  const closeModal = () => setModalIsOpen(false);
  const { mutate: addGuestMutation, isPending } = useAddGuest();

  // Fetch lounges exactly like Home.jsx
  const { data: loungesResponse, isLoading } = useLounges();
  const { data: authData } = useAuthMe();
  console.log("🚀 ~ AddGuestModal ~ authData:", authData)

  const loungeOptions =
    loungesResponse?.data?.map((lounge) => ({
      label: lounge.name,
      value: lounge._id,
    })) || [];

const {
  values,
  handleBlur,
  handleChange,
  errors,
  touched,
  handleSubmit,
  setFieldValue,
  setFieldTouched,
} = useFormik({
  enableReinitialize: true,
  initialValues: {
    name: authData?.data?.firstName + authData?.data?.lastName || authData?.data?.user?.firstName + authData?.data?.user?.lastName || "",
    email: authData?.data?.email || authData?.data?.user?.email || "",
    lounge: "",
  },
  validationSchema: guestbookSchema,

  onSubmit: (values) => {
    const payload = {
      loungeId: values.lounge,
      fullName: values.name.trim(),
      email: values.email.trim(),
    };

    addGuestMutation(payload, {
      onSuccess: (response) => {
        console.log("Guest added:", response);
        SuccessToast("Guest added successfully!");
        queryClient.invalidateQueries({ queryKey: ["guestbook"] });
        onClose();
      },
      onError: (error) => {
        console.log("Add guest failed:", error);
        ErrorToast("Failed to add guest.");
      },
    });
  },
});

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] h-auto w-[490px] max-w-[95%] pb-10 overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 border-b border-b-[#00000033]">
          <h2 className="text-[28px] font-bold mb-4">Add New</h2>

          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 w-full pt-4 px-8">
            <InputField
              label="Full Name"
              placeholder="Full Name"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              maxLength={50}
            />

            <InputField
              label="Email address"
              placeholder="Enter Email Address"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              maxLength={50}
            />

         <LoungeSelectField
  label="Lounge Name"
  placeholder={isLoading ? "Loading lounges..." : "Search lounge..."}
  name="lounge"
  value={values.lounge}
  onChange={(value) => {
    setFieldValue("lounge", value);
    setFieldTouched("lounge", true, false); // Marks it touched safely without firing immediate error rules
  }}
  error={errors.lounge}
  touched={touched.lounge}
  options={loungeOptions}
/>
          </div>
            <div className="mt-8 mx-8">
<Button
  text={isPending ? "Adding..." : "Confirm"}
  type="submit"
  disabled={isPending}
/>        </div>
        </form>

      
      </div>

      {modalIsOpen && (
        <TagsModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          setDateModalData={setDateModalData}
        />
      )}
    </div>
  );
};

export default AddGuestModal;