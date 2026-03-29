import React from "react";
import type { RecommendationItem } from "../../../interface/type";

type RecommendationsProps = {
  items: RecommendationItem[];
};

const getPriorityTone = (priority: RecommendationItem["priority"]) => {
  switch (priority) {
    case "High":
      return {
        badge: "bg-red-50 text-red-700 border-red-200",
        side: "bg-red-700",
      };
    case "Medium":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        side: "bg-amber-600",
      };
    default:
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        side: "bg-blue-700",
      };
  }
};

const Recommendations: React.FC<RecommendationsProps> = ({ items }) => {
  return (
    <section className="rounded-md border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Recommended Actions
        </p>
        <h2 className="mt-1 text-[22px] font-semibold text-slate-900">
          Remediation Recommendations
        </h2>
        <p className="mt-2 text-[13px] leading-6 text-slate-600">
          ข้อเสนอแนะที่จัดลำดับตามความสำคัญเพื่อใช้วางแผน remediation
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {items.map((item, index) => {
          const tone = getPriorityTone(item.priority);

          return (
            <div key={item.id} className="relative px-5 py-5 md:px-6">
              <div className={`absolute left-0 top-0 h-full w-1 ${tone.side}`} />

              <div className="pl-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-[12px] font-semibold text-slate-700">
                        {index + 1}
                      </span>
                      <h3 className="text-[16px] font-semibold text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-4 text-[14px] leading-7 text-slate-700">
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-sm border px-3 py-1 text-[11px] font-semibold ${tone.badge}`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No recommendations
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommendations;