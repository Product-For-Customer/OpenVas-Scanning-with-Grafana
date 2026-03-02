import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiChevronDown, FiShield, FiRadio, FiActivity } from "react-icons/fi";
import {
  MdRouter,
  MdDevices,
  MdImportantDevices,
  MdMemory,
  MdSecurity,
} from "react-icons/md";
import { ListDeviceRisk, type DeviceRiskDTO } from "../../../services";

type SortOrder = "desc" | "asc";

type Row = {
  id: string;
  no: number;
  name: string;
  ip: string;
  firmwareVersion: string;
  vulnerabilityTotal: number;
  progressPercent: number;
  riskScore: number;
  iconIndex: number;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const formatNumber = (n: number) => (!Number.isFinite(n) ? "0" : n.toLocaleString());
const formatRisk = (n: number) => (!Number.isFinite(n) ? "0.00" : n.toFixed(2));

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

const getRiskMeta = (risk: number) => {
  if (risk >= 8) {
    return {
      label: "Critical",
      text: "text-red-600 dark:text-red-300",
      chip:
        "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300",
      bar: "linear-gradient(90deg, #fb7185 0%, #ef4444 100%)",
    };
  }

  if (risk >= 6) {
    return {
      label: "High",
      text: "text-orange-600 dark:text-orange-300",
      chip:
        "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-400/20 dark:text-orange-300",
      bar: "linear-gradient(90deg, #fdba74 0%, #f97316 100%)",
    };
  }

  if (risk >= 4) {
    return {
      label: "Medium",
      text: "text-yellow-700 dark:text-yellow-300",
      chip:
        "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-400/20 dark:text-yellow-300",
      bar: "linear-gradient(90deg, #fde68a 0%, #eab308 100%)",
    };
  }

  if (risk > 0) {
    return {
      label: "Low",
      text: "text-emerald-700 dark:text-emerald-300",
      chip:
        "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-300",
      bar: "linear-gradient(90deg, #86efac 0%, #22c55e 100%)",
    };
  }

  return {
    label: "Info",
    text: "text-blue-700 dark:text-blue-300",
    chip:
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-400/20 dark:text-blue-300",
    bar: "linear-gradient(90deg, #7dd3fc 0%, #38bdf8 100%)",
  };
};

const TableTarget: React.FC = () => {
  const [data, setData] = useState<DeviceRiskDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [openSort, setOpenSort] = useState(false);

  const sortRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const res = await ListDeviceRisk();
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
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target as Node)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const rows: Row[] = useMemo(() => {
  const list = Array.isArray(data) ? data : [];
  const maxRisk = list.reduce((m, x) => Math.max(m, Number(x.risk_score) || 0), 0);

    const mapped: Row[] = list.map((x, idx) => {
      const risk = Number(x.risk_score) || 0;
      const vuln = Number(x.vulnerability_total) || 0;
      const progressPercent = maxRisk > 0 ? (risk / maxRisk) * 100 : 0;

      const name = x.task_name ?? "-";
      const ip = x.ip_address ?? "-";
      const fw = (x.firmware_version ?? "Unknown Device").trim() || "Unknown Device";
      const iconIndex = stableIconIndex(`${ip}-${name}`);

      return {
        id: `${ip}-${idx}`,
        no: idx + 1,
        name,
        ip,
        firmwareVersion: fw,
        vulnerabilityTotal: vuln,
        progressPercent: clamp(progressPercent, 0, 100),
        riskScore: risk,
        iconIndex,
      };
    });

    const q = search.trim().toLowerCase();
    const filtered =
      q.length === 0
        ? mapped
        : mapped.filter((r) => {
            return (
              r.name.toLowerCase().includes(q) ||
              r.ip.toLowerCase().includes(q) ||
              r.firmwareVersion.toLowerCase().includes(q)
            );
          });

    filtered.sort((a, b) => {
      const diff = b.vulnerabilityTotal - a.vulnerabilityTotal;
      return sortOrder === "desc" ? diff : -diff;
    });

    return filtered.map((r, i) => ({ ...r, no: i + 1 }));
  }, [data, search, sortOrder]);

  const stats = useMemo(() => {
    const list = data ?? [];
    const totalTargets = list.length;
    const totalVulns = list.reduce((sum, x) => sum + (Number(x.vulnerability_total) || 0), 0);
    const highestRisk = list.reduce((m, x) => Math.max(m, Number(x.risk_score) || 0), 0);

    return { totalTargets, totalVulns, highestRisk };
  }, [data]);

  return (
    <section
      className={[
        "relative overflow-hidden rounded-3xl p-4 sm:p-5 md:p-6",
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

      <div className="relative z-10">
        {/* Header + controls */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
                    "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
                  ].join(" ")}
                >
                  <FiShield className="text-[13px]" />
                  <span className="text-[12px] font-semibold tracking-wide">
                    Target Scan Console
                  </span>
                </div>

                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-slate-50 text-slate-600 border border-slate-200/80",
                    "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                  ].join(" ")}
                >
                  <FiRadio className="text-[12px] text-cyan-500" />
                  <span className="text-[12px] font-medium">
                    {loading ? "Scanner Syncing" : `${stats.totalTargets} targets loaded`}
                  </span>
                </div>

                <div
                  className={[
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                    "bg-slate-50 text-slate-600 border border-slate-200/80",
                    "dark:bg-white/5 dark:text-white/65 dark:border-white/10",
                  ].join(" ")}
                >
                  <FiActivity className="text-[12px] text-violet-500" />
                  <span className="text-[12px] font-medium">
                    {loading ? "Loading telemetry..." : `${stats.totalVulns.toLocaleString()} total vulns`}
                  </span>
                </div>
              </div>

              <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240] dark:text-white/90">
                Device Vulnerability Table
              </h2>
              <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-white/55 mt-1">
                Monitored targets, firmware details, vulnerability totals, and live risk posture
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/45" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search target / ip / firmware..."
                  className={[
                    "h-10 w-full sm:w-72 pl-10 pr-3 rounded-2xl text-[13px] transition",
                    "border border-gray-200/80 bg-white text-[#1f2240]",
                    "focus:outline-none focus:ring-2 focus:ring-cyan-500/20",
                    "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35",
                  ].join(" ")}
                />
              </div>

              {/* Sort */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setOpenSort((v) => !v)}
                  className={[
                    "h-10 px-4 rounded-2xl inline-flex items-center gap-2 transition",
                    "border border-gray-200/80 bg-white text-[13px] font-semibold text-[#1f2240] hover:bg-gray-50 active:bg-gray-100",
                    "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:active:bg-white/15",
                  ].join(" ")}
                  title="Sort by Vulnerability Total"
                >
                  Sort: Vuln {sortOrder === "desc" ? "High → Low" : "Low → High"}
                  <FiChevronDown
                    className={`transition ${openSort ? "rotate-180" : ""} text-gray-500 dark:text-white/55`}
                  />
                </button>

                {openSort && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200/80 bg-white shadow-sm p-2 z-20 dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                    <button
                      type="button"
                      onClick={() => {
                        setSortOrder("desc");
                        setOpenSort(false);
                      }}
                      className={[
                        "w-full text-left px-3 py-2 rounded-xl text-[13px] transition",
                        "hover:bg-gray-50 dark:hover:bg-white/8",
                        sortOrder === "desc"
                          ? "font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/10"
                          : "text-gray-700 dark:text-white/70",
                      ].join(" ")}
                    >
                      Vuln High → Low
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSortOrder("asc");
                        setOpenSort(false);
                      }}
                      className={[
                        "w-full text-left px-3 py-2 rounded-xl text-[13px] transition",
                        "hover:bg-gray-50 dark:hover:bg-white/8",
                        sortOrder === "asc"
                          ? "font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/10"
                          : "text-gray-700 dark:text-white/70",
                      ].join(" ")}
                    >
                      Vuln Low → High
                    </button>
                  </div>
                )}
              </div>
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
                Target telemetry active
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-white/10" />

            <div className="text-[12px] text-slate-500 dark:text-white/50">
              Highest risk score:{" "}
              <span className="font-semibold text-slate-700 dark:text-white/80">
                {loading ? "..." : formatRisk(stats.highestRisk)}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden xl:block rounded-2xl overflow-hidden border border-gray-200/80 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-white/4">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-6 px-4 py-3 bg-[#eef6ff] text-[13px] font-semibold text-[#1f2240] dark:bg-white/8 dark:text-white/80">
            <div className="col-span-1">No</div>
            <div className="col-span-3">Target</div>
            <div className="col-span-4">Firmware Version</div>
            <div className="col-span-1 text-right">Vulns</div>
            <div className="col-span-2">Scan Intensity</div>
            <div className="col-span-1 text-right">Risk</div>
          </div>

          <div>
            {loading ? (
              <div className="px-4 py-6 text-[13px] text-gray-500 dark:text-white/55">Loading...</div>
            ) : rows.length === 0 ? (
              <div className="px-4 py-6 text-[13px] text-gray-500 dark:text-white/55">No Data</div>
            ) : (
              rows.map((r, idx) => {
                const { Icon, bg, fg, ring } = DEVICE_ICONS[r.iconIndex];
                const riskMeta = getRiskMeta(r.riskScore);

                return (
                  <div
                    key={r.id}
                    className={[
                      "grid grid-cols-12 gap-6 px-4 py-4 items-start transition-colors",
                      idx !== 0 ? "border-t border-gray-200/70 dark:border-white/10" : "",
                      "hover:bg-cyan-50/40 dark:hover:bg-white/3",
                    ].join(" ")}
                  >
                    <div className="col-span-1 text-[14px] font-semibold text-[#1f2240] dark:text-white/85">
                      {r.no}
                    </div>

                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div
                        className={[
                          "h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0",
                          bg,
                          ring,
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        <Icon className={`${fg} text-[20px]`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="truncate text-[14px] font-semibold text-[#1f2240] dark:text-white/85">
                            {r.name}
                          </p>
                          <span
                            className={[
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                              riskMeta.chip,
                            ].join(" ")}
                          >
                            {riskMeta.label}
                          </span>
                        </div>

                        <p className="text-[12px] text-gray-500 dark:text-white/55 truncate">
                          {r.ip}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-4 text-[14px] text-gray-700 dark:text-white/70 wrap-break-word">
                      {r.firmwareVersion}
                    </div>

                    <div className="col-span-1 text-right text-[14px] font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
                      {formatNumber(r.vulnerabilityTotal)}
                    </div>

                    <div className="col-span-2">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-white/45">
                        <span>Scan level</span>
                        <span>{Math.round(r.progressPercent)}%</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-[#eef0f6] dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${r.progressPercent}%`,
                            background: riskMeta.bar,
                          }}
                        />
                      </div>
                    </div>

                    <div className={`col-span-1 text-right text-[14px] font-semibold tabular-nums ${riskMeta.text}`}>
                      {formatRisk(r.riskScore)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Mobile / Tablet cards */}
        <div className="xl:hidden space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-gray-200/80 bg-white px-4 py-6 text-[13px] text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/55">
              Loading...
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-gray-200/80 bg-white px-4 py-6 text-[13px] text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/55">
              No Data
            </div>
          ) : (
            rows.map((r) => {
              const { Icon, bg, fg, ring } = DEVICE_ICONS[r.iconIndex];
              const riskMeta = getRiskMeta(r.riskScore);

              return (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-200/80 bg-white px-4 py-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={[
                        "h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0",
                        bg,
                        ring,
                      ].join(" ")}
                    >
                      <Icon className={`${fg} text-[20px]`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[14px] font-semibold text-[#1f2240] dark:text-white/85">
                          {r.name}
                        </p>
                        <span className="text-[12px] font-semibold text-gray-400 dark:text-white/40">
                          #{r.no}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-[12px] text-gray-500 dark:text-white/55">
                        {r.ip}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                            riskMeta.chip,
                          ].join(" ")}
                        >
                          {riskMeta.label}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-white/45">
                          {formatNumber(r.vulnerabilityTotal)} Vulns
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-[13px] text-gray-700 dark:text-white/70 wrap-break-word">
                    {r.firmwareVersion}
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-white/45">
                      <span>Scan intensity</span>
                      <span>{Math.round(r.progressPercent)}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#eef0f6] dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${r.progressPercent}%`,
                          background: riskMeta.bar,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[12px] text-gray-500 dark:text-white/45">Risk Score</span>
                    <span className={`text-[14px] font-semibold tabular-nums ${riskMeta.text}`}>
                      {formatRisk(r.riskScore)}
                    </span>
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

export default TableTarget;