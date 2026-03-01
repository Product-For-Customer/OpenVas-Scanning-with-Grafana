import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiMoreVertical,
  FiRefreshCw,
  FiTrash2,
  FiSquare,
  FiChevronDown,
  FiShield,
  FiAlertTriangle,
  FiWifi,
  FiServer,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";

type NotificationSeverity = "Critical" | "High" | "Medium" | "Info";
type NotificationType =
  | "Vulnerability Detected"
  | "Port Scan Result"
  | "Scan Completed"
  | "Credential Failure"
  | "New Host Detected"
  | "TLS Weak Cipher"
  | "Service Exposure"
  | "Risk Score Updated";

type NotificationItem = {
  id: number;
  actor: string;
  message: string;
  target: string;
  dateLabel: string;
  time: string;
  source: string;
  severity: NotificationSeverity;
  type: NotificationType;
  avatar: string;
  unread?: boolean;
};

type FilterKey = "Last 24 Hours" | "Last 7 Days" | "Last Two Weeks" | "Last Month";

const FILTER_OPTIONS: FilterKey[] = [
  "Last 24 Hours",
  "Last 7 Days",
  "Last Two Weeks",
  "Last Month",
];

const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    actor: "OpenVAS Scanner",
    message: "detected critical findings on",
    target: "DMZ Web Server 01",
    dateLabel: "Mar 13",
    time: "10:47 AM",
    source: "Weekly Internal Scan",
    severity: "Critical",
    type: "Vulnerability Detected",
    avatar: "https://i.pravatar.cc/120?img=12",
    unread: true,
  },
  {
    id: 2,
    actor: "Network Monitor",
    message: "found exposed ports on",
    target: "Core Router Edge-02",
    dateLabel: "Apr 22",
    time: "11:15 AM",
    source: "Port Discovery Task",
    severity: "High",
    type: "Port Scan Result",
    avatar: "https://i.pravatar.cc/120?img=21",
    unread: true,
  },
  {
    id: 3,
    actor: "Task Scheduler",
    message: "completed the scheduled scan for",
    target: "Finance VLAN Segment",
    dateLabel: "May 10",
    time: "09:30 AM",
    source: "Nightly Security Scan",
    severity: "Info",
    type: "Scan Completed",
    avatar: "https://i.pravatar.cc/120?img=33",
  },
  {
    id: 4,
    actor: "Credential Engine",
    message: "failed authenticated login on",
    target: "Linux Server Auth-11",
    dateLabel: "Jun 18",
    time: "02:25 PM",
    source: "SSH Credentialed Scan",
    severity: "Medium",
    type: "Credential Failure",
    avatar: "https://i.pravatar.cc/120?img=45",
  },
  {
    id: 5,
    actor: "Asset Discovery",
    message: "identified a new active device in",
    target: "Threat Monitoring Zone",
    dateLabel: "Jul 25",
    time: "03:45 PM",
    source: "Live Asset Discovery",
    severity: "Info",
    type: "New Host Detected",
    avatar: "https://i.pravatar.cc/120?img=52",
    unread: true,
  },
  {
    id: 6,
    actor: "TLS Analyzer",
    message: "reported weak cipher configuration on",
    target: "VPN Gateway 04",
    dateLabel: "Aug 15",
    time: "01:10 PM",
    source: "SSL/TLS Inspection",
    severity: "High",
    type: "TLS Weak Cipher",
    avatar: "https://i.pravatar.cc/120?img=16",
  },
  {
    id: 7,
    actor: "Risk Engine",
    message: "updated security exposure score for",
    target: "Database Cluster A",
    dateLabel: "Sep 05",
    time: "04:50 PM",
    source: "Risk Score Calculation",
    severity: "Medium",
    type: "Risk Score Updated",
    avatar: "https://i.pravatar.cc/120?img=27",
  },
  {
    id: 8,
    actor: "Service Inspector",
    message: "reported public service exposure on",
    target: "Application Node 09",
    dateLabel: "Oct 11",
    time: "06:30 PM",
    source: "Service Enumeration Scan",
    severity: "Critical",
    type: "Service Exposure",
    avatar: "https://i.pravatar.cc/120?img=61",
  },
];

