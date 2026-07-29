import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { flyerData } from "../../static/MockData";
import { useFlyerHistory } from "../../hooks/queries/useQueries";
import { IoIosArrowForward } from "react-icons/io";

// ── helpers ───────────────────────────────────────────────────────────────────

const formatDateLabel = (isoValue) => {
  // if (!isoValue) return "-";
  // const d = new Date(isoValue);
  // if (Number.isNaN(d.getTime())) return "-";
  // return d.toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  // });
  if (!isoValue) return "—";
  return new Date(isoValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTimeLabel = (isoValue) => {
  if (!isoValue) return "";
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "");
};

// ── History Table ─────────────────────────────────────────────────────────────

const FlyerHistoryTable = ({
  rows,
  isLoading,
  page,
  totalPages,
  onPrev,
  onNext,
  onRowClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
        Loading history...
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 font-medium">
        No History Found
      </div>
    );
  }

  const statusConfig = (status) => {
    switch ((status || "").toUpperCase()) {
      case "DELIVERED":
      case "SUCCESS":
      case "SENT":
        return {
          label: "Sent",
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
            : "-",
          cls: "bg-[#F0F0F0] text-[#555555] border-[#555555]",
        };
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 ">
            <tr className="bg-[#E8E8FF] ">
              <th className="px-4 py-5 text-left text-nowrap">Flyer</th>
              <th className="px-4 py-5 text-left text-nowrap">Campaign Type</th>
              <th className="px-4 py-5 text-left text-nowrap">Sent At</th>
              <th className="px-4 py-5 text-left text-nowrap">Recipients</th>
              <th className="px-4 py-5 text-left text-nowrap">Status</th>
              <th className="px-4 py-5 text-center text-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const st = statusConfig(row.status);
              const recipientsCount = row.totalRecipients || 0;

              return (
                <tr
                  key={row._id || idx}
                  onClick={() => onRowClick(row._id)}
                  className="border-b border-[#D4D4D4] cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-6">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {row.imageUrl ? (
                        <img src={row.imageUrl} alt="flyer" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 text-gray-300 flex items-center justify-center text-[10px]">N/A</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-6 font-semibold text-gray-800 capitalize">
                    {row.channel || "Email"} Campaign
                  </td>
                  <td className="px-4 py-6 text-gray-500 text-sm">
                    {row.sentDate}
                  </td>
                  <td className="px-4 py-6 text-gray-700 font-medium">
                    {recipientsCount} recipient{recipientsCount !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-6 text-nowrap">
                    <div className="flex justify-center items-center cursor-pointer">
                      <IoIosArrowForward size={24} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {rows.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#D4D4D4] bg-white px-6 py-4 rounded-b-xl">
          <div className="text-sm text-gray-500">
            Showing page{" "}
            <span className="font-semibold text-gray-800">{page}</span> of{" "}
            <span className="font-semibold text-gray-800">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const Flyers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flyers");

  // Pagination for history
  const [historyPage, setHistoryPage] = useState(1);
  const limit = 10;

  const { data: historyResponse, isLoading: isHistoryLoading } =
    useFlyerHistory(
      { page: historyPage, limit },
      { enabled: activeTab === "history" },
    );

  const historyData = historyResponse?.data || [];
  const historyPagination = historyResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  // Map raw API data to table rows
  const historyRows = historyData.map((item) => ({
    _id: item._id,
    channel: item.channel,
    imageUrl: item.image?.location || null,
    additionalInfo: item.additionalInfo,
    sentDate: formatDateLabel(item.sentAt),
    sentTime: formatTimeLabel(item.sentAt),
    totalRecipients: item.totalRecipients,
    status: item.status,
  }));

  const handlePrevHistory = () => {
    if (historyPagination.currentPage > 1) setHistoryPage((p) => p - 1);
  };

  const handleNextHistory = () => {
    if (historyPagination.currentPage < historyPagination.totalPages)
      setHistoryPage((p) => p + 1);
  };

  return (
    <>
      {/* ── Header Banner ── */}
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center justify-between w-full px-5 lg:px-40 gap-3 mt-3">
          {/* Title */}
          <div className="flex gap-1">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeftLong color="white" size={20} />
            </button>
            <h2 className="text-white text-[32px] mt-0 font-semibold leading-[48px] capitalize">
              Campaign and Flyers
            </h2>
          </div>

          {/* Tab Toggle */}
          <div className="w-[280px] flex">
            <button
              className={`text-[12px] py-3 px-6 rounded-l-2xl w-full ${activeTab === "flyers"
                ? "bg-[#FFFFFF] text-[#222246]"
                : "bg-[#222246] text-white"
                }`}
              onClick={() => setActiveTab("flyers")}
            >
              Flyers
            </button>
            <button
              className={`text-[12px] py-3 px-6 rounded-r-2xl w-full ${activeTab === "history"
                ? "bg-[#FFFFFF] text-[#222246]"
                : "bg-[#222246] text-white"
                }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Card ── */}
      <div className="px-5 lg:px-40">
        <div
          className="mx-auto bg-white rounded-2xl -mt-[16em]  min-h-[200px]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          {activeTab === "flyers" ? (
            /* ── Flyers Grid (original) ── */
            <div className="grid grid-cols-5 p-4 gap-4">
              {flyerData.map((item) => (
                <div
                  onClick={() => navigate(`/app/create-flyer/${item.id}`)}
                  key={item.id}
                  className="space-y-2 cursor-pointer"
                >
                  <div className="border border-[#F4F4F4] rounded-[10px]">
                    <img src={item.image} alt="flyer" className="h-[273px]" />
                  </div>
                  <p className="text-[#202224] text-center text-[16px] font-[600]">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* ── History Table ── */
            <FlyerHistoryTable
              rows={historyRows}
              isLoading={isHistoryLoading}
              page={historyPagination.currentPage}
              totalPages={historyPagination.totalPages}
              onPrev={handlePrevHistory}
              onNext={handleNextHistory}
              onRowClick={(id) => navigate(`/app/campaign-detail/${id}`)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Flyers;
