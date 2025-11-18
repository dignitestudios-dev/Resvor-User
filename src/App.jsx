import { Navigate, Route, Routes } from "react-router";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/home" />} />
      <Route path="app" element={<DashboardLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="lounge-detail" element={<LoungeDetail />} />
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
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="forget-password" element={<ForgotPassword />} />
        <Route path="verify-forget-otp" element={<VerifyForgotOtp />} />
        <Route path="update-password" element={<UpdatePassword />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      <Route
        path="*"
        element={<div className="text-7xl">Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;
