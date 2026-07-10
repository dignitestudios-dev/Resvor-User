import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdEmail, MdSms, MdRefresh } from "react-icons/md";
import { IoCheckmarkCircle, IoCloseCircle, IoTimeOutline, IoPaperPlane } from "react-icons/io5";
import { useCampaignDetail, useRetryCampaign } from "../../hooks/queries/useQueries";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import ConfirmationModal from "../global/ConfirmationModal";

// ── helpers ───────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatBytes = (bytes) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ── status helpers ────────────────────────────────────────────────────────────

const campaignStatusConfig = (status) => {
  switch ((status || "").toUpperCase()) {
    case "DELIVERED":
    case "SUCCESS":
    case "SENT":
      return {
        bg: "#E6F9F0",
        text: "#1A9E5C",
        icon: <IoCheckmarkCircle className="text-[#1A9E5C]" size={16} />,
        label: "Delivered",
      };
    case "FAILED":
      return {
        bg: "#FEE8E8",
        text: "#D93025",
        icon: <IoCloseCircle className="text-[#D93025]" size={16} />,
        label: "Failed",
      };
    case "PENDING":
      return {
        bg: "#FEF3E2",
        text: "#C87D0E",
        icon: <IoTimeOutline className="text-[#C87D0E]" size={16} />,
        label: "Pending",
      };
    default:
      return {
        bg: "#F0F0F0",
        text: "#555555",
        icon: null,
        label: status || "-",
      };
  }
};

const recipientStatusConfig = (status) => {
  switch ((status || "").toUpperCase()) {
    case "DELIVERED":
      return { dot: "#1A9E5C", bg: "#E6F9F0", text: "#1A9E5C" };
    case "FAILED":
      return { dot: "#D93025", bg: "#FEE8E8", text: "#D93025" };
    case "PENDING":
      return { dot: "#C87D0E", bg: "#FEF3E2", text: "#C87D0E" };
    default:
      return { dot: "#9CA3AF", bg: "#F3F4F6", text: "#6B7280" };
  }
};

// ── detail row ────────────────────────────────────────────────────────────────

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide">{label}</p>
    <p className="text-[14px] font-medium text-[#111827]">{value || "-"}</p>
  </div>
);

// ── component ─────────────────────────────────────────────────────────────────

