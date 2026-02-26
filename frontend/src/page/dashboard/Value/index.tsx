import React from "react";

type StatCard = {
  id: number;
  title: string;
  value: string;
  percentText: string;
  trend: "up" | "down";
  color: "purple" | "orange";
  period: string;
};

const stats: StatCard[] = [
  {
    id: 1,
    title: "Total revenue",
    value: "$30,000",
    percentText: "09% Below Target",
    trend: "up",
    color: "purple",
    period: "30 Days",
  },
  {
    id: 2,
    title: "Total enrollments",
    value: "21,000",
    percentText: "05% Below Target",
    trend: "up",
    color: "orange",
    period: "30 Days",
  },
  {
    id: 3,
    title: "Total courses",
    value: "25,000",
    percentText: "50% Below Target",
    trend: "up",
    color: "purple",
    period: "30 Days",
  },
  {
    id: 4,
    title: "Average rating",
    value: "4.5",
    percentText: "05% Below Target",
    trend: "up",
    color: "purple",
    period: "30 Days",
  },
  {
    id: 5,
    title: "Total users",
    value: "12,400",
    percentText: "03% Below Target",
    trend: "up",
    color: "purple",
    period: "30 Days",
  },
];

const Value: React.FC = () => {
  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-3 sm:p-3.5">
      {/* ✅ แถวเดียวบน xl: 5 คอลัมน์ / จอเล็กจะค่อย ๆ wrap แบบสวย */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">
        {stats.map((item) => {
          const isPurple = item.color === "purple";

          return (
            <div
              key={item.id}
              className="
                min-w-0
                rounded-2xl border border-gray-200/80 bg-[#fbfbfc]
                shadow-sm
                p-2.5 sm:p-3
                flex flex-col justify-between
                min-h-25
              "
            >
              {/* top row */}
              <div className="flex items-start justify-between gap-2 min-w-0">
                <h3 className="min-w-0 truncate text-[12px] sm:text-[12.5px] leading-[1.15] font-semibold text-[#3a3d4f]">
                  {item.title}
                </h3>

                <span
                  className="
                    shrink-0 rounded-full border border-gray-200
                    h-5.5 px-2 inline-flex items-center justify-center
                    text-[10px] text-gray-400 bg-white
                  "
                >
                  {item.period}
                </span>
              </div>

              {/* value */}
              <div className="mt-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="truncate text-[14px] sm:text-[15px] font-semibold text-[#1f2240] tracking-tight">
                    {item.value}
                  </p>

                  <span
                    className={`inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[9px] font-bold ${
                      isPurple
                        ? "border-[#8c79e8] text-[#6f5be8]"
                        : "border-[#ff7a59] text-[#ff5c35]"
                    }`}
                    aria-label={item.trend === "up" ? "trend up" : "trend down"}
                  >
                    {item.trend === "up" ? "↑" : "↓"}
                  </span>
                </div>

                <p className="mt-1 text-[10.5px] sm:text-[11px] font-medium">
                  <span className={isPurple ? "text-[#6f5be8]" : "text-[#ff5c35]"}>
                    {item.percentText.split(" ")[0]}
                  </span>{" "}
                  <span className="text-gray-400">
                    {item.percentText.replace(item.percentText.split(" ")[0], "").trim()}
                  </span>
                </p>
              </div>

              {/* tiny placeholder line */}
              <div className="mt-2 h-6 rounded-lg bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-size-16px_16px opacity-70" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Value;