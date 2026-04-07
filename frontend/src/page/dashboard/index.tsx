import React, { useEffect, useState } from "react";
import Value from "./Value";
import AverageEnrollment from "./Average/index";
import TopPerforming from "./Top/index";
import DeliveryAnalysis from "./Analysis/index";
import TopVulnerability from "./Vulnerbility/index";
import {
  ListVulnerability,
  type VulnerabilityLevelDTO,
} from "../../services";

const DashboardIndex: React.FC = () => {
  const [vulnerabilityData, setVulnerabilityData] = useState<
    VulnerabilityLevelDTO[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await ListVulnerability();

        if (!alive) return;
        setVulnerabilityData(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("Failed to load vulnerability data:", error);
        if (!alive) return;
        setVulnerabilityData([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative isolate z-0 w-full overflow-visible">
      {/* ให้ Value อยู่สูงกว่า section ใน dashboard เท่านั้น */}
      <div className="relative z-20 mb-4 sm:mb-5">
        <Value vulnerabilityData={vulnerabilityData} loading={loading} />
      </div>

      {/* section อื่นอยู่ต่ำกว่า Value ภายใน dashboard */}
      <div className="relative z-0 mb-4 sm:mb-5">
        <AverageEnrollment />
      </div>

      <div className="relative z-0 mb-4 grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-12 xl:auto-rows-fr xl:items-stretch">
        <div className="flex h-full min-h-0 w-full xl:col-span-4">
          <TopVulnerability
            vulnerabilityData={vulnerabilityData}
            loading={loading}
          />
        </div>

        <div className="flex h-full min-h-0 w-full xl:col-span-4">
          <DeliveryAnalysis
            vulnerabilityData={vulnerabilityData}
            loading={loading}
          />
        </div>

        <div className="flex h-full min-h-0 w-full xl:col-span-4">
          <TopPerforming />
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;