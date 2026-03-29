import React, { useMemo } from "react";
import type { DeviceExposureRow } from "../../../interface/type";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
} from "recharts";

type DeviceExposureProps = {
  rows: DeviceExposureRow[];
};

const getRiskBadge = (riskScore: number) => {
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

const DeviceExposure: React.FC<DeviceExposureProps> = ({ rows }) => {
  const chartData = useMemo(
    () =>
      rows.map((row, index) => ({
        x: row.riskScore,
        y: row.vulnerabilityTotal,
        z: 120 + index * 20,
        name: row.ipAddress,
      })),
    [rows]
  );

  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Device Exposure
            </p>
            <h2 className="mt-1 text-[22px] font-semibold text-slate-900">
              Firmware and Exposure View
            </h2>
            <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-600">
              ใช้ดูความสัมพันธ์ระหว่าง risk score กับจำนวน findings
              ในระดับอุปกรณ์ที่สแกนได้
            </p>
          </div>

          <div className="rounded-sm border border-slate-300 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Devices
            </p>
            <p className="mt-1 text-[22px] font-bold leading-none text-slate-950">
              {rows.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 md:p-6 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="text-[14px] font-semibold text-slate-900">
              Exposure Distribution
            </h3>

            <div className="mt-4 h-75">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Risk Score"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Findings"
                    tick={{ fontSize: 12 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 280]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value: number | string | undefined, name: string | undefined) => [
                      Number(value ?? 0),
                      name ?? "",
                    ]}
                  />
                  <Scatter data={chartData} fill="#0f172a" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7">
          <div className="grid grid-cols-1 gap-4">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-md border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-slate-900">
                      {row.taskName}
                    </p>
                    <p className="mt-1 text-[13px] text-slate-500">
                      {row.ipAddress}
                    </p>

                    <div className="mt-4 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Firmware Version
                      </p>
                      <p className="mt-1 text-[14px] font-medium text-slate-900">
                        {row.firmwareVersion}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:min-w-60">
                    <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Risk Score
                      </p>
                      <p className="mt-1 text-[16px] font-semibold text-slate-900">
                        <span
                          className={`inline-flex rounded-sm border px-2.5 py-1 text-[12px] ${getRiskBadge(
                            row.riskScore
                          )}`}
                        >
                          {row.riskScore.toFixed(2)}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Findings
                      </p>
                      <p className="mt-1 text-[16px] font-semibold text-slate-900">
                        {row.vulnerabilityTotal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {rows.length === 0 && (
              <div className="rounded-md border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
                No device exposure data
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceExposure;