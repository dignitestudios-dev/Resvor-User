/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { RiLoader5Line } from "react-icons/ri";
import PhoneInput from "../auth/PhoneInput";
import { phoneFormatter, phoneToE164 } from "../../lib/helpers";
import { useUpdateOnboardingPhone } from "../../hooks/mutations/OnboardingMutations";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import Cookies from "js-cookie";
import { setStoredTokenType } from "../../lib/authSession";

const ChangePhoneModal = ({
  isOpen,
  onClose,
  currentPhoneNumber = "",
  onSuccess,
}) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const updatePhoneMutation = useUpdateOnboardingPhone();

  useEffect(() => {
    if (isOpen) {
      setPhone(phoneFormatter(currentPhoneNumber) || currentPhoneNumber || "");
      setError("");
    }
  }, [isOpen, currentPhoneNumber]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const rawVal = e.target.value;
    // Format if standard US or allow direct typing
    const formatted = rawVal.startsWith("+") ? rawVal : phoneFormatter(rawVal);
    setPhone(formatted);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const digitsOnly = phone.replace(/\D/g, "");
    if (!digitsOnly || digitsOnly.length < 7) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      const e164Phone = phoneToE164(phone);
      const response = await updatePhoneMutation.mutateAsync({
        phoneNumber: e164Phone,
      });

      if (response?.success || response?.data) {
        const token = response?.data?.token || response?.data?.accessToken;
        const tokenType = response?.data?.tokenType;
        if (token) {
          Cookies.set("token", token, { expires: 7 });
          localStorage.setItem("token", token);
        }
        if (tokenType) {
          Cookies.set("tokenType", tokenType, { expires: 7 });
          localStorage.setItem("tokenType", tokenType);
          setStoredTokenType(tokenType);
        }

        const newPhone = response?.data?.user?.phoneNumber || e164Phone;
        localStorage.setItem("user_phone_number", newPhone);

        SuccessToast(response?.message || "Phone number updated successfully");
        if (onSuccess) {
          onSuccess(newPhone);
        }
        onClose();
      } else {
        ErrorToast(response?.message || "Failed to update phone number");
      }
    } catch (err) {
      console.error("Change phone error:", err);
      ErrorToast(
        err?.response?.data?.message ||
          "Failed to update phone number. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] shadow-2xl w-[480px] max-w-full overflow-hidden text-black animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-5 pb-2">
          <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#181818]">
            Change Phone Number
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition cursor-pointer"
          >
            <RxCross2 className="text-[22px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <p className="text-[14px] text-[#666666]">
            Enter your new phone number. A new One-Time Password (OTP) will be sent to verify it.
          </p>

          <div>
            <PhoneInput
              id="changePhoneInput"
              name="phoneNumber"
              value={phone}
              onChange={handleChange}
              onBlur={() => {}}
              label="New Phone Number"
              labelColor="text-[#181818]"
              textColor="text-black"
              countryCodeColor="text-black"
              placeholderColor="placeholder:text-gray-400"
              borderColor={error ? "border-red-500" : "border-gray-300"}
              bgColor="bg-[#F8F9FA]"
              error={error}
              touched={!!error}
              autoComplete="off"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={updatePhoneMutation.isPending}
              className="flex-1 py-3 px-4 rounded-[12px] border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 text-[14px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatePhoneMutation.isPending}
              className="flex-1 py-3 px-4 rounded-[12px] bg-gradient-to-r from-[#012C57] to-[#061523] text-white font-semibold hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-[14px]"
            >
              <span>{updatePhoneMutation.isPending ? "Updating..." : "Update Number"}</span>
              {updatePhoneMutation.isPending && (
                <RiLoader5Line className="animate-spin text-lg" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePhoneModal;
