/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import InputField from "../auth/InputField";
import { useFormik } from "formik";
import { changPasswordValues } from "../../init/app/appValues";
import { changePasswordSchema } from "../../schema/app/appSchema";
import PhoneInput from "../auth/PhoneInput";
import { phoneFormatter } from "../../lib/helpers";
import TagsInputField from "../onBoarding/TagsInputField";
import { useState } from "react";
import { binIcon } from "../../assets/export";
import TagsModal from "../onBoarding/TagsModal";

const EditGuestModal = ({ onClose, guestData }) => {
  const [dateModalData, setDateModalData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);

  const { values, handleBlur, handleChange, errors, touched, handleSubmit } =
    useFormik({
      initialValues: {
        name: guestData?.name || "",
        email: guestData?.email || "",
        number: guestData?.phone || "",
        lounge: guestData?.lounge || "",
        ...changPasswordValues,
      },
      validationSchema: changePasswordSchema,
      onSubmit: async (values) => {
        console.log("🚀 ~ EditGuestModal ~ values:", values);
        onClose();
      },
    });

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-10 overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 border-b border-b-[#00000033]">
          <h2 className="text-[28px] font-bold mb-4">Edit Entry</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 w-full pt-4 px-8">
            <InputField
              type="text"
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
            <label
              htmlFor=""
              className="text-[14px] text-[#181818] font-[500] -mb-4"
            >
              Phone Number
            </label>
            <PhoneInput
              value={phoneFormatter(values.number)}
              id={"number"}
              name={"number"}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.number}
              touched={touched.number}
              autoComplete="off"
            />
            <div>
              <label className="block text-[14px] font-[500] text-[#181818] mb-2">
                Add birthday and special dates
              </label>

              <TagsInputField setModalIsOpen={setModalIsOpen} />
              {dateModalData && (
                <div
                  className={`flex items-end border border-gray-400 text-sm rounded-[13px] overflow-hidden p-[2px] mt-1.5`}
                >
                  <div className="flex flex-wrap py-1 pl-4 w-[80%] text-[#FFFFFF] font-thin text-[14px]">
                    Date of Birth: {dateModalData?.dobDate?.day}{" "}
                    {dateModalData?.dobDate?.month}{" "}
                    {dateModalData?.dobDate?.year}
                  </div>
                  <div className="flex items-start h-full justify-end w-[20%]">
                    <button
                      type="button"
                      onClick={() => setDateModalData("")}
                      className="py-1.5 rounded-xl"
                    >
                      <img src={binIcon} alt="bin" className="w-7 pr-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <InputField
              label="Lounge Name"
              placeholder="Lounge Name"
              id="lounge"
              name="lounge"
              value={values.lounge}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lounge}
              touched={touched.lounge}
              maxLength={50}
            />
          </div>
        </form>
        <div className="mt-8 mx-8">
          <Button text="Update Guest" onClick={onClose} />
        </div>
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
