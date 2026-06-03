import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { forgotLogo } from "../../assets/export";
import { useState } from "react";
import AuthSuccessModal from "../../components/auth/AuthSuccessModal";
import { updatePasswordSchema } from "../../schema/authentication/authSchema";
import { updatePasswordValues } from "../../init/authentication/authValues";
import { ErrorToast } from "../../components/global/Toaster";
import { useResetPassword } from "../../hooks/mutations/OnboardingMutations";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ now getting token from sessionStorage (NOT location state)
  const resetToken = sessionStorage.getItem("resetToken");

  const [requestSendModal, setRequestSendModal] = useState(false);

  const resetPasswordMutation = useResetPassword();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: updatePasswordValues,
      validationSchema: updatePasswordSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        try {
          const response = await resetPasswordMutation.mutateAsync({
            resetToken, // ✅ from sessionStorage
            password: values.password,
          });

          if (response?.success) {
            // ✅ cleanup after success
            sessionStorage.removeItem("resetToken");

            setRequestSendModal(true);
          } else {
            ErrorToast(
              response?.message || "Something went wrong. Please try again."
            );
          }
        } catch (err) {
          console.error("Reset password error:", err);

          ErrorToast(
            err?.response?.data?.message ||
              "Something went wrong. Please try again."
          );
        }
      },
    });

  return (
    <div className="grid lg:grid-cols-1 grid-cols-1 w-full text-white">
      <div className="flex flex-col justify-center items-center h-auto ">
        <div>
          <img src={forgotLogo} alt="logo" className="w-[220px]" />
        </div>

        <div className="mt-4 py-4 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
          <p className="xxl:text-[48px] text-[32px] font-[600]">
            Create a New Password
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] font-[400] ">
            Enter a strong, secure password to update your account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px] mt-4">
            <div className="w-full">
              <AuthInput
                label={"Password"}
                text={"Password"}
                placeholder={"Enter password here"}
                type={"password"}
                id={"password"}
                name={"password"}
                showToggle={true}
                maxLength={250}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.password}
                touched={touched?.password}
              />
            </div>

            <div className="w-full">
              <AuthInput
                label={"Confirm Password"}
                text={"Password"}
                placeholder={"Re-enter password here"}
                type={"password"}
                id={"confPassword"}
                name={"confPassword"}
                showToggle={true}
                maxLength={250}
                value={values.confPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.confPassword}
                touched={touched?.confPassword}
              />
            </div>
          </div>

          <div className="xxl:w-[650px] lg:w-[350px] mt-6 mb-4">
            <AuthButton
              text={"Update"}
              loading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending}
            />
          </div>
        </form>
      </div>

      {requestSendModal && (
        <AuthSuccessModal
          isOpen={requestSendModal}
          onClick={() => {
            setRequestSendModal(false);
            navigate("/auth/login");
          }}
          title="Password Reset Successful"
          description="You can now log in with your new password."
        />
      )}
    </div>
  );
};

export default UpdatePassword;