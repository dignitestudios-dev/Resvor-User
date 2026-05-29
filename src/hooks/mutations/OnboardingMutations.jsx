import { submitLogin, submitSignUp, submitVerifyEmail, submitPersonalDetails, submitVerifyPhone, submitPreferences } from "../api/Post";
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

