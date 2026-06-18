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

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(0);

  const { data: authData, isLoading, refetch } = useAuthMe(); // 👈 fetch current step
console.log("🚀 ~ SignUp ~ authData:", authData);
const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("session_id") || queryParams.get("success") === "true") {
      refetch();
    }
  }, [refetch]);
  // 👇 once API responds, set the correct step
  useEffect(() => {
    if (authData?.success) {
      const queryParams = new URLSearchParams(window.location.search);
      const hasSuccessParam = queryParams.get("session_id") || queryParams.get("success") === "true";
      const onboardingCompleteAcknowledged = localStorage.getItem("onboarding_complete_acknowledged") === "true";

      if (authData?.data?.onboardingStep === "completed") {
        if (onboardingCompleteAcknowledged) {
          navigate("/app/home");
          return;
        } else {
          setCurrentStep(5);
          return;
        }
      }

      if (hasSuccessParam) {
        setCurrentStep(5);
        return;
      }

      const stepIndex = mapOnboardingStepToIndex(authData?.data?.onboardingStep);
      setCurrentStep(stepIndex);
    } else if (!isLoading) {
      setCurrentStep(0); // fallback if API fails
    }
  }, [authData, isLoading]);

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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
              email={email}
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
