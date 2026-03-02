import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FiShield,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";
import type { VulnerabilityLevelDTO } from "../../../services";
import { ListVulnerability } from "../../../services";

type VulnRow = {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  count: number;
};

const badgeClasses: Record<VulnRow["severity"], string> = {
  CRITICAL:
    "bg-[#ef4444] text-white shadow-[0_8px_20px_rgba(239,68,68,0.25)]",
  HIGH: "bg-[#f97316] text-white shadow-[0_8px_20px_rgba(249,115,22,0.22)]",
  MEDIUM:
    "bg-[#eab308] text-white shadow-[0_8px_20px_rgba(234,179,8,0.20)]",
  LOW: "bg-[#22c55e] text-white shadow-[0_8px_20px_rgba(34,197,94,0.20)]",
  INFO: "bg-[#3b82f6] text-white shadow-[0_8px_20px_rgba(59,130,246,0.22)]",
};

const dotClasses: Record<VulnRow["severity"], string> = {
  CRITICAL: "bg-[#ef4444]",
  HIGH: "bg-[#f97316]",
  MEDIUM: "bg-[#eab308]",
  LOW: "bg-[#22c55e]",
  INFO: "bg-[#3b82f6]",
};

const rowGlowClasses: Record<VulnRow["severity"], string> = {
  CRITICAL:
    "hover:border-red-200 hover:bg-red-50/60 dark:hover:border-red-400/20 dark:hover:bg-red-500/5",
  HIGH: "hover:border-orange-200 hover:bg-orange-50/60 dark:hover:border-orange-400/20 dark:hover:bg-orange-500/5",
  MEDIUM:
    "hover:border-yellow-200 hover:bg-yellow-50/60 dark:hover:border-yellow-400/20 dark:hover:bg-yellow-500/5",
  LOW: "hover:border-green-200 hover:bg-green-50/60 dark:hover:border-green-400/20 dark:hover:bg-green-500/5",
  INFO: "hover:border-blue-200 hover:bg-blue-50/60 dark:hover:border-blue-400/20 dark:hover:bg-blue-500/5",
};

const toSeverity = (
  level: VulnerabilityLevelDTO["level"]
): VulnRow["severity"] => {
  switch (level) {
    case "Critical":
      return "CRITICAL";
    case "High":
      return "HIGH";
    case "Medium":
      return "MEDIUM";
    case "Low":
      return "LOW";
    default:
      return "INFO";
  }
};

const severityRank: Record<VulnRow["severity"], number> = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  INFO: 5,
};

const TARGET_VISIBLE_ROWS = 6;
const LIST_GAP_PX = 12; // space-y-3 = 0.75rem = 12px
const SCROLL_PADDING_PX = 28; // p-3 / p-3.5 โดยประมาณ เผื่อด้านบนล่าง

