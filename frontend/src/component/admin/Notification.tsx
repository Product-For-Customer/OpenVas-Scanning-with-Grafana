// Notification.tsx
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FiBell, FiShield, FiWifi } from "react-icons/fi";
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

// ✅ Mock data: แนว Network Scanning / Vulnerability / Findings
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
  // ✅ ปิดได้จริง: ปิด flag ใน context + local open กันเหนียว
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
              <stop offset='0%' stop-color='#f8fafc'/>
              <stop offset='100%' stop-color='#e2e8f0'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' rx='14' fill='url(#g)'/>
          <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
            font-size='16' fill='#64748b' font-family='Arial'>SCAN</text>
        </svg>`
      ),
    []
  );

  const photoFallback = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
          <rect width='100%' height='100%' rx='10' fill='#f1f5f9'/>
          <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
            font-size='12' fill='#64748b' font-family='Arial'>No Photo</text>
        </svg>`
      ),
    []
  );

  if (!open) return null;

  return (
    <div
      className={[
        "nav-item fixed right-3 top-16 z-50",
        "w-[calc(100vw-24px)] max-w-sm",
        "rounded-[22px] overflow-hidden",
        // ✅ modal ขาวเหมือนเดิม (ไม่ตาม dark)
        "bg-white border border-gray-200/80 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)]",
      ].join(" ")}
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
            <FiBell className="text-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-800 leading-5 truncate">
              Scan Notifications
            </p>
            <p className="text-[12px] text-gray-500 leading-4 truncate">
              findings / status / alerts
            </p>
          </div>
          <span className="ml-2 inline-flex items-center justify-center h-6 px-2 rounded-full text-[11px] font-bold bg-[#6f5be8] text-white">
            {reports.length > 99 ? "99+" : reports.length}
          </span>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        >
          <MdOutlineCancel className="text-[20px]" />
        </button>
      </div>

      {/* List */}
      <div className="p-3 space-y-3" style={{ maxHeight: 420, overflowY: "auto" }}>
        {reports.map((item) => {
          const profileSrc = item.User?.Profile?.trim() ? item.User.Profile : avatarFallback;
          const reportImageSrc = item.Picture?.trim() ? item.Picture : photoFallback;
          const statusIsPending = (item.Status || "Pending") === "Pending";

          return (
            <div
              key={item.ID}
              className="rounded-2xl p-3 border border-gray-200/80 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={profileSrc}
                    alt={`${item.User?.FirstName || ""} ${item.User?.LastName || ""}`}
                    className="h-10 w-10 rounded-xl object-cover ring-1 ring-gray-200 bg-white"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = avatarFallback;
                    }}
                  />
                  {/* tiny badge icon */}
                  <span className="absolute -right-1 -bottom-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
                    {statusIsPending ? (
                      <FiWifi className="text-[12px] text-violet-600" />
                    ) : (
                      <FiShield className="text-[12px] text-emerald-600" />
                    )}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">
                      {item.User?.FirstName || "Guest"} {item.User?.LastName || ""}
                    </p>

                    <span
                      className={[
                        "shrink-0 inline-flex items-center h-6 px-2 rounded-full text-[11px] font-semibold border",
                        statusIsPending
                          ? "bg-violet-50 text-violet-700 border-violet-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200",
                      ].join(" ")}
                    >
                      {item.Status || "Pending"}
                    </span>
                  </div>

                  {item.Picture && (
                    <div className="mt-2">
                      <Image
                        width={72}
                        height={72}
                        className="rounded-xl object-cover ring-1 ring-gray-200"
                        src={reportImageSrc}
                        alt="Report"
                        fallback={photoFallback}
                        preview={{ mask: "Preview" }}
                      />
                    </div>
                  )}

                  <p className="mt-2 text-[13px] text-gray-600 whitespace-pre-line">
                    {item.Description || "-"}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(item.ID!, item.Status || "Pending")}
                      className="inline-flex items-center h-8 px-3 rounded-xl text-[12px] font-semibold border transition-colors text-gray-700 border-gray-200 hover:bg-gray-100 active:bg-gray-200"
                    >
                      เปลี่ยนสถานะ
                    </button>

                    <button
                      onClick={() => handleDelete(item.ID!)}
                      title="Delete Report"
                      className="ml-auto inline-flex items-center h-8 px-3 rounded-xl text-[12px] font-semibold border transition-colors border-red-200 text-red-600 bg-white hover:bg-red-50 active:bg-red-100"
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
          <div className="text-center text-gray-500 text-sm py-10">
            ยังไม่มีการแจ้งเตือนใหม่
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;