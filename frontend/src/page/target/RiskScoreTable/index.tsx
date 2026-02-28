import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiMoreHorizontal, FiActivity, FiChevronDown } from "react-icons/fi";
import { MdRouter, MdDevices, MdImportantDevices, MdMemory, MdSecurity } from "react-icons/md";
import { ListAssetRisk, type AssetRiskDTO } from "../../../services";

type RangeKey = "This Month" | "This Year";
const RANGE_OPTIONS: RangeKey[] = ["This Month", "This Year"];

type Row = {
  id: string;
  name: string;
  vulnTotal: number;
  mac: string;
  risk: number;
  iconIndex: number;
};

const DEVICE_ICONS = [
  {
    Icon: MdRouter,
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
    fg: "text-cyan-600 dark:text-cyan-300",
    ring: "border-cyan-200/80 dark:border-cyan-400/20",
  },
  {
    Icon: MdDevices,
    bg: "bg-slate-100 dark:bg-white/8",
    fg: "text-slate-700 dark:text-white/80",
    ring: "border-slate-200/80 dark:border-white/10",
  },
  {
    Icon: MdImportantDevices,
    bg: "bg-violet-50 dark:bg-violet-500/10",
    fg: "text-violet-600 dark:text-violet-300",
    ring: "border-violet-200/80 dark:border-violet-400/20",
  },
  {
    Icon: MdMemory,
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    fg: "text-emerald-600 dark:text-emerald-300",
    ring: "border-emerald-200/80 dark:border-emerald-400/20",
  },
  {
    Icon: MdSecurity,
    bg: "bg-orange-50 dark:bg-orange-500/10",
    fg: "text-orange-600 dark:text-orange-300",
    ring: "border-orange-200/80 dark:border-orange-400/20",
  },
];

const stableIconIndex = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % DEVICE_ICONS.length;
};

const formatNumber = (n: number) => (!Number.isFinite(n) ? "0" : n.toLocaleString());
const formatRisk = (n: number) => (!Number.isFinite(n) ? "0.00" : n.toFixed(2));

const getRiskMeta = (value: number, max: number) => {
  const ratio = max > 0 ? value / max : 0;
  const level = Math.min(5, Math.max(1, Math.ceil(ratio * 5)));

  if (level <= 2) {
    return {
      label: "Low",
      dot: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-300",
      chip:
        "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-300",
      bar: "linear-gradient(90deg, #86efac 0%, #22c55e 100%)",
    };
  }

  if (level === 3) {
    return {
      label: "Medium",
      dot: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-300",
      chip:
        "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-400/20 dark:text-yellow-300",
      bar: "linear-gradient(90deg, #fde68a 0%, #eab308 100%)",
    };
  }

  if (level === 4) {
    return {
      label: "High",
      dot: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-300",
      chip:
        "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-400/20 dark:text-orange-300",
      bar: "linear-gradient(90deg, #fdba74 0%, #f97316 100%)",
    };
  }

  return {
    label: "Critical",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-300",
    chip:
      "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300",
    bar: "linear-gradient(90deg, #fb7185 0%, #ef4444 100%)",
  };
};

