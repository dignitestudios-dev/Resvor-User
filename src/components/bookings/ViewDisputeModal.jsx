/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import { useDisputeDetails } from "../../hooks/queries/useQueries";

const formatDate = (isoStr) => {
  if (!isoStr) return "-";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return String(isoStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const formatTime = (isoStr) => {
  if (!isoStr) return "-";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return String(isoStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "OPEN") return "bg-amber-100 text-amber-800 border-amber-300";
  if (s === "RESOLVED") return "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (s === "REJECTED" || s === "CLOSED") return "bg-rose-100 text-rose-800 border-rose-300";
  return "bg-gray-100 text-gray-700 border-gray-300";
};

const ViewDisputeModal = ({ isOpen, onClose, disputeId }) => {
  const { data: disputeResponse, isLoading, isError, error } = useDisputeDetails(
    disputeId,
    { enabled: isOpen && !!disputeId }
  );

  if (!isOpen) return null;

  const dispute = disputeResponse?.data ?? disputeResponse;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A150F80] p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[540px] rounded-[16px] bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-bold text-[#181818]">Dispute Details</h2>
            {dispute?.status && (
              <span
                className={`px-3 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadge(
                  dispute.status
                )}`}
              >
                {dispute.status}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-800"
          >
            <RxCross2 className="text-[24px]" />
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-12 text-center text-gray-500 font-medium text-sm">
            Loading dispute details...
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="py-8 text-center text-rose-600 font-medium text-sm">
            {error?.response?.data?.message || "Failed to load dispute details."}
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !isError && dispute && (
          <div className="space-y-4 text-sm text-[#181818]">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-[12px]">
              <div>
                <p className="text-[12px] text-gray-500 font-medium">Dispute ID</p>
                <p className="font-semibold text-xs text-gray-800 break-all">{dispute._id}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 font-medium">Source Type</p>
                <p className="font-semibold text-gray-800">{dispute.sourceModel || "Booking"}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-500 font-medium">Date Created</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(dispute.createdAt)} at {formatTime(dispute.createdAt)}
                </p>
              </div>
              {dispute.resolvedAt && (
                <div>
                  <p className="text-[12px] text-gray-500 font-medium">Date Resolved</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(dispute.resolvedAt)} at {formatTime(dispute.resolvedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* User Reason */}
            <div>
              <p className="text-[13px] font-semibold text-[#181818] mb-1">Reason for Dispute</p>
              <div className="bg-amber-50/60 border border-amber-200 rounded-[12px] p-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {dispute.reason || "No reason provided."}
              </div>
            </div>

            {/* Admin Note if available */}
            {dispute.adminNote && (
              <div>
                <p className="text-[13px] font-semibold text-[#181818] mb-1">Admin Response / Note</p>
                <div className="bg-blue-50/60 border border-blue-200 rounded-[12px] p-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {dispute.adminNote}
                </div>
              </div>
            )}

            {/* Manager Appeal if available */}
            {dispute.managerAppeal?.text && (
              <div>
                <p className="text-[13px] font-semibold text-[#181818] mb-1">Manager Appeal</p>
                <div className="bg-purple-50/60 border border-purple-200 rounded-[12px] p-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {dispute.managerAppeal.text}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-[#212935] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDisputeModal;
