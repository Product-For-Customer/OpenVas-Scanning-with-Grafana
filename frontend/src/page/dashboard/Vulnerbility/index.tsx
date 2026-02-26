import React from "react";

type VulnRow = {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  count: number;
};

const rows: VulnRow[] = [
  { id: "1", severity: "CRITICAL", title: "MS17-010: Security Update for Microsoft Windows...", count: 6 },
  { id: "2", severity: "CRITICAL", title: "MS17-012: Security Update for Microsoft Windows...", count: 6 },
  { id: "3", severity: "CRITICAL", title: "KB4343899: Windows 7 and Windows Server 200...", count: 5 },
  { id: "4", severity: "CRITICAL", title: "MS15-034: Vulnerability in HTTP.sys Could Allow R...", count: 5 },
  { id: "5", severity: "CRITICAL", title: "MS16-077: Security Update for WPAD (3165191)", count: 5 },
  { id: "6", severity: "CRITICAL", title: "MS17-010: Security Update for Microsoft Windows...", count: 5 },
  { id: "7", severity: "CRITICAL", title: "Microsoft Malware Protection Engine < 1.1.14405...", count: 4 },
  { id: "8", severity: "CRITICAL", title: "MS Security Advisory 4022344: Security Update fo...", count: 4 },
];

const badgeClasses: Record<VulnRow["severity"], string> = {
  CRITICAL: "bg-[#d94b3e] text-white",
  HIGH: "bg-[#f97316] text-white",
  MEDIUM: "bg-[#eab308] text-white",
  LOW: "bg-[#22c55e] text-white",
  INFO: "bg-[#3b82f6] text-white",
};

const TopVulnerability: React.FC = () => {
  return (
    <section className="rounded-[22px] bg-[#f7f7f8] border border-gray-200/80 shadow-sm p-4 sm:p-5 md:p-6 h-full">
      <div className="mb-3">
        <h3 className="text-[14px] font-semibold text-gray-400 tracking-wide">
          TOP VULNERABILITIES
        </h3>
      </div>

      <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden">
        {rows.map((r, idx) => (
          <div
            key={r.id}
            className={`flex items-center gap-3 px-3.5 sm:px-4 py-3 ${
              idx !== 0 ? "border-t border-gray-200/70" : ""
            }`}
          >
            <span
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold ${badgeClasses[r.severity]}`}
            >
              {r.severity}
            </span>

            <p className="min-w-0 flex-1 truncate text-[13px] sm:text-[14px] font-medium text-[#1f2240]">
              {r.title}
            </p>

            <span className="shrink-0 h-6 min-w-6 px-1.5 rounded-md border border-gray-200 bg-[#fbfbfc] text-[12px] text-gray-600 inline-flex items-center justify-center">
              {r.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopVulnerability;