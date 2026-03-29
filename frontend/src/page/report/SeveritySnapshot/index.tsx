import React, { useMemo } from "react";
import type { SeverityItem } from "../../../interface/type";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type SeveritySnapshotProps = {
  title?: string;
  items: SeverityItem[];
  totalLabel?: string;
};

const SeveritySnapshot: React.FC<SeveritySnapshotProps> = ({
  title = "Severity Snapshot",
  items,
  totalLabel = "Total Findings",
}) => {
  const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0);

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        name: item.name,
        value: Number(item.value || 0),
        color: item.color,
        share:
          total > 0
            ? Number(((Number(item.value) / total) * 100).toFixed(1))
            : 0,
      })),
    [items, total]
  );

  const tooltipFormatter = (
  value: number | string | undefined,
  name: string | undefined
): [string, string] => {
  return [Number(value ?? 0).toLocaleString(), name ?? ""];
};

  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Severity Distribution
            </p>
            <h3 className="mt-1 text-[22px] font-semibold text-slate-900">
              {title}
            </h3>
          </div>

          <div className="rounded-sm border border-slate-300 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {totalLabel}
            </p>
            <p className="mt-1 text-[24px] font-bold leading-none text-slate-950">
              {total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 md:p-6 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h4 className="text-[14px] font-semibold text-slate-900">
              Proportion by Severity
            </h4>

            <div className="mt-4 h-70">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={tooltipFormatter} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 space-y-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-[13px]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">
                    {item.share}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h4 className="text-[14px] font-semibold text-slate-900">
              Findings Count by Severity
            </h4>

            <div className="mt-4 h-70">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={38}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
              <div className="grid grid-cols-[1.1fr_0.8fr_0.6fr] bg-slate-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                <div>Severity</div>
                <div className="text-right">Count</div>
                <div className="text-right">Share</div>
              </div>

              {chartData.map((item, index) => (
                <div
                  key={item.name}
                  className={`grid grid-cols-[1.1fr_0.8fr_0.6fr] items-center px-4 py-3 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[14px] text-slate-800">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-right text-[14px] font-semibold text-slate-900">
                    {item.value.toLocaleString()}
                  </div>

                  <div className="text-right text-[13px] text-slate-600">
                    {item.share}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeveritySnapshot;