import { floorPlan } from "../../assets/export";

const LoungeFloorPlan = () => {
  return (
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
  );
};

export default LoungeFloorPlan;
