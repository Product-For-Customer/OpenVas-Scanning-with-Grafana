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
          </div>

          <div className="flex shrink-0 items-start justify-start lg:justify-end">
            <div className="flex items-center justify-center">
              <img
                src={logo}
                alt="Security Report Logo"
                className="h-20 w-auto object-contain md:h-24"
              />
            </div>
          </div>
        </div>

        {info.companyName ? (
          <div className="mt-6 border-t border-slate-200 pt-3">
            <p className="text-right text-[12px] text-slate-500">
              Prepared by{" "}
              <span className="font-medium text-slate-700">
                {info.companyName}
              </span>
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default ReportHeader;