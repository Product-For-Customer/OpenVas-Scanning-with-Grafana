import React from "react";
import ReportHeader from "./ReportHeader";
import ReportKPI from "./ReportKPI";
import ExecutiveHighlights from "./ExecutiveHighlights";
import SeveritySnapshot from "./SeveritySnapshot";
import ReportFooter from "./ReportFooter";
import TopDeviceRiskReport from "./Top";
import RiskScoreTrendReport from "./comparision";

import { reportInfo } from "../../interface/mock";

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

              <ReportKPI />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 2</p>
                <h2 className={sectionHeadingClass}>
                  Severity Distribution Overview
                </h2>
                <p className={sectionDescClass}>
                  แสดงสัดส่วนการกระจายของ vulnerability ตามระดับความรุนแรง
                  พร้อมตารางสรุปและกราฟเพื่อให้เห็นน้ำหนักของความเสี่ยงในรอบล่าสุด
                </p>
              </div>

              <SeveritySnapshot />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 3</p>
                <h2 className={sectionHeadingClass}>Executive Highlights</h2>
                <p className={sectionDescClass}>
                  สรุปเหตุการณ์หรือประเด็นสำคัญจากผลสแกนล่าสุด
                  เพื่อให้เห็นภาพแนวโน้มความเสี่ยงและจุดที่ต้องเร่งดำเนินการ
                </p>
              </div>

              <ExecutiveHighlights />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 4</p>
                <h2 className={sectionHeadingClass}>Device Risk Summary</h2>
                <p className={sectionDescClass}>
                  แสดงรายการอุปกรณ์จากผลการประเมินล่าสุด โดยเรียงตามค่า Risk
                  Score เพื่อให้เห็นอุปกรณ์ที่ควรได้รับความสนใจก่อนในมุมมองของรายงาน
                </p>
              </div>

              <TopDeviceRiskReport />
            </section>

            <section className="mt-12">
              <div className="mb-5 border-b border-slate-200 pb-4">
                <p className={sectionTitleClass}>Section 5</p>
                <h2 className={sectionHeadingClass}>Risk Score Trend</h2>
                <p className={sectionDescClass}>
                  เปรียบเทียบค่า Latest Risk และ Previous Risk ของแต่ละเป้าหมาย
                  เพื่อให้เห็นแนวโน้มการเปลี่ยนแปลงของความเสี่ยงจากรอบก่อนหน้าไปยังรอบล่าสุด
                  ในรูปแบบกราฟที่เหมาะกับการแสดงผลในรายงาน PDF
                </p>
              </div>

              <RiskScoreTrendReport />
            </section>

            <ReportFooter page="Page 1 of 1" />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CaptureTest;