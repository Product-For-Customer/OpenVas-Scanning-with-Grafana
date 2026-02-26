import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiPlayCircle,
  FiPauseCircle,
  FiClock,
} from "react-icons/fi";

import { ListTaskStatus, type TaskStatusDTO } from "../../../services";

type StatusKey = "Done" | "Running" | "New" | "Stopped";

type StatItem = {
  id: number;
  title: StatusKey;
  value: string;
  changeText: string;
  trend: "up" | "down";
  accent: "purple" | "green" | "red";
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

  // ✅ theme ต่อสถานะ (gradient + badge + glow)
  const themeByStatus: Record<
    StatusKey,
    {
      cardGradient: string;
      ring: string;
      glow: string;
      iconWrap: string;
      badge: string;
      progress: string;
    }
  > = useMemo(
    () => ({
      Done: {
        cardGradient:
          "bg-gradient-to-br from-[#0ea5e9]/12 via-[#2563eb]/10 to-[#1e40af]/8",
        ring: "ring-1 ring-[#60a5fa]/25",
        glow: "shadow-[0_10px_30px_-12px_rgba(59,130,246,0.45)]",
        iconWrap: "bg-gradient-to-br from-[#38bdf8] to-[#2563eb] text-white",
        badge: "bg-[#dbeafe] text-[#1d4ed8] border border-[#93c5fd]/60",
        progress: "bg-gradient-to-r from-[#38bdf8] to-[#2563eb]",
      },
      Running: {
        cardGradient:
          "bg-gradient-to-br from-[#22c55e]/12 via-[#10b981]/10 to-[#065f46]/8",
        ring: "ring-1 ring-[#34d399]/25",
        glow: "shadow-[0_10px_30px_-12px_rgba(16,185,129,0.40)]",
        iconWrap: "bg-gradient-to-br from-[#34d399] to-[#10b981] text-white",
        badge: "bg-[#dcfce7] text-[#166534] border border-[#86efac]/70",
        progress: "bg-gradient-to-r from-[#34d399] to-[#10b981]",
      },
      New: {
        cardGradient:
          "bg-gradient-to-br from-[#facc15]/14 via-[#f59e0b]/10 to-[#78350f]/6",
        ring: "ring-1 ring-[#fbbf24]/28",
        glow: "shadow-[0_10px_30px_-12px_rgba(245,158,11,0.40)]",
        iconWrap: "bg-gradient-to-br from-[#facc15] to-[#f59e0b] text-white",
        badge: "bg-[#fef9c3] text-[#92400e] border border-[#fde68a]/70",
        progress: "bg-gradient-to-r from-[#facc15] to-[#f59e0b]",
      },
      Stopped: {
        cardGradient:
          "bg-gradient-to-br from-[#ef4444]/12 via-[#f43f5e]/10 to-[#7f1d1d]/8",
        ring: "ring-1 ring-[#fb7185]/25",
        glow: "shadow-[0_10px_30px_-12px_rgba(244,63,94,0.40)]",
        iconWrap: "bg-gradient-to-br from-[#fb7185] to-[#ef4444] text-white",
        badge: "bg-[#ffe4e6] text-[#9f1239] border border-[#fda4af]/70",
        progress: "bg-gradient-to-r from-[#fb7185] to-[#ef4444]",
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
        changeText: "Completed tasks",
        trend: "up",
        accent: "green",
        icon: <FiCheckCircle />,
      },
      {
        id: 2,
        title: "Running",
        value: loading ? "..." : statusCounts.Running.toLocaleString(),
        changeText: "Currently scanning",
        trend: "up",
        accent: "purple",
        icon: <FiPlayCircle />,
      },
      {
        id: 3,
        title: "New",
        value: loading ? "..." : statusCounts.New.toLocaleString(),
        changeText: "Not started yet",
        trend: "down",
        accent: "red",
        icon: <FiClock />,
      },
      {
        id: 4,
        title: "Stopped",
        value: loading ? "..." : statusCounts.Stopped.toLocaleString(),
        changeText: "Paused / stopped",
        trend: "down",
        accent: "red",
        icon: <FiPauseCircle />,
      },
    ],
    [loading, statusCounts]
  );

  const nowText = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  return (
    <section className="w-full">
      {/* ✅ HERO (ปรับให้ดูพรีเมียมขึ้น) */}
      <div className="relative rounded-[26px] bg-[#26224b] text-white px-6 sm:px-8 pt-7 sm:pt-8 pb-28 sm:pb-32 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        {/* subtle dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] bg-size-[18px_18px]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] sm:text-[13px] text-white/85 border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live status (from API)
            </div>

            <h2 className="mt-3 text-[26px] sm:text-[30px] font-semibold tracking-tight">
              Scan Status Overview
            </h2>
            <p className="mt-1 text-[13px] sm:text-[14px] text-white/75">
              Summary of OpenVAS task states
            </p>
          </div>

          <div className="shrink-0 text-[13px] sm:text-[14px] text-white/85 mt-1">
            {nowText}
          </div>
        </div>
      </div>

      {/* ✅ CARDS */}
      <div className="px-4 sm:px-5 md:px-6 -mt-18 sm:-mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s) => {
            const theme = themeByStatus[s.title];
            const count = statusCounts[s.title];
            const percent = loading ? 0 : pct(count);

            return (
              <div
                key={s.id}
                className={[
                  "relative rounded-[22px] border border-gray-200/70 bg-white text-[#1f2240] overflow-hidden",
                  "transition-all duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:shadow-lg",
                  theme.ring,
                ].join(" ")}
              >
                {/* gradient background */}
                <div className={["absolute inset-0", theme.cardGradient].join(" ")} />

                {/* glow */}
                <div className={["absolute inset-0", theme.glow].join(" ")} />

                {/* light grid overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-70 [background:linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-size-[16px_16px]" />

                <div className="relative p-4 sm:p-5">
                  {/* top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold text-gray-800">
                          {s.title}
                        </p>

                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.75 text-[11px] font-medium",
                            theme.badge,
                          ].join(" ")}
                        >
                          {loading ? "Loading" : `${percent}%`}
                        </span>
                      </div>

                      <p className="mt-1 text-[12.5px] text-gray-600">
                        {s.changeText}
                      </p>
                    </div>

                    <div
                      className={[
                        "h-10 w-10 rounded-2xl flex items-center justify-center text-[18px] shadow-sm",
                        theme.iconWrap,
                      ].join(" ")}
                    >
                      {s.icon}
                    </div>
                  </div>

                  {/* value */}
                  <p className="mt-4 text-[32px] sm:text-[34px] font-semibold tracking-tight text-gray-900">
                    {s.value}
                  </p>

                  {/* sub info */}
                  <p className="mt-1 text-[12px] text-gray-600">
                    {loading ? (
                      "Fetching tasks..."
                    ) : (
                      <>
                        <span className="font-medium text-gray-800">
                          {count.toLocaleString()}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-800">
                          {totalTasks.toLocaleString()}
                        </span>{" "}
                        tasks
                      </>
                    )}
                  </p>

                  {/* progress bar */}
                  <div className="mt-3">
                    <div className="h-2.25 w-full rounded-full bg-black/5 overflow-hidden">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-500",
                          theme.progress,
                        ].join(" ")}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* spacer */}
        <div className="h-3 sm:h-4" />
      </div>
    </section>
  );
};

export default StatusTarget;