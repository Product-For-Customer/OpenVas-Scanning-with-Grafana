import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import {
  FiBell,
  FiShield,
  FiWifi,
  FiActivity,
  FiRadio,
  FiAlertTriangle,
} from "react-icons/fi";
import { Image } from "antd";
import { useStateContext } from "../../contexts/ContextProvider";

type ReportUser = {
  FirstName?: string;
  LastName?: string;
  Profile?: string;
};

type ReportItem = {
  ID?: number;
  Status?: "Pending" | "Complete";
  Description?: string;
  Picture?: string;
  User?: ReportUser;
};

const mockReports: ReportItem[] = [
  {
    ID: 101,
    Status: "Pending",
    Description:
      "Scan Task: weekly-internal\nพบ Host 10.10.22.15 เปิดพอร์ต 22/80/443 (SSH/HTTP/HTTPS)",
    User: { FirstName: "Scanner", LastName: "Engine" },
  },
  {
    ID: 102,
    Status: "Pending",
    Description:
      "Vulnerability Alert: TLS Weak Cipher\nHost: 10.10.22.40:443",
    User: { FirstName: "SecOps", LastName: "Bot" },
  },
  {
    ID: 103,
    Status: "Complete",
    Description:
      "Scan Completed: dmz-servers\nสรุป: 24 hosts / 3 high / 7 medium / 12 low",
    User: { FirstName: "Admin", LastName: "System" },
  },
  {
    ID: 104,
    Status: "Pending",
    Description:
      "Credentialed Scan Warning\nHost: 10.10.22.77\nสาเหตุ: login failed (SSH)",
    User: { FirstName: "Task", LastName: "Scheduler" },
  },
  {
    ID: 105,
    Status: "Pending",
    Description:
      "New Service Detected\nHost: 10.10.22.18\nService: SMB (445) เปิดใช้งาน",
    User: { FirstName: "Network", LastName: "Monitor" },
  },
];

