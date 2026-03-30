import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCpu,
  FiFileText,
  FiShield,
} from "react-icons/fi";
import { ListCriticalForReport } from "../../../services/report";

type HighlightTone = "good" | "warning" | "critical" | "neutral";

type CriticalForReportDTO = {
  task_name: string;
  ip: string;
  vulnerability_name: string;
  vulnerability_family: string;
  level: string;
  summary: string;
  insight: string;
  cve_list: string;
  severity: number;
};

type HighlightItem = {
  id: number;
  title: string;
  family?: string;
  target?: string;
  ip?: string;
  cveList?: string;
  summary?: string;
  insight?: string;
  tone?: HighlightTone;
};

const toneStyle: Record<HighlightTone, string> = {
  good: "bg-emerald-700 text-white border-emerald-700",
  warning: "bg-amber-600 text-white border-amber-600",
  critical: "bg-rose-700 text-white border-rose-700",
  neutral: "bg-slate-700 text-white border-slate-700",
};

const toneLabel: Record<HighlightTone, string> = {
  good: "Improved",
  warning: "Attention",
  critical: "Critical",
  neutral: "Observation",
};

const ExecutiveHighlights: React.FC = () => {
  const [rows, setRows] = useState<CriticalForReportDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const response = await ListCriticalForReport();
        console.log("Critical for report response:", response);

        if (!alive) return;

        setRows(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to load critical report:", error);

        if (!alive) return;
        setRows([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, []);

  const items: HighlightItem[] = useMemo(() => {
    return rows.map((item, index) => {
      const cleanValue = (value?: string) => {
        const text = value?.trim();
        if (!text || text.toLowerCase() === "n/a") return "";
        return text;
      };

      return {
        id: index + 1,
        title: cleanValue(item.vulnerability_name) || "Unknown Vulnerability",
        family: cleanValue(item.vulnerability_family),
        target: cleanValue(item.task_name),
        ip: cleanValue(item.ip),
        cveList: cleanValue(item.cve_list),
        summary: cleanValue(item.summary),
        insight: cleanValue(item.insight),
        tone: "critical",
      };
    });
  }, [rows]);

  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Management Summary
        </p>
        <h3 className="mt-1 text-[22px] font-semibold text-slate-900">
          Key Critical Findings at a Glance
        </h3>
        <p className="mt-2 text-[13px] leading-6 text-slate-600">
          สรุปช่องโหว่ระดับวิกฤตที่ตรวจพบจากรายงานล่าสุด พร้อมข้อมูลเป้าหมาย
          รายละเอียด และข้อมูลเชิงลึกที่เกี่ยวข้อง
        </p>
      </div>

      {loading ? (
        <div className="px-5 py-6 md:px-6">
          <div className="text-[14px] text-slate-500">Loading...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="px-5 py-6 md:px-6">
          <div className="text-[14px] text-slate-500">No Data</div>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {items.map((item) => {
            const tone = item.tone || "neutral";

            return (
              <div key={item.id} className="px-5 py-5 md:px-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                          <FiAlertTriangle className="text-[18px]" />
                        </span>

                        <h4 className="text-[16px] font-semibold text-slate-900">
                          {item.title}
                        </h4>

                        {item.family && (
                          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700">
                            <FiShield className="text-[12px]" />
                            {item.family}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${toneStyle[tone]}`}
                      >
                        <FiAlertTriangle className="text-[12px]" />
                        {toneLabel[tone]}
                      </span>
                    </div>
                  </div>

                  {(item.target || item.ip || item.cveList) && (
                    <div className="flex flex-wrap gap-3">
                      {item.target && (
                        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
                          <FiCpu className="text-[14px] text-slate-500" />
                          <span>
                            <span className="font-semibold text-slate-900">
                              Target:
                            </span>{" "}
                            {item.target}
                          </span>
                        </div>
                      )}

                      {item.ip && (
                        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
                          <span>
                            <span className="font-semibold text-slate-900">
                              IP:
                            </span>{" "}
                            {item.ip}
                          </span>
                        </div>
                      )}

                      {item.cveList && (
                        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
                          <FiFileText className="text-[14px] text-slate-500" />
                          <span>
                            <span className="font-semibold text-slate-900">
                              CVE:
                            </span>{" "}
                            {item.cveList}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {(item.summary || item.insight) && (
                    <div className="grid grid-cols-1 gap-3">
                      {item.summary && (
                        <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FiFileText className="text-[15px] text-slate-500" />
                            <p className="text-[13px] font-semibold text-slate-900">
                              รายละเอียด
                            </p>
                          </div>
                          <p className="mt-2 text-[14px] leading-7 text-slate-700">
                            {item.summary}
                          </p>
                        </div>
                      )}

                      {item.insight && (
                        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FiShield className="text-[15px] text-slate-500" />
                            <p className="text-[13px] font-semibold text-slate-900">
                              รายละเอียดเชิงลึก
                            </p>
                          </div>
                          <p className="mt-2 text-[14px] leading-7 text-slate-700">
                            {item.insight}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ExecutiveHighlights;