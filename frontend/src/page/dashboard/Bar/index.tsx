import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

type SeverityRow = {
  name: "Critical" | "High" | "Medium" | "Low" | "Info";
  current: number;
  previous: number;
};

const data: SeverityRow[] = [
  { name: "Critical", current: 12, previous: 8 },
  { name: "High", current: 26, previous: 18 },
  { name: "Medium", current: 34, previous: 27 },
  { name: "Low", current: 22, previous: 30 },
  { name: "Info", current: 16, previous: 12 },
];

const severityColors: Record<SeverityRow["name"], string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
  Info: "#3b82f6",
};

const previousBarColor = "#cbd5e1";

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

      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-[12px]">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-500">{item.name}:</span>
          <span className="font-semibold text-[#1f2240]">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const BarSeverityChart: React.FC = () => {
  return (
    // ✅ เพิ่ม h-full + ทำเป็น flex column เพื่อให้กราฟกินพื้นที่ที่เหลือ
    <section className="h-full rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] tracking-tight">
          Severity activity
        </h2>

        <span
          className="
            shrink-0 rounded-full border border-gray-200 bg-white
            h-9 px-4 inline-flex items-center justify-center
            text-[13px] text-gray-400
          "
        >
          30 Days
        </span>
      </div>

      {/* ✅ Chart: จากเดิม h-85/h-95 -> ใช้ flex-1 เพื่อให้สูงเท่ากล่องอื่น */}
      <div className="flex-1 min-h-65">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 10, left: 0, bottom: 18 }}
            barCategoryGap="28%"
          >
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#ececf1" />

            <XAxis
              dataKey="name"
              tick={{ fill: "#5b6170", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              height={55}
            />

            <YAxis
              tick={{ fill: "#5b6170", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={42}
              domain={[0, "dataMax + 6"]}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="left"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: 14,
                fontSize: "13px",
                color: "#4b5563",
              }}
              formatter={(value) => <span style={{ color: "#4b5563" }}>{value}</span>}
            />

            <Bar
              dataKey="previous"
              name="Previous Scan"
              radius={[8, 8, 0, 0]}
              maxBarSize={26}
              fill={previousBarColor}
            />

            <Bar
              dataKey="current"
              name="Current Scan"
              radius={[8, 8, 0, 0]}
              maxBarSize={26}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={severityColors[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default BarSeverityChart;