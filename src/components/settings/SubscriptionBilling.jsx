import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router";
import Billing from "./Billing";
import UpdatePlan from "./UpdatePlan";
import VipSubscription from "./VipSubscription";
import Wallet from "./Wallet";

const SubscriptionBilling = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTab = () => {
    if (location.state?.tab) return location.state.tab;
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam === "vip" || tabParam === "vip-subscription") return "vip-subscription";
    if (tabParam === "plan" || tabParam === "plans") return "plan";
    if (tabParam === "wallet") return "wallet";
    if (location.pathname.includes("wallet")) return "wallet";
    return "wallet";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    } else {
      const searchParams = new URLSearchParams(location.search);
      const tabParam = searchParams.get("tab");
      if (tabParam === "vip" || tabParam === "vip-subscription") {
        setActiveTab("vip-subscription");
      } else if (tabParam === "plan" || tabParam === "plans") {
        setActiveTab("plan");
      } else if (location.pathname.includes("wallet")) {
        setActiveTab("wallet");
      }
    }
  }, [location.pathname, location.search, location.state]);

  const tabs = [
    // { key: "billing", label: "Billing" },
    { key: "wallet", label: "Wallet" },
    { key: "plan", label: "Plans" },
    { key: "vip-subscription", label: "Vip Subscription" },
  ];

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            {activeTab === "wallet"
              ? "Wallet"
              : activeTab === "vip-subscription"
              ? "VIP Subscription"
              : "Subscription Plans"}
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
                  ${activeTab === tab.key
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
          {/* activeTab === "billing" ? (
            <Billing />
          ) : */}
          {
            activeTab === "plan" ? (
              <UpdatePlan />
            ) : activeTab === "vip-subscription" ? (
              <VipSubscription />
            ) : (
              <Wallet />
            )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionBilling;
