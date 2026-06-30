/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWalletMe, useWalletTransactions } from "../../hooks/queries/useQueries";
import { useWalletTopup } from "../../hooks/mutations/OnboardingMutations";
import { SuccessToast, ErrorToast } from "../global/Toaster";
import { RxCross2 } from "react-icons/rx";
import Button from "../global/Button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_URL || "");

if (!import.meta.env.VITE_APP_STRIPE_URL) {
  console.warn("VITE_APP_STRIPE_URL is not set in the .env file!");
}

/* ─── helpers ─────────────────────────────────────── */
// API stores & sends amounts in CENTS; display in DOLLARS
const centsToDollars = (cents) => (cents / 100).toFixed(2);

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusStyle = (status) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/* ─── Stripe Card Form ─────────────────────────────── */
const cardElementOptions = {
  style: {
    base: {
      color: "#212935",
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#737373",
      },
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
};

const StripeCardForm = ({ onSubmitCard, isValidatingCard }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardName, setCardName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!cardName.trim()) {
      ErrorToast("Please enter cardholder name.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    onSubmitCard(stripe, cardElement, cardName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5 w-full pt-2 px-16">
        <div className="pt-2 space-y-2 text-center">
          <h2 className="text-[36px] font-semibold capitalize">
            Card Details
          </h2>
          <p className="text-[#565656] text-[16px]">
            Please enter your card details to process payment.
          </p>
        </div>

        {/* Card Holder Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[500] text-[#737373]">
            Cardholder Name
          </label>
          <input
            type="text"
            placeholder="Enter cardholder name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-[12px] bg-transparent ring-1 ring-[#BEBEBE] focus:ring-2 focus:ring-gray-200 focus:outline-none placeholder:text-[#737373] placeholder:font-light"
            disabled={isValidatingCard}
            required
          />
        </div>

        {/* Card Information */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-[500] text-[#737373]">
            Card Information
          </label>
          <div className="w-full px-4 py-3.5 rounded-[12px] bg-transparent ring-1 ring-[#BEBEBE] focus-within:ring-2 focus-within:ring-gray-200">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isValidatingCard || !stripe}
            className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-bold px-4 py-3 rounded-[12px] w-[97%] disabled:opacity-60 flex justify-center items-center gap-2"
          >
            {isValidatingCard ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

/* ─── TopUp Modal ──────────────────────────────────── */
const TopUpModalContent = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { mutate: topup, isPending } = useWalletTopup();

  // steps: "card" | "amount"
  const [step, setStep] = useState("card");

  // amount fields
  const [amountDollars, setAmountDollars] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [isValidatingCard, setIsValidatingCard] = useState(false);

  // Step 1: Handle Stripe Payment Method Creation
  const handleCardSubmit = async (stripe, cardElement, cardName) => {
    setIsValidatingCard(true);
    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardName,
        },
      });

      if (error) {
        ErrorToast(error.message);
        setIsValidatingCard(false);
        return;
      }

      setPaymentMethodId(paymentMethod.id);
      setStep("amount");
    } catch (err) {
      console.error(err);
      ErrorToast("Failed to process card. Please try again.");
    } finally {
      setIsValidatingCard(false);
    }
  };

  // Step 2: Handle API topup submission
  const handleAmountSubmit = (e) => {
    e.preventDefault();
    const dollars = parseFloat(amountDollars);
    if (!dollars || dollars <= 0) {
      ErrorToast("Please enter a valid amount.");
      return;
    }

    // Convert dollars → cents for the API
    const amountInCents = Math.round(dollars * 100);

    topup(
      { amount: amountInCents, paymentMethodId },
      {
        onSuccess: () => {
          SuccessToast("Wallet topped up successfully!");
          queryClient.invalidateQueries({ queryKey: ["wallet-me"] });
          queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
          onClose();
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            "Top-up failed. Please try again.";
          ErrorToast(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-8 overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end items-center px-8 pt-4">
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        {step === "card" ? (
          <StripeCardForm
            onSubmitCard={handleCardSubmit}
            isValidatingCard={isValidatingCard}
          />
        ) : (
          <form onSubmit={handleAmountSubmit}>
            <div className="flex flex-col gap-5 w-full pt-2 px-16">
              <div className="pt-2 space-y-2 text-center">
                <h2 className="text-[36px] font-semibold capitalize">
                  Top Up Amount
                </h2>
                <p className="text-[#565656] text-[16px]">
                  Specify the amount to add to your wallet.
                </p>
              </div>

              {/* Amount field */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-[500] text-[#737373]">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={amountDollars}
                    onChange={(e) => setAmountDollars(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 text-sm rounded-[12px] bg-transparent ring-1 ring-[#BEBEBE] focus:ring-2 focus:ring-gray-200 focus:outline-none placeholder:text-[#737373] placeholder:font-light"
                    disabled={isPending}
                    required
                  />
                </div>
                {amountDollars && parseFloat(amountDollars) > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    = {Math.round(parseFloat(amountDollars) * 100).toLocaleString()} cents sent to API
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("card")}
                  disabled={isPending}
                  className="w-full py-2.5 bg-[#21293514] text-[13px] text-black rounded-[12px] font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isPending || !amountDollars}
                  className="bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] font-bold px-4 py-3 rounded-[12px] disabled:opacity-60 flex justify-center items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    "Add Funds"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const TopUpModal = ({ onClose }) => {
  return (
    <Elements stripe={stripePromise}>
      <TopUpModalContent onClose={onClose} />
    </Elements>
  );
};

/* ─── Main Wallet Component ────────────────────────── */
const Wallet = () => {
  const [showTopUp, setShowTopUp] = useState(false);

  const { data: walletResponse, isLoading: isLoadingWallet } = useWalletMe();
  const { data: txResponse, isLoading: isLoadingTx } = useWalletTransactions({
    page: 1,
    limit: 10,
  });

  const wallet = walletResponse?.data;
  const transactions = txResponse?.data || [];
  const pagination = txResponse?.pagination;

  return (
    <div className="mx-auto px-6 py-8">

      {/* ── Balance Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Available Balance */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B0E52] to-[#1a1f7a] px-8 py-6 text-white shadow-lg">
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

          <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">
            Available Balance
          </p>
          {isLoadingWallet ? (
            <div className="h-10 w-40 bg-white/10 rounded-lg animate-pulse mt-1" />
          ) : (
            <h2 className="text-[38px] font-bold leading-none">
              ${centsToDollars(wallet?.availableBalance ?? 0)}
              <span className="text-lg font-normal text-white/50 ml-2 uppercase">
                {wallet?.currency || "usd"}
              </span>
            </h2>
          )}
          <p className="text-white/40 text-xs mt-3">
            Withheld: ${centsToDollars(wallet?.withheldBalance ?? 0)}
          </p>

          <button
            onClick={() => setShowTopUp(true)}
            className="mt-5 inline-flex items-center gap-2 bg-white text-[#0B0E52] px-5 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Top Up
          </button>
        </div>

        {/* Stats card */}
        <div className="rounded-2xl border border-gray-200 px-6 py-6 flex flex-col justify-between bg-gray-50">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
            <p className="text-3xl font-bold text-[#181818] mt-1">
              {isLoadingTx ? "—" : (pagination?.totalItems ?? transactions.length)}
            </p>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-gray-500 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {isLoadingTx
                ? "—"
                : transactions.filter((t) => t.status === "COMPLETED").length}
            </p>
          </div>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div>
        <h3 className="text-[16px] font-bold text-[#181818] mb-4">
          Transaction History
        </h3>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-[#181818] text-[13.9px] font-[600]">
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Reference</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingTx ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b">
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="py-4 px-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="border-b text-[13.9px] hover:bg-gray-50 transition">
                    <td className="py-4 px-4 text-gray-600">{formatDate(tx.createdAt)}</td>
                    <td className="py-4 px-4 font-mono text-xs text-gray-500">
                      {tx.referenceId}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">{tx.type}</td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      ${centsToDollars(tx.amount)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(tx.status)}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 md:hidden">
          {isLoadingTx ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-xl p-4 animate-pulse space-y-2">
                {[...Array(4)].map((__, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded w-3/4" />
                ))}
              </div>
            ))
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-white transition"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm font-medium">Date</span>
                  <span className="text-gray-800 font-semibold">{formatDate(tx.createdAt)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm font-medium">Type</span>
                  <span className="text-gray-800">{tx.type}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm font-medium">Amount</span>
                  <span className="text-gray-900 font-bold">${centsToDollars(tx.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm font-medium">Status</span>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top-Up Modal */}
      {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} />}
    </div>
  );
};

export default Wallet;
