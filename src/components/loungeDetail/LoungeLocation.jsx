import { mapImg } from "../../assets/export";

const LoungeLocation = () => {
  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">Location</h2>
      <div className="w-full bg-slate-500">
        <img src={mapImg} alt="floorPlan" className="w-full" />
      </div>
    </div>
  );
};

export default LoungeLocation;
