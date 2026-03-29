import React, { useMemo } from "react";
import type { ComparisonCard } from "../../../interface/type";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type FindingsComparisonProps = {
  title?: string;
  items: ComparisonCard[];
};

const FindingsComparison: React.FC<FindingsComparisonProps> = ({
  title = "Comparison with Previous Scan",
  items,
}) => {
  const getDiffStyle = (diff: number) => {
    if (diff < 0) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (diff > 0) return "text-rose-700 bg-rose-50 border-rose-200";
    return "text-slate-700 bg-slate-50 border-slate-200";
  };

  const formatDiff = (diff: number) => {
    if (diff > 0) return `+${diff}`;
    return `${diff}`;
  };

  const chartData = useMemo(
    () =>
      items.map((item) => ({
        name: item.title,
        current: Number(item.current || 0),
        previous: Number(item.previous || 0),
      })),
    [items]
  );

  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Trend Comparison
        </p>
        <h3 className="mt-1 text-[22px] font-semibold text-slate-900">
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-6 text-slate-600">
          Change analysis between the latest scan and the previous available
          snapshot.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 md:p-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h4 className="text-[14px] font-semibold text-slate-900">
              Current vs Previous
            </h4>

            <div className="mt-4 h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="previous" name="Previous" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="current" name="Current" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-medium text-slate-500">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[28px] font-bold leading-none text-slate-950">
                      {Number(item.current).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-sm border px-3 py-1 text-[11px] font-semibold ${getDiffStyle(
                      item.diff ?? 0
                    )}`}
                  >
                    {formatDiff(item.diff ?? 0)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Current
                    </p>
                    <p className="mt-1 text-[16px] font-semibold text-slate-900">
                      {Number(item.current).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Previous
                    </p>
                    <p className="mt-1 text-[16px] font-semibold text-slate-900">
                      {Number(item.previous ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindingsComparison;