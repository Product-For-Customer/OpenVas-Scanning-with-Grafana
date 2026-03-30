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
  severity?: number;
};

type ExecutiveHighlightsProps = {
  onReady?: (ready: boolean) => void;
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

const normalizeText = (value?: string | null) => {
  const text = value?.trim();
  if (!text) return "";
  if (text.toLowerCase() === "n/a") return "";
  if (text.toLowerCase() === "null") return "";
  if (text.toLowerCase() === "undefined") return "";
  return text;
};

const getToneFromSeverity = (severity?: number): HighlightTone => {
  if (typeof severity !== "number" || Number.isNaN(severity)) return "critical";
  if (severity >= 9) return "critical";
  if (severity >= 7) return "warning";
  if (severity >= 4) return "neutral";
  return "good";
};

const sortBySeverityDesc = (
  a: CriticalForReportDTO,
  b: CriticalForReportDTO
): number => {
  const severityDiff = (b.severity || 0) - (a.severity || 0);
  if (severityDiff !== 0) return severityDiff;

  return (a.vulnerability_name || "").localeCompare(
    b.vulnerability_name || "",
    undefined,
    { sensitivity: "base" }
  );
};

const ExecutiveHighlights: React.FC<ExecutiveHighlightsProps> = ({
  onReady,
}) => {
  const [rows, setRows] = useState<CriticalForReportDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;

    onReady?.(false);

    const loadData = async () => {
      try {
        setLoading(true);

        const response = await ListCriticalForReport();
        console.log("Critical for report response:", response);

        if (!alive) return;

        if (Array.isArray(response)) {
          setRows(response);
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error("Failed to load critical report:", error);

        if (!alive) return;
        setRows([]);
      } finally {
        if (!alive) return;
        setLoading(false);
        onReady?.(true);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, [onReady]);

  const items: HighlightItem[] = useMemo(() => {
    return [...rows]
      .sort(sortBySeverityDesc)
      .map((item, index) => {
        const severity = typeof item.severity === "number" ? item.severity : 0;

        return {
          id: index + 1,
          title:
            normalizeText(item.vulnerability_name) || "Unknown Vulnerability",
          family: normalizeText(item.vulnerability_family),
          target: normalizeText(item.task_name),
          ip: normalizeText(item.ip),
          cveList: normalizeText(item.cve_list),
          summary: normalizeText(item.summary),
          insight: normalizeText(item.insight),
          severity,
          tone: getToneFromSeverity(severity),
        };
      });
  }, [rows]);

  if (loading) {
    return (
      <section className="border border-slate-300 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[8.5px] font-semibold uppercase tracking-normal text-slate-500">
                Management Summary
              </p>
              <h3 className="mt-1 text-[15px] font-bold leading-[1.2] text-slate-900">
                Key Critical Findings at a Glance
              </h3>
              <p className="mt-1 text-[10px] leading-[1.6] text-slate-600">
                สรุปช่องโหว่ระดับวิกฤตที่ตรวจพบจากรายงานล่าสุด พร้อมข้อมูลเป้าหมาย
                รายละเอียด และข้อมูลเชิงลึกที่เกี่ยวข้อง
              </p>
            </div>

            <div className="text-right text-[9.5px] leading-[1.45] text-slate-500">
              Executive-level critical observations
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="space-y-3">
            <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
            <div className="h-16 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-16 w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="border border-slate-300 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[8.5px] font-semibold uppercase tracking-normal text-slate-500">
                Management Summary
              </p>
              <h3 className="mt-1 text-[15px] font-bold leading-[1.2] text-slate-900">
                Key Critical Findings at a Glance
              </h3>
              <p className="mt-1 text-[10px] leading-[1.6] text-slate-600">
                สรุปช่องโหว่ระดับวิกฤตที่ตรวจพบจากรายงานล่าสุด พร้อมข้อมูลเป้าหมาย
                รายละเอียด และข้อมูลเชิงลึกที่เกี่ยวข้อง
              </p>
            </div>

            <div className="text-right text-[9.5px] leading-[1.45] text-slate-500">
              Executive-level critical observations
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="text-[11px] text-slate-500">No Data</div>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[8.5px] font-semibold uppercase tracking-normal text-slate-500">
              Management Summary
            </p>
            <h3 className="mt-1 text-[15px] font-bold leading-[1.2] text-slate-900">
              Key Critical Findings at a Glance
            </h3>
            <p className="mt-1 text-[10px] leading-[1.6] text-slate-600">
              สรุปช่องโหว่ระดับวิกฤตที่ตรวจพบจากรายงานล่าสุด พร้อมข้อมูลเป้าหมาย
              รายละเอียด และข้อมูลเชิงลึกที่เกี่ยวข้อง
            </p>
          </div>

          <div className="text-right text-[9.5px] leading-[1.45] text-slate-500">
            Executive-level critical observations
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {items.map((item) => {
          const tone = item.tone || "critical";

          return (
            <div
              key={item.id}
              className="px-5 py-4"
              style={{
                breakInside: "avoid-page",
                pageBreakInside: "avoid",
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                        <FiAlertTriangle className="text-[15px]" />
                      </span>

                      <h4 className="text-[13.5px] font-semibold leading-[1.45] text-slate-900">
                        {item.title}
                      </h4>

                      {item.family && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[9.5px] font-semibold text-violet-700">
                          <FiShield className="text-[11px]" />
                          {item.family}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] ${toneStyle[tone]}`}
                    >
                      <FiAlertTriangle className="text-[10px]" />
                      {toneLabel[tone]}
                    </span>
                  </div>
                </div>

                {(item.target || item.ip || item.cveList) && (
                  <div className="flex flex-wrap gap-2.5">
                    {item.target && (
                      <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 text-[10.5px] text-slate-700">
                        <FiCpu className="text-[12px] text-slate-500" />
                        <span>
                          <span className="font-semibold text-slate-900">
                            Target:
                          </span>{" "}
                          {item.target}
                        </span>
                      </div>
                    )}

                    {item.ip && (
                      <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 text-[10.5px] text-slate-700">
                        <span>
                          <span className="font-semibold text-slate-900">
                            IP:
                          </span>{" "}
                          {item.ip}
                        </span>
                      </div>
                    )}

                    {item.cveList && (
                      <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 text-[10.5px] text-slate-700">
                        <FiFileText className="text-[12px] text-slate-500" />
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
                      <div className="border border-slate-200 bg-white px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <FiFileText className="text-[13px] text-slate-500" />
                          <p className="text-[10.5px] font-semibold text-slate-900">
                            รายละเอียด
                          </p>
                        </div>
                        <p className="mt-2 text-[11px] leading-[1.75] text-slate-700">
                          {item.summary}
                        </p>
                      </div>
                    )}

                    {item.insight && (
                      <div className="border border-slate-200 bg-slate-50 px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <FiShield className="text-[13px] text-slate-500" />
                          <p className="text-[10.5px] font-semibold text-slate-900">
                            รายละเอียดเชิงลึก
                          </p>
                        </div>
                        <p className="mt-2 text-[11px] leading-[1.75] text-slate-700">
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
    </section>
  );
};

export default ExecutiveHighlights;