const severityStyles: Record<
  NotificationSeverity,
  {
    badge: string;
    dot: string;
    iconWrap: string;
    icon: React.ReactNode;
  }
> = {
  Critical: {
    badge:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-400/20",
    dot: "bg-red-500",
    iconWrap:
      "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-400/20",
    icon: <FiAlertTriangle />,
  },
  High: {
    badge:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-200 dark:border-orange-400/20",
    dot: "bg-orange-500",
    iconWrap:
      "bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-400/20",
    icon: <FiShield />,
  },
  Medium: {
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-400/20",
    dot: "bg-amber-500",
    iconWrap:
      "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-400/20",
    icon: <FiActivity />,
  },
  Info: {
    badge:
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-400/20",
    dot: "bg-cyan-500",
    iconWrap:
      "bg-cyan-50 border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-400/20",
    icon: <FiWifi />,
  },
};

const typeIcon = (type: NotificationType) => {
  if (type === "Port Scan Result") return <FiWifi />;
  if (type === "Scan Completed") return <FiCheckCircle />;
  if (type === "Credential Failure") return <FiShield />;
  if (type === "New Host Detected") return <FiServer />;
  if (type === "TLS Weak Cipher") return <FiShield />;
  if (type === "Service Exposure") return <FiAlertTriangle />;
  if (type === "Risk Score Updated") return <FiActivity />;
  return <FiShield />;
};

