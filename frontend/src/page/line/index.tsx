import React from "react";
import HistoryNotify from "./history";
import Notify from "./notify";
import Master from "./master";
import Graph from "./graph";
import Count from "./count";

const Index: React.FC = () => {
  return (
    <div className="w-full">
      {/* Row 1: Master 40% / Notify 60% */}
      <div className="mb-4 sm:mb-5 grid grid-cols-1 xl:grid-cols-10 gap-4 sm:gap-5 items-stretch">
        <div className="xl:col-span-4 h-full">
          <Master />
        </div>

        <div className="xl:col-span-6 h-full">
          <Notify />
        </div>
      </div>

      {/* Row 2: Graph 70% / Count 30% */}
      <div className="mb-4 sm:mb-5 grid grid-cols-1 xl:grid-cols-10 gap-4 sm:gap-5 items-stretch">
        <div className="xl:col-span-7 h-full">
          <Count />
        </div>

        <div className="xl:col-span-3 h-full">
          <Graph />
        </div>
      </div>

      {/* Row 3: HistoryNotify full width */}
      <div className="mb-2">
        <HistoryNotify />
      </div>
    </div>
  );
};

export default Index;