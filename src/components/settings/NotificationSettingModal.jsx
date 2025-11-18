/* eslint-disable react/prop-types */

import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { unToggled, toggled } from "../../assets/export";
import Button from "../global/Button";

const NOTIFICATION_PREFS = [
  {
    key: "off",
    title: "Notifications Alert",
  },
  {
    key: "newBooking",
    title: "New Booking Alert",
  },
];

const NotificationSettingModal = ({ onClose }) => {
  const [state, setState] = useState("idle");
  const [toggles, setToggles] = useState({
    off: false,
  });

  const handleToggle = async (key) => {
    const newValue = !toggles[key];
    setToggles((prev) => ({ ...prev, [key]: newValue }));
  };
  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-4 overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 ">
          <h2 className="text-[28px] font-bold mb-4">Notification Settings</h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full pt-4 px-8">
          {NOTIFICATION_PREFS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between w-full px-3 py-1 bg-[#F9FAFA] text-[#212935] rounded-lg "
            >
              <div className="w-[250px]">
                <p className="text-[14px] font-semibold">{item.title}</p>
              </div>

              {/* Toggle */}
              <div
                className={`cursor-pointer ${
                  state === "loading" ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => handleToggle(item.key)}
              >
                {state === "loading" ? (
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                ) : (
                  <img
                    src={toggles[item.key] ? `${toggled}` : `${unToggled}`}
                    alt={toggles[item.key] ? "Checked" : "Unchecked"}
                    className={`w-12 h-10 ${
                      toggled ? "ml-0" : "mr-1"
                    } transition-transform duration-200 ease-in-out`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 mx-36">
          <Button text="Save" type="button" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingModal;
