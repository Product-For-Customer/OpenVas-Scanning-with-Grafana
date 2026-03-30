import React, { useEffect, useMemo, useState } from "react";
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
import type { TargetDifferForReportDTO } from "../../../services/report";
import { ListTargetDifferForReport } from "../../../services/report";

type ChartRow = {
  id: string;
  label: string;
  taskName: string;
  host: string;
  latestRisk: number;
  previousRisk: number;
  latestTotal: number;
  previousTotal: number;
  latestTime: number | null;
  previousTime: number | null;
};

const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(num, max));

const formatDateTime = (unix?: number | null) => {
  if (!unix) return "-";

  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(unix * 1000));
};

const shortenText = (value?: string, maxLength = 14) => {
  if (!value) return "-";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div className="min-w-55 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
      <p className="text-[12px] font-semibold text-slate-900">{row.taskName}</p>
      <p className="mt-0.5 text-[10.5px] text-slate-500 break-all">
        Host: {row.host || "-"}
      </p>

      <div className="my-2 h-px bg-slate-200" />

      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Latest Risk</span>
          <span className="font-semibold text-slate-900">
            {row.latestRisk.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Previous Risk</span>
          <span className="font-semibold text-slate-900">
            {row.previousRisk.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Latest Total</span>
          <span className="font-medium text-slate-900">{row.latestTotal}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Previous Total</span>
          <span className="font-medium text-slate-900">{row.previousTotal}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="text-slate-500">Latest Scan</span>
          <span className="max-w-32.5 text-right font-medium text-slate-900">
            {formatDateTime(row.latestTime)}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="text-slate-500">Previous Scan</span>
          <span className="max-w-32.5 text-right font-medium text-slate-900">
            {formatDateTime(row.previousTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

const index: React.FC = () => {
  const [rawData, setRawData] = useState<TargetDifferForReportDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await ListTargetDifferForReport();

        if (!isMounted) return;

        if (Array.isArray(result)) {
          setRawData(result);
        } else {
          setRawData([]);
        }
      } catch (error) {
        console.error("ListTargetDifferForReport error:", error);
        if (isMounted) setRawData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo<ChartRow[]>(() => {
    return [...rawData]
      .map((item, index) => {
        const taskName = item.task_name || "-";
        const host = item.host || "-";
        const label = shortenText(taskName, 14);

        return {
          id: `${taskName}-${host}-${index}`,
          label,
          taskName,
          host,
          latestRisk: clamp(Number(item.latest_risk_score ?? 0), 0, 10),
          previousRisk: clamp(Number(item.previous_risk_score ?? 0), 0, 10),
          latestTotal: Number(item.latest_total ?? 0),
          previousTotal: Number(item.previous_total ?? 0),
          latestTime: item.latest_creation_time ?? null,
          previousTime: item.previous_creation_time ?? null,
        };
      })
      .sort((a, b) => (b.latestTime || 0) - (a.latestTime || 0));
  }, [rawData]);

  const highestLatestRisk = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map((item) => item.latestRisk));
  }, [chartData]);

  const averageLatestRisk = useMemo(() => {
    if (chartData.length === 0) return 0;
    const total = chartData.reduce((sum, item) => sum + item.latestRisk, 0);
    return total / chartData.length;
  }, [chartData]);

  if (loading) {
    return (
      <section className="rounded-[14px] border border-slate-200 bg-white">
        <div className="px-5 py-5 md:px-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-16 animate-pulse rounded-md border border-slate-200 bg-slate-50" />
            <div className="h-16 animate-pulse rounded-md border border-slate-200 bg-slate-50" />
          </div>

          <div className="mt-5 h-65 animate-pulse rounded-md border border-slate-200 bg-slate-50" />
        </div>
      </section>
    );
  }

  if (chartData.length === 0) {
    return (
      <section className="rounded-[14px] border border-slate-200 bg-white">
        <div className="px-5 py-6 md:px-6">
          <h3 className="text-[17px] font-semibold text-slate-900">
            Risk Score Trend
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-slate-600">
            ไม่พบข้อมูลสำหรับแสดงกราฟในรายงานรอบนี้
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[14px] border border-slate-200 bg-white">
      <div className="px-5 py-5 md:px-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-[18px] font-semibold text-slate-900">
            Risk Score Trend
          </h3>
          <p className="mt-2 max-w-4xl text-[13px] leading-6 text-slate-600">
            กราฟนี้เปรียบเทียบค่า Latest Risk และ Previous Risk ของแต่ละเป้าหมาย
            โดยแสดงผลในรูปแบบเรียบง่ายเพื่อให้เหมาะกับรายงาน PDF
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Highest Latest Risk
            </p>
            <p className="mt-1 text-[16px] font-semibold text-slate-900">
              {highestLatestRisk.toFixed(2)}
            </p>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Average Latest Risk
            </p>
            <p className="mt-1 text-[16px] font-semibold text-slate-900">
              {averageLatestRisk.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-full bg-violet-500" />
            <span>Latest Risk</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-full bg-sky-400" />
            <span>Previous Risk</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded-full bg-violet-200" />
            <span>Risk Area</span>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-slate-200 bg-white p-3">
          <div className="h-65 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  interval={0}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="latestRisk"
                  stroke="#c4b5fd"
                  fill="#ede9fe"
                  strokeWidth={1.5}
                  fillOpacity={0.85}
                />

                <Line
                  type="monotone"
                  dataKey="latestRisk"
                  stroke="#8b5cf6"
                  strokeWidth={2.2}
                  dot={{ r: 2.6 }}
                  activeDot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="previousRisk"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 2.4 }}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          หมายเหตุ: ข้อมูลถูกเรียงตามเวลาสแกนล่าสุดจากใหม่ไปเก่า และแกน Y จำกัดช่วงคะแนน 0 ถึง 10
        </p>
      </div>
    </section>
  );
};

export default index;