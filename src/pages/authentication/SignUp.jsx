import { useState } from "react";
import { IoMailOutline, IoCallOutline } from "react-icons/io5";
import { LiaIdCard } from "react-icons/lia";
import { IoMdPerson } from "react-icons/io";

import OnboardingStepper from "../../components/onBoarding/OnboardingSteps";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import CreateAccount from "../../components/onBoarding/CreateAccount";
import VerifyEmail from "../../components/onBoarding/VerifyEmail";
import VerifyPhone from "./../../components/onBoarding/VerifyPhone";
import PersonalDetails from "./../../components/onBoarding/PersonalDetails";
import Preferences from "../../components/onBoarding/Preferences";
import { FaClipboardList } from "react-icons/fa";
import Subscription from "../../components/onBoarding/Subscription";
export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(0);
  const providerSteps = [
    { icon: IoMdPerson, title: "Your Details" },
    { icon: IoMailOutline, title: "Verify Email" },
    { icon: IoCallOutline, title: "Verify Number" },
    { icon: LiaIdCard, title: "Personal details" },
    { icon: HiOutlineCalendarDateRange, title: "Preferences" },
    { icon: FaClipboardList, title: "Subscription" },
  ];
  const [email, setEmail] = useState("");
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
            <VerifyPhone
              email={email}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          ) : currentStep === 3 ? (
            <PersonalDetails
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
