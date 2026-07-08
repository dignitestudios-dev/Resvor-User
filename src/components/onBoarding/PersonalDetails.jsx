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
import { ErrorToast } from "../global/Toaster";
import { usePersonalDetails } from "../../hooks/mutations/OnboardingMutations";
import PhoneInput from "../auth/PhoneInput";
import { phoneFormatter, phoneToE164 } from "../../lib/helpers";
import Cookies from "js-cookie";
import { setStoredTokenType } from "../../lib/authSession";

const PersonalDetails = ({ handleNext, handlePrevious }) => {
  // const [dateModalData, setDateModalData] = useState("");
  const [fieldError, setFieldError] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageError, setImageError] = useState("");
  const closeModal = () => setModalIsOpen(false);

  const personalDetailsMutation = usePersonalDetails();

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
      console.log("values----------> 42424242424 ", values)

      if (!values?.specialDatesData || values.specialDatesData.length === 0) {
        setFieldError("specialDatesData", "Birthday is required");
        return;
      }

      try {
        const formData = new FormData();

        // Basic fields
        formData.append("fullName", values.fullName);
        formData.append("phoneNumber", phoneToE164(values.number) || "");

        // specialDates — DOB always at index[0], then loop specialDates
        if (values.specialDatesData?.dobDate) {
          const dob = values.specialDatesData.dobDate;
          formData.append(`specialDates[0][occasion]`, "DOB");
          formData.append(`specialDates[0][date]`, `${dob.month}-${dob.day}-${dob.year}`);
        }

        if (Array.isArray(values.specialDatesData?.specialDates) && values.specialDatesData.specialDates.length > 0) {
          values.specialDatesData.specialDates.forEach((date, index) => {
            const i = index + 1; // 👈 offset by 1 since DOB occupies index[0]
            formData.append(`specialDates[${i}][occasion]`, date.title);
            formData.append(`specialDates[${i}][date]`, `${date.month}-${date.day}-${date.year}`);
          });
        }

        // Profile picture — values.profile is a File object set via setFieldValue("profile", file)
        if (values.profile instanceof File) { // 👈 instanceof File ensures it's an actual file not a string/null
          formData.append("profilePicture", values.profile);
        }



        const response = await personalDetailsMutation.mutateAsync(formData);

        if (response?.success) {
          // Persist any token returned by this step
          const token = response?.data?.token || response?.data?.accessToken;
          const tokenType = response?.data?.tokenType;
          if (token) {
            Cookies.set("token", token, { expires: 7 });
            localStorage.setItem("token", token);
          }
          if (tokenType) {
            Cookies.set("tokenType", tokenType, { expires: 7 });
            localStorage.setItem("tokenType", tokenType);
            setStoredTokenType(tokenType);
          }
          handleNext();
        } else {
          ErrorToast(response?.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Personal details error:", error);
        ErrorToast(error?.response?.data?.message || "Something went wrong. Please try again.");
      }
    },
  });



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

  const handleFileChange = async (e) => {
    const file = e.currentTarget.files?.[0];
    setImageError("");

    if (file) {
      // Check file type
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        const errorMsg = "Only JPEG and PNG formats are allowed";
        setImageError(errorMsg);
        ErrorToast(errorMsg);
        return;
      }

      // Check file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        const errorMsg = "File size must not exceed 10MB";
        setImageError(errorMsg);
        ErrorToast(errorMsg);
        return;
      }

      // Check image resolution (215x215)
      const isValidResolution = await validateImageResolution(file);
      if (!isValidResolution) {
        const errorMsg = "Image resolution must be at least 215x215";
        setImageError(errorMsg);
        ErrorToast(errorMsg);
        return;
      }

      // If all validations pass, set file in Formik state
      setFieldValue("profile", file);
      // set preview separately
      setFieldValue("userImage", URL.createObjectURL(file));
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-auto ">
      {/* <div className="flex justify-start items-center absolute top-12 left-0">
        <button type="button" onClick={() => handlePrevious()}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div> */}
      <div className="mt-4 xxl:w-[400px] xxl:ml-12 text-center space-y-4">
        <p className="xxl:text-[48px] text-[32px] text-[#E6E6E6] font-[600] capitalize">
          Personal Details
        </p>
        <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6]  ">
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
              {imageError && (
                <p className="text-red-600 text-xs mt-1">{imageError}</p>
              )}
              {touched.profile && errors.profile && !imageError && (
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
          <PhoneInput
            label={"Phone Number"}
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
            <label className="block text-[14px] font-[500] text-white mb-2">
              Add Birthday and Special Dates
            </label>

            <TagsInputField setModalIsOpen={setModalIsOpen} />

            {values?.specialDatesData && (
              <div className="border border-gray-400 rounded-[13px] overflow-hidden mt-2 divide-y divide-gray-700">

                {/* DOB Row */}
                {values.specialDatesData?.dobDate && (
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="text-[#FFFFFF] text-[14px] font-thin">
                      <span className=" mr-2"> Birthday</span>
                      {values.specialDatesData.dobDate.day}-
                      {values.specialDatesData.dobDate.month}
                      {values.specialDatesData.dobDate.year ? `-${values.specialDatesData.dobDate.year}` : ""}
                    </div>
                    {/* DOB is required so no delete button, or add one if needed */}
                  </div>
                )}

                {/* Special Dates Rows */}
                {Array.isArray(values.specialDatesData?.specialDates) &&
                  values.specialDatesData.specialDates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between px-4 py-2.5">
                      <div className="text-[#FFFFFF] text-[14px] font-thin">
                        <span className=" mr-2">{date.title}</span>
                        {date.day} - {date.month}
                        {date.year ? ` - ${date.year}` : ""}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = values.specialDatesData.specialDates.filter((_, i) => i !== index);
                          setFieldValue("specialDatesData", {
                            ...values.specialDatesData,
                            specialDates: updated,
                          });
                        }}
                      >
                        <img src={binIcon} alt="bin" className="w-5" />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {errors.specialDatesData && (
              <p className="text-red-600 text-[12px] mt-1">{errors.specialDatesData}</p>
            )}
            {/* {dateModalData && (
              <div
                className={`flex items-end border border-gray-400 text-sm rounded-[13px] overflow-hidden p-[2px] mt-1.5`}
              >
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
                      <img src={binIcon} alt="bin" className="pr-2 w-7" />
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
          {/* <div className=" w-full">
            <AuthInput
              label={"Location"}
              text={"location"}
              placeholder={"Enter address here"}
              type={"text"}
              id={"location"}
              name={"location"}
              maxLength={100}
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.location}
              touched={touched?.location}
            />
          </div>
          <div>
            <img src={mapImg} alt="map" className="mt-1 rounded-xl" />
          </div> */}
        </div>
        <div className="mt-6 ">
          <div className="xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px] mt-1 mb-4">
            <AuthButton
              text={"Next"}
              loading={personalDetailsMutation.isPending}
            />
          </div>
        </div>
      </form>
      {modalIsOpen && (
        <TagsModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          setFieldValue={setFieldValue}
          setFieldError={setFieldError}
          initialData={values.specialDatesData}
        />
      )}
    </div>
  );
};

export default PersonalDetails;