const TopVulnerability: React.FC = () => {
  const [data, setData] = useState<VulnerabilityLevelDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [listHeight, setListHeight] = useState<number | undefined>(undefined);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const res = await ListVulnerability();
      if (!mounted) return;
      setData(res);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const rows: VulnRow[] = useMemo(() => {
    const list = data ?? [];

    const map = new Map<
      string,
      { title: string; count: number; topSeverity: VulnRow["severity"] }
    >();

    for (const item of list) {
      const titleRaw = (item.vulnerability_name ?? "").trim();
      if (!titleRaw) continue;

      const key = titleRaw.toLowerCase();
      const sev = toSeverity(item.level);
      const cnt = Number(item.total ?? 0);

      const prev = map.get(key);
      if (!prev) {
        map.set(key, { title: titleRaw, count: cnt, topSeverity: sev });
      } else {
        prev.count += cnt;
        if (severityRank[sev] < severityRank[prev.topSeverity]) {
          prev.topSeverity = sev;
        }
      }
    }

    const merged: VulnRow[] = Array.from(map.entries()).map(([key, v]) => ({
      id: key,
      severity: v.topSeverity,
      title: v.title,
      count: v.count,
    }));

    merged.sort((a, b) => {
      const s = severityRank[a.severity] - severityRank[b.severity];
      if (s !== 0) return s;
      if (b.count !== a.count) return b.count - a.count;
      return a.title.localeCompare(b.title);
    });

    return merged;
  }, [data]);

  const topCriticalCount = useMemo(
    () => rows.filter((r) => r.severity === "CRITICAL").length,
    [rows]
  );

  const statusText = useMemo(() => {
    if (loading) return "Syncing threat feed...";
    if (rows.length === 0) return "No vulnerability signatures detected";
    if (topCriticalCount > 0) {
      return `${topCriticalCount} critical threats require attention`;
    }
    return "Latest vulnerability queue loaded";
  }, [loading, rows.length, topCriticalCount]);

  useLayoutEffect(() => {
    const updateHeights = () => {
      const sectionEl = sectionRef.current;
      const headerEl = headerRef.current;
      const rowEl = firstRowRef.current;

      if (!sectionEl || !headerEl) {
        setListHeight(undefined);
        return;
      }

      const sectionRect = sectionEl.getBoundingClientRect();
      const headerRect = headerEl.getBoundingClientRect();

      const availableHeight = Math.max(
        sectionRect.height - headerRect.height,
        160
      );

      if (!rowEl) {
        setListHeight(availableHeight);
        return;
      }

      const rowRect = rowEl.getBoundingClientRect();
      const singleRowHeight = rowRect.height || 64;

      const tenRowsHeight =
        singleRowHeight * TARGET_VISIBLE_ROWS +
        LIST_GAP_PX * (TARGET_VISIBLE_ROWS - 1) +
        SCROLL_PADDING_PX;

      setListHeight(Math.min(availableHeight, tenRowsHeight));
    };

    updateHeights();

    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    if (sectionRef.current) resizeObserver.observe(sectionRef.current);
    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (firstRowRef.current) resizeObserver.observe(firstRowRef.current);

    window.addEventListener("resize", updateHeights);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeights);
    };
  }, [rows, loading]);

  return (
    <section
      ref={sectionRef}
      className={[
        "relative h-full min-h-0 overflow-hidden rounded-[22px] p-4 sm:p-5 md:p-6",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
        "flex flex-col",
      ].join(" ")}
    >
      {/* background */}
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

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        {/* Header */}
        <div ref={headerRef} className="mb-4 flex shrink-0 flex-col gap-3">
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
                    Threat Feed
                  </span>
                </div>
              </div>

              <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240] dark:text-white/90">
                Top Vulnerabilities
              </h3>
              <p className="mt-1 text-[12.5px] text-gray-500 dark:text-white/55">
                {statusText}
              </p>
            </div>

            {!loading && topCriticalCount > 0 ? (
              <div
                className={[
                  "shrink-0 inline-flex items-center gap-2 rounded-2xl px-3 py-2",
                  "bg-red-50 border border-red-200 text-red-600",
                  "dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300",
                ].join(" ")}
              >
                <FiAlertTriangle className="text-[14px]" />
                <span className="text-[12px] font-semibold">
                  {topCriticalCount} Critical
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* List */}
        <div
          className={[
            "min-h-0 w-full rounded-2xl overflow-hidden",
            "border border-gray-200/80 bg-white/70 backdrop-blur-sm",
            "dark:border-white/10 dark:bg-white/3",
          ].join(" ")}
          style={{
            height: listHeight ? `${listHeight}px` : undefined,
            maxHeight: "100%",
          }}
        >
          <div className="h-full overflow-y-auto p-3 sm:p-3.5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={[
                      "rounded-2xl border px-4 py-3 animate-pulse",
                      "border-gray-200 bg-gray-50/80",
                      "dark:border-white/10 dark:bg-white/4",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-20 rounded-md bg-gray-200 dark:bg-white/10" />
                      <div className="h-4 flex-1 rounded bg-gray-200 dark:bg-white/10" />
                      <div className="h-7 w-10 rounded-md bg-gray-200 dark:bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : rows.length === 0 ? (
              <div
                className={[
                  "rounded-2xl border px-4 py-8 text-center",
                  "border-gray-200 bg-gray-50/70 text-gray-500",
                  "dark:border-white/10 dark:bg-white/4 dark:text-white/55",
                ].join(" ")}
              >
                <div className="text-[14px] font-medium">No Data</div>
                <div className="mt-1 text-[12px] opacity-80">
                  No vulnerabilities were returned from the latest query
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {rows.map((r, index) => (
                  <div
                    key={r.id}
                    ref={index === 0 ? firstRowRef : undefined}
                    className={[
                      "group rounded-2xl border px-3.5 sm:px-4 py-3 transition-all duration-200",
                      "border-gray-200/80 bg-white hover:shadow-sm",
                      "dark:border-white/10 dark:bg-white/3 dark:hover:bg-white/5",
                      rowGlowClasses[r.severity],
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      {/* left colored line / dot */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${dotClasses[r.severity]}`}
                        />
                        <span
                          className={[
                            "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide",
                            badgeClasses[r.severity],
                          ].join(" ")}
                        >
                          {r.severity}
                        </span>
                      </div>

                      {/* title */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] sm:text-[14px] font-medium text-[#1f2240] dark:text-white/85">
                          {r.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400 dark:text-white/40">
                          <span>Vulnerability signature</span>
                          <span className="h-1 w-1 rounded-full bg-current" />
                          <span>Detected in scan results</span>
                        </div>
                      </div>

                      {/* count */}
                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={[
                            "h-8 min-w-8 px-2 rounded-lg border inline-flex items-center justify-center",
                            "text-[12px] font-semibold tabular-nums",
                            "border-gray-200 bg-[#fbfbfc] text-gray-700",
                            "dark:border-white/10 dark:bg-white/8 dark:text-white/75",
                          ].join(" ")}
                        >
                          {r.count}
                        </span>

                        <FiChevronRight className="text-gray-300 dark:text-white/20 group-hover:text-gray-500 dark:group-hover:text-white/45 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopVulnerability;