import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiPlayCircle,
  FiPauseCircle,
  FiClock,
  FiShield,
  FiRadio,
} from "react-icons/fi";
import { ListTaskStatus, type TaskStatusDTO } from "../../../services";

type StatusKey = "Done" | "Running" | "New" | "Stopped";

type StatItem = {
  id: number;
  title: StatusKey;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
};

const normalizeStatus = (s: string): StatusKey => {
  const v = (s || "").toLowerCase().trim();
  if (v === "done") return "Done";
  if (v === "running") return "Running";
  if (v === "new") return "New";
  if (v === "stopped") return "Stopped";

  if (v.includes("run")) return "Running";
  if (v.includes("stop") || v.includes("pause") || v.includes("interrupt")) return "Stopped";
  if (v.includes("new") || v.includes("request") || v.includes("queue")) return "New";
  if (v.includes("done") || v.includes("finish")) return "Done";
  return "Done";
};

const StatusTarget: React.FC = () => {
  const [rows, setRows] = useState<TaskStatusDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const res = await ListTaskStatus();
      if (!alive) return;

      setRows(res ?? []);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const statusCounts = useMemo(() => {
    const base: Record<StatusKey, number> = {
      Done: 0,
      Running: 0,
      New: 0,
      Stopped: 0,
    };

    for (const r of rows) {
      const key = normalizeStatus(r.status);
      base[key] += 1;
    }

    return base;
  }, [rows]);

  const totalTasks = useMemo(() => rows.length, [rows.length]);

  const pct = (n: number) => {
    if (!totalTasks) return 0;
    return Math.round((n / totalTasks) * 100);
  };

  const dominantStatus = useMemo<StatusKey>(() => {
    const ordered: StatusKey[] = ["Running", "Done", "New", "Stopped"];
    let best: StatusKey = "Done";
    let bestValue = -1;

    for (const key of ordered) {
      if (statusCounts[key] > bestValue) {
        best = key;
        bestValue = statusCounts[key];
      }
    }

    return best;
  }, [statusCounts]);

  const themeByStatus: Record<
    StatusKey,
    {
      accent: string;
      soft: string;
      chip: string;
      iconWrap: string;
      iconColor: string;
      progress: string;
      panelLight: string;
      panelDark: string;
      borderLight: string;
      borderDark: string;
      glow: string;
    }
  > = useMemo(
    () => ({
      Done: {
        accent: "#3b82f6",
        soft: "#93c5fd",
        chip:
          "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400/20 dark:text-blue-300",
        iconWrap:
          "bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8]",
        iconColor: "text-white",
        progress: "bg-gradient-to-r from-[#93c5fd] via-[#3b82f6] to-[#1d4ed8]",
        panelLight: "bg-white",
        panelDark: "dark:bg-[#0d1526]",
        borderLight: "border-blue-100/80",
        borderDark: "dark:border-blue-400/10",
        glow: "shadow-[0_14px_35px_-22px_rgba(59,130,246,0.45)]",
      },
      Running: {
        accent: "#10b981",
        soft: "#6ee7b7",
        chip:
          "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-300",
        iconWrap:
          "bg-gradient-to-br from-[#34d399] via-[#10b981] to-[#047857]",
        iconColor: "text-white",
        progress: "bg-gradient-to-r from-[#86efac] via-[#34d399] to-[#059669]",
        panelLight: "bg-white",
        panelDark: "dark:bg-[#0d161d]",
        borderLight: "border-emerald-100/80",
        borderDark: "dark:border-emerald-400/10",
        glow: "shadow-[0_14px_35px_-22px_rgba(16,185,129,0.42)]",
      },
      New: {
        accent: "#f59e0b",
        soft: "#fde68a",
        chip:
          "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-400/20 dark:text-amber-300",
        iconWrap:
          "bg-gradient-to-br from-[#fde68a] via-[#f59e0b] to-[#b45309]",
        iconColor: "text-white",
        progress: "bg-gradient-to-r from-[#fde68a] via-[#f59e0b] to-[#b45309]",
        panelLight: "bg-white",
        panelDark: "dark:bg-[#171208]",
        borderLight: "border-amber-100/80",
        borderDark: "dark:border-amber-400/10",
        glow: "shadow-[0_14px_35px_-22px_rgba(245,158,11,0.35)]",
      },
      Stopped: {
        accent: "#f43f5e",
        soft: "#fda4af",
        chip:
          "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-400/20 dark:text-rose-300",
        iconWrap:
          "bg-gradient-to-br from-[#fda4af] via-[#fb7185] to-[#be123c]",
        iconColor: "text-white",
        progress: "bg-gradient-to-r from-[#fda4af] via-[#fb7185] to-[#be123c]",
        panelLight: "bg-white",
        panelDark: "dark:bg-[#180b12]",
        borderLight: "border-rose-100/80",
        borderDark: "dark:border-rose-400/10",
        glow: "shadow-[0_14px_35px_-22px_rgba(244,63,94,0.38)]",
      },
    }),
    []
  );

  const stats: StatItem[] = useMemo(
    () => [
      {
        id: 1,
        title: "Done",
        value: loading ? "..." : statusCounts.Done.toLocaleString(),
        subtitle: "Completed",
        icon: <FiCheckCircle />,
      },
      {
        id: 2,
        title: "Running",
        value: loading ? "..." : statusCounts.Running.toLocaleString(),
        subtitle: "In progress",
        icon: <FiPlayCircle />,
      },
      {
        id: 3,
        title: "New",
        value: loading ? "..." : statusCounts.New.toLocaleString(),
        subtitle: "Queued",
        icon: <FiClock />,
      },
      {
        id: 4,
        title: "Stopped",
        value: loading ? "..." : statusCounts.Stopped.toLocaleString(),
        subtitle: "Stopped",
        icon: <FiPauseCircle />,
      },
    ],
    [loading, statusCounts]
  );

  const nowText = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  return (
    <section className="w-full">
      {/* HERO */}
      <div
        className={[
          "relative overflow-hidden rounded-[28px] px-6 sm:px-8 pt-7 sm:pt-8 pb-24 sm:pb-26",
          "bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.10),transparent_24%),linear-gradient(135deg,#1e1b4b_0%,#111827_50%,#0b1220_100%)]",
          "text-white border border-white/10",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            

            <h2 className="mt-4 text-[28px] sm:text-[32px] font-semibold tracking-tight">
              Scanning Network Status
            </h2>

            <p className="mt-2 text-[13px] sm:text-[14px] text-white/70">
              OpenVAS task summary
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[12px] text-white/80 backdrop-blur-sm">
                <FiShield className="text-cyan-300" />
                Security Monitor
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[12px] text-white/80 backdrop-blur-sm">
                <FiRadio className="text-violet-300" />
                {loading ? "Syncing..." : dominantStatus}
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Date</p>
            <p className="mt-1 text-[13px] sm:text-[14px] text-white/85">{nowText}</p>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="px-4 sm:px-5 md:px-6 -mt-18 sm:-mt-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s) => {
            const theme = themeByStatus[s.title];
            const count = statusCounts[s.title];
            const percent = loading ? 0 : pct(count);

            return (
              <div
                key={s.id}
                className={[
                  "relative overflow-hidden rounded-3xl border p-4 sm:p-5 transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-xl",
                  theme.panelLight,
                  theme.panelDark,
                  theme.borderLight,
                  theme.borderDark,
                  theme.glow,
                ].join(" ")}
              >
                {/* top accent */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${theme.soft}, ${theme.accent})`,
                  }}
                />

                {/* glow corner */}
                <div
                  className="pointer-events-none absolute -top-14 -right-14 h-32 w-32 rounded-full blur-3xl"
                  style={{ background: `${theme.accent}18` }}
                />

                <div className="relative">
                  {/* header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-slate-900 dark:text-white/90">
                        {s.title}
                      </p>
                      <p className="mt-1 text-[12px] text-slate-600 dark:text-white/55">
                        {s.subtitle}
                      </p>
                    </div>

                    <div
                      className={[
                        "h-11 w-11 rounded-2xl flex items-center justify-center text-[19px] shrink-0 shadow-sm",
                        theme.iconWrap,
                        theme.iconColor,
                      ].join(" ")}
                    >
                      {s.icon}
                    </div>
                  </div>

                  {/* value */}
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[30px] sm:text-[34px] font-semibold leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
                        {s.value}
                      </p>
                      <p className="mt-2 text-[12px] text-slate-600 dark:text-white/55">
                        {loading ? "Loading..." : `${count} tasks`}
                      </p>
                    </div>

                    <span
                      className={[
                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold border backdrop-blur-sm",
                        theme.chip,
                      ].join(" ")}
                    >
                      {loading ? "Sync" : `${percent}%`}
                    </span>
                  </div>

                  {/* progress */}
                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-[10.5px] text-slate-600 dark:text-white/45">
                      <span>Status</span>
                      <span>{loading ? "..." : `${count}/${totalTasks}`}</span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden border border-black/5 dark:border-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${theme.progress}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatusTarget;