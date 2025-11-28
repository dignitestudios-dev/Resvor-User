import { FaArrowLeftLong } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";
import { settingOptions } from "../../static/SettingOptions";
import { useState } from "react";
import NotificationSettingModal from "../../components/settings/NotificationSettingModal";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";
import ChangeNumberModal from "../../components/settings/ChangeNumberModal";
import DeleteAccountModal from "../../components/settings/DeleteAccountModal";
import TermsModal from "../../components/settings/TermsModal";
import LogOutModal from "../../components/global/LogoutModal";
import PasswordOtpModal from "../../components/settings/PasswordOtpModal";
import AuthSuccessModal from "../../components/auth/AuthSuccessModal";
import EnterNewNumberModal from "../../components/settings/EnterNewNumberModal";
import VerifyNewNumberOtpModal from "../../components/settings/VerifyNewNumberOtpModal";
import PrivacyModal from "./../../components/settings/PrivacyModal";

const Settings = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [numberChangeStep, setNumberChangeStep] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [deleteAccountStep, setDeleteAccountStep] = useState(null);

  const handleLogout = async () => {
    setKey("");
    window.location.href = "/auth/login";
  };

  const handleOtpModal = () => {
    console.log("is otp modal call");
    setKey("");
    setOtpModal(true);
  };

  const handlePasswordOtp = () => {
    setOtpModal(false);
    setPasswordModal(true);
  };

  // Phone number change flow handlers
  // const handleChangeNumberClick = () => {
  //   setNumberChangeStep("currentPhone");
  // };

  const handleCurrentPhoneSubmit = () => {
    setKey("");
    setNumberChangeStep("verifyCurrentOtp");
  };

  const handleVerifyCurrentOtp = () => {
    setNumberChangeStep("enterNewNumber");
  };

  const handleEnterNewNumber = (newNum) => {
    setNewPhone(newNum);
    setNumberChangeStep("verifyNewOtp");
  };

  const handleVerifyNewNumberOtp = () => {
    setNumberChangeStep("success");
  };

  const handleNumberChangeSuccess = () => {
    setNumberChangeStep(null);
    setKey("");
    setNewPhone("");
  };

  // Delete account flow handlers
  const handleDeleteAccountClick = () => {
    setDeleteAccountStep("confirmDelete");
  };

  const handleDeleteContinue = () => {
    setDeleteAccountStep("verifyOtp");
  };

  const handleDeleteOtpVerified = () => {
    setDeleteAccountStep("success");
  };

  const handleAccountDeleted = () => {
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 1500);
  };
  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            Settings
          </h2>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div
          className=" mx-auto px-6 py-10 bg-white rounded-xl -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="space-y-6">
            {settingOptions?.map((item, index) => (
              <div
                key={index}
                onClick={() => setKey(item.key)}
                className="h-[50px] bg-[#F9FAFA] text-[#212935] rounded-lg px-4 text-center cursor-pointer flex items-center justify-between "
              >
                <p
                  className={`text-[14px] font-[500] ${
                    item?.key === "logout" ? "text-red-500" : "text-black"
                  }`}
                >
                  {item?.label}
                </p>
                <IoIosArrowForward className="text-[#212935]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {otpModal && (
        <PasswordOtpModal
          onClose={() => setOtpModal(false)}
          onClick={handlePasswordOtp}
        />
      )}
      {passwordModal && (
        <AuthSuccessModal
          isOpen={passwordModal}
          onClick={() => setPasswordModal(false)}
          title="password updated!"
          description="Your password has been updated successfully."
        />
      )}

      {/* Phone Number Change Flow */}
      {/* {numberChangeStep === "currentPhone" &&
        "this is change number modal"
        // <ChangeNumberModal
        //   onClose={() => {
        //     setNumberChangeStep(null);
        //     setKey("");
        //   }}
        //   onNext={handleCurrentPhoneSubmit}
        // />
      } */}
      {numberChangeStep === "verifyCurrentOtp" && (
        <PasswordOtpModal
          onClose={() => {
            setNumberChangeStep(null);
            setKey("");
          }}
          onNext={handleVerifyCurrentOtp}
        />
      )}
      {numberChangeStep === "enterNewNumber" && (
        <EnterNewNumberModal
          onClose={() => {
            setNumberChangeStep(null);
            setKey("");
          }}
          onNext={handleEnterNewNumber}
        />
      )}
      {numberChangeStep === "verifyNewOtp" && (
        <VerifyNewNumberOtpModal
          onClose={() => {
            setNumberChangeStep(null);
            setKey("");
          }}
          onNext={handleVerifyNewNumberOtp}
          newNumber={newPhone}
        />
      )}
      {numberChangeStep === "success" && (
        <AuthSuccessModal
          isOpen={numberChangeStep === "success"}
          onClick={handleNumberChangeSuccess}
          title="Number updated!"
          description="Your phone number has been updated successfully."
        />
      )}

      {/* Delete Account Flow */}
      {deleteAccountStep === "confirmDelete" && (
        <DeleteAccountModal
          onClose={() => {
            setDeleteAccountStep(null);
            setKey("");
          }}
          onNext={handleDeleteContinue}
        />
      )}
      {deleteAccountStep === "verifyOtp" && (
        <PasswordOtpModal
          onClose={() => {
            setDeleteAccountStep(null);
            setKey("");
          }}
          onNext={handleDeleteOtpVerified}
        />
      )}
      {deleteAccountStep === "success" && (
        <AuthSuccessModal
          isOpen={deleteAccountStep === "success"}
          onClick={handleAccountDeleted}
          title="Account deleted!"
          description="Your account has been permanently deleted."
        />
      )}
      {key === "notification" ? (
        <NotificationSettingModal onClose={() => setKey("")} />
      ) : key === "subscription" ? (
        navigate("/app/subscription-billing")
      ) : key === "password" ? (
        <ChangePasswordModal
          onClose={() => setKey("")}
          handleOtpModal={handleOtpModal}
        />
      ) : key === "number" ? (
        <ChangeNumberModal
          onClose={() => {
            setNumberChangeStep(null);
            setKey("");
          }}
          onNext={handleCurrentPhoneSubmit}
        />
      ) : key === "delete" && deleteAccountStep === null ? (
        <DeleteAccountModal
          onClose={() => setKey("")}
          onNext={handleDeleteAccountClick}
        />
      ) : key === "terms" ? (
        <TermsModal onClose={() => setKey("")} />
      ) : key === "privacy" ? (
        <PrivacyModal onClose={() => setKey("")} />
      ) : key === "logout" ? (
        <LogOutModal
          isOpen={key === "logout" ? true : false}
          setIsOpen={() => setKey("")}
          onConfirm={handleLogout}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Settings;
