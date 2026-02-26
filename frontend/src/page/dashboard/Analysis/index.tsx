import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type SeverityKey = "Critical" | "High" | "Medium" | "Low" | "Info";
type RangeKey = "This Week" | "This Month" | "This Year";

type SeverityItem = {
  name: SeverityKey;
  value: number;
  color: string;
};

const RANGE_OPTIONS: RangeKey[] = ["This Week", "This Month", "This Year"];

/** ✅ ข้อมูลตัวอย่าง (คุณจะเปลี่ยนเป็น data จาก API ได้ทีหลัง) */
const MOCK_DATA: Record<RangeKey, Record<SeverityKey, number>> = {
  "This Week": { Critical: 120, High: 360, Medium: 280, Low: 160, Info: 80 },
  "This Month": { Critical: 420, High: 980, Medium: 760, Low: 540, Info: 260 },
  "This Year": { Critical: 2400, High: 6800, Medium: 5200, Low: 4100, Info: 1900 },
};

const COLORS: Record<SeverityKey, string> = {
  Critical: "#EF4444",
  High: "#7C5CFC",
  Medium: "#60A5FA",
  Low: "#84CC16",
  Info: "#94A3B8",
};

const formatPercent = (percent: number) => `${(percent * 100).toFixed(0)}%`;

/** ✅ เลี่ยง TooltipProps ของ recharts เพื่อไม่ชน version/type */
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
      className="rounded-xl px-4 py-2.5 shadow-lg text-white text-[13px] font-semibold"
      style={{ background: item.color, minWidth: 190 }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate">{item.name}</span>
        <span className="tabular-nums">{item.value.toLocaleString()}</span>
      </div>
      <div className="mt-1 text-[12px] font-medium text-white/90">
        {formatPercent(percent)} of total
      </div>
    </div>
  );
};

const DeliveryAnalysis: React.FC = () => {
  const [range, setRange] = useState<RangeKey>("This Week");
  const [open, setOpen] = useState(false);

  const data = useMemo<SeverityItem[]>(() => {
    const raw = MOCK_DATA[range];
    return (Object.keys(raw) as SeverityKey[]).map((k) => ({
      name: k,
      value: raw[k],
      color: COLORS[k],
    }));
  }, [range]);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
          Delivery Analysis
        </h3>

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
            aria-label="Select range"
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
      <div className="mt-4 sm:mt-5 h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              // ✅ cast เป็น any เพื่อให้เข้ากับ recharts ทุกเวอร์ชัน + ไม่ error TS
              content={(props: any) => <CustomTooltip {...props} total={total} />}
              cursor={false}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="48%"
              outerRadius="78%"
              paddingAngle={0}
              stroke="transparent"
              isAnimationActive={true}
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
          className="
            rounded-2xl bg-white border border-gray-200/80 shadow-sm
            px-4 py-3
            flex flex-wrap items-center justify-center gap-x-6 gap-y-3
          "
        >
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm" style={{ background: item.color }} />
              <span className="text-[13px] font-medium text-[#1f2240]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryAnalysis;