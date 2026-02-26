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
  name: string; // task_name
  ip: string; // ip_address (subtitle)
  firmwareVersion: string;
  vulnerabilityTotal: number;
  progressPercent: number; // normalized by max risk
  riskScore: number;
  iconIndex: number; // 0..4
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

// ✅ 5 icons ที่เกี่ยวกับ device
const DEVICE_ICONS = [
  { Icon: MdRouter, bg: "bg-[#e8f4ff]", fg: "text-[#0284c7]" },
  { Icon: MdDevices, bg: "bg-[#eef0f6]", fg: "text-[#1f2240]" },
  { Icon: MdImportantDevices, bg: "bg-[#f1edff]", fg: "text-[#6f5be8]" },
  { Icon: MdMemory, bg: "bg-[#ecfdf3]", fg: "text-[#16a34a]" },
  { Icon: MdSecurity, bg: "bg-[#ffe7e3]", fg: "text-[#ff5c35]" },
];

const stableIconIndex = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % DEVICE_ICONS.length;
};

const TableTarget: React.FC = () => {
  const [data, setData] = useState<DeviceRiskDTO[] | null>(null);
  const [loading, setLoading] = useState(true);

  // controls
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

    // search
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

    // sort by vuln total
    filtered.sort((a, b) => {
      const diff = b.vulnerabilityTotal - a.vulnerabilityTotal;
      return sortOrder === "desc" ? diff : -diff;
    });

    // re-number
    return filtered.map((r, i) => ({ ...r, no: i + 1 }));
  }, [data, search, sortOrder]);

  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6">
      {/* Header + controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
            Device vulnerability table
          </h2>
          <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1">
            No, Name, Firmware Version, Vulnerability Total, Progress, Risk Score
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / ip / firmware..."
              className="
                h-9 w-full sm:w-70
                pl-9 pr-3
                rounded-xl border border-gray-200/80
                bg-white text-[13px] text-[#1f2240]
                focus:outline-none focus:ring-2 focus:ring-[#6f5be8]/20
              "
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenSort((v) => !v)}
              className="
                h-9 px-3 rounded-xl
                border border-gray-200/80 bg-white
                text-[13px] font-semibold text-[#1f2240]
                hover:bg-gray-50 active:bg-gray-100 transition
                inline-flex items-center gap-2
              "
              title="Sort by Vulnerability Total"
            >
              Sort: Vuln {sortOrder === "desc" ? "High → Low" : "Low → High"}
              <FiChevronDown className={`transition ${openSort ? "rotate-180" : ""}`} />
            </button>

            {openSort && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200/80 bg-white shadow-sm p-2 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setSortOrder("desc");
                    setOpenSort(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[13px] hover:bg-gray-50 ${
                    sortOrder === "desc" ? "font-semibold text-[#1f2240]" : "text-gray-700"
                  }`}
                >
                  Vuln High → Low
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortOrder("asc");
                    setOpenSort(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-[13px] hover:bg-gray-50 ${
                    sortOrder === "asc" ? "font-semibold text-[#1f2240]" : "text-gray-700"
                  }`}
                >
                  Vuln Low → High
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="rounded-2xl bg-white border border-gray-200/80 overflow-hidden">
        {/* Header row */}
        <div
          className="
            grid grid-cols-12 gap-6
            px-4 py-3
            bg-[#f1edff]
            text-[13px] font-semibold text-[#1f2240]
          "
        >
          <div className="col-span-1">No</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Firmware Version</div>

          {/* ✅ เพิ่ม padding-right เพื่อให้ห่างจาก Progress ชัดขึ้น */}
          <div className="col-span-2 text-right pr-6">Vulnerability Total</div>

          {/* ✅ เพิ่ม padding-left เพื่อให้ห่างจาก Vulnerability Total ชัดขึ้น */}
          <div className="col-span-1 pl-6">Progress</div>

          <div className="col-span-1 text-right">Risk Score</div>
        </div>

        {/* Body */}
        <div>
          {loading ? (
            <div className="px-4 py-6 text-[13px] text-gray-500">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-6 text-[13px] text-gray-500">No Data</div>
          ) : (
            rows.map((r, idx) => {
              const { Icon, bg, fg } = DEVICE_ICONS[r.iconIndex];

              return (
                <div
                  key={r.id}
                  className={`grid grid-cols-12 gap-6 px-4 py-4 items-start ${
                    idx !== 0 ? "border-t border-gray-200/70" : ""
                  }`}
                >
                  {/* No */}
                  <div className="col-span-1 text-[14px] font-semibold text-[#1f2240]">
                    {r.no}
                  </div>

                  {/* Name + Icon + IP subtitle */}
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-2xl border border-gray-200/80 ${bg} flex items-center justify-center shrink-0`}
                      aria-hidden="true"
                    >
                      <Icon className={`${fg} text-[20px]`} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#1f2240]">
                        {r.name}
                      </p>
                      <p className="text-[12px] text-gray-500 truncate">{r.ip}</p>
                    </div>
                  </div>

                  {/* Firmware Version (แสดงเต็ม) */}
                  <div className="col-span-4 text-[14px] text-gray-700 whitespace-pre-wrap wrap-break-word">
                    {r.firmwareVersion}
                  </div>

                  {/* Vulnerability Total (เพิ่ม pr เพื่อห่าง) */}
                  <div className="col-span-2 text-right pr-6 text-[14px] font-semibold text-[#1f2240]">
                    {formatNumber(r.vulnerabilityTotal)}
                  </div>

                  {/* Progress (เพิ่ม pl เพื่อห่าง) */}
                  <div className="col-span-1 pl-6">
                    <div className="h-2.5 w-full rounded-full bg-[#efeefd] overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full bg-[#6f5be8]"
                        style={{ width: `${r.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div className="col-span-1 text-right text-[14px] font-semibold text-[#1f2240]">
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