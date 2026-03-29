import React, { useMemo } from "react";
import type { AssetRiskRow } from "../../../interface/type";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type AssetRiskTableProps = {
  rows: AssetRiskRow[];
};

const getRiskTone = (riskScore: number) => {
  if (riskScore >= 9) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  if (riskScore >= 7) {
    return "bg-orange-50 text-orange-700 border-orange-200";
  }
  if (riskScore >= 4) {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
};

const getRiskColor = (riskScore: number) => {
  if (riskScore >= 9) return "#b91c1c";
  if (riskScore >= 7) return "#c2410c";
  if (riskScore >= 4) return "#ca8a04";
  return "#475569";
};

const getAgingTone = (agingDay: number) => {
  if (agingDay >= 30) {
    return "text-red-600";
  }
  if (agingDay >= 20) {
    return "text-orange-600";
  }
  return "text-slate-600";
};

const AssetRiskTable: React.FC<AssetRiskTableProps> = ({ rows }) => {
  const chartData = useMemo(
    () =>
      rows.map((row) => ({
        name: row.hostIp,
        riskScore: row.riskScore,
        fill: getRiskColor(row.riskScore),
      })),
    [rows]
  );

  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Asset Risk
            </p>
            <h2 className="mt-1 text-[22px] font-semibold text-slate-900">
              High-Risk Assets
            </h2>
            <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-600">
              ตารางและกราฟนี้ใช้ระบุ asset ที่ควรได้รับการจัดลำดับ remediation ก่อน
              โดยพิจารณาจาก risk score, aging และจำนวน findings
            </p>
          </div>

          <div className="rounded-sm border border-slate-300 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Assets
            </p>
            <p className="mt-1 text-[22px] font-bold leading-none text-slate-950">
              {rows.length}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h3 className="text-[14px] font-semibold text-slate-900">
            Risk Score by Host
          </h3>

          <div className="mt-4 h-65">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={38}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="riskScore" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Task
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Host IP
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Detected Date
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Aging
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Findings
                </th>
                <th className="border-b border-slate-200 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Risk Score
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="border-b border-slate-200 px-4 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-slate-900">
                        {row.taskName}
                      </span>
                      <span className="mt-1 text-[12px] text-slate-500">
                        Task ID: {row.taskId}
                      </span>
                    </div>
                  </td>

                  <td className="border-b border-slate-200 px-4 py-4 align-top text-[14px] text-slate-800">
                    {row.hostIp}
                  </td>

                  <td className="border-b border-slate-200 px-4 py-4 align-top text-[14px] text-slate-700">
                    {row.detectedDate}
                  </td>

                  <td className="border-b border-slate-200 px-4 py-4 align-top">
                    <span className={`text-[14px] font-semibold ${getAgingTone(row.agingDay)}`}>
                      {row.agingDay} days
                    </span>
                  </td>

                  <td className="border-b border-slate-200 px-4 py-4 text-right align-top text-[14px] font-semibold text-slate-900">
                    {row.vulnerabilityTotal}
                  </td>

                  <td className="border-b border-slate-200 px-4 py-4 text-right align-top">
                    <span
                      className={`inline-flex rounded-sm border px-3 py-1 text-[13px] font-semibold ${getRiskTone(
                        row.riskScore
                      )}`}
                    >
                      {row.riskScore.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No asset risk data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AssetRiskTable;