/* eslint-disable react/prop-types */

import AuthButton from "../auth/AuthButton";
import { useFormik } from "formik";
import AuthInput from "../auth/AuthInput";
import { binIcon, mapImg, uploadIcon } from "../../assets/export";
import { useState } from "react";
import TagsInputField from "./TagsInputField";
import { FaArrowLeftLong } from "react-icons/fa6";
import TagsModal from "./TagsModal";
import { personalDetailValues } from "../../init/onBoarding/onBoardValues";
import { personalDetailSchema } from "../../schema/onBoarding/onBoardSchema";

const PersonalDetails = ({ handleNext, handlePrevious }) => {
  const [dateModalData, setDateModalData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
  } = useFormik({
    initialValues: personalDetailValues,
    validationSchema: personalDetailSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, action) => {
      console.log("🚀 ~ CreateAccount ~ action:", action);
      console.log("🚀 ~ CreateAccount ~ values:", values);
      handleNext();

      // Use the loading state to show loading spinner
      // Use the response if you want to perform any specific functionality
      // Otherwise you can just pass a callback that will process everything
    },
  });
  console.log("🚀 ~ PersonalDetails ~ errors:", errors);

  const handleFileChange = (e) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      // set file in Formik state
      setFieldValue("profile", file);
      // set preview separately
      setFieldValue("userImage", URL.createObjectURL(file));
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-auto ">
      <div className="flex justify-start items-center absolute top-12 left-0">
        <button type="button" onClick={() => handlePrevious()}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div>
      <div className="mt-4 xxl:w-[400px] xxl:ml-12 text-center space-y-4">
        <p className="xxl:text-[48px] text-[32px] text-[#E6E6E6] font-[600] capitalize">
          Personal Details
        </p>
        <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] capitalize ">
          Please enter your details to create an account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px] mt-10">
          <div className="flex items-center xl:w-[500px] lg:w-[400px] md:w-[500px] w-[320px]">
            <div className="md:w-[80px] w-[60px] md:h-[80px] h-[60px] rounded-full overflow-hidden">
              <img
                className="object-cover md:w-[80px] w-[60px] md:h-[80px] h-[60px]"
                src={values.userImage ? values.userImage : uploadIcon}
                alt="Profile Preview"
              />
            </div>
            <div className="pl-2">
              <p className="text-[#BEC2C9]">
                <span className="relative text-white capitalize underline pl-4">
                  Upload profile picture
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer -left-24"
                  />
                </span>
              </p>
              {touched.profile && errors.profile && (
                <p className="text-red-600 text-xs mt-1">{errors.profile}</p>
              )}
            </div>
          </div>
          <div className=" w-full">
            <AuthInput
              label={"Full Name"}
              text={"fullName"}
              placeholder={"Enter full name"}
              type={"text"}
              id={"fullName"}
              name={"fullName"}
              maxLength={30}
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.fullName}
              touched={touched?.fullName}
            />
          </div>
          <div>
            <label className="block text-[14px] font-[500] text-white mb-2">
              Add Birthday and Special Dates
            </label>

            <TagsInputField setModalIsOpen={setModalIsOpen} />
            {dateModalData && (
              <div
                className={`flex items-end border border-gray-400 text-sm rounded-[13px] overflow-hidden p-[2px] mt-1.5`}
              >
                <div className="flex flex-wrap py-1 pl-4 w-[80%] text-[#FFFFFF] font-thin text-[14px]">
                  Date of Birth: {dateModalData?.dobDate?.day}{" "}
                  {dateModalData?.dobDate?.month} {dateModalData?.dobDate?.year}
                </div>
                <div className="flex items-start h-full justify-end w-[20%]">
                  <button
                    type="button"
                    onClick={() => setDateModalData("")}
                    className="py-1.5 rounded-xl"
                  >
                    <img src={binIcon} alt="bin" className="pr-2 w-7" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className=" w-full">
            <AuthInput
              label={"Location"}
              text={"location"}
              placeholder={"Enter address here"}
              type={"text"}
              id={"location"}
              name={"location"}
              maxLength={30}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.email}
              touched={touched?.email}
            />
          </div>
          <div>
            <img src={mapImg} alt="map" className="mt-1 rounded-xl" />
          </div>
        </div>
        <div className="mt-6 ">
          <div className="xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px] mt-1 mb-4">
            <AuthButton text={"Next"} />
          </div>
        </div>
      </form>
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

export default PersonalDetails;
