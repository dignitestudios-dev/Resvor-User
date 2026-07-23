import { deleteGuest } from "../api/Delete";
import { submitLogin, submitSignUp, submitVerifyEmail, submitPersonalDetails, submitVerifyPhone, submitPreferences, submitForgotPassword, submitVerifyForgotOtp, submitResetPassword, getLounges, resendEmailVerificationOtp, submitLogout, addGuest, updateGuest, submitCampaign, submitWalletTopup, submitUpdateFcmToken, submitChangePassword } from "../api/Post";
import { useMutation } from "@tanstack/react-query";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: submitChangePassword,
  });
};


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

export const useResendEmailOtp = () => {
  return useMutation({
    mutationFn: resendEmailVerificationOtp,
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


export const useLogout = () => {
  return useMutation({
    mutationFn: submitLogout,
  });
};


export const useAddGuest = () => {
  return useMutation({
    mutationFn: addGuest,
  });
};

export const useUpdateGuest = () => {
  return useMutation({
    mutationFn: updateGuest,
  });
};

export const useDeleteGuest = () => {
  return useMutation({
    mutationFn: deleteGuest,
  });
};

export const useCreateCampaign = () => {
  return useMutation({
    mutationFn: submitCampaign,
  });
};

export const useWalletTopup = () => {
  return useMutation({
    mutationFn: submitWalletTopup,
  });
};

export const useUpdateFcmToken = () => {
  return useMutation({
    mutationFn: submitUpdateFcmToken,
  });
};