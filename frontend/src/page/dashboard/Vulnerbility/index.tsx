// TopVulnerability.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { VulnerabilityLevelDTO } from "../../../services";
import { ListVulnerability } from "../../../services";

type VulnRow = {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  count: number;
};

const badgeClasses: Record<VulnRow["severity"], string> = {
  CRITICAL: "bg-[#d94b3e] text-white",
  HIGH: "bg-[#f97316] text-white",
  MEDIUM: "bg-[#eab308] text-white",
  LOW: "bg-[#22c55e] text-white",
  INFO: "bg-[#3b82f6] text-white",
};

const toSeverity = (level: VulnerabilityLevelDTO["level"]): VulnRow["severity"] => {
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

const TopVulnerability: React.FC = () => {
  const [data, setData] = useState<VulnerabilityLevelDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <section
      className={[
        "rounded-[22px] p-4 sm:p-5 md:p-6 h-full",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold text-gray-400 dark:text-white/55 tracking-wide">
          TOP VULNERABILITIES
        </h3>

        {loading ? (
          <span className="text-[12px] text-gray-400 dark:text-white/45">Loading...</span>
        ) : (
          <span className="text-[12px] text-gray-400 dark:text-white/45">
            {rows.length > 0 ? `${rows.length} items` : "No Data"}
          </span>
        )}
      </div>

      <div
        className={[
          "rounded-2xl overflow-hidden",
          "border border-gray-200/80 bg-white",
          "dark:border-white/10 dark:bg-white/5",
        ].join(" ")}
      >
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-[13px] text-gray-500 dark:text-white/55">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="p-4 text-[13px] text-gray-500 dark:text-white/55">No Data</div>
          ) : (
            rows.map((r, idx) => (
              <div
                key={r.id}
                className={[
                  "flex items-center gap-3 px-3.5 sm:px-4 py-3",
                  idx !== 0 ? "border-t border-gray-200/70 dark:border-white/10" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold",
                    badgeClasses[r.severity],
                  ].join(" ")}
                >
                  {r.severity}
                </span>

                <p className="min-w-0 flex-1 truncate text-[13px] sm:text-[14px] font-medium text-[#1f2240] dark:text-white/85">
                  {r.title}
                </p>

                <span
                  className={[
                    "shrink-0 h-6 min-w-6 px-1.5 rounded-md border inline-flex items-center justify-center",
                    "text-[12px] tabular-nums",
                    "border-gray-200 bg-[#fbfbfc] text-gray-600",
                    "dark:border-white/10 dark:bg-white/8 dark:text-white/70",
                  ].join(" ")}
                >
                  {r.count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TopVulnerability;