import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import NoInternetModal from "../components/global/NoInternet";
import { NoInternetImage } from "../assets/export";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const DashboardLayout = () => {
  const [openNoInternet, setOpenNoInternet] = useState(false);

  // useEffect(() => {
  //   if (!navigator.onLine) {
  //     // Handle no internet connection
  //     setOpenNoInternet(true);
  //   }
  // }, []);
  return (
    <div className="w-full h-[100vh] flex flex-col justify-start items-start">
      <Navbar />
      <img src={NoInternetImage} alt="" className="hidden" />
      <div className="w-full h-screen flex justify-start items-start">
        <div className="w-full h-[calc(100%-2.5rem)]">
          <NoInternetModal isOpen={openNoInternet} />
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
