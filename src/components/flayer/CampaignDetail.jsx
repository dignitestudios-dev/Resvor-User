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
          className="mx-auto bg-white rounded-[16px] -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="p-5 bg-[#F5F5F5] rounded-[16px] space-y-5">

            {/* ── Section: Campaign Overview ───────────────────────────────── */}
            <h2 className="text-[22px] font-semibold text-gray-800">Campaign Overview</h2>

            <div className="bg-white rounded-[20px] p-6 space-y-6">
              {/* Image + core details */}
              <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-[#0000001A]">
                {/* Flyer Image */}
                <div className="flex-shrink-0">
                  {campaign.image?.location ? (
                    <img
                      src={campaign.image.location}
                      alt="Campaign flyer"
                      className="w-full md:w-[220px] h-[200px] object-cover rounded-[14px] border border-[#E5E7EB]"
                    />
                  ) : (
                    <div className="w-full md:w-[220px] h-[200px] bg-[#F3F4F6] rounded-[14px] flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Core info */}
                <div className="flex-1 space-y-4">
                  {/* Channel + Status badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Channel */}
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8E8FF] text-[#222246] text-[12px] font-semibold capitalize">
                      {(campaign.channel || "").toLowerCase() === "email" ? (
                        <MdEmail size={14} />
                      ) : (
                        <MdSms size={14} />
                      )}
                      {campaign.channel || "-"}
                    </span>

                    {/* Overall status */}
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
                    >
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <DetailRow label="Total Recipients" value={String(campaign.totalRecipients ?? recipients.length ?? 0)} />
                    <DetailRow label="Delivered" value={`${deliveredCount} / ${recipients.length}`} />
                    <DetailRow label="Failed" value={String(failedCount)} />
                    <DetailRow label="Sent At" value={`${formatDate(campaign.sentAt || campaign.createdAt)} ${formatTime(campaign.sentAt || campaign.createdAt)}`} />
                    {campaign.image?.filename && (
                      <DetailRow label="Filename" value={campaign.image.filename} />
                    )}
                    {campaign.image?.size && (
                      <DetailRow label="File Size" value={formatBytes(campaign.image.size)} />
                    )}
                  </div>

                  {/* Additional Info */}
                  {campaign.additionalInfo && (
                    <div className="bg-[#F9FAFB] rounded-[12px] p-4">
                      <p className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">
                        Additional Info
                      </p>
                      <p className="text-[14px] text-[#374151]">{campaign.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery summary cards */}
              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-[#0000001A]">
                <div className="bg-[#F0FDF4] rounded-[14px] p-4 text-center">
                  <IoCheckmarkCircle className="mx-auto text-[#1A9E5C] mb-1" size={24} />
                  <p className="text-[24px] font-bold text-[#1A9E5C]">{deliveredCount}</p>
                  <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">Delivered</p>
                </div>
                <div className="bg-[#FFF7ED] rounded-[14px] p-4 text-center">
                  <IoPaperPlane className="mx-auto text-[#C87D0E] mb-1" size={22} />
                  <p className="text-[24px] font-bold text-[#C87D0E]">{recipients.length}</p>
                  <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">Total Sent</p>
                </div>
                <div className="bg-[#FFF1F2] rounded-[14px] p-4 text-center">
                  <IoCloseCircle className="mx-auto text-[#D93025] mb-1" size={24} />
                  <p className="text-[24px] font-bold text-[#D93025]">{failedCount}</p>
                  <p className="text-[12px] font-medium text-[#6B7280] mt-0.5">Failed</p>
                </div>
              </div>

              {/* Retry CTA — inside card for failed campaigns */}
              {isFailed && (
                <div className="flex items-center justify-between bg-[#FEE8E8] rounded-[14px] p-4">
                  <div>
                    <p className="text-[14px] font-semibold text-[#D93025]">Campaign Failed</p>
                    <p className="text-[12px] text-[#9B1C1C] mt-0.5">
                      Some or all recipients did not receive this campaign. You can retry to resend.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#D93025] text-white text-[13px] font-semibold hover:bg-[#b91c1c] transition disabled:opacity-50 disabled:cursor-not-allowed ml-4 whitespace-nowrap"
                  >
                    <MdRefresh size={15} className={isRetrying ? "animate-spin" : ""} />
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* ── Section: Recipients ──────────────────────────────────────── */}
            {recipients.length > 0 && (
              <div>
                <h2 className="text-[22px] font-semibold text-gray-800 mb-3">Recipients</h2>
                <div className="bg-white rounded-[20px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F9F9F9] border-b border-[#E5E7EB]">
                        <th className="px-6 py-4 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">
                          Recipient
                        </th>
                        <th className="px-6 py-4 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">
                          Attempts
                        </th>
                        <th className="px-6 py-4 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">
                          Last Attempted
                        </th>
                        <th className="px-6 py-4 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide">
                          Failure Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.map((r, idx) => {
                        const cfg = recipientStatusConfig(r.status);
                        return (
                          <tr
                            key={idx}
                            className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors"
                          >
                            {/* Recipient value */}
                            <td className="px-6 py-4 text-[13px] font-medium text-[#111827]">
                              {r.value || "-"}
                            </td>

                            {/* Status pill */}
                            <td className="px-6 py-4">
                              <span
                                className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[12px] font-semibold capitalize"
                                style={{ backgroundColor: cfg.bg, color: cfg.text }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: cfg.dot }}
                                />
                                {(r.status || "-").charAt(0).toUpperCase() +
                                  (r.status || "").slice(1).toLowerCase()}
                              </span>
                            </td>

                            {/* Attempts */}
                            <td className="px-6 py-4 text-[13px] text-[#374151]">
                              {r.attempts ?? "-"}
                            </td>

                            {/* Last attempted */}
                            <td className="px-6 py-4 text-[13px] text-[#374151] whitespace-nowrap">
                              {r.lastAttemptedAt ? (
                                <div>
                                  <div>{formatDate(r.lastAttemptedAt)}</div>
                                  <div className="text-[11px] text-[#9CA3AF]">
                                    {formatTime(r.lastAttemptedAt)}
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>

                            {/* Failure reason */}
                            <td className="px-6 py-4 text-[13px] text-[#6B7280]">
                              {r.failureReason || (
                                <span className="text-[#9CA3AF] italic">None</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
