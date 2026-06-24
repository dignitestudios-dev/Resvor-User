/* eslint-disable react/prop-types */

import { useState } from "react";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSubscriptionPlans,
  usePurchaseSubscription,
  useCancelSubscription,
  useGetMySubscription,
} from "../../hooks/queries/useQueries";
import { SuccessToast, ErrorToast } from "../global/Toaster";

const UpdatePlan = ({ setSubscriptionModal, subscriptionModal }) => {
  const queryClient = useQueryClient();
  const [cancelSubscriptionModal, setCancelSubscriptionModal] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const { data: plansResponse, isLoading: isPlansLoading } = useSubscriptionPlans();
  const { data: mySubData, isLoading: isMySubLoading } = useGetMySubscription();
  const purchaseMutation = usePurchaseSubscription();
  const cancelMutation = useCancelSubscription();

  const plans = plansResponse?.data || [];
  const standardPlans = plans.filter((plan) => plan.key !== "vip");
  const vipPlan = plans.find((plan) => plan.key === "vip");

  const hasActiveSub = !!(mySubData?.isActive && mySubData?.subscription?.status === "active");
  const activePlanId = hasActiveSub
    ? (typeof mySubData?.subscription?.planId === "object"
        ? mySubData?.subscription?.planId?._id
        : mySubData?.subscription?.planId)
    : null;

  const handleBuyNow = async (plan) => {
    setLoadingPlanId(plan._id);
    try {
      const res = await purchaseMutation.mutateAsync({
        planId: plan._id,
        payload: {}
      });
      const redirectUrl = res?.data?.checkoutUrl;
      if (redirectUrl) {
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

  const handleCancelSubscription = async () => {
    try {
      const response = await cancelMutation.mutateAsync({});
      if (response?.success) {
        SuccessToast(response?.message || "Subscription cancelled successfully.");
        queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
        queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      } else {
        ErrorToast(response?.message || "Failed to cancel subscription.");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      ErrorToast(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setCancelSubscriptionModal(false);
    }
  };

  if (isPlansLoading || isMySubLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-950 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-lg">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="px-8 sm:px-16 py-12">
      {plans.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No subscription plans available at the moment.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {standardPlans.map((plan, index) => {
          const isActive = activePlanId === plan._id;
          return (
            <div key={plan._id} className="border border-[#CACACA] rounded-[12px] p-8 flex flex-col justify-between transition">
              <div>
                <div className="text-[16px] text-[#181818B2] mb-2">Plan {index + 1}</div>
                <h2 className="text-[32px] font-bold text-[#181818] mb-4 capitalize">{plan.label}</h2>
                <div className={`text-[38px] font-bold mb-6 ${
                  plan.key === "gold" ? "text-orange-400" : plan.key === "bronze" ? "text-orange-500" : "text-blue-950"
                }`}>
                  ${plan.displayPrice}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features?.map((feature, fIdx) => (
                    <li key={fIdx} className="text-[#181818] text-[14px] font-[500] flex items-center">
                      <span className="mr-3">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                {isActive ? (
                  <button
                    type="button"
                    onClick={() => setCancelSubscriptionModal(true)}
                    className="w-full bg-[#E8E8E8] text-red-500 text-[14px] rounded-[8px] py-2.5 font-semibold hover:bg-[#D8D8D8] transition"
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuyNow(plan)}
                    disabled={loadingPlanId !== null}
                    className="w-full bg-gradient-to-l from-[#012C57] to-[#061523] text-white hover:opacity-90 text-[13px] rounded-lg py-2.5 font-semibold transition disabled:opacity-60 flex justify-center items-center gap-2"
                  >
                    {loadingPlanId === plan._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      hasActiveSub ? "Update Plan" : "Subscribe"
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* VIP Plan */}
      {vipPlan && (
        <div className="border border-[#CACACA] rounded-[12px] p-8 mt-6 w-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[16px] text-[#181818B2] mb-2">Plan {standardPlans.length + 1}</div>
              <h2 className="text-[32px] font-bold text-[#181818] mb-4 capitalize">
                {vipPlan.label}
              </h2>
              <div className="text-[38px] font-bold text-indigo-900 mb-6">
                ${vipPlan.displayPrice}
              </div>
            </div>

            <div className="space-y-3 text-[#181818] text-[14px] font-[500]">
              {vipPlan.features?.map((feature, fIdx) => (
                <p key={fIdx} className="flex items-center">
                  <span className="mr-3">•</span>
                  {feature}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activePlanId === vipPlan._id ? (
              <button
                type="button"
                onClick={() => setCancelSubscriptionModal(true)}
                className="w-full bg-[#E8E8E8] text-red-500 text-[14px] rounded-[8px] py-2.5 font-semibold hover:bg-[#D8D8D8] transition"
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleBuyNow(vipPlan)}
                disabled={loadingPlanId !== null}
                className="w-full bg-gradient-to-l from-[#012C57] to-[#061523] text-white hover:opacity-90 text-[13px] rounded-lg py-2.5 font-semibold transition disabled:opacity-60 flex justify-center items-center gap-2"
              >
                {loadingPlanId === vipPlan._id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  hasActiveSub ? "Update Plan" : "Subscribe"
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {cancelSubscriptionModal && (
        <CancelSubscriptionModal
          isOpen={cancelSubscriptionModal}
          setIsOpen={() => setCancelSubscriptionModal(false)}
          onConfirm={handleCancelSubscription}
          loading={cancelMutation.isPending}
        />
      )}
    </div>
  );
};

export default UpdatePlan;
