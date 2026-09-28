/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useCampaignContacts } from "../../hooks/queries/useQueries";
import { useCreateCampaign } from "../../hooks/mutations/OnboardingMutations";
import { SuccessToast, ErrorToast } from "../global/Toaster";

const STRICT_EMAIL_REGEX =
  /^(?!.*\.\.)(?!.*\.@)(?!.*@\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const SendInvitationForm = ({ isOpen, onClose, flyerFile, onSuccess }) => {
  const [emailInput, setEmailInput] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real contacts from GET /campaigns/contacts?channel=email&page=1&limit=10
  const { data: contactsResponse, isLoading: isLoadingContacts } =
    useCampaignContacts({ channel: "email", page: 1, limit: 10 });

  const contacts = useMemo(() => {
    return contactsResponse?.data || contactsResponse?.contacts || [];
  }, [contactsResponse]);

  const { mutate: createCampaign, isPending: isSending } = useCreateCampaign();

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const query = searchQuery.toLowerCase().trim();
    return contacts.filter((c) => {
      const emailVal = c?.value || "";
      return emailVal.toLowerCase().includes(query);
    });
  }, [contacts, searchQuery]);

  if (!isOpen) return null;

  const handleAddEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) return;

    if (/\s/.test(emailInput)) {
      ErrorToast("Email cannot contain spaces.");
      return;
    }

    if (/^[._%+-]/.test(trimmed)) {
      ErrorToast("Email cannot start with a special character.");
      return;
    }

    if (!STRICT_EMAIL_REGEX.test(trimmed)) {
      ErrorToast("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (selectedRecipients.includes(trimmed)) {
      ErrorToast("Email is already added.");
      return;
    }

    setSelectedRecipients((prev) => [...prev, trimmed]);
    setEmailInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveRecipient = (emailToRemove) => {
    setSelectedRecipients((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleToggleContact = (guestEmail) => {
    if (!guestEmail) return;
    if (selectedRecipients.includes(guestEmail)) {
      setSelectedRecipients((prev) => prev.filter((e) => e !== guestEmail));
    } else {
      setSelectedRecipients((prev) => [...prev, guestEmail]);
    }
  };

  const handleSelectAllContacts = () => {
    const validEmails = contacts
      .map((c) => (c?.value || "").trim())
      .filter((email) => email && STRICT_EMAIL_REGEX.test(email));

    const combined = Array.from(new Set([...selectedRecipients, ...validEmails]));
    setSelectedRecipients(combined);
  };

  const handleDeselectAllContacts = () => {
    const contactEmails = new Set(contacts.map((c) => (c?.value || "").trim()));
    setSelectedRecipients((prev) => prev.filter((e) => !contactEmails.has(e)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedRecipients.length === 0) {
      ErrorToast("Please add at least one recipient email.");
      return;
    }

    const payload = new FormData();
    payload.append("channel", "email");
    payload.append("additionalInfo", additionalInfo || "");

    // Array indices format: recipients[0], recipients[1], etc.
    selectedRecipients.forEach((email, index) => {
      payload.append(`recipients[${index}]`, email);
    });

    if (flyerFile) {
      payload.append("image", flyerFile);
    }

    createCampaign(payload, {
      onSuccess: () => {
        SuccessToast("Campaign sent successfully!");
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          "Failed to send campaign. Please try again.";
        ErrorToast(message);
      },
    });
  };

  const getInitials = (contact) => {
    const emailVal = contact?.value || "?";
    return emailVal[0].toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-[580px] max-w-full max-h-[92vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-[24px] font-bold text-[#181818]">Send Invitation</h2>
            <p className="text-[13px] text-gray-500">
              Select past recipients or enter custom email addresses
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="text-gray-500 hover:text-gray-800 transition cursor-pointer p-1"
          >
            <RxCross2 className="text-[24px]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-8 py-5 space-y-5">
          {/* Custom Email Input */}
          <div className="space-y-2">
            <label className="text-[14px] font-semibold text-[#181818]">
              Recipient Emails
              <span className="text-gray-400 font-normal ml-2 text-xs">
                (Press Enter or click + to add)
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address (e.g. guest@example.com)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl outline-none focus:border-[#012C57] focus:ring-1 focus:ring-[#012C57] transition placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                disabled={!emailInput.trim() || isSending}
                className="px-4 py-2.5 bg-gradient-to-l from-[#012C57] to-[#061523] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-sm"
              >
                <FiPlus className="text-lg" />
              </button>
            </div>

            {/* Selected Email Tags */}
            {selectedRecipients.length > 0 && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-gray-600">
                    Selected Recipients ({selectedRecipients.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedRecipients([])}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-xl">
                  {selectedRecipients.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-1.5 bg-white border border-gray-300 px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-xs"
                    >
                      <span className="truncate max-w-[200px]">{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(email)}
                        className="text-gray-400 hover:text-red-500 transition leading-none ml-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Past Recipients from /campaigns/contacts?channel=email&page=1&limit=10 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[14px] font-semibold text-[#181818]">
                Past Recipients
                {contacts.length > 0 && (
                  <span className="text-xs font-normal text-gray-400 ml-2">
                    ({contacts.length} found)
                  </span>
                )}
              </label>

              {contacts.length > 0 && (
                <div className="flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAllContacts}
                    className="text-[#012C57] font-semibold hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAllContacts}
                    className="text-gray-500 hover:underline cursor-pointer"
                  >
                    Deselect
                  </button>
                </div>
              )}
            </div>

            {/* Search within contacts */}
            {contacts.length > 5 && (
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search past recipients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#012C57] placeholder-gray-400"
                />
              </div>
            )}

            <div className="border border-gray-200 rounded-xl max-h-[220px] overflow-y-auto bg-gray-50/50 p-2">
              {isLoadingContacts ? (
                <div className="flex items-center justify-center py-8 text-gray-400 text-sm gap-2">
                  <div className="w-4 h-4 border-2 border-[#012C57] border-t-transparent rounded-full animate-spin"></div>
                  Loading contacts…
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <span className="text-2xl">📭</span>
                  <p className="text-sm text-gray-400 text-center">
                    {searchQuery
                      ? "No matching recipients found."
                      : "No past recipients found.\nAdd emails manually above."}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredContacts.map((contact, idx) => {
                    const guestEmail = contact?.value || "";
                    const isSelected = selectedRecipients.includes(guestEmail);

                    return (
                      <div
                        key={contact?._id || idx}
                        onClick={() => handleToggleContact(guestEmail)}
                        className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition select-none ${
                          isSelected
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-white hover:bg-gray-100 border border-transparent shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#012C57] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(contact)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-700 font-medium truncate">
                              {guestEmail}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                            isSelected
                              ? "bg-[#012C57] border-[#012C57] text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="text-xs font-bold">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Additional Info / Note */}
          <div className="space-y-1">
            <label className="text-[14px] font-semibold text-[#181818]">
              Additional Note{" "}
              <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Add any message or notes for this invitation..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              disabled={isSending}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:border-[#012C57] resize-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedRecipients.length === 0 || isSending}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              `Send Invitation (${selectedRecipients.length})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendInvitationForm;
