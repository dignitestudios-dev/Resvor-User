/* eslint-disable react/prop-types */
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";

const LoungeAbout = ({ lounge }) => {
  return (
    <div className="space-y-4 text-[#6B6B6B]">
      <h2 className="text-2xl font-bold text-blue-950">Property Description</h2>
      
      {/* Dynamic Description Content from API */}
      <p className="leading-relaxed whitespace-pre-line">
        {lounge?.description || "No description available for this lounge."}
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Contact Details
        </h3>
        
        {/* Dynamic Business Phone */}
        <div className="flex items-center gap-2 text-gray-800">
          <BsFillTelephoneFill className="w-4 h-4 text-blue-900" />
          <span>{lounge?.businessPhone || "-"}</span>
        </div>
        
        {/* Dynamic Business Email */}
        <div className="flex items-center gap-2 text-gray-800 mt-2">
          <IoMail className="w-4 h-4 text-blue-900" />
          <span>{lounge?.businessEmail || "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default LoungeAbout;