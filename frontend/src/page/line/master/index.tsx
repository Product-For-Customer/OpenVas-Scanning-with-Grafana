import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiGrid,
  FiList,
  FiLink2,
  FiSettings,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiBell,
  FiCpu,
  FiSlack,
  FiMail,
  FiEye,
  FiEyeOff,
  FiCopy,
} from "react-icons/fi";
import { FaTiktok, FaGoogle, FaYoutube, FaMicrosoft } from "react-icons/fa";
import {
  ListAppLineMaster,
  CreateAppLineMaster,
  UpdateAppLineMasterByID,
  DeleteAppLineMasterByID,
  type AppLineMasterResponse,
} from "../../../services";

type ViewMode = "grid" | "list";
type FormMode = "create" | "edit";

type FormData = {
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
  accent: string;
  chipClass: string;
  iconWrapClass: string;
  buttonClass: string;
};

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
    return "Specific feature or service that's not available in your change often discovering.";
  }
  if (lower.includes("google") || lower.includes("meet")) {
    return "Change is often about discovering what works best for you.";
  }
  if (lower.includes("tiktok")) {
    return "Change is often about discovering what works best for you.";
  }
  if (lower.includes("excel") || lower.includes("microsoft")) {
    return "Specific feature or service that's not available in your change often discovering.";
  }
  if (lower.includes("mail")) {
    return "Change is often about discovering what works best for you.";
  }
  if (lower.includes("youtube")) {
    return "Change is often about discovering what works best for you.";
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
      accent: "from-sky-400/20 via-cyan-400/10 to-blue-400/10",
      chipClass:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300",
      iconWrapClass:
        "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300",
      buttonClass:
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
    };
  }

  if (lower.includes("google") || lower.includes("meet")) {
    return {
      icon: <FaGoogle />,
      accent: "from-emerald-400/20 via-lime-400/10 to-yellow-400/10",
      chipClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
      iconWrapClass:
        "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
      buttonClass:
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
    };
  }

  if (lower.includes("tiktok")) {
    return {
      icon: <FaTiktok />,
      accent: "from-pink-400/20 via-fuchsia-400/10 to-cyan-400/10",
      chipClass:
        "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-400/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
      iconWrapClass:
        "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-400/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
      buttonClass:
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
    };
  }

  if (lower.includes("excel") || lower.includes("microsoft")) {
    return {
      icon: <FaMicrosoft />,
      accent: "from-emerald-400/20 via-teal-400/10 to-green-400/10",
      chipClass:
        "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-400/20 dark:bg-teal-500/10 dark:text-teal-300",
      iconWrapClass:
        "border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-400/20 dark:bg-teal-500/10 dark:text-teal-300",
      buttonClass:
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
    };
  }

  if (lower.includes("mail")) {
    return {
      icon: <FiMail />,
      accent: "from-amber-400/20 via-yellow-400/10 to-orange-400/10",
      chipClass:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300",
      iconWrapClass:
        "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300",
      buttonClass:
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
    };
  }

  if (lower.includes("youtube")) {
    return {
      icon: <FaYoutube />,
      accent: "from-red-400/20 via-rose-400/10 to-orange-400/10",
      chipClass:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300",
      iconWrapClass:
        "border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300",
      buttonClass:
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
    };
  }

  if (lower.includes("line")) {
    return {
      icon: <FiMessageSquareIcon />,
      accent: "from-emerald-400/20 via-cyan-400/10 to-lime-400/10",
      chipClass:
        "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-400/20 dark:bg-lime-500/10 dark:text-lime-300",
      iconWrapClass:
        "border-lime-200 bg-lime-50 text-lime-600 dark:border-lime-400/20 dark:bg-lime-500/10 dark:text-lime-300",
      buttonClass:
        "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
    };
  }

  return {
    icon: <FiCpu />,
    accent: "from-cyan-400/20 via-violet-400/10 to-blue-400/10",
    chipClass:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300",
    iconWrapClass:
      "border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300",
    buttonClass:
      "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
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
    accent: meta.accent,
    chipClass: meta.chipClass,
    iconWrapClass: meta.iconWrapClass,
    buttonClass: meta.buttonClass,
  };
};

