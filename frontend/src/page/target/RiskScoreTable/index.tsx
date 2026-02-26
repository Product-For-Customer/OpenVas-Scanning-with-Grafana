import React, { useMemo, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";

type RangeKey = "This Month" | "This Year";
const RANGE_OPTIONS: RangeKey[] = ["This Month", "This Year"];

type Person = {
  id: string;
  name: string;
  courses: string;
  rating: number;
  avatar: string; // url
};

const PEOPLE: Person[] = [
  {
    id: "1",
    name: "Ronald Richards",
    courses: "90+ Courses",
    rating: 4.8,
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: "2",
    name: "Jane Doe",
    courses: "120+ Courses",
    rating: 4.7,
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "3",
    name: "Michael Johnson",
    courses: "75+ Courses",
    rating: 4.5,
    avatar: "https://i.pravatar.cc/80?img=15",
  },
  {
    id: "4",
    name: "Emily Davis",
    courses: "50+ Courses",
    rating: 4.6,
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    id: "5",
    name: "Sophia Brown",
    courses: "30+ Courses",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/80?img=36",
  },
];

const StarRow: React.FC<{ value: number }> = ({ value }) => {
  const full = Math.round(value); // 4.8 -> 5 ดาวให้ดูเหมือนรูป
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-[14px] ${i < full ? "text-[#f5b301]" : "text-[#e5e7eb]"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const RiskScoreTable: React.FC = () => {
  const [range, setRange] = useState<RangeKey>("This Month");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    // ถ้าคุณอยากเปลี่ยนตาม range ทีหลังค่อยปรับ
    return PEOPLE;
  }, [range]);

  return (
    <section className="h-full rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] tracking-tight">
          Top Instructor
        </h2>

        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="
                h-10 px-4 rounded-xl
                bg-white border border-gray-200/80
                text-[13px] font-medium text-gray-500
                inline-flex items-center gap-2
                hover:bg-gray-50 transition
              "
            >
              {range}
              <span className="text-gray-400">▾</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-20">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRange(opt);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition text-gray-600"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-xl hover:bg-white active:bg-gray-100 text-gray-500 inline-flex items-center justify-center"
            aria-label="More"
          >
            <FiMoreHorizontal />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 flex-1">
        {list.map((p, idx) => (
          <div
            key={p.id}
            className={`py-4 flex items-center justify-between gap-3 ${
              idx !== 0 ? "border-t border-gray-200/70" : ""
            }`}
          >
            {/* left */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={p.avatar}
                alt={p.name}
                className="h-11 w-11 rounded-2xl object-cover ring-1 ring-gray-200 bg-white"
              />

              <div className="min-w-0">
                <p className="truncate text-[15px] sm:text-[16px] font-semibold text-[#1f2240]">
                  {p.name}
                </p>
                <p className="text-[12.5px] sm:text-[13px] text-gray-500">
                  {p.courses}
                </p>
              </div>
            </div>

            {/* right */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <p className="text-[15px] sm:text-[16px] font-semibold text-[#1f2240] w-10 text-right">
                {p.rating.toFixed(1)}
              </p>

              <StarRow value={p.rating} />

              <button
                type="button"
                className="
                  h-10 w-10 rounded-xl
                  bg-[#f1edff] text-[#6f5be8]
                  hover:brightness-105 active:brightness-95
                  inline-flex items-center justify-center
                "
                aria-label="Open"
              >
                <MdKeyboardArrowRight className="text-[22px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RiskScoreTable;