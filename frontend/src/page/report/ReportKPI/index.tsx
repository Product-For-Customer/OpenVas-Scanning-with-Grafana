import React, { useEffect, useMemo, useState } from "react";
import {
  ListTaskVulnSummary,
  type TaskVulnSummaryDTO,
} from "../../../services";

type MetricItem = {
  id: number;
  label: string;
  value: string | number;
  hint: string;
};

const ReportKPI: React.FC = () => {
  const [rows, setRows] = useState<TaskVulnSummaryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const response = await ListTaskVulnSummary();

        if (!alive) return;

        setRows(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to load task vulnerability summary:", error);

        if (!alive) return;
        setRows([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, []);

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
        hint: "Total number of findings from all scanned tasks",
      },
      {
        id: 2,
        label: "Critical Findings",
        value: loading ? "..." : summary.critical.toLocaleString(),
        hint: "Findings classified as severity level Critical",
      },
      {
        id: 3,
        label: "High Findings",
        value: loading ? "..." : summary.high.toLocaleString(),
        hint: "Findings classified as severity level High",
      },
      {
        id: 4,
        label: "Medium Findings",
        value: loading ? "..." : summary.medium.toLocaleString(),
        hint: "Findings classified as severity level Medium",
      },
      {
        id: 5,
        label: "Low Findings",
        value: loading ? "..." : summary.low.toLocaleString(),
        hint: "Findings classified as severity level Low",
      },
      {
        id: 6,
        label: "Info Findings",
        value: loading ? "..." : summary.info.toLocaleString(),
        hint: "Informational findings reported by the assessment",
      },
    ],
    [loading, summary]
  );

  return (
    <section className="overflow-hidden rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-300 px-6 py-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Vulnerability Summary
            </p>
            <h3 className="mt-1 text-[24px] font-semibold text-slate-900">
              Security Findings Overview
            </h3>
          </div>

          <div className="text-[11px] text-slate-500">
            Consolidated assessment results
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const isLastColumnDesktop = index % 3 === 2;
          const isTopRowDesktop = index < 3;
          const isLeftColumnTablet = index % 2 === 0;
          const isTopRowTablet = index < 4;

          return (
            <div
              key={item.id}
              className={[
                "px-6 py-6",
                "bg-white",
                "border-slate-300",
                !isLastColumnDesktop ? "xl:border-r" : "",
                isTopRowDesktop ? "xl:border-b" : "",
                isLeftColumnTablet ? "md:border-r xl:border-r" : "",
                isTopRowTablet ? "md:border-b xl:border-b" : "",
                index !== items.length - 1 ? "border-b md:border-b xl:border-b-0" : "",
              ].join(" ")}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>

              <p className="mt-4 text-[36px] font-bold leading-none text-slate-950">
                {item.value}
              </p>

              <p className="mt-4 text-[13px] leading-6 text-slate-600">
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