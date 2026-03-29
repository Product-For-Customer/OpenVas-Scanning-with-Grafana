import React from "react";
import ReportHeader from "./ReportHeader";
import ReportIntro from "./ReportIntro";
import ReportKPI from "./ReportKPI";
import ExecutiveHighlights from "./ExecutiveHighlights";
import SeveritySnapshot from "./SeveritySnapshot";
import FindingsComparison from "./FindingsComparison";
import AssetRiskTable from "./AssetRiskTable";
import TopVulnerabilities from "./TopVulnerabilityTable";
import DeviceExposure from "./DeviceExposure";
import Recommendations from "./Recommendations";
import ReportFooter from "./ReportFooter";

import {
  reportInfo,
  summaryMetrics,
  executiveHighlights,
  endpointSeverity,
  comparisonCards,
  assetRiskRows,
  topVulnerabilities,
  deviceExposureRows,
  recommendations,
} from "../../interface/mock";

const sectionTitleClass =
  "text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500";
const sectionHeadingClass =
  "mt-2 text-[28px] font-semibold leading-tight text-slate-900";
const sectionDescClass =
  "mt-3 max-w-4xl text-[14px] leading-7 text-slate-600";

const CaptureTest: React.FC = () => {
  return (
    <div
      id="capture-root"
      className="min-h-screen w-full bg-[#eef2f7] px-3 py-4 md:px-6 md:py-8"
    >
      <div className="mx-auto w-full max-w-310">
        <div className="overflow-hidden rounded-[18px] border border-slate-300 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
          <ReportHeader info={reportInfo} />

          <main className="px-5 py-6 md:px-8 md:py-8 xl:px-12 xl:py-10">
            <section>
              <ReportIntro subtitle={reportInfo.subtitle} />
            </section>

            <section className="mt-10">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 1</p>
                <h2 className={sectionHeadingClass}>Assessment Snapshot</h2>
                <p className={sectionDescClass}>
                  สรุปภาพรวมของรอบการสแกนล่าสุดในเชิงผู้บริหาร โดยแสดงตัวชี้วัดหลัก
                  ของการประเมิน, จำนวน findings, ความเสี่ยงเฉลี่ย
                  และประเด็นที่ควรให้ความสำคัญก่อนลงรายละเอียดเชิงเทคนิค
                </p>
              </div>

              <ReportKPI items={summaryMetrics} />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 2</p>
                <h2 className={sectionHeadingClass}>Executive Highlights</h2>
                <p className={sectionDescClass}>
                  สรุปเหตุการณ์หรือประเด็นสำคัญจากผลสแกนล่าสุด
                  เพื่อให้เห็นภาพแนวโน้มความเสี่ยงและจุดที่ต้องเร่งดำเนินการ
                </p>
              </div>

              <ExecutiveHighlights items={executiveHighlights} />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 3</p>
                <h2 className={sectionHeadingClass}>
                  Severity Distribution Overview
                </h2>
                <p className={sectionDescClass}>
                  แสดงสัดส่วนการกระจายของ vulnerability ตามระดับความรุนแรง
                  พร้อมตารางสรุปและกราฟเพื่อให้เห็นน้ำหนักของความเสี่ยงในรอบล่าสุด
                </p>
              </div>

              <SeveritySnapshot items={endpointSeverity} />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 4</p>
                <h2 className={sectionHeadingClass}>
                  Comparison with Previous Assessment
                </h2>
                <p className={sectionDescClass}>
                  เปรียบเทียบค่าปัจจุบันกับผลสแกนก่อนหน้า
                  เพื่อดูว่าความเสี่ยงและจำนวน findings ดีขึ้นหรือแย่ลง
                  ในมุมมองเชิง operational tracking
                </p>
              </div>

              <FindingsComparison items={comparisonCards} />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 5</p>
                <h2 className={sectionHeadingClass}>
                  Asset and Vulnerability Prioritization
                </h2>
                <p className={sectionDescClass}>
                  ใช้สำหรับระบุ asset ที่มีความเสี่ยงสูง
                  และช่องโหว่สำคัญที่ควรเข้าสู่แผน remediation ก่อน
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                <div className="xl:col-span-7">
                  <AssetRiskTable rows={assetRiskRows} />
                </div>

                <div className="xl:col-span-5">
                  <TopVulnerabilities rows={topVulnerabilities} />
                </div>
              </div>
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 6</p>
                <h2 className={sectionHeadingClass}>Device Exposure Analysis</h2>
                <p className={sectionDescClass}>
                  วิเคราะห์ภาพรวม exposure ในระดับอุปกรณ์หรือ firmware
                  เพื่อดูว่าอุปกรณ์หรือเวอร์ชันใดเป็นจุดรวมความเสี่ยงสำคัญ
                </p>
              </div>

              <DeviceExposure rows={deviceExposureRows} />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 7</p>
                <h2 className={sectionHeadingClass}>Recommended Actions</h2>
                <p className={sectionDescClass}>
                  ข้อเสนอแนะเชิงปฏิบัติการเพื่อใช้กำหนดลำดับความสำคัญในการแก้ไข
                  ลดความเสี่ยง และติดตามผลในรอบถัดไป
                </p>
              </div>

              <Recommendations items={recommendations} />
            </section>

            <ReportFooter page="Page 1 of 1" />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CaptureTest;