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
import {
  FiShield,
  FiRadio,
  FiActivity,
  FiChevronDown,
  FiCalendar,
} from "react-icons/fi";

type RangeKey =
  | "Today"
  | "This Week"
  | "This Month"
  | "This Year"
  | "Custom Range";

const RANGE_OPTIONS: RangeKey[] = [
  "Today",
  "This Week",
  "This Month",
  "This Year",
  "Custom Range",
];

type Row = {
  label: string;
  riskScore: number;
  threatLevel: number;
  date: string; // YYYY-MM-DD
};

/** =========================
 * Utils
 * ========================= */
const pad2 = (n: number) => String(n).padStart(2, "0");

const formatDateToYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
};

const formatHourLabel = (hour: number) => `${pad2(hour)}:00`;

const getStartOfWeek = (date: Date) => {
  const copied = new Date(date);
  const day = copied.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day; // start Monday
  copied.setDate(copied.getDate() + diff);
  copied.setHours(0, 0, 0, 0);
  return copied;
};

const addDays = (date: Date, days: number) => {
  const copied = new Date(date);
  copied.setDate(copied.getDate() + days);
  return copied;
};

const addMonths = (date: Date, months: number) => {
  const copied = new Date(date);
  copied.setMonth(copied.getMonth() + months);
  return copied;
};

const formatDisplayDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(num, max));

/** =========================
 * Mock data generators
 * ========================= */

// Today (24 hours)
const generateDayData = (): Row[] => {
  const today = new Date();
  const ymd = formatDateToYMD(today);

  return Array.from({ length: 24 }, (_, hour) => {
    const baseRisk = 22 + Math.sin(hour / 2.1) * 12 + (hour > 14 ? 10 : 0);
    const baseThreat = 30 + Math.cos(hour / 2.5) * 11 + (hour > 13 ? 14 : 0);

    return {
      label: formatHourLabel(hour),
      riskScore: Math.round(clamp(baseRisk, 10, 90)),
      threatLevel: Math.round(clamp(baseThreat, 12, 90)),
      date: ymd,
    };
  });
};

// This Week (7 days)
const generateWeekData = (): Row[] => {
  const start = getStartOfWeek(new Date());
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return Array.from({ length: 7 }, (_, index) => {
    const current = addDays(start, index);
    const risk =
      34 + index * 3 + (index === 4 ? 10 : 0) - (index === 5 ? 5 : 0);
    const threat =
      40 + index * 2 + (index === 4 ? 12 : 0) - (index === 5 ? 3 : 0);

    return {
      label: weekLabels[index],
      riskScore: Math.round(clamp(risk, 10, 90)),
      threatLevel: Math.round(clamp(threat, 10, 90)),
      date: formatDateToYMD(current),
    };
  });
};

// This Month (12 months)
const generateMonthData = (): Row[] => {
  const currentYear = new Date().getFullYear();

  const months = [
    { label: "Jan", riskScore: 32, threatLevel: 50 },
    { label: "Feb", riskScore: 39, threatLevel: 36 },
    { label: "Mar", riskScore: 35, threatLevel: 44 },
    { label: "Apr", riskScore: 48, threatLevel: 40 },
    { label: "May", riskScore: 24, threatLevel: 58 },
    { label: "Jun", riskScore: 60, threatLevel: 47 },
    { label: "Jul", riskScore: 43, threatLevel: 35 },
    { label: "Aug", riskScore: 55, threatLevel: 39 },
    { label: "Sep", riskScore: 70, threatLevel: 64 },
    { label: "Oct", riskScore: 66, threatLevel: 58 },
    { label: "Nov", riskScore: 44, threatLevel: 71 },
    { label: "Dec", riskScore: 59, threatLevel: 61 },
  ];

  return months.map((item, index) => ({
    label: item.label,
    riskScore: item.riskScore,
    threatLevel: item.threatLevel,
    date: `${currentYear}-${pad2(index + 1)}-01`,
  }));
};

