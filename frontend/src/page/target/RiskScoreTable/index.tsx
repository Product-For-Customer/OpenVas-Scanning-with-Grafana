// RiskScoreTable.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
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

const formatNumber = (n: number) => (!Number.isFinite(n) ? "0" : n.toLocaleString());
const formatRisk = (n: number) => (!Number.isFinite(n) ? "0.00" : n.toFixed(2));

// ✅ Indicator “Danger”
const DangerDots: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const ratio = max > 0 ? value / max : 0;
  const level = Math.min(5, Math.max(1, Math.ceil(ratio * 5)));

  const cls = (i: number) => {
    if (i > level) return "bg-gray-200 dark:bg-white/10";
    if (level <= 2) return "bg-[#22c55e]";
    if (level === 3) return "bg-[#f5b301]";
    if (level === 4) return "bg-[#f97316]";
    return "bg-[#d94b3e]";
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
        "h-full rounded-[22px] p-4 sm:p-5 md:p-6 flex flex-col",
        "bg-white border border-gray-200/80 shadow-sm",
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
          Top Devices Risk
        </h2>

        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className={[
                "h-10 px-4 rounded-xl inline-flex items-center gap-2 transition",
                "bg-white border border-gray-200/80 text-[13px] font-medium text-gray-500 hover:bg-gray-50",
                "dark:bg-white/5 dark:border-white/10 dark:text-white/65 dark:hover:bg-white/10",
              ].join(" ")}
            >
              {range}
              <span className="text-gray-400 dark:text-white/45">▾</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20 dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRange(opt);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition text-gray-600 dark:text-white/70 dark:hover:bg-white/8"
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
              "h-10 w-10 rounded-xl inline-flex items-center justify-center transition-colors",
              "text-gray-500 hover:bg-gray-100 active:bg-gray-200",
              "dark:text-white/55 dark:hover:bg-white/10 dark:active:bg-white/15",
            ].join(" ")}
            aria-label="More"
          >
            <FiMoreHorizontal />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 flex-1">
        {loading ? (
          <div className="py-6 text-[13px] text-gray-500 dark:text-white/55">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="py-6 text-[13px] text-gray-500 dark:text-white/55">No Data</div>
        ) : (
          rows.map((p, idx) => {
            const { Icon, bg, fg } = DEVICE_ICONS[p.iconIndex];

            return (
              <div
                key={p.id}
                className={[
                  "py-4 flex items-center justify-between gap-3",
                  idx !== 0 ? "border-t border-gray-200/70 dark:border-white/10" : "",
                ].join(" ")}
              >
                {/* left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={[
                      "h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0",
                      "border-gray-200/80",
                      "dark:border-white/10",
                      bg,
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <Icon className={`${fg} text-[22px]`} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[15px] sm:text-[16px] font-semibold text-[#1f2240] dark:text-white/85">
                      {p.name}
                    </p>
                    <p className="text-[12.5px] sm:text-[13px] text-gray-500 dark:text-white/55 truncate">
                      {formatNumber(p.vulnTotal)} Vulns • {p.mac || "No MAC"}
                    </p>
                  </div>
                </div>

                {/* right */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[15px] sm:text-[16px] font-semibold text-[#1f2240] dark:text-white/85 tabular-nums">
                      {formatRisk(p.risk)}
                    </p>
                    <p className="text-[11.5px] text-gray-400 dark:text-white/45">Risk Score</p>
                  </div>

                  <DangerDots value={p.risk} max={maxRisk} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RiskScoreTable;