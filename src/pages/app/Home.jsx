import { filterIcon } from "../../assets/export";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import LoungeCard from "../../components/global/LoungeCard";
import FilterDropdown from "../../components/global/FilterDropdown";

const Home = () => {
  const [liked, setLiked] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    musicGenres: [],
    loungeTypes: [],
    specialServices: [],
    minPrice: "",
    maxPrice: "",
    guestCapacity: 1,
  });

  const toggleSelection = (category, value) => {
    setSelectedFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearAll = () => {
    setSelectedFilters({
      location: "",
      musicGenres: [],
      loungeTypes: [],
      specialServices: [],
      minPrice: "",
      maxPrice: "",
      guestCapacity: 1,
    });
  };

  return (
    <div className="relative">
      <div className="h-[400px]  w-full homeSectionImage ">
        <div className="flex flex-col items-center justify-center h-[300px] md:text-center text-start">
          <div className="xxl:w-[600px] lg:w-[600px] md:w-[400px] w-[300px]">
            <p className="text-white xxl:text-[48px] lg:text-[48px] text-[32px] font-[600] capitalize">
              Where every occasion finds its lounge.
            </p>
            <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] capitalize ">
              Discover premium lounges
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute top-[260px] lg:top-1/4 md:top-1/6 left-1/2 -translate-x-1/2 
             w-full max-w-md md:max-w-xl bg-white rounded-[16px] 
             md:p-4 p-2 px-4 z-50"
        style={{ boxShadow: "0px 4px 30px rgba(0,0,0,0.25)" }}
      >
        <div className="flex items-end border border-gray-400 text-sm rounded-[12px] overflow-hidden p-[3px]">
          {/* Search text */}
          <div className="flex items-center gap-2 py-3.5 px-4 flex-1 text-[#9F9F9F]">
            <FaSearch className="text-[#9F9F9F] text-[16px]" />
            <span>search for lounges</span>
          </div>

          {/* Button */}
          <button
            type="button"
            className="bg-gradient-to-l from-[#010067] to-[#000000] 
                 text-white text-[12px] md:text-[14px] 
                 py-3.5 px-4 md:px-6 rounded-[12px]"
          >
            Find lounge
          </button>
        </div>
      </div>

      <div className="w-full mt-20 md:px-16 px-8 relative">
        <div className="w-full flex md:flex-row flex-col justify-between md:items-center items-start md:space-y-0 space-y-2 px-10 ">
          <div className="space-y-2">
            <p className=" xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
              Top Lounges Near You{" "}
              <span className="bg-[#010067] rounded-full px-6 py-1.5  text-white text-[13px]">
                1,258
              </span>
            </p>
            <p className="xxl:text-[26px] text-[16px] text-[#181818] ">
              Discover Premium Lounges, Exclusive Packages, and Unforgettable
              Vibes.
            </p>
          </div>
          <div className="relative">
            <img
              src={filterIcon}
              alt="filter"
              className="w-10 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>
          {open && (
            <FilterDropdown
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              toggleSelection={toggleSelection}
              setOpen={setOpen}
              clearAll={clearAll}
            />
          )}
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6 md:px-10 px-4 mt-6">
          {[...Array(6)].map((item, index) => (
            <LoungeCard key={index} setLiked={setLiked} liked={liked} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
