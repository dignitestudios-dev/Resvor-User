import { useEffect, useRef, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router";
import { logoBlack, userImage, vipTag } from "../../assets/export";
import { IoNotificationsOutline } from "react-icons/io5";
import LogOutModal from "../global/LogoutModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userPopup, setUserPopup] = useState(false);
  const [logoutpopup, setLogoutpopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const userPopupRef = useRef(null);
  const popupRef = useRef(null);
  const iconRef = useRef(null);
  const avatarRef = useRef(null);

  // Close the popup when clicking outside the popup or the icon
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside of the popup and the notification icon
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
        setIsPopupOpen(false); // Close the popup
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks outside
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup listener
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setUserPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLogoutpopup(false);
    window.location.href = "/auth/login";
  };

  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMenus = () => {
    setUserPopup(false);
    setIsMobileMenuOpen(false);
    setIsPopupOpen(false);
  };

  const [notifications, setNotifications] = useState([
    {
      title: "Your Booking is Approved",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed adipiscing elit",
      time: "12:30 AM",
      unreadCount: 1,
    },
    {
      title: "Your Booking is Approved",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed adipiscing elit",
      time: "12:30 AM",
    },
    {
      title: "Your Booking is Approved",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed adipiscing elit",
      time: "12:30 AM",
    },
  ]);

  const handleLogoClick = () => {
    return navigate("/app/home");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  // // Check login state & role on mount
  // useEffect(() => {
  //   const userRole = Cookies.get("role");
  //   if (userRole === "user" || userRole === "provider") {
  //     setRole(userRole);
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //     setRole(null);
  //   }
  // }, [location.pathname]); // re-check role on route change

  // Toggle the popup open/close
  const togglePopup = (e) => {
    e.stopPropagation(); // Prevent event from propagating to the document level
    setIsPopupOpen((prevState) => !prevState);
  };

  const toggleUserpopup = () => {
    setIsPopupOpen(false);
    setUserPopup(!userPopup);
  };

  // const markAsRead = (index) => {
  //   // Make a copy of the notifications array to avoid directly mutating the state
  //   const updatedNotifications = [...notifications];

  //   // Set the unreadCount of the clicked notification to 0
  //   updatedNotifications[index].unreadCount = 0;

  //   // Update the state with the modified notifications array
  //   setNotifications(updatedNotifications);

  //   // Also update the notifications in localStorage
  //   localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  // };
  const menuLinks = [
    { label: "Home", path: "/app/home" },
    { label: "Guestbook", path: "/app/guestbook" },
    { label: "My Bookings", path: "/app/bookings" },
    { label: "Invite Friends", path: "/app/flyers" },
    { label: "Messages", path: "/app/chat" },
  ];

  return (
    <nav
      className={`w-full ${
        isMobileMenuOpen
          ? "fixed top-0 left-0 min-h-screen bg-[#181818] z-50"
          : ""
      } text-[#181818]`}
    >
      <div className="max-w-7xl border-b border-white/40 mx-auto px-4 py-2 flex z-10 items-center justify-between relative">
        <div className="md:w-[60%] w-[40%]">
          <img
            src={logoBlack}
            alt="Logo"
            className="w-[128px] cursor-pointer"
            onClick={handleLogoClick}
          />
        </div>

        {/* Desktop Menu */}

        <div className="hidden md:flex justify-end items-center gap-5 lg:gap-10 font-medium text-sm w-full">
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`pb-1 relative text-[12px] lg:text-[16px] lg:font-[500] font-medium transition-all duration-300 font-sans ${
                currentPath === link.path
                  ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div ref={popupRef} className="relative">
            {/* Notification Icon */}
            <IoNotificationsOutline
              ref={iconRef}
              className="text-[#181818] text-2xl cursor-pointer"
              onClick={togglePopup} // Toggle popup on icon click
            />
            {/* Show unread count badge if there are unread notifications */}
            {notifications.filter((n) => n.unreadCount > 0).length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-[14px] h-[14px] flex items-center justify-center">
                {notifications.filter((n) => n.unreadCount > 0).length}
              </div>
            )}

            {/* Popup content */}
            {isPopupOpen && (
              <div
                className="absolute top-10 right-0 w-[500px] bg-white shadow-lg rounded-lg py-6 px-6 z-50"
                ref={popupRef}
              >
                <h3 className="text-lg font-semibold text-black">
                  Notifications
                </h3>
                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          // Handle marking notification as read (Optional)
                          const updatedNotifications = [...notifications];
                          updatedNotifications[idx].unreadCount = 0; // Mark as read
                          setNotifications(updatedNotifications);
                        }}
                        className="cursor-auto"
                      >
                        <div className="flex w-full justify-between">
                          <div>
                            <span className="text-[14px] font-bold text-gray-500">
                              {n.title}
                            </span>
                            <p className="text-[13px] mt-2 text-[#18181880]">
                              {n.message}
                            </p>
                          </div>
                          <div className="flex flex-col items-end px-2 w-[100px]">
                            <div className="text-xs text-gray-600">
                              {n.time}
                            </div>
                            {n.unreadCount > 0 && (
                              <div className="bg-red-600 mt-2 text-white text-xs rounded-full w-[19px] h-[19px] flex items-center justify-center">
                                {n.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                        <hr className="mt-2" />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700">No notifications</p>
                  )}
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      navigate("/app/notifications");
                    }}
                    className="text-sm text-blue-600 font-medium px-4 mt-2 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                  >
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <img
              ref={avatarRef}
              src={userImage}
              className="h-10 w-10 object-cover rounded-full cursor-pointer border-2"
              onClick={toggleUserpopup}
              alt="Avatar"
            />
            {userPopup && (
              <div
                ref={userPopupRef}
                className="absolute top-20 right-4 bg-white w-[155px] text-black rounded-[8px] shadow-lg p-4 space-y-2 z-[99999]"
              >
                <span
                  className="block font-[400] py-1 text-sm border-b  border-[#E4E4E4] cursor-pointer"
                  onClick={() => navigate("/app/user-profile")}
                >
                  View Profile
                </span>
                <span
                  className="block font-[400] py-1 border-b  border-[#E4E4E4] text-sm cursor-pointer"
                  onClick={() => navigate("/app/settings")}
                >
                  Settings
                </span>
                {/* <span
                  className="block font-[400] py-1 border-b  border-[#E4E4E4] text-sm cursor-pointer"
                  onClick={() => setIsReport(true)}
                >
                  Report an Issue
                </span> */}
                <span
                  className="block font-[400] py-1  text-sm text-red-600 cursor-pointer"
                  onClick={() => setLogoutpopup(true)}
                >
                  Log Out
                </span>
              </div>
            )}
          </div>
          <div className="-ml-6">
            <img src={vipTag} alt="vipTag" className="w-12" />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <>
            <div ref={popupRef} className="relative">
              <IoNotificationsOutline
                className="text-white text-2xl cursor-pointer"
                onClick={() => {
                  togglePopup();
                }}
              />
              {/* Show unread count badge if there are unread notifications */}
              {notifications.filter((n) => n.unreadCount > 0).length > 0 && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] rounded-full w-[13px] h-[13px] flex items-center justify-center">
                  {notifications.filter((n) => n.unreadCount > 0).length}
                </div>
              )}
              {isPopupOpen && (
                <div className="absolute top-10 left-[-250px]  md:left-0 md:right-0 w-[370px] md:w-[500px] bg-white shadow-lg rounded-[22px] py-6 z-50">
                  <h3 className="text-lg font-semibold text-black">
                    Notifications
                  </h3>
                  <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n, idx) => (
                        <div
                          key={idx}
                          // onClick={() => markAsRead(idx)}
                          className="cursor-pointer"
                        >
                          <div className="flex w-full justify-between">
                            <div>
                              <span className="text-[14px] font-bold text-gray-400">
                                {n.title}
                              </span>
                              <p className="text-[13px] mt-2 text-[#18181880]">
                                {n.message}
                              </p>
                            </div>
                            <div className="flex flex-col items-end px-2 ">
                              <div className="text-xs text-gray-600">
                                {n.time}
                              </div>
                              {n.unreadCount > 0 && (
                                <div className="bg-red-600 mt-2 text-white text-xs rounded-full w-[19px] h-[19px] flex items-center justify-center">
                                  {n.unreadCount}
                                </div>
                              )}
                            </div>
                          </div>
                          <hr className="mt-2" />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <img
                src={userImage}
                alt="User Avatar"
                className="w-9 h-9 rounded-full cursor-pointer object-cover border-2 border-white"
                onClick={toggleUserpopup}
              />
              {userPopup && (
                <div className="bg-white text-black right-4 w-[200px] rounded absolute shadow-lg p-4 space-y-2 mt-2">
                  <span
                    className="block text-sm cursor-pointer"
                    onClick={() => navigate("/app/user-profile")}
                  >
                    View Profile
                  </span>
                  <span
                    className="block text-sm cursor-pointer"
                    onClick={() => navigate("/app/settings")}
                  >
                    Settings
                  </span>
                  {/* <span
                      className="block text-sm cursor-pointer"
                      onClick={() => setIsReport(true)}
                    >
                      Report an Issue
                    </span> */}
                  <span
                    className="block text-sm text-red-600 cursor-pointer"
                    onClick={() => setLogoutpopup(true)}
                  >
                    Log Out
                  </span>
                </div>
              )}
            </div>
          </>

          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <HiX size={28} color="#26A7E2" />
            ) : (
              <HiMenu size={28} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto text-white">
          <>
            {menuLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="block py-2 border-b border-white/20"
                onClick={toggleMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </>
        </div>
      )}

      <LogOutModal
        isOpen={logoutpopup}
        setIsOpen={setLogoutpopup}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
