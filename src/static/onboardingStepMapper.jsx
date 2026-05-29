// utils/onboardingStepMapper.js
export const ONBOARDING_STEPS = {
  REGISTER: "register",
  VERIFY_EMAIL: "verify_email",
  COMPLETE_PROFILE: "complete_profile",
  VERIFY_MOBILE: "verify_mobile",
  COMPLETE_PREFERENCES: "complete_preferences",
  COMPLETED: "completed",
};

export const mapOnboardingStepToIndex = (onboardingStep) => {
  const stepMap = {
    [ONBOARDING_STEPS.REGISTER]: 0,
    [ONBOARDING_STEPS.VERIFY_EMAIL]: 1,
    [ONBOARDING_STEPS.COMPLETE_PROFILE]: 2,
    [ONBOARDING_STEPS.VERIFY_MOBILE]: 3,
    [ONBOARDING_STEPS.COMPLETE_PREFERENCES]: 4,
    [ONBOARDING_STEPS.COMPLETED]: 5,
  };

  return stepMap[onboardingStep] ?? 0; // fallback to 0 if unknown
};