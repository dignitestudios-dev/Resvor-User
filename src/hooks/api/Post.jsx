import axios from "../../axios";
import { useMutation } from "@tanstack/react-query";
import { processError } from "../../lib/utils";

// Generic mutation function for POST requests
const postRequest = async ({
  url,
  data,
  isFormData = false,
  formData = null,
}) => {
  const response = await axios.post(url, isFormData ? formData : data);
  return response?.data;
};

// Generic mutation hook factory
export const usePostMutation = (onSuccess, onError) => {
  return useMutation({
    mutationFn: postRequest,
    onSuccess: (data) => {
      if (typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      processError(error);
      if (typeof onError === "function") {
        onError(error);
      }
    },
  });
};

// Example: User Details Mutation
export const submitUserDetails = async (payload) => {
  const { data } = await axios.post("/auth/userDetails", payload);
  return data;
};

export const useUserDetails = (onSuccess, onError) => {
  return useMutation({
    mutationFn: submitUserDetails,
    onSuccess: (data) => {
      if (typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      processError(error);
      if (typeof onError === "function") {
        onError(error);
      }
    },
  });
};

// Example: Login Mutation
export const submitLogin = async (credentials) => {
  const { data } = await axios.post("/auth/login", credentials);
  return data;
};

export const useLogin = (onSuccess, onError) => {
  return useMutation({
    mutationFn: submitLogin,
    onSuccess: (data) => {
      if (typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      processError(error);
      if (typeof onError === "function") {
        onError(error);
      }
    },
  });
};

// Example: Sign Up Mutation
export const submitSignUp = async (payload) => {
  const { data } = await axios.post("/auth/signup", payload);
  return data;
};

export const useSignUp = (onSuccess, onError) => {
  return useMutation({
    mutationFn: submitSignUp,
    onSuccess: (data) => {
      if (typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      processError(error);
      if (typeof onError === "function") {
        onError(error);
      }
    },
  });
};
