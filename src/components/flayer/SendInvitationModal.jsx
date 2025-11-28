/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import { guests } from "../../static/MockData";
import { useState } from "react";

const SendInvitationModal = ({ onClose, onClick, handleSuccess }) => {
  const [email, setEmail] = useState("");
  const [selectedGuests, setSelectedGuests] = useState([
    "sarah.johnson@email.com",
    "mike.anderson@email.com",
  ]);

  const handleAddEmail = () => {
    if (email.trim() && !selectedGuests.includes(email)) {
      setSelectedGuests([...selectedGuests, email]);
      setEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setSelectedGuests(selectedGuests.filter((e) => e !== emailToRemove));
  };

  const handleGuestSelect = (guestEmail) => {
    if (!selectedGuests.includes(guestEmail)) {
      setSelectedGuests([...selectedGuests, guestEmail]);
    } else {
      setSelectedGuests(selectedGuests.filter((e) => e !== guestEmail));
    }
  };

  const handleSend = () => {
    if (selectedGuests.length > 0) {
      onClick(selectedGuests);
      setSelectedGuests([]);
      setEmail("");
    }
    handleSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[520px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-[28px] font-bold text-black">Send Invitation</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer hover:opacity-70 transition"
          >
            <RxCross2 className="text-[24px] text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Email Input Section */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-black">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 text-gray-700 placeholder-gray-400"
              />
              {/* <button
                type="button"
                onClick={handleAddEmail}
                className="px-4 py-3 text-gray-400 hover:text-gray-600 transition"
              >
                ✓
              </button> */}
            </div>

            {/* Selected Emails Tags */}
            {selectedGuests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedGuests.map((selectedEmail, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    <span className="text-sm text-gray-700">
                      {selectedEmail}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(selectedEmail)}
                      className="text-gray-400 hover:text-gray-600 transition text-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider with Slider */}
          {/* <div className="flex items-center gap-4">
            <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex gap-1">
              <button className="text-gray-400 text-2xl hover:text-gray-600 transition">
                ‹
              </button>
              <button className="text-gray-400 text-2xl hover:text-gray-600 transition">
                ›
              </button>
            </div>
          </div> */}

          {/* Guests Section */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-black">Guests</label>
            <div className="border border-gray-300 rounded-xl p-4 max-h-[280px] overflow-y-auto">
              <div className="space-y-2">
                {guests.map((guest) => {
                  const isSelected = selectedGuests.includes(guest.email);
                  return (
                    <div
                      key={guest.id}
                      onClick={() => handleGuestSelect(guest.email)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl flex-shrink-0">
                        {guest.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {guest.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {guest.email}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-8 py-4 border-t border-gray-200 bg-white">
          <Button
            text="Send Invitation"
            onClick={handleSend}
            disabled={selectedGuests.length === 0}
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default SendInvitationModal;