const Notification: React.FC = () => {
  const ctx = useStateContext() as any;
  const isClicked = ctx?.isClicked;
  const setIsClicked = ctx?.setIsClicked;

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isClicked?.notification) setOpen(true);
  }, [isClicked?.notification]);

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const handleStatusChange = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Complete" : "Pending";
    setReports((prev) =>
      prev.map((r) => (r.ID === id ? { ...r, Status: newStatus as any } : r))
    );
  };

  const handleDelete = (id: number) => {
    setReports((prev) => prev.filter((r) => r.ID !== id));
  };

  const close = () => {
    if (typeof setIsClicked === "function") {
      setIsClicked((prev: any) => ({ ...(prev || {}), notification: false }));
    }
    setOpen(false);
  };

  const avatarFallback = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#dbeafe'/>
              <stop offset='100%' stop-color='#c4b5fd'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' rx='14' fill='url(#g)'/>
          <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
            font-size='16' fill='#334155' font-family='Arial'>SOC</text>
        </svg>`
      ),
    []
  );

  const photoFallback = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#e0f2fe'/>
              <stop offset='100%' stop-color='#ede9fe'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' rx='12' fill='url(#g)'/>
          <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
            font-size='12' fill='#475569' font-family='Arial'>SCAN</text>
        </svg>`
      ),
    []
  );

  if (!open) return null;

  return (
    <div
      className={[
        "fixed right-3 top-16 z-50",
        "w-[calc(100vw-24px)] max-w-97.5",
        "rounded-[26px] overflow-hidden",
        "bg-white/95 border border-gray-200/80 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.32)] backdrop-blur",
        "dark:bg-[#08111f]/95 dark:border-white/10 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-none",
      ].join(" ")}
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 right-4 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-gray-200/80 dark:border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 via-sky-500 to-violet-500 text-white shadow-sm">
            <FiBell className="text-[18px]" />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-gray-800 dark:text-white/90 truncate">
                Scan Notifications
              </p>
              <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold bg-linear-to-r from-cyan-500 to-violet-500 text-white">
                {reports.length > 99 ? "99+" : reports.length}
              </span>
            </div>

            <p className="text-[12px] text-gray-500 dark:text-white/50 truncate">
              findings / status / alerts
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-colors text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:text-white/70 dark:hover:bg-white/10 dark:active:bg-white/15"
        >
          <MdOutlineCancel className="text-[20px]" />
        </button>
      </div>

      {/* List */}
      <div className="relative z-10 p-4 space-y-3" style={{ maxHeight: 430, overflowY: "auto" }}>
        {reports.map((item) => {
          const profileSrc = item.User?.Profile?.trim() ? item.User.Profile : avatarFallback;
          const reportImageSrc = item.Picture?.trim() ? item.Picture : photoFallback;
          const statusIsPending = (item.Status || "Pending") === "Pending";

          return (
            <div
              key={item.ID}
              className={[
                "relative overflow-hidden rounded-2xl p-3.5 border transition-all duration-200",
                "border-gray-200/80 bg-white hover:bg-gray-50",
                "dark:border-white/10 dark:bg-white/4 dark:hover:bg-white/6",
              ].join(" ")}
            >
              <div
                className={[
                  "pointer-events-none absolute inset-x-0 top-0 h-1",
                  statusIsPending
                    ? "bg-linear-to-r from-cyan-500 via-sky-500 to-violet-500"
                    : "bg-linear-to-r from-emerald-400 to-cyan-500",
                ].join(" ")}
              />

              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={profileSrc}
                    alt={`${item.User?.FirstName || ""} ${item.User?.LastName || ""}`}
                    className="h-11 w-11 rounded-2xl object-cover ring-1 ring-gray-200 bg-white dark:ring-white/10 dark:bg-white/10"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = avatarFallback;
                    }}
                  />

                  <span className="absolute -right-1 -bottom-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 dark:bg-[#08111f] dark:ring-white/10">
                    {statusIsPending ? (
                      <FiWifi className="text-[12px] text-violet-600 dark:text-violet-300" />
                    ) : (
                      <FiShield className="text-[12px] text-emerald-600 dark:text-emerald-300" />
                    )}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 dark:text-white/85 truncate">
                        {item.User?.FirstName || "Guest"} {item.User?.LastName || ""}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold border",
                            statusIsPending
                              ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:border-violet-400/20"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-400/20",
                          ].join(" ")}
                        >
                          {item.Status || "Pending"}
                        </span>

                        {statusIsPending && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-300">
                            <FiRadio className="text-[10px]" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-xl shrink-0",
                        statusIsPending
                          ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                      ].join(" ")}
                    >
                      {statusIsPending ? <FiAlertTriangle /> : <FiActivity />}
                    </span>
                  </div>

                  {item.Picture && (
                    <div className="mt-2">
                      <Image
                        width={78}
                        height={78}
                        className="rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-white/10"
                        src={reportImageSrc}
                        alt="Report"
                        fallback={photoFallback}
                        preview={{ mask: "Preview" }}
                      />
                    </div>
                  )}

                  <p className="mt-3 text-[13px] leading-6 text-gray-600 dark:text-white/70 whitespace-pre-line">
                    {item.Description || "-"}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(item.ID!, item.Status || "Pending")}
                      className={[
                        "inline-flex items-center h-8 px-3 rounded-xl text-[12px] font-semibold border transition-colors",
                        "text-gray-700 border-gray-200 bg-white hover:bg-gray-100 active:bg-gray-200",
                        "dark:text-white/75 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:active:bg-white/15",
                      ].join(" ")}
                    >
                      เปลี่ยนสถานะ
                    </button>

                    <button
                      onClick={() => handleDelete(item.ID!)}
                      title="Delete Report"
                      className="ml-auto inline-flex items-center h-8 px-3 rounded-xl text-[12px] font-semibold border transition-colors border-red-200 text-red-600 bg-white hover:bg-red-50 active:bg-red-100 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                    >
                      <FaTrash className="mr-1.5" size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {reports.length === 0 && (
          <div className="text-center text-gray-500 dark:text-white/55 text-sm py-10">
            ยังไม่มีการแจ้งเตือนใหม่
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;