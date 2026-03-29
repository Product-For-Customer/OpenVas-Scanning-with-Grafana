import React from "react";

type SummaryMetric = {
  id: number;
  label: string;
  value: string | number;
  hint?: string;
  subValue?: string;
};

type ReportKPIProps = {
  items: SummaryMetric[];
};

const ReportKPI: React.FC<ReportKPIProps> = ({ items }) => {
  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Snapshot Metrics
            </p>
            <h3 className="mt-1 text-[22px] font-semibold text-slate-900">
              Key Security Indicators
            </h3>
          </div>

          <div className="text-[11px] text-slate-500">
            Latest assessment summary
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`px-5 py-5 md:px-6 ${
              index !== items.length - 1
                ? "border-b border-slate-200 xl:border-b-0"
                : ""
            } ${
              index % 3 !== 2 ? "xl:border-r xl:border-slate-200" : ""
            } ${
              index < 4 ? "md:border-b md:border-slate-200" : ""
            } ${
              index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {item.label}
            </p>

            <p className="mt-3 text-[34px] font-bold leading-none text-slate-950">
              {item.value}
            </p>

            <p className="mt-3 text-[13px] leading-6 text-slate-600">
              {item.hint || item.subValue || "Assessment summary metric"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReportKPI;