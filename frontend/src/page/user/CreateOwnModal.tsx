import React, { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiServer,
  FiGlobe,
  FiHash,
  FiX,
  FiLoader,
} from "react-icons/fi";
import {
  CreateOwn,
  ListTaskIDForOwn,
  type OwnTargetItem,
} from "../../services";

type Props = {
  open: boolean;
  userId: number | null;
  userName?: string;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
};

const CreateOwnModal: React.FC<Props> = ({
  open,
  userId,
  userName,
  onClose,
  onCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState<OwnTargetItem[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTaskID, setSelectedTaskID] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await ListTaskIDForOwn();
      setRows(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("CreateOwnModal fetchTasks error:", err);
      setRows([]);
      setError("ไม่สามารถโหลดรายการ Task สำหรับเพิ่ม Own ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setSelectedTaskID("");
    setSearch("");
    fetchTasks();
  }, [open]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((item) =>
      [item.task_id, item.hostname, item.ip].join(" ").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const selectedItem = useMemo(() => {
    return rows.find((item) => item.task_id === selectedTaskID) || null;
  }, [rows, selectedTaskID]);

  const handleCreate = async () => {
    if (!userId) {
      setError("ไม่พบ User ID");
      return;
    }

    if (!selectedTaskID) {
      setError("กรุณาเลือก Task");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await CreateOwn({
        app_user_id: userId,
        task_id: selectedTaskID,
      });

      if (!res) {
        setError("เพิ่ม Own ไม่สำเร็จ");
        return;
      }

      await onCreated();
      onClose();
    } catch (err: any) {
      console.error("CreateOwnModal handleCreate error:", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "เกิดข้อผิดพลาดระหว่างเพิ่ม Own"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-260 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close create own modal overlay"
      />

      <div
        className={[
          "relative z-10 w-full max-w-5xl rounded-[22px] border border-gray-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]",
          "dark:border-white/10 dark:bg-[#0d1524]",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-white/45 dark:hover:text-white/70"
          aria-label="Close"
        >
          <FiX className="text-[18px]" />
        </button>

        <div className="border-b border-gray-200/80 px-5 py-4 dark:border-white/10">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300">
              <FiPlus className="text-[20px]" />
            </div>

            <div className="min-w-0">
              <h3 className="text-[18px] font-semibold text-slate-800 dark:text-white">
                Create Own
              </h3>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-white/55">
                เลือก Task เพื่อผูกเป็นเจ้าของให้กับ{" "}
                <span className="font-semibold text-slate-700 dark:text-white/80">
                  {userName || `User #${userId ?? "-"}`}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/35 text-[13px]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task id / hostname / ip..."
              className={[
                "w-full h-10 rounded-2xl pl-9 pr-3.5 text-[12px] outline-none transition",
                "border border-gray-200 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-200",
                "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:ring-cyan-400/10",
              ].join(" ")}
            />
          </div>
        </div>

        <div className="px-5 py-4">
          {error && (
            <div className="mb-4 rounded-[14px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-slate-500 dark:text-white/50">
            <span>
              {loading ? "Loading tasks..." : `ทั้งหมด ${filteredRows.length} รายการ`}
            </span>

            {selectedItem && (
              <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                Selected: {selectedItem.hostname || selectedItem.ip}
              </span>
            )}
          </div>

          <div className="max-h-105 overflow-auto rounded-[20px] border border-gray-200/80 dark:border-white/10">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left bg-gray-50/80 dark:bg-white/3">
                  <th className="px-3.5 py-3 text-[11px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                    Select
                  </th>
                  <th className="px-3.5 py-3 text-[11px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                    Task ID
                  </th>
                  <th className="px-3.5 py-3 text-[11px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                    Hostname
                  </th>
                  <th className="px-3.5 py-3 text-[11px] font-semibold text-slate-600 dark:text-white/60 border-b border-gray-200/80 dark:border-white/10">
                    IP
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-[12px] text-slate-500 dark:text-white/50"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiLoader className="animate-spin" />
                        Loading...
                      </span>
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-[12px] text-slate-500 dark:text-white/50"
                    >
                      No task data found
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((item, idx) => {
                    const selected = item.task_id === selectedTaskID;

                    return (
                      <tr
                        key={`${item.task_id}-${idx}`}
                        className={[
                          "transition-colors",
                          selected
                            ? "bg-cyan-50/70 dark:bg-cyan-500/10"
                            : "hover:bg-gray-50 dark:hover:bg-white/3",
                        ].join(" ")}
                      >
                        <td
                          className={`px-3.5 py-3 ${
                            idx !== filteredRows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="selected-task-own"
                            checked={selected}
                            onChange={() => setSelectedTaskID(item.task_id)}
                            className="h-4 w-4 cursor-pointer"
                          />
                        </td>

                        <td
                          className={`px-3.5 py-3 ${
                            idx !== filteredRows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/80">
                            <FiHash className="text-cyan-600 dark:text-cyan-300 shrink-0" />
                            <span className="break-all">{item.task_id}</span>
                          </div>
                        </td>

                        <td
                          className={`px-3.5 py-3 ${
                            idx !== filteredRows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/80">
                            <FiServer className="text-violet-600 dark:text-violet-300 shrink-0" />
                            <span>{item.hostname || "-"}</span>
                          </div>
                        </td>

                        <td
                          className={`px-3.5 py-3 ${
                            idx !== filteredRows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/80">
                            <FiGlobe className="text-emerald-600 dark:text-emerald-300 shrink-0" />
                            <span>{item.ip || "-"}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={[
                "min-w-27.5 rounded-xl px-3.5 py-2 text-[12px] font-medium transition",
                "bg-gray-100 text-gray-700 hover:bg-gray-200",
                "dark:bg-white/8 dark:text-white/75 dark:hover:bg-white/12",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={submitting || !selectedTaskID}
              className={[
                "min-w-30 rounded-xl px-3.5 py-2 text-[12px] font-medium transition",
                "bg-[#6d5efc] text-white hover:bg-[#5f51eb]",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {submitting ? "Creating..." : "Create Own"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOwnModal;