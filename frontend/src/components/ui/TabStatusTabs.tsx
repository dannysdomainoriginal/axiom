import React from "react";

type TabOptions = "Pending" | "In Progress" | "Completed" | "All";

interface Props {
  tabs: { label: TabOptions; count: number }[];
  activeTab: TabOptions;
  setActiveTab: (tab: TabOptions) => void;
}

const TabStatusTabs = ({ tabs, activeTab, setActiveTab }: Props) => {
  return (
    <div className="my-2">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`relative px-3 md:px-4 py-2 text-sm font-medium cursor-pointer ${
              activeTab === tab.label
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex items-center">
              <span className="text-xs mt-3 sm:mt-0">{tab.label}</span>
              <span
                className={`text-xs mt-3 ml-2 sm:mt-0 sm:px-2 sm:py-0.5 sm:rounded-full ${
                  activeTab === tab.label
                    ? "text-primary sm:bg-primary sm:text-white"
                    : "sm:bg-gray-200/70 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </div>
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabStatusTabs;
