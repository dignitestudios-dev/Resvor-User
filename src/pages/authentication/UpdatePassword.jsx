import { useLogin } from "../../hooks/api/Post";
import { useFormik } from "formik";
import { loginValues } from "../../init/authentication/dummyLoginValues";
import { useNavigate } from "react-router";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { forgotLogo } from "../../assets/export";
import { useState } from "react";
import AuthSuccessModal from "./../../components/auth/AuthSuccessModal";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [requestSendModal, setRequestSendModal] = useState(false);

  const { loading } = useLogin();

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: loginValues,
      validationSchema: "",
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values, action) => {
        console.log("🚀 ~ ForgotPassword ~ action:", action);
        setRequestSendModal(true);
        // const data = {
        //   email: values?.email,
        //   password: values?.password,
        // };
        // postData("/auth/login", false, null, data, processLogin);

        // Use the loading state to show loading spinner
        // Use the response if you want to perform any specific functionality
        // Otherwise you can just pass a callback that will process everything
      },
    });
  return (
    <div className="grid lg:grid-cols-1 grid-cols-1 w-full text-white">
      <div className="flex flex-col justify-center items-center h-auto ">
        <div>
          <img src={forgotLogo} alt="logo" className="w-[220px]" />
        </div>
        <div className="mt-4 py-4 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
          <p className=" xxl:text-[48px] text-[32px] font-[600] capitalize">
            create new password
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] capitalize ">
            Enter your new password to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[360px] md:w-[550px] w-[320px] mt-4">
            <div className=" w-full">
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
            <div className=" w-full">
              <AuthInput
                label={"Confirm Password"}
                text={"Password"}
                placeholder={"Re-enter password here"}
                type={"password"}
                id={"confPassword"}
                name={"confPassword"}
                showToggle={true}
                maxLength={250}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.password}
                touched={touched?.password}
              />
            </div>
          </div>
          <div className="xxl:w-[650px] w-[360px] mt-6 mb-4">
            <AuthButton text={"Update"} loading={loading} disabled={loading} />
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
          title="Password Updated"
          description="Your password has been updated successfully."
        />
      )}
    </div>
  );
};

export default UpdatePassword;
