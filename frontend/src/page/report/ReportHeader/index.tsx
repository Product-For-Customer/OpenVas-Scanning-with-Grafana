import React from "react";
import logo from "../../../assets/getonlogo.jpg";

type ReportInfo = {
  title: string;
  subtitle?: string;
  dateRange: string;
  generatedAt: string;
  classification?: string;
  version?: string;
  companyName?: string;
};

type ReportHeaderProps = {
  info: ReportInfo;
};

const metaCardClass =
  "rounded-md border border-slate-300 bg-slate-50 px-4 py-3";

const ReportHeader: React.FC<ReportHeaderProps> = ({ info }) => {
  return (
    <header className="border-b-[6px] border-slate-800 bg-white">
      <div className="px-5 py-6 md:px-8 md:py-8 xl:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-sm border border-slate-800 bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                Network Security Report
              </span>

              {info.classification ? (
                <span className="inline-flex items-center rounded-sm border border-slate-300 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {info.classification}
                </span>
              ) : null}

              {info.version ? (
                <span className="inline-flex items-center rounded-sm border border-slate-300 bg-white px-3 py-1 text-[10px] font-medium text-slate-600">
                  {info.version}
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 text-[28px] font-bold leading-tight text-slate-950 md:text-[34px]">
              {info.title}
            </h1>

            {info.subtitle ? (
              <p className="mt-3 max-w-4xl text-[14px] leading-7 text-slate-600">
                {info.subtitle}
              </p>
            ) : null}

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className={metaCardClass}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Report Period
                </p>
                <p className="mt-1 text-[14px] font-medium text-slate-900">
                  {info.dateRange}
                </p>
              </div>

              <div className={metaCardClass}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Generated At
                </p>
                <p className="mt-1 text-[14px] font-medium text-slate-900">
                  {info.generatedAt}
                </p>
              </div>

              <div className={metaCardClass}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Assessment Scope
                </p>
                <p className="mt-1 text-[14px] font-medium text-slate-900">
                  Vulnerability, Risk, Exposure
                </p>
              </div>

              <div className={metaCardClass}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Intended Audience
                </p>
                <p className="mt-1 text-[14px] font-medium text-slate-900">
                  Management / Security Team
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-start justify-start lg:justify-end">
            <div className="w-full max-w-60 rounded-md border border-slate-300 bg-white p-4">
              <div className="flex items-center justify-center border-b border-slate-200 pb-3">
                <img
                  src={logo}
                  alt="Security Report Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>

              <div className="pt-3 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Prepared By
                </p>
                <p className="mt-1 text-[13px] font-medium text-slate-900">
                  {info.companyName || "Enterprise Security"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ReportHeader;