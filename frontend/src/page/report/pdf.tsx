import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiLoader,
} from "react-icons/fi";
import ReportHeader from "./ReportHeader";
import ReportKPI from "./ReportKPI";
import SeveritySnapshot from "./SeveritySnapshot";
import ExecutiveHighlights from "./ExecutiveHighlights";
import TopDeviceRiskReport from "./TopDeviceRiskReport";
import ComparisonReport from "./comparision";
import Section6MonthlyRiskReport from "./monthlyRiskReport";
import Conclusion from "./conclusion";
import ReportFooter from "./ReportFooter";
import {
  ListCriticalForReport,
  ListDeviceRiskForReport,
} from "../../services/report";
import type { DeviceRiskForReportDTO } from "../../services/report";

const sectionLabelClass =
  "text-[8.5px] font-semibold uppercase tracking-normal text-slate-500";
const sectionHeadingClass =
  "mt-1 text-[16px] font-bold leading-[1.2] text-slate-900";
const sectionDescClass =
  "mt-1.5 max-w-full text-[10.5px] leading-[1.6] text-slate-600";

const PAGE_WIDTH = 1120;
const PAGE_HEIGHT = 1620;

const pageShellClass = "flex h-[1620px] flex-col bg-white text-slate-900";

const noop = () => {};

const HIGHLIGHTS_PAGE_SIZE = 2;
const DEVICE_PAGE_SIZE = 18;

type PdfProps = {
  refreshToken?: number;
  selectedTaskIDs?: string[];
};

type CriticalForReportDTO = {
  task_id: string;
  task_name: string;
  ip: string;
  vulnerability_id: string;
  vulnerability_name: string;
  detected_date: string;
  severity: number;
  cve_list: string;
  summary: string;
  impact: string;
  affected: string;
  insight: string;
  solution: string;
  solution_type: string;
};

type PageDescriptor =
  | {
      key: string;
      type: "overview";
      title: string;
    }
  | {
      key: string;
      type: "highlights";
      title: string;
      pageIndex: number;
      pageSize: number;
      pageNumberInSection: number;
      totalPagesInSection: number;
    }
  | {
      key: string;
      type: "device-risk";
      title: string;
      pageIndex: number;
      pageSize: number;
      pageNumberInSection: number;
      totalPagesInSection: number;
    }
  | {
      key: string;
      type: "comparison-monthly";
      title: string;
    }
  | {
      key: string;
      type: "conclusion";
      title: string;
    };

