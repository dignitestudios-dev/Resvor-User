/* eslint-disable react/prop-types */

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
                  ${
                    activeTab === tab.key
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
