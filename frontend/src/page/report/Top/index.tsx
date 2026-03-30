import React, { useEffect, useMemo, useState } from "react";
import type { DeviceRiskForReportDTO } from "../../../services/report";
import { ListDeviceRiskForReport } from "../../../services/report";

const formatRiskScore = (score?: number) => {
  if (typeof score !== "number" || Number.isNaN(score)) return "-";
  return score.toFixed(1);
};

const formatVulnerabilityTotal = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "0";
  return value.toLocaleString("en-US");
};

const truncateText = (value?: string, maxLength = 90) => {
  if (!value) return "-";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
};

const TopDeviceRiskReport: React.FC = () => {
  const [devices, setDevices] = useState<DeviceRiskForReportDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await ListDeviceRiskForReport();

        if (!isMounted) return;

        if (Array.isArray(result)) {
          setDevices(result);
        } else {
          setDevices([]);
        }
      } catch (error) {
        console.error("TopDeviceRiskReport error:", error);
        if (isMounted) {
          setDevices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => {
      const riskDiff = (b.risk_score || 0) - (a.risk_score || 0);
      if (riskDiff !== 0) return riskDiff;

      const vulnDiff =
        (b.vulnerability_total || 0) - (a.vulnerability_total || 0);
      if (vulnDiff !== 0) return vulnDiff;

      return (a.task_name || "").localeCompare(b.task_name || "");
    });
  }, [devices]);

  const highestRisk = useMemo(() => {
    if (sortedDevices.length === 0) return 0;
    return Math.max(...sortedDevices.map((item) => item.risk_score || 0));
  }, [sortedDevices]);

  const totalVulnerabilities = useMemo(() => {
    return sortedDevices.reduce(
      (sum, item) => sum + (item.vulnerability_total || 0),
      0
    );
  }, [sortedDevices]);

  if (loading) {
    return (
      <section className="rounded-[14px] border border-slate-200 bg-white">
        <div className="px-5 py-5 md:px-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="h-16 flex-1 animate-pulse rounded-md border border-slate-200 bg-slate-50" />
            <div className="h-16 flex-1 animate-pulse rounded-md border border-slate-200 bg-slate-50" />
          </div>

          <div className="mt-5 divide-y divide-slate-200 rounded-md border border-slate-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="px-4 py-4">
                <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-3 w-72 animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sortedDevices.length === 0) {
    return (
      <section className="rounded-[14px] border border-slate-200 bg-white">
        <div className="px-5 py-6 md:px-6">
          <h3 className="text-[17px] font-semibold text-slate-900">
            Device Risk List
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-slate-600">
            ไม่พบข้อมูลอุปกรณ์สำหรับรายงานรอบนี้
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[14px] border border-slate-200 bg-white">
      <div className="px-5 py-5 md:px-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-[18px] font-semibold text-slate-900">
            Device Risk List
          </h3>
          <p className="mt-2 max-w-4xl text-[13px] leading-6 text-slate-600">
            รายการนี้แสดงอุปกรณ์ทั้งหมดจากผลการประเมินล่าสุด โดยเรียงลำดับจากค่า
            Risk Score มากไปน้อยในรูปแบบรายการ เพื่อให้เหมาะกับการอ่านในรายงาน
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Highest Risk Score
            </p>
            <p className="mt-1 text-[16px] font-semibold text-slate-900">
              {formatRiskScore(highestRisk)}
            </p>
          </div>

          <div className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Total Vulnerabilities
            </p>
            <p className="mt-1 text-[16px] font-semibold text-slate-900">
              {formatVulnerabilityTotal(totalVulnerabilities)}
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
          <ul className="divide-y divide-slate-200">
            {sortedDevices.map((device, index) => (
              <li
                key={`${device.task_id}-${index}`}
                className="px-4 py-3 sm:px-5"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1.75 h-2 w-2 shrink-0 rounded-full bg-slate-900" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium leading-5 text-slate-900">
                      {device.task_name || "-"}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] leading-5 text-slate-600">
                      <span>
                        <span className="font-medium text-slate-700">IP:</span>{" "}
                        {device.ip_address || "-"}
                      </span>

                      <span>
                        <span className="font-medium text-slate-700">Risk:</span>{" "}
                        {formatRiskScore(device.risk_score)}
                      </span>

                      <span>
                        <span className="font-medium text-slate-700">
                          Vulnerabilities:
                        </span>{" "}
                        {formatVulnerabilityTotal(device.vulnerability_total)}
                      </span>
                    </div>

                    {device.firmware_version ? (
                      <p className="mt-1 text-[10.5px] leading-5 text-slate-500">
                        Firmware: {truncateText(device.firmware_version, 95)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          หมายเหตุ: รายการถูกจัดเรียงตามค่า Risk Score จากมากไปน้อย
        </p>
      </div>
    </section>
  );
};

export default TopDeviceRiskReport;