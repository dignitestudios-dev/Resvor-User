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
  const { data } = await axios.post("/auth/email-verification-otp", payload);

  return data;
};

export const submitVerifyPhone = async (payload) => {
  const { data } = await axios.post(
    "/auth/onboarding/verify-mobile-number",
    payload,
  );
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
export const submitLogout = async (payload = {}) => {
  const fcmToken =
    payload?.fcmToken ||
    localStorage.getItem("fcmToken") ||
    localStorage.getItem("fcm_token") ||
    undefined;

  if (!fcmToken) {
    localStorage.removeItem("fcmToken");
    localStorage.removeItem("fcm_token");
    return { success: true, message: "Logged out locally" };
  }

  const body = { fcmToken, ...payload };

  const { data } = await axios.post("/auth/logout", body);

  localStorage.removeItem("fcmToken");
  localStorage.removeItem("fcm_token");

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

// Campaign / Flyer
export const submitCampaign = async (payload) => {
  const { data } = await axios.post("/campaigns", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Wallet top-up (amount must be in cents)
export const submitWalletTopup = async (payload) => {
  const { data } = await axios.post("/wallet/topup/intent", payload);
  return data;
};

// Update FCM Token
export const submitUpdateFcmToken = async (payload) => {
  const { data } = await axios.post("/auth/update-fcm", payload);
  return data;
};

// Change Password
export const submitChangePassword = async (payload) => {
  const { data } = await axios.post("/auth/change-password", payload);
  return data;
};