const DangerDots: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const ratio = max > 0 ? value / max : 0;
  const level = Math.min(5, Math.max(1, Math.ceil(ratio * 5)));

  const cls = (i: number) => {
    if (i > level) return "bg-gray-200 dark:bg-white/10";
    if (level <= 2) return "bg-[#22c55e]";
    if (level === 3) return "bg-[#eab308]";
    if (level === 4) return "bg-[#f97316]";
    return "bg-[#ef4444]";
  };

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-full ${cls(i + 1)}`} />
      ))}
    </div>
  );
};

const RiskScoreTable: React.FC = () => {
  const [range, setRange] = useState<RangeKey>("This Month");
  const [open, setOpen] = useState(false);

  const [data, setData] = useState<AssetRiskDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const { rows, maxRisk } = useMemo(() => {
    const list = data ?? [];
    const max = list.reduce((m, x) => Math.max(m, Number(x.risk_score) || 0), 0);

    const mapped: Row[] = list.map((x, idx) => {
      const name = x.task_name ?? "-";
      const mac = x.mac_address ?? "";
      const vuln = Number(x.vulnerability_total) || 0;
      const risk = Number(x.risk_score) || 0;

      return {
        id: `${mac || name}-${idx}`,
        name,
        vulnTotal: vuln,
        mac,
        risk,
        iconIndex: stableIconIndex(`${mac}-${name}`),
      };
    });

    mapped.sort((a, b) => {
      if (b.risk !== a.risk) return b.risk - a.risk;
      if (b.vulnTotal !== a.vulnTotal) return b.vulnTotal - a.vulnTotal;
      return a.name.localeCompare(b.name);
    });

    return { rows: mapped, maxRisk: max };
  }, [data, range]);

  return (
    <section
      className={[
        "relative overflow-hidden h-full rounded-3xl p-4 sm:p-5 md:p-6 flex flex-col",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              

              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
                Top Devices Risk
              </h2>
              <p className="mt-1 text-[12.5px] text-gray-500 dark:text-white/55">
                Ranked device exposure from the latest security scan snapshot
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpen((s) => !s)}
                  className={[
                    "h-10 px-4 rounded-2xl inline-flex items-center gap-2 transition",
                    "bg-white border border-gray-200/80 text-[13px] font-medium text-gray-600 hover:bg-gray-50",
                    "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10",
                  ].join(" ")}
                >
                  {range}
                  <FiChevronDown
                    className={`text-[14px] text-gray-400 dark:text-white/45 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20 dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                    {RANGE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setRange(opt);
                          setOpen(false);
                        }}
                        className={[
                          "w-full text-left px-4 py-3 text-[13px] transition",
                          range === opt
                            ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                            : "text-gray-600 hover:bg-gray-50 dark:text-white/70 dark:hover:bg-white/8",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
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
          </div>

          {/* status bar */}
          <div
            className={[
              "rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3",
              "bg-slate-50 border border-slate-200/80",
              "dark:bg-white/4 dark:border-white/10",
            ].join(" ")}
          >
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
              </span>
              <span className="text-[12px] font-medium text-slate-700 dark:text-white/75">
                Risk telemetry active
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-white/10" />

            <div className="inline-flex items-center gap-2 text-[12px] text-slate-500 dark:text-white/50">
              <FiActivity className="text-cyan-500" />
              Risk score, vulnerability count, and device exposure ranking
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-4 flex-1">
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
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-11 w-11 rounded-2xl bg-gray-200 dark:bg-white/10" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-44 rounded bg-gray-200 dark:bg-white/10" />
                        <div className="mt-2 h-3 w-60 rounded bg-gray-200 dark:bg-white/10" />
                      </div>
                    </div>
                    <div className="h-8 w-24 rounded bg-gray-200 dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="py-8 text-[13px] text-gray-500 dark:text-white/55">No Data</div>
          ) : (
            <div className="space-y-3">
              {rows.map((p) => {
                const { Icon, bg, fg, ring } = DEVICE_ICONS[p.iconIndex];
                const riskMeta = getRiskMeta(p.risk, maxRisk);
                const barPercent = maxRisk > 0 ? (p.risk / maxRisk) * 100 : 0;

                return (
                  <div
                    key={p.id}
                    className={[
                      "rounded-2xl px-3.5 sm:px-4 py-3.5 border transition-all duration-200",
                      "border-gray-200/80 bg-white hover:shadow-sm",
                      "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.07]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* left */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={[
                            "h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0",
                            bg,
                            ring,
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          <Icon className={`${fg} text-[22px]`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="truncate text-[15px] sm:text-[16px] font-semibold text-[#1f2240] dark:text-white/85">
                              {p.name}
                            </p>

                            <span
                              className={[
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                                riskMeta.chip,
                              ].join(" ")}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${riskMeta.dot}`} />
                              {riskMeta.label}
                            </span>
                          </div>

                          <p className="mt-1 text-[12.5px] sm:text-[13px] text-gray-500 dark:text-white/55 truncate">
                            {formatNumber(p.vulnTotal)} Vulns • {p.mac || "No MAC"}
                          </p>

                          <div className="mt-2">
                            <div className="h-2.5 rounded-full bg-[#eef0f6] dark:bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(barPercent, p.risk > 0 ? 6 : 0)}%`,
                                  background: riskMeta.bar,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* right */}
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <div className="text-right">
                          <p className={`text-[15px] sm:text-[16px] font-semibold tabular-nums ${riskMeta.text}`}>
                            {formatRisk(p.risk)}
                          </p>
                          <p className="text-[11.5px] text-gray-400 dark:text-white/45">Risk Score</p>
                        </div>

                        <DangerDots value={p.risk} max={maxRisk} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RiskScoreTable;