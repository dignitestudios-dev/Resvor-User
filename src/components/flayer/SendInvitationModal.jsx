/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import { useState } from "react";
import { useCampaignContacts } from "../../hooks/queries/useQueries";
import { ErrorToast } from "../../components/global/Toaster";

const SendInvitationModal = ({ onClose, onClick, handleSuccess, isLoading }) => {
  const [email, setEmail] = useState("");
  const [selectedGuests, setSelectedGuests] = useState([]);

  // Fetch real contacts from GET /campaigns/contacts?channel=email&page=1&limit=10
  const {
    data: contactsResponse,
    isLoading: isLoadingContacts,
  } = useCampaignContacts({ channel: "email", page: 1, limit: 10 });

  // Normalise: API may return { data: [...] } or { contacts: [...] } — handle both
  const contacts = contactsResponse?.data || contactsResponse?.contacts || [];

  /* ── handlers ── */
  const handleAddEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    // Rule 1: No spaces allowed
    if (/\s/.test(email)) {
      ErrorToast("Email cannot contain spaces.");
      return;
    }

    // Rule 2: Cannot start with a special character/dot
    if (/^[._%+-]/.test(trimmed)) {
      ErrorToast("Email cannot start with a special character.");
      return;
    }

    // Rule 3: Strict industry-standard regex
    // - (?!.*\.\.): No consecutive dots
    // - (?!.*\.@): No dot right before @
    // - (?!.*@\.): No dot right after @
    const emailRegex = /^(?!.*\.\.)(?!.*\.@)(?!.*@\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      ErrorToast("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (!selectedGuests.includes(trimmed)) {
      setSelectedGuests((prev) => [...prev, trimmed]);
      setEmail("");
    } else {
      ErrorToast("Email is already added.");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setSelectedGuests((prev) => prev.filter((e) => e !== emailToRemove));
  };

  const handleGuestSelect = (guestEmail) => {
    if (!selectedGuests.includes(guestEmail)) {
      setSelectedGuests((prev) => [...prev, guestEmail]);
    } else {
      setSelectedGuests((prev) => prev.filter((e) => e !== guestEmail));
    }
  };

  const handleSend = () => {
    if (selectedGuests.length > 0) {
      onClick(selectedGuests);
    }
  };

  /* ── helper: get initials from email value ── */
  const getInitials = (contact) => {
    const emailVal = contact?.value || "?";
    return emailVal[0].toUpperCase();
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

          {/* Email Input */}
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
              <button
                type="button"
                onClick={handleAddEmail}
                disabled={!email.trim()}
                className="px-4 py-2 rounded-xl bg-[#0B0E52] text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition"
              >
                Add
              </button>
            </div>

            {/* Selected email tags */}
            {selectedGuests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedGuests.map((selectedEmail, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    <span className="text-sm text-gray-700">{selectedEmail}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(selectedEmail)}
                      className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts from API */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-black">
              Past Recipients
              {contacts.length > 0 && (
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  ({contacts.length} found)
                </span>
              )}
            </label>

            <div className="border border-gray-300 rounded-xl p-4 max-h-[280px] overflow-y-auto">
              {/* Loading state */}
              {isLoadingContacts && (
                <div className="flex items-center justify-center py-8 gap-2">
                  <svg
                    className="w-5 h-5 animate-spin text-[#0B0E52]"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                      className="opacity-75"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">Loading contacts…</span>
                </div>
              )}

              {/* Empty state */}
              {!isLoadingContacts && contacts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <span className="text-2xl">📭</span>
                  <p className="text-sm text-gray-400 text-center">
                    No past recipients found.<br />
                    Add emails manually above.
                  </p>
                </div>
              )}

              {/* Contact list */}
              {!isLoadingContacts && contacts.length > 0 && (
                <div className="space-y-2">
                  {contacts.map((contact, index) => {
                    const guestEmail = contact?.value || "";
                    const isSelected = selectedGuests.includes(guestEmail);
                    return (
                      <div
                        key={contact?._id || index}
                        onClick={() => handleGuestSelect(guestEmail)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                          isSelected
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        {/* Avatar initials */}
                        <div className="w-10 h-10 rounded-full bg-[#0B0E52] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {getInitials(contact)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 truncate">{guestEmail}</p>
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
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 bg-white">
          <Button
            text={isLoading ? "Sending…" : "Send Invitation"}
            onClick={handleSend}
            disabled={selectedGuests.length === 0 || isLoading}
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default SendInvitationModal;
