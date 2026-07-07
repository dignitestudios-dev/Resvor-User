import axios from "axios";
import { ErrorToast } from "./components/global/Toaster";
import Cookies from "js-cookie";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

// export const baseUrl = "https://api-staging.resvor.com"
export const baseUrl = "https://api-dev.resvor.com";


// Prevent showing multiple offline toasts
let isOfflineToastVisible = false;

const showOfflineToast = () => {
  if (!isOfflineToastVisible) {
    isOfflineToastVisible = true;
    ErrorToast("No internet connection. Please check your network and try again.");

    // Reset after a few seconds so it can be shown again later
    setTimeout(() => {
      isOfflineToastVisible = false;
    }, 4000);
  }
};

// Listen for internet connectivity changes (runs only in browser)
if (typeof window !== "undefined") {
  window.addEventListener("offline", () => {
    showOfflineToast();
  });

  window.addEventListener("online", () => {
    isOfflineToastVisible = false;
    // Optional:
    // SuccessToast("Internet connection restored.");
  });
}

async function getDeviceFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// ==================== REQUEST INTERCEPTOR ====================
instance.interceptors.request.use(
  async (request) => {
    // Check internet before making request
    if (!navigator.onLine) {
      showOfflineToast();
      return Promise.reject(new Error("No internet connection"));
    }

    request.withCredentials = true;

<<<<<<< HEAD
  // Get device fingerprint and add to headers
  const fingerprint = await getDeviceFingerprint();

  const isFormData = request.data instanceof FormData;

  // Set headers directly on request.headers to preserve AxiosHeaders methods
  request.headers["devicemodel"] = fingerprint;
  request.headers["deviceuniqueid"] = fingerprint;

  if (!isFormData) {
    request.headers["Content-Type"] = "application/json";
  }
=======
    const fingerprint = await getDeviceFingerprint();
>>>>>>> 53ff5204faad64c6555fb18e020b9713924f6224

    const isFormData = request.data instanceof FormData;

    request.headers["devicemodel"] = fingerprint;
    request.headers["deviceuniqueid"] = fingerprint;

    if (!isFormData) {
      request.headers["Content-Type"] = "application/json";
    }

    const token = Cookies.get("token") || localStorage.getItem("token");

    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("📤 Request:", request.url, {
      withCredentials: request.withCredentials,
      headers: request.headers,
    });

    return request;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
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
      code: error.code,
      message: error.message,
    });

<<<<<<< HEAD
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
=======
    // ====================
    // No Internet / Network Error
    // ====================
    if (!error.response && error.code === "ERR_NETWORK") {
      showOfflineToast();
      return Promise.reject(error);
>>>>>>> 53ff5204faad64c6555fb18e020b9713924f6224
    }

    // ====================
    // Request Timeout
    // ====================
    if (error.code === "ECONNABORTED") {
      ErrorToast("Your internet connection is slow. Please try again.");
      return Promise.reject(error);
    }

    // ====================
    // Unauthorized
    // ====================
    if (error.response?.status === 401) {
      const hasToken =
        Cookies.get("token") || localStorage.getItem("token");

      if (hasToken) {
        ErrorToast("Session expired. Please relogin");

        Cookies.remove("token");
        Cookies.remove("tokenType");
        Cookies.remove("token_type");

        localStorage.removeItem("token");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("resvor_auth_token_type");

<<<<<<< HEAD
        // Force redirect to login if not already on an auth page
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
=======
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
>>>>>>> 53ff5204faad64c6555fb18e020b9713924f6224
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default instance;