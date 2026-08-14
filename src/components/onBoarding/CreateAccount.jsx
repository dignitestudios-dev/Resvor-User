"use client";
/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import AuthButton from "../auth/AuthButton";
import AuthInput from "../auth/AuthInput";
import { useNavigate } from "react-router";
// import { phoneFormatter } from "../../lib/helpers";
// import PhoneInput from "../auth/PhoneInput";
import { signUpSchema } from "../../schema/authentication/authSchema";
import { signUpValues } from "../../init/authentication/authValues";
import PhoneInput from "../auth/PhoneInput";
import { ErrorToast } from "../global/Toaster";
// import CountrySelect from "./CountrySelect";
import { phoneFormatter } from "./../../lib/helpers";
import Cookies from "js-cookie";
import { useSignUp } from "../../hooks/mutations/OnboardingMutations";
import { setStoredTokenType } from "../../lib/authSession";

const CreateAccount = ({ handleNext, setEmail }) => {
  const navigate = useNavigate();


  // eslint-disable-next-line no-unused-vars
  const signupMutation = useSignUp();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched, isValid } =
    useFormik({
      initialValues: signUpValues,
      validationSchema: signUpSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        try {
          const data = {
            email: values.email,
            password: values.password,
            role: "user",
          };

          const response = await signupMutation.mutateAsync(data);

          if (response?.success) {
            const token = response?.data?.token || response?.token || response?.data?.accessToken || response?.accessToken || (response?.data?.data && (response.data.data.token || response.data.data.accessToken));
            const tokenType = response?.data?.tokenType || response?.tokenType || (response?.data?.data && response.data.data.tokenType) || "session_token";

            if (token) {
              Cookies.set("token", token, { expires: 7 });
              localStorage.setItem("token", token);
            }
            if (tokenType) {
              Cookies.set("tokenType", tokenType, { expires: 7 });
              localStorage.setItem("tokenType", tokenType);
              setStoredTokenType(tokenType);
            }

            localStorage.removeItem("onboarding_complete_acknowledged");
            Cookies.set("email", values.email, { expires: 1 });
            setEmail(values.email);
            handleNext();
          } else {
            ErrorToast(response?.message || "Something went wrong. Please try again.");
          }
        } catch (error) {
          console.error("Signup error:", error);
          ErrorToast(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
      },
    });

  return (
    <div className="flex flex-col justify-center items-center h-auto ">
      <div className="mt-4 xxl:w-[400px] xxl:ml-12 text-center space-y-4">
        <p className="xxl:text-[48px] text-[32px] text-[#E6E6E6] font-[600] capitalize">
          sign up
        </p>
        <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] ">
          Please enter your details to create an account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px] mt-10">
          {/* <div className=" w-full">
            <AuthInput3
            p 
              label={"Name"}
              text={"Name"}
              placeholder={"Enter your name"}
              type={"text"}
              id={"name"}
              name={"name"}
              maxLength={30}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.email}
              touched={touched?.email}
            />
          </div> */}
          <div className=" w-full">
            <AuthInput
              label={"Email Address"}
              text={"Email address"}
              placeholder={"Enter email address"}
              type={"email"}
              id={"email"}
              name={"email"}
              maxLength={60}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.email}
              touched={touched?.email}
            />
          </div>
          <div>
            {/* <CountrySelect value={country} onChange={setCountry} /> */}

            {/* <PhoneInput
              label={"Phone Number"}
              value={phoneFormatter(values.number)}
              id={"number"}
              name={"number"}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.number}
              touched={touched.number}
              autoComplete="off"
            /> */}
          </div>
          <div className=" w-full">
            <AuthInput
              label={"Password"}
              text={"Password"}
              placeholder={"Enter password here"}
              type={"password"}
              id={"password"}
              name={"password"}
              showToggle={true}
              maxLength={60}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.password}
              touched={touched?.password}
            />
          </div>
          <div className=" w-full">
            <AuthInput
              label={"Confirm Password"}
              text={"Confirm Password"}
              placeholder={"Re-enter password here"}
              type={"password"}
              id={"confPassword"}
              name={"confPassword"}
              showToggle={true}
              maxLength={60}
              // value={values.confPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.confPassword}
              touched={touched?.confPassword}
            />
          </div>
        </div>
        <div className="mt-6 flex items-start gap-2 text-[12px] text-[#CACACA]">
          <input
            type="checkbox"
            checked={values.acceptedPolicy}
            onChange={handleChange}
            onBlur={handleBlur}
            id="acceptedPolicy"
            name="acceptedPolicy"
            className="mt-[2px] h-3 w-3 cursor-pointer accent-indigo-600"
          />

          <div className="flex flex-col gap-1 flex-1">
            <span>
              I accept the{" "}
              <span
                className="text-[#E6E6E6] font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/auth/terms")}
              >
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span
                className="text-[#E6E6E6] font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/auth/privacy")}
              >
                Privacy Policy
              </span>
            </span>
            {errors.acceptedPolicy && touched.acceptedPolicy && (
              <p className="text-red-500 text-[11px] font-medium mb-2">
                {errors.acceptedPolicy}
              </p>
            )}
          </div>
        </div>
        <div className="mt-1 ">
          <div className="xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px] mt-1 mb-4">
            <AuthButton
              text={"Sign Up"}
              disabled={!isValid}
              loading={signupMutation.isPending}
            />
          </div>
        </div>
      </form>

      <div className="flex items-center justify-center gap-2 ">
        <p className="text-center xxl:text-[26px] text-[15px] leading-[21.6px] text-white">
          Already have an account?
          <span
            className="xxl:text-[26px] text-[14px] font-[600] pl-1 cursor-pointer text-white"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
