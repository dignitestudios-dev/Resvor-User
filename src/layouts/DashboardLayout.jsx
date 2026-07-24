import { Outlet } from "react-router";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const DashboardLayout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-start">
      <Navbar />
      <div className="w-full flex-1 flex justify-start items-start">
        <div className="w-full">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
