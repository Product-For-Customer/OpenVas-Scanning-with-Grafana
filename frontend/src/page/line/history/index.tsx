import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiMoreVertical,
  FiRefreshCw,
  FiTrash2,
  FiSquare,
  FiCheckSquare,
  FiChevronDown,
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiMessageSquare,
  FiX,
  FiClock,
  FiSlash,
  FiBell,
  FiRotateCw,
  FiLock,
  FiServer,
  FiAlertCircle,
} from "react-icons/fi";
import {
  ListHistoryNotify,
  DeleteHistoryNotifyByIDs,
  type HistoryNotifyResponse,
} from "../../../services";

type FilterKey =
  | "All"
  | "Update Completed"
  | "No Update"
  | "Already Running"
  | "Update Failed"
  | "Status Notification"
  | "Unauthorized"
  | "Server Error"
  | "Timeout";

const FILTER_OPTIONS: FilterKey[] = [
  "All",
  "Update Completed",
  "No Update",
  "Already Running",
  "Update Failed",
  "Status Notification",
  "Unauthorized",
  "Server Error",
  "Timeout",
];

type StatusKey = Exclude<FilterKey, "All">;

const statusStyles: Record<
  StatusKey,
  {
    badge: string;
    dot: string;
    iconWrap: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  "Update Completed": {
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-400/20",
    dot: "bg-emerald-500",
    iconWrap:
      "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-300",
    icon: <FiCheckCircle className="text-[11px]" />,
    label: "Update Completed",
  },
  "No Update": {
    badge:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-200 dark:border-slate-400/20",
    dot: "bg-slate-500",
    iconWrap:
      "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-500/10 dark:border-slate-400/20 dark:text-slate-300",
    icon: <FiSlash className="text-[11px]" />,
    label: "No Update",
  },
  "Already Running": {
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-400/20",
    dot: "bg-amber-500",
    iconWrap:
      "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-400/20 dark:text-amber-300",
    icon: <FiRotateCw className="text-[11px]" />,
    label: "Already Running",
  },
  "Update Failed": {
    badge:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-400/20",
    dot: "bg-red-500",
    iconWrap:
      "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300",
    icon: <FiAlertTriangle className="text-[11px]" />,
    label: "Update Failed",
  },
  "Status Notification": {
    badge:
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-400/20",
    dot: "bg-cyan-500",
    iconWrap:
      "bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-500/10 dark:border-cyan-400/20 dark:text-cyan-300",
    icon: <FiBell className="text-[11px]" />,
    label: "Status Notification",
  },
  Unauthorized: {
    badge:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-200 dark:border-violet-400/20",
    dot: "bg-violet-500",
    iconWrap:
      "bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-500/10 dark:border-violet-400/20 dark:text-violet-300",
    icon: <FiLock className="text-[11px]" />,
    label: "Unauthorized",
  },
  "Server Error": {
    badge:
      "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-200 dark:border-fuchsia-400/20",
    dot: "bg-fuchsia-500",
    iconWrap:
      "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:border-fuchsia-400/20 dark:text-fuchsia-300",
    icon: <FiServer className="text-[11px]" />,
    label: "Server Error",
  },
  Timeout: {
    badge:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-200 dark:border-orange-400/20",
    dot: "bg-orange-500",
    iconWrap:
      "bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-500/10 dark:border-orange-400/20 dark:text-orange-300",
    icon: <FiAlertCircle className="text-[11px]" />,
    label: "Timeout",
  },
};

const normalizeText = (value?: string | null) => (value || "").trim();

const normalizeStatus = (status?: string | null): StatusKey => {
  const normalized = normalizeText(status).toLowerCase();

  if (normalized === "update completed") return "Update Completed";
  if (normalized === "no update") return "No Update";
  if (normalized === "already running") return "Already Running";
  if (normalized === "update failed") return "Update Failed";
  if (normalized === "status notification") return "Status Notification";
  if (normalized === "unauthorized") return "Unauthorized";
  if (normalized === "server error") return "Server Error";
  if (normalized === "timeout") return "Timeout";

  if (normalized === "update") return "Update Completed";
  if (normalized === "alert") return "Status Notification";
  if (normalized === "failed") return "Update Failed";
  if (normalized === "completed") return "Update Completed";
  if (normalized === "running") return "Already Running";

  return "Status Notification";
};

