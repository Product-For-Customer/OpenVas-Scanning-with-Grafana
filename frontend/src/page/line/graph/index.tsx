import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  FiActivity,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiSlash,
  FiRotateCw,
  FiAlertTriangle,
  FiBell,
  FiLock,
  FiServer,
} from "react-icons/fi";
import {
  ListHistoryNotify,
  type HistoryNotifyResponse,
} from "../../../services";

type StatusKey =
  | "Update Completed"
  | "No Update"
  | "Already Running"
  | "Update Failed"
  | "Status Notification"
  | "Unauthorized"
  | "Server Error"
  | "Timeout";

const normalizeText = (value?: string | null) => (value || "").trim();

const normalizeStatus = (status?: string | null): StatusKey => {
  const normalized = normalizeText(status).toLowerCase();

  if (normalized === "update completed") return "Update Completed";
  if (normalized === "no update") return "No Update";
  if (normalized === "already running") return "Already Running";
  if (normalized === "update failed") return "Update Failed";
  if (normalized === "status notification") return "Status Notification";
  if (normalized === "unauthorized") return "Unauthorized";
  if (normalized === "server error") return "Server Error";
  if (normalized === "timeout") return "Timeout";

  if (normalized === "update") return "Update Completed";
  if (normalized === "alert") return "Status Notification";
  if (normalized === "failed") return "Update Failed";
  if (normalized === "completed") return "Update Completed";
  if (normalized === "running") return "Already Running";

  return "Status Notification";
};

const cardClass = [
  "relative h-full overflow-hidden rounded-[22px] p-3 sm:p-4 md:p-4.5",
  "bg-white border border-gray-200/80 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.20)]",
  "dark:bg-[#08111f]/95 dark:border-white/10 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-none",
  "flex flex-col",
].join(" ");

const panelClass = [
  "overflow-hidden rounded-[22px] border border-gray-200/80 bg-white/90",
  "dark:border-white/10 dark:bg-white/[0.03]",
  "flex-1 flex flex-col",
].join(" ");

const STATUS_META = {
  completed: {
    label: "Completed",
    icon: <FiCheckCircle className="text-[11px]" />,
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200",
  },
  noUpdate: {
    label: "No Update",
    icon: <FiSlash className="text-[11px]" />,
    badge:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-400/20 dark:bg-slate-500/10 dark:text-slate-200",
  },
  running: {
    label: "Running",
    icon: <FiRotateCw className="text-[11px]" />,
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200",
  },
  failed: {
    label: "Failed",
    icon: <FiAlertTriangle className="text-[11px]" />,
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200",
  },
  notification: {
    label: "Notification",
    icon: <FiBell className="text-[11px]" />,
    badge:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200",
  },
  unauthorized: {
    label: "Unauthorized",
    icon: <FiLock className="text-[11px]" />,
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200",
  },
  serverError: {
    label: "Server Error",
    icon: <FiServer className="text-[11px]" />,
    badge:
      "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-400/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-200",
  },
  timeout: {
    label: "Timeout",
    icon: <FiAlertCircle className="text-[11px]" />,
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-200",
  },
};

