// Social.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { ListAssetRisk, type AssetRiskDTO } from "../../../services";

type RowItem = {
  id: string;
  name: string;
  valueLeft: string;
  valueRight: string;
  percent?: number;
  icon: React.ReactNode;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const formatNumber = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
};

const formatRisk = (n: number) => {
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
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
      setData(res);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const list = data ?? [];
    const taskCount = list.length;

    const totalVuln = list.reduce((sum, x) => sum + (Number(x.vulnerability_total) || 0), 0);

    const avgRisk =
      taskCount === 0
        ? 0
        : list.reduce((sum, x) => sum + (Number(x.risk_score) || 0), 0) / taskCount;

    return { taskCount, totalVuln, avgRisk };
  }, [data]);

  const rows: RowItem[] = useMemo(() => {
    const list = data ?? [];

    const maxRisk = list.reduce((m, x) => Math.max(m, Number(x.risk_score) || 0), 0);
    const maxVuln = list.reduce((m, x) => Math.max(m, Number(x.vulnerability_total) || 0), 0);

    const taskRows: RowItem[] = list
      .map((x) => {
        const risk = Number(x.risk_score) || 0;
        const vuln = Number(x.vulnerability_total) || 0;

        const percent =
          maxRisk > 0 ? (risk / maxRisk) * 100 : maxVuln > 0 ? (vuln / maxVuln) * 100 : 0;

        const initials = String(x.task_name ?? "T").trim().slice(0, 2).toUpperCase();

        return {
          id: x.mac_address || x.task_name,
          name: x.task_name,
          valueLeft: formatNumber(vuln),
          valueRight: formatRisk(risk),
          percent: clamp(percent, 0, 100),
          icon: (
            <span className="text-[12px] font-bold text-gray-600 dark:text-white/70">
              {initials}
            </span>
          ),
        };
      })
      .sort((a, b) => {
        const ar = Number(String(a.valueRight).replace(",", "")) || 0;
        const br = Number(String(b.valueRight).replace(",", "")) || 0;
        if (br !== ar) return br - ar;

        const av = Number(String(a.valueLeft).replace(",", "")) || 0;
        const bv = Number(String(b.valueLeft).replace(",", "")) || 0;
        if (bv !== av) return bv - av;

        return a.name.localeCompare(b.name);
      });

    const summaryRows: RowItem[] = [
      {
        id: "__summary_tasks__",
        name: "Total Tasks",
        valueLeft: formatNumber(summary.taskCount),
        valueRight: "",
        icon: <span className="text-[12px] font-bold text-gray-600 dark:text-white/70">TT</span>,
      },
      {
        id: "__summary_avg_risk__",
        name: "Avg Risk Score",
        valueLeft: formatRisk(summary.avgRisk),
        valueRight: "",
        icon: <span className="text-[12px] font-bold text-gray-600 dark:text-white/70">AR</span>,
      },
      {
        id: "__summary_total_vulns__",
        name: "Total Vulns",
        valueLeft: formatNumber(summary.totalVuln),
        valueRight: "",
        icon: <span className="text-[12px] font-bold text-gray-600 dark:text-white/70">TV</span>,
      },
    ];

    return [...summaryRows, ...taskRows];
  }, [data, summary]);

  return (
    <section
      className={[
        "rounded-[22px] p-4 sm:p-5 md:p-6 h-full",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240] dark:text-white/90">
            Asset risk overview
          </h3>
          <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-white/55 mt-1">
            Summary + task list (same row style)
          </p>
        </div>

        <button
          type="button"
          className={[
            "h-9 w-9 rounded-xl inline-flex items-center justify-center transition-colors",
            "text-gray-500 hover:bg-gray-100 active:bg-gray-200",
            "dark:text-white/55 dark:hover:bg-white/10 dark:active:bg-white/15",
          ].join(" ")}
          aria-label="More"
        >
          <FiMoreHorizontal />
        </button>
      </div>

      {/* rows */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <div
            className={[
              "rounded-2xl px-4 py-4 text-[13px]",
              "border border-gray-200/80 bg-white text-gray-500",
              "dark:border-white/10 dark:bg-white/5 dark:text-white/55",
            ].join(" ")}
          >
            Loading...
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
          rows.map((s) => (
            <div
              key={s.id}
              className={[
                "rounded-2xl px-3.5 sm:px-4 py-3 flex items-center gap-3",
                "border border-gray-200/80 bg-white",
                "dark:border-white/10 dark:bg-white/5",
              ].join(" ")}
            >
              {/* icon */}
              <div
                className={[
                  "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
                  "border border-gray-200/80 bg-[#fbfbfc]",
                  "dark:border-white/10 dark:bg-white/8",
                ].join(" ")}
              >
                {s.icon}
              </div>

              {/* name */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] sm:text-[14px] font-medium text-[#1f2240] dark:text-white/85">
                  {s.name}
                </p>

                {typeof s.percent === "number" && (
                  <div className="mt-2 h-2.5 rounded-full bg-[#eef0f6] dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.percent}%`,
                        background:
                          "linear-gradient(90deg, #6f5be8 0%, #7a67ea 55%, #84cc16 100%)",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* values */}
              <div className="shrink-0 flex items-center gap-6">
                <div className="w-16 text-right">
                  <p className="text-[13px] sm:text-[14px] font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
                    {s.valueLeft}
                  </p>
                </div>

                {s.valueRight !== "" && (
                  <div className="w-16 text-right">
                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
                      {s.valueRight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Social;