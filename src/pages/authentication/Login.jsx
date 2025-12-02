import { useFormik } from "formik";
import { useNavigate } from "react-router";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { loginSideImg } from "../../assets/export";
import { logInSchema } from "../../schema/authentication/authSchema";
import { useState } from "react";
import { loginValues } from "../../init/authentication/authValues";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("idle");

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: loginValues,
      validationSchema: logInSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        setState("loading");
        const data = {
          email: values?.email,
          password: values?.password,
        };
        console.log("🚀 ~ Login ~ data:", data);
        navigate("/app/home");

        // Use the loading state to show loading spinner
        // Use the response if you want to perform any specific functionality
        // Otherwise you can just pass a callback that will process everything
      },
    });

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full text-white">
      <div className="p-4 justify-center lg:flex hidden">
        <div className="max-w-[489px]">
          <img src={loginSideImg} alt="logo" className="w-[489px]" />
          {/* <p className="text-[65px] font-[700]">Plan Better. Party Smarter.</p>
          <p className="text-[24px] font-[400]">
            Book top lounges or manage your own— Resvor makes every night
            seamless.
          </p> */}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-auto ">
        <div className="my-8 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
          <p className=" xxl:text-[48px] text-[36px] font-[600] capitalize">
            Log In
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] ">
            Please enter your details to login
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px]">
            <div className=" w-full">
              <AuthInput
                label={"Email Address"}
                text={"Email address"}
                placeholder={"Enter email address"}
                type={"email"}
                id={"email"}
                name={"email"}
                maxLength={30}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.email}
                touched={touched?.email}
              />
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
                maxLength={250}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.password}
                touched={touched?.password}
              />
            </div>
          </div>
          <div className="mt-2 space-y-4">
            <div className="flex justify-end xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px]">
              <p
                type="button"
                className=" xxl:text-[20px] text-[12px] font-[500] cursor-pointer"
                onClick={() => navigate("/auth/forget-password")}
              >
                Forgot password?
              </p>
            </div>

            <div className="xxl:w-[650px] lg:w-[350px] w-full md:mx-0 mx-2 mt-1 mb-4">
              <AuthButton
                text={"Login"}
                loading={state === "loading"}
                disabled={state === "loading"}
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 my-6  ">
          <p className="text-center xxl:text-[26px] text-[15px] leading-[21.6px] text-white">
            Don’t have an account?
            <span
              className="bg-gradient-to-l to-[#63CFAC] from-[#29ABE2] bg-clip-text xxl:text-[26px] text-[16px] font-[500] pl-1 cursor-pointer "
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
      {/* {requestModal && (
        <RequestModal setIsOpen={setRequestModal} isLogin={true} />
      )} */}
    </div>
  );
};

export default Login;
