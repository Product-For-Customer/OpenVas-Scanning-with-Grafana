import React, { useEffect, useMemo, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  FiChevronDown,
  FiShield,
  FiActivity,
  FiRadio,
} from "react-icons/fi";
import { ListTaskVulnSummary, type TaskVulnSummaryDTO } from "../../../services";

type SeverityKey = "Critical" | "High" | "Medium" | "Low" | "Info";
type RangeKey = "This Week" | "This Month" | "This Year";

type SeverityItem = {
  name: SeverityKey;
  value: number;
  color: string;
};

const RANGE_OPTIONS: RangeKey[] = ["This Week", "This Month", "This Year"];

const COLORS: Record<SeverityKey, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
  Info: "#3b82f6",
};

const formatPercent = (percent: number) => `${(percent * 100).toFixed(0)}%`;

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload?: SeverityItem }>;
  total: number;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, total }) => {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0]?.payload as SeverityItem | undefined;
  if (!item) return null;

  const percent = total > 0 ? item.value / total : 0;

  return (
    <div
      className="rounded-2xl px-4 py-3 shadow-2xl text-white text-[13px] font-semibold border border-white/10 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
        minWidth: 200,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate">{item.name}</span>
        <span className="tabular-nums">{item.value.toLocaleString()}</span>
      </div>
      <div className="mt-1.5 text-[12px] font-medium text-white/90">
        {formatPercent(percent)} of total findings
      </div>
    </div>
  );
};

