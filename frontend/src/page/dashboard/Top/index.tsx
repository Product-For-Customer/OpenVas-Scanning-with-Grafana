import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { FiShield, FiTrendingUp } from "react-icons/fi";
import { ListAssetRisk, type AssetRiskDTO } from "../../../services";

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
      chip:
        "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300",
      gauge: "#ef4444",
      glow: "bg-red-400/10",
    };
  }

  if (risk >= 6) {
    return {
      label: "High",
      dot: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-300",
      chip:
        "bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-500/10 dark:border-orange-400/20 dark:text-orange-300",
      gauge: "#f97316",
      glow: "bg-orange-400/10",
    };
  }

  if (risk >= 4) {
    return {
      label: "Medium",
      dot: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-300",
      chip:
        "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-400/20 dark:text-yellow-300",
      gauge: "#eab308",
      glow: "bg-yellow-400/10",
    };
  }

  if (risk > 0) {
    return {
      label: "Low",
      dot: "bg-green-500",
      text: "text-green-600 dark:text-green-300",
      chip:
        "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-400/20 dark:text-green-300",
      gauge: "#22c55e",
      glow: "bg-green-400/10",
    };
  }

  return {
    label: "Info",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-300",
    chip:
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400/20 dark:text-blue-300",
    gauge: "#3b82f6",
    glow: "bg-blue-400/10",
  };
};

const TopPerforming: React.FC = () => {
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

    const avgRisk =
      taskCount > 0
        ? list.reduce((sum, item) => sum + (Number(item.risk_score) || 0), 0) /
          taskCount
        : 0;

    const maxRisk = list.reduce(
      (max, item) => Math.max(max, Number(item.risk_score) || 0),
      0
    );

    return {
      taskCount,
      avgRisk,
      maxRisk,
    };
  }, [data]);

  const tone = useMemo(() => getRiskTone(summary.avgRisk), [summary.avgRisk]);

  const criticalCount = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.filter((item) => (Number(item.risk_score) || 0) >= 8).length;
  }, [data]);

  const subtitle = useMemo(() => {
    if (loading) return "Syncing average task risk posture...";
    if (summary.taskCount === 0) return "No task risk data available";
    if (criticalCount > 0) {
      return `${criticalCount} critical tasks require immediate attention`;
    }
    return "Average exposure score across latest asset snapshots";
  }, [loading, summary.taskCount, criticalCount]);

  const gaugeData = useMemo(() => {
    return [
      {
        name: "Average Risk",
        value: clamp(summary.avgRisk, 0, 10),
        fill: tone.gauge,
      },
    ];
  }, [summary.avgRisk, tone.gauge]);

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

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                  Task Risk Monitor
                </span>
              </div>
            </div>

            <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
              Average Risk Score
            </h2>
            <p className="mt-1 text-[12.5px] text-gray-500 dark:text-white/55">
              {subtitle}
            </p>
          </div>

          <div
            className={[
              "shrink-0 rounded-2xl px-4 py-2.5 inline-flex items-center gap-2",
              "border border-gray-200 bg-white text-gray-600",
              "dark:border-white/10 dark:bg-white/5 dark:text-white/65",
            ].join(" ")}
          >
            <FiTrendingUp className="text-cyan-500 text-[15px]" />
            <span className="text-[13px] font-medium">Max 10.00</span>
          </div>
        </div>

        <div className="mt-5 flex-1">
          <div
            className={[
              "relative h-full min-h-85 sm:min-h-95 rounded-3xl p-4 sm:p-5 overflow-hidden",
              "border border-gray-200/80 bg-white/80",
              "dark:border-white/10 dark:bg-white/5",
            ].join(" ")}
          >
            <div
              className={`pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl ${tone.glow}`}
            />

            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <p className="text-[13px] font-semibold text-[#1f2240] dark:text-white/85">
                    Risk Gauge
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-white/45">
                    Min 0.00 • Max 10.00
                  </p>
                </div>

                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold border",
                    tone.chip,
                  ].join(" ")}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                  {tone.label}
                </span>
              </div>

              <div className="relative flex-1 min-h-65 sm:min-h-75">
                <div className="pointer-events-none absolute left-1/2 top-[52%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div
                    className={`text-[34px] sm:text-[42px] font-semibold leading-none ${tone.text}`}
                  >
                    {loading ? "..." : formatRisk(summary.avgRisk)}
                  </div>
                  <div className="mt-2 text-[12px] sm:text-[13px] text-gray-500 dark:text-white/50">
                    Average Risk Score
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    data={gaugeData}
                    startAngle={205}
                    endAngle={-25}
                    innerRadius="68%"
                    outerRadius="100%"
                    barSize={20}
                  >
                    <PolarAngleAxis type="number" domain={[0, 10]} tick={false} />
                    <RadialBar
                      background={{ fill: "rgba(148,163,184,0.12)" }}
                      dataKey="value"
                      cornerRadius={999}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px] sm:text-[12px] text-gray-400 dark:text-white/40">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div
                  className={[
                    "rounded-2xl px-4 py-3",
                    "bg-slate-50 border border-slate-200/80",
                    "dark:bg-white/4 dark:border-white/10",
                  ].join(" ")}
                >
                  <p className="text-[11px] text-gray-400 dark:text-white/40">
                    Tasks
                  </p>
                  <p className="mt-1 text-[15px] sm:text-[16px] font-semibold text-[#1f2240] dark:text-white/85">
                    {loading ? "..." : formatNumber(summary.taskCount)}
                  </p>
                </div>

                <div
                  className={[
                    "rounded-2xl px-4 py-3",
                    "bg-slate-50 border border-slate-200/80",
                    "dark:bg-white/4 dark:border-white/10",
                  ].join(" ")}
                >
                  <p className="text-[11px] text-gray-400 dark:text-white/40">
                    Highest Risk
                  </p>
                  <p className="mt-1 text-[15px] sm:text-[16px] font-semibold text-[#1f2240] dark:text-white/85">
                    {loading ? "..." : formatRisk(summary.maxRisk)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPerforming;