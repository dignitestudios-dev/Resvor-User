import Cookies from "js-cookie";

const AUTH_TOKEN_TYPE_KEY = "resvor_auth_token_type";

export const getStoredTokenType = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem(AUTH_TOKEN_TYPE_KEY) ||
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

  localStorage.removeItem(AUTH_TOKEN_TYPE_KEY);
};

export const isAccessTokenSession = () => getStoredTokenType() === "access_token";
export const isSessionTokenSession = () => getStoredTokenType() === "session_token";
