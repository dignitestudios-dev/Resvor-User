/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  experiencePreferences,
  loungePreferences,
  musicPreferences,
} from "../../static/PreferenceCategories";
import AuthButton from "../auth/AuthButton";
import { FaArrowLeftLong } from "react-icons/fa6";

const Preferences = ({ handleNext, handlePrevious }) => {
  const [activeCategories, setActiveCategories] = useState([]);

  const toggleCategory = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((cat) => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handle submit call");
    handleNext();
  };

  return (
    <div className="flex flex-col justify-center items-center h-auto ">
      <div className="flex justify-start items-center absolute top-12 left-0">
        <button type="button" onClick={() => handlePrevious()}>
          <FaArrowLeftLong color="white" size={24} />
        </button>
      </div>
      <div className="mt-4 xxl:w-[400px] xxl:ml-12 text-center space-y-4 max-w-[440px] px-4">
        <p className="xxl:text-[48px] text-[32px] text-[#E6E6E6] font-[600] capitalize">
          Tell Us What You’re Into
        </p>
        <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] ">
          We’ll personalize your lounge suggestions, event invites, and offers
          based on your vibe.
        </p>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="mt-4 max-w-[440px]">
          <label className="block text-[16px] font-[500] text-white mb-1">
            Lounge Types
          </label>
          <label className="block text-[14px] font-[500] text-white mb-2">
            What kind of lounges do you prefer?
          </label>
          <div className="py-4 px-4 flex flex-wrap gap-3 w-full text-center justify-start rounded-[13px] bg-[#EFEFEF1A] border border-[#CACACA]">
            {musicPreferences.map((music, index) => (
              <button
                key={index}
                onClick={() => toggleCategory(music)}
                className={` h-[28px] px-2 text-[12px] rounded-full font-medium transition-all duration-200 ${
                  activeCategories.includes(music)
                    ? "bg-white text-[#181818] "
                    : "bg-[#99999926] text-[white] hover:bg-[#8a898926]"
                }`}
              >
                {music}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 max-w-[440px]">
          <label className="block text-[16px] font-[500] text-white mb-1">
            Lounge Types
          </label>
          <label className="block text-[14px] font-[500] text-white mb-2">
            What kind of lounges do you prefer?
          </label>
          <div className="py-4 px-4 flex flex-wrap gap-3 w-full text-center justify-start rounded-[13px] bg-[#EFEFEF1A] border border-[#CACACA] ">
            {loungePreferences.map((music, index) => (
              <button
                key={index}
                onClick={() => toggleCategory(music)}
                className={` h-[28px] px-2 text-[12px] rounded-full font-medium transition-all duration-200 ${
                  activeCategories.includes(music)
                    ? "bg-white text-[#181818] "
                    : "bg-[#99999926] text-[white] hover:bg-[#8a898926]"
                }`}
              >
                {music}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 max-w-[440px]">
          <label className="block text-[16px] font-[500] text-white mb-1">
            Preferred Experiences
          </label>
          <label className="block text-[14px] font-[500] text-white mb-2">
            What Experiences are you interested in?
          </label>
          <div className="py-4 px-4 text-[12px] flex flex-wrap gap-3 w-full text-center justify-start rounded-[13px] bg-[#EFEFEF1A] border border-[#CACACA] ">
            {experiencePreferences.map((music, index) => (
              <button
                key={index}
                onClick={() => toggleCategory(music)}
                className={` h-[28px] px-2 rounded-full font-medium transition-all duration-200 ${
                  activeCategories.includes(music)
                    ? "bg-white text-[#181818] "
                    : "bg-[#99999926] text-[white] hover:bg-[#8a898926]"
                }`}
              >
                {music}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 w-full flex justify-center">
          <div className="xxl:w-[650px] w-[380px] mt-1 mb-4">
            <AuthButton type="submit" text={"Add"} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Preferences;
