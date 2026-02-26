import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertOctagon,
  FiAlertTriangle,
  FiMinusCircle,
  FiShield,
  FiInfo,
} from "react-icons/fi";

import { ListTaskVulnSummary, type TaskVulnSummaryDTO } from "../../../services";

type SeverityKey = "Critical" | "High" | "Medium" | "Low" | "Info";

type StatCard = {
  id: number;
  title: SeverityKey;
  value: string;
  subtitle: string;

  icon: React.ReactNode;

  bg: string;     // gradient background (เข้ม)
  ring: string;   // ring/border
  glow: string;   // shadow glow
  pill: string;   // badge style
  bar: string;    // progress bar gradient
};

const Value: React.FC = () => {
  const [rows, setRows] = useState<TaskVulnSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const res = await ListTaskVulnSummary();
      if (!alive) return;

      setRows(res ?? []);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const totals = useMemo(() => {
    let critical = 0,
      high = 0,
      medium = 0,
      low = 0,
      info = 0;

    for (const r of rows) {
      critical += Number(r.critical || 0);
      high += Number(r.high || 0);
      medium += Number(r.medium || 0);
      low += Number(r.low || 0);
      info += Number(r.info || 0);
    }

    const totalAll = critical + high + medium + low + info;

    return { totalAll, critical, high, medium, low, info };
  }, [rows]);

  const percent = (n: number) => {
    if (!totals.totalAll) return 0;
    return Math.round((n / totals.totalAll) * 100);
  };

  const makeSubtitle = (n: number) =>
    loading ? "Loading from API..." : `${percent(n)}% of total findings`;

  // ✅ ช่วยให้ bar มีความหมาย (กว้างตาม %)
  const barWidth = (n: number) => `${percent(n)}%`;

  const stats: StatCard[] = useMemo(
    () => [
      {
        id: 1,
        title: "Critical",
        value: loading ? "..." : totals.critical.toLocaleString(),
        subtitle: makeSubtitle(totals.critical),
        icon: <FiAlertOctagon />,

        // 🔥 เข้มมากขึ้น
        bg: "bg-gradient-to-br from-[#120408] via-[#3a0a12] to-[#7f1d1d]",
        ring: "ring-1 ring-[#fb7185]/30 border border-white/10",
        glow: "shadow-[0_18px_44px_-18px_rgba(239,68,68,0.60)]",
        pill: "bg-white/10 text-white border border-white/15",
        bar: "bg-gradient-to-r from-[#fb7185] via-[#ef4444] to-[#991b1b]",
      },
      {
        id: 2,
        title: "High",
        value: loading ? "..." : totals.high.toLocaleString(),
        subtitle: makeSubtitle(totals.high),
        icon: <FiAlertTriangle />,

        bg: "bg-gradient-to-br from-[#0f0703] via-[#3a1607] to-[#9a3412]",
        ring: "ring-1 ring-[#fdba74]/28 border border-white/10",
        glow: "shadow-[0_18px_44px_-18px_rgba(249,115,22,0.55)]",
        pill: "bg-white/10 text-white border border-white/15",
        bar: "bg-gradient-to-r from-[#fdba74] via-[#f97316] to-[#c2410c]",
      },
      {
        id: 3,
        title: "Medium",
        value: loading ? "..." : totals.medium.toLocaleString(),
        subtitle: makeSubtitle(totals.medium),
        icon: <FiMinusCircle />,

        bg: "bg-gradient-to-br from-[#0f0b02] via-[#2a1a05] to-[#854d0e]",
        ring: "ring-1 ring-[#fde68a]/25 border border-white/10",
        glow: "shadow-[0_18px_44px_-18px_rgba(250,204,21,0.45)]",
        pill: "bg-white/10 text-white border border-white/15",
        bar: "bg-gradient-to-r from-[#fde68a] via-[#facc15] to-[#a16207]",
      },
      {
        id: 4,
        title: "Low",
        value: loading ? "..." : totals.low.toLocaleString(),
        subtitle: makeSubtitle(totals.low),
        icon: <FiShield />,

        bg: "bg-gradient-to-br from-[#03120b] via-[#052e1e] to-[#065f46]",
        ring: "ring-1 ring-[#86efac]/25 border border-white/10",
        glow: "shadow-[0_18px_44px_-18px_rgba(34,197,94,0.45)]",
        pill: "bg-white/10 text-white border border-white/15",
        bar: "bg-gradient-to-r from-[#86efac] via-[#22c55e] to-[#15803d]",
      },
      {
        id: 5,
        title: "Info",
        value: loading ? "..." : totals.info.toLocaleString(),
        subtitle: makeSubtitle(totals.info),
        icon: <FiInfo />,

        bg: "bg-gradient-to-br from-[#020b16] via-[#06243a] to-[#075985]",
        ring: "ring-1 ring-[#7dd3fc]/25 border border-white/10",
        glow: "shadow-[0_18px_44px_-18px_rgba(56,189,248,0.45)]",
        pill: "bg-white/10 text-white border border-white/15",
        bar: "bg-gradient-to-r from-[#7dd3fc] via-[#38bdf8] to-[#0284c7]",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, totals]
  );

  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-3 sm:p-3.5">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
        {stats.map((item) => {
          const rawNumber =
            item.title === "Critical"
              ? totals.critical
              : item.title === "High"
              ? totals.high
              : item.title === "Medium"
              ? totals.medium
              : item.title === "Low"
              ? totals.low
              : totals.info;

          const w = loading ? "0%" : barWidth(rawNumber);

          return (
            <div
              key={item.id}
              className={[
                "min-w-0 rounded-2xl p-3 sm:p-3.5 text-white relative overflow-hidden",
                "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl",
                item.bg,
                item.ring,
                item.glow,
              ].join(" ")}
            >
              {/* overlay grid */}
              <div className="pointer-events-none absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[16px_16px]" />
              {/* soft corner glow */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex flex-col justify-between min-h-26">
                {/* top row */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[18px]">
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="min-w-0 truncate text-[12.5px] sm:text-[13px] leading-[1.15] font-semibold tracking-wide">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-white/75 truncate">
                          Severity summary
                        </p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={[
                      "shrink-0 rounded-full h-6 px-2.5 inline-flex items-center justify-center",
                      "text-[10px] font-medium backdrop-blur",
                      item.pill,
                    ].join(" ")}
                  >
                    {loading ? "Syncing" : `${percent(rawNumber)}%`}
                  </span>
                </div>

                {/* value */}
                <div className="mt-3">
                  <p className="truncate text-[20px] sm:text-[22px] font-semibold tracking-tight">
                    {item.value}
                  </p>

                  <p className="mt-1 text-[11.5px] text-white/80">
                    {item.subtitle}
                  </p>
                </div>

                {/* progress bar */}
                <div className="mt-3">
                  <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                    <div
                      className={["h-full rounded-full transition-all duration-700", item.bar].join(
                        " "
                      )}
                      style={{ width: w }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && (
        <div className="mt-3 px-1 text-[12px] text-gray-500">
          Total findings:{" "}
          <span className="font-medium text-gray-700">
            {totals.totalAll.toLocaleString()}
          </span>{" "}
          • Tasks:{" "}
          <span className="font-medium text-gray-700">
            {rows.length.toLocaleString()}
          </span>
        </div>
      )}
    </section>
  );
};

export default Value;