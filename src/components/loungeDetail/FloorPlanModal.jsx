// import { RxCross2 } from "react-icons/rx";
import { floorPlan as floorPlanStatic } from "../../assets/export";
import { ArrowLeft } from "lucide-react";

const FloorPlanModal = ({ onClose, floorPlan, availableTables = [] }) => {
  const regularTables = floorPlan?.regularTables || 0;
  const vipTables = floorPlan?.vipTables || 0;
  const totalTables = regularTables + vipTables || availableTables.length;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-[915px] max-h-[85vh] p-6 sm:p-8 relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >

        <div className="space-y-4 text-[#6B6B6B]">
          <div className="flex gap-4 items-center">
            <button
              type="button"
              className=" text-gray-500 hover:text-gray-800 transition cursor-pointer z-10"
              onClick={onClose}
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />

            </button>
            <h2 className="text-2xl font-bold text-blue-950 pr-8">Floor Plan</h2>

          </div>
          <div className="flex justify-center bg-gray-50 p-3 rounded-xl border border-gray-100">
            <img
              src={floorPlan?.image?.location || floorPlanStatic}
              alt="floorPlan"
              className="max-h-[380px] w-auto max-w-full object-contain rounded-lg border border-gray-100 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-[#525252] text-lg">Floor Plan Seating Details</h3>
            <div className="flex flex-wrap gap-4 text-sm text-[#525252] bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p><span className="font-semibold text-gray-800">Total Tables:</span> {totalTables} Tables</p>
              <p><span className="font-semibold text-gray-800">Available Tables:</span> {availableTables.length} Tables</p>
            </div>

            {availableTables.length > 0 && (() => {
              const vipCount = availableTables.filter((t) => t.type === "vip").length;
              const regularCount = availableTables.filter((t) => t.type === "regular").length;
              return (
                <div className="mt-4 border-t border-gray-200 pt-3">
                  <p className="font-bold text-[#525252] mb-2">Table Breakdown:</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {vipCount > 0 && (
                      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-lg">
                        <span className="font-semibold text-indigo-800">VIP Tables:</span>
                        <span className="text-indigo-700 font-bold">{vipCount}</span>
                      </div>
                    )}
                    {regularCount > 0 && (
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg">
                        <span className="font-semibold text-gray-800">Regular Tables:</span>
                        <span className="text-gray-700 font-bold">{regularCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanModal;
