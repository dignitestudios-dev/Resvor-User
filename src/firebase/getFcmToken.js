import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBDkYIIrcyTCIibphB2ljyg1HW2wnGS3t8",
  authDomain: "resvor-f8d95.firebaseapp.com",
  projectId: "resvor-f8d95",
  storageBucket: "resvor-f8d95.firebasestorage.app",
  messagingSenderId: "426613970767",
  appId: "1:426613970767:web:a286883422ad084a6fd73a",
};

// Initialize Firebase
let app;
let messaging;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const requestForToken = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("Notifications are not supported in this environment");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      if (!messaging) {
        console.log("Firebase Messaging has not been initialized");
        return null;
      }
      const token = await getToken(messaging, {
        vapidKey:
          "BFAbc5KzK4r9yFfltWdVtEuEB37LLpYBwAidw7ccsMms2AwlSo1mRoh3ND4gD4iVWgFawF5rt81RQX2-F4pwlY8",
      });

      if (token) {
        localStorage.setItem("fcmToken", token);
        localStorage.setItem("fcm_token", token);
      }

      return token;
    } else {
      console.log("Notification permission denied");
    }
  } catch (error) {
    console.error("Error requesting notification permission/token", error);
  }
  return null;
};

export default requestForToken;
