import { useEffect, useState } from "react";
import { IoCall, IoMail } from "react-icons/io5";
import { FaIdCard } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";

import OnboardingStepper from "../../components/onBoarding/OnboardingSteps";
import { HiCalendarDateRange } from "react-icons/hi2";
import CreateAccount from "../../components/onBoarding/CreateAccount";
import VerifyEmail from "../../components/onBoarding/VerifyEmail";
import VerifyPhone from "./../../components/onBoarding/VerifyPhone";
import PersonalDetails from "./../../components/onBoarding/PersonalDetails";
import Preferences from "../../components/onBoarding/Preferences";
import { FaClipboardList } from "react-icons/fa";
import Subscription from "../../components/onBoarding/Subscription";
import { mapOnboardingStepToIndex } from "../../static/onboardingStepMapper";
import { useAuthMe } from "../../hooks/queries/useQueries";
import { useNavigate } from "react-router";
import { clearStoredAuthSession } from "../../lib/authSession";
import { useLogout } from "../../hooks/mutations/OnboardingMutations";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorToast } from "../../components/global/Toaster";
import useApp from "../../context/AppContext";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(0);

  const { data: authData, isLoading, refetch } = useAuthMe(); // 👈 fetch current step
  console.log("🚀 ~ SignUp ~ authData:", authData?.data?.onboardingStep);
  const { stepName, setStepName } = useApp();
  console.log("🚀 ~ SignUp ~ stepName:", stepName)
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("session_id") || queryParams.get("success") === "true") {
      refetch();
    }
  }, [refetch]);
  // 👇 once API responds, set the correct step
  useEffect(() => {
    if (authData?.success) {
      // const queryParams = new URLSearchParams(window.location.search);
      // const hasSuccessParam = queryParams.get("session_id") || queryParams.get("success") === "true";
      const onboardingCompleteAcknowledged =
        localStorage.getItem("onboarding_complete_acknowledged") === "true" ||
        authData?.data?.isSubscribed || authData?.data?.user?.isSubscribed;

      if (authData?.data?.onboardingStep === "completed") {
        if (onboardingCompleteAcknowledged) {
          navigate("/app/home");
          return;
        } else {
          setCurrentStep(5);
          return;
        }
      }

      // if (hasSuccessParam) {
      //   setCurrentStep(5);
      //   return;
      // }

      const stepIndex = mapOnboardingStepToIndex(stepName || authData?.data?.onboardingStep);
      setCurrentStep(stepIndex);
    } else if (!isLoading) {
      setCurrentStep(0); // fallback if API fails
    }
  }, [authData, isLoading, navigate, stepName]);

  const providerSteps = [
    { icon: IoMdPerson, title: "Your Details" },
    { icon: IoMail, title: "Verify Email" },
    { icon: FaIdCard, title: "Personal details" },
    { icon: IoCall, title: "Verify Number" },

    { icon: HiCalendarDateRange, title: "Preferences" },
    { icon: FaClipboardList, title: "Subscription" },
  ];
  const [email, setEmail] = useState("");
  console.log("🚀 ~ SignUp ~ email:", email);
  const steps = providerSteps.map((step, index) => ({
    ...step,
    completed: index < currentStep,
    active: index === currentStep,
  }));

  const handleNext = (stepName) => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      if (stepName) {
        setStepName(stepName)
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      queryClient.setQueryData(["auth-me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      queryClient.clear();
      clearStoredAuthSession();
      setStepName("");

      navigate("/auth/signup", { replace: true });
    } catch (error) {
      if (error?.code === "NO_INTERNET") {
        ErrorToast(error.message);
      } else {
        ErrorToast(
          error?.response?.data?.message ||
          "An error occurred during logout. Please try again.",
        );
      }
    }
  };

  const handlePrevious = () => {
    handleLogout();
  };

  return (
    <div className={`grid grid-cols-12 gap-6 h-full w-full`}>
      <OnboardingStepper steps={steps} currentStep={currentStep} />

      <div className="col-span-12 lg:col-span-8 px-5 md:px-10 h-full flex justify-center items-center">
        <div
          className={`w-full relative flex justify-center flex-col items-center h-full `}
        >
          {currentStep === 0 ? (
            <CreateAccount setEmail={setEmail} handleNext={handleNext} />
          ) : currentStep === 1 ? (
            <VerifyEmail
              email={email || authData?.data?.user?.email}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />

          ) : currentStep === 2 ? (
            <PersonalDetails
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          ) : currentStep === 3 ? (
            <VerifyPhone
              email={email}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          ) : currentStep === 4 ? (
            <Preferences
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          ) : currentStep === 5 ? (
            <Subscription
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
