import { FaArrowLeftLong } from "react-icons/fa6";

import ProfileDetail from "../../components/userProfile/ProfileDetail";
import ProfilePreferences from "../../components/userProfile/ProfilePreferences";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";
import LoungeCard from "../../components/global/LoungeCard";
import { useState } from "react";
import { loungeData } from "../../static/MockData";

const UserProfile = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <>
      <div className="flex items-center pt-[16px] pb-[18em] homeSectionImage">
        <div className="flex items-center px-5 lg:px-40 gap-3">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeftLong color="white" size={20} />
          </button>
          <h2 className="text-white text-[30px] mt-0 font-bold leading-[48px] capitalize">
            Profile
          </h2>
        </div>
      </div>
      <div className="px-5 lg:px-40">
        <div
          className=" mx-auto px-6 py-10 bg-white rounded-xl -mt-[16em]"
          style={{ boxShadow: "0px 4px 30px 0px #00000026" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <ProfileDetail />
            <ProfilePreferences />
          </div>
          <div className="bg-[#F5F5F5] rounded-[16px] p-6 space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-[24px] text-[#252525] font-[600]">
                Favorite Lounges
              </p>
              <div className="flex items-center gap-4 ">
                <div className="p-2 rounded-full border-[1px] border-[#D1D1D1]">
                  <IoIosArrowBack className="text-[16px]" />
                </div>
                <div className="p-2 rounded-full border-[1px] border-[#D1D1D1]">
                  <IoIosArrowForward className="text-[16px]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {loungeData.map((item, index) => (
                <LoungeCard
                  item={item}
                  key={index}
                  setLiked={setLiked}
                  liked={liked}
                  position="bottom-64 right-8"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
