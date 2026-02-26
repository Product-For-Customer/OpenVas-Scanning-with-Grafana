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

type RangeKey = "This Month" | "This Year";
const RANGE_OPTIONS: RangeKey[] = ["This Month", "This Year"];

type Row = {
  month: string;
  riskScore: number; // Orders
  deliveryScore: number; // Delivery
};

const DATA_MONTH: Row[] = [
  { month: "Jan", riskScore: 32, deliveryScore: 50 },
  { month: "Feb", riskScore: 39, deliveryScore: 36 },
  { month: "Mar", riskScore: 35, deliveryScore: 44 },
  { month: "Apr", riskScore: 48, deliveryScore: 40 },
  { month: "May", riskScore: 24, deliveryScore: 58 },
  { month: "Jun", riskScore: 60, deliveryScore: 47 },
  { month: "Jul", riskScore: 43, deliveryScore: 35 },
  { month: "Aug", riskScore: 55, deliveryScore: 39 },
  { month: "Sep", riskScore: 70, deliveryScore: 64 },
  { month: "Oct", riskScore: 66, deliveryScore: 58 },
  { month: "Nov", riskScore: 44, deliveryScore: 71 },
  { month: "Dec", riskScore: 59, deliveryScore: 61 },
];

const DATA_YEAR: Row[] = DATA_MONTH.map((d) => ({
  ...d,
  riskScore: Math.min(90, Math.round(d.riskScore * 1.1)),
  deliveryScore: Math.min(90, Math.round(d.deliveryScore * 1.05)),
}));

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
    <div className="rounded-xl border border-gray-200 bg-white shadow-md px-3 py-2">
      <p className="text-[13px] font-semibold text-[#1f2240] mb-1">{label}</p>
      {payload.map((p, idx) => (
        <div key={idx} className="flex items-center gap-2 text-[12px]">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-[#1f2240]">{p.value}</span>
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

  return (
    <section className="h-full rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] tracking-tight">
            Order Status
          </h2>

          <div className="mt-4 flex items-center gap-8 text-[13px] text-gray-500">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-5 rounded-full bg-[#6f5be8]" />
              <span>Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-5 rounded-full bg-[#4f83ff]" />
              <span>Delivery</span>
            </div>
          </div>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="
              h-10 px-4 rounded-xl
              bg-white border border-gray-200/80
              text-[13px] font-medium text-gray-500
              inline-flex items-center gap-2
              hover:bg-gray-50 transition
            "
          >
            {range}
            <span className="text-gray-400">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setRange(opt);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition text-gray-600"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 flex-1 min-h-65">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#ececf1" />
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
              ticks={[5, 22, 39, 56, 73, 90]}
              tickFormatter={(v) => `${v}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* gradient area */}
            <defs>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6f5be8" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#6f5be8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* soft area under delivery line (เหมือนรูป) */}
            <Area
              type="monotone"
              dataKey="deliveryScore"
              name="Delivery"
              stroke="transparent"
              fill="url(#riskFill)"
            />

            {/* lines */}
            <Line
              type="monotone"
              dataKey="riskScore"
              name="Orders"
              stroke="#6f5be8"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="deliveryScore"
              name="Delivery"
              stroke="#4f83ff"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default RiskScoreGraph;