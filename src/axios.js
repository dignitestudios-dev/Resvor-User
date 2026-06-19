import axios from "axios";
import { ErrorToast } from "./components/global/Toaster"; // Import your toaster functions
import Cookies from "js-cookie";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const baseUrl = import.meta.env.DEV 
  ? "/api" // Use Vite proxy in development
  : "https://api-dev.resvor.com"; // Use direct URL in production

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
  
  // Only set Content-Type if not FormData (FormData should be handled by browser)
  const isFormData = request.data instanceof FormData;
  const headers = {
    ...request.headers,
    "devicemodel": fingerprint,
    "deviceuniqueid": fingerprint,
  };
  
  // Add Content-Type only for non-FormData requests
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Add Bearer Token if present in client cookies
  const token = Cookies.get("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  request.headers = headers;

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
      const hasToken = Cookies.get("token");
      if (hasToken) {
        ErrorToast("Session expired. Please relogin");
        Cookies.remove("token");
        Cookies.remove("tokenType");
        Cookies.remove("token_type");
        localStorage.removeItem("resvor_auth_token_type");
        
        // Force redirect to login if not already on an auth page
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
