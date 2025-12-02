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
    <div className="flex flex-col justify-center items-center min-h-screen w-full text-white relative px-4 py-6">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button type="button" onClick={handlePrevious}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div>

      {completed ? (
        <div className="mt-8 text-center space-y-4 max-w-sm w-full">
          <div className="flex justify-center pb-4">
            <img
              src={successLight}
              alt="success"
              className="w-[100px] sm:w-[120px]"
            />
          </div>

          <p className="text-[28px] sm:text-[36px] font-semibold">
            Account Created
          </p>
          <p className="text-[14px] sm:text-[16px] text-gray-300">
            Your profile has been created successfully.
          </p>

          <div className="mt-6 w-full max-w-xs mx-auto">
            <AuthButton
              type="button"
              text={"Explore Lounges"}
              onClick={() => navigate("/app/home")}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Title */}
          <div className="mt-8 text-center space-y-4 max-w-md w-full px-2">
            <p className="text-[28px] sm:text-[36px] font-semibold">
              Subscription Plans
            </p>
            <p className="text-[14px] sm:text-[16px] text-gray-300">
              Choose Your Plan to Start Creating Events.
            </p>
          </div>

          {/* Plans Section */}
          <div className="w-full max-w-5xl mx-auto mt-6 px-2">
            {/* 3 Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Plan 1 */}
              <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-6 sm:p-8">
                <div className="text-sm text-gray-300 mb-1">Plan 1</div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Gold</h2>
                <div className="text-3xl sm:text-4xl font-bold text-orange-400 mb-4">
                  $15.99
                </div>

                <ul className="space-y-2 mb-6 text-sm sm:text-base">
                  <li className="flex items-center">• 50 Guests Per Event</li>
                  <li className="flex items-center">• Unlimited Event</li>
                </ul>

                <button
                  onClick={() => setSubscriptionModal(true)}
                  className="w-full bg-white text-black py-2.5 rounded-xl text-[13px] font-semibold"
                >
                  Buy Now
                </button>
              </div>

              {/* Plan 2 */}
              <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-6 sm:p-8">
                <div className="text-sm text-gray-300 mb-1">Plan 2</div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Silver</h2>
                <div className="text-3xl sm:text-4xl font-bold mb-4">
                  $11.99
                </div>

                <ul className="space-y-2 mb-6 text-sm sm:text-base">
                  <li className="flex items-center">• 25 Guests Per Event</li>
                  <li className="flex items-center">• Unlimited Event</li>
                </ul>

                <button className="w-full bg-white text-black py-2.5 rounded-xl text-[13px] font-semibold">
                  Buy Now
                </button>
              </div>

              {/* Plan 3 */}
              <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-6 sm:p-8">
                <div className="text-sm text-gray-300 mb-1">Plan 3</div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Bronze</h2>
                <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4">
                  $7.99
                </div>

                <ul className="space-y-2 mb-6 text-sm sm:text-base">
                  <li className="flex items-center">• 15 Guests Per Event</li>
                  <li className="flex items-center">• Unlimited Event</li>
                </ul>

                <button className="w-full bg-white text-black py-2.5 rounded-xl text-[13px] font-semibold">
                  Buy Now
                </button>
              </div>
            </div>

            {/* VIP Plan */}
            <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-6 sm:p-8 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-300 mb-1">Plan 4</div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                    VIP Plan
                  </h2>
                  <div className="text-3xl sm:text-4xl font-bold mb-4">
                    $99.99
                  </div>
                </div>

                <div className="space-y-2 text-sm sm:text-base">
                  <p>• Fast Track Access</p>
                  <p>• Exclusive Room Access</p>
                  <p>• Specialized Items & Discounts</p>
                  <p>• QR Code Integration</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsVip(true);
                  setSubscriptionModal(true);
                }}
                className="w-full bg-white text-black py-2.5 rounded-xl text-[13px] font-semibold mt-6"
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
