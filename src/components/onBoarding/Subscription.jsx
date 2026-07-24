/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import BuySubscriptionModal from "./BuySubscriptionModal";
import AuthButton from "../auth/AuthButton";
import { successLight } from "../../assets/export";
import { useAuthMe, usePurchaseSubscription, useSubscriptionPlans } from "../../hooks/queries/useQueries";
import { useNavigate } from "react-router";
import { ErrorToast } from "../global/Toaster";
import { useQueryClient } from "@tanstack/react-query";

const Subscription = ({ handlePrevious }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [subscriptionModal, setSubscriptionModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const { data: plansResponse, isLoading } = useSubscriptionPlans();
  const plans = plansResponse?.data || [];
  const purchaseMutation = usePurchaseSubscription();
  const { data: authData, refetch: refetchAuth } = useAuthMe();
  const standardPlans = plans.filter((plan) => plan.key !== "vip");
  const vipPlan = plans.find((plan) => plan.key === "vip");

  console.log("authData", authData?.data?.user?.isSubscribed);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const isSuccess = queryParams.get("session_id") || queryParams.get("success") === "true";
    if (isSuccess) {
      setCompleted(true); // Automatically show success UI upon returning from payment
      refetchAuth();
    }
  }, [refetchAuth]);

  useEffect(() => {
    const isSubscribed = authData?.data?.isSubscribed || authData?.data?.user?.isSubscribed;
    if (isSubscribed) {
      setCompleted(true);
    }
  }, [authData]);

  const handleBuyNow = async (plan) => {
    setSelectedPlan(plan);
    setLoadingPlanId(plan._id);
    try {
      const res = await purchaseMutation.mutateAsync({
        planId: plan._id,
        payload: {}
      });
      const redirectUrl = res?.data?.checkoutUrl;
      if (redirectUrl) {
        queryClient.invalidateQueries({ queryKey: ["auth-me"] });
        window.location.href = redirectUrl;
      } else {
        ErrorToast("Redirect URL not found in API response.");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      ErrorToast(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full text-white relative px-4 py-6">
      {/* Back Button */}
      {/* <div className="absolute top-4 left-4">
        <button type="button" onClick={handlePrevious}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div> */}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300 text-lg">Loading plans...</p>
        </div>
      ) : completed ? (
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
              onClick={() => {
                localStorage.setItem("onboarding_complete_acknowledged", "true");
                localStorage.setItem("show_welcome_walkthrough", "true");
                queryClient.invalidateQueries({ queryKey: ["auth-me"] });
                navigate("/app/home");
              }}
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
            {plans.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                No subscription plans available at the moment.
              </div>
            )}

            {/* 3 Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {standardPlans.map((plan, index) => (
                <div key={plan._id} className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-gray-300 mb-1">Plan {index + 1}</div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 capitalize">{plan.label}</h2>
                    <div className={`text-3xl sm:text-4xl font-bold mb-4 ${plan.key === "gold" ? "text-orange-400" : plan.key === "bronze" ? "text-orange-500" : ""
                      }`}>
                      ${plan.displayPrice}
                    </div>

                    <ul className="space-y-2 mb-6 text-sm sm:text-base">
                      {plan.features?.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center">• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBuyNow(plan)}
                    disabled={loadingPlanId !== null}
                    className="w-full bg-white text-black py-2.5 rounded-xl text-[13px] font-semibold mt-auto flex justify-center items-center gap-2 disabled:opacity-60"
                  >
                    {loadingPlanId === plan._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      "Buy Now"
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* VIP Plan */}
            {vipPlan && (
              <div className="bg-[#EFEFEF1A] border border-[#CACACA] rounded-3xl p-6 sm:p-8 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-300 mb-1">Plan {standardPlans.length + 1}</div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-3 capitalize">
                      {vipPlan.label}
                    </h2>
                    <div className="text-3xl sm:text-4xl font-bold mb-4">
                      ${vipPlan.displayPrice}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm sm:text-base">
                    {vipPlan.features?.map((feature, fIdx) => (
                      <p key={fIdx}>• {feature}</p>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBuyNow(vipPlan)}
                  disabled={loadingPlanId !== null}
                  className="w-full bg-white text-black py-2.5 rounded-xl text-[13px] font-semibold mt-6 flex justify-center items-center gap-2 disabled:opacity-60"
                >
                  {loadingPlanId === vipPlan._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {
        !completed && (
          <div className="w-full mt-6">
            <button
              onClick={() => {
                localStorage.setItem("onboarding_complete_acknowledged", "true");
                localStorage.setItem("show_welcome_walkthrough", "true");
                queryClient.invalidateQueries({ queryKey: ["auth-me"] });
                navigate("/app/home");
              }}
              className="w-full bg-[#EFEFEF1A] border border-[#CACACA] text-white py-2.5 rounded-xl text-[13px] font-semibold mt-auto"
            >
              Skip
            </button>
          </div>
        )
      }
    </div>
  );
};

export default Subscription;
