import { Outlet } from "react-router";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const DashboardLayout = () => {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-start items-start">
      <Navbar />
      <div className="w-full h-screen flex justify-start items-start">
        <div className="w-full h-[calc(100%-2.5rem)]">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
};


export default DashboardLayout;
