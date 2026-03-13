import React, { useEffect, useMemo, useState } from "react";
import {
  FiMoreHorizontal,
  FiShield,
  FiRadio,
  FiCpu,
  FiAlertTriangle,
} from "react-icons/fi";
import { ListAssetRisk, type AssetRiskDTO } from "../../../services";

type RowItem = {
  id: string;
  name: string;
  subName?: string;
  valueLeft: string;
  valueRight: string;
  percent?: number;
  icon: React.ReactNode;
  rowType: "summary" | "task";
  riskValue?: number;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const formatNumber = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
};

const formatRisk = (n: number) => {
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
};

const getRiskTone = (risk: number) => {
  if (risk >= 8) {
    return {
      label: "Critical",
      dot: "bg-red-500",
      text: "text-red-600 dark:text-red-300",
      bar: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)",
      chip:
        "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300",
    };
  }

  if (risk >= 6) {
    return {
      label: "High",
      dot: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-300",
      bar: "linear-gradient(90deg, #f97316 0%, #f59e0b 100%)",
      chip:
        "bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-500/10 dark:border-orange-400/20 dark:text-orange-300",
    };
  }

  if (risk >= 4) {
    return {
      label: "Medium",
      dot: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-300",
      bar: "linear-gradient(90deg, #eab308 0%, #84cc16 100%)",
      chip:
        "bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-500/10 dark:border-yellow-400/20 dark:text-yellow-300",
    };
  }

  if (risk > 0) {
    return {
      label: "Low",
      dot: "bg-green-500",
      text: "text-green-600 dark:text-green-300",
      bar: "linear-gradient(90deg, #22c55e 0%, #14b8a6 100%)",
      chip:
        "bg-green-50 border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-400/20 dark:text-green-300",
    };
  }

  return {
    label: "Info",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-300",
    bar: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
    chip:
      "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-400/20 dark:text-blue-300",
  };
};

const Social: React.FC = () => {
  const [data, setData] = useState<AssetRiskDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const res = await ListAssetRisk();
      if (!mounted) return;
      setData(Array.isArray(res) ? res : []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const taskCount = list.length;

    const totalVuln = list.reduce(
      (sum, x) => sum + (Number(x.vulnerability_total) || 0),
      0
    );

    const avgRisk =
      taskCount === 0
        ? 0
        : list.reduce((sum, x) => sum + (Number(x.risk_score) || 0), 0) /
          taskCount;

    const maxRisk = list.reduce(
      (m, x) => Math.max(m, Number(x.risk_score) || 0),
      0
    );

    return { taskCount, totalVuln, avgRisk, maxRisk };
  }, [data]);

  const rows: RowItem[] = useMemo(() => {
    const list = Array.isArray(data) ? data : [];

    const maxRisk = list.reduce(
      (m, x) => Math.max(m, Number(x.risk_score) || 0),
      0
    );
    const maxVuln = list.reduce(
      (m, x) => Math.max(m, Number(x.vulnerability_total) || 0),
      0
    );

    const taskRows: RowItem[] = list
      .map((x) => {
        const risk = Number(x.risk_score) || 0;
        const vuln = Number(x.vulnerability_total) || 0;

        const percent =
          maxRisk > 0
            ? (risk / maxRisk) * 100
            : maxVuln > 0
            ? (vuln / maxVuln) * 100
            : 0;

        const initials = String(x.task_name ?? "T")
          .trim()
          .slice(0, 2)
          .toUpperCase();

        return {
          id: `${x.task_id || "task"}-${x.host_ip || "host"}-${x.task_name || "name"}`,
          name: x.task_name || "Unknown Asset",
          subName: x.host_ip || "-",
          valueLeft: formatNumber(vuln),
          valueRight: formatRisk(risk),
          percent: clamp(percent, 0, 100),
          riskValue: risk,
          rowType: "task" as const,
          icon: (
            <span className="text-[12px] font-bold text-slate-600 dark:text-white/70">
              {initials || "T"}
            </span>
          ),
        };
      })
      .sort((a, b) => {
        const ar = Number(a.riskValue || 0);
        const br = Number(b.riskValue || 0);
        if (br !== ar) return br - ar;

        const av = Number(String(a.valueLeft).replace(/,/g, "")) || 0;
        const bv = Number(String(b.valueLeft).replace(/,/g, "")) || 0;
        if (bv !== av) return bv - av;

        return a.name.localeCompare(b.name);
      });

    const summaryRows: RowItem[] = [
      {
        id: "__summary_tasks__",
        name: "Total Assets",
        valueLeft: formatNumber(summary.taskCount),
        valueRight: "",
        rowType: "summary",
        icon: (
          <span className="text-[12px] font-bold text-slate-600 dark:text-white/70">
            TA
          </span>
        ),
      },
      {
        id: "__summary_avg_risk__",
        name: "Average Risk Score",
        valueLeft: formatRisk(summary.avgRisk),
        valueRight: "",
        rowType: "summary",
        icon: (
          <span className="text-[12px] font-bold text-slate-600 dark:text-white/70">
            AR
          </span>
        ),
      },
      {
        id: "__summary_total_vulns__",
        name: "Total Vulnerabilities",
        valueLeft: formatNumber(summary.totalVuln),
        valueRight: "",
        rowType: "summary",
        icon: (
          <span className="text-[12px] font-bold text-slate-600 dark:text-white/70">
            TV
          </span>
        ),
      },
    ];

    return [...summaryRows, ...taskRows];
  }, [data, summary]);

  const criticalAssets = useMemo(() => {
    return (data ?? []).filter((x) => (Number(x.risk_score) || 0) >= 8).length;
  }, [data]);

  const subtitle = useMemo(() => {
    if (loading) return "Syncing latest asset risk posture...";
    if ((data ?? []).length === 0) return "No asset risk data available";
    if (criticalAssets > 0) {
      return `${criticalAssets} high-priority assets require immediate review`;
    }
    return "Live asset exposure summary from latest scan results";
  }, [loading, data, criticalAssets]);

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[22px] p-4 sm:p-5 md:p-6 h-full",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-10 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
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

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                  "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                  "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                ].join(" ")}
              >
                <FiShield className="text-[14px]" />
                <span className="text-[12px] font-semibold tracking-wide">
                  Asset Risk Monitor
                </span>
              </div>

              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                  "bg-slate-50 text-slate-600 border border-slate-200/80",
                  "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                ].join(" ")}
              >
                <FiRadio className="text-[13px] text-cyan-500" />
                <span className="text-[12px] font-medium">
                  {loading ? "Loading..." : `${summary.taskCount} Assets`}
                </span>
              </div>
            </div>

            <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240] dark:text-white/90">
              Asset Risk Overview
            </h3>
            <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-white/55 mt-1">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            className={[
              "h-10 w-10 rounded-2xl inline-flex items-center justify-center transition-colors",
              "text-gray-500 border border-gray-200/80 bg-white hover:bg-gray-100 active:bg-gray-200",
              "dark:text-white/55 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:active:bg-white/15",
            ].join(" ")}
            aria-label="More"
          >
            <FiMoreHorizontal />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={[
                    "rounded-2xl px-4 py-4 border animate-pulse",
                    "border-gray-200/80 bg-white",
                    "dark:border-white/10 dark:bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gray-200 dark:bg-white/10" />
                    <div className="flex-1">
                      <div className="h-4 w-36 rounded bg-gray-200 dark:bg-white/10" />
                      <div className="mt-2 h-2.5 w-full rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="h-4 w-14 rounded bg-gray-200 dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div
              className={[
                "rounded-2xl px-4 py-4 text-[13px]",
                "border border-gray-200/80 bg-white text-gray-500",
                "dark:border-white/10 dark:bg-white/5 dark:text-white/55",
              ].join(" ")}
            >
              No Data
            </div>
          ) : (
            rows.map((s) => {
              const tone =
                s.rowType === "task"
                  ? getRiskTone(Number(s.riskValue || 0))
                  : null;

              return (
                <div
                  key={s.id}
                  className={[
                    "rounded-2xl px-3.5 sm:px-4 py-3 flex items-center gap-3 transition-all duration-200",
                    s.rowType === "summary"
                      ? "border border-cyan-100 bg-cyan-50/60 dark:border-cyan-400/15 dark:bg-cyan-500/5"
                      : "border border-gray-200/80 bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border",
                      s.rowType === "summary"
                        ? "border-cyan-200/80 bg-white dark:border-cyan-400/15 dark:bg-white/10"
                        : "border-gray-200/80 bg-[#fbfbfc] dark:border-white/10 dark:bg-white/8",
                    ].join(" ")}
                  >
                    {s.rowType === "task" ? (
                      <div className="flex flex-col items-center justify-center">
                        <FiCpu className="text-[14px] text-cyan-500 mb-0.5" />
                        {s.icon}
                      </div>
                    ) : (
                      s.icon
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="truncate text-[13px] sm:text-[14px] font-medium text-[#1f2240] dark:text-white/85">
                        {s.name}
                      </p>

                      {s.rowType === "task" && tone ? (
                        <span
                          className={[
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                            tone.chip,
                          ].join(" ")}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                          {tone.label}
                        </span>
                      ) : null}
                    </div>

                    {typeof s.percent === "number" && tone && (
                      <div className="mt-2">
                        <div className="h-2.5 rounded-full bg-[#eef0f6] dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${s.percent}%`,
                              background: tone.bar,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {s.rowType === "summary" ? (
                      <p className="mt-1 text-[11px] text-gray-500 dark:text-white/45">
                        Security summary from latest imported asset dataset
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-gray-500 dark:text-white/45 truncate">
                        Host: {s.subName || "-"}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-4 sm:gap-6">
                    <div className="w-16 sm:w-20 text-right">
                      <p className="text-[11px] text-gray-400 dark:text-white/40">
                        {s.rowType === "summary" ? "Value" : "Vulns"}
                      </p>
                      <p className="text-[13px] sm:text-[14px] font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
                        {s.valueLeft}
                      </p>
                    </div>

                    {s.valueRight !== "" && (
                      <div className="w-16 sm:w-20 text-right">
                        <p className="text-[11px] text-gray-400 dark:text-white/40">
                          Risk
                        </p>
                        <p
                          className={`text-[13px] sm:text-[14px] font-semibold tabular-nums ${
                            tone ? tone.text : "text-[#1f2240] dark:text-white/85"
                          }`}
                        >
                          {s.valueRight}
                        </p>
                      </div>
                    )}

                    {s.rowType === "task" && Number(s.riskValue || 0) >= 8 ? (
                      <FiAlertTriangle className="shrink-0 text-red-500 text-[16px]" />
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Social;