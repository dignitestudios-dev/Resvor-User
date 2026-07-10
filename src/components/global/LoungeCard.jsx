  /* eslint-disable react/prop-types */
  import { heart, heartRed } from "../../assets/export";
  import { GoClockFill } from "react-icons/go";
  import { HiPercentBadge } from "react-icons/hi2";
  import { IoLocation } from "react-icons/io5";
  import { BiSolidBadgeDollar } from "react-icons/bi";
  import { useNavigate } from "react-router";
  import { useEffect, useState } from "react";
  import { ErrorToast, SuccessToast } from "./Toaster";
  import { useToggleFavorite } from "../../hooks/queries/useQueries";

  const LoungeCard = ({ position = null, item, isFavorite = false }) => {
    const [liked, setLiked] = useState(isFavorite);
    const { mutate: toggleFavorite, isPending } = useToggleFavorite();
    const navigate = useNavigate();

    useEffect(() => {
      setLiked(Boolean(isFavorite));
    }, [isFavorite]);

    const handleNavigate = () => {
      navigate(`/app/lounge-detail/${item?._id || item?.id}`);
    };

    const handleFavoriteClick = (e) => {
      e.stopPropagation();

      if (!item?._id || isPending) return;

      const nextValue = !liked;
      setLiked(nextValue);

      toggleFavorite(item._id, {
        onSuccess: (response) => {
          SuccessToast(
            response?.message ||
              (nextValue
                ? "Lounge added to favorites."
                : "Lounge removed from favorites.")
          );
        },
        onError: (requestError) => {
          setLiked(!nextValue);
          ErrorToast(
            requestError?.response?.data?.message ||
              "Unable to update favorite lounge."
          );
        },
      });
    };

    return (
      <div
        onClick={handleNavigate}
        className="rounded-[24px] p-4 bg-white relative cursor-pointer h-[420px] flex flex-col justify-between min-w-0"
        style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex-shrink-0">
          <img
            src={item?.images?.[0]?.location || item?.image}
            className="rounded-[12px] w-full h-[200px] object-cover"
            alt="Venue"
          />
        </div>

        <div
          onClick={handleFavoriteClick}
          className={`p-2 cursor-pointer rounded-full bg-white absolute ${
            position ? position : "bottom-48 right-8"
          } ${isPending ? "opacity-70 pointer-events-none" : ""}`}
          style={{ boxShadow: "0px 8px 25px 0px #00000012" }}
        >
          <img
            src={liked ? heartRed : heart}
            alt="heart"
            className="w-6 transition duration-300 ease-in-out"
          />
        </div>

        <div className="mt-6 flex-1 flex flex-col justify-between min-w-0">
          <p className="text-[22px] font-[600] py-2 truncate w-full">{item?.name}</p>

          <ul className="space-y-2 list-none flex-1 flex flex-col justify-end min-w-0">
            <li className="flex items-center gap-2 text-[#6E6E6E] w-full min-w-0">
              <GoClockFill className="text-lg flex-shrink-0" />
              <span className="truncate">
                Time: {item?.operatingHours?.open || "-"} -{" "}
                {item?.operatingHours?.close || "-"}
              </span>
            </li>

            <li className="flex items-center gap-2 text-[#6E6E6E] w-full min-w-0">
              <IoLocation className="text-xl flex-shrink-0" />
              <span className="truncate">Location: {item?.location?.address || "-"}</span>
            </li>

            <li className="flex items-center gap-2 text-[#6E6E6E] w-full min-w-0">
              <BiSolidBadgeDollar className="text-xl flex-shrink-0" />
              <span className="truncate">{item?.description}</span>
            </li>
<li className="flex items-center gap-2 text-[#6E6E6E] w-full min-w-0">
  <HiPercentBadge className="text-xl flex-shrink-0" />
  <span className="truncate">
    {item?.services?.length
      ? item.services.map((service) => service.name).join(", ")
      : "-"}
  </span>
</li>
          </ul>
        </div>
      </div>
    );
  };

  export default LoungeCard;
