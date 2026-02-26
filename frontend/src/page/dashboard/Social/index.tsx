import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";

type SocialRow = {
  id: string;
  name: string;
  visits: string;
  percent: number; // 0-100
  icon: React.ReactNode;
};

const socials: SocialRow[] = [
  { id: "fb", name: "Facebook", visits: "85k", percent: 85, icon: <span className="font-bold text-gray-600">f</span> },
  { id: "x", name: "Twitter", visits: "20k", percent: 20, icon: <span className="font-bold text-gray-600">X</span> },
  { id: "ig", name: "Instagram", visits: "45k", percent: 45, icon: <span className="font-bold text-gray-600">◎</span> },
  { id: "in", name: "LinkedIn", visits: "35k", percent: 35, icon: <span className="font-bold text-gray-600">in</span> },
  { id: "pt", name: "Pinterest", visits: "90k", percent: 90, icon: <span className="font-bold text-gray-600">p</span> },
];

const Social: React.FC = () => {
  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
            Social media traffic
          </h3>
        </div>

        <button
          type="button"
          className="h-9 w-9 rounded-xl hover:bg-white active:bg-gray-100 text-gray-500 inline-flex items-center justify-center"
          aria-label="More"
        >
          <FiMoreHorizontal />
        </button>
      </div>

      {/* table header */}
      <div className="mt-4 flex items-center justify-between text-[13px] text-gray-400">
        <span>Network</span>
        <span>Visit</span>
      </div>

      {/* rows */}
      <div className="mt-3 space-y-3">
        {socials.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-gray-200/80 bg-white px-3.5 sm:px-4 py-3 flex items-center gap-3"
          >
            {/* icon box */}
            <div className="h-10 w-10 rounded-2xl border border-gray-200/80 bg-[#fbfbfc] flex items-center justify-center shrink-0">
              {s.icon}
            </div>

            {/* name */}
            <div className="min-w-0 w-28 sm:w-32">
              <p className="truncate text-[13px] sm:text-[14px] font-medium text-[#1f2240]">
                {s.name}
              </p>
            </div>

            {/* bar */}
            <div className="flex-1">
              <div className="h-2.5 rounded-full bg-[#eef0f6] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${s.percent}%`,
                    background: "linear-gradient(90deg, #6f5be8 0%, #7a67ea 55%, #84cc16 100%)",
                  }}
                />
              </div>
            </div>

            {/* visits */}
            <div className="w-12 text-right">
              <p className="text-[13px] sm:text-[14px] font-semibold text-[#1f2240]">
                {s.visits}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Social;