export default function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showRetryModal, setShowRetryModal] = useState(false);

  const { data: response, isLoading, isError } = useCampaignDetail(id);
  const { mutate: retryCampaign, isPending: isRetrying } = useRetryCampaign();

  const campaign = response?.data;
  const overallStatus = (campaign?.status || "").toUpperCase();
  const recipients = Array.isArray(campaign?.recipients) ? campaign.recipients : [];
  const hasAnyFailedRecipient = recipients.some(
    (r) => (r.status || "").toUpperCase() === "FAILED"
  );
  const isFailed = overallStatus === "FAILED" || hasAnyFailedRecipient;
  const statusCfg = campaignStatusConfig(campaign?.status);

  const handleRetry = () => setShowRetryModal(true);

  const confirmRetry = () => {
    retryCampaign(id, {
      onSuccess: (res) => {
        setShowRetryModal(false);
        SuccessToast(res?.message || "Campaign retry initiated successfully.");
        queryClient.invalidateQueries({ queryKey: ["campaign-detail", id] });
        queryClient.invalidateQueries({ queryKey: ["flyer-history"] });
      },
      onError: (err) => {
        setShowRetryModal(false);
        ErrorToast(err?.response?.data?.message || "Failed to retry the campaign.");
      },
    });
  };

  // ── loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#222246] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  // ── error ─────────────────────────────────────────────────────────────────
  if (isError || !campaign) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5F5] px-4">
        <div className="max-w-md w-full rounded-[16px] bg-white p-6 shadow-sm text-center">
          <p className="text-[20px] font-semibold text-[#181818]">Campaign details not found.</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 w-full rounded-[12px] bg-[#222246] px-4 py-2 text-white text-[14px] font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const deliveredCount = recipients.filter(
    (r) => (r.status || "").toUpperCase() === "DELIVERED"
  ).length;
  const failedCount = recipients.filter(
    (r) => (r.status || "").toUpperCase() === "FAILED"
  ).length;

  const totalSent = campaign.totalRecipients ?? recipients.length ?? 0;
  const totalDelivered = deliveredCount;
  const totalFailed = failedCount;

  const recipientsList = recipients;

  const statusConfig = (status) => {
    switch ((status || "").toUpperCase()) {
      case "DELIVERED":
      case "SUCCESS":
      case "SENT":
        return {
          label: "Delivered",
          cls: "bg-[#E6F9F0] text-[#1A9E5C] border-[#1A9E5C]",
        };
      case "FAILED":
        return {
          label: "Failed",
          cls: "bg-[#FEE8E8] text-[#D93025] border-[#D93025]",
        };
      case "PENDING":
        return {
          label: "Pending",
          cls: "bg-[#FEF3E2] text-[#C87D0E] border-[#C87D0E]",
        };
      default:
        return {
          label: status
            ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
            : "Unknown",
          cls: "bg-[#F0F0F0] text-[#555555] border-[#555555]",
        };
    }
  };

  const st = {
    ...statusConfig(campaign?.status),
    icon: statusCfg.icon,
  };

  const getCampaignImage = (image) => {
    if (!image) return null;
    return image.location || null;
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Header Banner ── */}
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-between w-full px-5 lg:px-40 gap-3 mt-3">
          {/* Back + Title */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
              Campaign Details
            </h2>
          </div>

          {/* Retry button — only for FAILED campaigns */}
          {isFailed && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 px-5 py-2 rounded-[12px] bg-white text-[#222246] text-[13px] font-semibold border border-white hover:bg-[#f0f0ff] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdRefresh size={16} className={isRetrying ? "animate-spin" : ""} />
              {isRetrying ? "Retrying…" : "Retry Campaign"}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Card ── */}
      <div className="px-5 lg:px-40">
        <div
          className="mx-auto bg-white rounded-2xl -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="bg-white rounded-lg border border-white p-4">
            <div className="bg-[#F5F5F5] rounded-lg p-6 border border-[#F5F5F5]">

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Columns - Info & Stats */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 flex flex-col justify-between">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Sent</span>
                      <span className="text-3xl font-bold text-gray-900 mt-2">{totalSent}</span>
                    </div>

                    <div className="bg-white rounded-2xl p-5 flex flex-col justify-between">
                      <span className="text-green-500/80 text-xs font-semibold uppercase tracking-wider">Delivered</span>
                      <span className="text-3xl font-bold text-green-600 mt-2">{totalDelivered}</span>
                    </div>

                    <div className="bg-white rounded-2xl p-5 flex flex-col justify-between">
                      <span className="text-red-500/80 text-xs font-semibold uppercase tracking-wider">Failed</span>
                      <span className="text-3xl font-bold text-red-600 mt-2">{totalFailed}</span>
                    </div>
                  </div>

                  {/* Campaign Details Info Card */}
                  <div className="bg-white rounded-2xl p-6 space-y-5">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-3">General Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Campaign Status</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${st.cls}`}>
                            {st.icon} {st.label}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Channel</p>
                        <p className="text-sm font-semibold text-gray-800 mt-2 capitalize">{campaign.channel || "email"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Created At</p>
                        <p className="text-sm text-gray-700 mt-2 flex items-center gap-1.5">
                          <IoTimeOutline className="w-4 h-4 text-gray-400" />
                          {formatDate(campaign.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">Last Updated At</p>
                        <p className="text-sm text-gray-700 mt-2 flex items-center gap-1.5">
                          <IoTimeOutline className="w-4 h-4 text-gray-400" />
                          {formatDate(campaign.updatedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info Box */}
                    {campaign.additionalInfo && (
                      <div className="bg-gray-50 rounded-xl p-4 mt-4">
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Additional Description</p>
                        <div
                          className="text-sm text-gray-700 leading-relaxed font-light"
                          dangerouslySetInnerHTML={{ __html: campaign.additionalInfo }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Recipients List */}
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
                      Recipients Directory
                    </h3>

                    {recipientsList.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">No specific recipient details available.</p>
                    ) : (
                      <div className="overflow-hidden border rounded-xl divide-y">
                        {recipientsList.map((rec, i) => {
                          const state = statusConfig(rec.status);
                          return (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50 transition gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">{rec.value}</p>
                                {rec.failureReason && (
                                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <IoCloseCircle className="w-3 h-3 shrink-0" />
                                    Reason: {rec.failureReason}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-4 flex-wrap shrink-0">
                                <span className="text-xs text-gray-400">
                                  Attempts: <span className="font-semibold text-gray-700">{rec.attempts || 1}</span>
                                </span>
                                {rec.lastAttemptedAt && (
                                  <span className="text-xs text-gray-400">
                                    Tried: <span className="font-semibold text-gray-700">{new Date(rec.lastAttemptedAt).toLocaleTimeString()}</span>
                                  </span>
                                )}
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${state.cls}`}>
                                  {state.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column - Image / Flyer Preview */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Flyer Preview</h3>

                    {getCampaignImage(campaign.image) ? (
                      <div className="rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center">
                        <img
                          src={getCampaignImage(campaign.image)}
                          alt="Campaign Flyer"
                          className="w-full h-auto object-cover max-h-[500px]"
                        />
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-xl h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <MdEmail className="w-12 h-12 mb-2 text-gray-300" />
                        <span className="text-sm">No flyer image attached</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Retry Confirmation Modal ── */}
      <ConfirmationModal
        isOpen={showRetryModal}
        title="Retry Campaign"
        description="Are you sure you want to retry sending this campaign to the failed recipients?"
        confirmText="Yes, Retry"
        cancelText="Cancel"
        loading={isRetrying}
        onCancel={() => setShowRetryModal(false)}
        onConfirm={confirmRetry}
      />
    </>
  );
}