// This Year (heavier trend)
const generateYearData = (): Row[] => {
  return generateMonthData().map((d) => ({
    ...d,
    riskScore: Math.min(90, Math.round(d.riskScore * 1.12)),
    threatLevel: Math.min(90, Math.round(d.threatLevel * 1.06)),
  }));
};

// Custom Range (daily rows)
const generateCustomRangeData = (startDate: string, endDate: string): Row[] => {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  if (start > end) return [];

  const rows: Row[] = [];
  const cursor = new Date(start);
  let dayIndex = 0;

  while (cursor <= end) {
    const risk =
      28 +
      Math.sin(dayIndex / 1.8) * 14 +
      (dayIndex % 5 === 0 ? 9 : 0) +
      (dayIndex % 7 === 3 ? 6 : 0);

    const threat =
      34 +
      Math.cos(dayIndex / 2.2) * 13 +
      (dayIndex % 4 === 0 ? 8 : 0) +
      (dayIndex % 6 === 2 ? 7 : 0);

    rows.push({
      label: formatDisplayDate(formatDateToYMD(cursor)),
      riskScore: Math.round(clamp(risk, 10, 90)),
      threatLevel: Math.round(clamp(threat, 10, 90)),
      date: formatDateToYMD(cursor),
    });

    cursor.setDate(cursor.getDate() + 1);
    dayIndex += 1;
  }

  return rows;
};

/** =========================
 * Tooltip
 * ========================= */
