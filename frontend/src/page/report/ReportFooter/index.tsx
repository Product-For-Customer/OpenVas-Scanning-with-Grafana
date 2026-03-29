import React from "react";

type ReportFooterProps = {
  page?: string;
};

const ReportFooter: React.FC<ReportFooterProps> = ({
  page = "Page 1 of 1",
}) => {
  return (
    <footer className="mt-12 border-t border-slate-300 pt-5">
      <div className="flex flex-col gap-3 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold uppercase tracking-[0.15em] text-slate-700">
            Internal Report
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Network Vulnerability Assessment</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span>Prepared for internal operational review</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-medium text-slate-700">{page}</span>
        </div>
      </div>
    </footer>
  );
};

export default ReportFooter;