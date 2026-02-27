// TableTarget.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
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
  { Icon: MdRouter, bg: "bg-[#e8f4ff] dark:bg-[#0b2a3a]", fg: "text-[#0284c7] dark:text-[#7dd3fc]" },
  { Icon: MdDevices, bg: "bg-[#eef0f6] dark:bg-white/8", fg: "text-[#1f2240] dark:text-white/80" },
  { Icon: MdImportantDevices, bg: "bg-[#f1edff] dark:bg-[#1a1630]", fg: "text-[#6f5be8] dark:text-[#bcaefb]" },
  { Icon: MdMemory, bg: "bg-[#ecfdf3] dark:bg-[#062316]", fg: "text-[#16a34a] dark:text-[#86efac]" },
  { Icon: MdSecurity, bg: "bg-[#ffe7e3] dark:bg-[#2a0f0b]", fg: "text-[#ff5c35] dark:text-[#fdba74]" },
];

const stableIconIndex = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % DEVICE_ICONS.length;
};

const TableTarget: React.FC = () => {
  const [data, setData] = useState<DeviceRiskDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [openSort, setOpenSort] = useState(false);

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

  const rows: Row[] = useMemo(() => {
    const list = data ?? [];
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

  return (
    <section
      className={[
        "rounded-[22px] p-4 sm:p-5 md:p-6",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* Header + controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240] dark:text-white/90">
            Device vulnerability table
          </h2>
          <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-white/55 mt-1">
            No, Name, Firmware Version, Vulnerability Total, Progress, Risk Score
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/45" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / ip / firmware..."
              className={[
                "h-9 w-full sm:w-70 pl-9 pr-3 rounded-xl text-[13px] transition",
                "border border-gray-200/80 bg-white text-[#1f2240]",
                "focus:outline-none focus:ring-2 focus:ring-[#6f5be8]/20",
                "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35",
              ].join(" ")}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenSort((v) => !v)}
              className={[
                "h-9 px-3 rounded-xl inline-flex items-center gap-2 transition",
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
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200/80 bg-white shadow-sm p-2 z-10 dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                <button
                  type="button"
                  onClick={() => {
                    setSortOrder("desc");
                    setOpenSort(false);
                  }}
                  className={[
                    "w-full text-left px-3 py-2 rounded-xl text-[13px] transition",
                    "hover:bg-gray-50",
                    sortOrder === "desc"
                      ? "font-semibold text-[#1f2240]"
                      : "text-gray-700",
                    "dark:hover:bg-white/8 dark:text-white/70",
                    sortOrder === "desc" ? "dark:text-white/90" : "",
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
                    "hover:bg-gray-50",
                    sortOrder === "asc"
                      ? "font-semibold text-[#1f2240]"
                      : "text-gray-700",
                    "dark:hover:bg-white/8 dark:text-white/70",
                    sortOrder === "asc" ? "dark:text-white/90" : "",
                  ].join(" ")}
                >
                  Vuln Low → High
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="rounded-2xl overflow-hidden border border-gray-200/80 bg-white dark:border-white/10 dark:bg-white/5">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-6 px-4 py-3 bg-[#f1edff] text-[13px] font-semibold text-[#1f2240] dark:bg-white/8 dark:text-white/80">
          <div className="col-span-1">No</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Firmware Version</div>
          <div className="col-span-2 text-right pr-6">Vulnerability Total</div>
          <div className="col-span-1 pl-6">Progress</div>
          <div className="col-span-1 text-right">Risk Score</div>
        </div>

        {/* Body */}
        <div>
          {loading ? (
            <div className="px-4 py-6 text-[13px] text-gray-500 dark:text-white/55">
              Loading...
            </div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-6 text-[13px] text-gray-500 dark:text-white/55">
              No Data
            </div>
          ) : (
            rows.map((r, idx) => {
              const { Icon, bg, fg } = DEVICE_ICONS[r.iconIndex];

              return (
                <div
                  key={r.id}
                  className={[
                    "grid grid-cols-12 gap-6 px-4 py-4 items-start",
                    idx !== 0 ? "border-t border-gray-200/70 dark:border-white/10" : "",
                  ].join(" ")}
                >
                  <div className="col-span-1 text-[14px] font-semibold text-[#1f2240] dark:text-white/85">
                    {r.no}
                  </div>

                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div
                      className={[
                        "h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0",
                        "border-gray-200/80 dark:border-white/10",
                        bg,
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <Icon className={`${fg} text-[20px]`} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#1f2240] dark:text-white/85">
                        {r.name}
                      </p>
                      <p className="text-[12px] text-gray-500 dark:text-white/55 truncate">
                        {r.ip}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-4 text-[14px] text-gray-700 dark:text-white/70 whitespace-pre-wrap wrap-break-word">
                    {r.firmwareVersion}
                  </div>

                  <div className="col-span-2 text-right pr-6 text-[14px] font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
                    {formatNumber(r.vulnerabilityTotal)}
                  </div>

                  <div className="col-span-1 pl-6">
                    <div className="h-2.5 w-full rounded-full bg-[#efeefd] dark:bg-white/10 overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full bg-[#6f5be8]"
                        style={{ width: `${r.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="col-span-1 text-right text-[14px] font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
                    {formatRisk(r.riskScore)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* overlay ปิด dropdown */}
      {openSort && (
        <button
          type="button"
          onClick={() => setOpenSort(false)}
          className="fixed inset-0 z-5 cursor-default"
          aria-label="Close sort overlay"
        />
      )}
    </section>
  );
};

export default TableTarget;