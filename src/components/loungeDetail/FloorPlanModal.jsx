import { RxCross2 } from "react-icons/rx";
import { floorPlan as floorPlanStatic } from "../../assets/export";

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
        <button
          type="button"
          className="absolute top-5 right-6 text-gray-500 hover:text-gray-800 transition cursor-pointer z-10"
          onClick={onClose}
        >
          <RxCross2 className="w-6 h-6 text-gray-700" />
        </button>
        <div className="space-y-4 text-[#6B6B6B]">
          <h2 className="text-2xl font-bold text-blue-950 pr-8">Floor Plan</h2>
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

            {availableTables.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-3">
                <p className="font-bold text-[#525252] mb-2">Seating Capacities:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-sm">
                  {availableTables.map((table) => (
                    <div key={table._id} className="bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-lg flex flex-col justify-between">
                      <span className="font-medium text-gray-800">{table.code || `Table ${table.tableNumber}`}</span>
                      <span className="text-gray-500 text-xs mt-0.5">Capacity: {table.capacity || "N/A"} seats</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanModal;