const index = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("Last Two Weeks");
  const [openFilter, setOpenFilter] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const notifications = useMemo(() => {
    const q = search.trim().toLowerCase();

    return mockNotifications.filter((item) => {
      const blob = [
        item.actor,
        item.message,
        item.target,
        item.time,
        item.dateLabel,
        item.source,
        item.type,
        item.severity,
      ]
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });
  }, [search, filter]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    notifications.length > 0 && selected.length === notifications.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(notifications.map((n) => n.id));
    }
  };

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[28px] p-4 sm:p-5 md:p-6",
        "bg-white border border-gray-200/80 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.20)]",
        "dark:bg-[#08111f]/95 dark:border-white/10 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-none",
      ].join(" ")}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />
        </div>
      </div>

      <div className="relative z-10">
        {/* Top */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[12px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
              <FiShield className="text-[13px]" />
              Security Notification Center
            </div>

            <h2 className="mt-3 text-[24px] sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-white">
              All Notifications
            </h2>

            <p className="mt-1 text-[13px] sm:text-[14px] text-slate-500 dark:text-white/55">
              See your scan alerts, vulnerability findings, and network activity here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-55 flex-1 sm:flex-none sm:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/35" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className={[
                  "w-full h-11 rounded-2xl pl-10 pr-4 text-[13px] outline-none transition",
                  "border border-gray-200 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-200",
                  "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:ring-cyan-400/10",
                ].join(" ")}
              />
            </div>

            <button
              type="button"
              onClick={toggleSelectAll}
              className={[
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition",
                allSelected
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-400/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
              ].join(" ")}
              title="Select all"
            >
              <FiSquare />
            </button>

            <button
              type="button"
              className={[
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition",
                "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
              ].join(" ")}
              title="Refresh"
            >
              <FiRefreshCw />
            </button>

            <button
              type="button"
              className={[
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition",
                "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
              ].join(" ")}
              title="Delete selected"
            >
              <FiTrash2 />
            </button>

            <button
              type="button"
              className={[
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition",
                "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
              ].join(" ")}
              title="More"
            >
              <FiMoreVertical />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenFilter((s) => !s)}
                className={[
                  "h-11 px-4 rounded-2xl inline-flex items-center gap-2 transition",
                  "bg-white border border-gray-200/80 text-[13px] font-medium text-gray-700 hover:bg-gray-50",
                  "dark:bg-white/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/8",
                ].join(" ")}
              >
                {filter}
                <FiChevronDown
                  className={`transition ${openFilter ? "rotate-180" : ""} text-gray-400 dark:text-white/45`}
                />
              </button>

              {openFilter && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden z-20 border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setFilter(opt);
                        setOpenFilter(false);
                      }}
                      className={[
                        "w-full text-left px-4 py-3 text-[13px] transition",
                        filter === opt
                          ? "bg-cyan-50 text-cyan-700 font-semibold dark:bg-cyan-500/10 dark:text-cyan-200"
                          : "text-gray-700 hover:bg-gray-50 dark:text-white/70 dark:hover:bg-white/8",
                      ].join(" ")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 rounded-3xl border border-gray-200/80 bg-white/70 overflow-hidden dark:border-white/10 dark:bg-white/3">
          {notifications.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                <FiShield className="text-[22px]" />
              </div>
              <h3 className="mt-4 text-[16px] font-semibold text-slate-900 dark:text-white/85">
                No notifications found
              </h3>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                Try adjusting your search or date filter.
              </p>
            </div>
          ) : (
            notifications.map((item, idx) => {
              const tone = severityStyles[item.severity];
              const isSelected = selected.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={[
                    "px-4 sm:px-6 py-4 transition-colors",
                    idx !== notifications.length - 1
                      ? "border-b border-gray-200/70 dark:border-white/10"
                      : "",
                    isSelected
                      ? "bg-cyan-50/70 dark:bg-cyan-500/5"
                      : "hover:bg-gray-50 dark:hover:bg-white/4",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {/* Select */}
                    <button
                      type="button"
                      onClick={() => toggleSelect(item.id)}
                      className={[
                        "mt-2 inline-flex h-5 w-5 shrink-0 rounded-md border transition",
                        isSelected
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-gray-300 bg-white dark:border-white/15 dark:bg-white/5",
                      ].join(" ")}
                      aria-label="Select notification"
                    >
                      {isSelected && (
                        <span className="m-auto h-2 w-2 rounded-xs bg-white" />
                      )}
                    </button>

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={item.avatar}
                        alt={item.actor}
                        className="h-12 w-12 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-white/10"
                      />
                      <span
                        className={[
                          "absolute -right-1 -bottom-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                          "bg-white dark:bg-[#08111f]",
                          tone.iconWrap,
                        ].join(" ")}
                      >
                        {typeIcon(item.type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <p className="text-[14px] sm:text-[15px] leading-6 text-slate-700 dark:text-white/75">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {item.actor}
                            </span>{" "}
                            {item.message}{" "}
                            <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                              {item.target}
                            </span>{" "}
                            <span className="text-slate-500 dark:text-white/45">
                              on {item.dateLabel}
                            </span>
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                            <span className="text-[13px] font-medium text-slate-800 dark:text-white/80">
                              {item.time}
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-white/50">
                              <span className="text-amber-500">★</span>
                              <span className="underline underline-offset-2">
                                {item.source}
                              </span>
                            </span>

                            <span
                              className={[
                                "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                                tone.badge,
                              ].join(" ")}
                            >
                              <span
                                className={`mr-1.5 inline-block h-2 w-2 rounded-full ${tone.dot}`}
                              />
                              {item.severity}
                            </span>

                            <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200">
                              {item.type}
                            </span>

                            {item.unread && (
                              <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right action */}
                        <button
                          type="button"
                          className={[
                            "shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-2xl transition",
                            "text-gray-500 hover:bg-gray-100 active:bg-gray-200",
                            "dark:text-white/55 dark:hover:bg-white/10 dark:active:bg-white/15",
                          ].join(" ")}
                          title="More"
                        >
                          <FiMoreVertical />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {openFilter && (
        <button
          type="button"
          onClick={() => setOpenFilter(false)}
          className="fixed inset-0 z-5 cursor-default"
          aria-label="Close filter overlay"
        />
      )}
    </section>
  );
};

export default index;