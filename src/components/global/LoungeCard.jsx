/* eslint-disable react/prop-types */

import { heart, heartRed, loungeImg } from "../../assets/export";
import { GoClockFill } from "react-icons/go";
import { HiPercentBadge } from "react-icons/hi2";
import { IoLocation } from "react-icons/io5";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { useNavigate } from "react-router";

const LoungeCard = ({ setLiked, liked }) => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-[24px] p-4 bg-white relative"
      style={{ boxShadow: "6px 6px 54px 0px #00000014" }}
    >
      <div>
        <img
          src={loungeImg}
          className="rounded-[12px] w-full"
          alt="Venue Logo"
        />
      </div>
      <div
        onClick={() => setLiked(!liked)}
        className="p-2 cursor-pointer rounded-full bg-white absolute bottom-48 right-8"
        style={{ boxShadow: "0px 8px 25px 0px #00000012" }}
      >
        <img
          src={liked ? heartRed : heart}
          alt="heart"
          className="w-6 transition duration-300 ease-in-out"
        />
      </div>
      <div
        className="mt-6 cursor-pointer"
        onClick={() => navigate("/app/lounge-detail")}
      >
        <p className="text-[22px] font-[600] py-2">
          Highbar Rooftop - New York, NY
        </p>
        <ul className="space-y-2 list-none">
          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <GoClockFill className="text-lg" />
            <span>Time: 12:00 PM</span>
          </li>
          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <IoLocation className="text-xl" />
            <span>Location: New York</span>
          </li>

          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <BiSolidBadgeDollar className="text-xl" />
            <span>Rooftop Vibes, House Music, Sunset.....</span>
          </li>
          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <HiPercentBadge className="text-xl" />
            <span>VIP Cabanas, Bottle Service, Private.....</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoungeCard;
