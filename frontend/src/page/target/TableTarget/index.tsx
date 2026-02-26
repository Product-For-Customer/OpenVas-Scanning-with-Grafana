import React from "react";
import { FiMoreVertical, FiMessageSquare, FiTrash2 } from "react-icons/fi";

type Row = {
  id: string;
  name: string;
  subtitle: string; // 90+ Courses
  avatar: string;
  course: string;
  publishOn: string;
  enrolled: string;
  progressPercent: number;
  progressLabel: string; // "Growing"
  rating: number;
};

const rows: Row[] = [
  {
    id: "1",
    name: "Ronald Richards",
    subtitle: "90+ Courses",
    avatar: "https://i.pravatar.cc/80?img=12",
    course: "Web Design",
    publishOn: "2024-02-09",
    enrolled: "3.6K+",
    progressPercent: 46,
    progressLabel: "Growing",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Jane Doe",
    subtitle: "120+ Courses",
    avatar: "https://i.pravatar.cc/80?img=5",
    course: "Graphic Design",
    publishOn: "2023-11-12",
    enrolled: "4.2K+",
    progressPercent: 75,
    progressLabel: "Growing",
    rating: 4.9,
  },
  {
    id: "3",
    name: "John Smith",
    subtitle: "80+ Courses",
    avatar: "https://i.pravatar.cc/80?img=32",
    course: "Data Science",
    publishOn: "2024-01-20",
    enrolled: "2.9K+",
    progressPercent: 65,
    progressLabel: "Growing",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Emily Johnson",
    subtitle: "60+ Courses",
    avatar: "https://i.pravatar.cc/80?img=15",
    course: "Machine Learning",
    publishOn: "2023-12-15",
    enrolled: "3.1K+",
    progressPercent: 85,
    progressLabel: "Growing",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Michael Brown",
    subtitle: "50+ Courses",
    avatar: "https://i.pravatar.cc/80?img=36",
    course: "Digital Marketing",
    publishOn: "2023-10-18",
    enrolled: "3.4K+",
    progressPercent: 78,
    progressLabel: "Growing",
    rating: 4.7,
  },
  {
    id: "6",
    name: "Sarah Lee",
    subtitle: "70+ Courses",
    avatar: "https://i.pravatar.cc/80?img=9",
    course: "Content Creation",
    publishOn: "2024-03-22",
    enrolled: "5.0K+",
    progressPercent: 90,
    progressLabel: "Growing",
    rating: 4.9,
  },
];

const TableTarget: React.FC = () => {
  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#1f2240]">
          Top selling courses
        </h2>

        <button
          type="button"
          className="
            h-9 px-4 rounded-xl
            bg-[#6f5be8] text-white text-[13px] font-semibold
            hover:brightness-105 active:brightness-95 transition
          "
        >
          See all
        </button>
      </div>

      {/* Table wrapper */}
      <div className="rounded-2xl bg-white border border-gray-200/80 overflow-hidden">
        {/* Header row */}
        <div
          className="
            grid grid-cols-12 gap-3
            px-4 py-3
            bg-[#f1edff]
            text-[13px] font-semibold text-[#1f2240]
          "
        >
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-2">Publish on</div>
          <div className="col-span-1">Enrolled</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-1">Rating</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {/* Body */}
        <div>
          {rows.map((r, idx) => (
            <div
              key={r.id}
              className={`grid grid-cols-12 gap-3 px-4 py-4 items-center ${
                idx !== 0 ? "border-t border-gray-200/70" : ""
              }`}
            >
              {/* Name */}
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="h-11 w-11 rounded-2xl object-cover ring-1 ring-gray-200 bg-white shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#1f2240]">
                    {r.name}
                  </p>
                  <p className="text-[12px] text-gray-500">{r.subtitle}</p>
                </div>
              </div>

              {/* Course */}
              <div className="col-span-2 text-[14px] text-gray-700">
                {r.course}
              </div>

              {/* Publish on */}
              <div className="col-span-2 text-[14px] text-gray-700">
                {r.publishOn}
              </div>

              {/* Enrolled */}
              <div className="col-span-1 text-[14px] text-gray-700">
                {r.enrolled}
              </div>

              {/* Progress */}
              <div className="col-span-2">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-full rounded-full bg-[#efeefd] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#6f5be8]"
                      style={{ width: `${r.progressPercent}%` }}
                    />
                  </div>
                </div>
                <p className="mt-1 text-[12px] text-gray-600">
                  <span className="font-semibold text-[#1f2240]">
                    {r.progressPercent}%
                  </span>{" "}
                  {r.progressLabel}
                </p>
              </div>

              {/* Rating */}
              <div className="col-span-1 flex items-center gap-2 text-[14px] text-gray-700">
                <span className="font-semibold text-[#1f2240]">{r.rating.toFixed(1)}</span>
                <span className="text-[#f5b301]">★</span>
              </div>

              {/* Action */}
              <div className="col-span-1 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="
                    h-10 w-10 rounded-2xl
                    bg-[#f1edff] text-[#6f5be8]
                    hover:brightness-105 active:brightness-95 transition
                    inline-flex items-center justify-center
                  "
                  aria-label="Message"
                >
                  <FiMessageSquare />
                </button>

                <button
                  type="button"
                  className="
                    h-10 w-10 rounded-2xl
                    bg-[#ffe7e3] text-[#ff5c35]
                    hover:brightness-105 active:brightness-95 transition
                    inline-flex items-center justify-center
                  "
                  aria-label="Delete"
                >
                  <FiTrash2 />
                </button>

                <button
                  type="button"
                  className="
                    h-10 w-10 rounded-2xl
                    hover:bg-gray-100 active:bg-gray-200 transition
                    inline-flex items-center justify-center
                    text-gray-500
                  "
                  aria-label="More"
                >
                  <FiMoreVertical />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Mobile hint (optional): ถ้าตารางล้นจอ ให้เลื่อนแนวนอนได้ */}
      <div className="mt-3 text-[12px] text-gray-400 hidden">
        Tip: scroll horizontally on small screens.
      </div>
    </section>
  );
};

export default TableTarget;