const DeliveryAnalysis: React.FC = () => {
  const [range, setRange] = useState<RangeKey>("This Week");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [rows, setRows] = useState<TaskVulnSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const res = await ListTaskVulnSummary();
      console.log("Fetched vulnerability summary:", res);
      if (!alive) return;

      setRows(res ?? []);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const totals = useMemo(() => {
    let critical = 0,
      high = 0,
      medium = 0,
      low = 0,
      info = 0;

    for (const r of rows) {
      critical += Number(r.critical || 0);
      high += Number(r.high || 0);
      medium += Number(r.medium || 0);
      low += Number(r.low || 0);
      info += Number(r.info || 0);
    }

    return { critical, high, medium, low, info };
  }, [rows]);

  const data = useMemo<SeverityItem[]>(() => {
    const items: SeverityItem[] = [
      { name: "Critical", value: totals.critical, color: COLORS.Critical },
      { name: "High", value: totals.high, color: COLORS.High },
      { name: "Medium", value: totals.medium, color: COLORS.Medium },
      { name: "Low", value: totals.low, color: COLORS.Low },
      { name: "Info", value: totals.info, color: COLORS.Info },
    ];

    const nonZero = items.filter((i) => i.value > 0);
    return nonZero.length > 0 ? nonZero : items;
  }, [totals]);

  const total = useMemo(() => {
    return data.reduce((sum, d) => sum + d.value, 0);
  }, [data]);

  const highestSeverity = useMemo<SeverityKey>(() => {
    if (totals.critical > 0) return "Critical";
    if (totals.high > 0) return "High";
    if (totals.medium > 0) return "Medium";
    if (totals.low > 0) return "Low";
    return "Info";
  }, [totals]);

  const subtitle = useMemo(() => {
    if (loading) return "Syncing latest vulnerability data...";
    return "Live vulnerability posture from latest scan snapshot";
  }, [loading]);

  const scanStatusText = useMemo(() => {
    if (loading) return "Scanner Syncing";
    if (total === 0) return "No Findings Detected";
    return `${highestSeverity} Risk Detected`;
  }, [loading, total, highestSeverity]);


  return (
    <section
      className={[
        "relative overflow-hidden rounded-3xl p-4 sm:p-5 md:p-6 h-full",
        "bg-white border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)]",
        "dark:bg-[#08111f]/95 dark:border-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />
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

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                  "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                  "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                ].join(" ")}
              >
                <FiShield className="text-[14px]" />
                <span className="text-[12px] font-semibold tracking-wide">
                  Vulnerability Scanner
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
                <span className="text-[12px] font-medium">{scanStatusText}</span>
              </div>
            </div>

            <h3 className="text-[19px] sm:text-[21px] font-semibold text-slate-900 dark:text-white/90">
              Network Scan Analysis
            </h3>
            <p className="mt-1 text-[12.5px] text-slate-500 dark:text-white/55">
              {subtitle}
            </p>
          </div>

          {/* Dropdown */}
          <div className="relative self-start" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className={[
                "h-11 px-4 rounded-2xl inline-flex items-center gap-2.5 transition-all duration-200",
                "bg-white border border-slate-200/80 text-[13px] font-medium text-slate-700 hover:bg-slate-50",
                "dark:bg-white/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/10",
              ].join(" ")}
              aria-label="Select range"
            >
              <FiActivity className="text-[15px] text-cyan-500" />
              {range}
              <FiChevronDown
                className={`text-[15px] text-slate-400 dark:text-white/45 transition-transform ${open ? "rotate-180" : ""
                  }`}
              />
            </button>

            {open && (
              <div
                className={[
                  "absolute right-0 mt-2 w-44 rounded-2xl overflow-hidden z-20 backdrop-blur-xl",
                  "border border-slate-200 bg-white shadow-xl",
                  "dark:border-white/10 dark:bg-[#0B1220]/95 dark:shadow-none",
                ].join(" ")}
              >
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRange(opt);
                      setOpen(false);
                    }}
                    className={[
                      "w-full text-left px-4 py-3 text-[13px] transition",
                      range === opt
                        ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                        : "text-slate-700 hover:bg-slate-50 dark:text-white/75 dark:hover:bg-white/8",
                    ].join(" ")}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* scan bar */}
        <div
          className={[
            "mt-5 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3",
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
              Scanner Telemetry Active
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-white/10" />

          <div className="text-[12px] text-slate-500 dark:text-white/50">
            Severity distribution across the latest imported scan results
          </div>
        </div>

        {/* Chart */}
        <div className="mt-5 sm:mt-6 h-72 sm:h-80 relative">
          {/* center glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-2xl dark:bg-cyan-400/10" />

          {/* center label */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={[
                "rounded-full h-28 w-28 sm:h-32 sm:w-32 flex flex-col items-center justify-center text-center",
                "bg-white/90 border border-slate-200 shadow-sm",
                "dark:bg-[#0b1728]/80 dark:border-white/10 dark:shadow-none backdrop-blur-md",
              ].join(" ")}
            >
              <div className="text-[22px] sm:text-[28px] font-semibold text-slate-900 dark:text-white/90 tabular-nums leading-none">
                {loading ? "..." : total.toLocaleString()}
              </div>
              <div className="mt-2 text-[11px] sm:text-[12px] text-slate-500 dark:text-white/55">
                Total Findings
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={(props: any) => <CustomTooltip {...props} total={total} />}
                cursor={false}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="84%"
                paddingAngle={3}
                stroke="rgba(255,255,255,0.95)"
                strokeWidth={3}
                isAnimationActive
                animationDuration={800}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-5">
          <div
            className={[
              "rounded-2xl px-4 py-3",
              // ✅ Light
              "bg-white border border-gray-200/80",
              // ✅ Dark
              "dark:bg-white/5 dark:border-white/10",
            ].join(" ")}
          >
            {/* แถวบน */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {(["Critical", "High", "Medium"] as SeverityKey[]).map((k) => {
                const item = data.find((d) => d.name === k) || {
                  name: k,
                  value: 0,
                  color: COLORS[k],
                };
                const p = total > 0 ? item.value / total : 0;

                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-sm" style={{ background: COLORS[k] }} />
                    <span className="text-[13px] font-medium text-[#1f2240] dark:text-white/85">
                      {k}
                    </span>
                    <span className="text-[12px] text-gray-500 dark:text-white/55 tabular-nums">
                      {loading ? "..." : item.value.toLocaleString()}
                    </span>
                    <span className="text-[12px] text-gray-400 dark:text-white/40 tabular-nums">
                      {loading ? "" : `(${formatPercent(p)})`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* แถวล่าง */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {(["Low", "Info"] as SeverityKey[]).map((k) => {
                const item = data.find((d) => d.name === k) || {
                  name: k,
                  value: 0,
                  color: COLORS[k],
                };
                const p = total > 0 ? item.value / total : 0;

                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-sm" style={{ background: COLORS[k] }} />
                    <span className="text-[13px] font-medium text-[#1f2240] dark:text-white/85">
                      {k}
                    </span>
                    <span className="text-[12px] text-gray-500 dark:text-white/55 tabular-nums">
                      {loading ? "..." : item.value.toLocaleString()}
                    </span>
                    <span className="text-[12px] text-gray-400 dark:text-white/40 tabular-nums">
                      {loading ? "" : `(${formatPercent(p)})`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryAnalysis;