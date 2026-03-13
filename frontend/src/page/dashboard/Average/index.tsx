import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";
import {
  MdKeyboardArrowDown,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import {
  FiActivity,
  FiAlertCircle,
  FiRefreshCw,
  FiShield,
  FiBarChart2,
} from "react-icons/fi";
import { ListTargetDiffer, type TargetDifferDTO } from "../../../services";

type SortType = "Latest Updated" | "Highest Latest Risk" | "Biggest Change";

type ChartRow = {
  host: string;
  task_name: string;
  asset_label: string;
  latest_task_id: string;
  latest_risk_score: number;
  previous_risk_score: number;
  diff_risk_score: number;
  latest_total: number;
  previous_total: number;
  previous_version_status: string;
  latest_creation_time: number | null;
  previous_creation_time: number | null;
};

const COLORS = {
  previous: "#8B7CFF",
  latestStable: "#39C6F4",
  latestUp: "#FF6B88",
  gridLight: "#E8ECF3",
  gridDark: "rgba(255,255,255,0.10)",
  axisLight: "#667085",
  axisDark: "rgba(255,255,255,0.72)",
  axisSubtleDark: "rgba(255,255,255,0.48)",
  avgLineLight: "#94A3B8",
  avgLineDark: "rgba(255,255,255,0.30)",
};

const formatRisk = (value: number) => Number(value || 0).toFixed(2);

const shortenTaskName = (taskName: string) => {
  if (!taskName) return "-";
  if (taskName.length <= 18) return taskName;
  return `${taskName.slice(0, 18)}...`;
};

const formatUnixThai = (unix?: number | null) => {
  if (!unix) return "-";
  const date = new Date(unix * 1000);
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const isDarkMode = () => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  const diff = item.diff_risk_score ?? 0;
  const isUp = diff > 0;
  const isDown = diff < 0;

  return (
    <div className="min-w-70 max-w-90 rounded-2xl border border-gray-200/90 bg-white/96 px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur dark:border-white/10 dark:bg-[#0B1220]/96 dark:shadow-[0_16px_34px_rgba(0,0,0,0.34)]">
      <div className="mb-2">
        <p className="text-sm font-semibold text-[#1f2240] dark:text-white/92">
          {item.task_name || "Unknown Task"}
        </p>
        <p className="mt-0.5 text-[12px] text-gray-500 dark:text-white/45">
          Host: {item.host || "-"}
        </p>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#8B7CFF]">Previous Risk</span>
          <span className="font-semibold text-[#1f2240] dark:text-white/92">
            {formatRisk(item.previous_risk_score)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className={isUp ? "text-[#FF6B88]" : "text-[#39C6F4]"}>
            Latest Risk
          </span>
          <span className="font-semibold text-[#1f2240] dark:text-white/92">
            {formatRisk(item.latest_risk_score)}
          </span>
        </div>

        <div className="h-px bg-gray-200 dark:bg-white/10" />

        <div className="grid grid-cols-1 gap-1.5">
          <div className="flex items-center justify-between gap-3 text-gray-600 dark:text-white/68">
            <span>Task Name</span>
            <span className="font-medium text-right">{item.task_name || "-"}</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-gray-600 dark:text-white/68">
            <span>Host</span>
            <span className="font-medium text-right">{item.host || "-"}</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-gray-600 dark:text-white/68">
            <span>Latest Total Vulnerability</span>
            <span className="font-semibold text-right text-[#1f2240] dark:text-white/90">
              {item.latest_total ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-gray-600 dark:text-white/68">
            <span>Previous Total Vulnerability</span>
            <span className="font-semibold text-right text-[#1f2240] dark:text-white/90">
              {item.previous_total ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-gray-600 dark:text-white/68">
            <span>Latest Detected Time</span>
            <span className="font-medium text-right">
              {formatUnixThai(item.latest_creation_time)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-gray-600 dark:text-white/68">
            <span>Previous Detected Time</span>
            <span className="font-medium text-right">
              {formatUnixThai(item.previous_creation_time)}
            </span>
          </div>
        </div>

        <div className="pt-1">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-semibold",
              isUp
                ? "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300"
                : isDown
                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-300"
                : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/70",
            ].join(" ")}
          >
            {isUp ? (
              <MdTrendingUp className="text-sm" />
            ) : isDown ? (
              <MdTrendingDown className="text-sm" />
            ) : null}
            Risk Change: {diff > 0 ? "+" : ""}
            {formatRisk(diff)}
          </span>
        </div>
      </div>
    </div>
  );
};

const CustomXAxisTick = (props: {
  x?: number;
  y?: number;
  payload?: { value?: string };
}) => {
  const { x = 0, y = 0, payload } = props;
  const value = String(payload?.value || "");
  const dark = isDarkMode();

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={14}
        textAnchor="middle"
        fill={dark ? COLORS.axisSubtleDark : COLORS.axisLight}
        fontSize={12}
        fontWeight={600}
      >
        {value}
      </text>
    </g>
  );
};

const CustomLegend = () => {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50 px-3 py-1.5 dark:border-violet-400/15 dark:bg-violet-400/10">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8B7CFF]" />
        <span className="text-[13px] font-medium text-violet-700 dark:text-violet-300">
          Previous Risk
        </span>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/70 bg-cyan-50 px-3 py-1.5 dark:border-cyan-400/15 dark:bg-cyan-400/10">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#39C6F4]" />
        <span className="text-[13px] font-medium text-cyan-700 dark:text-cyan-300">
          Latest Risk
        </span>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-rose-50 px-3 py-1.5 dark:border-rose-400/15 dark:bg-rose-400/10">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FF6B88]" />
        <span className="text-[13px] font-medium text-rose-700 dark:text-rose-300">
          Latest Risk Increased
        </span>
      </div>
    </div>
  );
};

const AverageEnrollment: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortType>("Latest Updated");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [rows, setRows] = useState<TargetDifferDTO[]>([]);

  const fetchData = async (mode: "initial" | "refresh" = "initial") => {
    try {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      const res = await ListTargetDiffer();
      setRows(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("fetch target differ error:", error);
      setRows([]);
    } finally {
      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchData("initial");
  }, []);

  const chartData = useMemo<ChartRow[]>(() => {
    const mapped: ChartRow[] = rows.map((item) => ({
      host: item.host || "-",
      task_name: item.task_name || "-",
      asset_label: shortenTaskName(item.task_name || "-"),
      latest_task_id: item.latest_task_id || "-",
      latest_risk_score: Number(item.latest_risk_score ?? 0),
      previous_risk_score: Number(item.previous_risk_score ?? 0),
      diff_risk_score: Number(item.diff_risk_score ?? 0),
      latest_total: Number(item.latest_total ?? 0),
      previous_total: Number(item.previous_total ?? 0),
      previous_version_status: item.previous_version_status || "-",
      latest_creation_time: item.latest_creation_time ?? null,
      previous_creation_time: item.previous_creation_time ?? null,
    }));

    const sorted = [...mapped];

    if (sortBy === "Highest Latest Risk") {
      sorted.sort((a, b) => b.latest_risk_score - a.latest_risk_score);
    } else if (sortBy === "Biggest Change") {
      sorted.sort(
        (a, b) => Math.abs(b.diff_risk_score || 0) - Math.abs(a.diff_risk_score || 0)
      );
    } else {
      sorted.sort(
        (a, b) => (b.latest_creation_time || 0) - (a.latest_creation_time || 0)
      );
    }

    return sorted.slice(0, 12);
  }, [rows, sortBy]);

  const summary = useMemo(() => {
    const totalAssets = rows.length;
    const avgLatestRisk =
      totalAssets > 0
        ? rows.reduce((sum, item) => sum + Number(item.latest_risk_score || 0), 0) /
          totalAssets
        : 0;

    const increasedCount = rows.filter(
      (item) => Number(item.diff_risk_score || 0) > 0
    ).length;

    const decreasedCount = rows.filter(
      (item) => Number(item.diff_risk_score || 0) < 0
    ).length;

    return {
      totalAssets,
      avgLatestRisk,
      increasedCount,
      decreasedCount,
    };
  }, [rows]);

  const maxRisk = useMemo(() => {
    const values = chartData.flatMap((item) => [
      item.latest_risk_score || 0,
      item.previous_risk_score || 0,
    ]);
    const rawMax = Math.max(...values, 0);
    return Math.max(6, Math.ceil(rawMax + 1));
  }, [chartData]);

  const yTicks = useMemo(() => {
    const step = maxRisk <= 6 ? 1 : Math.ceil(maxRisk / 5);
    const ticks: number[] = [];
    for (let i = 0; i <= maxRisk; i += step) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] !== maxRisk) ticks.push(maxRisk);
    return ticks;
  }, [maxRisk]);

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[26px] p-4 sm:p-5 md:p-6 h-full w-full flex flex-col",
        "bg-white border border-gray-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)]",
        "dark:bg-[#081120] dark:border-white/10 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
        <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 via-sky-500 to-violet-500 text-white shadow-sm">
                <FiBarChart2 className="text-[18px]" />
              </div>

              <div>
                <h2 className="text-[20px] font-semibold tracking-tight text-[#1f2240] dark:text-white/92 sm:text-[22px]">
                  Target Risk Comparison
                </h2>
                <p className="text-[13px] text-gray-500 dark:text-white/55 sm:text-[14px]">
                  เปรียบเทียบ Previous Risk Score กับ Latest Risk Score ของแต่ละ target โดยใช้ Task Name เป็นแกนหลัก
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className={[
                  "appearance-none h-11 rounded-2xl px-4 pr-10 text-[14px] sm:text-[15px] outline-none transition w-full sm:w-auto",
                  "border border-gray-200 bg-white text-gray-700 hover:bg-[#fafcff]",
                  "dark:border-white/10 dark:bg-white/6 dark:text-white/80 dark:hover:bg-white/10",
                ].join(" ")}
                aria-label="Sort target differ"
              >
                <option>Latest Updated</option>
                <option>Highest Latest Risk</option>
                <option>Biggest Change</option>
              </select>
              <MdKeyboardArrowDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 dark:text-white/45" />
            </div>

            <button
              type="button"
              onClick={() => void fetchData("refresh")}
              disabled={refreshing}
              className={[
                "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-[14px] font-semibold transition-all",
                "border border-gray-200 bg-white text-[#3a3d4f] hover:bg-[#fafcff]",
                "dark:border-white/10 dark:bg-white/6 dark:text-white/80 dark:hover:bg-white/10",
                refreshing ? "cursor-not-allowed opacity-70" : "",
              ].join(" ")}
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200/80 bg-linear-to-br from-white to-slate-50 p-4 dark:border-white/10 dark:bg-linear-to-br dark:from-white/8 dark:to-white/4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 dark:text-white/38">
              Targets
            </p>
            <p className="mt-1 text-[22px] font-semibold text-[#1f2240] dark:text-white/92">
              {summary.totalAssets}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-linear-to-br from-white to-cyan-50/40 p-4 dark:border-white/10 dark:bg-linear-to-br dark:from-cyan-400/10 dark:to-sky-500/5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 dark:text-white/38">
              Avg Latest Risk
            </p>
            <p className="mt-1 text-[22px] font-semibold text-[#1f2240] dark:text-white/92">
              {formatRisk(summary.avgLatestRisk)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-linear-to-br from-white to-rose-50/40 p-4 dark:border-white/10 dark:bg-linear-to-br dark:from-rose-400/10 dark:to-rose-500/5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 dark:text-white/38">
              Risk Increased
            </p>
            <p className="mt-1 text-[22px] font-semibold text-rose-600 dark:text-rose-300">
              {summary.increasedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-linear-to-br from-white to-sky-50/40 p-4 dark:border-white/10 dark:bg-linear-to-br dark:from-cyan-400/10 dark:to-cyan-500/5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 dark:text-white/38">
              Risk Decreased
            </p>
            <p className="mt-1 text-[22px] font-semibold text-cyan-600 dark:text-cyan-300">
              {summary.decreasedCount}
            </p>
          </div>
        </div>

        <CustomLegend />

        <div
          className={[
            "rounded-3xl border p-3 sm:p-4",
            "border-gray-200/70 bg-linear-to-b from-[#fcfdff] to-[#f7faff]",
            "dark:border-white/10 dark:bg-linear-to-b dark:from-[#0B1220] dark:to-[#0E1830]",
          ].join(" ")}
        >
          <div className="h-90 sm:h-105 lg:h-115">
            {loading ? (
              <div className="grid h-full w-full place-items-center rounded-2xl border border-dashed border-gray-200 bg-white/50 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3 text-gray-500 dark:text-white/60">
                  <FiRefreshCw className="animate-spin text-lg" />
                  <span className="text-sm font-medium">Loading target differ data...</span>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="grid h-full w-full place-items-center rounded-2xl border border-dashed border-gray-200 bg-white/50 dark:border-white/10 dark:bg-white/5">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
                    <FiAlertCircle className="text-[22px]" />
                  </div>
                  <p className="text-sm font-semibold text-[#1f2240] dark:text-white/92">
                    No target differ data
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-white/50">
                    ยังไม่มีข้อมูลเปรียบเทียบ latest / previous
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 18, right: 12, left: -10, bottom: 10 }}
                  barCategoryGap="16%"
                  barGap={4}
                >
                  <CartesianGrid
                    stroke={isDarkMode() ? COLORS.gridDark : COLORS.gridLight}
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="asset_label"
                    tick={<CustomXAxisTick />}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={50}
                  />

                  <YAxis
                    tick={{
                      fill: isDarkMode() ? COLORS.axisDark : COLORS.axisLight,
                      fontSize: 13,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                    domain={[0, maxRisk]}
                    ticks={yTicks}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: isDarkMode()
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(148,163,184,0.08)",
                    }}
                  />

                  <ReferenceLine
                    y={Number(summary.avgLatestRisk.toFixed(2))}
                    stroke={isDarkMode() ? COLORS.avgLineDark : COLORS.avgLineLight}
                    strokeDasharray="5 5"
                    ifOverflow="extendDomain"
                  />

                  <Bar
                    dataKey="previous_risk_score"
                    name="Previous Risk Score"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={36}
                  >
                    <LabelList
                      dataKey="previous_risk_score"
                      position="top"
                      formatter={(value) => formatRisk(Number(value ?? 0))}
                      style={{
                        fill: isDarkMode() ? "rgba(255,255,255,0.70)" : "#6B7280",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                    {chartData.map((_, index) => (
                      <Cell key={`prev-${index}`} fill={COLORS.previous} />
                    ))}
                  </Bar>

                  <Bar
                    dataKey="latest_risk_score"
                    name="Latest Risk Score"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={36}
                  >
                    <LabelList
                      dataKey="latest_risk_score"
                      position="top"
                      formatter={(value) => formatRisk(Number(value ?? 0))}
                      style={{
                        fill: isDarkMode() ? "rgba(255,255,255,0.88)" : "#475467",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    />
                    {chartData.map((row, index) => {
                      const diff = row.diff_risk_score ?? 0;
                      const color = diff > 0 ? COLORS.latestUp : COLORS.latestStable;
                      return <Cell key={`latest-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-gray-500 dark:text-white/50">
          <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/6">
            <FiActivity />
            X = Task Name
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/6">
            <FiShield />
            Y = Average Severity (Risk Score)
          </div>
        </div>
      </div>
    </section>
  );
};

export default AverageEnrollment;