import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  FiShield,
  FiRadio,
  FiActivity,
} from "react-icons/fi";

import {
  ListTaskVulnSummary,
  type TaskVulnSummaryDTO,
} from "../../../services";

type SeverityName = "Critical" | "High" | "Medium" | "Low" | "Info";

type SeverityRow = {
  name: SeverityName;
  current: number;
};

const severityColors: Record<SeverityName, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
  Info: "#3b82f6",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={[
        "rounded-2xl px-4 py-3 shadow-xl border min-w-45",
        "border-slate-200 bg-white/95 backdrop-blur-sm",
        "dark:border-white/10 dark:bg-[#0B1220]/95 dark:shadow-none",
      ].join(" ")}
    >
      <p className="text-[13px] font-semibold text-[#1f2240] dark:text-white/90 mb-2">
        {label}
      </p>

      {payload.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-500 dark:text-white/55 truncate">
              Findings
            </span>
          </div>

          <span className="font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
            {Number(item.value || 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const BarSeverityChart: React.FC = () => {
  const [rows, setRows] = useState<TaskVulnSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const res = await ListTaskVulnSummary();
      if (!alive) return;

      setRows(res ?? []);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const totals = useMemo(() => {
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    let info = 0;

    for (const r of rows) {
      critical += Number(r.critical || 0);
      high += Number(r.high || 0);
      medium += Number(r.medium || 0);
      low += Number(r.low || 0);
      info += Number(r.info || 0);
    }

    return { critical, high, medium, low, info };
  }, [rows]);

  const data: SeverityRow[] = useMemo(
    () => [
      { name: "Critical", current: totals.critical },
      { name: "High", current: totals.high },
      { name: "Medium", current: totals.medium },
      { name: "Low", current: totals.low },
      { name: "Info", current: totals.info },
    ],
    [totals]
  );

  const totalAll = useMemo(
    () => totals.critical + totals.high + totals.medium + totals.low + totals.info,
    [totals]
  );

  const highestSeverity = useMemo<SeverityName>(() => {
    if (totals.critical > 0) return "Critical";
    if (totals.high > 0) return "High";
    if (totals.medium > 0) return "Medium";
    if (totals.low > 0) return "Low";
    return "Info";
  }, [totals]);

  const subtitle = useMemo(() => {
    if (loading) return "Syncing latest severity telemetry...";
    return `Latest scan snapshot • Total findings: ${totalAll.toLocaleString()}`;
  }, [loading, totalAll]);

  const statusText = useMemo(() => {
    if (loading) return "Scanner Syncing";
    if (totalAll === 0) return "No Findings Detected";
    return `${highestSeverity} Activity Detected`;
  }, [loading, totalAll, highestSeverity]);

  return (
    <section
      className={[
        "relative overflow-hidden h-full rounded-[22px] p-4 sm:p-5 md:p-6 flex flex-col",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "28px 28px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-4 sm:mb-5">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                    "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                  ].join(" ")}
                >
                  <FiShield className="text-[14px]" />
                  <span className="text-[12px] font-semibold tracking-wide">
                    Severity Monitor
                  </span>
                </div>

                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-slate-50 text-slate-600 border border-slate-200/80",
                    "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                  ].join(" ")}
                >
                  <FiRadio className="text-[13px] text-cyan-500" />
                  <span className="text-[12px] font-medium">{statusText}</span>
                </div>
              </div>

              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
                Severity Activity
              </h2>
              <p className="mt-1 text-[12.5px] text-gray-500 dark:text-white/55">
                {subtitle}
              </p>
            </div>

            <span
              className={[
                "shrink-0 rounded-full h-10 px-4 inline-flex items-center justify-center text-[13px] font-medium",
                "border border-gray-200 bg-white text-gray-500",
                "dark:border-white/10 dark:bg-white/5 dark:text-white/50",
              ].join(" ")}
            >
              Latest
            </span>
          </div>

          {/* scan bar */}
          <div
            className={[
              "rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3",
              "bg-slate-50 border border-slate-200/80",
              "dark:bg-white/4 dark:border-white/10",
            ].join(" ")}
          >
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
              </span>
              <span className="text-[12px] font-medium text-slate-700 dark:text-white/75">
                Severity telemetry active
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-white/10" />

            <div className="inline-flex items-center gap-2 text-[12px] text-slate-500 dark:text-white/50">
              <FiActivity className="text-cyan-500" />
              Distribution of findings by severity level
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-65">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 10, left: 0, bottom: 18 }}
              barCategoryGap="26%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
                className="dark:opacity-20"
              />

              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                angle={-28}
                textAnchor="end"
                height={55}
              />

              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={42}
                domain={[0, "dataMax + 6"]}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />

              <Bar
                dataKey="current"
                name="Findings"
                radius={[10, 10, 0, 0]}
                maxBarSize={34}
                isAnimationActive
                animationDuration={700}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={severityColors[entry.name]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default BarSeverityChart;