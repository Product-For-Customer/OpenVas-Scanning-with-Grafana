import React from "react";
import { FiRefreshCw, FiTrash2, FiX } from "react-icons/fi";
import { type DiagramResponse } from "../../../services/diagram";

interface DiagramDeleteModalProps {
  open: boolean;
  data: DiagramResponse | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const DiagramDeleteModal: React.FC<DiagramDeleteModalProps> = ({
  open,
  data,
  deleting,
  onClose,
  onConfirm,
}) => {
  if (!open || !data) return null;

  const secondaryBtn = [
    "h-9 px-3 rounded-xl inline-flex items-center justify-center gap-2 transition text-[11px] font-semibold",
    "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    "dark:bg-white/5 dark:border-white/10 dark:text-white/75 dark:hover:bg-white/8",
  ].join(" ");

  const dangerBtn = [
    "h-9 px-3 rounded-xl inline-flex items-center justify-center gap-2 transition text-[11px] font-semibold",
    "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100",
    "dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-200 dark:hover:bg-red-500/15",
  ].join(" ");

  return (
    <div className="fixed inset-0 z-1200 flex items-center justify-center bg-slate-950/55 backdrop-blur-[2px] p-3 sm:p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-2xl dark:bg-[#0B1220] dark:border-white/10 dark:shadow-none">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 bg-red-50 text-red-700 border border-red-200/80 dark:bg-red-500/10 dark:text-red-300 dark:border-red-400/20">
              <FiTrash2 className="text-[10px]" />
              <span className="text-[9.5px] font-semibold tracking-wide">
                Delete Diagram
              </span>
            </div>

            <h3 className="mt-2 text-[14px] font-semibold text-[#1f2240] dark:text-white/90">
              Confirm delete
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-9 w-9 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-white/10 dark:text-white/65 dark:hover:bg-white/8 inline-flex items-center justify-center"
          >
            <FiX className="text-[15px]" />
          </button>
        </div>

        <div className="p-4">
          <div className="rounded-2xl border border-gray-200/80 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-[12px] font-semibold text-[#1f2240] dark:text-white/90 line-clamp-2">
              {data.name || "-"}
            </p>
            <p className="mt-1 text-[10.5px] leading-5 text-gray-500 dark:text-white/55 line-clamp-3">
              {data.description?.trim() ? data.description : "No description"}
            </p>
          </div>

          <p className="mt-3 text-[11px] text-gray-600 dark:text-white/65">
            คุณต้องการลบ Diagram นี้ใช่หรือไม่
          </p>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/10 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className={[secondaryBtn, deleting ? "opacity-60 cursor-not-allowed" : ""].join(" ")}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className={[dangerBtn, deleting ? "opacity-60 cursor-not-allowed" : ""].join(" ")}
          >
            {deleting ? (
              <>
                <FiRefreshCw className="text-[12px] animate-spin" />
                Deleting
              </>
            ) : (
              <>
                <FiTrash2 className="text-[12px]" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagramDeleteModal;