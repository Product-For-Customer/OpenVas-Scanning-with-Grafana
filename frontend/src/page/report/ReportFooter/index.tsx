import React from "react";

type ReportFooterProps = {
  page?: string;
};

const ReportFooter: React.FC<ReportFooterProps> = ({
  page = "Page 1 of 1",
}) => {
  return (
    <footer className="border-t border-slate-300 pt-2">
      <div className="flex items-center justify-between gap-4 text-[11px] leading-[1.35] text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold uppercase tracking-[0.15em] text-slate-700">
            Internal Report
          </span>
          <span>•</span>
          <span>Network Vulnerability Assessment</span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 text-right">
          <span>Prepared for internal operational review</span>
          <span>•</span>
          <span className="font-medium text-slate-700">{page}</span>
        </div>
      </div>
    </footer>
  );
};

export default ReportFooter;