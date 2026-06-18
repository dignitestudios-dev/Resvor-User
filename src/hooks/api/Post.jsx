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

export const resendEmailVerificationOtp = async (payload) => {
  const { data } = await axios.post(
    "/auth/email-verification-otp",
    payload
  );

  return data;
};

export const submitVerifyPhone = async (payload) => {
  
  const { data } = await axios.post("/auth/onboarding/verify-mobile-number", payload);
  return data;
};

export const submitPersonalDetails = async (payload) => {
  for (let [key, value] of payload.entries()) {
  console.log("32 Resvor -User5 ====> ~ ~ ~ ", key, value);
}
  const { data } = await axios.post("/auth/onboarding/profile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// api/onboarding.js
export const submitPreferences = async (payload) => {
  const { data } = await axios.post("/auth/onboarding/preferences", payload);
  return data;
};

// forgotpassword
export const submitForgotPassword = async (payload) => {
  const { data } = await axios.post("/auth/forgot", payload);
  return data;
};


// verify forgot password otp
export const submitVerifyForgotOtp = async (payload) => {
  const { data } = await axios.post("/auth/verify-otp", payload);
  return data;
};

//reset password 
export const submitResetPassword = async (payload) => {
  const { data } = await axios.post("/auth/update-password", payload);
  return data;
};

export const getLounges = async (payload = {}) => {
  const { data } = await axios.get("/lounges/list", payload);
  return data;
};

//logout 
export const submitLogout = async () => {
  const { data } = await axios.post("/auth/logout");
  return data;
};


export const addGuest = async (payload) => {
  const { data } = await axios.post("/guestbook", payload);
  return data;
};

export const updateGuest = async ({ entryId, payload }) => {
  const { data } = await axios.patch(`/guestbook/${entryId}`, payload);

  return data;
};