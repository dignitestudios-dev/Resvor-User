import { useState } from "react";
import {
  experiencePreferences,
  loungePreferences,
  musicPreferences,
} from "../../static/PreferenceCategories";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import EditPreferencesModal from "./EditPreferencesModal";
import AuthSuccessModal from "../auth/AuthSuccessModal";

const ProfilePreferences = () => {
  const [activeCategories, setActiveCategories] = useState([]);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const toggleCategory = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((cat) => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };
  return (
    <div className="bg-[#F5F5F5] rounded-[16px] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-[24px] text-[#252525] font-[600]">
          Interest and Preferences
        </p>
        <div
          onClick={() => setIsPreferencesOpen(true)}
          className="bg-white p-1 rounded-md cursor-pointer"
        >
          <HiOutlinePencilSquare className=" text-[#292D32] text-[18px]" />
        </div>
      </div>
      <div className="mt-4 max-w-[440px] mx-6">
        <label className="block text-[14px] font-[500] mb-1">
          Music Genres
        </label>

        <div className="py-4 px-4 flex flex-wrap gap-3 w-full text-center justify-start rounded-[15px] bg-white border border-[#BEBEBE]">
          {musicPreferences.map((music, index) => (
            <button
              key={index}
              onClick={() => toggleCategory(music)}
              className={` h-[28px] px-2 text-[12px] rounded-full font-medium transition-all duration-200 ${
                activeCategories.includes(music)
                  ? "bg-blue-950 text-white "
                  : "bg-[#99999926] text-[#575757] hover:bg-[#8a898926]"
              }`}
            >
              {music}
            </button>
          ))}
        </div>
        <label className="block text-[16px] font-[500] mb-1">
          Lounge Types
        </label>

        <div className="py-4 px-4 flex flex-wrap gap-3 w-full text-center justify-start rounded-[15px] bg-white border border-[#BEBEBE]">
          {loungePreferences.map((music, index) => (
            <button
              key={index}
              onClick={() => toggleCategory(music)}
              className={` h-[28px] px-2 text-[12px] rounded-full font-medium transition-all duration-200 ${
                activeCategories.includes(music)
                  ? "bg-blue-950 text-white "
                  : "bg-[#99999926] text-[#575757] hover:bg-[#8a898926]"
              }`}
            >
              {music}
            </button>
          ))}
        </div>
        <label className="block text-[16px] font-[500] mb-1">
          Music Genres
        </label>

        <div className="py-4 px-4 flex flex-wrap gap-3 w-full text-center justify-start rounded-[15px] bg-white border border-[#BEBEBE]">
          {experiencePreferences.map((music, index) => (
            <button
              key={index}
              onClick={() => toggleCategory(music)}
              className={` h-[28px] px-2 text-[12px] rounded-full font-medium transition-all duration-200 ${
                activeCategories.includes(music)
                  ? "bg-blue-950 text-white "
                  : "bg-[#99999926] text-[#575757] hover:bg-[#8a898926]"
              }`}
            >
              {music}
            </button>
          ))}
        </div>
      </div>
      {isPreferencesOpen && (
        <EditPreferencesModal
          onClose={() => setIsPreferencesOpen(false)}
          onClick={() => {
            setIsPreferencesOpen(false);
            setIsUpdated(true);
          }}
        />
      )}
      {isUpdated && (
        <AuthSuccessModal
          isOpen={isUpdated}
          onClick={() => {
            setIsUpdated(false);
          }}
          title="Interest Updated!"
          description="Your interest and preferences has been updated successfully."
        />
      )}
    </div>
  );
};

export default ProfilePreferences;
