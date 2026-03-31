import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineReportProblem } from "react-icons/md";
import {
  FiAlertOctagon,
  FiAlertTriangle,
  FiMinusCircle,
  FiShield,
  FiInfo,
} from "react-icons/fi";
import {
  ListTaskVulnSummaryForReport,
  type TaskVulnSummaryForReportResponse,
} from "../../../services/report";

type MetricItem = {
  id: number;
  label: string;
  value: string | number;
  hint: string;
  icon: React.ReactNode;
  iconWrapClass: string;
  labelClass: string;
};

type ReportKPIProps = {
  onReady?: (ready: boolean) => void;
};

const ReportKPI: React.FC<ReportKPIProps> = ({ onReady }) => {
  const [rows, setRows] = useState<TaskVulnSummaryForReportResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;

    onReady?.(false);

    const loadData = async () => {
      try {
        setLoading(true);

        const response = await ListTaskVulnSummaryForReport();

        if (!alive) return;
        setRows(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to load task vulnerability summary:", error);

        if (!alive) return;
        setRows([]);
      } finally {
        if (!alive) return;
        setLoading(false);
        onReady?.(true);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, [onReady]);

  const summary = useMemo(() => {
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    let info = 0;

    for (const row of rows) {
      critical += Number(row.critical || 0);
      high += Number(row.high || 0);
      medium += Number(row.medium || 0);
      low += Number(row.low || 0);
      info += Number(row.info || 0);
    }

    const total = critical + high + medium + low + info;

    return {
      total,
      critical,
      high,
      medium,
      low,
      info,
    };
  }, [rows]);

  const items: MetricItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "Total Findings",
        value: loading ? "..." : summary.total.toLocaleString(),
        hint: "Total findings identified across all scanned targets",
        icon: <MdOutlineReportProblem className="text-[13px]" />,
        iconWrapClass: "bg-slate-100 text-slate-700",
        labelClass: "text-slate-600",
      },
      {
        id: 2,
        label: "Critical",
        value: loading ? "..." : summary.critical.toLocaleString(),
        hint: "Critical vulnerabilities requiring immediate remediation",
        icon: <FiAlertOctagon className="text-[12px]" />,
        iconWrapClass: "bg-rose-50 text-rose-700",
        labelClass: "text-rose-700",
      },
      {
        id: 3,
        label: "High",
        value: loading ? "..." : summary.high.toLocaleString(),
        hint: "High-risk vulnerabilities with significant impact potential",
        icon: <FiAlertTriangle className="text-[12px]" />,
        iconWrapClass: "bg-orange-50 text-orange-700",
        labelClass: "text-orange-700",
      },
      {
        id: 4,
        label: "Medium",
        value: loading ? "..." : summary.medium.toLocaleString(),
        hint: "Medium-severity findings that should be addressed in due course",
        icon: <FiInfo className="text-[12px]" />,
        iconWrapClass: "bg-yellow-50 text-yellow-700",
        labelClass: "text-yellow-700",
      },
      {
        id: 5,
        label: "Low",
        value: loading ? "..." : summary.low.toLocaleString(),
        hint: "Low-severity findings with limited immediate impact",
        icon: <FiMinusCircle className="text-[12px]" />,
        iconWrapClass: "bg-emerald-50 text-emerald-700",
        labelClass: "text-emerald-700",
      },
      {
        id: 6,
        label: "Info",
        value: loading ? "..." : summary.info.toLocaleString(),
        hint: "Informational observations and security-related notices",
        icon: <FiShield className="text-[12px]" />,
        iconWrapClass: "bg-sky-50 text-sky-700",
        labelClass: "text-sky-700",
      },
    ],
    [loading, summary]
  );

  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-300 px-5 py-3.5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-normal text-slate-500">
              Security Risk Summary
            </p>
            <h3 className="mt-1 text-[15px] font-bold leading-tight text-slate-900">
              Vulnerability Severity Overview
            </h3>
          </div>

          <div className="text-right text-[9.5px] leading-[1.45] text-slate-500">
            Consolidated findings by severity level
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3">
        {items.map((item, index) => {
          const isLastColumn = index % 3 === 2;
          const isLastRow = index >= items.length - 3;

          return (
            <div
              key={item.id}
              className={[
                "min-h-23 bg-white px-4 py-3",
                !isLastColumn ? "border-r border-slate-300" : "",
                !isLastRow ? "border-b border-slate-300" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "inline-flex h-5 w-5 items-center justify-center rounded-full",
                    item.iconWrapClass,
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <p
                  className={[
                    "text-[8.5px] font-semibold uppercase tracking-normal",
                    item.labelClass,
                  ].join(" ")}
                >
                  {item.label}
                </p>
              </div>

              <p className="mt-2 text-[14px] font-bold leading-none text-slate-900">
                {item.value}
              </p>

              <p className="mt-2 text-[9.5px] leading-[1.4] text-slate-600">
                {item.hint}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ReportKPI;