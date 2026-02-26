import React, { useEffect, useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdRouter, MdDevices, MdImportantDevices, MdMemory, MdSecurity } from "react-icons/md";
import { ListAssetRisk, type AssetRiskDTO } from "../../../services";

type RangeKey = "This Month" | "This Year";
const RANGE_OPTIONS: RangeKey[] = ["This Month", "This Year"];

type Row = {
  id: string;
  name: string; // task_name
  vulnTotal: number; // vulnerability_total
  mac: string; // mac_address
  risk: number; // risk_score
  iconIndex: number; // 0..4
};

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

const formatNumber = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
};

const formatRisk = (n: number) => {
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
};

// ✅ Indicator “Danger” (แทนดาว): ยิ่ง risk มาก ยิ่งแดง/จำนวนมาก
const DangerDots: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  // 5 ระดับ
  const ratio = max > 0 ? value / max : 0;
  const level = Math.min(5, Math.max(1, Math.ceil(ratio * 5)));

  const cls = (i: number) => {
    if (i > level) return "bg-gray-200";
    // ไล่สีตามระดับ
    if (level <= 2) return "bg-[#22c55e]"; // green
    if (level === 3) return "bg-[#f5b301]"; // yellow
    if (level === 4) return "bg-[#f97316]"; // orange
    return "bg-[#d94b3e]"; // red
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

    // NOTE: ตอนนี้ range ยังไม่กรองเวลา เพราะ API ไม่รับพารามิเตอร์เวลา
    // ถ้าอยากทำจริง ต้องเพิ่ม query param ฝั่ง backend แล้วค่อย filter ตาม range

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

    // sort: risk desc, vuln desc, name asc
    mapped.sort((a, b) => {
      if (b.risk !== a.risk) return b.risk - a.risk;
      if (b.vulnTotal !== a.vulnTotal) return b.vulnTotal - a.vulnTotal;
      return a.name.localeCompare(b.name);
    });

    return { rows: mapped, maxRisk: max };
  }, [data, range]);

  return (
    <section className="h-full rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] tracking-tight">
          Top Devices Risk
        </h2>

        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="
                h-10 px-4 rounded-xl
                bg-white border border-gray-200/80
                text-[13px] font-medium text-gray-500
                inline-flex items-center gap-2
                hover:bg-gray-50 transition
              "
            >
              {range}
              <span className="text-gray-400">▾</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRange(opt);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition text-gray-600"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-xl hover:bg-white active:bg-gray-100 text-gray-500 inline-flex items-center justify-center"
            aria-label="More"
          >
            <FiMoreHorizontal />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 flex-1">
        {loading ? (
          <div className="py-6 text-[13px] text-gray-500">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="py-6 text-[13px] text-gray-500">No Data</div>
        ) : (
          rows.map((p, idx) => {
            const { Icon, bg, fg } = DEVICE_ICONS[p.iconIndex];

            return (
              <div
                key={p.id}
                className={`py-4 flex items-center justify-between gap-3 ${
                  idx !== 0 ? "border-t border-gray-200/70" : ""
                }`}
              >
                {/* left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-11 w-11 rounded-2xl border border-gray-200/80 ${bg} flex items-center justify-center shrink-0`}
                    aria-hidden="true"
                  >
                    <Icon className={`${fg} text-[22px]`} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[15px] sm:text-[16px] font-semibold text-[#1f2240]">
                      {p.name}
                    </p>
                    <p className="text-[12.5px] sm:text-[13px] text-gray-500 truncate">
                      {formatNumber(p.vulnTotal)} Vulns • {p.mac || "No MAC"}
                    </p>
                  </div>
                </div>

                {/* right */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[15px] sm:text-[16px] font-semibold text-[#1f2240]">
                      {formatRisk(p.risk)}
                    </p>
                    <p className="text-[11.5px] text-gray-400">Risk Score</p>
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