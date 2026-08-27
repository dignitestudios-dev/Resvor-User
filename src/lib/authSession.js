import Cookies from "js-cookie";

const AUTH_TOKEN_TYPE_KEY = "resvor_auth_token_type";

export const getStoredTokenType = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem(AUTH_TOKEN_TYPE_KEY) ||
    localStorage.getItem("tokenType") ||
    Cookies.get("tokenType") ||
    Cookies.get("token_type") ||
    null
  );
};

export const setStoredTokenType = (tokenType) => {
  if (typeof window === "undefined") return;

  if (tokenType) {
    localStorage.setItem(AUTH_TOKEN_TYPE_KEY, tokenType);
  } else {
    localStorage.removeItem(AUTH_TOKEN_TYPE_KEY);
  }
};

export const clearStoredAuthSession = () => {
  if (typeof window === "undefined") return;

  // Clear specific known keys and full localStorage & sessionStorage
  localStorage.removeItem(AUTH_TOKEN_TYPE_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("tokenType");
  localStorage.removeItem("fcmToken");
  localStorage.removeItem("fcm_token");
  localStorage.removeItem("onboarding_complete_acknowledged");
  localStorage.removeItem("show_welcome_walkthrough");
  localStorage.clear();
  sessionStorage.clear();

  // Clear all cookies
  const allCookies = Cookies.get();
  if (allCookies) {
    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName);
      Cookies.remove(cookieName, { path: "/" });
    });
  }
};

export const isAccessTokenSession = () => getStoredTokenType() === "access_token";
export const isSessionTokenSession = () => getStoredTokenType() === "session_token";
