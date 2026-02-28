import React from "react";
import {
  FiPlay,
  FiShield,
  FiActivity,
  FiWifi,
} from "react-icons/fi";

const Introduction: React.FC = () => {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <section
      className={[
        "relative overflow-hidden rounded-[26px] p-5 sm:p-6 md:p-8 h-full",
        "bg-white border border-slate-200/80 shadow-[0_10px_40px_rgba(15,23,42,0.06)]",
        "dark:bg-[#08111f]/95 dark:border-white/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/10" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
        {/* Left content */}
        <div className="min-w-0">
          {/* Badge */}
          <div
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 mb-5",
              "bg-cyan-50 text-cyan-700 border border-cyan-200/80",
              "dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/20",
            ].join(" ")}
          >
            <FiShield className="text-[16px]" />
            <span className="text-[13px] sm:text-[14px] font-semibold tracking-wide">
              Network Vulnerability Scanning
            </span>
          </div>

          <p className="text-[14px] sm:text-[15px] text-slate-500 dark:text-white/50 mb-4">
            Today is {currentDate}
          </p>

          <h2 className="text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.05] font-bold tracking-tight text-slate-900 dark:text-white">
            Scan Network
          </h2>

          <p className="mt-5 max-w-155 text-[15px] sm:text-[17px] leading-7 text-slate-600 dark:text-white/65">
            Detect vulnerable assets, monitor suspicious hosts, and launch
            network scans from one centralized security dashboard designed for
            real-time visibility.
          </p>

          {/* Stats pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div
              className={[
                "inline-flex items-center gap-2 rounded-2xl px-4 py-3",
                "bg-slate-50 border border-slate-200 text-slate-700",
                "dark:bg-white/4 dark:border-white/10 dark:text-white/75",
              ].join(" ")}
            >
              <FiWifi className="text-cyan-500 text-[18px]" />
              <span className="text-[14px] font-medium">Asset Discovery</span>
            </div>

            <div
              className={[
                "inline-flex items-center gap-2 rounded-2xl px-4 py-3",
                "bg-slate-50 border border-slate-200 text-slate-700",
                "dark:bg-white/4 dark:border-white/10 dark:text-white/75",
              ].join(" ")}
            >
              <FiActivity className="text-violet-500 text-[18px]" />
              <span className="text-[14px] font-medium">Live Scan Status</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="http://localhost:9392"
              target="_blank"
              rel="noreferrer"
              className={[
                "inline-flex items-center gap-2 h-14 rounded-2xl px-6",
                "bg-linear-to-r from-cyan-500 via-sky-500 to-violet-500",
                "text-white text-[16px] sm:text-[17px] font-semibold",
                "shadow-[0_10px_30px_rgba(14,165,233,0.25)]",
                "hover:scale-[1.02] active:scale-[0.99] transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:ring-offset-2",
                "dark:focus:ring-offset-[#08111f]",
              ].join(" ")}
              aria-label="Start Security Scan"
            >
              <FiPlay className="text-[20px]" />
              Start Security Scan
            </a>

            <div className="text-[13px] sm:text-[14px] text-slate-500 dark:text-white/45">
              Open GSA at localhost:9392
            </div>
          </div>
        </div>

        {/* Right illustration */}
        <div className="relative hidden md:flex justify-center lg:justify-end">
          <div className="w-full max-w-140">
            <svg
              viewBox="0 0 620 420"
              className="w-full h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Network scanning illustration"
            >
              {/* defs */}
              <defs>
                <linearGradient id="scanPanel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.18" />
                </linearGradient>
                <linearGradient id="mainStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* outer background floating card */}
              <rect
                x="150"
                y="40"
                width="390"
                height="250"
                rx="24"
                fill="url(#scanPanel)"
                stroke="url(#mainStroke)"
                strokeOpacity="0.55"
                strokeWidth="1.5"
              />

              {/* monitor */}
              <rect
                x="185"
                y="75"
                width="320"
                height="185"
                rx="18"
                fill="#F8FBFF"
                stroke="#1E293B"
                strokeOpacity="0.12"
                strokeWidth="1.5"
                className="dark:fill-[#071221] dark:stroke-white/10"
              />

              {/* top bar */}
              <rect
                x="185"
                y="75"
                width="320"
                height="28"
                rx="18"
                fill="#EEF6FF"
                className="dark:fill-white/5"
              />
              <circle cx="210" cy="89" r="4" fill="#22d3ee" />
              <circle cx="226" cy="89" r="4" fill="#60a5fa" />
              <circle cx="242" cy="89" r="4" fill="#8b5cf6" />

              {/* left mini dashboard */}
              <rect
                x="205"
                y="120"
                width="120"
                height="100"
                rx="14"
                fill="#ffffff"
                stroke="#CFE7FF"
                className="dark:fill-[#0b1728] dark:stroke-white/10"
              />
              <circle cx="265" cy="170" r="34" fill="url(#radarGlow)" />
              <circle
                cx="265"
                cy="170"
                r="34"
                stroke="#22d3ee"
                strokeOpacity="0.8"
                strokeWidth="2"
              />
              <circle
                cx="265"
                cy="170"
                r="22"
                stroke="#22d3ee"
                strokeOpacity="0.65"
                strokeWidth="1.8"
              />
              <circle
                cx="265"
                cy="170"
                r="10"
                stroke="#22d3ee"
                strokeOpacity="0.55"
                strokeWidth="1.5"
              />
              <path
                d="M265 170L286 154"
                stroke="#22d3ee"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="286" cy="154" r="4.5" fill="#22d3ee" />
              <circle cx="265" cy="170" r="4" fill="#22d3ee" />

              {/* right mini metrics */}
              <rect
                x="340"
                y="120"
                width="145"
                height="46"
                rx="12"
                fill="#ffffff"
                stroke="#CFE7FF"
                className="dark:fill-[#0b1728] dark:stroke-white/10"
              />
              <rect
                x="340"
                y="174"
                width="145"
                height="46"
                rx="12"
                fill="#ffffff"
                stroke="#CFE7FF"
                className="dark:fill-[#0b1728] dark:stroke-white/10"
              />

              <rect x="358" y="136" width="58" height="8" rx="4" fill="#22d3ee" />
              <rect x="358" y="148" width="92" height="6" rx="3" fill="#BAE6FD" />
              <circle cx="461" cy="143" r="9" fill="#0ea5e9" fillOpacity="0.12" />
              <circle cx="461" cy="143" r="4.5" fill="#22d3ee" />

              <rect x="358" y="190" width="64" height="8" rx="4" fill="#8b5cf6" />
              <rect x="358" y="202" width="82" height="6" rx="3" fill="#DDD6FE" />
              <path
                d="M456 206L463 196L470 206L478 186"
                stroke="#8b5cf6"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* stand */}
              <rect
                x="305"
                y="268"
                width="82"
                height="10"
                rx="5"
                fill="#1E293B"
                className="dark:fill-white/20"
              />
              <rect
                x="285"
                y="278"
                width="122"
                height="12"
                rx="6"
                fill="#0F172A"
                className="dark:fill-white/15"
              />

              {/* network nodes */}
              <circle cx="110" cy="120" r="26" fill="#E0F2FE" className="dark:fill-cyan-500/10" />
              <circle cx="95" cy="285" r="22" fill="#EDE9FE" className="dark:fill-violet-500/10" />
              <circle cx="535" cy="325" r="24" fill="#DBEAFE" className="dark:fill-sky-500/10" />
              <circle cx="485" cy="40" r="18" fill="#ECFEFF" className="dark:fill-cyan-400/10" />
              <circle cx="55" cy="205" r="18" fill="#FEF2F2" className="dark:fill-rose-500/10" />

              {/* node cores */}
              <circle cx="110" cy="120" r="8" fill="#22d3ee" />
              <circle cx="95" cy="285" r="8" fill="#8b5cf6" />
              <circle cx="535" cy="325" r="8" fill="#60a5fa" />
              <circle cx="485" cy="40" r="6" fill="#06b6d4" />
              <circle cx="55" cy="205" r="6" fill="#ef4444" />

              {/* connections */}
              <path
                d="M136 120C170 120 180 130 205 145"
                stroke="url(#mainStroke)"
                strokeOpacity="0.9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
              <path
                d="M117 273C170 250 210 228 238 220"
                stroke="#8b5cf6"
                strokeOpacity="0.85"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
              <path
                d="M483 312C452 286 430 266 402 238"
                stroke="#60a5fa"
                strokeOpacity="0.85"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
              <path
                d="M473 52C454 67 438 82 417 101"
                stroke="#22d3ee"
                strokeOpacity="0.85"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
              <path
                d="M72 205C105 202 150 196 184 186"
                stroke="#ef4444"
                strokeOpacity="0.75"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />

              {/* floating alert card */}
              <rect
                x="70"
                y="42"
                width="120"
                height="72"
                rx="16"
                fill="#ffffff"
                stroke="#FBCFE8"
                className="dark:fill-[#0b1728] dark:stroke-white/10"
              />
              <circle cx="98" cy="78" r="12" fill="#ef4444" fillOpacity="0.12" />
              <path
                d="M98 72V80"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="98" cy="86" r="1.8" fill="#ef4444" />
              <rect x="118" y="68" width="46" height="8" rx="4" fill="#ef4444" fillOpacity="0.85" />
              <rect x="118" y="82" width="34" height="6" rx="3" fill="#FECACA" />

              {/* floating scan card */}
              <rect
                x="440"
                y="250"
                width="122"
                height="82"
                rx="16"
                fill="#ffffff"
                stroke="#CFFAFE"
                className="dark:fill-[#0b1728] dark:stroke-white/10"
              />
              <rect x="458" y="270" width="58" height="8" rx="4" fill="#22d3ee" />
              <rect x="458" y="286" width="82" height="6" rx="3" fill="#BAE6FD" />
              <rect x="458" y="300" width="72" height="6" rx="3" fill="#DDD6FE" />
              <circle
                cx="526"
                cy="280"
                r="11"
                stroke="#22d3ee"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M532 286L540 294"
                stroke="#22d3ee"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* shield */}
              <path
                d="M298 25L330 38V70C330 93 313 108 298 114C283 108 266 93 266 70V38L298 25Z"
                fill="#0ea5e9"
                fillOpacity="0.12"
                stroke="#22d3ee"
                strokeWidth="2"
              />
              <path
                d="M287 68L295 76L311 57"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* soft dots */}
              <circle cx="155" cy="338" r="4" fill="#22d3ee" fillOpacity="0.8" />
              <circle cx="180" cy="352" r="3" fill="#8b5cf6" fillOpacity="0.8" />
              <circle cx="205" cy="338" r="4" fill="#60a5fa" fillOpacity="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;