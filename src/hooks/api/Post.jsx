import axios from "../../axios";

// Example: User Details Mutation
export const submitSignUp = async (payload) => {
  
  const { data } = await axios.post("/auth/onboarding/register", payload);
  return data;
};


// Example: Login Mutation
export const submitLogin = async (credentials) => {
  const { data } = await axios.post("/auth/login", credentials);
  return data;
};


export const submitVerifyEmail = async (payload) => {
  
  const { data } = await axios.post("/auth/onboarding/verify-email", payload);
  return data;
};

export const submitVerifyPhone = async (payload) => {
  
  const { data } = await axios.post("/auth/onboarding/verify-mobile-number", payload);
  return data;
};

export const submitPersonalDetails = async (payload) => {
  const { data } = await axios.post("/auth/onboarding/profile", payload);
  return data;
};

// api/onboarding.js
export const submitPreferences = async (payload) => {
  const { data } = await axios.post("/auth/onboarding/preferences", payload);
  return data;
};

// Example: Sign Up Mutation

