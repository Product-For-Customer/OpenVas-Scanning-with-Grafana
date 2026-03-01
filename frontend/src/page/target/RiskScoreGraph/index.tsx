import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FiShield, FiRadio, FiActivity, FiChevronDown } from "react-icons/fi";

type RangeKey = "This Month" | "This Year";
const RANGE_OPTIONS: RangeKey[] = ["This Month", "This Year"];

type Row = {
  month: string;
  riskScore: number;
  threatLevel: number;
};

const DATA_MONTH: Row[] = [
  { month: "Jan", riskScore: 32, threatLevel: 50 },
  { month: "Feb", riskScore: 39, threatLevel: 36 },
  { month: "Mar", riskScore: 35, threatLevel: 44 },
  { month: "Apr", riskScore: 48, threatLevel: 40 },
  { month: "May", riskScore: 24, threatLevel: 58 },
  { month: "Jun", riskScore: 60, threatLevel: 47 },
  { month: "Jul", riskScore: 43, threatLevel: 35 },
  { month: "Aug", riskScore: 55, threatLevel: 39 },
  { month: "Sep", riskScore: 70, threatLevel: 64 },
  { month: "Oct", riskScore: 66, threatLevel: 58 },
  { month: "Nov", riskScore: 44, threatLevel: 71 },
  { month: "Dec", riskScore: 59, threatLevel: 61 },
];

const DATA_YEAR: Row[] = DATA_MONTH.map((d) => ({
  ...d,
  riskScore: Math.min(90, Math.round(d.riskScore * 1.1)),
  threatLevel: Math.min(90, Math.round(d.threatLevel * 1.05)),
}));

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 bg-white shadow-md px-3.5 py-2.5",
        "dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none",
      ].join(" ")}
    >
      <p className="text-[13px] font-semibold text-[#1f2240] dark:text-white/90 mb-1">
        {label}
      </p>

      {payload.map((p, idx) => (
        <div key={idx} className="flex items-center gap-2 text-[12px]">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-gray-500 dark:text-white/55">{p.name}:</span>
          <span className="font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const RiskScoreGraph: React.FC = () => {
  const [range, setRange] = useState<RangeKey>("This Month");
  const [open, setOpen] = useState(false);

  const data = useMemo(() => {
    return range === "This Month" ? DATA_MONTH : DATA_YEAR;
  }, [range]);

  const peakRisk = useMemo(() => {
    if (!data.length) return null;
    return data.reduce((max, item) =>
      item.riskScore > max.riskScore ? item : max
    );
  }, [data]);

  return (
    <section
      className={[
        "relative overflow-hidden h-full rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-14 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-14 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                    "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                  ].join(" ")}
                >
                  <FiShield className="text-[13px]" />
                  <span className="text-[12px] font-semibold tracking-wide">
                    Risk Analytics
                  </span>
                </div>

                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-slate-50 text-slate-600 border border-slate-200/80",
                    "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                  ].join(" ")}
                >
                  <FiRadio className="text-[12px] text-cyan-500" />
                  <span className="text-[12px] font-medium">
                    Live risk trend
                  </span>
                </div>

                {peakRisk && (
                  <div
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                      "bg-slate-50 text-slate-600 border border-slate-200/80",
                      "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                    ].join(" ")}
                  >
                    <FiActivity className="text-[12px] text-violet-500" />
                    <span className="text-[12px] font-medium">
                      Peak Risk {peakRisk.month}: {peakRisk.riskScore}
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
                Risk Score Trend
              </h2>

              <div className="mt-4 flex items-center gap-8 text-[13px] text-gray-500 dark:text-white/55">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-5 rounded-full bg-[#8b5cf6]" />
                  <span>Asset Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-5 rounded-full bg-[#38bdf8]" />
                  <span>Threat Level</span>
                </div>
              </div>
            </div>

            {/* Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className={[
                  "h-10 px-4 rounded-2xl inline-flex items-center gap-2 transition",
                  "bg-white border border-gray-200/80 text-[13px] font-medium text-gray-500 hover:bg-gray-50",
                  "dark:bg-white/5 dark:border-white/10 dark:text-white/65 dark:hover:bg-white/10",
                ].join(" ")}
              >
                {range}
                <FiChevronDown
                  className={[
                    "text-gray-400 dark:text-white/45 transition",
                    open ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20 dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setRange(opt);
                        setOpen(false);
                      }}
                      className={[
                        "w-full text-left px-4 py-2.5 text-[13px] transition",
                        range === opt
                          ? "bg-cyan-50 text-cyan-700 font-semibold dark:bg-cyan-500/10 dark:text-cyan-300"
                          : "text-gray-600 hover:bg-gray-50 dark:text-white/70 dark:hover:bg-white/8",
                      ].join(" ")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* status bar */}
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
                Monitoring risk behavior
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-white/10" />

            <div className="text-[12px] text-slate-500 dark:text-white/50">
              Filled area shows threat intensity over time
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-4 flex-1 min-h-65">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="6 6"
                vertical={false}
                stroke="#ececf1"
                className="dark:opacity-30"
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#5b6170", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#5b6170", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={42}
                domain={[0, 90]}
                ticks={[10, 25, 40, 55, 70, 85]}
              />

              <Tooltip content={<CustomTooltip />} />

              <defs>
                <linearGradient id="threatFillLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.28} />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="threatFillDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.34} />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* พื้นใต้เส้น */}
              <Area
                type="monotone"
                dataKey="threatLevel"
                name="Threat Level"
                stroke="transparent"
                fill="url(#threatFillLight)"
                className="dark:hidden"
              />
              <Area
                type="monotone"
                dataKey="threatLevel"
                name="Threat Level"
                stroke="transparent"
                fill="url(#threatFillDark)"
                className="hidden dark:block"
              />

              {/* เส้น risk */}
              <Line
                type="monotone"
                dataKey="riskScore"
                name="Asset Risk"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />

              {/* เส้น threat */}
              <Line
                type="monotone"
                dataKey="threatLevel"
                name="Threat Level"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {open && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-5 cursor-default"
            aria-label="Close dropdown"
          />
        )}
      </div>
    </section>
  );
};

export default RiskScoreGraph;