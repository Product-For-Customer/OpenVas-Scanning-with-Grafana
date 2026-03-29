import React from "react";

type HighlightItem = {
  id: number;
  title: string;
  description: string;
  tone?: "good" | "warning" | "critical" | "neutral";
};

type ExecutiveHighlightsProps = {
  items: HighlightItem[];
};

const toneStyle: Record<NonNullable<HighlightItem["tone"]>, string> = {
  good: "bg-emerald-700",
  warning: "bg-amber-600",
  critical: "bg-rose-700",
  neutral: "bg-slate-700",
};

const toneLabel: Record<NonNullable<HighlightItem["tone"]>, string> = {
  good: "Improved",
  warning: "Attention",
  critical: "Critical",
  neutral: "Observation",
};

const ExecutiveHighlights: React.FC<ExecutiveHighlightsProps> = ({ items }) => {
  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Management Summary
        </p>
        <h3 className="mt-1 text-[22px] font-semibold text-slate-900">
          Key Findings at a Glance
        </h3>
      </div>

      <div className="divide-y divide-slate-200">
        {items.map((item) => {
          const tone = item.tone || "neutral";

          return (
            <div key={item.id} className="px-5 py-5 md:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${toneStyle[tone]}`} />
                    <h4 className="text-[16px] font-semibold text-slate-900">
                      {item.title}
                    </h4>
                  </div>

                  <p className="mt-3 text-[14px] leading-7 text-slate-700">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex rounded-sm border border-slate-300 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-700">
                    {toneLabel[tone]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExecutiveHighlights;