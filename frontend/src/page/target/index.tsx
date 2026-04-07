import React, { useEffect, useState } from "react";
import StatusTarget from "./Status/index";
import RiskScoreGraph from "./RiskScoreGraph";
import RiskScoreTable from "./RiskScoreTable";
import TableTarget from "./TableTarget";
import DeviceMap from "./Map";
import { ListDeviceRisk, type DeviceRiskDTO } from "../../services";

const Target: React.FC = () => {
  const [deviceRisks, setDeviceRisks] = useState<DeviceRiskDTO[]>([]);
  const [loadingDeviceRisks, setLoadingDeviceRisks] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchDeviceRisks = async () => {
      try {
        setLoadingDeviceRisks(true);
        const res = await ListDeviceRisk();

        if (!mounted) return;

        setDeviceRisks(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("ListDeviceRisk error in Target:", error);
        if (!mounted) return;
        setDeviceRisks([]);
      } finally {
        if (!mounted) return;
        setLoadingDeviceRisks(false);
      }
    };

    fetchDeviceRisks();

    return () => {
      mounted = false;
    };
  }, []);

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
          <RiskScoreTable
            data={deviceRisks}
            loading={loadingDeviceRisks}
          />
        </div>
      </div>

      {/* Bottom: TableTarget */}
      <div className="mb-2">
        <TableTarget
          data={deviceRisks}
          loading={loadingDeviceRisks}
        />
      </div>
    </div>
  );
};

export default Target;