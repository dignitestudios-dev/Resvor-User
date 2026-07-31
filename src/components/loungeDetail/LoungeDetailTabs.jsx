/* eslint-disable react/prop-types */
import LoungeAbout from "./LoungeAbout";
import LoungeSpecialty from "./LoungeSpecialty";
import LoungeServicesPackages from "./LoungeServicesPackages";
import LoungeGallery from "./LoungeGallery";
import LoungeFloorPlan from "./LoungeFloorPlan";
import LoungeLocation from "./LoungeLocation";

// 1. HELPER FUNCTION: Generates tab configurations using active lounge data
export const getLoungeTabs = (lounge) => [
  {
    key: "about",
    label: "About",
    content: <LoungeAbout lounge={lounge} />,
  },
  {
    key: "lounge",
    label: "Lounge Specialty",
    content: <LoungeSpecialty lounge={lounge} />,
  },
  {
    key: "services",
    label: "Services & Packages",
    content: <LoungeServicesPackages lounge={lounge} />,
  },
  {
    key: "gallery",
    label: "Gallery",
    content: <LoungeGallery lounge={lounge} />,
  },
  {
    key: "floor",
    label: "Floor Plan",
    content: <LoungeFloorPlan lounge={lounge} />,
  },
  {
    key: "location",
    label: "Location",
    content: <LoungeLocation lounge={lounge} />,
  },
];

// 2. UI COMPONENT: Your exact layout structure intact
const LoungeDetailTabs = ({ tabs, setActiveTab, activeTab }) => {
  return (
    <div className="w-full mx-auto p-4 md:p-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-300">
        <nav className="flex flex-wrap gap-1 md:gap-2 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                  px-3 py-2 text-[16px] transition-all duration-200
                  border-b-2 whitespace-nowrap
                  ${activeTab === tab.key
                  ? "border-indigo-900 text-blue-950 font-[600]"
                  : "border-transparent text-[#727272] hover:text-gray-700 hover:border-[#727272]"
                }
                `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6 px-8 ">
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
};

export default LoungeDetailTabs;