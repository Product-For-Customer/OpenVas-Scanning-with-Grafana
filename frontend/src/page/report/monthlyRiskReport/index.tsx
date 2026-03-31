import React, { useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
} from "recharts";
import { FiBarChart2, FiCpu, FiShield } from "react-icons/fi";

type MonthlyRiskRow = {
  month: string;
  vulnerabilityCount: number;
  riskScore: number;
};

type Section6MonthlyRiskReportProps = {
  onReady?: (ready: boolean) => void;
};

const currentYear = 2026;
const totalTarget = 5;

const mockData: MonthlyRiskRow[] = [
  { month: "Jan", vulnerabilityCount: 186, riskScore: 9.8 },
  { month: "Feb", vulnerabilityCount: 172, riskScore: 9.2 },
  { month: "Mar", vulnerabilityCount: 161, riskScore: 8.7 },
  { month: "Apr", vulnerabilityCount: 149, riskScore: 8.1 },
  { month: "May", vulnerabilityCount: 137, riskScore: 7.5 },
  { month: "Jun", vulnerabilityCount: 126, riskScore: 6.9 },
  { month: "Jul", vulnerabilityCount: 114, riskScore: 6.2 },
  { month: "Aug", vulnerabilityCount: 101, riskScore: 5.6 },
  { month: "Sep", vulnerabilityCount: 88, riskScore: 4.9 },
  { month: "Oct", vulnerabilityCount: 74, riskScore: 4.1 },
  { month: "Nov", vulnerabilityCount: 59, riskScore: 3.4 },
  { month: "Dec", vulnerabilityCount: 43, riskScore: 2.6 },
];

const formatRiskScore = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toFixed(2);
};

const formatCount = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "0";
  return value.toLocaleString("en-US");
};

const getBarColor = (score: number) => {
  if (score >= 9) return "#dc2626";
  if (score >= 8) return "#ea580c";
  if (score >= 7) return "#f59e0b";
  if (score >= 6) return "#eab308";
  if (score >= 5) return "#84cc16";
  if (score >= 4) return "#22c55e";
  if (score >= 3) return "#14b8a6";
  return "#0ea5e9";
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: MonthlyRiskRow;
    value: number;
  }>;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div className="min-w-52 rounded-md border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
      <p className="text-[12px] font-semibold text-slate-900">
        {row.month} {currentYear}
      </p>

      <div className="mt-2 space-y-1.5 text-[11px]">
        <div>
          <span className="font-medium text-slate-700">Vulnerabilities:</span>{" "}
          <span className="text-slate-600">
            {formatCount(row.vulnerabilityCount)}
          </span>
        </div>

        <div>
          <span className="font-medium text-slate-700">Risk Score:</span>{" "}
          <span className="font-semibold text-slate-900">
            {formatRiskScore(row.riskScore)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Section6MonthlyRiskReport: React.FC<Section6MonthlyRiskReportProps> = ({
  onReady,
}) => {
  useEffect(() => {
    onReady?.(true);
  }, [onReady]);

  const summary = useMemo(() => {
    const highest = Math.max(...mockData.map((item) => item.riskScore));
    const totalVulnerabilities = mockData.reduce(
      (sum, item) => sum + item.vulnerabilityCount,
      0
    );

    return {
      highest,
      totalVulnerabilities,
    };
  }, []);

  return (
    <section
      style={{
        breakInside: "avoid-page",
        pageBreakInside: "avoid",
      }}
    >
      <div className="border border-slate-300 bg-white">
        <div className="border-b border-slate-200 px-3 py-3">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="flex items-start gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
                  <FiCpu className="text-[13px]" />
                </span>

                <div>
                  <p className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Total Target
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-slate-900">
                    {totalTarget}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-rose-200 bg-rose-50 px-3 py-2.5">
              <div className="flex items-start gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-700">
                  <FiBarChart2 className="text-[13px]" />
                </span>

                <div>
                  <p className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-rose-700">
                    Highest Risk
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-slate-900">
                    {formatRiskScore(summary.highest)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-sky-200 bg-sky-50 px-3 py-2.5">
              <div className="flex items-start gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700">
                  <FiShield className="text-[13px]" />
                </span>

                <div>
                  <p className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-sky-700">
                    Total Vulnerabilities
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-slate-900">
                    {formatCount(summary.totalVulnerabilities)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Monthly Risk Score Trend
            </p>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-medium text-slate-600">
              Year {currentYear}
            </span>
          </div>

          <div
            className="h-44 w-full"
            style={{
              breakInside: "avoid-page",
              pageBreakInside: "avoid",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData}
                margin={{ top: 6, right: 8, left: 2, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 9, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 9, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  width={34}
                  tickMargin={6}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="riskScore" radius={[4, 4, 0, 0]} maxBarSize={24}>
                  {mockData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.riskScore)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border-t border-slate-200 px-3 py-3">
          <div
            className="overflow-hidden rounded-md border border-slate-200"
            style={{
              breakInside: "avoid-page",
              pageBreakInside: "avoid",
            }}
          >
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 text-left text-[9px] font-semibold uppercase tracking-widest text-slate-600">
                    Month
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 text-center text-[9px] font-semibold uppercase tracking-widest text-slate-600">
                    Vulnerabilities
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 text-center text-[9px] font-semibold uppercase tracking-widest text-slate-600">
                    Risk Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {mockData.map((row) => (
                  <tr
                    key={row.month}
                    className="odd:bg-white even:bg-slate-50/50"
                  >
                    <td className="border-b border-slate-200 px-3 py-2 text-[10.5px] font-medium text-slate-900">
                      {row.month}
                    </td>
                    <td className="border-b border-slate-200 px-3 py-2 text-center text-[10.5px] text-slate-700">
                      {formatCount(row.vulnerabilityCount)}
                    </td>
                    <td className="border-b border-slate-200 px-3 py-2 text-center text-[10.5px] font-semibold text-slate-900">
                      {formatRiskScore(row.riskScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-2 text-[10px] leading-4.5 text-slate-500">
            Note: This section uses mock monthly data for the current year,
            showing the highest risk score in January and a gradual decline
            toward December.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Section6MonthlyRiskReport;