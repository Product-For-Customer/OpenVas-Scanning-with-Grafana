import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiBell,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
  FiSend,
  FiLayers,
  FiUsers,
  FiUser,
  FiRefreshCw,
  FiLink2,
  FiCpu,
  FiSlack,
  FiMail,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  FaTiktok,
  FaGoogle,
  FaYoutube,
  FaMicrosoft,
} from "react-icons/fa";
import {
  ListAppNotification,
  CreateAppNotification,
  UpdateAppNotificationByID,
  DeleteAppNotificationByID,
  ListAppLineMaster,
  CreateAppLineMaster,
  UpdateAppLineMasterByID,
  DeleteAppLineMasterByID,
  TestLineNotifyByAppNotificationID,
  type AppNotificationResponse,
  type AppLineMasterResponse,
} from "../../../services";

type SortKey = "Newest" | "Alert: On First" | "Alert: Off First";
type FormMode = "create" | "edit";

type UiNotification = {
  id: number;
  name: string;
  send_id: string;
  alert: boolean;
  is_group: boolean;
  app_line_master_id: number;
};

type NotificationFormData = {
  name: string;
  send_id: string;
  alert: boolean;
  is_group: boolean;
  app_line_master_id: string;
};

type TestLineFormData = {
  message: string;
};

type LineMasterFormData = {
  name: string;
  token: string;
};

type UiApp = {
  id: number;
  name: string;
  token: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  chipClass: string;
  iconWrapClass: string;
};

const PAGE_SIZE = 3;

let notificationListCache: UiNotification[] | null = null;
let lineMasterListCache: AppLineMasterResponse[] | null = null;
let initialNotifyPageLoadPromise: Promise<void> | null = null;

const normalizeText = (value?: string | null) => (value || "").trim();

const getCategoryFromName = (name: string) => {
  const lower = normalizeText(name).toLowerCase();

  if (lower.includes("slack")) return "Social Authority";
  if (lower.includes("google") || lower.includes("meet")) return "Management";
  if (lower.includes("tiktok")) return "Entertainment";
  if (lower.includes("excel") || lower.includes("microsoft")) return "Analytics";
  if (lower.includes("mail")) return "Business";
  if (lower.includes("youtube")) return "Entertainment";
  if (lower.includes("line")) return "Messaging";
  if (lower.includes("notify")) return "Notification";
  return "Integration";
};

const getDescriptionFromName = (name: string) => {
  const lower = normalizeText(name).toLowerCase();

  if (lower.includes("slack")) {
    return "Connect Slack for team alerts, updates, and workflow communication.";
  }
  if (lower.includes("google") || lower.includes("meet")) {
    return "Connect Google services to support meeting and management workflows.";
  }
  if (lower.includes("tiktok")) {
    return "Connect TikTok for content and social engagement workflows.";
  }
  if (lower.includes("excel") || lower.includes("microsoft")) {
    return "Connect Microsoft tools for reporting, analytics, and productivity.";
  }
  if (lower.includes("mail")) {
    return "Connect email services for notifications and communication.";
  }
  if (lower.includes("youtube")) {
    return "Connect YouTube for media and content-related workflows.";
  }
  if (lower.includes("line")) {
    return "Connect your LINE channel for notifications and automated message delivery.";
  }

  return "Manage and connect this integration to expand your workflow.";
};

const FiMessageSquareIcon: React.FC = () => <FiBell />;

const getMetaByName = (name: string) => {
  const lower = normalizeText(name).toLowerCase();

  if (lower.includes("slack")) {
    return {
      icon: <FiSlack />,
      chipClass:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300",
      iconWrapClass:
        "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300",
    };
  }

  if (lower.includes("google") || lower.includes("meet")) {
    return {
      icon: <FaGoogle />,
      chipClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
      iconWrapClass:
        "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
    };
  }

  if (lower.includes("tiktok")) {
    return {
      icon: <FaTiktok />,
      chipClass:
        "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-400/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-300",
      iconWrapClass:
        "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-400/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-300",
    };
  }

  if (lower.includes("excel") || lower.includes("microsoft")) {
    return {
      icon: <FaMicrosoft />,
      chipClass:
        "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-300",
      iconWrapClass:
        "border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-300",
    };
  }

  if (lower.includes("mail")) {
    return {
      icon: <FiMail />,
      chipClass:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
      iconWrapClass:
        "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
    };
  }

  if (lower.includes("youtube")) {
    return {
      icon: <FaYoutube />,
      chipClass:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
      iconWrapClass:
        "border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
    };
  }

  if (lower.includes("line")) {
    return {
      icon: <FiMessageSquareIcon />,
      chipClass:
        "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-400/20 dark:bg-lime-400/10 dark:text-lime-300",
      iconWrapClass:
        "border-lime-200 bg-lime-50 text-lime-600 dark:border-lime-400/20 dark:bg-lime-400/10 dark:text-lime-300",
    };
  }

  return {
    icon: <FiCpu />,
    chipClass:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300",
      iconWrapClass:
        "border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300",
  };
};

const mapToUiApp = (item: AppLineMasterResponse): UiApp => {
  const meta = getMetaByName(item.name);

  return {
    id: item.id,
    name: item.name,
    token: item.token,
    category: getCategoryFromName(item.name),
    description: getDescriptionFromName(item.name),
    icon: meta.icon,
    chipClass: meta.chipClass,
    iconWrapClass: meta.iconWrapClass,
  };
};

const alertBadgeClass = (alert: boolean) => {
  if (alert) {
    return "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200";
  }
  return "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200";
};

const typeBadgeClass = (isGroup: boolean) => {
  if (isGroup) {
    return "border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200";
  }
  return "border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200";
};

const cardGlowClass = [
  "relative h-full overflow-hidden rounded-2xl p-4 sm:p-5",
  "border border-slate-200/80 bg-white shadow-sm",
  "dark:border-white/10 dark:bg-[#08111f]/95 dark:shadow-none",
  "flex flex-col",
].join(" ");

const inputClass = [
  "h-10 w-full rounded-xl px-3 text-[12px] outline-none transition",
  "border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100",
  "dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35 dark:focus:border-violet-400/30 dark:focus:ring-violet-400/10",
].join(" ");

const textareaClass = [
  "w-full min-h-24 rounded-xl px-3 py-2.5 text-[12px] outline-none transition resize-none",
  "border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100",
  "dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35 dark:focus:border-violet-400/30 dark:focus:ring-violet-400/10",
].join(" ");

const labelClass =
  "mb-1.5 block text-[11px] font-medium text-slate-700 dark:text-white/75";

const selectClass = [
  "h-10 w-full appearance-none rounded-xl px-3 pr-10 text-[12px] outline-none transition",
  "border border-slate-200 bg-white text-slate-800 focus:border-violet-300 focus:ring-2 focus:ring-violet-100",
  "dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:focus:border-violet-400/30 dark:focus:ring-violet-400/10",
].join(" ");

const modalBackdropClass =
  "fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]";

const modalCardClass =
  "relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[#08111f]";

const sectionChipClass =
  "inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300";

const panelClass =
  "rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]";

const ActionButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}> = ({ onClick, children, className = "", type = "button", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

const AlertToggle: React.FC<{
  value: boolean;
  onChange: (next: boolean) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={[
          "rounded-xl border px-3 py-3 text-left transition",
          value
            ? "border-emerald-300 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-500/10"
            : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className={[
              "grid h-8 w-8 place-items-center rounded-lg border",
              value
                ? "border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45",
            ].join(" ")}
          >
            <FiCheckCircle className="text-[14px]" />
          </span>
          <span
            className={[
              "h-2.5 w-2.5 rounded-full",
              value ? "bg-emerald-500" : "bg-slate-300 dark:bg-white/20",
            ].join(" ")}
          />
        </div>
        <p className="text-[12px] font-semibold text-slate-800 dark:text-white/85">
          Alert On
        </p>
        <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-white/45">
          Enable alerts
        </p>
      </button>

      <button
        type="button"
        onClick={() => onChange(false)}
        className={[
          "rounded-xl border px-3 py-3 text-left transition",
          !value
            ? "border-rose-300 bg-rose-50 dark:border-rose-400/30 dark:bg-rose-500/10"
            : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className={[
              "grid h-8 w-8 place-items-center rounded-lg border",
              !value
                ? "border-rose-300 bg-rose-100 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-300"
                : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45",
            ].join(" ")}
          >
            <FiAlertCircle className="text-[14px]" />
          </span>
          <span
            className={[
              "h-2.5 w-2.5 rounded-full",
              !value ? "bg-rose-500" : "bg-slate-300 dark:bg-white/20",
            ].join(" ")}
          />
        </div>
        <p className="text-[12px] font-semibold text-slate-800 dark:text-white/85">
          Alert Off
        </p>
        <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-white/45">
          Disable alerts
        </p>
      </button>
    </div>
  );
};

const ReceiverTypeToggle: React.FC<{
  value: boolean;
  onChange: (next: boolean) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={[
          "rounded-xl border px-3 py-3 text-left transition",
          value
            ? "border-cyan-300 bg-cyan-50 dark:border-cyan-400/30 dark:bg-cyan-500/10"
            : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className={[
              "grid h-8 w-8 place-items-center rounded-lg border",
              value
                ? "border-cyan-300 bg-cyan-100 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-500/15 dark:text-cyan-300"
                : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45",
            ].join(" ")}
          >
            <FiUsers className="text-[14px]" />
          </span>
          <span
            className={[
              "h-2.5 w-2.5 rounded-full",
              value ? "bg-cyan-500" : "bg-slate-300 dark:bg-white/20",
            ].join(" ")}
          />
        </div>
        <p className="text-[12px] font-semibold text-slate-800 dark:text-white/85">
          Group
        </p>
        <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-white/45">
          Shared channel
        </p>
      </button>

      <button
        type="button"
        onClick={() => onChange(false)}
        className={[
          "rounded-xl border px-3 py-3 text-left transition",
          !value
            ? "border-violet-300 bg-violet-50 dark:border-violet-400/30 dark:bg-violet-500/10"
            : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5",
        ].join(" ")}
      >
        <div className="mb-2 flex items-center justify-between">
          <span
            className={[
              "grid h-8 w-8 place-items-center rounded-lg border",
              !value
                ? "border-violet-300 bg-violet-100 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-300"
                : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45",
            ].join(" ")}
          >
            <FiUser className="text-[14px]" />
          </span>
          <span
            className={[
              "h-2.5 w-2.5 rounded-full",
              !value ? "bg-violet-500" : "bg-slate-300 dark:bg-white/20",
            ].join(" ")}
          />
        </div>
        <p className="text-[12px] font-semibold text-slate-800 dark:text-white/85">
          Personal
        </p>
        <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-white/45">
          Single user
        </p>
      </button>
    </div>
  );
};

const Notify: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("Newest");
  const [openSort, setOpenSort] = useState(false);

  const [rows, setRows] = useState<UiNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [lineMasters, setLineMasters] = useState<AppLineMasterResponse[]>([]);
  const [loadingLineMasters, setLoadingLineMasters] = useState<boolean>(true);
  const [lineMasterError, setLineMasterError] = useState<string>("");
  const [lineMasterSearch, setLineMasterSearch] = useState("");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [selectedRow, setSelectedRow] = useState<UiNotification | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<UiNotification | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [openTestModal, setOpenTestModal] = useState(false);
  const [testTarget, setTestTarget] = useState<UiNotification | null>(null);
  const [testingLine, setTestingLine] = useState(false);
  const [testLineError, setTestLineError] = useState("");
  const [testLineSuccess, setTestLineSuccess] = useState("");
  const [testLineForm, setTestLineForm] = useState<TestLineFormData>({
    message: "",
  });

  const [createForm, setCreateForm] = useState<NotificationFormData>({
    name: "",
    send_id: "",
    alert: true,
    is_group: true,
    app_line_master_id: "",
  });

  const [editForm, setEditForm] = useState<NotificationFormData>({
    name: "",
    send_id: "",
    alert: true,
    is_group: true,
    app_line_master_id: "",
  });

  const [masterFormOpen, setMasterFormOpen] = useState(false);
  const [masterFormMode, setMasterFormMode] = useState<FormMode>("create");
  const [masterSubmitting, setMasterSubmitting] = useState(false);
  const [masterFormError, setMasterFormError] = useState("");
  const [editingMaster, setEditingMaster] = useState<AppLineMasterResponse | null>(null);
  const [masterFormData, setMasterFormData] = useState<LineMasterFormData>({
    name: "",
    token: "",
  });
  const [showToken, setShowToken] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const [masterDeleteOpen, setMasterDeleteOpen] = useState(false);
  const [masterDeleteTarget, setMasterDeleteTarget] =
    useState<AppLineMasterResponse | null>(null);
  const [masterDeleteError, setMasterDeleteError] = useState("");
  const [masterDeleting, setMasterDeleting] = useState(false);

  const [notifyPage, setNotifyPage] = useState(1);

  const lineMasterMap = useMemo(() => {
    return new Map<number, string>(
      lineMasters.map((item) => [item.id, item.name ?? `Line Master #${item.id}`]),
    );
  }, [lineMasters]);

  const uiLineMasters = useMemo(() => {
    return lineMasters.map(mapToUiApp);
  }, [lineMasters]);

  const filteredLineMasters = useMemo(() => {
    const q = lineMasterSearch.trim().toLowerCase();

    return uiLineMasters.filter((item) => {
      const blob = [item.name, item.category, item.description].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [uiLineMasters, lineMasterSearch]);

  const shouldLineMasterScroll = filteredLineMasters.length >= 3;

  const lineMasterListClass = shouldLineMasterScroll
    ? "overflow-y-auto pr-1 max-h-[228px]"
    : "overflow-visible";

  const fetchNotifications = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError("");

      if (!force && notificationListCache) {
        setRows(notificationListCache);
        return notificationListCache;
      }

      const data = await ListAppNotification();

      if (!data) {
        notificationListCache = [];
        setRows([]);
        setError("Unable to load app notifications.");
        return [];
      }

      const mapped: UiNotification[] = (data as AppNotificationResponse[]).map((item) => ({
        id: item.id,
        name: item.name ?? "",
        send_id: item.send_id ?? "",
        alert: Boolean(item.alert),
        is_group: Boolean(item.is_group),
        app_line_master_id: Number(item.app_line_master_id ?? 0),
      }));

      notificationListCache = mapped;
      setRows(mapped);
      return mapped;
    } catch (err) {
      console.error("fetchNotifications error:", err);
      notificationListCache = null;
      setRows([]);
      setError("Something went wrong while loading app notifications.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLineMasters = useCallback(async (force = false) => {
    try {
      setLoadingLineMasters(true);
      setLineMasterError("");

      if (!force && lineMasterListCache) {
        setLineMasters(lineMasterListCache);
        return lineMasterListCache;
      }

      const data = await ListAppLineMaster();

      if (!data) {
        lineMasterListCache = [];
        setLineMasters([]);
        setLineMasterError("Unable to load line master data.");
        return [];
      }

      lineMasterListCache = data;
      setLineMasters(data);
      return data;
    } catch (err) {
      console.error("fetchLineMasters error:", err);
      lineMasterListCache = null;
      setLineMasters([]);
      setLineMasterError("Something went wrong while loading line master data.");
      return [];
    } finally {
      setLoadingLineMasters(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    if (notificationListCache && lineMasterListCache) {
      setRows(notificationListCache);
      setLineMasters(lineMasterListCache);
      setLoading(false);
      setLoadingLineMasters(false);
      setError("");
      setLineMasterError("");
      return;
    }

    if (!initialNotifyPageLoadPromise) {
      initialNotifyPageLoadPromise = Promise.all([
        fetchNotifications(),
        fetchLineMasters(),
      ]).then(() => undefined).finally(() => {
        initialNotifyPageLoadPromise = null;
      });
    }

    await initialNotifyPageLoadPromise;
  }, [fetchLineMasters, fetchNotifications]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  const notifications = useMemo(() => {
    const q = search.trim().toLowerCase();

    let filtered = rows.filter((item) => {
      const lineMasterName =
        lineMasterMap.get(item.app_line_master_id) ||
        `Line Master #${item.app_line_master_id}`;

      const typeText = item.is_group ? "group" : "personal";

      const blob = [
        item.name,
        item.send_id,
        item.alert ? "on" : "off",
        item.alert ? "true" : "false",
        item.is_group ? "group" : "personal",
        item.is_group ? "true" : "false",
        lineMasterName,
        typeText,
      ]
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "Newest") return b.id - a.id;

      if (sortBy === "Alert: On First") {
        if (a.alert === b.alert) return b.id - a.id;
        return a.alert ? -1 : 1;
      }

      if (sortBy === "Alert: Off First") {
        if (a.alert === b.alert) return b.id - a.id;
        return a.alert ? 1 : -1;
      }

      return b.id - a.id;
    });

    return filtered;
  }, [rows, search, sortBy, lineMasterMap]);

  useEffect(() => {
    setNotifyPage(1);
  }, [search, sortBy, rows.length]);

  const totalNotifyPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));

  const pagedNotifications = useMemo(() => {
    const safePage = Math.min(notifyPage, totalNotifyPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return notifications.slice(start, start + PAGE_SIZE);
  }, [notifications, notifyPage, totalNotifyPages]);

  const resetCreateForm = () => {
    setCreateForm({
      name: "",
      send_id: "",
      alert: true,
      is_group: true,
      app_line_master_id: lineMasters.length > 0 ? String(lineMasters[0].id) : "",
    });
    setCreateError("");
  };

  const resetEditForm = () => {
    setEditForm({
      name: "",
      send_id: "",
      alert: true,
      is_group: true,
      app_line_master_id: "",
    });
    setEditError("");
  };

  const resetTestLineForm = () => {
    setTestLineForm({
      message: "",
    });
    setTestLineError("");
    setTestLineSuccess("");
  };

  const openCreate = () => {
    setCreateForm({
      name: "",
      send_id: "",
      alert: true,
      is_group: true,
      app_line_master_id: lineMasters.length > 0 ? String(lineMasters[0].id) : "",
    });
    setCreateError("");
    setOpenCreateModal(true);
  };

  const closeCreate = () => {
    if (creating) return;
    setOpenCreateModal(false);
    resetCreateForm();
  };

  const openEdit = (row: UiNotification) => {
    setSelectedRow(row);
    setEditForm({
      name: row.name,
      send_id: row.send_id,
      alert: row.alert,
      is_group: row.is_group,
      app_line_master_id: String(row.app_line_master_id),
    });
    setEditError("");
    setOpenEditModal(true);
  };

  const closeEdit = () => {
    if (editing) return;
    setOpenEditModal(false);
    setSelectedRow(null);
    resetEditForm();
  };

  const openDeleteModal = (row: UiNotification) => {
    setDeleteTarget(row);
    setDeleteError("");
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const openTestLineModal = (row: UiNotification) => {
    setTestTarget(row);
    setTestLineForm({
      message: "",
    });
    setTestLineError("");
    setTestLineSuccess("");
    setOpenTestModal(true);
  };

  const closeTestLineModal = () => {
    if (testingLine) return;
    setOpenTestModal(false);
    setTestTarget(null);
    resetTestLineForm();
  };

  const validateForm = (form: NotificationFormData) => {
    if (!form.name.trim()) return "Please enter Name.";
    if (!form.send_id.trim()) return "Please enter Send ID.";
    if (!form.app_line_master_id.trim()) return "Please select App Line Master.";

    const lineMasterID = Number(form.app_line_master_id);
    if (Number.isNaN(lineMasterID) || lineMasterID <= 0) {
      return "App Line Master is invalid.";
    }

    return "";
  };

  const validateTestLineForm = (form: TestLineFormData) => {
    if (!form.message.trim()) return "Please enter a test message.";
    if (form.message.trim().length < 2) return "Message must be at least 2 characters.";
    return "";
  };

  const submitCreate = async () => {
    const validationError = validateForm(createForm);
    if (validationError) {
      setCreateError(validationError);
      return;
    }

    try {
      setCreating(true);
      setCreateError("");

      const payload = {
        name: createForm.name.trim(),
        send_id: createForm.send_id.trim(),
        alert: createForm.alert,
        is_group: createForm.is_group,
        app_line_master_id: Number(createForm.app_line_master_id),
      };

      const res = await CreateAppNotification(payload);

      if (!res) {
        setCreateError("Failed to create app notification.");
        return;
      }

      setOpenCreateModal(false);
      resetCreateForm();
      await fetchNotifications(true);
    } catch (err: any) {
      setCreateError(
        err?.response?.data?.error ||
          err?.message ||
          "Something went wrong while creating app notification.",
      );
    } finally {
      setCreating(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedRow) return;

    const validationError = validateForm(editForm);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    try {
      setEditing(true);
      setEditError("");

      const payload = {
        name: editForm.name.trim(),
        send_id: editForm.send_id.trim(),
        alert: editForm.alert,
        is_group: editForm.is_group,
        app_line_master_id: Number(editForm.app_line_master_id),
      };

      const res = await UpdateAppNotificationByID(selectedRow.id, payload);

      if (!res) {
        setEditError("Failed to update app notification.");
        return;
      }

      setOpenEditModal(false);
      setSelectedRow(null);
      resetEditForm();
      await fetchNotifications(true);
    } catch (err: any) {
      setEditError(
        err?.response?.data?.error ||
          err?.message ||
          "Something went wrong while updating app notification.",
      );
    } finally {
      setEditing(false);
    }
  };

  const submitTestLine = async () => {
    if (!testTarget) return;

    const validationError = validateTestLineForm(testLineForm);
    if (validationError) {
      setTestLineError(validationError);
      return;
    }

    try {
      setTestingLine(true);
      setTestLineError("");
      setTestLineSuccess("");

      const res = await TestLineNotifyByAppNotificationID({
        app_notification_id: testTarget.id,
        message: testLineForm.message.trim(),
      });

      if (!res) {
        setTestLineError("Failed to send test LINE notification.");
        return;
      }

      if (!res.success) {
        setTestLineError(res.message || "Failed to send test LINE notification.");
        return;
      }

      setTestLineSuccess(res.message || "Test message sent successfully.");
      setTestLineForm((prev) => ({
        ...prev,
        message: "",
      }));
    } catch (err: any) {
      setTestLineError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while sending test LINE notification.",
      );
    } finally {
      setTestingLine(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const res = await DeleteAppNotificationByID(deleteTarget.id);

      if (!res) {
        setDeleteError("Failed to delete app notification.");
        return;
      }

      setDeleteTarget(null);
      await fetchNotifications(true);
    } catch (err: any) {
      setDeleteError(
        err?.response?.data?.error ||
          err?.message ||
          "Something went wrong while deleting app notification.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const openCreateMasterModal = () => {
    setMasterFormMode("create");
    setEditingMaster(null);
    setMasterFormData({
      name: "",
      token: "",
    });
    setShowToken(false);
    setCopiedToken(false);
    setMasterFormError("");
    setMasterFormOpen(true);
  };

  const openEditMasterModal = (item: AppLineMasterResponse) => {
    setMasterFormMode("edit");
    setEditingMaster(item);
    setMasterFormData({
      name: item.name || "",
      token: item.token || "",
    });
    setShowToken(false);
    setCopiedToken(false);
    setMasterFormError("");
    setMasterFormOpen(true);
  };

  const closeMasterFormModal = () => {
    if (masterSubmitting) return;
    setMasterFormOpen(false);
    setMasterFormError("");
    setEditingMaster(null);
    setShowToken(false);
    setCopiedToken(false);
  };

  const validateMasterForm = () => {
    const name = normalizeText(masterFormData.name);
    const token = normalizeText(masterFormData.token);

    if (!name) return "Please enter integration name.";
    if (name.length < 2) return "Integration name must be at least 2 characters.";
    if (!token) return "Please enter token.";
    if (token.length < 6) return "Token must be at least 6 characters.";

    return "";
  };

  const handleCopyToken = async () => {
    const token = normalizeText(masterFormData.token);
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(true);
      window.setTimeout(() => setCopiedToken(false), 1500);
    } catch (err) {
      console.error("copy token error:", err);
    }
  };

  const handleSubmitMaster = async () => {
    const validationError = validateMasterForm();
    if (validationError) {
      setMasterFormError(validationError);
      return;
    }

    try {
      setMasterSubmitting(true);
      setMasterFormError("");

      const payload = {
        name: normalizeText(masterFormData.name),
        token: normalizeText(masterFormData.token),
      };

      if (masterFormMode === "create") {
        const res = await CreateAppLineMaster(payload);

        if (!res?.data) {
          setMasterFormError("Failed to create integration.");
          return;
        }

        setLineMasters((prev) => {
          const next = [res.data, ...prev];
          lineMasterListCache = next;
          return next;
        });
        setMasterFormOpen(false);

        setCreateForm((prev) => ({
          ...prev,
          app_line_master_id: String(res.data.id),
        }));

        setEditForm((prev) => ({
          ...prev,
          app_line_master_id: prev.app_line_master_id || String(res.data.id),
        }));

        return;
      }

      if (!editingMaster?.id) {
        setMasterFormError("Missing integration ID.");
        return;
      }

      const res = await UpdateAppLineMasterByID(editingMaster.id, payload);

      if (!res?.data) {
        setMasterFormError("Failed to update integration.");
        return;
      }

      setLineMasters((prev) => {
        const next = prev.map((item) =>
          item.id === editingMaster.id ? res.data : item,
        );
        lineMasterListCache = next;
        return next;
      });
      setMasterFormOpen(false);
    } catch (err: any) {
      setMasterFormError(
        err?.response?.data?.error ||
          err?.message ||
          (masterFormMode === "create"
            ? "Failed to create integration."
            : "Failed to update integration."),
      );
    } finally {
      setMasterSubmitting(false);
    }
  };

  const openDeleteMasterModal = (item: AppLineMasterResponse) => {
    setMasterDeleteTarget(item);
    setMasterDeleteError("");
    setMasterDeleteOpen(true);
  };

  const closeDeleteMasterModal = () => {
    if (masterDeleting) return;
    setMasterDeleteOpen(false);
    setMasterDeleteTarget(null);
    setMasterDeleteError("");
  };

  const handleDeleteMaster = async () => {
    if (!masterDeleteTarget?.id) {
      setMasterDeleteError("Missing integration ID.");
      return;
    }

    try {
      setMasterDeleting(true);
      setMasterDeleteError("");

      const res = await DeleteAppLineMasterByID(masterDeleteTarget.id);

      if (!res) {
        setMasterDeleteError("Failed to delete integration.");
        return;
      }

      setLineMasters((prev) => {
        const next = prev.filter((item) => item.id !== masterDeleteTarget.id);
        lineMasterListCache = next;
        return next;
      });

      if (createForm.app_line_master_id === String(masterDeleteTarget.id)) {
        setCreateForm((prev) => ({
          ...prev,
          app_line_master_id: "",
        }));
      }

      if (editForm.app_line_master_id === String(masterDeleteTarget.id)) {
        setEditForm((prev) => ({
          ...prev,
          app_line_master_id: "",
        }));
      }

      setMasterDeleteOpen(false);
      setMasterDeleteTarget(null);
    } catch (err) {
      console.error("handleDeleteMaster error:", err);
      setMasterDeleteError("Failed to delete integration.");
    } finally {
      setMasterDeleting(false);
    }
  };

  const renderNotificationTable = () => {
    if (loading) {
      return (
        <div className="flex min-h-75 items-center justify-center text-[12px] text-slate-500 dark:text-white/50">
          Loading notifications...
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex min-h-75 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-[12px] text-slate-500 dark:border-white/10 dark:text-white/45">
          No notification data
        </div>
      );
    }

    return (
      <div className="flex min-h-75 flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2.5">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/45">
                  Name
                </th>
                <th className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/45">
                  Send ID
                </th>
                <th className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/45">
                  App
                </th>
                <th className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/45">
                  Alert
                </th>
                <th className="px-3 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/45">
                  Type
                </th>
                <th className="px-3 py-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/45">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pagedNotifications.map((item) => {
                const lineMasterName =
                  lineMasterMap.get(item.app_line_master_id) ||
                  `Line Master #${item.app_line_master_id}`;

                return (
                  <tr key={item.id}>
                    <td className="rounded-l-2xl border-y border-l border-slate-200 bg-white px-3 py-3 align-middle dark:border-white/10 dark:bg-white/3">
                      <div className="min-w-37.5">
                        <p className="truncate text-[12px] font-medium text-slate-800 dark:text-white/85">
                          {item.name}
                        </p>
                      </div>
                    </td>

                    <td className="border-y border-slate-200 bg-white px-3 py-3 align-middle dark:border-white/10 dark:bg-white/3">
                      <div className="min-w-37.5">
                        <p className="truncate font-mono text-[11px] text-slate-600 dark:text-white/60">
                          {item.send_id}
                        </p>
                      </div>
                    </td>

                    <td className="border-y border-slate-200 bg-white px-3 py-3 align-middle dark:border-white/10 dark:bg-white/3">
                      <div className="min-w-35">
                        <span className="truncate text-[11.5px] text-slate-700 dark:text-white/70">
                          {lineMasterName}
                        </span>
                      </div>
                    </td>

                    <td className="border-y border-slate-200 bg-white px-3 py-3 align-middle dark:border-white/10 dark:bg-white/3">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-semibold",
                          alertBadgeClass(item.alert),
                        ].join(" ")}
                      >
                        {item.alert ? "On" : "Off"}
                      </span>
                    </td>

                    <td className="border-y border-slate-200 bg-white px-3 py-3 align-middle dark:border-white/10 dark:bg-white/3">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-semibold",
                          typeBadgeClass(item.is_group),
                        ].join(" ")}
                      >
                        {item.is_group ? "Group" : "Personal"}
                      </span>
                    </td>

                    <td className="rounded-r-2xl border-y border-r border-slate-200 bg-white px-3 py-3 align-middle dark:border-white/10 dark:bg-white/3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openTestLineModal(item)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-200 text-cyan-600 transition hover:bg-cyan-50 dark:border-cyan-400/20 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                          title="Test"
                        >
                          <FiSend className="text-[13px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 text-violet-600 transition hover:bg-violet-50 dark:border-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-500/10"
                          title="Edit"
                        >
                          <FiEdit2 className="text-[13px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(item)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <FiTrash2 className="text-[13px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-slate-200/70 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <p className="text-[11px] text-slate-500 dark:text-white/45">
            Showing{" "}
            <span className="font-medium text-slate-700 dark:text-white/75">
              {notifications.length === 0 ? 0 : (notifyPage - 1) * PAGE_SIZE + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-slate-700 dark:text-white/75">
              {Math.min(notifyPage * PAGE_SIZE, notifications.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700 dark:text-white/75">
              {notifications.length}
            </span>
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setNotifyPage((prev) => Math.max(1, prev - 1))}
              disabled={notifyPage <= 1}
              className="inline-flex items-center gap-1 rounded-xl border border-violet-200 px-3 py-2 text-[11.5px] font-medium text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-500/10"
            >
              <FiChevronLeft className="text-[13px]" />
              Previous
            </button>

            <div className="rounded-xl border border-slate-200 px-3 py-2 text-[11.5px] font-medium text-slate-700 dark:border-white/10 dark:text-white/70">
              {notifyPage} / {totalNotifyPages}
            </div>

            <button
              type="button"
              onClick={() => setNotifyPage((prev) => Math.min(totalNotifyPages, prev + 1))}
              disabled={notifyPage >= totalNotifyPages}
              className="inline-flex items-center gap-1 rounded-xl border border-violet-200 px-3 py-2 text-[11.5px] font-medium text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-500/10"
            >
              Next
              <FiChevronRight className="text-[13px]" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className={cardGlowClass}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-12 right-6 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div
              className="h-full w-full text-slate-500 dark:text-white/15"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: "24px 24px",
              }}
            />
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className={sectionChipClass}>
                <FiBell className="text-[10px]" />
                Notification Center
              </div>

              <h2 className="mt-2 text-[18px] font-semibold tracking-tight text-slate-900 dark:text-white">
                Line Notification & Integration
              </h2>

              <p className="mt-1 text-[11px] text-slate-500 dark:text-white/55">
                Manage receivers and connected integrations in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionButton
                onClick={fetchNotifications}
                className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                <FiRefreshCw className="text-[13px]" />
                Refresh
              </ActionButton>

              <ActionButton
                onClick={openCreateMasterModal}
                className="border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-500/15"
              >
                <FiLink2 className="text-[13px]" />
                Add Integration
              </ActionButton>

              <ActionButton
                onClick={openCreate}
                className="bg-[#6d5efc] text-white hover:bg-[#5f51eb]"
              >
                <FiPlus className="text-[13px]" />
                Add Notify
              </ActionButton>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12 xl:items-start">
            <div className="xl:col-span-4">
              <div className={`${panelClass} flex flex-col`}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[13px] font-semibold text-slate-800 dark:text-white/85">
                      Integration List
                    </h3>
                    <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-white/45">
                      Connected channels and apps
                    </p>
                  </div>
                  <div className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-medium text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                    {filteredLineMasters.length}
                  </div>
                </div>

                <div className="relative mb-3">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 dark:text-white/35" />
                  <input
                    value={lineMasterSearch}
                    onChange={(e) => setLineMasterSearch(e.target.value)}
                    placeholder="Search integration..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[12px] outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35 dark:focus:border-cyan-400/30 dark:focus:ring-cyan-400/10"
                  />
                </div>

                {loadingLineMasters ? (
                  <div className="flex min-h-55 items-center justify-center text-[12px] text-slate-500 dark:text-white/50">
                    Loading integrations...
                  </div>
                ) : lineMasterError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                    {lineMasterError}
                  </div>
                ) : filteredLineMasters.length === 0 ? (
                  <div className="flex min-h-55 items-center justify-center rounded-xl border border-dashed border-slate-200 text-[12px] text-slate-500 dark:border-white/10 dark:text-white/45">
                    No integration found
                  </div>
                ) : (
                  <div className={lineMasterListClass}>
                    <div className="space-y-2.5">
                      {filteredLineMasters.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-xl border border-slate-200 bg-white p-3 transition hover:border-cyan-200 hover:bg-slate-50/70 dark:border-white/10 dark:bg-white/3 dark:hover:border-cyan-400/15 dark:hover:bg-white/5"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={[
                                "grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-[15px]",
                                item.iconWrapClass,
                              ].join(" ")}
                            >
                              {item.icon}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-[12px] font-semibold text-slate-800 dark:text-white/85">
                                    {item.name}
                                  </p>
                                  <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-white/45">
                                    {item.category}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditMasterModal(
                                        lineMasters.find((m) => m.id === item.id)!,
                                      )
                                    }
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 text-violet-600 transition hover:bg-violet-50 dark:border-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-500/10"
                                    title="Edit Integration"
                                  >
                                    <FiEdit2 className="text-[13px]" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openDeleteMasterModal(
                                        lineMasters.find((m) => m.id === item.id)!,
                                      )
                                    }
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
                                    title="Delete Integration"
                                  >
                                    <FiTrash2 className="text-[13px]" />
                                  </button>
                                </div>
                              </div>

                              <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-600 dark:text-white/55">
                                {item.description}
                              </p>

                              <div className="mt-2 flex items-center justify-between gap-2">
                                <span
                                  className={[
                                    "inline-flex rounded-full border px-2 py-1 text-[10px] font-medium",
                                    item.chipClass,
                                  ].join(" ")}
                                >
                                  Connected
                                </span>

                                <span className="text-[10px] text-slate-400 dark:text-white/30">
                                  Token ready
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-8">
              <div className={`${panelClass} flex flex-col`}>
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-[13px] font-semibold text-slate-800 dark:text-white/85">
                      Notify List
                    </h3>
                    <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-white/45">
                      Notification receivers overview
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative min-w-55">
                      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400 dark:text-white/35" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notify..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[12px] outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:placeholder:text-white/35 dark:focus:border-violet-400/30 dark:focus:ring-violet-400/10"
                      />
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenSort((prev) => !prev)}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 text-[12px] text-violet-700 transition hover:bg-violet-100 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
                      >
                        <FiLayers className="text-[13px]" />
                        {sortBy}
                        <FiChevronDown className="text-[13px]" />
                      </button>

                      {openSort && (
                        <div className="absolute right-0 z-20 mt-2 min-w-45 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-lg dark:border-white/10 dark:bg-[#0b1525]">
                          {(["Newest", "Alert: On First", "Alert: Off First"] as SortKey[]).map(
                            (option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setSortBy(option);
                                  setOpenSort(false);
                                }}
                                className={[
                                  "flex w-full items-center justify-between px-3 py-2.5 text-left text-[12px] transition",
                                  sortBy === option
                                    ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                                    : "text-slate-700 hover:bg-slate-50 dark:text-white/75 dark:hover:bg-white/5",
                                ].join(" ")}
                              >
                                <span>{option}</span>
                                {sortBy === option ? (
                                  <FiCheckCircle className="text-[13px]" />
                                ) : null}
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {renderNotificationTable()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {openCreateModal && (
        <div className={modalBackdropClass}>
          <div className={`${modalCardClass} max-w-2xl`}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                  Create Notify
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-white/45">
                  Add a new notification receiver
                </p>
              </div>
              <button
                type="button"
                onClick={closeCreate}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              {createError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                  {createError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    className={inputClass}
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Receiver name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Send ID</label>
                  <input
                    className={inputClass}
                    value={createForm.send_id}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, send_id: e.target.value }))
                    }
                    placeholder="User ID / Group ID"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>App Line Master</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={createForm.app_line_master_id}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        app_line_master_id: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select integration</option>
                    {lineMasters.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 dark:text-white/35" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Alert Status</label>
                <AlertToggle
                  value={createForm.alert}
                  onChange={(next) =>
                    setCreateForm((prev) => ({ ...prev, alert: next }))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Receiver Type</label>
                <ReceiverTypeToggle
                  value={createForm.is_group}
                  onChange={(next) =>
                    setCreateForm((prev) => ({ ...prev, is_group: next }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-white/10">
              <ActionButton
                onClick={closeCreate}
                className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={submitCreate}
                disabled={creating}
                className="bg-[#6d5efc] text-white hover:bg-[#5f51eb]"
              >
                {creating ? "Creating..." : "Create"}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {openEditModal && (
        <div className={modalBackdropClass}>
          <div className={`${modalCardClass} max-w-2xl`}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                  Edit Notify
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-white/45">
                  Update notification receiver
                </p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              {editError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                  {editError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    className={inputClass}
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Receiver name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Send ID</label>
                  <input
                    className={inputClass}
                    value={editForm.send_id}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, send_id: e.target.value }))
                    }
                    placeholder="User ID / Group ID"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>App Line Master</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={editForm.app_line_master_id}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        app_line_master_id: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select integration</option>
                    {lineMasters.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400 dark:text-white/35" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Alert Status</label>
                <AlertToggle
                  value={editForm.alert}
                  onChange={(next) =>
                    setEditForm((prev) => ({ ...prev, alert: next }))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Receiver Type</label>
                <ReceiverTypeToggle
                  value={editForm.is_group}
                  onChange={(next) =>
                    setEditForm((prev) => ({ ...prev, is_group: next }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-white/10">
              <ActionButton
                onClick={closeEdit}
                className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={submitEdit}
                disabled={editing}
                className="bg-[#6d5efc] text-white hover:bg-[#5f51eb]"
              >
                {editing ? "Saving..." : "Save"}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className={modalBackdropClass}>
          <div className={`${modalCardClass} max-w-md`}>
            <div className="px-5 py-5">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300">
                <FiTrash2 className="text-[18px]" />
              </div>

              <h3 className="text-center text-[16px] font-semibold text-slate-900 dark:text-white">
                Delete Notify
              </h3>
              <p className="mt-2 text-center text-[12px] leading-6 text-slate-500 dark:text-white/50">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700 dark:text-white/80">
                  {deleteTarget.name}
                </span>
                ?
              </p>

              {deleteError ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                  {deleteError}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-center gap-2">
                <ActionButton
                  onClick={closeDeleteModal}
                  className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="bg-rose-600 text-white hover:bg-rose-700"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {openTestModal && testTarget && (
        <div className={modalBackdropClass}>
          <div className={`${modalCardClass} max-w-xl`}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                  Test LINE Notify
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-white/45">
                  Send a test message to {testTarget.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeTestLineModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              >
                <FiX />
              </button>
            </div>

            <div className="px-5 py-5">
              {testLineError ? (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                  {testLineError}
                </div>
              ) : null}

              {testLineSuccess ? (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {testLineSuccess}
                </div>
              ) : null}

              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  className={textareaClass}
                  value={testLineForm.message}
                  onChange={(e) =>
                    setTestLineForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Enter test message..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-white/10">
              <ActionButton
                onClick={closeTestLineModal}
                className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={submitTestLine}
                disabled={testingLine}
                className="bg-cyan-600 text-white hover:bg-cyan-700"
              >
                {testingLine ? "Sending..." : "Send Test"}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {masterFormOpen && (
        <div className={modalBackdropClass}>
          <div className={`${modalCardClass} max-w-xl`}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                  {masterFormMode === "create" ? "Create Integration" : "Edit Integration"}
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-white/45">
                  Manage line master connection
                </p>
              </div>
              <button
                type="button"
                onClick={closeMasterFormModal}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              {masterFormError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                  {masterFormError}
                </div>
              ) : null}

              <div>
                <label className={labelClass}>Integration Name</label>
                <input
                  className={inputClass}
                  value={masterFormData.name}
                  onChange={(e) =>
                    setMasterFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="LINE Notify / Slack / Google..."
                />
              </div>

              <div>
                <label className={labelClass}>Token</label>
                <div className="relative">
                  <input
                    className={`${inputClass} pr-24`}
                    type={showToken ? "text" : "password"}
                    value={masterFormData.token}
                    onChange={(e) =>
                      setMasterFormData((prev) => ({ ...prev, token: e.target.value }))
                    }
                    placeholder="Enter token"
                  />
                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowToken((prev) => !prev)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                    >
                      {showToken ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>
                {copiedToken ? (
                  <p className="mt-1 text-[10.5px] text-emerald-600 dark:text-emerald-300">
                    Copied
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-white/10">
              <ActionButton
                onClick={closeMasterFormModal}
                className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={handleSubmitMaster}
                disabled={masterSubmitting}
                className="bg-cyan-600 text-white hover:bg-cyan-700"
              >
                {masterSubmitting
                  ? masterFormMode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : masterFormMode === "create"
                    ? "Create"
                    : "Save"}
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {masterDeleteOpen && masterDeleteTarget && (
        <div className={modalBackdropClass}>
          <div className={`${modalCardClass} max-w-md`}>
            <div className="px-5 py-5">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300">
                <FiTrash2 className="text-[18px]" />
              </div>

              <h3 className="text-center text-[16px] font-semibold text-slate-900 dark:text-white">
                Delete Integration
              </h3>
              <p className="mt-2 text-center text-[12px] leading-6 text-slate-500 dark:text-white/50">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700 dark:text-white/80">
                  {masterDeleteTarget.name}
                </span>
                ?
              </p>

              {masterDeleteError ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                  {masterDeleteError}
                </div>
              ) : null}

              <div className="mt-5 flex items-center justify-center gap-2">
                <ActionButton
                  onClick={closeDeleteMasterModal}
                  className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={handleDeleteMaster}
                  disabled={masterDeleting}
                  className="bg-rose-600 text-white hover:bg-rose-700"
                >
                  {masterDeleting ? "Deleting..." : "Delete"}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notify;