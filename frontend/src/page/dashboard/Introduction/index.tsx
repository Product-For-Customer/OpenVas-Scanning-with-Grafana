import React from "react";
import { FiPlus } from "react-icons/fi";

const Introduction: React.FC = () => {
  return (
    <section
      className={[
        "rounded-[22px] p-5 sm:p-6 md:p-8 h-full overflow-hidden",
        // ✅ Light
        "bg-white border border-gray-200/80 shadow-sm",
        // ✅ Dark
        "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
      ].join(" ")}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center h-full">
        {/* Left content */}
        <div className="min-w-0">
          <p className="text-[15px] sm:text-[16px] text-gray-400 dark:text-white/55 mb-4">
            Today is Wednesday, 25 Feb 2026
          </p>

          <h2 className="text-[34px] sm:text-[42px] lg:text-[50px] leading-[1.1] font-semibold text-[#1f2240] dark:text-white/90 tracking-tight">
            Welcome
            <br />
            Alex Jionsion
          </h2>

          {/* ✅ Start Scanning -> open localhost:9392 in new tab */}
          <a
            href="http://localhost:9392"
            target="_blank"
            rel="noreferrer"
            className={[
              "mt-6 sm:mt-8 inline-flex items-center gap-2",
              "h-14 rounded-2xl px-6",
              "bg-[#6f5be8] text-white text-[16px] sm:text-[18px] font-semibold",
              "hover:brightness-105 active:brightness-95 transition shadow-sm",
              // เพิ่ม focus ให้สวยทั้ง light/dark
              "focus:outline-none focus:ring-2 focus:ring-[#6f5be8]/40 focus:ring-offset-2",
              "dark:focus:ring-offset-[#070A12]",
            ].join(" ")}
            aria-label="Start Scanning (open GSA on localhost:9392)"
          >
            <FiPlus className="text-[22px]" />
            Start Scanning
          </a>
        </div>

        {/* Right illustration */}
        <div className="relative hidden md:flex justify-center lg:justify-end">
          {/* decor top */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 opacity-40">
            <div className="relative w-full h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 block w-2 h-6 rounded-full bg-[#8fd47d]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 36}deg) translateY(-18px)`,
                    transformOrigin: "center 18px",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="w-full max-w-105 lg:max-w-125">
            <svg
              viewBox="0 0 520 360"
              className="w-full h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Welcome illustration"
            >
              {/* screen */}
              <rect
                x="180"
                y="50"
                width="280"
                height="210"
                rx="14"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#27254D] dark:text-white/55"
                fill="currentColor"
                opacity="0"
              />
              <rect
                x="180"
                y="50"
                width="280"
                height="210"
                rx="14"
                stroke="#27254D"
                strokeWidth="2"
                className="dark:stroke-white/30 dark:fill-white/10"
                fill="#FBFBFD"
              />
              <rect
                x="180"
                y="50"
                width="280"
                height="28"
                rx="14"
                fill="#FBFBFD"
                className="dark:fill-white/10"
              />
              <circle cx="425" cy="64" r="4.5" fill="#27254D" className="dark:fill-white/40" />
              <circle cx="442" cy="64" r="4.5" fill="#27254D" className="dark:fill-white/40" />
              <circle cx="459" cy="64" r="4.5" fill="#27254D" className="dark:fill-white/40" />

              {/* floating panel */}
              <rect
                x="130"
                y="20"
                width="160"
                height="130"
                rx="10"
                fill="#FBFBFD"
                className="dark:fill-white/10"
                stroke="#7A67EA"
                strokeWidth="2"
              />
              <rect x="144" y="34" width="105" height="40" rx="4" fill="#8C79E8" />
              <rect x="258" y="34" width="18" height="4" rx="2" fill="#CFC8F8" />
              <rect x="258" y="44" width="18" height="4" rx="2" fill="#CFC8F8" />
              <rect x="258" y="54" width="18" height="4" rx="2" fill="#CFC8F8" />
              <rect x="144" y="84" width="42" height="6" rx="3" fill="#D9D4FA" />
              <rect x="192" y="84" width="42" height="6" rx="3" fill="#D9D4FA" />
              <rect x="240" y="84" width="36" height="6" rx="3" fill="#D9D4FA" />
              <rect x="144" y="98" width="62" height="26" rx="4" fill="#F4F2FF" className="dark:fill-white/10" />
              <rect x="212" y="98" width="64" height="26" rx="4" fill="#F4F2FF" className="dark:fill-white/10" />

              {/* desk */}
              <rect x="215" y="270" width="150" height="16" rx="8" fill="#27254D" className="dark:fill-white/30" />
              <rect x="205" y="286" width="170" height="10" rx="5" fill="#27254D" className="dark:fill-white/30" />
              <rect x="240" y="296" width="110" height="8" rx="4" fill="#27254D" opacity="0.85" className="dark:fill-white/25" />

              {/* table */}
              <rect x="175" y="225" width="120" height="10" rx="3" fill="#FBFBFD" className="dark:fill-white/10" stroke="#27254D" strokeWidth="2" />
              <line x1="190" y1="235" x2="182" y2="300" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <line x1="280" y1="235" x2="288" y2="300" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />

              {/* person left */}
              <circle cx="210" cy="190" r="14" fill="#27254D" className="dark:fill-white/35" />
              <path d="M196 208C203 200 219 200 226 209L238 240H214L196 208Z" fill="#27254D" className="dark:fill-white/35" />
              <path d="M215 240L230 294" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <path d="M202 240L193 294" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <path d="M188 298H204" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <path d="M225 298H241" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />

              {/* laptop */}
              <rect x="225" y="214" width="46" height="28" rx="4" fill="#27254D" className="dark:fill-white/30" />
              <circle cx="248" cy="227" r="2" fill="#FBFBFD" className="dark:fill-white/70" />

              {/* person right */}
              <circle cx="375" cy="110" r="12" fill="#27254D" className="dark:fill-white/35" />
              <path d="M362 124C376 116 402 121 414 136C425 150 426 170 418 185L374 185L354 152C348 141 351 130 362 124Z" fill="#27254D" className="dark:fill-white/35" />
              <path d="M353 153C342 153 334 160 332 171" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <path d="M406 175L435 192" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <path d="M433 193C442 197 448 194 452 186" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <path d="M385 132L332 120" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />
              <path d="M330 118C322 116 318 120 320 127" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/30" />

              {/* small play button */}
              <circle cx="322" cy="220" r="13" fill="#FBFBFD" className="dark:fill-white/10" stroke="#7A67EA" strokeWidth="2" />
              <path d="M318 214L328 220L318 226V214Z" fill="#7A67EA" />

              {/* little decorations */}
              <circle cx="355" cy="220" r="12" fill="#FBFBFD" className="dark:fill-white/10" stroke="#27254D" strokeWidth="2" />
              <path d="M350 215L360 225M360 215L350 225" stroke="#27254D" strokeWidth="2" className="dark:stroke-white/35" />
              <path d="M300 180L306 174M312 180L318 174M300 174L306 180M312 174L318 180" stroke="#C9C2F8" strokeWidth="2" />
              <path d="M390 238C406 248 418 262 425 280" stroke="#27254D" strokeWidth="2" strokeLinecap="round" className="dark:stroke-white/30" />
              <path d="M430 250C444 264 455 281 462 300" stroke="#27254D" strokeWidth="2" strokeLinecap="round" opacity="0.6" className="dark:stroke-white/20" />
            </svg>
          </div>

          {/* decor bottom */}
          <div className="absolute -bottom-8 left-6 w-16 h-16 opacity-25">
            <div className="relative w-full h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-1/2 block w-2 h-6 rounded-full bg-[#bcaefb]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 36}deg) translateY(-18px)`,
                    transformOrigin: "center 18px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;