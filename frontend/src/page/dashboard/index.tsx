import React from "react";
import Introduction from "./Introduction";
import Value from "./Value";
import AverageEnrollment from "./Average/index";
import TopPerforming from "./Top/index";
import BarSeverityChart from "./Bar/index";
import DeliveryAnalysis from "./Analysis";
import TopVulnerability from "./Vulnerbility/index";
import Social from "./Social/index";

const DashboardIndex: React.FC = () => {
  return (
    <div className="w-full">
      {/* ✅ Value แนวนอนอยู่บนสุด */}
      <div className="mb-4 sm:mb-5">
        <Value />
      </div>

      {/* ✅ Top section: ซ้าย Introduction / ขวา DeliveryAnalysis */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 mb-4 sm:mb-5">
        <div className="xl:col-span-7">
          <Introduction />
        </div>
        <div className="xl:col-span-5">
          <DeliveryAnalysis />
        </div>
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 mb-4 sm:mb-5">
        <div className="xl:col-span-8">
          <AverageEnrollment />
        </div>
        <div className="xl:col-span-4">
          <TopPerforming />
        </div>
      </div>

      {/* ✅ Bottom section: 3 อันอยู่แถวเดียวกัน */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        <div className="xl:col-span-4 h-full">
          <TopVulnerability />
        </div>

        <div className="xl:col-span-4 h-full">
          <Social />
        </div>

        <div className="xl:col-span-4 h-full">
          <BarSeverityChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;