/* eslint-disable react/prop-types */
import { useState } from "react";
import BuySubscriptionModal from "./BuySubscriptionModal";
import AuthButton from "../auth/AuthButton";
import { successLight } from "../../assets/export";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";

const Subscription = ({ handlePrevious }) => {
  const navigate = useNavigate();
  const [subscriptionModal, setSubscriptionModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isVip, setIsVip] = useState(false);
  return (
    <div className="flex flex-col justify-center items-center h-auto ">
      <div className="flex justify-start items-center absolute top-12 left-0">
        <button type="button" onClick={() => handlePrevious()}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div>
      {completed ? (
        <div className="mt-4 xxl:w-[400px] xxl:ml-12 text-center space-y-3.5 max-w-[440px] px-4">
          <div className="flex justify-center pb-4">
            <img src={successLight} alt="success" className="w-[120px]" />
          </div>
          <p className="xxl:text-[48px] text-[36px] text-[#E6E6E6] font-[600] capitalize">
            Account Created
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] ">
            Your profile has been created successfully.
          </p>
          <div className="mt-6 ">
            <div className="xxl:w-[650px] w-[350px] mt-1 mb-4">
              <AuthButton
                type="button"
                text={"Explore Lounges"}
                onClick={() => navigate("/app/home")}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 xxl:w-[400px] xxl:ml-12 text-center space-y-4 max-w-[440px] px-4">
            <p className="xxl:text-[48px] text-[32px] text-[#E6E6E6] font-[600] capitalize">
              Subscription Plans
            </p>
            <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] ">
              Choose Your Plan to Start Creating Events. Pick the package that
              fits your guest list size and enjoy seamless event management.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="w-[880px] mx-auto mt-4">
            {/* Top Row - 3 Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Plan 1 - Gold */}
              <div className=" bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-8 transition">
                <div className="text-sm text-[#E6E6E6] mb-2">Plan 1</div>
                <h2 className="text-4xl font-bold text-white mb-4">Gold</h2>
                <div className="text-4xl font-bold text-orange-400 mb-6">
                  $15.99
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="text-[#E6E6E6] flex items-center">
                    <span className="mr-3">•</span>
                    50 Guests Per Event
                  </li>
                  <li className="text-[#E6E6E6] flex items-center">
                    <span className="mr-3">•</span>
                    Unlimited Event
                  </li>
                </ul>
                <button
                  onClick={() => setSubscriptionModal(true)}
                  className="w-full bg-white text-[#181818] text-[13px] font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Plan 2 - Silver */}
              <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-8 transition">
                <div className="text-sm text-[#E6E6E6] mb-2">Plan 2</div>
                <h2 className="text-4xl font-bold text-white mb-4">Silver</h2>
                <div className="text-4xl font-bold text-[#E6E6E6] mb-6">
                  $11.99
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="text-[#E6E6E6] flex items-center">
                    <span className="mr-3">•</span>
                    25 Guests Per Event
                  </li>
                  <li className="text-[#E6E6E6] flex items-center">
                    <span className="mr-3">•</span>
                    Unlimited Event
                  </li>
                </ul>
                <button className="w-full bg-white text-[#181818] text-[13px] font-semibold py-3 rounded-xl hover:bg-gray-100 transition">
                  Buy Now
                </button>
              </div>

              {/* Plan 3 - Bronze */}
              <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-8 transition">
                <div className="text-sm text-[#E6E6E6] mb-2">Plan 3</div>
                <h2 className="text-4xl font-bold text-white mb-4">Bronze</h2>
                <div className="text-4xl font-bold text-orange-500 mb-6">
                  $7.99
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="text-gray-300 flex items-center">
                    <span className="mr-3">•</span>
                    15 Guests Per Event
                  </li>
                  <li className="text-gray-300 flex items-center">
                    <span className="mr-3">•</span>
                    Unlimited Event
                  </li>
                </ul>
                <button className="w-full bg-white text-[#181818] text-[13px] font-semibold py-3 rounded-xl hover:bg-gray-100 transition">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Bottom Row - VIP Plan */}
            <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-8 transition">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-[#E6E6E6] mb-2">Plan 4</div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    VIP Plan
                  </h2>
                  <div className="text-4xl font-bold text-[#E6E6E6] mb-8">
                    $99.99
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-[#E6E6E6] flex items-start">
                    <span className="mr-3 mt-1">•</span>
                    <span>Fast Track Access</span>
                  </div>
                  <div className="text-[#E6E6E6] flex items-start">
                    <span className="mr-3 mt-1">•</span>
                    <span>Exclusive Room Access</span>
                  </div>
                  <div className="text-[#E6E6E6] flex items-start">
                    <span className="mr-3 mt-1">•</span>
                    <span>Specialized Items & Discounts:</span>
                  </div>
                  <div className="text-[#E6E6E6] flex items-start">
                    <span className="mr-3 mt-1">•</span>
                    <span>QR Code Integration</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVip(true);
                  setSubscriptionModal(true);
                }}
                className="w-full bg-white text-[#181818] text-[13px] font-semibold py-3 rounded-xl hover:bg-gray-100 transition mt-6"
              >
                Buy Now
              </button>
            </div>
          </div>
        </>
      )}

      {subscriptionModal && (
        <BuySubscriptionModal
          onClick={() => setSubscriptionModal(false)}
          setCompleted={setCompleted}
          isVip={isVip}
        />
      )}
    </div>
  );
};

export default Subscription;
