/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "react-modal";
import { FaCrown, FaGem, FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import {
  HiCheckCircle,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlineXMark,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import { IoLocationSharp } from "react-icons/io5";
import {
  useVenueMembershipPlans,
  useGetMyVenueMembership,
  usePurchaseVenueMembership,
  useChangeVenueMembershipPlan,
  useCancelVenueMembership,
} from "../../hooks/queries/useQueries";
import { SuccessToast, ErrorToast } from "../global/Toaster";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import { loungeImg, loungeTwo } from "../../assets/export";

// Safe address formatter - handles strings, objects { line1, city, state, ... }, or missing
const formatAddress = (address) => {
  if (!address) return "Participating Venue";
  if (typeof address === "string") return address;
  if (typeof address === "object") {
    const parts = [
      address.line1,
      address.city,
      address.state ? (address.city ? `${address.state}` : address.state) : null,
      address.postalCode,
    ].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(", ");
    }
  }
  return "Participating Venue";
};

// Safe venue location resolver
const getVenueLocationText = (venue) => {
  if (!venue) return "Participating Venue";
  if (venue.address) {
    const formatted = formatAddress(venue.address);
    if (formatted) return formatted;
  }
  if (venue.location) {
    if (typeof venue.location === "string") return venue.location;
    if (typeof venue.location === "object") {
      const formatted = formatAddress(venue.location.address || venue.location);
      if (formatted) return formatted;
    }
  }
  return "Participating Venue";
};

// Default fallback highlight features per tier if plan.features is not provided in API
const DEFAULT_TIER_HIGHLIGHTS = {
  vip: [
    "VIP privileges at all 3 participating venues",
    "Fast-track skip-the-line entrance during events",
    "Priority reservations and reserved seating access",
    "Discounted bottle service & exclusive food/drink specials",
  ],
  elite_vip: [
    "All VIP tier privileges plus elite upgrades",
    "Fast-track to service bar & 15% priority seating discount",
    "Complimentary welcome drinks during select events",
    "Exclusive themed night & networking mixer access",
  ],
};

const VipSubscription = () => {
  const queryClient = useQueryClient();

  // Sub-tabs: "vip" (Vip Plans) or "elite_vip" (Elite vips)
  const [activeSubTab, setActiveSubTab] = useState("vip");

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [targetSwitchPlan, setTargetSwitchPlan] = useState(null);
  const [purchasingPlanId, setPurchasingPlanId] = useState(null);

  // Expanded benefits toggle map per venue: { [venueId]: true/false }
  const [expandedVenues, setExpandedVenues] = useState({});

  const toggleVenueBenefits = (venueId) => {
    setExpandedVenues((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  const {
    data: plansResponse,
    isLoading: isPlansLoading,
  } = useVenueMembershipPlans();

  const {
    data: mySubData,
    isLoading: isMySubLoading,
  } = useGetMyVenueMembership();

  const purchaseMutation = usePurchaseVenueMembership();
  const changePlanMutation = useChangeVenueMembershipPlan();
  const cancelMutation = useCancelVenueMembership();

  // Handle return from Stripe checkout
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const isSuccess =
      queryParams.get("session_id") ||
      queryParams.get("success") === "true" ||
      queryParams.get("membership_success") === "true";

    if (isSuccess) {
      SuccessToast("Venue membership purchased successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-venue-membership"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [queryClient]);

  // Extract plans array from response
  const rawPlans = Array.isArray(plansResponse)
    ? plansResponse
    : Array.isArray(plansResponse?.data)
    ? plansResponse.data
    : Array.isArray(plansResponse?.plans)
    ? plansResponse.plans
    : [];

  // Match VIP and Elite VIP plans accurately
  const vipPlan =
    rawPlans.find((p) => {
      const key = String(p?.key || "").toLowerCase();
      const label = String(p?.label || p?.name || "").toLowerCase();
      return (key === "vip" || label.includes("vip")) && !key.includes("elite") && !label.includes("elite");
    }) || rawPlans[0];

  const elitePlan =
    rawPlans.find((p) => {
      const key = String(p?.key || "").toLowerCase();
      const label = String(p?.label || p?.name || "").toLowerCase();
      return key.includes("elite") || label.includes("elite");
    }) || rawPlans[1] || rawPlans[0];

  const currentTabPlan = activeSubTab === "elite_vip" ? elitePlan : vipPlan;

  // Active membership resolution
  const userMembership =
    mySubData?.membership ||
    (mySubData?.status ? mySubData : null);

  const isMembershipActive = Boolean(
    userMembership &&
    (userMembership.status === "active" || userMembership.isActive || mySubData?.isActive)
  );

  const activePlanId =
    mySubData?.plan?._id ||
    (typeof userMembership?.planId === "object"
      ? userMembership?.planId?._id
      : userMembership?.planId) ||
    userMembership?.plan?._id ||
    mySubData?.planId;

  const isPlanActive = (plan) => {
    if (!isMembershipActive || !plan) return false;
    if (activePlanId && plan?._id) {
      return String(activePlanId) === String(plan._id);
    }
    const activeKey = String(
      mySubData?.plan?.key ||
      mySubData?.plan?.name ||
      userMembership?.plan?.key ||
      ""
    ).toLowerCase();
    const planKey = String(plan?.key || plan?.name || plan?.label || "").toLowerCase();
    if (activeKey.includes("elite") && planKey.includes("elite")) return true;
    if (
      activeKey.includes("vip") &&
      !activeKey.includes("elite") &&
      planKey.includes("vip") &&
      !planKey.includes("elite")
    ) {
      return true;
    }
    return false;
  };

  const isCurrentPlanActive = isPlanActive(currentTabPlan);

  // Safely extract venues array
  const venuesList = Array.isArray(currentTabPlan?.venues)
    ? currentTabPlan.venues
    : Array.isArray(currentTabPlan?.lounges)
    ? currentTabPlan.lounges
    : [];

  // Safe benefits extractor
  const getVenueBenefits = (venue) => {
    if (Array.isArray(venue?.benefits) && venue.benefits.length > 0) {
      return venue.benefits
        .map((b) => (typeof b === "string" ? b : b?.name || b?.title || b?.description || ""))
        .filter(Boolean);
    }
    if (Array.isArray(venue?.features) && venue.features.length > 0) {
      return venue.features
        .map((f) => (typeof f === "string" ? f : f?.name || f?.title || f?.description || ""))
        .filter(Boolean);
    }
    if (typeof venue?.benefits === "string") {
      return venue.benefits.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [
      "Priority VIP Table Reservations",
      "Fast-track skip-the-line access during events",
      "Complimentary food & drink specials",
      "Member-only promotional discounts",
    ];
  };

  // Safe features extractor for the hero card
  const getPlanHighlights = (plan, tierKey) => {
    if (Array.isArray(plan?.features) && plan.features.length > 0) {
      return plan.features.map((f) => (typeof f === "string" ? f : String(f)));
    }
    return DEFAULT_TIER_HIGHLIGHTS[tierKey] || DEFAULT_TIER_HIGHLIGHTS.vip;
  };

  // Handle plan purchase
  const handlePurchase = async (plan) => {
    if (!plan?._id) return;
    setPurchasingPlanId(plan._id);
    try {
      const res = await purchaseMutation.mutateAsync({
        planId: plan._id,
        payload: {},
      });
      const redirectUrl = res?.data?.checkoutUrl || res?.checkoutUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        ErrorToast("Stripe checkout URL not found in response.");
      }
    } catch (error) {
      console.error("Purchase venue membership error:", error);
      ErrorToast(
        error?.response?.data?.message ||
        "Failed to initiate membership checkout. Please try again."
      );
    } finally {
      setPurchasingPlanId(null);
    }
  };

  // Handle switch plan
  const handleOpenSwitchModal = (targetPlan) => {
    setTargetSwitchPlan(targetPlan);
    setSwitchModalOpen(true);
  };

  const handleConfirmSwitchPlan = async () => {
    if (!targetSwitchPlan?._id) return;
    try {
      const res = await changePlanMutation.mutateAsync({
        newPlanId: targetSwitchPlan._id,
      });
      SuccessToast(
        res?.message ||
        `Successfully switched to ${targetSwitchPlan.label || targetSwitchPlan.name || "new plan"}!`
      );
      queryClient.invalidateQueries({ queryKey: ["my-venue-membership"] });
      queryClient.invalidateQueries({ queryKey: ["venue-membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      setSwitchModalOpen(false);
    } catch (error) {
      console.error("Change venue membership error:", error);
      ErrorToast(
        error?.response?.data?.message ||
        "Failed to switch membership plan. Please try again."
      );
    }
  };

  // Handle cancel membership
  const handleConfirmCancel = async () => {
    try {
      const res = await cancelMutation.mutateAsync({});
      SuccessToast(
        res?.message ||
        "Venue membership cancelled successfully. Access remains active until the end of your billing cycle."
      );
      queryClient.invalidateQueries({ queryKey: ["my-venue-membership"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    } catch (error) {
      console.error("Cancel venue membership error:", error);
      ErrorToast(
        error?.response?.data?.message ||
        "Failed to cancel membership. Please try again."
      );
    } finally {
      setCancelModalOpen(false);
    }
  };

  if (isPlansLoading || isMySubLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-950 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-lg">Loading VIP Membership plans...</p>
      </div>
    );
  }

  if (!currentTabPlan) {
    return (
      <div className="text-center py-16 text-gray-500">
        No venue membership plans found.
      </div>
    );
  }

  const billingIntervalText =
    currentTabPlan.billingInterval || currentTabPlan.interval || "month";

  return (
    <div className="px-4 sm:px-8 lg:px-14 py-8">
      {/* Top Banner if user has an Active Membership */}
      {isMembershipActive && (
        <div className="mb-8 p-5 bg-gradient-to-r from-[#012C57]/10 via-[#012C57]/5 to-transparent border border-[#012C57]/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#012C57] to-[#0A1B2A] flex items-center justify-center text-amber-300 shadow-md flex-shrink-0">
              <FaCrown className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active Membership
                </span>
                {userMembership?.cancelAtPeriodEnd && (
                  <span className="text-[12px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                    Cancels at period end
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                {mySubData?.plan?.label ||
                  mySubData?.plan?.name ||
                  (isPlanActive(elitePlan) ? "Elite VIP Membership" : "VIP Membership")}
              </h3>
              <p className="text-xs text-gray-500">
                Full VIP access across 3 premier venues included. Stripe prorations apply when changing tiers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-lg transition"
            >
              Cancel Membership
            </button>
          </div>
        </div>
      )}

      {/* Two Inside Tabs: Vip Plans and Elite vips */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-0 mb-8">
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => setActiveSubTab("vip")}
            className={`pb-3.5 text-[17px] font-semibold transition relative flex items-center gap-2 ${
              activeSubTab === "vip"
                ? "text-[#012C57] border-b-2 border-[#012C57]"
                : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent"
            }`}
          >
            <FaCrown
              className={`text-sm ${
                activeSubTab === "vip" ? "text-amber-500" : "text-gray-400"
              }`}
            />
            <span>Vip Plans</span>
            {vipPlan && isPlanActive(vipPlan) && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("elite_vip")}
            className={`pb-3.5 text-[17px] font-semibold transition relative flex items-center gap-2 ${
              activeSubTab === "elite_vip"
                ? "text-[#012C57] border-b-2 border-[#012C57]"
                : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent"
            }`}
          >
            <FaGem
              className={`text-sm ${
                activeSubTab === "elite_vip" ? "text-indigo-600" : "text-gray-400"
              }`}
            />
            <span>Elite vips</span>
            {elitePlan && isPlanActive(elitePlan) && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                Active
              </span>
            )}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <HiOutlineSparkles className="text-amber-500" />
          <span>Includes 3 Participating Venues</span>
        </div>
      </div>

      {/* Plan Hero Card */}
      <div className="bg-gradient-to-br from-[#061523] via-[#012C57] to-[#0A3D72] text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-32 top-0 w-40 h-40 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
                {activeSubTab === "elite_vip" ? <FaGem /> : <FaCrown />}
                {activeSubTab === "elite_vip" ? "Elite Tier Access" : "VIP Tier Access"}
              </span>
              {isCurrentPlanActive && (
                <span className="bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                  <HiCheckCircle />
                  Your Current Plan
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentTabPlan.label || currentTabPlan.name || (activeSubTab === "elite_vip" ? "Elite VIP Membership" : "VIP Membership")}
            </h2>

            <p className="text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">
              {currentTabPlan.description ||
                "Unlock all-inclusive VIP benefits, table reservations, and personalized hospitality across all 3 participating partner venues."}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
              {getPlanHighlights(currentTabPlan, activeSubTab).map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                  <HiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-6 lg:min-w-[300px] flex flex-col justify-between self-stretch lg:self-auto shadow-inner">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-300 font-medium">
                Membership Price
              </span>
              <div className="flex items-baseline gap-1 mt-1 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  ${currentTabPlan.displayPrice ?? currentTabPlan.price ?? (activeSubTab === "elite_vip" ? 200 : 100)}
                </span>
                <span className="text-gray-300 text-sm font-medium">
                  /{billingIntervalText}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-normal">
                Includes all 3 partner venues. Prorated automatically if switching tiers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15">
              {isCurrentPlanActive ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full text-center py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
                    <HiCheckCircle className="text-lg" />
                    Currently Subscribed
                  </div>
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(true)}
                    className="w-full text-center py-2 text-xs text-red-300 hover:text-red-200 hover:underline transition"
                  >
                    Cancel Membership
                  </button>
                </div>
              ) : isMembershipActive ? (
                <button
                  type="button"
                  onClick={() => handleOpenSwitchModal(currentTabPlan)}
                  disabled={changePlanMutation.isPending}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-[#061523] py-3 rounded-lg font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {changePlanMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#061523] border-t-transparent rounded-full animate-spin"></div>
                      Switching...
                    </>
                  ) : (
                    <>
                      <span>Switch to {activeSubTab === "elite_vip" ? "Elite VIP" : "VIP"}</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePurchase(currentTabPlan)}
                  disabled={purchasingPlanId !== null}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#061523] py-3 rounded-lg font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {purchasingPlanId === currentTabPlan._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#061523] border-t-transparent rounded-full animate-spin"></div>
                      Connecting to Checkout...
                    </>
                  ) : (
                    <>
                      <span>Subscribe Now</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Venues and Venue-Specific Benefits Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <HiOutlineBuildingStorefront className="text-[#012C57] text-2xl" />
              <span>Included Venues & Venue-Specific Benefits</span>
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {currentTabPlan.label || "This plan"} grants you exclusive privileges and tailored perks across all 3 participating partner venues:
            </p>
          </div>
          <span className="text-xs font-semibold text-[#012C57] bg-[#012C57]/10 px-3 py-1 rounded-full w-fit">
            {venuesList.length} Participating Venues
          </span>
        </div>

        {/* 3 Venue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {venuesList.map((venue, idx) => {
            const venueImage =
              venue.image ||
              venue.images?.[0]?.location ||
              (idx % 2 === 0 ? loungeImg : loungeTwo);

            const benefits = getVenueBenefits(venue);
            const venueLocation = getVenueLocationText(venue);
            const venueId = venue._id || String(idx);
            const isExpanded = Boolean(expandedVenues[venueId]);
            const displayedBenefits = isExpanded ? benefits : benefits.slice(0, 4);
            const hasMoreBenefits = benefits.length > 4;

            return (
              <div
                key={venueId}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Venue Cover Image */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={venueImage}
                      alt={venue.name || "Venue"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = idx % 2 === 0 ? loungeImg : loungeTwo;
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FaCrown className="text-amber-400 text-xs" />
                      <span>Venue {idx + 1} of {venuesList.length}</span>
                    </div>
                  </div>

                  {/* Venue Details */}
                  <div className="p-5">
                    {/* Categories Badges */}
                    {Array.isArray(venue.categories) && venue.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {venue.categories.map((cat, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                          >
                            {typeof cat === "string" ? cat : cat?.name || ""}
                          </span>
                        ))}
                      </div>
                    )}

                    <h4 className="text-lg font-bold text-gray-900 leading-snug">
                      {venue.name || `Partner Venue ${idx + 1}`}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 mb-4">
                      <IoLocationSharp className="text-[#012C57] flex-shrink-0" />
                      <span className="truncate">{venueLocation}</span>
                    </div>

                    {/* Venue-Specific Benefits Box */}
                    <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#012C57]">
                          Venue Privileges:
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500">
                          {benefits.length} perks
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {displayedBenefits.map((benefit, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2 text-xs text-gray-700 leading-tight"
                          >
                            <HiCheckCircle className="text-emerald-600 text-sm flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      {hasMoreBenefits && (
                        <button
                          type="button"
                          onClick={() => toggleVenueBenefits(venueId)}
                          className="mt-3 text-xs font-semibold text-[#012C57] hover:text-[#0A3D72] flex items-center gap-1 transition"
                        >
                          {isExpanded ? (
                            <>
                              <span>Show less</span>
                              <FaChevronUp className="text-[10px]" />
                            </>
                          ) : (
                            <>
                              <span>Show all {benefits.length} perks</span>
                              <FaChevronDown className="text-[10px]" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proration and Billing Info Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
        <HiOutlineInformationCircle className="text-blue-600 text-lg flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-0.5">Stripe Prorations & Cancellation Policy</p>
          <p className="text-blue-700 leading-relaxed">
            When switching between VIP and Elite VIP tiers, Stripe calculates prorations automatically based on your billing cycle. If you cancel your venue membership, you will retain access to all 3 participating venues and their privileges until the end of your current billing period.
          </p>
        </div>
      </div>

      {/* Change Plan Confirmation Modal */}
      {switchModalOpen && targetSwitchPlan && (
        <Modal
          isOpen={switchModalOpen}
          onRequestClose={() => setSwitchModalOpen(false)}
          contentLabel="Switch Membership Tier"
          shouldCloseOnOverlayClick={false}
          className="flex items-center justify-center border-none outline-none z-[1000]"
          overlayClassName="fixed inset-0 bg-[#C6C6C6]/50 backdrop-blur-sm z-[1000] flex justify-center items-center"
        >
          <div className="bg-white rounded-[20px] shadow-2xl p-6 w-[480px] max-w-[92vw] flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <HiOutlineSparkles className="text-amber-500" />
                Change Venue Membership Tier
              </h3>
              <button
                type="button"
                onClick={() => setSwitchModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={changePlanMutation.isPending}
              >
                <HiOutlineXMark size={22} />
              </button>
            </div>

            <p className="text-sm text-gray-600">
              You are switching your venue membership to:
            </p>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  New Tier
                </span>
                <h4 className="text-base font-bold text-gray-900">
                  {targetSwitchPlan.label || targetSwitchPlan.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#012C57]">
                  ${targetSwitchPlan.displayPrice ?? targetSwitchPlan.price}
                </span>
                <span className="text-xs text-gray-500">
                  /{targetSwitchPlan.billingInterval || targetSwitchPlan.interval || "month"}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs leading-relaxed flex items-start gap-2">
              <HiOutlineInformationCircle className="text-amber-600 text-base flex-shrink-0 mt-0.5" />
              <span>
                Stripe will automatically apply prorations to your current billing cycle. Any unused amount will be credited toward this new membership tier.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSwitchModalOpen(false)}
                disabled={changePlanMutation.isPending}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Keep Current Plan
              </button>
              <button
                type="button"
                onClick={handleConfirmSwitchPlan}
                disabled={changePlanMutation.isPending}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#012C57] to-[#0A3D72] hover:opacity-95 transition disabled:opacity-60 flex items-center gap-2"
              >
                {changePlanMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Switching...
                  </>
                ) : (
                  "Confirm & Switch"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Membership Modal */}
      {cancelModalOpen && (
        <CancelSubscriptionModal
          isOpen={cancelModalOpen}
          setIsOpen={() => setCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          loading={cancelMutation.isPending}
          title="Cancel Venue Membership"
          description="Are you sure you want to cancel your venue membership? Cancellation will take effect at the end of your current billing period, and you will retain access to all 3 participating venues until then."
        />
      )}
    </div>
  );
};

export default VipSubscription;
