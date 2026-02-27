import React, { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiPlayCircle, FiPauseCircle, FiClock } from "react-icons/fi";
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

  /**
   * ✅ เพิ่มความ “เด่น” ของพื้นหลังการ์ด (Dark)
   * - เพิ่ม inner highlight (inset)
   * - เพิ่ม vignette/mid glow
   * - เพิ่ม top edge sheen
   */
  const themeByStatus: Record<
    StatusKey,
    {
      // Light
      cardLight: string;
      ringLight: string;
      badgeLight: string;
      iconLight: string;
      progressLight: string;

      // Dark
      cardDark: string;
      ringDark: string;
      badgeDark: string;
      iconDark: string;
      progressDark: string;

      glowDark: string;
      gridDark: string;

      // NEW: extra depth layers
      insetDark: string; // inner highlight
      sheenDark: string; // top sheen
      vignetteDark: string; // vignette
      tintBlob: string; // corner tint blob color
    }
  > = useMemo(
    () => ({
      Done: {
        // Light
        cardLight: "bg-white border border-gray-200/70 shadow-sm",
        ringLight: "ring-1 ring-[#60a5fa]/18",
        badgeLight: "bg-[#dbeafe] text-[#1d4ed8] border border-[#93c5fd]/60",
        iconLight: "bg-gradient-to-br from-[#38bdf8] to-[#2563eb] text-white",
        progressLight: "bg-gradient-to-r from-[#38bdf8] to-[#2563eb]",

        // Dark (Blue)
        cardDark:
          "bg-gradient-to-br from-[#0B1220] via-[#070A12] to-[#0A1020] border border-white/10",
        ringDark: "ring-1 ring-[#60a5fa]/22",
        badgeDark: "bg-[#0b2a3a]/70 text-[#7dd3fc] border border-[#38bdf8]/25",
        iconDark:
          "bg-gradient-to-br from-[#38bdf8] via-[#2563eb] to-[#1d4ed8] text-white",
        progressDark: "bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8]",
        glowDark: "shadow-[0_18px_55px_-28px_rgba(56,189,248,0.72)]",
        gridDark:
          "opacity-25 [background:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[18px_18px]",

        // depth layers
        insetDark: "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        sheenDark: "bg-gradient-to-b from-white/10 via-white/0 to-white/0",
        vignetteDark: "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(56,189,248,0.10)_0%,rgba(0,0,0,0)_55%),radial-gradient(120%_120%_at_100%_120%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_60%)]",
        tintBlob: "rgba(56,189,248,0.16)",
      },

      Running: {
        // Light
        cardLight: "bg-white border border-gray-200/70 shadow-sm",
        ringLight: "ring-1 ring-[#34d399]/18",
        badgeLight: "bg-[#dcfce7] text-[#166534] border border-[#86efac]/70",
        iconLight: "bg-gradient-to-br from-[#34d399] to-[#10b981] text-white",
        progressLight: "bg-gradient-to-r from-[#34d399] to-[#10b981]",

        // Dark (Green)
        cardDark:
          "bg-gradient-to-br from-[#0B1220] via-[#070A12] to-[#07131A] border border-white/10",
        ringDark: "ring-1 ring-[#34d399]/22",
        badgeDark: "bg-[#062316]/70 text-[#86efac] border border-[#34d399]/22",
        iconDark:
          "bg-gradient-to-br from-[#34d399] via-[#10b981] to-[#059669] text-white",
        progressDark: "bg-gradient-to-r from-[#86efac] via-[#34d399] to-[#059669]",
        glowDark: "shadow-[0_18px_55px_-28px_rgba(52,211,153,0.68)]",
        gridDark:
          "opacity-22 [background:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[18px_18px]",

        insetDark: "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        sheenDark: "bg-gradient-to-b from-white/10 via-white/0 to-white/0",
        vignetteDark: "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(52,211,153,0.10)_0%,rgba(0,0,0,0)_55%),radial-gradient(120%_120%_at_100%_120%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_60%)]",
        tintBlob: "rgba(52,211,153,0.14)",
      },

      New: {
        // Light
        cardLight: "bg-white border border-gray-200/70 shadow-sm",
        ringLight: "ring-1 ring-[#fbbf24]/18",
        badgeLight: "bg-[#fef9c3] text-[#92400e] border border-[#fde68a]/70",
        iconLight: "bg-gradient-to-br from-[#facc15] to-[#f59e0b] text-white",
        progressLight: "bg-gradient-to-r from-[#facc15] to-[#f59e0b]",

        // Dark (Amber)
        cardDark:
          "bg-gradient-to-br from-[#0B1220] via-[#070A12] to-[#161006] border border-white/10",
        ringDark: "ring-1 ring-[#fbbf24]/22",
        badgeDark: "bg-[#1b1206]/70 text-[#fde68a] border border-[#fbbf24]/20",
        iconDark:
          "bg-gradient-to-br from-[#fde68a] via-[#f59e0b] to-[#b45309] text-white",
        progressDark: "bg-gradient-to-r from-[#fde68a] via-[#f59e0b] to-[#b45309]",
        glowDark: "shadow-[0_18px_55px_-28px_rgba(251,191,36,0.58)]",
        gridDark:
          "opacity-22 [background:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[18px_18px]",

        insetDark: "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        sheenDark: "bg-gradient-to-b from-white/10 via-white/0 to-white/0",
        vignetteDark: "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(251,191,36,0.09)_0%,rgba(0,0,0,0)_55%),radial-gradient(120%_120%_at_100%_120%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_60%)]",
        tintBlob: "rgba(251,191,36,0.12)",
      },

      Stopped: {
        // Light
        cardLight: "bg-white border border-gray-200/70 shadow-sm",
        ringLight: "ring-1 ring-[#fb7185]/18",
        badgeLight: "bg-[#ffe4e6] text-[#9f1239] border border-[#fda4af]/70",
        iconLight: "bg-gradient-to-br from-[#fb7185] to-[#ef4444] text-white",
        progressLight: "bg-gradient-to-r from-[#fb7185] to-[#ef4444]",

        // Dark (Rose/Red)
        cardDark:
          "bg-gradient-to-br from-[#0B1220] via-[#070A12] to-[#16070d] border border-white/10",
        ringDark: "ring-1 ring-[#fb7185]/22",
        badgeDark: "bg-[#2a0f0b]/70 text-[#fda4af] border border-[#fb7185]/20",
        iconDark:
          "bg-gradient-to-br from-[#fda4af] via-[#fb7185] to-[#be123c] text-white",
        progressDark: "bg-gradient-to-r from-[#fda4af] via-[#fb7185] to-[#be123c]",
        glowDark: "shadow-[0_18px_55px_-28px_rgba(251,113,133,0.64)]",
        gridDark:
          "opacity-22 [background:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[18px_18px]",

        insetDark: "shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        sheenDark: "bg-gradient-to-b from-white/10 via-white/0 to-white/0",
        vignetteDark: "bg-[radial-gradient(120%_120%_at_10%_0%,rgba(251,113,133,0.10)_0%,rgba(0,0,0,0)_55%),radial-gradient(120%_120%_at_100%_120%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_60%)]",
        tintBlob: "rgba(251,113,133,0.14)",
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
      {/* HERO */}
      <div
        className={[
          "relative rounded-[26px] px-6 sm:px-8 pt-7 sm:pt-8 pb-28 sm:pb-32 overflow-hidden",
          "bg-[#26224b] text-white",
          "dark:bg-linear-to-br dark:from-[#070A12] dark:via-[#0A1020] dark:to-[#070A12] dark:text-white",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -top-28 right-6 h-72 w-72 rounded-full bg-[#6f5be8]/18 blur-3xl hidden dark:block" />
        <div className="pointer-events-none absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-[#38bdf8]/12 blur-3xl hidden dark:block" />

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

      {/* CARDS */}
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
                  "relative rounded-[22px] overflow-hidden transition-all duration-200 ease-out",
                  "hover:-translate-y-0.5",
                  // Light
                  theme.cardLight,
                  theme.ringLight,
                  // Dark base
                  "dark:" + theme.cardDark,
                  "dark:" + theme.ringDark,
                  "dark:" + theme.glowDark,
                  // NEW: inner highlight to make background pop
                  "dark:" + theme.insetDark,
                ].join(" ")}
              >
                {/* NEW: top sheen (ทำให้พื้นหลังดูมีมิติขึ้น) */}
                <div className={["pointer-events-none absolute inset-x-0 top-0 h-20 hidden dark:block", theme.sheenDark].join(" ")} />

                {/* dark vignette overlay (ทำให้เข้มแบบพรีเมียม) */}
                <div className={["pointer-events-none absolute inset-0 hidden dark:block", theme.vignetteDark].join(" ")} />

                {/* dark grid overlay */}
                <div className={["pointer-events-none absolute inset-0 hidden dark:block", theme.gridDark].join(" ")} />

                {/* corner tint blob (เด่นขึ้นนิด) */}
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl hidden dark:block"
                  style={{ background: theme.tintBlob }}
                />

                <div className="relative p-4 sm:p-5">
                  {/* top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-semibold text-gray-800 dark:text-white/85">
                          {s.title}
                        </p>

                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.75 text-[11px] font-medium backdrop-blur",
                            theme.badgeLight,
                            "dark:" + theme.badgeDark,
                          ].join(" ")}
                        >
                          {loading ? "Loading" : `${percent}%`}
                        </span>
                      </div>

                      <p className="mt-1 text-[12.5px] text-gray-600 dark:text-white/55">
                        {s.changeText}
                      </p>
                    </div>

                    <div
                      className={[
                        "h-10 w-10 rounded-2xl flex items-center justify-center text-[18px]",
                        theme.iconLight,
                        "dark:" + theme.iconDark,
                      ].join(" ")}
                    >
                      {s.icon}
                    </div>
                  </div>

                  {/* value */}
                  <p className="mt-4 text-[32px] sm:text-[34px] font-semibold tracking-tight text-gray-900 dark:text-white tabular-nums">
                    {s.value}
                  </p>

                  {/* sub info */}
                  <p className="mt-1 text-[12px] text-gray-600 dark:text-white/55">
                    {loading ? (
                      "Fetching tasks..."
                    ) : (
                      <>
                        <span className="font-medium text-gray-800 dark:text-white/80">
                          {count.toLocaleString()}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-800 dark:text-white/80">
                          {totalTasks.toLocaleString()}
                        </span>{" "}
                        tasks
                      </>
                    )}
                  </p>

                  {/* progress bar */}
                  <div className="mt-3">
                    <div className="h-2.25 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-500",
                          theme.progressLight,
                          "dark:" + theme.progressDark,
                        ].join(" ")}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-gray-500 dark:text-white/45">
                    {loading ? "Syncing latest status..." : "Updated from latest API snapshot"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-3 sm:h-4" />
      </div>
    </section>
  );
};

export default StatusTarget;