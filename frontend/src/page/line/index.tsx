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
} from "react-icons/fi";
import {
  ListHistoryNotify,
  DeleteHistoryNotifyByIDs,
  type HistoryNotifyResponse,
} from "../../services";

type FilterKey = "All" | "Update" | "Alert";

const FILTER_OPTIONS: FilterKey[] = ["All", "Update", "Alert"];

const statusStyles: Record<
  string,
  {
    badge: string;
    dot: string;
    iconWrap: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  Alert: {
    badge:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-400/20",
    dot: "bg-red-500",
    iconWrap:
      "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300",
    icon: <FiAlertTriangle />,
    label: "Alert",
  },
  Update: {
    badge:
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-400/20",
    dot: "bg-cyan-500",
    iconWrap:
      "bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-500/10 dark:border-cyan-400/20 dark:text-cyan-300",
    icon: <FiCheckCircle />,
    label: "Update",
  },
};

const getStatusMeta = (status?: string | null) => {
  const normalized = (status || "").trim();
  if (normalized === "Alert") return statusStyles.Alert;
  return statusStyles.Update;
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

      if (res) {
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
      const matchFilter =
        filter === "All" ? true : (item.status || "").trim() === filter;

      const blob = [
        item.subject,
        item.description,
        item.status,
        item.created_at,
        item.updated_at,
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
    if (allSelected) {
      const visibleIds = notifications.map((n) => n.id);
      setSelected((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const visibleIds = notifications.map((n) => n.id);
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

  return (
    <>
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
                Notification History Center
              </div>

              <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-slate-900 sm:text-[28px] dark:text-white">
                All Notifications
              </h2>

              <p className="mt-1 text-[13px] text-slate-500 sm:text-[14px] dark:text-white/55">
                See your system updates and alert history here.
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
                {allSelected ? <FiCheckSquare /> : <FiSquare />}
              </button>

              <button
                type="button"
                onClick={() => loadHistoryNotify(true)}
                disabled={refreshing}
                className={[
                  "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition",
                  "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8",
                ].join(" ")}
                title="Refresh"
              >
                <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              </button>

              <button
                type="button"
                onClick={openDeleteModal}
                disabled={selected.length === 0}
                className={[
                  "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition",
                  selected.length > 0
                    ? "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-300 dark:hover:bg-red-500/15"
                    : "bg-white border border-gray-200 text-gray-300 cursor-not-allowed dark:bg-white/5 dark:border-white/10 dark:text-white/20",
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
                    className={`transition ${
                      openFilter ? "rotate-180" : ""
                    } text-gray-400 dark:text-white/45`}
                  />
                </button>

                {openFilter && (
                  <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#0B1220] dark:shadow-none">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFilter(opt);
                          setOpenFilter(false);
                        }}
                        className={[
                          "w-full px-4 py-3 text-left text-[13px] transition",
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

          {/* Status Summary */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/65">
              Total:{" "}
              <span className="ml-1 font-semibold text-slate-900 dark:text-white">
                {notifications.length}
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/65">
              Selected:{" "}
              <span className="ml-1 font-semibold text-slate-900 dark:text-white">
                {selected.length}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {/* List */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200/80 bg-white/70 dark:border-white/10 dark:bg-white/3">
            {loading ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  <FiRefreshCw className="animate-spin text-[22px]" />
                </div>
                <h3 className="mt-4 text-[16px] font-semibold text-slate-900 dark:text-white/85">
                  Loading notifications...
                </h3>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                  Please wait while we load your notification history.
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  <FiMessageSquare className="text-[22px]" />
                </div>
                <h3 className="mt-4 text-[16px] font-semibold text-slate-900 dark:text-white/85">
                  No notifications found
                </h3>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                  Try adjusting your search or status filter.
                </p>
              </div>
            ) : (
              notifications.map((item, idx) => {
                const tone = getStatusMeta(item.status);
                const isSelected = selected.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={[
                      "px-4 py-4 transition-colors sm:px-6",
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

                      {/* Icon */}
                      <div className="relative shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                          <FiMessageSquare className="text-[20px]" />
                        </div>

                        <span
                          className={[
                            "absolute -right-1 -bottom-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                            "bg-white dark:bg-[#08111f]",
                            tone.iconWrap,
                          ].join(" ")}
                        >
                          {tone.icon}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <p className="text-[15px] font-semibold leading-6 text-slate-900 dark:text-white">
                              {item.subject || "-"}
                            </p>

                            <p className="mt-1 text-[14px] leading-6 text-slate-600 dark:text-white/70">
                              {item.description || "-"}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                              <span className="text-[13px] font-medium text-slate-800 dark:text-white/80">
                                {formatTime(item.created_at)}
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 dark:text-white/50">
                                <span className="text-cyan-500">●</span>
                                <span className="underline underline-offset-2">
                                  {formatDate(item.created_at)}
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
                                {tone.label}
                              </span>
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

      {/* =========================
          Delete Confirm Modal
      ========================= */}
      {deleteOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          {/* Overlay */}
          <button
            type="button"
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
            aria-label="Close delete modal overlay"
          />

          {/* Modal */}
          <div
            className={[
              "relative z-10 w-full max-w-135 rounded-[14px] border border-gray-200 bg-white px-5 py-5 shadow-[0_20px_70px_rgba(15,23,42,0.18)]",
              "dark:border-white/10 dark:bg-[#0d1524]",
            ].join(" ")}
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-white/45 dark:hover:text-white/70"
              aria-label="Close"
            >
              <FiX className="text-[20px]" />
            </button>

            {/* Icon */}
            <div className="flex justify-center pt-2">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300">
                <FiTrash2 className="text-[28px]" />
              </div>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-center text-[22px] font-semibold text-slate-800 dark:text-white">
              Delete Notifications
            </h3>

            {/* Description */}
            <p className="mx-auto mt-3 max-w-105 text-center text-[14px] leading-6 text-slate-500 dark:text-white/55">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700 dark:text-white/80">
                {selected.length}
              </span>{" "}
              selected notification{selected.length > 1 ? "s" : ""}? This action
              cannot be undone.
            </p>

            {/* Preview selected items */}
            <div className="mt-5 max-h-52 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/70 p-3 dark:border-white/10 dark:bg-white/5">
              <div className="space-y-2">
                {selectedItems.map((item) => {
                  const tone = getStatusMeta(item.status);

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-[#111a2a]"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={[
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                            tone.iconWrap,
                          ].join(" ")}
                        >
                          <FiMessageSquare className="text-[14px]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-slate-800 dark:text-white">
                            {item.subject || "-"}
                          </p>
                          <p className="line-clamp-2 text-[12px] text-slate-500 dark:text-white/50">
                            {item.description || "-"}
                          </p>
                        </div>

                        <span
                          className={[
                            "inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold",
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
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                {deleteError}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className={[
                  "min-w-27.5 rounded-[10px] px-4 py-2.5 text-[15px] font-medium transition",
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
                  "min-w-27.5 rounded-[10px] px-4 py-2.5 text-[15px] font-medium transition",
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