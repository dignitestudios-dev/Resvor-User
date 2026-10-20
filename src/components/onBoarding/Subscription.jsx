/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FaCrown, FaGem, FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import {
  HiCheckCircle,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import { IoLocationSharp } from "react-icons/io5";

import AuthButton from "../auth/AuthButton";
import { successLight, loungeImg, loungeTwo } from "../../assets/export";
import {
  useAuthMe,
  useSubscriptionPlans,
  usePurchaseSubscription,
  useVenueMembershipPlans,
  usePurchaseVenueMembership,
  useGetMyVenueMembership,
} from "../../hooks/queries/useQueries";
import { ErrorToast } from "../global/Toaster";

// Safe address formatter
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

// Default fallback highlight features per tier
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

const Subscription = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Top-level tabs: "plans" (Standard Plans) or "vip" (Vip Subscription)
  const [activeMainTab, setActiveMainTab] = useState("plans");

  // VIP Sub-tabs: "vip" (Vip Plans) or "elite_vip" (Elite vips)
  const [activeVipSubTab, setActiveVipSubTab] = useState("vip");

  const [completed, setCompleted] = useState(false);
  const [loadingStandardPlanId, setLoadingStandardPlanId] = useState(null);
  const [purchasingVenuePlanId, setPurchasingVenuePlanId] = useState(null);
  const [expandedVenues, setExpandedVenues] = useState({});

  // Standard Plans Queries
  const { data: standardPlansResponse, isLoading: isStandardLoading } = useSubscriptionPlans();
  const purchaseStandardMutation = usePurchaseSubscription();

  // VIP Venue Membership Queries
  const { data: venuePlansResponse, isLoading: isVenueLoading } = useVenueMembershipPlans();
  const { data: myVenueSubData } = useGetMyVenueMembership();
  const purchaseVenueMutation = usePurchaseVenueMembership();

  const { data: authData, refetch: refetchAuth } = useAuthMe();

  const toggleVenueBenefits = (venueId) => {
    setExpandedVenues((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  // Handle return from Stripe checkout
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const isSuccess =
      queryParams.get("session_id") ||
      queryParams.get("success") === "true" ||
      queryParams.get("membership_success") === "true";

    if (isSuccess) {
      setCompleted(true);
      refetchAuth();
      queryClient.invalidateQueries({ queryKey: ["my-venue-membership"] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    }
  }, [queryClient, refetchAuth]);

  // If user already subscribed
  useEffect(() => {
    const isSubscribed =
      authData?.data?.isSubscribed ||
      authData?.data?.user?.isSubscribed ||
      myVenueSubData?.isActive ||
      myVenueSubData?.status === "active";
    if (isSubscribed) {
      setCompleted(true);
    }
  }, [authData, myVenueSubData]);

  const isCancelled = Boolean(
    myVenueSubData?.membership?.cancelAtPeriodEnd ||
    myVenueSubData?.cancelAtPeriodEnd
  );

  const periodEndDate =
    myVenueSubData?.membership?.periodEnd ||
    myVenueSubData?.periodEnd;

  const formattedPeriodEnd = periodEndDate
    ? new Date(periodEndDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "period end";

  // Standard Plans Processing
  const standardPlansList = (standardPlansResponse?.data || []).filter(
    (plan) => plan.key !== "vip"
  );

  // VIP Venue Plans Processing
  const rawVenuePlans = Array.isArray(venuePlansResponse)
    ? venuePlansResponse
    : Array.isArray(venuePlansResponse?.data)
    ? venuePlansResponse.data
    : Array.isArray(venuePlansResponse?.plans)
    ? venuePlansResponse.plans
    : [];

  const vipPlan =
    rawVenuePlans.find((p) => {
      const key = String(p?.key || "").toLowerCase();
      const label = String(p?.label || p?.name || "").toLowerCase();
      return (
        (key === "vip" || label.includes("vip")) &&
        !key.includes("elite") &&
        !label.includes("elite")
      );
    }) || rawVenuePlans[0];

  const elitePlan =
    rawVenuePlans.find((p) => {
      const key = String(p?.key || "").toLowerCase();
      const label = String(p?.label || p?.name || "").toLowerCase();
      return key.includes("elite") || label.includes("elite");
    }) || rawVenuePlans[1] || rawVenuePlans[0];

  const currentVenuePlan = activeVipSubTab === "elite_vip" ? elitePlan : vipPlan;

  const venuesList = Array.isArray(currentVenuePlan?.venues)
    ? currentVenuePlan.venues
    : Array.isArray(currentVenuePlan?.lounges)
    ? currentVenuePlan.lounges
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

  const getPlanHighlights = (plan, tierKey) => {
    if (Array.isArray(plan?.features) && plan.features.length > 0) {
      return plan.features.map((f) => (typeof f === "string" ? f : String(f)));
    }
    return DEFAULT_TIER_HIGHLIGHTS[tierKey] || DEFAULT_TIER_HIGHLIGHTS.vip;
  };

  // Buy Standard Plan
  const handleBuyStandardPlan = async (plan) => {
    setLoadingStandardPlanId(plan._id);
    try {
      const res = await purchaseStandardMutation.mutateAsync({
        planId: plan._id,
        payload: {},
      });
      const redirectUrl = res?.data?.checkoutUrl || res?.checkoutUrl;
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
      setLoadingStandardPlanId(null);
    }
  };

  // Buy VIP Venue Plan
  const handleBuyVenuePlan = async (plan) => {
    if (!plan?._id) return;
    setPurchasingVenuePlanId(plan._id);
    try {
      const res = await purchaseVenueMutation.mutateAsync({
        planId: plan._id,
        payload: {},
      });
      const redirectUrl = res?.data?.checkoutUrl || res?.checkoutUrl;
      if (redirectUrl) {
        queryClient.invalidateQueries({ queryKey: ["auth-me"] });
        queryClient.invalidateQueries({ queryKey: ["my-venue-membership"] });
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
      setPurchasingVenuePlanId(null);
    }
  };

  // Onboarding Skip / Done
  const handleFinishOnboarding = () => {
    localStorage.setItem("onboarding_complete_acknowledged", "true");
    localStorage.setItem("show_welcome_walkthrough", "true");
    queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    navigate("/app/home");
  };

  if (completed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] w-full text-white text-center space-y-4 max-w-sm mx-auto px-4 py-8">
        <div className="flex justify-center pb-2">
          <img src={successLight} alt="success" className="w-[100px] sm:w-[120px]" />
        </div>

        <p className="text-[28px] sm:text-[34px] font-bold">Account Created</p>
        <p className="text-[14px] sm:text-[16px] text-gray-300">
          Your profile has been created successfully. Welcome to Resvor!
        </p>

        <div className="mt-6 w-full max-w-xs mx-auto">
          <AuthButton type="button" text={"Explore Lounges"} onClick={handleFinishOnboarding} />
        </div>
      </div>
    );
  }

  const billingIntervalText =
    currentVenuePlan?.billingInterval || currentVenuePlan?.interval || "month";

  return (
    <div className="flex flex-col w-full text-white relative px-2 sm:px-4 py-4 sm:py-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="text-center space-y-2 mb-6">
        <p className="text-[28px] sm:text-[34px] font-bold tracking-tight">
          Subscription Plans
        </p>
        <p className="text-[14px] sm:text-[15px] text-gray-300 max-w-lg mx-auto">
          {activeMainTab === "plans"
            ? "Choose your subscription plan to start creating and managing events."
            : "Choose your VIP membership tier to unlock exclusive privileges across partner venues."}
        </p>
      </div>

      {/* Main Tabs (Like in Settings: Plans & Vip Subscription) */}
      <div className="w-full border-b border-white/20 mb-8 flex justify-center sm:justify-start">
        <nav className="flex gap-4 sm:gap-8 -mb-px">
          <button
            type="button"
            onClick={() => setActiveMainTab("plans")}
            className={`pb-3 text-base sm:text-lg font-bold transition-all duration-200 border-b-2 flex items-center gap-2 ${
              activeMainTab === "plans"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Plans</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab("vip")}
            className={`pb-3 text-base sm:text-lg font-bold transition-all duration-200 border-b-2 flex items-center gap-2 ${
              activeMainTab === "vip"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <FaCrown
              className={activeMainTab === "vip" ? "text-amber-400" : "text-gray-400"}
            />
            <span>Vip Subscription</span>
          </button>
        </nav>
      </div>

      {/* ──────────────── TAB 1: STANDARD PLANS ──────────────── */}
      {activeMainTab === "plans" && (
        <>
          {isStandardLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-300 text-lg">Loading plans...</p>
            </div>
          ) : standardPlansList.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-[#EFEFEF1A] border border-[#CACACA]/30 rounded-2xl">
              No subscription plans available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full">
              {standardPlansList.map((plan, index) => (
                <div
                  key={plan._id}
                  className="bg-[#EFEFEF1A] border border-[#CACACA]/30 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-400/40 transition duration-300 shadow-xl"
                >
                  <div>
                    <div className="text-sm text-gray-400 mb-2 font-medium">Plan {index + 1}</div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 capitalize text-white">
                      {plan.label || plan.name}
                    </h2>
                    <div
                      className={`text-3xl sm:text-4xl font-extrabold mb-5 ${
                        plan.key === "gold"
                          ? "text-amber-400"
                          : plan.key === "silver"
                          ? "text-slate-200"
                          : plan.key === "bronze"
                          ? "text-amber-600"
                          : "text-white"
                      }`}
                    >
                      ${plan.displayPrice ?? plan.price}
                    </div>

                    <ul className="space-y-3 mb-8 text-sm sm:text-base text-gray-200">
                      {plan.features?.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBuyStandardPlan(plan)}
                    disabled={loadingStandardPlanId !== null}
                    className="w-full mt-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#061523] py-3 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loadingStandardPlanId === plan._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#061523] border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ──────────────── TAB 2: VIP SUBSCRIPTION ──────────────── */}
      {activeMainTab === "vip" && (
        <>
          {isVenueLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-300 text-lg">Loading VIP Membership plans...</p>
            </div>
          ) : (
            <>
              {/* VIP Sub-tabs: Vip Plans & Elite vips */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full border-b border-white/15 pb-3 mb-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={() => setActiveVipSubTab("vip")}
                    className={`pb-2.5 text-[15px] sm:text-[17px] font-semibold transition relative flex items-center gap-2 ${
                      activeVipSubTab === "vip"
                        ? "text-amber-400 border-b-2 border-amber-400"
                        : "text-gray-400 hover:text-white border-b-2 border-transparent"
                    }`}
                  >
                    <FaCrown
                      className={`text-sm ${
                        activeVipSubTab === "vip" ? "text-amber-400" : "text-gray-400"
                      }`}
                    />
                    <span>Vip Plans</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveVipSubTab("elite_vip")}
                    className={`pb-2.5 text-[15px] sm:text-[17px] font-semibold transition relative flex items-center gap-2 ${
                      activeVipSubTab === "elite_vip"
                        ? "text-amber-400 border-b-2 border-amber-400"
                        : "text-gray-400 hover:text-white border-b-2 border-transparent"
                    }`}
                  >
                    <FaGem
                      className={`text-sm ${
                        activeVipSubTab === "elite_vip" ? "text-indigo-400" : "text-gray-400"
                      }`}
                    />
                    <span>Elite vips</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
                  <HiOutlineSparkles className="text-amber-400" />
                  <span>Includes {venuesList.length || 3} Participating Venues</span>
                </div>
              </div>

              {/* VIP Hero Plan Card */}
              {currentVenuePlan && (
                <div className="bg-[#EFEFEF1A] border border-[#CACACA]/30 backdrop-blur-md text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-16 -bottom-16 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute right-24 top-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                          {activeVipSubTab === "elite_vip" ? <FaGem /> : <FaCrown />}
                          {activeVipSubTab === "elite_vip"
                            ? "Elite Tier Access"
                            : "VIP Tier Access"}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        {currentVenuePlan.label ||
                          currentVenuePlan.name ||
                          (activeVipSubTab === "elite_vip"
                            ? "Elite VIP Membership"
                            : "VIP Membership")}
                      </h2>

                      <p className="text-gray-300 text-sm sm:text-base mt-2 leading-relaxed">
                        {currentVenuePlan.description ||
                          "Unlock all-inclusive VIP benefits, table reservations, and personalized hospitality across all 3 participating partner venues."}
                      </p>

                      {/* Highlights */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
                        {getPlanHighlights(currentVenuePlan, activeVipSubTab).map(
                          (feature, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-2 text-xs sm:text-sm text-gray-200"
                            >
                              <HiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="bg-black/35 backdrop-blur-md border border-white/15 rounded-2xl p-6 lg:min-w-[280px] flex flex-col justify-between self-stretch lg:self-auto shadow-inner">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gray-300 font-medium">
                          Membership Price
                        </span>
                        <div className="flex items-baseline gap-1 mt-1 mb-2">
                          <span className="text-4xl sm:text-5xl font-black text-white">
                            $
                            {currentVenuePlan.displayPrice ??
                              currentVenuePlan.price ??
                              (activeVipSubTab === "elite_vip" ? 200 : 100)}
                          </span>
                          <span className="text-gray-300 text-sm font-medium">
                            /{billingIntervalText}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-normal">
                          Includes all participating partner venues. Prorated automatically if
                          switching tiers.
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/15">
                        {Boolean(
                          (myVenueSubData?.membership?.planId?._id === currentVenuePlan?._id ||
                            myVenueSubData?.membership?.planId === currentVenuePlan?._id) &&
                            isCancelled
                        ) ? (
                          <div className="w-full text-center py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5">
                            <span>Already Cancelled (Ends {formattedPeriodEnd})</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleBuyVenuePlan(currentVenuePlan)}
                            disabled={purchasingVenuePlanId !== null}
                            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#061523] py-3.5 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                          >
                            {purchasingVenuePlanId === currentVenuePlan._id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[#061523] border-t-transparent rounded-full animate-spin"></div>
                                <span>Connecting to Checkout...</span>
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
              )}

              {/* 3 Venues and Benefits Section */}
              <div className="mb-6 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <HiOutlineBuildingStorefront className="text-amber-400 text-2xl" />
                      <span>Included Venues & Venue-Specific Benefits</span>
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1">
                      {currentVenuePlan?.label || "This plan"} grants you exclusive privileges and
                      tailored perks across all participating partner venues:
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full w-fit">
                    {venuesList.length} Participating Venues
                  </span>
                </div>

                {/* 3 Venue Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                        className="bg-[#EFEFEF1A] border border-[#CACACA]/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-amber-400/40 transition duration-300"
                      >
                        <div>
                          {/* Venue Cover Image */}
                          <div className="relative h-44 w-full bg-black/40 overflow-hidden">
                            <img
                              src={venueImage}
                              alt={venue.name || "Venue"}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = idx % 2 === 0 ? loungeImg : loungeTwo;
                              }}
                            />
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                              <FaCrown className="text-amber-400 text-xs" />
                              <span>
                                Venue {idx + 1} of {venuesList.length}
                              </span>
                            </div>
                          </div>

                          {/* Venue Details */}
                          <div className="p-4 sm:p-5">
                            {Array.isArray(venue.categories) && venue.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {venue.categories.map((cat, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="text-[10px] font-semibold bg-white/10 text-gray-200 px-2 py-0.5 rounded-md"
                                  >
                                    {typeof cat === "string" ? cat : cat?.name || ""}
                                  </span>
                                ))}
                              </div>
                            )}

                            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                              {venue.name || `Partner Venue ${idx + 1}`}
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-gray-300 mt-1 mb-3">
                              <IoLocationSharp className="text-amber-400 flex-shrink-0" />
                              <span className="truncate">{venueLocation}</span>
                            </div>

                            {/* Venue-Specific Benefits Box */}
                            <div className="bg-black/35 border border-white/10 rounded-xl p-3.5 mt-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                                  Venue Privileges:
                                </span>
                                <span className="text-[10px] font-semibold text-gray-400">
                                  {benefits.length} perks
                                </span>
                              </div>

                              <ul className="space-y-2">
                                {displayedBenefits.map((benefit, bIdx) => (
                                  <li
                                    key={bIdx}
                                    className="flex items-start gap-2 text-xs text-gray-200 leading-tight"
                                  >
                                    <HiCheckCircle className="text-emerald-400 text-sm flex-shrink-0 mt-0.5" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>

                              {hasMoreBenefits && (
                                <button
                                  type="button"
                                  onClick={() => toggleVenueBenefits(venueId)}
                                  className="mt-3 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
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
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3 text-xs text-gray-300">
                <HiOutlineInformationCircle className="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-0.5">
                    VIP Membership Access & Benefits
                  </p>
                  <p className="leading-relaxed text-gray-300">
                    Subscribing to a VIP or Elite VIP membership grants you instant access across all
                    partner venues. You can change your tier or manage your membership at any time
                    from your account settings.
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Skip for Now Button (Common for both tabs) */}
      <div className="w-full mt-6">
        <button
          type="button"
          onClick={handleFinishOnboarding}
          className="w-full bg-[#EFEFEF1A] border border-[#CACACA]/40 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-semibold transition"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
};

export default Subscription;