const readTaskIDsFromQuery = (): { mode: "all" | "filtered"; ids: string[] } => {
  if (typeof window === "undefined") {
    return { mode: "all", ids: [] };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const raw = (searchParams.get("task_id") || "").trim();

  if (!raw || raw.toUpperCase() === "ALL") {
    return { mode: "all", ids: [] };
  }

  const ids = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  if (ids.length === 0) {
    return { mode: "all", ids: [] };
  }

  return { mode: "filtered", ids };
};

const normalizeTaskIDs = (ids?: string[]): string[] => {
  if (!Array.isArray(ids)) return [];

  return ids
    .map((id) => String(id).trim())
    .filter((id) => id !== "");
};

const Pdf: React.FC<PdfProps> = ({
  refreshToken = 0,
  selectedTaskIDs = [],
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [highlightsCount, setHighlightsCount] = useState<number>(0);
  const [deviceRiskCount, setDeviceRiskCount] = useState<number>(0);

  const [prefetchedHighlights, setPrefetchedHighlights] = useState<
    CriticalForReportDTO[]
  >([]);
  const [prefetchedDevices, setPrefetchedDevices] = useState<
    DeviceRiskForReportDTO[]
  >([]);
  const [prefetchLoading, setPrefetchLoading] = useState<boolean>(true);

  const previewFrameRef = useRef<HTMLDivElement | null>(null);

  const normalizedSelectedTaskIDs = useMemo(
    () => normalizeTaskIDs(selectedTaskIDs),
    [selectedTaskIDs]
  );

  const [queryTaskIDs, setQueryTaskIDs] = useState<string[]>([]);
  const [taskMode, setTaskMode] = useState<"all" | "filtered">("all");

  useEffect(() => {
    const parsed = readTaskIDsFromQuery();
    setQueryTaskIDs(parsed.ids);
    setTaskMode(parsed.mode);
  }, []);

  const effectiveTaskMode = useMemo<"all" | "filtered">(() => {
    if (normalizedSelectedTaskIDs.length > 0) {
      return "filtered";
    }
    return taskMode;
  }, [normalizedSelectedTaskIDs, taskMode]);

  const effectiveTaskIDs = useMemo<string[]>(() => {
    if (normalizedSelectedTaskIDs.length > 0) {
      return normalizedSelectedTaskIDs;
    }
    return queryTaskIDs;
  }, [normalizedSelectedTaskIDs, queryTaskIDs]);

  useEffect(() => {
    const updateScale = () => {
      const el = previewFrameRef.current;
      if (!el) return;

      const frameWidth = el.clientWidth;
      const nextScale = Math.min(
        1,
        Math.max(0.35, (frameWidth - 32) / PAGE_WIDTH)
      );
      setScale(nextScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    if (previewFrameRef.current) {
      resizeObserver.observe(previewFrameRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    let alive = true;

    const preloadData = async () => {
      try {
        setPrefetchLoading(true);

        const [criticalResult, deviceResult] = await Promise.all([
          effectiveTaskMode === "all"
            ? ListCriticalForReport(undefined, 9999)
            : ListCriticalForReport(effectiveTaskIDs, 9999),
          ListDeviceRiskForReport(),
        ]);

        if (!alive) return;

        const criticalRows = Array.isArray(criticalResult)
          ? (criticalResult as CriticalForReportDTO[])
          : [];

        const allDevices = Array.isArray(deviceResult)
          ? (deviceResult as DeviceRiskForReportDTO[])
          : [];

        const selectedTaskSet = new Set(
          effectiveTaskIDs.map((id) => String(id).trim())
        );

        const filteredDevices =
          effectiveTaskMode === "all" || effectiveTaskIDs.length === 0
            ? allDevices
            : allDevices.filter((item) =>
                selectedTaskSet.has(String(item.task_id).trim())
              );

        setPrefetchedHighlights(criticalRows);
        setPrefetchedDevices(filteredDevices);
      } catch (error) {
        console.error("Pdf preload data error:", error);
        if (!alive) return;
        setPrefetchedHighlights([]);
        setPrefetchedDevices([]);
      } finally {
        if (!alive) return;
        setPrefetchLoading(false);
      }
    };

    preloadData();

    return () => {
      alive = false;
    };
  }, [effectiveTaskMode, effectiveTaskIDs, refreshToken]);

  useEffect(() => {
    setHighlightsCount(prefetchedHighlights.length);
  }, [prefetchedHighlights]);

  useEffect(() => {
    setDeviceRiskCount(prefetchedDevices.length);
  }, [prefetchedDevices]);

  const highlightPages = useMemo(() => {
    if (highlightsCount <= 0) return 1;
    return Math.max(1, Math.ceil(highlightsCount / HIGHLIGHTS_PAGE_SIZE));
  }, [highlightsCount]);

  const devicePages = useMemo(() => {
    if (deviceRiskCount <= 0) return 1;
    return Math.max(1, Math.ceil(deviceRiskCount / DEVICE_PAGE_SIZE));
  }, [deviceRiskCount]);

  const pageDescriptors = useMemo<PageDescriptor[]>(() => {
    const pages: PageDescriptor[] = [
      {
        key: "overview",
        type: "overview",
        title: "Total Severity & Severity Distribution",
      },
    ];

    for (let i = 0; i < highlightPages; i += 1) {
      pages.push({
        key: `highlights-${i}`,
        type: "highlights",
        title:
          highlightPages > 1
            ? `Critical Highlights (${i + 1}/${highlightPages})`
            : "Critical Highlights",
        pageIndex: i,
        pageSize: HIGHLIGHTS_PAGE_SIZE,
        pageNumberInSection: i + 1,
        totalPagesInSection: highlightPages,
      });
    }

    for (let i = 0; i < devicePages; i += 1) {
      pages.push({
        key: `device-risk-${i}`,
        type: "device-risk",
        title:
          devicePages > 1
            ? `Top Device Risk Report (${i + 1}/${devicePages})`
            : "Top Device Risk Report",
        pageIndex: i,
        pageSize: DEVICE_PAGE_SIZE,
        pageNumberInSection: i + 1,
        totalPagesInSection: devicePages,
      });
    }

    pages.push({
      key: "comparison-monthly",
      type: "comparison-monthly",
      title: "Risk Comparison & Monthly Overview",
    });

    pages.push({
      key: "conclusion",
      type: "conclusion",
      title: "Final Conclusion & Executive Summary",
    });

    return pages;
  }, [highlightPages, devicePages]);

  const totalPages = pageDescriptors.length;

  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev < 1) return 1;
      if (prev > totalPages) return totalPages;
      return prev;
    });
  }, [totalPages]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const currentDescriptor = pageDescriptors[currentPage - 1];

  const renderFooter = (pageNumber: number) => (
    <div className="mt-auto px-8 pt-8 pb-12">
      <ReportFooter page={`Page ${pageNumber} of ${totalPages}`} />
    </div>
  );

  const renderSimpleLoader = () => (
    <div className="flex h-full min-h-405 w-full items-center justify-center bg-white">
      <FiLoader className="animate-spin text-[28px] text-slate-500" />
    </div>
  );

  const renderPage = (pageNumber: number) => {
    const descriptor = pageDescriptors[pageNumber - 1];
    if (!descriptor) return null;

    if (prefetchLoading) {
      return renderSimpleLoader();
    }

    switch (descriptor.type) {
      case "overview":
        return (
          <div className={pageShellClass}>
            <div className="w-full bg-white">
              <ReportHeader refreshToken={refreshToken} />
            </div>

            <main className="flex-1 px-8 pt-6 pb-8">
              <section className="mt-0">
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <p className={sectionLabelClass}>Section 1</p>
                  <h2 className={sectionHeadingClass}>Total Severity</h2>
                  <p className={sectionDescClass}>
                    สรุปภาพรวมผลการสแกนล่าสุด โดยแสดงตัวชี้วัดสำคัญของการประเมิน
                    พร้อมจำนวนช่องโหว่ในแต่ละระดับความรุนแรง
                  </p>
                </div>

                <ReportKPI onReady={noop} selectedTaskIDs={selectedTaskIDs} />
              </section>

              <section className="mt-5">
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <p className={sectionLabelClass}>Section 2</p>
                  <h2 className={sectionHeadingClass}>
                    Severity Distribution Overview
                  </h2>
                  <p className={sectionDescClass}>
                    แสดงภาพรวมการกระจายของช่องโหว่ตามระดับความรุนแรงในรูปแบบย่อ
                    เพื่อให้เหมาะกับการจัดวางในรายงาน PDF แบบหน้าเดียว
                  </p>
                </div>

                <SeveritySnapshot
                  onReady={noop}
                  selectedTaskIDs={selectedTaskIDs}
                />
              </section>
            </main>

            {renderFooter(pageNumber)}
          </div>
        );

      case "highlights":
        return (
          <div className={pageShellClass}>
            <main className="flex-1 px-8 pt-7 pb-8">
              <section className="mt-0">
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className={sectionLabelClass}>Section 3</p>
                      <h2 className={sectionHeadingClass}>Critical Highlights</h2>
                      <p className={sectionDescClass}>
                        สรุปประเด็นสำคัญของช่องโหว่ระดับวิกฤตที่ควรได้รับการติดตามก่อน
                        โดยแสดงชื่อช่องโหว่ , ผลกระทบ , รายละเอียด
                        และข้อมูลเชิงลึกรวมถึงวิธีการแก้ไขเพื่อใช้ประกอบการตัดสินใจ
                      </p>
                    </div>

                    {descriptor.totalPagesInSection > 1 ? (
                      <div className="shrink-0 text-[10px] font-medium text-slate-500">
                        Page {descriptor.pageNumberInSection} of{" "}
                        {descriptor.totalPagesInSection}
                      </div>
                    ) : null}
                  </div>
                </div>

                <ExecutiveHighlights
                  onReady={noop}
                  selectedTaskIDs={selectedTaskIDs}
                  pageIndex={descriptor.pageIndex}
                  pageSize={descriptor.pageSize}
                  showOuterHeader={true}
                  onDataCountChange={setHighlightsCount}
                  prefetchedRows={prefetchedHighlights}
                  prefetchedLoading={prefetchLoading}
                />
              </section>
            </main>

            {renderFooter(pageNumber)}
          </div>
        );

      case "device-risk":
        return (
          <div className={pageShellClass}>
            <main className="flex-1 px-8 pt-7 pb-8">
              <section className="mt-0">
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className={sectionLabelClass}>Section 4</p>
                      <h2 className={sectionHeadingClass}>
                        Top Device Risk Report
                      </h2>
                      <p className={sectionDescClass}>
                        แสดงรายการอุปกรณ์ที่มีความเสี่ยงสูงจากผลการประเมินล่าสุด
                        โดยเรียงลำดับตามค่า Risk Score
                        เพื่อช่วยให้ติดตามอุปกรณ์ที่ควรได้รับการจัดการก่อน
                        ในรูปแบบที่เหมาะกับการอ่านบนรายงาน PDF
                      </p>
                    </div>

                    {descriptor.totalPagesInSection > 1 ? (
                      <div className="shrink-0 text-[10px] font-medium text-slate-500">
                        Page {descriptor.pageNumberInSection} of{" "}
                        {descriptor.totalPagesInSection}
                      </div>
                    ) : null}
                  </div>
                </div>

                <TopDeviceRiskReport
                  onReady={noop}
                  selectedTaskIDs={selectedTaskIDs}
                  pageIndex={descriptor.pageIndex}
                  pageSize={descriptor.pageSize}
                  showOuterHeader={true}
                  onDataCountChange={setDeviceRiskCount}
                  prefetchedDevices={prefetchedDevices}
                  prefetchedLoading={prefetchLoading}
                />
              </section>
            </main>

            {renderFooter(pageNumber)}
          </div>
        );

      case "comparison-monthly":
        return (
          <div className={pageShellClass}>
            <main className="flex-1 px-8 pt-7 pb-8">
              <section
                className="mt-0"
                style={{
                  breakInside: "avoid-page",
                  pageBreakInside: "avoid",
                }}
              >
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <p className={sectionLabelClass}>Section 5</p>
                  <h2 className={sectionHeadingClass}>Top 10 Risk Score Comparison</h2>
                  <p className={sectionDescClass}>
                    เปรียบเทียบค่า Latest Risk และ Previous Risk ของแต่ละเป้าหมาย
                    เพื่อให้เห็นแนวโน้มความเสี่ยงล่าสุด
                  </p>
                </div>

                <ComparisonReport
                  onReady={noop}
                  selectedTaskIDs={selectedTaskIDs}
                />
              </section>

              <section
                className="mt-5"
                style={{
                  breakInside: "avoid-page",
                  pageBreakInside: "avoid",
                }}
              >
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <p className={sectionLabelClass}>Section 6</p>
                  <h2 className={sectionHeadingClass}>
                    Monthly Risk Score Overview
                  </h2>
                  <p className={sectionDescClass}>
                    This section presents mock monthly vulnerability counts and
                    risk scores for the current year, together with a compact
                    summary table for report review.
                  </p>
                </div>

                <Section6MonthlyRiskReport
                  onReady={noop}
                  selectedTaskIDs={selectedTaskIDs}
                />
              </section>
            </main>

            {renderFooter(pageNumber)}
          </div>
        );

      case "conclusion":
        return (
          <div className={pageShellClass}>
            <main className="flex-1 px-8 pt-7 pb-8">
              <section
                className="mt-0"
                style={{
                  breakInside: "avoid-page",
                  pageBreakInside: "avoid",
                }}
              >
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <p className={sectionLabelClass}>Section 7</p>
                  <h2 className={sectionHeadingClass}>
                    Final Conclusion and Executive Summary
                  </h2>
                  <p className={sectionDescClass}>
                    สรุปภาพรวมของรายงานทั้งหมดในหน้าเดียว
                    โดยรวบรวมตัวเลขสำคัญ การกระจายความรุนแรง
                    ความเสี่ยงของเป้าหมายหลัก และข้อสังเกตสำหรับการตัดสินใจเชิงปฏิบัติการ
                  </p>
                </div>

                <Conclusion onReady={noop} selectedTaskIDs={selectedTaskIDs} />
              </section>
            </main>

            {renderFooter(pageNumber)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 transition-colors dark:bg-[#07101d] dark:text-white/90">
      <div className="w-full border border-slate-200 bg-white transition-colors dark:border-cyan-400/12 dark:bg-[#08111f] dark:shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_18px_50px_-28px_rgba(0,0,0,0.75)]">
        <div className="mx-auto max-w-360 px-4 py-4 md:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 border border-slate-200 px-3 py-1 text-slate-700 transition-colors dark:border-cyan-400/15 dark:bg-[#0d1628] dark:text-white/80">
                <FiFileText className="text-[13px]" />
                <span className="text-[11px] font-medium">PDF Preview Mode</span>
              </div>

              <h1 className="mt-3 text-[18px] font-semibold text-slate-900 dark:text-white/92">
                Network Vulnerability Assessment Report
              </h1>

              <p className="mt-1 text-[12px] text-slate-500 dark:text-white/50">
                Preview one page at a time before exporting or downloading.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={goToPrevPage}
                disabled={currentPage === 1 || prefetchLoading}
                className={[
                  "inline-flex h-9 items-center gap-2 border px-3 text-[12px] font-medium transition",
                  currentPage === 1 || prefetchLoading
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-cyan-400/12 dark:bg-[#111a2d] dark:text-white/82 dark:hover:bg-[#162238]",
                ].join(" ")}
              >
                <FiChevronLeft className="text-[14px]" />
                Previous
              </button>

              <div className="flex max-w-full flex-wrap items-center border border-slate-200 bg-white transition-colors dark:border-cyan-400/12 dark:bg-[#111a2d]">
                {pageDescriptors.map((item, index) => {
                  const page = index + 1;
                  const active = page === currentPage;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => goToPage(page)}
                      disabled={prefetchLoading}
                      className={[
                        "inline-flex h-9 min-w-9 items-center justify-center border-r border-slate-200 px-3 text-[12px] font-medium transition last:border-r-0 dark:border-cyan-400/12",
                        prefetchLoading
                          ? "cursor-not-allowed text-slate-400 dark:text-white/30"
                          : active
                          ? "bg-slate-900 text-white dark:bg-cyan-400 dark:text-slate-950"
                          : "text-slate-700 hover:bg-slate-50 dark:text-white/78 dark:hover:bg-[#162238]",
                      ].join(" ")}
                      title={item.title}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || prefetchLoading}
                className={[
                  "inline-flex h-9 items-center gap-2 border px-3 text-[12px] font-medium transition",
                  currentPage === totalPages || prefetchLoading
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-cyan-400/12 dark:bg-[#111a2d] dark:text-white/82 dark:hover:bg-[#162238]",
                ].join(" ")}
              >
                Next
                <FiChevronRight className="text-[14px]" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-600 dark:border-cyan-400/12 dark:bg-[#0d1628] dark:text-white/65">
            <div className="min-w-0 truncate">
              <span className="font-semibold text-slate-800 dark:text-white/85">
                Current:
              </span>{" "}
              {prefetchLoading
                ? "Preparing report data..."
                : currentDescriptor?.title ?? "-"}
            </div>

            <div className="shrink-0">
              {prefetchLoading
                ? "Loading..."
                : `Page ${currentPage} of ${totalPages}`}
            </div>
          </div>

          <div
            ref={previewFrameRef}
            className="mt-5 overflow-hidden rounded-none border border-slate-200 bg-slate-200/70 p-4 dark:border-cyan-400/12 dark:bg-[#050b14]"
          >
            <div className="flex justify-center">
              <div
                style={{
                  width: PAGE_WIDTH,
                  minHeight: PAGE_HEIGHT,
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                {renderPage(currentPage)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pdf;