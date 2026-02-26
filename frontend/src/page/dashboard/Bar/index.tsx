import React, { useEffect, useMemo, useState } from "react";
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

import { ListTaskVulnSummary, type TaskVulnSummaryDTO } from "../../../services";

type SeverityRow = {
  name: "Critical" | "High" | "Medium" | "Low" | "Info";
  current: number; // latest scan only
};

const severityColors: Record<SeverityRow["name"], string> = {
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

  return (
    <section className="h-full rounded-[22px] bg-white border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div className="min-w-0">
          <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] tracking-tight">
            Severity activity
          </h2>
          <p className="mt-1 text-[12.5px] text-gray-500">
            {loading
              ? "Loading from API..."
              : `Latest scan snapshot • Total: ${totalAll.toLocaleString()}`}
          </p>
        </div>

        <span
          className="
            shrink-0 rounded-full border border-gray-200 bg-white
            h-9 px-4 inline-flex items-center justify-center
            text-[13px] text-gray-400
          "
        >
          Latest
        </span>
      </div>

      {/* Chart */}
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

            <Bar dataKey="current" name="" radius={[8, 8, 0, 0]} maxBarSize={28}>
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