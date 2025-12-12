/* eslint-disable react/prop-types */

import { RxCross2 } from "react-icons/rx";
import { floorPlan } from "../../assets/export";

const FloorPlanModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-h-[780px] w-[915px] p-10 relative">
        <button
          type="button"
          className="absolute top-5 right-6"
          onClick={onClose}
        >
          <RxCross2 className="w-5 h-5 text-gray-700" />
        </button>
        <div className="space-y-4 text-[#6B6B6B]">
          <h2 className="text-2xl font-bold text-blue-950">Floor Plan</h2>
          <div className="">
            <img src={floorPlan} alt="floorPlan" />
          </div>
          <div className="space-y-1">
            <h2 className=" font-bold text-[#525252]">Floor Plan Booking</h2>
            <p className=" text-[#525252]">Total Tables : 04 Tables</p>
            <p className=" text-[#525252]">Total Tables : 04 Tables</p>

            <p className=" text-[#525252]">Available Tables : 04 Tables</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanModal;
