/* eslint-disable react/prop-types */

import Button from "../global/Button";
import { useState } from "react";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import { useNavigate } from "react-router";

const UpdatePlan = ({ setSubscriptionModal, subscriptionModal }) => {
  console.log("🚀 ~ UpdatePlan ~ subscriptionModal:", subscriptionModal);
  const [cancelSubscriptionModal, setCancelSubscriptionModal] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="px-16 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Plan 1 - Gold */}
        <div className=" border border-[#CACACA] rounded-[12px] p-8 transition">
          <div className="text-[16px] text-[##181818B2] mb-2">Plan 1</div>
          <h2 className="text-[32px] font-bold text-[#181818] mb-4">Gold</h2>
          <div className="text-[38px] font-bold text-orange-400 mb-6">
            $15.99
          </div>
          <ul className="space-y-3 mb-8">
            <li className="text-[#181818] text-[14px] font-[500] flex items-center">
              <span className="mr-3">•</span>
              50 Guests Per Event
            </li>
            <li className="text-[#181818] text-[14px] font-[500] flex items-center">
              <span className="mr-3">•</span>
              Unlimited Event
            </li>
          </ul>
          <div>
            <Button
              text="Update Plan"
              type="button"
              onClick={() => setCancelSubscriptionModal(true)}
            />
          </div>
        </div>

        {/* Plan 2 - Silver */}
        <div className=" border border-[#CACACA] rounded-[12px] p-8 transition">
          <div className="text-[16px] text-[##181818B2] mb-2">Plan 2</div>
          <h2 className="text-[32px] font-bold text-[#181818] mb-4">Silver</h2>
          <div className="text-[38px] font-bold text-gray-300 mb-6">$11.99</div>
          <ul className="space-y-3 mb-8">
            <li className="text-[#181818] text-[14px] font-[500] flex items-center">
              <span className="mr-3">•</span>
              25 Guests Per Event
            </li>
            <li className="text-[#181818] text-[14px] font-[500] flex items-center">
              <span className="mr-3">•</span>
              Unlimited Event
            </li>
          </ul>
          <div>
            <Button
              text="Update Plan"
              type="button"
              onClick={() => setSubscriptionModal(true)}
            />
          </div>
        </div>

        {/* Plan 3 - Bronze */}
        <div className=" border border-[#CACACA] rounded-[12px] p-8 transition">
          <div className="text-[16px] text-[##181818B2] mb-2">Plan 3</div>
          <h2 className="text-[32px] font-bold text-[#181818] mb-4">Bronze</h2>
          <div className="text-[38px] font-bold text-orange-500 mb-6">
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
          <div>
            <Button
              text="Update Plan"
              type="button"
              onClick={() => setSubscriptionModal(true)}
            />
          </div>
        </div>
      </div>
      {cancelSubscriptionModal && (
        <CancelSubscriptionModal
          isOpen={cancelSubscriptionModal}
          setIsOpen={() => setCancelSubscriptionModal(false)}
          onConfirm={() => navigate("/app/settings")}
        />
      )}
    </div>
  );
};

export default UpdatePlan;