type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) return null;

  const rowDate = payload?.[0]?.payload?.date;

  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 bg-white shadow-md px-3.5 py-2.5",
        "dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none",
      ].join(" ")}
    >
      <p className="text-[13px] font-semibold text-[#1f2240] dark:text-white/90 mb-1">
        {label}
      </p>

      {rowDate && (
        <p className="mb-2 text-[11px] text-gray-500 dark:text-white/50">
          {rowDate}
        </p>
      )}

      {payload.map((p, idx) => (
        <div key={idx} className="flex items-center gap-2 text-[12px]">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-gray-500 dark:text-white/55">{p.name}:</span>
          <span className="font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/** =========================
 * Responsive helper
 * ========================= */
const useIsSmall = () => {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsSmall(mq.matches);
    onChange();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return isSmall;
};

const RiskScoreGraph: React.FC = () => {
  const [range, setRange] = useState<RangeKey>("This Month");
  const [open, setOpen] = useState(false);
  const isSmall = useIsSmall();

  // default custom range = last 7 days
  const todayYMD = useMemo(() => formatDateToYMD(new Date()), []);
  const sevenDaysAgoYMD = useMemo(
    () => formatDateToYMD(addDays(new Date(), -6)),
    []
  );

  const [startDate, setStartDate] = useState<string>(sevenDaysAgoYMD);
  const [endDate, setEndDate] = useState<string>(todayYMD);

  const data = useMemo<Row[]>(() => {
    switch (range) {
      case "Today":
        return generateDayData();
      case "This Week":
        return generateWeekData();
      case "This Month":
        return generateMonthData();
      case "This Year":
        return generateYearData();
      case "Custom Range":
        return generateCustomRangeData(startDate, endDate);
      default:
        return generateMonthData();
    }
  }, [range, startDate, endDate]);

  const peakRisk = useMemo(() => {
    if (!data.length) return null;
    return data.reduce((max, item) =>
      item.riskScore > max.riskScore ? item : max
    );
  }, [data]);

  const xInterval = useMemo(() => {
    const n = data.length;

    if (range === "Today") return isSmall ? 5 : 1;
    if (range === "This Week") return 0;
    if (range === "This Month" || range === "This Year") return isSmall ? 1 : 0;

    if (range === "Custom Range") {
      if (n <= 7) return 0;
      if (n <= 14) return isSmall ? 1 : 0;
      if (n <= 31) return isSmall ? 3 : 1;
      if (n <= 60) return isSmall ? 5 : 2;
      return isSmall ? 8 : 4;
    }

    return 0;
  }, [data.length, isSmall, range]);

  const customRangeError = useMemo(() => {
    if (range !== "Custom Range") return "";
    if (!startDate || !endDate) return "กรุณาเลือก Start Date และ End Date";
    if (startDate > endDate) return "Start Date ต้องไม่มากกว่า End Date";
    return "";
  }, [range, startDate, endDate]);

  const rangeDescription = useMemo(() => {
    switch (range) {
      case "Today":
        return "Filled area shows hourly threat intensity today";
      case "This Week":
        return "Filled area shows daily threat intensity this week";
      case "This Month":
        return "Filled area shows monthly threat intensity";
      case "This Year":
        return "Filled area shows yearly threat overview";
      case "Custom Range":
        return "Filled area shows threat intensity within selected date range";
      default:
        return "Filled area shows threat intensity over time";
    }
  }, [range]);

  return (
    <section
      className={[
        "relative overflow-hidden h-full rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-14 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-14 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                    "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                  ].join(" ")}
                >
                  <FiShield className="text-[13px]" />
                  <span className="text-[12px] font-semibold tracking-wide">
                    Risk Analytics
                  </span>
                </div>

                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-slate-50 text-slate-600 border border-slate-200/80",
                    "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                  ].join(" ")}
                >
                  <FiRadio className="text-[12px] text-cyan-500" />
                  <span className="text-[12px] font-medium">Live risk trend</span>
                </div>

                {peakRisk && (
                  <div
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                      "bg-slate-50 text-slate-600 border border-slate-200/80",
                      "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                    ].join(" ")}
                  >
                    <FiActivity className="text-[12px] text-violet-500" />
                    <span className="text-[12px] font-medium">
                      Peak Risk {peakRisk.label}: {peakRisk.riskScore}
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
                Risk Score Trend
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px] text-gray-500 dark:text-white/55">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-5 rounded-full bg-[#8b5cf6]" />
                  <span>Asset Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-5 rounded-full bg-[#38bdf8]" />
                  <span>Threat Level</span>
                </div>
              </div>
            </div>

            {/* ✅ Right controls (ชิดขวาสุดเหมือนตัวอื่น) */}
            <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[320px]">
              {/* Dropdown (ชิดขวาสุด) */}
              <div className="relative self-end">
                <button
                  type="button"
                  onClick={() => setOpen((s) => !s)}
                  className={[
                    "h-10 px-4 rounded-2xl inline-flex items-center gap-2 transition select-none whitespace-nowrap",
                    "bg-white border border-gray-200/80 text-[13px] font-medium text-gray-500 hover:bg-gray-50",
                    "dark:bg-white/5 dark:border-white/10 dark:text-white/65 dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  {range}
                  <FiChevronDown
                    className={[
                      "text-gray-400 dark:text-white/45 transition",
                      open ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden z-30 dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                    {RANGE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setRange(opt);
                          setOpen(false);
                        }}
                        className={[
                          "w-full text-left px-4 py-2.5 text-[13px] transition",
                          range === opt
                            ? "bg-cyan-50 text-cyan-700 font-semibold dark:bg-cyan-500/10 dark:text-cyan-300"
                            : "text-gray-600 hover:bg-gray-50 dark:text-white/70 dark:hover:bg-white/8",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ✅ Custom date range panel (ชิดขวาสุด) */}
              {range === "Custom Range" && (
                <div className="flex justify-end">
                  <div
                    className={[
                      "w-full lg:w-130 rounded-2xl border p-3 sm:p-4",
                      "bg-slate-50 border-slate-200/80",
                      "dark:bg-white/4 dark:border-white/10",
                    ].join(" ")}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <FiCalendar className="text-[14px] text-cyan-600 dark:text-cyan-300" />
                      <span className="text-[13px] font-semibold text-slate-700 dark:text-white/85">
                        Select Date Range
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="min-w-0">
                        <label className="mb-1.5 block text-[12px] font-medium text-slate-600 dark:text-white/60">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          max={endDate || undefined}
                          onChange={(e) => setStartDate(e.target.value)}
                          className={[
                            "w-full h-11 rounded-2xl px-3 outline-none transition",
                            "border border-gray-200 bg-white text-[13px] text-slate-700",
                            "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100",
                            "dark:bg-[#0B1220] dark:border-white/10 dark:text-white/85 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/10",
                          ].join(" ")}
                        />
                      </div>

                      <div className="min-w-0">
                        <label className="mb-1.5 block text-[12px] font-medium text-slate-600 dark:text-white/60">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          min={startDate || undefined}
                          onChange={(e) => setEndDate(e.target.value)}
                          className={[
                            "w-full h-11 rounded-2xl px-3 outline-none transition",
                            "border border-gray-200 bg-white text-[13px] text-slate-700",
                            "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100",
                            "dark:bg-[#0B1220] dark:border-white/10 dark:text-white/85 dark:focus:border-cyan-400 dark:focus:ring-cyan-500/10",
                          ].join(" ")}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const end = new Date();
                          const start = addDays(end, -6);
                          setStartDate(formatDateToYMD(start));
                          setEndDate(formatDateToYMD(end));
                        }}
                        className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[12px] font-medium text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-500/15"
                      >
                        Last 7 Days
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const end = new Date();
                          const start = addDays(end, -29);
                          setStartDate(formatDateToYMD(start));
                          setEndDate(formatDateToYMD(end));
                        }}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                      >
                        Last 30 Days
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const end = new Date();
                          const start = addMonths(end, -3);
                          setStartDate(formatDateToYMD(start));
                          setEndDate(formatDateToYMD(end));
                        }}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                      >
                        Last 3 Months
                      </button>
                    </div>

                    {customRangeError && (
                      <p className="mt-3 text-[12px] font-medium text-red-500">
                        {customRangeError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* status bar */}
          <div
            className={[
              "rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3",
              "bg-slate-50 border border-slate-200/80",
              "dark:bg-white/4 dark:border-white/10",
            ].join(" ")}
          >
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
              </span>
              <span className="text-[12px] font-medium text-slate-700 dark:text-white/75">
                Monitoring risk behavior
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-white/10" />

            <div className="text-[12px] text-slate-500 dark:text-white/50">
              {rangeDescription}
            </div>
          </div>
        </div>

        {/* ✅ FIX mobile graph height (สำคัญมาก) */}
        <div className="mt-4 h-65 sm:h-80 lg:flex-1 lg:min-h-85">
          {!customRangeError && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="6 6"
                  vertical={false}
                  stroke="#ececf1"
                  className="dark:opacity-30"
                />

                <XAxis
                  dataKey="label"
                  interval={xInterval}
                  minTickGap={10}
                  tick={{ fill: "#5b6170", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#5b6170", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  domain={[0, 90]}
                  ticks={[10, 25, 40, 55, 70, 85]}
                />

                <Tooltip content={<CustomTooltip />} />

                <defs>
                  <linearGradient id="threatFillLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.28} />
                    <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="threatFillDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.34} />
                    <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.14} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* area */}
                <Area
                  type="monotone"
                  dataKey="threatLevel"
                  name="Threat Level"
                  stroke="transparent"
                  fill="url(#threatFillLight)"
                  className="dark:hidden"
                />
                <Area
                  type="monotone"
                  dataKey="threatLevel"
                  name="Threat Level"
                  stroke="transparent"
                  fill="url(#threatFillDark)"
                  className="hidden dark:block"
                />

                {/* lines */}
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  name="Asset Risk"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="threatLevel"
                  name="Threat Level"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div
              className={[
                "h-full rounded-2xl border flex items-center justify-center text-center px-4",
                "border-dashed border-gray-200 bg-slate-50",
                "dark:border-white/10 dark:bg-white/4",
              ].join(" ")}
            >
              <div>
                <p className="text-[14px] font-semibold text-slate-700 dark:text-white/85">
                  ไม่มีข้อมูลสำหรับช่วงวันที่ที่เลือก
                </p>
                <p className="mt-1 text-[12px] text-slate-500 dark:text-white/50">
                  {customRangeError || "กรุณาเลือกช่วงวันที่ใหม่อีกครั้ง"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* click-outside overlay */}
        {open && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 cursor-default"
            aria-label="Close dropdown"
          />
        )}
      </div>
    </section>
  );
};

export default RiskScoreGraph;