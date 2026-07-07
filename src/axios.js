import axios from "axios";
import { ErrorToast } from "./components/global/Toaster"; // Import your toaster functions
import Cookies from "js-cookie";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

// export const baseUrl = "https://api-staging.resvor.com"
export const baseUrl = "https://api-dev.resvor.com";


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
  timeout: 30000, // 10 seconds timeout
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

  const isFormData = request.data instanceof FormData;

  // Set headers directly on request.headers to preserve AxiosHeaders methods
  request.headers["devicemodel"] = fingerprint;
  request.headers["deviceuniqueid"] = fingerprint;

  if (!isFormData) {
    request.headers["Content-Type"] = "application/json";
  }

  // Add Bearer Token if present in client cookies or localStorage
  const token = Cookies.get("token") || localStorage.getItem("token");
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }

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

    if (error.response?.data) {
      const data = error.response.data;
      if (Array.isArray(data.error)) {
        const messages = data.error.map((err) => err.message).filter(Boolean);
        if (messages.length > 0) {
          data.message = messages.join(", ");
        }
      } else if (data.error && typeof data.error === "object" && data.error.message) {
        data.message = data.error.message;
      } else if (data.error && typeof data.error === "string") {
        data.message = data.error;
      }
    }

    if (error.code === "ECONNABORTED") {
      ErrorToast("Your internet connection is slow. Please try again.");
    }

    if (error.response && error.response.status === 401) {
      const hasToken = Cookies.get("token") || localStorage.getItem("token");
      if (hasToken) {
        ErrorToast("Session expired. Please relogin");
        Cookies.remove("token");
        Cookies.remove("tokenType");
        Cookies.remove("token_type");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenType");
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
