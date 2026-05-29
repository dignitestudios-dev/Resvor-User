import axios from "axios";
import { ErrorToast } from "./components/global/Toaster"; // Import your toaster functions
import Cookies from "js-cookie";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const baseUrl = import.meta.env.DEV 
  ? "/api" // Use Vite proxy in development
  : "https://35ppzgmv-3050.inc1.devtunnels.ms"; // Use direct URL in production

async function getDeviceFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  console.log(result.visitorId); // Unique device ID
  return result.visitorId;
}

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Enable automatic HTTP-only cookie handling
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

instance.interceptors.request.use(async (request) => {
  if (!navigator.onLine) {
    ErrorToast(
      "No internet connection. Please check your network and try again."
    );
    return Promise.reject(new Error("No internet connection"));
  }

  // Ensure credentials are sent with every request
  request.withCredentials = true;

  // Get device fingerprint and add to headers
  const fingerprint = await getDeviceFingerprint();
  
  // Add device headers and Content-Type
  request.headers = {
    ...request.headers,
    "Content-Type": "application/json",
    "devicemodel": fingerprint,
    "deviceuniqueid": fingerprint,
  };

  console.log("📤 Request:", request.url, {
    withCredentials: request.withCredentials,
    headers: request.headers,
  });

  return request;
});

instance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.config.url, {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ Request error:", error.config?.url, {
      status: error.response?.status,
      message: error.message,
    });

    if (error.code === "ECONNABORTED") {
      ErrorToast("Your internet connection is slow. Please try again.");
    }

    if (error.response && error.response.status === 401) {
      ErrorToast("Session expired. Please relogin");
    }

    return Promise.reject(error);
  }
);

export default instance;
