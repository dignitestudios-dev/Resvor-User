import { RxCross2 } from "react-icons/rx";
import { floorPlan as floorPlanStatic } from "../../assets/export";

const FloorPlanModal = ({ onClose, floorPlan, availableTables = [] }) => {
  const regularTables = floorPlan?.regularTables || 0;
  const vipTables = floorPlan?.vipTables || 0;
  const totalTables = regularTables + vipTables || availableTables.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-h-[780px] w-[915px] p-10 relative overflow-y-auto">
        <button
          type="button"
          className="absolute top-5 right-6"
          onClick={onClose}
        >
          <RxCross2 className="w-5 h-5 text-gray-700" />
        </button>
        <div className="space-y-4 text-[#6B6B6B]">
          <h2 className="text-2xl font-bold text-blue-950">Floor Plan</h2>
          <div className="flex justify-center">
            <img 
              src={floorPlan?.image?.location || floorPlanStatic} 
              alt="floorPlan" 
              className="max-h-[350px] object-contain rounded-lg border border-gray-100"
            />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-[#525252]">Floor Plan Seating Details</h2>
            <p className="text-[#525252]">Total Tables: {totalTables} Tables</p>
            <p className="text-[#525252]">Available Tables: {availableTables.length} Tables</p>
            
            {availableTables.length > 0 && (
              <div className="mt-3 border-t border-gray-200 pt-3">
                <p className="font-bold text-[#525252] mb-1">Seating Capacities:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm max-h-[120px] overflow-y-auto">
                  {availableTables.map((table) => (
                    <div key={table._id} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex flex-col justify-between">
                      <span className="font-medium text-gray-800">{table.code || `Table ${table.tableNumber}`}</span>
                      <span className="text-gray-500 text-xs">Capacity: {table.capacity || "N/A"} seats</span>
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
