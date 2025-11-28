/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import {
  experiencePreferences,
  loungePreferences,
  musicPreferences,
} from "../../static/PreferenceCategories";
import Button from "../global/Button";

const EditPreferencesModal = ({ onClose, onClick }) => {
  const [activeCategories, setActiveCategories] = useState([]);

  const toggleCategory = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((cat) => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  return (
    <div className="fixed -inset-6 bg-[#0A150F80] z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] w-[490px] max-w-[95%] pb-4 h-[700px] overflow-y-auto">
        <div className="flex justify-between items-center px-8 pt-4 ">
          <h2 className="text-[28px] font-bold mb-4">
            Edit Interests & Preferences
          </h2>
          <div onClick={onClose} className="cursor-pointer">
            <RxCross2 className="text-[28px] text-[#181818]" />
          </div>
        </div>

        <div className="mt-4 max-w-[440px] mx-6">
          <p className="block text-[16px] font-[600] ">Music Genres</p>
          <label className="block text-[14px] font-[500] mb-1">
            Choose the music styles you enjoy
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

          <p className="block text-[16px] font-[600]  mt-2">Lounge Types</p>
          <label className="block text-[14px] font-[500] mb-1">
            What kind of lounges do you prefer?
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
          <p className="block text-[16px] font-[600]  mt-2">
            Preferred Experiences
          </p>
          <label className="block text-[14px] font-[500] mb-1">
            What Experiences are you interested in?
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
        <div className="mt-4 flex justify-center">
          <div className="w-[40%]">
            <Button text="Save" type="button" onClick={onClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPreferencesModal;
