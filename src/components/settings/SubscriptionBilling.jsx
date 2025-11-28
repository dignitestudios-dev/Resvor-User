import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import Billing from "./Billing";
import UpdatePlan from "./UpdatePlan";

const SubscriptionBilling = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("billing");
  // const [subscriptionModal, setSubscriptionModal] = useState(false);

  const tabs = [
    { key: "billing", label: "Billing" },
    { key: "plan", label: "Plans" },
  ];

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate("/app/settings")}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            Subscription Plan
          </h2>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div
          className="bg-white rounded-xl -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="border-b border-gray-300 w-full mb-2 px-8 pt-6">
            <nav className="flex flex-wrap gap-1 md:gap-2 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                  px-3 py-2 text-[16px] transition-all duration-200
                  border-b-2 whitespace-nowrap
                  ${
                    activeTab === tab.key
                      ? "border-indigo-900 text-blue-950 font-[600]"
                      : "border-transparent text-[#727272] hover:text-gray-700 hover:border-[#727272]"
                  }
                `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "billing" ? <Billing /> : <UpdatePlan />}
        </div>
      </div>
    </>
  );
};

export default SubscriptionBilling;
