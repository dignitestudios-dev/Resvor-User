import { useEffect, useState } from "react";
import { IoCall, IoMail } from "react-icons/io5";
import { FaIdCard } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import Cookies from "js-cookie";

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
import { useQueryClient } from "@tanstack/react-query";
import useApp from "../../context/AppContext";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(0);

  const { data: authData, isLoading, refetch } = useAuthMe(); // 👈 fetch current step

  const { stepName, setStepName } = useApp();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("session_id") || queryParams.get("success") === "true") {
      // Coming back from Stripe payment — mark walkthrough to show on home
      localStorage.setItem("show_welcome_walkthrough", "true");
      refetch();
    }
  }, [refetch]);

  // 👇 once API responds, set the correct step
  useEffect(() => {
    if (authData?.success) {
      // "onboarding_complete_acknowledged" means the user has explicitly clicked
      // "Explore Lounges" or "Skip" — i.e. they have seen the subscription screen.
      // Being subscribed alone (returned from Stripe) should NOT count as acknowledged
      // here, because the walkthrough still needs to show.
      const onboardingCompleteAcknowledged =
        localStorage.getItem("onboarding_complete_acknowledged") === "true";

      if (authData?.data?.onboardingStep === "completed") {
        if (onboardingCompleteAcknowledged) {
          navigate("/app/home");
          return;
        } else {
          setCurrentStep(5);
          return;
        }
      }

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
  const [phoneNumber, setPhoneNumber] = useState(
    () => localStorage.getItem("user_phone_number") || ""
  );

  const steps = providerSteps.map((step, index) => ({
    ...step,
    completed: index < currentStep,
    active: index === currentStep,
  }));

  const handleNext = (stepName) => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      if (stepName) {
        setStepName(stepName);
      }
    }
  };

  const handleClearSessionAndRedirect = () => {
    // Clear all cookies
    const allCookies = Cookies.get();
    if (allCookies) {
      Object.keys(allCookies).forEach((cookieName) => {
        Cookies.remove(cookieName);
        Cookies.remove(cookieName, { path: "/" });
      });
    }

    // Clear localStorage
    localStorage.clear();

    // Clear auth session helpers & React Query cache
    clearStoredAuthSession();
    queryClient.setQueryData(["auth-me"], null);
    queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    queryClient.clear();
    setStepName("");
    setCurrentStep(0);

    // Redirect user to signup page
    navigate("/auth/signup", { replace: true });
  };

  const handlePrevious = () => {
    handleClearSessionAndRedirect();
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
              setPhoneNumber={setPhoneNumber}
            />
          ) : currentStep === 3 ? (
            <VerifyPhone
              email={email}
              phoneNumber={
                phoneNumber ||
                authData?.data?.user?.phoneNumber ||
                authData?.data?.phoneNumber ||
                localStorage.getItem("user_phone_number") ||
                ""
              }
              setPhoneNumber={setPhoneNumber}
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