const Index: React.FC = () => {
  const [items, setItems] = useState<HistoryNotifyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadHistoryNotify = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await ListHistoryNotify();

      if (Array.isArray(res)) {
        setItems(res);
      } else {
        setItems([]);
        setError("Unable to load notification history.");
      }
    } catch (err) {
      console.error("loadHistoryNotify error:", err);
      setItems([]);
      setError("Unable to load notification history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistoryNotify();
  }, []);

  const summaryCount = useMemo(() => {
    const completed = items.filter(
      (item) => normalizeStatus(item.status) === "Update Completed"
    ).length;

    const noUpdate = items.filter(
      (item) => normalizeStatus(item.status) === "No Update"
    ).length;

    const running = items.filter(
      (item) => normalizeStatus(item.status) === "Already Running"
    ).length;

    const failed = items.filter(
      (item) => normalizeStatus(item.status) === "Update Failed"
    ).length;

    const notification = items.filter(
      (item) => normalizeStatus(item.status) === "Status Notification"
    ).length;

    const unauthorized = items.filter(
      (item) => normalizeStatus(item.status) === "Unauthorized"
    ).length;

    const serverError = items.filter(
      (item) => normalizeStatus(item.status) === "Server Error"
    ).length;

    const timeout = items.filter(
      (item) => normalizeStatus(item.status) === "Timeout"
    ).length;

    return {
      completed,
      noUpdate,
      running,
      failed,
      notification,
      unauthorized,
      serverError,
      timeout,
    };
  }, [items]);

  const chartSeries = useMemo(() => {
    return [
      {
        name: "History Notify",
        data: [
          summaryCount.completed,
          summaryCount.noUpdate,
          summaryCount.running,
          summaryCount.failed,
          summaryCount.notification,
          summaryCount.unauthorized,
          summaryCount.serverError,
          summaryCount.timeout,
        ],
      },
    ];
  }, [summaryCount]);

  const chartMax = useMemo(() => {
    const maxValue = Math.max(...chartSeries[0].data, 0);
    if (maxValue <= 5) return 5;
    if (maxValue <= 10) return 10;
    if (maxValue <= 20) return 20;
    if (maxValue <= 50) return 50;
    if (maxValue <= 100) return 100;
    return Math.ceil(maxValue / 20) * 20;
  }, [chartSeries]);

  const chartOptions: ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "radar",
        toolbar: { show: false },
        background: "transparent",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 700,
        },
      },
      title: {
        text: "Status Distribution Radar",
        align: "left",
        style: {
          fontSize: "13px",
          fontWeight: 700,
          color: "#0f172a",
        },
      },
      xaxis: {
        categories: [
          "Completed",
          "No Update",
          "Running",
          "Failed",
          "Notification",
          "Unauthorized",
          "Server Error",
          "Timeout",
        ],
        labels: {
          style: {
            colors: [
              "#475569",
              "#475569",
              "#475569",
              "#475569",
              "#475569",
              "#475569",
              "#475569",
              "#475569",
            ],
            fontSize: "10px",
            fontWeight: 500,
          },
        },
      },
      yaxis: {
        min: 0,
        max: chartMax,
        tickAmount: 5,
        labels: {
          formatter: (val: number, index?: number) => {
            if (typeof index === "number" && index % 2 === 0) {
              return String(Math.round(val));
            }
            return "";
          },
          style: {
            colors: ["#64748b"],
            fontSize: "10px",
          },
        },
      },
      stroke: {
        width: 2.25,
        curve: "smooth",
      },
      fill: {
        opacity: 0.22,
      },
      colors: ["#fb7185"],
      markers: {
        size: 4,
        colors: ["#ffffff"],
        strokeColor: "#fb4d67",
        strokeWidth: 2.25,
        hover: {
          size: 5,
        },
      },
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          borderRadius: 4,
          padding: 3,
          foreColor: "#ffffff",
          borderWidth: 0,
          opacity: 0.95,
        },
        style: {
          fontSize: "10px",
          fontWeight: 700,
          colors: ["#ffffff"],
        },
        formatter: (value: number) => String(value),
        offsetY: -2,
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: "#e5e7eb",
            connectorColors: "#e5e7eb",
            fill: {
              colors: ["#fafafa", "#f5f5f5"],
            },
          },
        },
      },
      legend: {
        show: false,
      },
    };
  }, [chartMax]);

  return (
    <section className={cardClass}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-14 right-6 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "26px 26px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-[10.5px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
              <FiActivity className="text-[11px]" />
              History Notify Radar
            </div>

            <h2 className="mt-2.5 text-[18px] font-semibold tracking-tight text-slate-900 sm:text-[20px] dark:text-white">
              Status Distribution
            </h2>

            <p className="mt-1 text-[11px] text-slate-500 sm:text-[12px] dark:text-white/55">
              Radar chart showing total counts by notification status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadHistoryNotify(true)}
            disabled={refreshing}
            className={[
              "inline-flex h-9 w-9 items-center justify-center rounded-2xl transition",
              "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
            ].join(" ")}
            title="Refresh"
          >
            <FiRefreshCw
              className={`text-[13px] ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.completed.badge}`}
          >
            {STATUS_META.completed.icon}
            {STATUS_META.completed.label}:
            <span className="font-semibold">{summaryCount.completed}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.noUpdate.badge}`}
          >
            {STATUS_META.noUpdate.icon}
            {STATUS_META.noUpdate.label}:
            <span className="font-semibold">{summaryCount.noUpdate}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.running.badge}`}
          >
            {STATUS_META.running.icon}
            {STATUS_META.running.label}:
            <span className="font-semibold">{summaryCount.running}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.failed.badge}`}
          >
            {STATUS_META.failed.icon}
            {STATUS_META.failed.label}:
            <span className="font-semibold">{summaryCount.failed}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.notification.badge}`}
          >
            {STATUS_META.notification.icon}
            {STATUS_META.notification.label}:
            <span className="font-semibold">{summaryCount.notification}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.unauthorized.badge}`}
          >
            {STATUS_META.unauthorized.icon}
            {STATUS_META.unauthorized.label}:
            <span className="font-semibold">{summaryCount.unauthorized}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.serverError.badge}`}
          >
            {STATUS_META.serverError.icon}
            {STATUS_META.serverError.label}:
            <span className="font-semibold">{summaryCount.serverError}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium ${STATUS_META.timeout.badge}`}
          >
            {STATUS_META.timeout.icon}
            {STATUS_META.timeout.label}:
            <span className="font-semibold">{summaryCount.timeout}</span>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <div className={`mt-4 ${panelClass}`}>
          {loading ? (
            <div className="flex h-full items-center justify-center px-5 py-10 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  <FiRefreshCw className="animate-spin text-[18px]" />
                </div>
                <h3 className="mt-3 text-[14px] font-semibold text-slate-900 dark:text-white/85">
                  Loading radar chart...
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-white/55">
                  Please wait while we analyze the status distribution.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col p-3.5 sm:p-4 md:p-4.5">
              <div className="flex-1">
                <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
                  <div className="min-h-0 flex-1">
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="radar"
                      height="100%"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                กราฟนี้นับจำนวนจากข้อมูลทั้งหมดที่ได้จาก ListHistoryNotify
                แล้วกระจายตามแต่ละสถานะ เพื่อให้เห็นภาพรวมได้ง่ายขึ้น
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Index;