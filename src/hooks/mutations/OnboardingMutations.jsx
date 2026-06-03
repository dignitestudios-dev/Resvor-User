import { submitLogin, submitSignUp, submitVerifyEmail, submitPersonalDetails, submitVerifyPhone, submitPreferences,submitForgotPassword,submitVerifyForgotOtp,submitResetPassword, getLounges } from "../api/Post";
import { useMutation } from "@tanstack/react-query";


export const useSignUp = () => {
  return useMutation({
    mutationFn: submitSignUp,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: submitLogin,
  });
};

//forgotpassword 
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: submitForgotPassword,
  });
};

export const useVerifyForgotOtp = () => {
  return useMutation({
    mutationFn: submitVerifyForgotOtp,
  });
};


export const useResetPassword = () => {
  return useMutation({
    mutationFn: submitResetPassword,
  });
};


export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: submitVerifyEmail,
  });
};


export const useVerifyPhone = () => {
  return useMutation({
    mutationFn: submitVerifyPhone,
  });
};

export const usePersonalDetails = () => {
  return useMutation({
    mutationFn: submitPersonalDetails,
  });
};

// hooks/usePreferences.js
export const usePreferences = () => {
  return useMutation({
    mutationFn: submitPreferences,
  });
};

export const useGetLounges = () => {
  return useMutation({
    mutationFn: getLounges,
  });
};
