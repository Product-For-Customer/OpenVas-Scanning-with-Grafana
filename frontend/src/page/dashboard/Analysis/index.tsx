import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ListTaskVulnSummary, type TaskVulnSummaryDTO } from "../../../services";

type SeverityKey = "Critical" | "High" | "Medium" | "Low" | "Info";
type RangeKey = "This Week" | "This Month" | "This Year";

type SeverityItem = {
  name: SeverityKey;
  value: number;
  color: string;
};

const RANGE_OPTIONS: RangeKey[] = ["This Week", "This Month", "This Year"];

// ✅ สีให้เหมือน Bar chart เป๊ะ
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

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const subtitle = useMemo(() => {
    if (loading) return "Loading from API...";
    return "Latest snapshot from database";
  }, [loading, range]);

  return (
    <section className="rounded-[22px] bg-white border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
            Vulnerability Analysis
          </h3>
          <p className="mt-1 text-[12.5px] text-gray-500">{subtitle}</p>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="
              h-10 px-4 rounded-xl
              bg-white border border-gray-200/80
              text-[13px] font-medium text-gray-600
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
                  className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition text-gray-700"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 sm:mt-5 h-64 sm:h-72 relative">
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[22px] sm:text-[26px] font-semibold text-[#1f2240] tabular-nums">
              {loading ? "..." : total.toLocaleString()}
            </div>
            <div className="mt-1 text-[12px] text-gray-500">Total findings</div>
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
              innerRadius="55%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="white"
              strokeWidth={2}
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
            rounded-2xl bg-white border border-gray-200/80
            px-4 py-3
            flex flex-wrap items-center justify-center gap-x-6 gap-y-3
          "
        >
          {(["Critical", "High", "Medium", "Low", "Info"] as SeverityKey[]).map((k) => {
            const item = data.find((d) => d.name === k) || {
              name: k,
              value: 0,
              color: COLORS[k],
            };
            const p = total > 0 ? item.value / total : 0;

            return (
              <div key={k} className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-sm" style={{ background: COLORS[k] }} />
                <span className="text-[13px] font-medium text-[#1f2240]">{k}</span>
                <span className="text-[12px] text-gray-500 tabular-nums">
                  {loading ? "..." : item.value.toLocaleString()}
                </span>
                <span className="text-[12px] text-gray-400 tabular-nums">
                  {loading ? "" : `(${formatPercent(p)})`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeliveryAnalysis;