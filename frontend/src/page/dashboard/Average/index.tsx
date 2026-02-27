// AverageEnrollment.tsx
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MdKeyboardArrowDown } from "react-icons/md";

type ChartRow = {
  week: string;
  regular: number;
  sale: number;
};

const chartDataMap: Record<string, ChartRow[]> = {
  "This Month": [
    { week: "Week 1", regular: 70000, sale: 22000 },
    { week: "Week 2", regular: 52000, sale: 39000 },
    { week: "Week 3", regular: 28000, sale: 48000 },
    { week: "Week 4", regular: 56000, sale: 70000 },
  ],
  "Last Month": [
    { week: "Week 1", regular: 64000, sale: 18000 },
    { week: "Week 2", regular: 50000, sale: 34000 },
    { week: "Week 3", regular: 32000, sale: 42000 },
    { week: "Week 4", regular: 51000, sale: 66000 },
  ],
  "This Quarter": [
    { week: "Week 1", regular: 75000, sale: 26000 },
    { week: "Week 2", regular: 58000, sale: 42000 },
    { week: "Week 3", regular: 35000, sale: 52000 },
    { week: "Week 4", regular: 60000, sale: 73000 },
  ],
};

const formatYAxis = (value: number) => {
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return `${value}`;
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
  if (!active || !payload || payload.length === 0) return null;

  const regular = payload.find((p) => p.dataKey === "regular")?.value ?? 0;
  const sale = payload.find((p) => p.dataKey === "sale")?.value ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
      <p className="text-sm font-semibold text-[#1f2240] dark:text-white/90 mb-1">
        {label}
      </p>
      <div className="space-y-1 text-xs">
        <p className="text-[#6f5be8]">
          Regular paid course:{" "}
          <span className="font-semibold">{regular.toLocaleString()}</span>
        </p>
        <p className="text-[#7ac65d]">
          On sale course:{" "}
          <span className="font-semibold">{sale.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

const AverageEnrollment: React.FC = () => {
  const [range, setRange] = useState<"This Month" | "Last Month" | "This Quarter">(
    "This Month"
  );

  const data = useMemo(() => chartDataMap[range], [range]);

  return (
    <section
      className={[
        "rounded-[22px] p-5 sm:p-6",
        // ✅ Light
        "bg-white border border-gray-200/80 shadow-sm",
        // ✅ Dark
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
          Average enrollment rate
        </h2>

        <div className="relative">
          <select
            value={range}
            onChange={(e) =>
              setRange(e.target.value as "This Month" | "Last Month" | "This Quarter")
            }
            className={[
              "appearance-none h-11 rounded-xl px-4 pr-10 text-[14px] sm:text-[15px] outline-none transition",
              // ✅ Light
              "border border-gray-200 bg-[#fbfbfc] text-gray-600 hover:bg-white",
              // ✅ Dark
              "dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
            ].join(" ")}
            aria-label="Select range"
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
          </select>
          <MdKeyboardArrowDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 dark:text-white/45" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-4 pl-1">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6f5be8]" />
          <span className="text-[14px] text-gray-700 dark:text-white/75">
            Regular paid course
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#7ac65d]" />
          <span className="text-[14px] text-gray-700 dark:text-white/75">
            On sale course
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-70 sm:h-85">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="regularFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6f5be8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6f5be8" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="saleFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7ac65d" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7ac65d" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* ✅ Grid สีให้กลืนกับ dark */}
            <CartesianGrid
              stroke="#e9e9ee"
              strokeDasharray="0"
              vertical={false}
              className="dark:opacity-30"
            />

            <XAxis
              dataKey="week"
              tick={{ fill: "#6b7280", fontSize: 13 }}
              axisLine={{ stroke: "#ececf2" }}
              tickLine={false}
            />

            <YAxis
              domain={[5000, 90000]}
              ticks={[5000, 22000, 39000, 56000, 73000, 90000]}
              tickFormatter={formatYAxis}
              tick={{ fill: "#6b7280", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={46}
            />

            {/* ✅ Tooltip รองรับ dark */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#d7d7e2", strokeDasharray: "4 4" }}
            />

            <Area
              type="monotone"
              dataKey="regular"
              stroke="#6f5be8"
              fill="url(#regularFill)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="sale"
              stroke="#7ac65d"
              fill="url(#saleFill)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default AverageEnrollment;