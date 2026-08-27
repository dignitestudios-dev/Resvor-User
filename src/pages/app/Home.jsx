// import { filterIcon } from "../../assets/export";
// import { FaSearch } from "react-icons/fa";
// import { useState } from "react";
// import LoungeCard from "../../components/global/LoungeCard";
// import FilterDropdown from "../../components/global/FilterDropdown";
// import { loungeData } from "../../static/MockData";

// const Home = () => {
//   const [open, setOpen] = useState(false);
//   const [services, setServices] = useState([]);

//   const [selectedFilters, setSelectedFilters] = useState({
//     location: "",
//     musicGenres: [],
//     loungeTypes: [],
//     specialServices: [],
//     minPrice: "",
//     maxPrice: "",
//     guestCapacity: 1,
//   });

//   const toggleSelection = (category, value) => {
//     setSelectedFilters((prev) => {
//       const current = prev[category];
//       const updated = current.includes(value)
//         ? current.filter((v) => v !== value)
//         : [...current, value];
//       return { ...prev, [category]: updated };
//     });
//   };

//   const clearAll = () => {
//     setSelectedFilters({
//       location: "",
//       musicGenres: [],
//       loungeTypes: [],
//       specialServices: [],
//       minPrice: "",
//       maxPrice: "",
//       guestCapacity: 1,
//     });
//     setServices([]);
//   };

//   return (
//     <div className="relative">
//       <div className="h-[420px] w-full homeSectionImage ">
//         <div className="flex flex-col items-center justify-center h-[300px] md:text-center text-start">
//           <div className="xxl:w-[600px] lg:w-[600px] md:w-[400px] w-[300px] mt-2">
//             <p className="text-white xxl:text-[48px] lg:text-[50px] text-[32px] font-[600] capitalize">
//               Where every occasion finds its lounge.
//             </p>
//             <p className="xxl:text-[26px] text-[18px] text-[#E6E6E6] md:text-center md:mx-8 mx-0 mt-2">
//               Discover Premium Lounges, Exclusive Packages, and Unforgettable
//               Vibes.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div
//         className="absolute top-[300px] lg:top-1/3 lg:mt-8 mt-0 md:top-1/4 left-1/2 -translate-x-1/2 
//              w-full max-w-md md:max-w-xl bg-white rounded-[16px] 
//              md:p-4 p-2 px-4 z-50"
//         style={{ boxShadow: "0px 4px 30px rgba(0,0,0,0.25)" }}
//       >
//         <div className="flex items-end border border-gray-400 text-sm rounded-[12px] overflow-hidden p-[3px]">
//           {/* Search text */}
//           <div className="flex items-center gap-2 py-3.5 px-4 flex-1 text-[#9F9F9F]">
//             <FaSearch className="text-[#9F9F9F] text-[16px]" />
//             <input
//               type="text"
//               placeholder="Search for lounges"
//               className="flex-1 bg-transparent outline-none border-0 placeholder:text-[#9F9F9F] text-[#9F9F9F]"
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="button"
//             className="bg-gradient-to-l from-[#010067] to-[#000000] 
//                  text-white text-[12px] md:text-[14px] 
//                  py-3.5 px-4 md:px-6 rounded-[12px]"
//           >
//             Find lounge
//           </button>
//         </div>
//       </div>

//       <div className="w-full mt-20 md:px-16 px-8 relative">
//         <div className="w-full flex md:flex-row flex-col justify-between md:items-center items-start md:space-y-0 space-y-2 px-10 ">
//           <div className="space-y-2">
//             <p className=" xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
//               Top Lounges Near You{" "}
//               <span className="bg-[#010067] rounded-full px-6 py-1.5  text-white text-[13px]">
//                 1,258
//               </span>
//             </p>
//             <p className="xxl:text-[26px] text-[16px] text-[#181818] ">
//               Discover Premium Lounges, Exclusive Packages, and Unforgettable
//               Vibes.
//             </p>
//           </div>
//           <div className="relative">
//             <img
//               src={filterIcon}
//               alt="filter"
//               className="w-10 cursor-pointer"
//               onClick={() => setOpen(true)}
//             />
//           </div>
//           {open && (
//             <FilterDropdown
//               selectedFilters={selectedFilters}
//               setSelectedFilters={setSelectedFilters}
//               toggleSelection={toggleSelection}
//               setOpen={setOpen}
//               clearAll={clearAll}
//               services={services}
//               setServices={setServices}
//             />
//           )}
//         </div>
//         <div className="grid md:grid-cols-3 grid-cols-1 gap-6 md:px-10 px-4 mt-6">
//           {loungeData.map((item, index) => (
//             <LoungeCard key={index} item={item} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import { filterIcon } from "../../assets/export";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import LoungeCard from "../../components/global/LoungeCard";
import FilterDropdown from "../../components/global/FilterDropdown";
import { useFavorites, useLounges } from "../../hooks/queries/useQueries";
import WalkthroughWrapper from "../../components/walkthrough/WalkthroughWrapper";
import { useUpdateFcmToken } from "../../hooks/mutations/OnboardingMutations";
import { requestForToken } from "../../firebase/getFcmToken";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const updateFcmMutation = useUpdateFcmToken();

  useEffect(() => {
    const syncFcmToken = async () => {
      try {
        const fcmToken = await requestForToken();
        if (fcmToken) {
          await updateFcmMutation.mutateAsync({ fcmToken });
        }
      } catch (error) {
        console.error("FCM Token registration on Home page failed:", error);
      }
    };

    syncFcmToken();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    setActiveSearch(searchTerm);
  };

  const queryParams = {
    page: currentPage,
    limit: 9,
    ...(activeSearch.trim() ? { name: activeSearch.trim() } : {}),
  };

  const { data: loungesResponse, isLoading } = useLounges(queryParams);
  const { data: favoritesResponse } = useFavorites({
    enabled: !isLoading,
  });

  const lounges = loungesResponse?.data || [];
  const pagination = loungesResponse?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems ?? lounges.length;
  const favoriteLounges = favoritesResponse?.data || [];
  const favoriteIds = new Set(favoriteLounges.map((lounge) => lounge._id));

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

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

      return {
        ...prev,
        [category]: updated,
      };
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
    setServices([]);
    setCurrentPage(1);
  };

  return (
    <div className="relative">
      {/* Walkthrough Modal & Joyride */}
      <WalkthroughWrapper />

      {/* Hero Section */}
      <div className="h-[420px] w-full homeSectionImage">
        <div className="flex flex-col items-center justify-center h-[300px] md:text-center text-start">
          <div className="xxl:w-[600px] lg:w-[600px] md:w-[400px] w-[300px] mt-2">
            <p className="text-white xxl:text-[48px] lg:text-[50px] text-[32px] font-[600] capitalize">
              Where every occasion finds its lounge.
            </p>

            <p className="xxl:text-[26px] text-[18px] text-[#E6E6E6] md:text-center md:mx-8 mx-0 mt-2">
              Discover Premium Lounges, Exclusive Packages, and Unforgettable
              Vibes.
            </p>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div
        className="absolute top-[300px] lg:top-[320px] md:top-[280px] left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-xl bg-white rounded-[16px] md:p-4 p-2 px-4 z-40 joyride-search-box"
        style={{ boxShadow: "0px 4px 30px rgba(0,0,0,0.25)" }}
      >
        <div className="flex items-end border border-gray-400 text-sm rounded-[12px] overflow-hidden p-[3px]">
          <div className="flex items-center gap-2 py-3.5 px-4 flex-1 text-[#9F9F9F]">
            <FaSearch className="text-[#9F9F9F] text-[16px]" />

            <input
              type="text"
              placeholder="Search for lounges"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 bg-transparent outline-none border-0 placeholder:text-[#9F9F9F] text-[#181818]"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="bg-gradient-to-l from-[#010067] to-[#000000] text-white text-[12px] md:text-[14px] py-3.5 px-4 md:px-6 rounded-[12px]"
          >
            Find lounge
          </button>
        </div>
      </div>

      {/* Lounge Listing */}
      <div className="w-full mt-20 md:px-16 px-8 relative">
        <div className="w-full flex md:flex-row flex-col justify-between md:items-center items-start md:space-y-0 space-y-2 px-10">
          <div className="space-y-2">
            <p className="xxl:text-[48px] text-[32px] text-[#181818] font-[600] capitalize">
              Top Lounges Near You{" "}
              <span className="bg-[#010067] rounded-full px-6 py-1.5 text-white text-[13px]">
                {isLoading ? "..." : totalItems}
              </span>
            </p>

            <p className="xxl:text-[26px] text-[16px] text-[#181818]">
              Discover Premium Lounges, Exclusive Packages, and Unforgettable
              Vibes.
            </p>
          </div>

          {/* <div className="relative">
            <img
              src={filterIcon}
              alt="filter"
              className="w-10 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div> */}

          {open && (
            <FilterDropdown
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              toggleSelection={toggleSelection}
              setOpen={setOpen}
              clearAll={clearAll}
              services={services}
              setServices={setServices}
            />
          )}
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-6 md:px-10 px-4 mt-6 joyride-lounge-list">
          {isLoading ? (
            <div className="col-span-full">
              <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[24px] p-4 bg-white animate-pulse"
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="w-full h-[200px] bg-gray-200 rounded-[12px]" />

                    <div className="mt-6 space-y-3">
                      <div className="h-6 w-2/3 bg-gray-200 rounded" />

                      <div className="h-4 w-full bg-gray-200 rounded" />
                      <div className="h-4 w-5/6 bg-gray-200 rounded" />
                      <div className="h-4 w-4/6 bg-gray-200 rounded" />
                      <div className="h-4 w-3/6 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : lounges.length > 0 ? (
            lounges.map((item) => (
              <LoungeCard
                key={item._id}
                item={item}
                isFavorite={favoriteIds.has(item._id)}
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-10">
              <p className="text-lg text-gray-600">
                No lounges available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && lounges.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#D4D4D4] bg-white px-6 py-4 rounded-b-xl mt-4">
            <div className="text-sm text-gray-500">
              Showing page{" "}
              <span className="font-semibold text-gray-800">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
