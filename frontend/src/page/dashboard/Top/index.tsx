import React from "react";

type CourseItem = {
  id: number;
  title: string;
  author: string;
  publishOn: string;
  enrolled: string;
  price: string;
  image: string;
};

const courses: CourseItem[] = [
  {
    id: 1,
    title: "Figma - UI/UX Design...",
    author: "Jane Howard",
    publishOn: "01 Jan 2024",
    enrolled: "5.5k",
    price: "$19",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Advance Web Design...",
    author: "Jane Howard",
    publishOn: "01 Jan 2024",
    enrolled: "5.5k",
    price: "$19",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "PhP, JavaScript advance...",
    author: "Jane Howard",
    publishOn: "01 Jan 2024",
    enrolled: "5.5k",
    price: "$19",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Digital marketing base...",
    author: "Jane Howard",
    publishOn: "01 Jan 2024",
    enrolled: "5.5k",
    price: "$19",
    image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=300&auto=format&fit=crop",
  },
];

const TopPerforming: React.FC = () => {
  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-5 sm:p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1f2240] tracking-tight">
          Top performing courses
        </h2>

        <button
          type="button"
          className="
            h-10 rounded-xl px-4
            bg-[#6f5be8] text-white text-sm font-semibold
            hover:brightness-105 active:brightness-95
            transition
          "
        >
          See all
        </button>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-140">
          <thead>
            <tr className="text-left text-[13px] text-gray-500">
              <th className="font-semibold py-3 px-2">Course</th>
              <th className="font-semibold py-3 px-2 whitespace-nowrap">Publish on</th>
              <th className="font-semibold py-3 px-2 whitespace-nowrap">Enrolled</th>
              <th className="font-semibold py-3 px-2 whitespace-nowrap text-right">Price</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr
                key={course.id}
                className="border-t border-dashed border-gray-200 align-middle"
              >
                <td className="py-4 px-2 min-w-65">
                  <div className="flex items-center gap-3">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-[#1f2240]">
                        {course.title}
                      </p>
                      <p className="text-[13px] text-gray-500">
                        Author - <span className="text-[#6f5be8]">{course.author}</span>
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2 text-[14px] text-gray-700 whitespace-nowrap">
                  {course.publishOn}
                </td>

                <td className="py-4 px-2 text-[14px] text-gray-700 whitespace-nowrap">
                  {course.enrolled}
                </td>

                <td className="py-4 px-2 text-[14px] text-gray-700 whitespace-nowrap text-right font-medium">
                  {course.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl border border-gray-200 bg-white/70 p-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={course.image}
                alt={course.title}
                className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#1f2240]">
                  {course.title}
                </p>
                <p className="text-[12px] text-gray-500">
                  Author - <span className="text-[#6f5be8]">{course.author}</span>
                </p>

                <div className="mt-2 grid grid-cols-3 gap-2 text-[12px]">
                  <div>
                    <p className="text-gray-400">Publish</p>
                    <p className="text-gray-700 font-medium">{course.publishOn}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Enrolled</p>
                    <p className="text-gray-700 font-medium">{course.enrolled}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400">Price</p>
                    <p className="text-gray-700 font-semibold">{course.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopPerforming;