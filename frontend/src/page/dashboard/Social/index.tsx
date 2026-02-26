import React, { useEffect, useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { ListAssetRisk, type AssetRiskDTO } from "../../../services";

type RowItem = {
  id: string;
  name: string;
  valueLeft: string;  // เช่น "60" หรือ "Total Tasks"
  valueRight: string; // เช่น "2.60" หรือ "Avg Risk"
  percent?: number;   // ถ้าต้องการ bar (optional)
  icon: React.ReactNode;
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

const Social: React.FC = () => {
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

  // ✅ summary
  const summary = useMemo(() => {
    const list = data ?? [];
    const taskCount = list.length;

    const totalVuln = list.reduce(
      (sum, x) => sum + (Number(x.vulnerability_total) || 0),
      0
    );

    const avgRisk =
      taskCount === 0
        ? 0
        : list.reduce((sum, x) => sum + (Number(x.risk_score) || 0), 0) / taskCount;

    return { taskCount, totalVuln, avgRisk };
  }, [data]);

  // ✅ rows: เอา 3 ตัว summary ไปรวมกับ list เดียวกัน (อยู่บนสุด)
  const rows: RowItem[] = useMemo(() => {
    const list = data ?? [];

    // ทำ percent ให้ bar วิ่งตาม risk (ถ้าอยากใช้)
    const maxRisk = list.reduce((m, x) => Math.max(m, Number(x.risk_score) || 0), 0);
    const maxVuln = list.reduce((m, x) => Math.max(m, Number(x.vulnerability_total) || 0), 0);

    const taskRows: RowItem[] = list
      .map((x) => {
        const risk = Number(x.risk_score) || 0;
        const vuln = Number(x.vulnerability_total) || 0;

        const percent =
          maxRisk > 0 ? (risk / maxRisk) * 100 : maxVuln > 0 ? (vuln / maxVuln) * 100 : 0;

        const initials = String(x.task_name ?? "T").trim().slice(0, 2).toUpperCase();

        return {
          id: x.mac_address || x.task_name,
          name: x.task_name,
          valueLeft: formatNumber(vuln),
          valueRight: formatRisk(risk),
          percent: clamp(percent, 0, 100),
          icon: <span className="text-[12px] font-bold text-gray-600">{initials}</span>,
        };
      })
      .sort((a, b) => {
        // sort ตาม risk ก่อน (valueRight เป็น string แล้ว) -> ใช้ risk จากต้นทางแทน
        const ar = Number((a.valueRight as unknown as string).replace(",", "")) || 0;
        const br = Number((b.valueRight as unknown as string).replace(",", "")) || 0;
        if (br !== ar) return br - ar;

        const av = Number((a.valueLeft as unknown as string).replace(",", "")) || 0;
        const bv = Number((b.valueLeft as unknown as string).replace(",", "")) || 0;
        if (bv !== av) return bv - av;

        return a.name.localeCompare(b.name);
      });

    // ✅ 3 แถว summary (อยู่บนสุด) — ใช้ UI แบบเดียวกับแถว task
    const summaryRows: RowItem[] = [
      {
        id: "__summary_tasks__",
        name: "Total Tasks",
        valueLeft: formatNumber(summary.taskCount),
        valueRight: "",
        icon: <span className="text-[12px] font-bold text-gray-600">TT</span>,
      },
      {
        id: "__summary_avg_risk__",
        name: "Avg Risk Score",
        valueLeft: formatRisk(summary.avgRisk),
        valueRight: "",
        icon: <span className="text-[12px] font-bold text-gray-600">AR</span>,
      },
      {
        id: "__summary_total_vulns__",
        name: "Total Vulns",
        valueLeft: formatNumber(summary.totalVuln),
        valueRight: "",
        icon: <span className="text-[12px] font-bold text-gray-600">TV</span>,
      },
    ];

    return [...summaryRows, ...taskRows];
  }, [data, summary]);

  return (
    <section className="rounded-[22px] bg-white border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
            Asset risk overview
          </h3>
          <p className="text-[12px] sm:text-[13px] text-gray-500 mt-1">
            Summary + task list (same row style)
          </p>
        </div>

        <button
          type="button"
          className="h-9 w-9 rounded-xl hover:bg-white active:bg-gray-100 text-gray-500 inline-flex items-center justify-center"
          aria-label="More"
        >
          <FiMoreHorizontal />
        </button>
      </div>

      {/* rows (ไม่มีหัว Task/Vuln/Risk แล้ว) */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-gray-200/80 bg-white px-4 py-4 text-[13px] text-gray-500">
            Loading...
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-gray-200/80 bg-white px-4 py-4 text-[13px] text-gray-500">
            No Data
          </div>
        ) : (
          rows.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-gray-200/80 bg-white px-3.5 sm:px-4 py-3 flex items-center gap-3"
            >
              {/* icon */}
              <div className="h-10 w-10 rounded-2xl border border-gray-200/80 bg-[#fbfbfc] flex items-center justify-center shrink-0">
                {s.icon}
              </div>

              {/* name */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] sm:text-[14px] font-medium text-[#1f2240]">
                  {s.name}
                </p>

                {/* optional bar: แสดงเฉพาะ task rows ที่มี percent */}
                {typeof s.percent === "number" && (
                  <div className="mt-2 h-2.5 rounded-full bg-[#eef0f6] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.percent}%`,
                        background:
                          "linear-gradient(90deg, #6f5be8 0%, #7a67ea 55%, #84cc16 100%)",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* values: ถ้าเป็น summary จะมีแค่ valueLeft; ถ้าเป็น task จะมี 2 ค่า */}
              <div className="shrink-0 flex items-center gap-6">
                <div className="w-16 text-right">
                  <p className="text-[13px] sm:text-[14px] font-semibold text-[#1f2240]">
                    {s.valueLeft}
                  </p>
                </div>

                {/* valueRight: ถ้าว่างไม่ต้องแสดง (summary) */}
                {s.valueRight !== "" && (
                  <div className="w-16 text-right">
                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#1f2240]">
                      {s.valueRight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Social;