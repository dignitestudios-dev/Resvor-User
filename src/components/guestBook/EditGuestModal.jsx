/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import InputField from "../auth/InputField";
import { useFormik } from "formik";
import { useState } from "react";
import TagsModal from "../onBoarding/TagsModal";
import LoungeSelectField from "../global/LoungeSelectField";
import { useLounges } from "../../hooks/queries/useQueries";
import { useUpdateGuest } from "../../hooks/mutations/OnboardingMutations";
import { SuccessToast, ErrorToast } from "../global/Toaster";
import { guestbookSchema } from "../../schema/app/appSchema";
import { useQueryClient } from "@tanstack/react-query"; // <-- IMPORT THIS

const EditGuestModal = ({ onClose, guestData }) => {
  const [dateModalData, setDateModalData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  const queryClient = useQueryClient(); // <-- INITIALIZE QUERY CLIENT

  const closeModal = () => setModalIsOpen(false);

  const { data: loungesResponse, isLoading } = useLounges();
  const { mutate: updateGuestMutation, isPending } = useUpdateGuest();

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
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: guestData?.fullName || "",
      email: guestData?.email || "",
      // lounge: guestData?.loungeId?._id || "", // Adjusted to default populate lounge safely if present
    },

    validationSchema: guestbookSchema,

    onSubmit: (values) => {
      updateGuestMutation(
        {
          entryId: guestData?._id,
          payload: {
            loungeId: values.lounge,
            fullName: values.name.trim(),
            email: values.email.trim(),
          },
        },
        {
          onSuccess: () => {
            // INVALIDATE THE GUESTBOOK QUERY KEY
            // Note: Verify if your hook uses a string key like "guestbook" or an array like ["guestbook"]
            queryClient.invalidateQueries({ queryKey: ["guestbook"] }); 
            
            SuccessToast("Guest updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error(error);
            ErrorToast("Failed to update guest.");
          },
        }
      );
    },
  });

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] h-auto w-[490px] max-w-[95%] pb-10 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-4 border-b border-b-[#00000033]">
          <h2 className="text-[28px] font-bold mb-4">Edit Guest</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        {/* Form */}
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

            {/* <LoungeSelectField
              label="Lounge Name"
              placeholder={isLoading ? "Loading lounges..." : "Search lounge..."}
              name="lounge"
              value={values.lounge}
              onChange={(value) => setFieldValue("lounge", value)}
              onBlur={handleBlur}
              error={errors.lounge}
              touched={touched.lounge}
              options={loungeOptions}
            /> */}
          </div>

          <div className="mt-8 mx-8">
            <Button
              text={isPending ? "Updating..." : "Update Guest"}
              type="submit"
              disabled={isPending}
            />
          </div>
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

export default EditGuestModal;