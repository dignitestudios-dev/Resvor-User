import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/authentication/Login";
import AuthLayout from "./layouts/AuthLayout";
import ForgotPassword from "./pages/authentication/ForgotPassword";
// import ForgotOtp from "./pages/authentication/VerifyForgotOtp";
import VerifyForgotOtp from "./pages/authentication/VerifyForgotOtp";
import UpdatePassword from "./pages/authentication/UpdatePassword";
import SignUp from "./pages/authentication/SignUp";
import Home from "./pages/app/Home";
import UserProfile from "./pages/app/UserProfile";
import SubscriptionBilling from "./components/settings/SubscriptionBilling";
import LoungeDetail from "./pages/app/LoungeDetail";
import Settings from "./pages/app/Settings";
import GuestBook from "./pages/app/GuestBook";
import MyBooking from "./pages/app/MyBookings";
import BookingDetails from "./components/bookings/BookingDetails";
import ReservationDetails from "./components/bookings/ReservationDetails";
import Flyers from "./pages/app/Flyers";
import CreateFlyer from "./pages/app/CreateFlyer";
import Chat from "./pages/app/Chat";
import TermsAndConditions from "./pages/app/TermsAndConditions";
import PrivacyPolicy from "./pages/app/PrivacyPolicy";
import Notifications from "./pages/app/Notifications";
import { useAuthMe } from "./hooks/queries/useQueries";
import Cookies from "js-cookie";

const ProtectedAppRoute = () => {
  const { data: authData, isLoading, isError } = useAuthMe();

  const isAuthenticated = authData?.success && authData?.data;
  const isOnboardingCompleted = 
    authData?.data?.onboardingStep === "completed" &&
    (authData?.data?.isSubscribed || authData?.data?.user?.isSubscribed);

  useEffect(() => {
    if (isAuthenticated && isOnboardingCompleted) {
      localStorage.setItem("onboarding_complete_acknowledged", "true");
    }
  }, [isAuthenticated, isOnboardingCompleted]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#030e17] text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If the auth query errored (e.g. 404, expired token), clear stale tokens and redirect to login
  if (isError) {
    Cookies.remove("token");
    localStorage.removeItem("token");
    return <Navigate to="/auth/login" replace />;
  }

  if (isAuthenticated) {
    if (isOnboardingCompleted) {
      return <Outlet />;
    } else {
      return <Navigate to="/auth/signup" replace />;
    }
  }

  return <Navigate to="/auth/login" replace />;
};

const PublicAuthRoute = () => {
  const { data: authData, isLoading, isError } = useAuthMe();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#030e17] text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If auth query errored or no data, user is not authenticated — show auth pages
  if (isError) {
    return <Outlet />;
  }

  // && (localStorage.getItem("onboarding_complete_acknowledged") === "true" ||
  //    authData?.data?.isSubscribed || authData?.data?.user?.isSubscribed);

  const isAuthenticated = authData?.success && authData?.data;
  const isOnboardingCompleted = 
    authData?.data?.onboardingStep === "completed" &&
    (authData?.data?.isSubscribed || authData?.data?.user?.isSubscribed);

  if (isAuthenticated && isOnboardingCompleted) {
    return <Navigate to="/app/home" replace />;
  }

  return <Outlet />;
};

function App() {
  // Just check if a token exists for root redirect.
  // Actual auth verification happens in ProtectedAppRoute and PublicAuthRoute.
  const hasToken = !!(Cookies.get("token") || localStorage.getItem("token"));

  return (
    <Routes>
      <Route
        path="/"
        element={
          hasToken ? (
            <Navigate to="/app/home" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      <Route element={<ProtectedAppRoute />}>
        <Route path="app" element={<DashboardLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="lounge-detail/:id" element={<LoungeDetail />} />
          <Route path="guestbook" element={<GuestBook />} />
          <Route path="bookings" element={<MyBooking />} />
          <Route path="bookingDetails/:id" element={<BookingDetails />} />
          <Route path="reservationDetails/:id" element={<ReservationDetails />} />
          <Route path="flyers" element={<Flyers />} />
          <Route path="create-flyer" element={<CreateFlyer />} />
          <Route path="chat" element={<Chat />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="subscription-billing" element={<SubscriptionBilling />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Route>

      <Route element={<PublicAuthRoute />}>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="forget-password" element={<ForgotPassword />} />
          <Route path="verify-forget-otp" element={<VerifyForgotOtp />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<div className="text-7xl">Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;
