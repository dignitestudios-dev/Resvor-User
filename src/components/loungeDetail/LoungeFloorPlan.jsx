import { floorPlan } from "../../assets/export";

const LoungeFloorPlan = ({ lounge }) => {
  const floorPlanData = lounge?.floorPlan;

  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">
        Floor Plan
      </h2>

      {/* Floor Plan Image */}
      <div>
        {floorPlanData?.image?.location ? (
          <img
            src={floorPlanData.image.location}
            alt="floor-plan"
            className="w-full max-h-[400px] object-contain rounded-lg"
          />
        ) : (
          <p>No floor plan uploaded.</p>
        )}
      </div>

      {/* Floor Plan Details */}
      <div className="space-y-1">
        <h2 className="font-bold text-[#525252]">
          Floor Plan Booking
        </h2>

        <p className="text-[#525252]">
          Regular Tables: {floorPlanData?.regularTables ?? 0}
        </p>

        <p className="text-[#525252]">
          VIP Tables: {floorPlanData?.vipTables ?? 0}
        </p>

        <p className="text-[#525252]">
          Total Tables:{" "}
          {(floorPlanData?.regularTables ?? 0) +
            (floorPlanData?.vipTables ?? 0)}
        </p>
      </div>
    </div>
  );
};

export default LoungeFloorPlan;