const getStatusMeta = (status?: string | null) => {
  const normalized = normalizeStatus(status);
  return statusStyles[normalized];
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString?: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const cleanInlineText = (text?: string | null) => {
  return (text || "")
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const parseDescription = (description?: string | null) => {
  const raw = (description || "").replace(/\r/g, "").trim();

  if (!raw) {
    return {
      titleLine: "",
      summaryLine: "",
      metaLines: [] as string[],
      raw,
    };
  }

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const getValueAfterColon = (prefix: string) => {
    const found = lines.find((line) =>
      line.toLowerCase().startsWith(prefix.toLowerCase())
    );
    if (!found) return "";
    const idx = found.indexOf(":");
    if (idx === -1) return found;
    return found.slice(idx + 1).trim();
  };

  const summaryLine = getValueAfterColon("Summary");
  const statusLine = getValueAfterColon("Status");
  const triggeredByLine = getValueAfterColon("Triggered By");
  const sourceLine = getValueAfterColon("Source");
  const forceLine = getValueAfterColon("Force");

  const metaLines: string[] = [];
  if (statusLine) metaLines.push(`Status: ${statusLine}`);
  if (triggeredByLine) metaLines.push(`Triggered By: ${triggeredByLine}`);
  if (sourceLine) metaLines.push(`Source: ${sourceLine}`);
  if (forceLine) metaLines.push(`Force: ${forceLine}`);

  return {
    titleLine: lines[0] || "",
    summaryLine: summaryLine || cleanInlineText(raw),
    metaLines,
    raw,
  };
};

const getDisplayTitle = (item: HistoryNotifyResponse) => {
  const subject = normalizeText(item.subject);
  const normalizedStatus = normalizeStatus(item.status);

  if (subject) return subject;

  switch (normalizedStatus) {
    case "Update Completed":
      return "Feed Update Completed";
    case "No Update":
      return "No Feed Update";
    case "Already Running":
      return "Feed Update Already Running";
    case "Update Failed":
      return "Feed Update Failed";
    case "Status Notification":
      return "Status Notification";
    case "Unauthorized":
      return "Unauthorized Request";
    case "Server Error":
      return "Server Error";
    case "Timeout":
      return "Feed Update Timeout";
    default:
      return "Notification";
  }
};

const getDisplayDescription = (item: HistoryNotifyResponse) => {
  const normalizedStatus = normalizeStatus(item.status);
  const parsed = parseDescription(item.description);

  if (parsed.summaryLine) {
    return parsed.summaryLine;
  }

  switch (normalizedStatus) {
    case "Update Completed":
      return "Security feed update completed successfully.";
    case "No Update":
      return "There is no new security feed update available.";
    case "Already Running":
      return "The feed update process is already running in the system.";
    case "Update Failed":
      return "Security feed data update failed.";
    case "Status Notification":
      return "System status notification.";
    case "Unauthorized":
      return "The request was rejected because the automation token is invalid.";
    case "Server Error":
      return "Backend configuration error occurred during feed update.";
    case "Timeout":
      return "Feed update exceeded the allowed execution time.";
    default:
      return item.description || "-";
  }
};

const Index: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");
  const [openFilter, setOpenFilter] = useState(false);

  const [items, setItems] = useState<HistoryNotifyResponse[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  const loadHistoryNotify = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await ListHistoryNotify();

      if (Array.isArray(res)) {
        setItems(res);
      } else {
        setItems([]);
        setError("Unable to load notification history.");
      }
    } catch (err) {
      console.error("loadHistoryNotify error:", err);
      setItems([]);
      setError("Unable to load notification history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistoryNotify();
  }, []);

  const notifications = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      const normalizedStatus = normalizeStatus(item.status);
      const parsed = parseDescription(item.description);

      const matchFilter = filter === "All" ? true : normalizedStatus === filter;

      const blob = [
        item.subject,
        item.description,
        item.status,
        item.datetime,
        item.created_at,
        item.updated_at,
        normalizedStatus,
        parsed.summaryLine,
        ...parsed.metaLines,
      ]
        .join(" ")
        .toLowerCase();

      const matchSearch = blob.includes(q);

      return matchFilter && matchSearch;
    });
  }, [items, search, filter]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected =
    notifications.length > 0 &&
    notifications.every((item) => selected.includes(item.id));

  const toggleSelectAll = () => {
    const visibleIds = notifications.map((n) => n.id);

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const openDeleteModal = () => {
    if (selected.length === 0) return;
    setDeleteError("");
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (selected.length === 0) {
      setDeleteError("Please select at least one notification.");
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const res = await DeleteHistoryNotifyByIDs({
        ids: selected,
      });

      if (!res) {
        setDeleteError("Failed to delete selected notifications.");
        return;
      }

      const selectedSet = new Set(selected);
      setItems((prev) => prev.filter((item) => !selectedSet.has(item.id)));
      setSelected([]);
      setDeleteOpen(false);
    } catch (err) {
      console.error("confirmDelete error:", err);
      setDeleteError("Failed to delete selected notifications.");
    } finally {
      setDeleting(false);
    }
  };

  const selectedItems = useMemo(() => {
    const selectedSet = new Set(selected);
    return items.filter((item) => selectedSet.has(item.id));
  }, [items, selected]);

  const summaryCount = useMemo(() => {
    return {
      all: notifications.length,
      updateCompleted: notifications.filter(
        (item) => normalizeStatus(item.status) === "Update Completed"
      ).length,
      noUpdate: notifications.filter(
        (item) => normalizeStatus(item.status) === "No Update"
      ).length,
      alreadyRunning: notifications.filter(
        (item) => normalizeStatus(item.status) === "Already Running"
      ).length,
      updateFailed: notifications.filter(
        (item) => normalizeStatus(item.status) === "Update Failed"
      ).length,
      statusNotification: notifications.filter(
        (item) => normalizeStatus(item.status) === "Status Notification"
      ).length,
      unauthorized: notifications.filter(
        (item) => normalizeStatus(item.status) === "Unauthorized"
      ).length,
      serverError: notifications.filter(
        (item) => normalizeStatus(item.status) === "Server Error"
      ).length,
      timeout: notifications.filter(
        (item) => normalizeStatus(item.status) === "Timeout"
      ).length,
    };
  }, [notifications]);

  return (
    <>
      <section
        className={[
          "relative overflow-hidden rounded-[22px] p-3 sm:p-4 md:p-4.5",
          "bg-white border border-gray-200/80 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.20)]",
          "dark:bg-[#08111f]/95 dark:border-white/10 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-none",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-14 right-6 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: "26px 26px",
              }}
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-[10.5px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                <FiShield className="text-[11px]" />
                Notification History Center
              </div>

              <h2 className="mt-2.5 text-[18px] font-semibold tracking-tight text-slate-900 sm:text-[20px] dark:text-white">
                All Notifications
              </h2>

              <p className="mt-1 text-[11px] sm:text-[12px] text-slate-500 dark:text-white/55">
                See your system updates and alert history here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-50 flex-1 sm:flex-none sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 dark:text-white/35" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notifications..."
                  className={[
                    "w-full h-9 rounded-2xl pl-9 pr-3.5 text-[12px] outline-none transition",
                    "border border-gray-200 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-200",
                    "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:ring-cyan-400/10",
                  ].join(" ")}
                />
              </div>

              <button
                type="button"
                onClick={toggleSelectAll}
                className={[
                  "inline-flex h-9 w-9 items-center justify-center rounded-2xl transition",
                  allSelected
                    ? "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-400/20"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
                ].join(" ")}
                title="Select all"
              >
                {allSelected ? (
                  <FiCheckSquare className="text-[13px]" />
                ) : (
                  <FiSquare className="text-[13px]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => loadHistoryNotify(true)}
                disabled={refreshing}
                className={[
                  "inline-flex h-9 w-9 items-center justify-center rounded-2xl transition",
                  "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
                ].join(" ")}
                title="Refresh"
              >
                <FiRefreshCw
                  className={`text-[13px] ${refreshing ? "animate-spin" : ""}`}
                />
              </button>

              <button
                type="button"
                onClick={openDeleteModal}
                disabled={selected.length === 0}
                className={[
                  "inline-flex h-9 w-9 items-center justify-center rounded-2xl transition",
                  selected.length > 0
                    ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-500/15"
                    : "bg-white border border-gray-200 text-gray-300 cursor-not-allowed dark:bg-white/5 dark:border-white/10 dark:text-white/20",
                ].join(" ")}
                title="Delete selected"
              >
                <FiTrash2 className="text-[13px]" />
              </button>

              <button
                type="button"
                className={[
                  "inline-flex h-9 w-9 items-center justify-center rounded-2xl transition",
                  "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                  "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
                ].join(" ")}
                title="More"
              >
                <FiMoreVertical className="text-[13px]" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenFilter((s) => !s)}
                  className={[
                    "h-9 px-3.5 rounded-2xl inline-flex items-center gap-2 transition",
                    "bg-white border border-gray-200/80 text-[12px] font-medium text-gray-700 hover:bg-gray-50",
                    "dark:bg-white/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/8",
                  ].join(" ")}
                >
                  {filter}
                  <FiChevronDown
                    className={`transition text-[13px] ${
                      openFilter ? "rotate-180" : ""
                    } text-gray-400 dark:text-white/45`}
                  />
                </button>

                {openFilter && (
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFilter(opt);
                          setOpenFilter(false);
                        }}
                        className={[
                          "w-full px-3.5 py-2.5 text-left text-[12px] transition",
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

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10.5px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/65">
              Total:
              <span className="ml-1 font-semibold text-slate-900 dark:text-white">
                {summaryCount.all}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10.5px] font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
              Completed:
              <span className="ml-1 font-semibold">
                {summaryCount.updateCompleted}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] font-medium text-slate-700 dark:border-slate-400/20 dark:bg-slate-500/10 dark:text-slate-200">
              No Update:
              <span className="ml-1 font-semibold">{summaryCount.noUpdate}</span>
            </div>

            <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10.5px] font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
              Running:
              <span className="ml-1 font-semibold">
                {summaryCount.alreadyRunning}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10.5px] font-medium text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
              Failed:
              <span className="ml-1 font-semibold">
                {summaryCount.updateFailed}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10.5px] font-medium text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
              Notification:
              <span className="ml-1 font-semibold">
                {summaryCount.statusNotification}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10.5px] font-medium text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200">
              Unauthorized:
              <span className="ml-1 font-semibold">
                {summaryCount.unauthorized}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1 text-[10.5px] font-medium text-fuchsia-700 dark:border-fuchsia-400/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-200">
              Server Error:
              <span className="ml-1 font-semibold">
                {summaryCount.serverError}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10.5px] font-medium text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-200">
              Timeout:
              <span className="ml-1 font-semibold">{summaryCount.timeout}</span>
            </div>

            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10.5px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/65">
              Selected:
              <span className="ml-1 font-semibold text-slate-900 dark:text-white">
                {selected.length}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="mt-4 overflow-hidden rounded-[22px] border border-gray-200/80 bg-white/70 dark:border-white/10 dark:bg-white/3">
            {loading ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  <FiRefreshCw className="animate-spin text-[18px]" />
                </div>
                <h3 className="mt-3 text-[14px] font-semibold text-slate-900 dark:text-white/85">
                  Loading notifications...
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-white/55">
                  Please wait while we load your notification history.
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  <FiMessageSquare className="text-[18px]" />
                </div>
                <h3 className="mt-3 text-[14px] font-semibold text-slate-900 dark:text-white/85">
                  No notifications found
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-white/55">
                  Try adjusting your search or status filter.
                </p>
              </div>
            ) : (
              <div className="max-h-115 overflow-y-auto">
                {notifications.map((item, idx) => {
                  const tone = getStatusMeta(item.status);
                  const isSelected = selected.includes(item.id);
                  const parsed = parseDescription(item.description);
                  const displayTitle = getDisplayTitle(item);
                  const displayDescription = getDisplayDescription(item);

                  return (
                    <div
                      key={item.id}
                      className={[
                        "px-3.5 py-3 transition-colors sm:px-4.5",
                        idx !== notifications.length - 1
                          ? "border-b border-gray-200/70 dark:border-white/10"
                          : "",
                        isSelected
                          ? "bg-cyan-50/70 dark:bg-cyan-500/5"
                          : "hover:bg-gray-50 dark:hover:bg-white/4",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleSelect(item.id)}
                          className={[
                            "mt-1.5 inline-flex h-4.5 w-4.5 shrink-0 rounded-md border transition",
                            isSelected
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-gray-300 bg-white dark:border-white/15 dark:bg-white/5",
                          ].join(" ")}
                          aria-label="Select notification"
                        >
                          {isSelected && (
                            <span className="m-auto h-1.5 w-1.5 rounded-xs bg-white" />
                          )}
                        </button>

                        <div className="relative shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                            <FiMessageSquare className="text-[16px]" />
                          </div>

                          <span
                            className={[
                              "absolute -right-1 -bottom-1 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[9px]",
                              "bg-white dark:bg-[#08111f]",
                              tone.iconWrap,
                            ].join(" ")}
                          >
                            {tone.icon}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1.5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold leading-5 text-slate-900 dark:text-white">
                                {displayTitle}
                              </p>

                              <p className="mt-0.5 text-[12px] leading-5 text-slate-600 dark:text-white/70 line-clamp-2">
                                {displayDescription || "-"}
                              </p>

                              {parsed.metaLines.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {parsed.metaLines.map((meta, index) => (
                                    <span
                                      key={`${item.id}-meta-${index}`}
                                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                                    >
                                      {meta}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-800 dark:text-white/80">
                                  <FiClock className="text-[11px]" />
                                  {formatTime(item.datetime)}
                                </span>

                                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-white/50">
                                  <span className="text-cyan-500">●</span>
                                  <span className="underline underline-offset-2">
                                    {formatDate(item.datetime)}
                                  </span>
                                </span>

                                <span
                                  className={[
                                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                    tone.badge,
                                  ].join(" ")}
                                >
                                  <span
                                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${tone.dot}`}
                                  />
                                  {tone.label}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={[
                                "shrink-0 inline-flex h-8.5 w-8.5 items-center justify-center rounded-[14px] transition",
                                "text-gray-500 hover:bg-gray-100 active:bg-gray-200",
                                "dark:text-white/55 dark:hover:bg-white/10 dark:active:bg-white/15",
                              ].join(" ")}
                              title="More"
                            >
                              <FiMoreVertical className="text-[13px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

      {deleteOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
            aria-label="Close delete modal overlay"
          />

          <div
            className={[
              "relative z-10 w-full max-w-lg rounded-[18px] border border-gray-200 bg-white px-4 py-4 shadow-[0_20px_70px_rgba(15,23,42,0.18)]",
              "dark:border-white/10 dark:bg-[#0d1524]",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              className="absolute right-3.5 top-3.5 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-white/45 dark:hover:text-white/70"
              aria-label="Close"
            >
              <FiX className="text-[18px]" />
            </button>

            <div className="flex justify-center pt-1">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300">
                <FiTrash2 className="text-[22px]" />
              </div>
            </div>

            <h3 className="mt-3 text-center text-[18px] font-semibold text-slate-800 dark:text-white">
              Delete Notifications
            </h3>

            <p className="mx-auto mt-2 max-w-95 text-center text-[12px] leading-5 text-slate-500 dark:text-white/55">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700 dark:text-white/80">
                {selected.length}
              </span>{" "}
              selected notification{selected.length > 1 ? "s" : ""}? This action
              cannot be undone.
            </p>

            <div className="mt-4 max-h-44 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/70 p-3 dark:border-white/10 dark:bg-white/5">
              <div className="space-y-2">
                {selectedItems.map((item) => {
                  const tone = getStatusMeta(item.status);
                  const displayTitle = getDisplayTitle(item);
                  const displayDescription = getDisplayDescription(item);

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#111a2a]"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={[
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border",
                            tone.iconWrap,
                          ].join(" ")}
                        >
                          <FiMessageSquare className="text-[12px]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-slate-800 dark:text-white">
                            {displayTitle}
                          </p>
                          <p className="line-clamp-2 text-[11px] text-slate-500 dark:text-white/50">
                            {displayDescription || "-"}
                          </p>
                        </div>

                        <span
                          className={[
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold",
                            tone.badge,
                          ].join(" ")}
                        >
                          {tone.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {deleteError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-center text-[12px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                {deleteError}
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className={[
                  "min-w-27.5 rounded-[10px] px-3.5 py-2 text-[12px] font-medium transition",
                  "bg-[#f8dedd] text-[#ff5a3c] hover:bg-[#f4d2d1]",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                {deleting ? "Deleting..." : "Yes, Delete!"}
              </button>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className={[
                  "min-w-27.5 rounded-[10px] px-3.5 py-2 text-[12px] font-medium transition",
                  "bg-[#6d5efc] text-white hover:bg-[#5f51eb]",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                ].join(" ")}
              >
                No, Keep It.
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;