const Index: React.FC = () => {
  const [items, setItems] = useState<AppLineMasterResponse[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingItem, setEditingItem] = useState<AppLineMasterResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    token: "",
  });
  const [showToken, setShowToken] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AppLineMasterResponse | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [copiedToken, setCopiedToken] = useState(false);

  const loadAppLineMasters = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await ListAppLineMaster();

      if (Array.isArray(res)) {
        setItems(res);
      } else {
        setItems([]);
        setError("Unable to load integrations.");
      }
    } catch (err) {
      console.error("loadAppLineMasters error:", err);
      setItems([]);
      setError("Unable to load integrations.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppLineMasters();
  }, []);

  const uiItems = useMemo(() => {
    return items.map(mapToUiApp);
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return uiItems.filter((item) => {
      const blob = [item.name, item.category, item.description].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [uiItems, search]);

  const openCreateModal = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormData({
      name: "",
      token: "",
    });
    setShowToken(false);
    setCopiedToken(false);
    setFormError("");
    setFormOpen(true);
  };

  const openEditModal = (item: AppLineMasterResponse) => {
    setFormMode("edit");
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      token: item.token || "",
    });
    setShowToken(false);
    setCopiedToken(false);
    setFormError("");
    setFormOpen(true);
  };

  const closeFormModal = () => {
    if (submitting) return;
    setFormOpen(false);
    setFormError("");
    setEditingItem(null);
    setShowToken(false);
    setCopiedToken(false);
  };

  const validateForm = () => {
    const name = normalizeText(formData.name);
    const token = normalizeText(formData.token);

    if (!name) {
      return "Please enter integration name.";
    }

    if (name.length < 2) {
      return "Integration name must be at least 2 characters.";
    }

    if (!token) {
      return "Please enter token.";
    }

    if (token.length < 6) {
      return "Token must be at least 6 characters.";
    }

    return "";
  };

  const handleCopyToken = async () => {
    const token = normalizeText(formData.token);
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(true);
      window.setTimeout(() => setCopiedToken(false), 1500);
    } catch (err) {
      console.error("copy token error:", err);
    }
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const payload = {
        name: normalizeText(formData.name),
        token: normalizeText(formData.token),
      };

      if (formMode === "create") {
        const res = await CreateAppLineMaster(payload);

        if (!res?.data) {
          setFormError("Failed to create integration.");
          return;
        }

        setItems((prev) => [res.data, ...prev]);
        setFormOpen(false);
        setShowToken(false);
        return;
      }

      if (!editingItem?.id) {
        setFormError("Missing integration ID.");
        return;
      }

      const res = await UpdateAppLineMasterByID(editingItem.id, payload);

      if (!res?.data) {
        setFormError("Failed to update integration.");
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? res.data : item))
      );
      setFormOpen(false);
      setShowToken(false);
    } catch (err) {
      console.error("handleSubmit error:", err);
      setFormError(
        formMode === "create"
          ? "Failed to create integration."
          : "Failed to update integration."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (item: AppLineMasterResponse) => {
    setDeleteTarget(item);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      setDeleteError("Missing integration ID.");
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const res = await DeleteAppLineMasterByID(deleteTarget.id);

      if (!res) {
        setDeleteError("Failed to delete integration.");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("handleDelete error:", err);
      setDeleteError("Failed to delete integration.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <section
        className={[
          "relative h-full overflow-hidden rounded-[28px] p-4 sm:p-5 md:p-6",
          "bg-white border border-gray-200/80 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.20)]",
          "dark:bg-[#08111f]/95 dark:border-white/10 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-none",
          "flex flex-col",
        ].join(" ")}
      >
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

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[12px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                <FiSettings className="text-[13px]" />
                Integration Management
              </div>

              <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-slate-900 sm:text-[28px] dark:text-white">
                All Integrations & Apps
              </h2>

              <p className="mt-1 text-[13px] text-slate-500 sm:text-[14px] dark:text-white/55">
                Connect all channels to leverage the best performance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-60 flex-1 sm:flex-none sm:w-80">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/35" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search integrations..."
                  className={[
                    "w-full h-11 rounded-2xl pl-10 pr-4 text-[13px] outline-none transition",
                    "border border-gray-200 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-200",
                    "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:ring-cyan-400/10",
                  ].join(" ")}
                />
              </div>

              <button
                type="button"
                onClick={() => loadAppLineMasters(true)}
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
                onClick={openCreateModal}
                className={[
                  "inline-flex h-11 items-center gap-2 rounded-2xl px-4 transition",
                  "bg-cyan-600 text-white hover:bg-cyan-700",
                  "dark:bg-cyan-500 dark:hover:bg-cyan-400",
                ].join(" ")}
              >
                <FiPlus />
                Add Integration
              </button>

              <div className="inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1 dark:border-white/10 dark:bg-white/5">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={[
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl transition",
                    viewMode === "list"
                      ? "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white"
                      : "text-slate-500 hover:bg-slate-50 dark:text-white/55 dark:hover:bg-white/10",
                  ].join(" ")}
                  title="List view"
                >
                  <FiList />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={[
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl transition",
                    viewMode === "grid"
                      ? "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-white"
                      : "text-slate-500 hover:bg-slate-50 dark:text-white/55 dark:hover:bg-white/10",
                  ].join(" ")}
                  title="Grid view"
                >
                  <FiGrid />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 flex-1 flex flex-col">
            {loading ? (
              <div className="flex h-full flex-1 items-center justify-center rounded-3xl border border-gray-200/80 bg-white/70 px-6 py-14 text-center dark:border-white/10 dark:bg-white/3">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                    <FiRefreshCw className="animate-spin text-[22px]" />
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold text-slate-900 dark:text-white/85">
                    Loading integrations...
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                    Please wait while we load your integration list.
                  </p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex h-full flex-1 items-center justify-center rounded-3xl border border-gray-200/80 bg-white/70 px-6 py-14 text-center dark:border-white/10 dark:bg-white/3">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                    <FiAlertCircle className="text-[22px]" />
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold text-slate-900 dark:text-white/85">
                    No integrations found
                  </h3>
                  <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                    Try adjusting your search or add a new integration.
                  </p>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid h-full content-start grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={[
                      "group relative overflow-hidden rounded-[26px] border p-5 transition",
                      "bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.22)] hover:-translate-y-0.5",
                      "border-gray-200/80 dark:border-white/10 dark:bg-white/4 dark:shadow-none",
                    ].join(" ")}
                  >
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-br ${item.accent}`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={[
                            "grid h-14 w-14 place-items-center rounded-2xl border text-[24px]",
                            item.iconWrapClass,
                          ].join(" ")}
                        >
                          {item.icon}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                items.find((x) => x.id === item.id) as AppLineMasterResponse
                              )
                            }
                            className={[
                              "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition",
                              "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50",
                              "dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
                            ].join(" ")}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                items.find((x) => x.id === item.id) as AppLineMasterResponse
                              )
                            }
                            className={[
                              "inline-flex h-10 w-10 items-center justify-center rounded-2xl transition",
                              "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
                              "dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15",
                            ].join(" ")}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      <div className="mt-5">
                        <h3 className="text-[22px] font-semibold tracking-tight text-slate-900 dark:text-white">
                          {item.name}
                        </h3>

                        <div
                          className={[
                            "mt-2 inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-medium",
                            item.chipClass,
                          ].join(" ")}
                        >
                          {item.category}
                        </div>

                        <p className="mt-4 text-[14px] leading-7 text-slate-500 dark:text-white/55">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          className={[
                            "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-[14px] font-medium transition",
                            item.buttonClass,
                          ].join(" ")}
                        >
                          <FiZap />
                          Connect
                        </button>

                        <div className="inline-flex items-center gap-1 text-[12px] text-slate-400 dark:text-white/35">
                          <FiCheckCircle />
                          Ready
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white/70 dark:border-white/10 dark:bg-white/3">
                {filteredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={[
                      "px-4 py-4 transition-colors sm:px-6",
                      idx !== filteredItems.length - 1
                        ? "border-b border-gray-200/70 dark:border-white/10"
                        : "",
                      "hover:bg-gray-50 dark:hover:bg-white/4",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div
                          className={[
                            "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border text-[24px]",
                            item.iconWrapClass,
                          ].join(" ")}
                        >
                          {item.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white">
                              {item.name}
                            </h3>

                            <span
                              className={[
                                "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-medium",
                                item.chipClass,
                              ].join(" ")}
                            >
                              {item.category}
                            </span>
                          </div>

                          <p className="mt-2 text-[14px] leading-7 text-slate-500 dark:text-white/55">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className={[
                            "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-[14px] font-medium transition",
                            item.buttonClass,
                          ].join(" ")}
                        >
                          <FiZap />
                          Connect
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              items.find((x) => x.id === item.id) as AppLineMasterResponse
                            )
                          }
                          className={[
                            "inline-flex h-10 w-10 items-center justify-center rounded-xl transition",
                            "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50",
                            "dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
                          ].join(" ")}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openDeleteModal(
                              items.find((x) => x.id === item.id) as AppLineMasterResponse
                            )
                          }
                          className={[
                            "inline-flex h-10 w-10 items-center justify-center rounded-xl transition",
                            "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
                            "dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15",
                          ].join(" ")}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {formOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeFormModal}
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
            aria-label="Close form modal overlay"
          />

          <div
            className={[
              "relative z-10 w-full max-w-2xl rounded-[18px] border border-gray-200 bg-white px-5 py-5 shadow-[0_20px_70px_rgba(15,23,42,0.18)]",
              "dark:border-white/10 dark:bg-[#0d1524]",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={closeFormModal}
              disabled={submitting}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-white/45 dark:hover:text-white/70"
              aria-label="Close"
            >
              <FiX className="text-[20px]" />
            </button>

            <div className="flex justify-center pt-2">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300">
                {formMode === "create" ? (
                  <FiPlus className="text-[28px]" />
                ) : (
                  <FiEdit2 className="text-[26px]" />
                )}
              </div>
            </div>

            <h3 className="mt-4 text-center text-[24px] font-semibold text-slate-800 dark:text-white">
              {formMode === "create" ? "Create Integration" : "Update Integration"}
            </h3>

            <p className="mx-auto mt-2 max-w-130 text-center text-[14px] leading-6 text-slate-500 dark:text-white/55">
              {formMode === "create"
                ? "Add a new integration card to your management page."
                : "Edit the selected integration information."}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-700 dark:text-white/75">
                  Integration Name
                </label>
                <div className="relative">
                  <FiLink2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/35" />
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Slack, Google Meet, LINE Notify"
                    className={[
                      "w-full h-12 rounded-2xl border pl-10 pr-4 text-[14px] outline-none transition",
                      "border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-200",
                      "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:ring-cyan-400/10",
                    ].join(" ")}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-700 dark:text-white/75">
                  Token
                </label>

                <div className="relative">
                  <FiZap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/35" />

                  <input
                    type={showToken ? "text" : "password"}
                    value={formData.token}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, token: e.target.value }))
                    }
                    placeholder="Enter token"
                    className={[
                      "w-full h-12 rounded-2xl border pl-10 pr-24 text-[14px] outline-none transition",
                      "border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-cyan-200",
                      "dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:placeholder:text-white/35 dark:focus:ring-cyan-400/10",
                    ].join(" ")}
                  />

                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-xl transition",
                        "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                        "dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white/80",
                      ].join(" ")}
                      title="Copy token"
                    >
                      <FiCopy />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowToken((prev) => !prev)}
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-xl transition",
                        "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                        "dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white/80",
                      ].join(" ")}
                      title={showToken ? "Hide token" : "Show token"}
                    >
                      {showToken ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {copiedToken && (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                      Copied token
                    </span>
                  )}
                </div>
              </div>

              {formError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-white/45">
                  Preview
                </p>

                <div className="mt-3 flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                    {getMetaByName(formData.name).icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold text-slate-900 dark:text-white">
                      {normalizeText(formData.name) || "Integration Name"}
                    </p>
                    <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                      {getCategoryFromName(formData.name)}
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-slate-500 dark:text-white/55">
                      {getDescriptionFromName(formData.name)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={[
                  "min-w-35 rounded-xl px-4 py-2.5 text-[15px] font-medium transition",
                  "bg-cyan-600 text-white hover:bg-cyan-700",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  "dark:bg-cyan-500 dark:hover:bg-cyan-400",
                ].join(" ")}
              >
                {submitting
                  ? formMode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : formMode === "create"
                  ? "Create"
                  : "Update"}
              </button>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={submitting}
                className={[
                  "min-w-35 rounded-xl px-4 py-2.5 text-[15px] font-medium transition",
                  "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  "dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
                ].join(" ")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && deleteTarget && (
        <div className="fixed inset-0 z-210 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
            aria-label="Close delete modal overlay"
          />

          <div
            className={[
              "relative z-10 w-full max-w-xl rounded-[18px] border border-gray-200 bg-white px-5 py-5 shadow-[0_20px_70px_rgba(15,23,42,0.18)]",
              "dark:border-white/10 dark:bg-[#0d1524]",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleting}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-white/45 dark:hover:text-white/70"
              aria-label="Close"
            >
              <FiX className="text-[20px]" />
            </button>

            <div className="flex justify-center pt-2">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300">
                <FiTrash2 className="text-[28px]" />
              </div>
            </div>

            <h3 className="mt-4 text-center text-[24px] font-semibold text-slate-800 dark:text-white">
              Delete Integration
            </h3>

            <p className="mx-auto mt-3 max-w-105 text-center text-[14px] leading-6 text-slate-500 dark:text-white/55">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700 dark:text-white/80">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-red-200 bg-red-50 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                  {getMetaByName(deleteTarget.name).icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-slate-800 dark:text-white">
                    {deleteTarget.name}
                  </p>
                  <p className="mt-1 text-[13px] text-slate-500 dark:text-white/55">
                    {getCategoryFromName(deleteTarget.name)}
                  </p>
                  <p className="mt-2 text-[13px] leading-6 text-slate-500 dark:text-white/55">
                    {getDescriptionFromName(deleteTarget.name)}
                  </p>
                </div>
              </div>
            </div>

            {deleteError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={[
                  "min-w-35 rounded-xl px-4 py-2.5 text-[15px] font-medium transition",
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
                  "min-w-35 rounded-xl px-4 py-2.5 text-[15px] font-medium transition",
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