/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import FilterSelectableField from "./FilterSelectableField";

const FilterDropdown = ({
  setOpen,
  setSelectedFilters,
  selectedFilters,
  toggleSelection,
  clearAll,
  services,
  setServices,
}) => {
  const handleSelect = (option) => {
    // normalize option which can be either a string or an object
    const name = option?.name || option?.title || option;
    const id = option?._id || null;

    setServices((prev) => {
      const exists = prev.some((item) => item.name === name);

      if (exists) {
        return prev.filter((item) => item.name !== name);
      } else {
        return [...prev, { name, id }];
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full p-6 rounded-l-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button onClick={() => setOpen(false)}>
            <IoClose size={28} />
          </button>
        </div>

        {/* Location */}
        <div className="my-2">
          <FilterSelectableField
            label="Location"
            placeholder={"Location"}
            options={["New York", "California", "Alaska"]}
            value={services}
            onChange={handleSelect}
          />
        </div>

        {/* Music Genres */}
        <div className="mb-4">
          <label className="block text-[#181818] text-[14px] font-[500] mb-2">
            Music Genres
          </label>
          <div className="flex flex-wrap gap-2 border border-[#CACACA] rounded-[15px] p-4">
            {[
              "House",
              "Jazz",
              "R&B",
              "Hip Hop",
              "EDM",
              "Afrobeats",
              "Live Music",
            ].map((genre) => (
              <button
                key={genre}
                onClick={() => toggleSelection("musicGenres", genre)}
                className={`px-4 py-1 rounded-full border ${
                  selectedFilters.musicGenres.includes(genre)
                    ? "bg-indigo-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Lounge Types */}
        <div className="mb-4">
          <label className="block text-[#181818] text-[14px] font-[500] mb-2">
            Lounge Types
          </label>
          <div className="flex flex-wrap gap-2 border border-[#CACACA] rounded-[15px] p-4">
            {[
              "Rooftop",
              "Luxury",
              "High Energy",
              "Themed",
              "Indoor",
              "Outdoor",
            ].map((type) => (
              <button
                key={type}
                onClick={() => toggleSelection("loungeTypes", type)}
                className={`px-4 py-1 rounded-full border ${
                  selectedFilters.loungeTypes.includes(type)
                    ? "bg-indigo-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Special Services */}
        <div className="mb-4">
          <label className="block text-[#181818] text-[14px] font-[500] mb-2">
            Special Services
          </label>
          <div className="flex flex-wrap gap-2  border border-[#CACACA] rounded-[15px] p-4">
            {[
              "Bottle Service",
              "VIP Tables",
              "Private Rooms",
              "Group Packages",
              "Food & Drink Packages",
            ].map((service) => (
              <button
                key={service}
                onClick={() => toggleSelection("specialServices", service)}
                className={`px-4 py-1 rounded-full border ${
                  selectedFilters.specialServices.includes(service)
                    ? "bg-indigo-900 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-[#181818] text-[14px] font-[500] mb-2">
            Price Range
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="$ Min"
              className="w-1/2 border border-[#CACACA] rounded-[15px] p-2 placeholder:text-[#212121]"
              value={selectedFilters.minPrice}
              onChange={(e) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value,
                }))
              }
            />
            <input
              type="number"
              placeholder="$ Max"
              className="w-1/2 border border-[#CACACA] rounded-[15px] p-2 placeholder:text-[#212121]"
              value={selectedFilters.maxPrice}
              onChange={(e) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* Guest Capacity */}
        <div className="mb-6">
          <label className="block text-[#181818] text-[14px] font-[500] mb-2">
            Guest Capacity
          </label>
          <div className="flex items-center gap-2">
            <span>1</span>
            <input
              type="range"
              min="1"
              max="15"
              value={selectedFilters.guestCapacity}
              onChange={(e) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  guestCapacity: e.target.value,
                }))
              }
              className="range-input"
              style={{
                background: "#010067",
              }}
            />
            <span>15+</span>
          </div>
          <p className="text-center text-indigo-900 font-semibold mt-1">
            {selectedFilters.guestCapacity}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={clearAll}
            className="flex-1 py-2 border border-gray-400 rounded-lg text-gray-700"
          >
            Clear All
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 py-2 bg-gradient-to-l from-[#012C57] to-[#061523] text-white text-[13px] rounded-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
