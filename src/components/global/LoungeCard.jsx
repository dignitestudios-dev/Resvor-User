/* eslint-disable react/prop-types */
import { heart, heartRed } from "../../assets/export";
import { GoClockFill } from "react-icons/go";
import { HiPercentBadge } from "react-icons/hi2";
import { IoLocation } from "react-icons/io5";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { useNavigate } from "react-router";
import { useState } from "react";

const LoungeCard = ({ position = null, item, key }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      key={key}
      onClick={() => navigate("/app/lounge-detail")}
      className="rounded-[24px] p-4 bg-white relative cursor-pointer"
      style={{ boxShadow: "6px 6px 54px 0px #00000014" }}
    >
      <div>
        <img
          src={item.image}
          className="rounded-[12px] w-full h-[200px] object-cover"
          alt="Venue Logo"
        />
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setLiked((s) => !s);
        }}
        className={`p-2 cursor-pointer rounded-full bg-white absolute ${
          position ? position : "bottom-48 right-8"
        } `}
        style={{ boxShadow: "0px 8px 25px 0px #00000012" }}
      >
        <img
          src={liked ? heartRed : heart}
          alt="heart"
          className="w-6 transition duration-300 ease-in-out"
        />
      </div>
      <div className="mt-6 ">
        <p className="text-[22px] font-[600] py-2">{item?.name}</p>
        <ul className="space-y-2 list-none">
          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <GoClockFill className="text-lg" />
            <span>Time: {item?.location}</span>
          </li>
          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <IoLocation className="text-xl" />
            <span>Location: {item?.location}</span>
          </li>

          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <BiSolidBadgeDollar className="text-xl" />
            <span>{item?.description}</span>
          </li>
          <li className="flex items-center gap-2 text-[#6E6E6E]">
            <HiPercentBadge className="text-xl" />
            <span>{item?.extras}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoungeCard;
