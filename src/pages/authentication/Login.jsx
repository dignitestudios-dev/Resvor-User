import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { useState } from "react";

import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { loginSideImg } from "../../assets/export";
import { logInSchema } from "../../schema/authentication/authSchema";
import { loginValues } from "../../init/authentication/authValues";
import { useLogin } from "../../hooks/mutations/OnboardingMutations";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { setStoredTokenType } from "../../lib/authSession";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [state, setState] = useState("idle");
  const [apiError, setApiError] = useState("");

  const loginMutation = useLogin();

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues: loginValues,
    validationSchema: logInSchema,
    onSubmit: async (values) => {
  setState("loading");

  try {
    const response = await loginMutation.mutateAsync({
      email: values.email,
      password: values.password,
      role: "user",
    });

    console.log("Login Response:", response);

    if (!response?.success) {
      ErrorToast(response?.message || "Login failed");
      return;
    }

    const token = response?.data?.token || response?.token || response?.data?.accessToken || response?.accessToken || (response?.data?.data && (response.data.data.token || response.data.data.accessToken));
    const tokenType = response?.data?.tokenType || response?.tokenType || (response?.data?.data && response.data.data.tokenType) || "session_token";

    if (token) {
      Cookies.set("token", token, { expires: 7 });
      localStorage.setItem("token", token);
    }
    if (tokenType) {
      Cookies.set("tokenType", tokenType, { expires: 7 });
      localStorage.setItem("tokenType", tokenType);
    }

    setStoredTokenType(tokenType);
    await queryClient.invalidateQueries({ queryKey: ["auth-me"] });

    if (tokenType === "access_token") {
      localStorage.setItem("onboarding_complete_acknowledged", "true");
      SuccessToast("Login successful");
      navigate("/app/home", { replace: true });
    } else {
      localStorage.removeItem("onboarding_complete_acknowledged");
      // SuccessToast("Session token received. Continue on auth pages.");
      navigate("/auth/signup", { replace: true });
    }
  } catch (error) {
    console.error("Login Error:", error);

    ErrorToast(
      error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setState("idle");
  }
},
  });

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full text-white">
      <div className="p-4 justify-center lg:flex hidden">
        <div className="max-w-[489px]">
          <img src={loginSideImg} alt="logo" className="w-[489px]" />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center h-auto">
        <div className="my-8 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
          <p className="xxl:text-[48px] text-[36px] font-[600] capitalize">
            Log In
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6]">
            Please enter your details to login
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px]">
            <div className="w-full">
              <AuthInput
                label="Email Address"
                text="Email address"
                placeholder="Enter email address"
                type="email"
                id="email"
                name="email"
                maxLength={30}
                value={values.email}
                onChange={(e) => {
                  handleChange(e);
                  if (apiError) setApiError("");
                }}
                onBlur={handleBlur}
                error={errors?.email}
                touched={touched?.email}
              />
            </div>

            <div className="w-full">
              <AuthInput
                label="Password"
                text="Password"
                placeholder="Enter password here"
                type="password"
                id="password"
                name="password"
                showToggle={true}
                maxLength={64}
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                  if (apiError) setApiError("");
                }}
                onBlur={handleBlur}
                error={errors?.password}
                touched={touched?.password}
              />
            </div>
          </div>

          <div className="mt-2 space-y-4">
            <div className="flex justify-end xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px]">
              <p
                className="xxl:text-[20px] text-[12px] font-[500] cursor-pointer"
                onClick={() => navigate("/auth/forget-password")}
              >
                Forgot password?
              </p>
            </div>

            {/* API Error Message */}
            {/* {apiError && (
              <div className="xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px]">
                <p className="text-red-500 text-sm text-center font-medium">
                  {apiError}
                </p>
              </div>
            )} */}

            <div className="xxl:w-[650px] lg:w-[350px] w-full md:mx-0 mx-2 mt-1 mb-4">
              <AuthButton
                text="Login"
                loading={state === "loading"}
                disabled={state === "loading"}
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 my-6">
          <p className="text-center xxl:text-[26px] text-[15px] leading-[21.6px] text-white">
            Don’t have an account?
            <span
              className="bg-white font-semibold bg-clip-text text-transparent xxl:text-[26px] text-[16px] font-[500] pl-1 cursor-pointer"
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;