import React from "react";

type ReportIntroProps = {
  subtitle?: string;
};

const ReportIntro: React.FC<ReportIntroProps> = ({ subtitle }) => {
  return (
    <section className="rounded-md border border-slate-300 bg-white px-5 py-6 md:px-7 md:py-7">
      <div className="border-l-4 border-slate-900 pl-4 md:pl-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Introduction
        </p>

        <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-slate-900">
          Executive Overview
        </h2>

        <p className="mt-4 text-[14px] leading-8 text-slate-700">
          รายงานฉบับนี้จัดทำขึ้นเพื่อสรุปผลการประเมินช่องโหว่ของระบบเครือข่ายในรอบการสแกนล่าสุด
          โดยเน้นการนำเสนอข้อมูลในรูปแบบที่เหมาะกับการทบทวนเชิงบริหารและการติดตามเชิงปฏิบัติการ
          มากกว่าการแสดงผลลัพธ์ดิบจากเครื่องมือสแกนเพียงอย่างเดียว
        </p>

        <p className="mt-4 text-[14px] leading-8 text-slate-700">
          เนื้อหาในรายงานครอบคลุมภาพรวมของจำนวน findings,
          การกระจายตัวของระดับความรุนแรง, การเปรียบเทียบกับรอบก่อน,
          การระบุ asset และ vulnerability ที่มีความเสี่ยงสูง,
          รวมถึงข้อเสนอแนะเพื่อการจัดลำดับ remediation
          ให้สอดคล้องกับความเสี่ยงที่ตรวจพบ
        </p>

        {subtitle ? (
          <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] leading-7 text-slate-600">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default ReportIntro;