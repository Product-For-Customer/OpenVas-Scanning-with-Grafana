import React from "react";
import {
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";

type StatItem = {
  id: number;
  title: string;
  value: string;
  changeText: string;
  trend: "up" | "down";
  accent: "purple" | "green" | "red";
  icon: React.ReactNode;
};

const stats: StatItem[] = [
  {
    id: 1,
    title: "Total Sales",
    value: "$280k",
    changeText: "2.09% VS / last week",
    trend: "up",
    accent: "purple",
    icon: <FiShoppingBag />,
  },
  {
    id: 2,
    title: "Total Orders",
    value: "2,352",
    changeText: "5.27% VS / last week",
    trend: "up",
    accent: "green",
    icon: <FiBox />,
  },
  {
    id: 3,
    title: "Customers",
    value: "48,254",
    changeText: "1.04% VS / last week",
    trend: "down",
    accent: "red",
    icon: <FiUsers />,
  },
  {
    id: 4,
    title: "Growth",
    value: "+30.56%",
    changeText: "4.87% VS / last week",
    trend: "up",
    accent: "green",
    icon: <FiTrendingUp />,
  },
];

const accentTextClass = (accent: StatItem["accent"]) => {
  if (accent === "green") return "text-[#22c55e]";
  if (accent === "red") return "text-[#ef4444]";
  return "text-[#6f5be8]";
};

const StatusTarget: React.FC = () => {
  return (
    <section className="w-full">
      {/* ✅ 1) HERO */}
      <div className="relative rounded-[26px] bg-[#26224b] text-white px-6 sm:px-8 pt-7 sm:pt-8 pb-28 sm:pb-32 overflow-hidden">
        {/* glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-[26px] sm:text-[30px] font-semibold tracking-tight">
              Good Day, Orion <span className="ml-1">👋</span>
            </h2>
            <p className="mt-1 text-[13px] sm:text-[14px] text-white/75">
              Here's what's updating with your E-shop today
            </p>
          </div>

          <div className="shrink-0 text-[13px] sm:text-[14px] text-white/85 mt-1">
            Thursday, 26 Feb 2026
          </div>
        </div>
      </div>

      {/* ✅ 2) CARDS (ไม่ใช้ absolute แล้ว) */}
      <div className="px-4 sm:px-5 md:px-6 -mt-18 sm:-mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s) => (
            <div
              key={s.id}
              className="
                rounded-[20px] bg-white text-[#1f2240]
                border border-gray-200/80 shadow-sm
                p-4 sm:p-5
                relative
              "
            >
              {/* light grid overlay */}
              <div
                className="
                  pointer-events-none absolute inset-0 rounded-[20px]
                  bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)]
                  bg-size-16px_16px opacity-70
                "
              />

              <div className="relative">
                {/* top */}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] sm:text-[15px] font-medium text-gray-600">
                    {s.title}
                  </p>

                  <div className="h-10 w-10 rounded-2xl bg-[#f1edff] text-[#6f5be8] flex items-center justify-center text-[18px]">
                    {s.icon}
                  </div>
                </div>

                {/* value */}
                <p className="mt-4 text-[28px] sm:text-[32px] font-semibold tracking-tight">
                  {s.value}
                </p>

                {/* change */}
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center text-[18px] ${accentTextClass(
                      s.accent
                    )}`}
                  >
                    {s.trend === "up" ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  </span>

                  <p className={`text-[13px] sm:text-[14px] font-medium ${accentTextClass(s.accent)}`}>
                    {s.changeText.split(" ")[0]}
                    <span className="text-gray-500 font-normal">
                      {" "}
                      {s.changeText.replace(s.changeText.split(" ")[0], "")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ กันชนกับ section ถัดไป (สำคัญ) */}
        <div className="h-3 sm:h-4" />
      </div>
    </section>
  );
};

export default StatusTarget;