import React from "react";
import StatusTarget from "./Status/index";
import RiskScoreGraph from "./RiskScoreGraph";
import RiskScoreTable from "./RiskScoreTable";
import TableTarget from "./TableTarget";
import DeviceMap from "./Map";

const Target: React.FC = () => {
  return (
    <div className="w-full">
      {/* Section: Status */}
      <div className="mb-4 sm:mb-5">
        <StatusTarget />
      </div>

      {/* Section: Map ใต้ Status */}
      <div className="mb-4 sm:mb-5">
        <DeviceMap />
      </div>

      {/* Row: Graph 60% / Table 40% */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 items-stretch mb-4 sm:mb-5">
        <div className="xl:col-span-7 h-full">
          <RiskScoreGraph />
        </div>

        <div className="xl:col-span-5 h-full">
          <RiskScoreTable />
        </div>
      </div>

      {/* Bottom: TableTarget */}
      <div className="mb-2">
        <TableTarget />
      </div>
    </div>
  );
};

export default Target;