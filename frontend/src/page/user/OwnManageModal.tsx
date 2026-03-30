import React, { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiServer,
  FiGlobe,
  FiRefreshCcw,
  FiUser,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  DeleteOwnByID,
  ListOwnByUserID,
  type ListOwnByUserIDResponse,
} from "../../services";
import CreateOwnModal from "./CreateOwnModal";

type Props = {
  open: boolean;
  userId: number | null;
  userName?: string;
  onClose: () => void;
};

type OwnRow = {
  own_id: number | null;
  task_id: string;
  hostname: string;
  ip: string;
};

const OwnManageModal: React.FC<Props> = ({
  open,
  userId,
  userName,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<OwnRow[]>([]);
  const [error, setError] = useState("");
  const [deletingID, setDeletingID] = useState<number | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const normalizeOwnId = (item: any): number | null => {
    const rawId =
      item?.own_id ??
      item?.id ??
      item?.ownId ??
      item?.OwnID ??
      item?.ownID ??
      null;

    if (rawId === null || rawId === undefined || rawId === "") {
      return null;
    }

    const parsed = Number(rawId);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const fetchOwns = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError("");

      const res = (await ListOwnByUserID(userId)) as
        | (ListOwnByUserIDResponse & {
            targets?: Array<{
              own_id?: number;
              id?: number;
              ownId?: number;
              OwnID?: number;
              task_id?: string | number;
              hostname?: string;
              ip?: string;
            }>;
          })
        | null;

      if (!res) {
        setRows([]);
        setError("โหลดข้อมูล Own ไม่สำเร็จ");
        return;
      }

      const rawTargets = Array.isArray((res as any)?.targets)
        ? (res as any).targets
        : Array.isArray((res as any)?.data)
        ? (res as any).data
        : Array.isArray(res)
        ? (res as any)
        : [];

      const mapped: OwnRow[] = rawTargets.map((item: any) => ({
        own_id: normalizeOwnId(item),
        task_id: String(item?.task_id ?? item?.taskID ?? item?.TaskID ?? ""),
        hostname: String(item?.hostname ?? item?.host ?? "-"),
        ip: String(item?.ip ?? item?.host_ip ?? item?.hostIP ?? "-"),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("OwnManageModal fetchOwns error:", err);
      setRows([]);
      setError("เกิดข้อผิดพลาดตอนโหลด Own");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !userId) return;
    fetchOwns();
  }, [open, userId]);

  const totalOwn = useMemo(() => rows.length, [rows]);

  const handleDelete = async (ownId: number | null) => {
    if (ownId === null || ownId === undefined || Number.isNaN(ownId)) {
      setError("ไม่พบ Own ID สำหรับลบ");
      return;
    }

    try {
      setDeletingID(ownId);
      setError("");

      const res = await DeleteOwnByID(ownId);

      if (!res) {
        setError("ลบ Own ไม่สำเร็จ");
        return;
      }

      await fetchOwns();
    } catch (err: any) {
      console.error("OwnManageModal handleDelete error:", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "เกิดข้อผิดพลาดระหว่างลบ Own"
      );
    } finally {
      setDeletingID(null);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
          aria-label="Close own modal overlay"
        />

        <div
          className={[
            "relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]",
            "dark:border-white/10 dark:bg-[#0d1524]",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={onClose}
            className={[
              "absolute right-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center",
              "rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition",
              "hover:bg-gray-50 hover:text-gray-700",
              "dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white/80",
            ].join(" ")}
            aria-label="Close"
          >
            <FiX className="text-[18px]" />
          </button>

          <div className="border-b border-gray-200/80 px-5 py-5 pr-20 dark:border-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                    <FiUser className="text-[21px]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[22px] font-semibold text-slate-800 dark:text-white">
                      Manage Own
                    </h3>
                    <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                      รายการ Task ที่เป็นเจ้าของของ{" "}
                      <span className="font-semibold text-slate-700 dark:text-white/80">
                        {userName || `User #${userId ?? "-"}`}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={fetchOwns}
                  disabled={loading}
                  className={[
                    "inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-[13px] font-medium transition",
                    "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                    "dark:bg-white/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/8",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  ].join(" ")}
                >
                  <FiRefreshCcw className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={() => setOpenCreate(true)}
                  className={[
                    "inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-[13px] font-medium transition",
                    "bg-[#6d5efc] text-white hover:bg-[#5f51eb]",
                  ].join(" ")}
                >
                  <FiPlus />
                  Create Own
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-white/50">
              <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 font-semibold text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200">
                Total Own: {totalOwn}
              </span>
            </div>
          </div>

          <div className="px-5 py-4">
            {error && (
              <div className="mb-4 rounded-[14px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="overflow-x-auto rounded-[20px] border border-gray-200/80 dark:border-white/10">
              <table className="w-full min-w-180 border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-50/80 text-left dark:bg-white/3">
                    <th className="w-22.5 px-4 py-3 text-[12px] font-semibold text-slate-600 border-b border-gray-200/80 dark:text-white/60 dark:border-white/10">
                      No
                    </th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-slate-600 border-b border-gray-200/80 dark:text-white/60 dark:border-white/10">
                      Hostname
                    </th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-slate-600 border-b border-gray-200/80 dark:text-white/60 dark:border-white/10">
                      IP
                    </th>
                    <th className="w-27.5 px-4 py-3 text-[12px] font-semibold text-slate-600 border-b border-gray-200/80 text-right dark:text-white/60 dark:border-white/10">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-[13px] text-slate-500 dark:text-white/50"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-[13px] text-slate-500 dark:text-white/50"
                      >
                        <div className="inline-flex items-center gap-2">
                          <FiAlertTriangle className="text-[14px]" />
                          No own data found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rows.map((item, idx) => (
                      <tr
                        key={`${item.own_id ?? "no-id"}-${item.task_id}-${idx}`}
                        className="transition-colors hover:bg-violet-50/40 dark:hover:bg-white/4"
                      >
                        <td
                          className={`px-4 py-4 ${
                            idx !== rows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-semibold text-slate-700 dark:bg-white/10 dark:text-white/80">
                            {idx + 1}
                          </span>
                        </td>

                        <td
                          className={`px-4 py-4 ${
                            idx !== rows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-white/80">
                            <FiServer className="shrink-0 text-violet-600 dark:text-violet-300" />
                            <span>{item.hostname || "-"}</span>
                          </div>
                        </td>

                        <td
                          className={`px-4 py-4 ${
                            idx !== rows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-white/80">
                            <FiGlobe className="shrink-0 text-emerald-600 dark:text-emerald-300" />
                            <span>{item.ip || "-"}</span>
                          </div>
                        </td>

                        <td
                          className={`px-4 py-4 text-right ${
                            idx !== rows.length - 1
                              ? "border-b border-gray-100 dark:border-white/10"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleDelete(item.own_id)}
                            disabled={
                              item.own_id === null || deletingID === item.own_id
                            }
                            className={[
                              "inline-flex h-10 w-10 items-center justify-center rounded-[14px] transition-colors",
                              "text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200",
                              "dark:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/15 dark:active:bg-red-500/20",
                              "disabled:cursor-not-allowed disabled:opacity-50",
                            ].join(" ")}
                            title={
                              item.own_id === null
                                ? "ไม่พบ Own ID"
                                : "Delete own"
                            }
                            aria-label="Delete own"
                          >
                            <FiTrash2 className="text-[14px]" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateOwnModal
        open={openCreate}
        userId={userId}
        userName={userName}
        onClose={() => setOpenCreate(false)}
        onCreated={async () => {
          await fetchOwns();
        }}
      />
    </>
  );
};

export default OwnManageModal;