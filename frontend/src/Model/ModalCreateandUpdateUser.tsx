import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiBriefcase,
  FiChevronDown,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUpload,
  FiUser,
  FiX,
} from "react-icons/fi";
import { message } from "antd";
import { ListRoles, UpdateUserIDByAdmin, CreateUser } from "../services";

type UiUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: string;
  phone_number: string;
  location: string;
  position: string;
  role: "Admin" | "User" | string;
};

type RoleResponse = {
  id: number;
  role: string;
};

type ModalCreateandUpdateUserProps = {
  open: boolean;
  user: UiUser | null;
  onClose: () => void;
  onUpdated: () => void;
};

type Payload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profile: string;
  phone_number: string;
  location: string;
  position: string;
  app_role_id: number | "";
};

const EMPTY_FORM: Payload = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  profile: "",
  phone_number: "",
  location: "",
  position: "",
  app_role_id: "",
};

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const getRoleBadgeClass = (role: string) => {
  if (role === "Admin") {
    return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200";
  }

  return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200";
};

const isBase64DataImage = (v: string) => {
  const s = (v || "").trim();
  return /^data:image\/(png|jpe?g|gif|webp|bmp|svg\+xml);base64,/i.test(s);
};

const ModalCreateandUpdateUser: React.FC<ModalCreateandUpdateUserProps> = ({
  open,
  user,
  onClose,
  onUpdated,
}) => {
  const isEditMode = !!user;

  const [formData, setFormData] = useState<Payload>(EMPTY_FORM);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const fetchedRolesRef = useRef(false);

  const fullName = useMemo(() => {
    return `${formData.first_name} ${formData.last_name}`.trim() || "User";
  }, [formData.first_name, formData.last_name]);

  const selectedRoleName = useMemo(() => {
    const found = roles.find((r) => r.id === Number(formData.app_role_id));
    return found?.role || "";
  }, [roles, formData.app_role_id]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await ListRoles();

      if (!data) {
        setRoles([]);
        return;
      }

      setRoles(data);
    } catch (err) {
      console.error("ListRoles error:", err);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    if (fetchedRolesRef.current) return;

    fetchedRolesRef.current = true;
    fetchRoles();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (isEditMode && user) {
      const matchedRole = roles.find(
        (r) => r.role.toLowerCase() === String(user.role || "").toLowerCase()
      );

      setFormData({
        email: user.email ?? "",
        password: "",
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        profile: user.profile ?? "",
        phone_number: user.phone_number ?? "",
        location: user.location ?? "",
        position: user.position ?? "",
        app_role_id: matchedRole?.id ?? "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }

    setSubmitting(false);
    setUploadingImage(false);
    setError("");
  }, [open, isEditMode, user, roles]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      const numericOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phone_number: numericOnly,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "app_role_id" ? (value ? Number(value) : "") : value,
    }));
  };

  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const base64 = await toBase64(file);
      setFormData((prev) => ({
        ...prev,
        profile: base64,
      }));
    } catch (err) {
      console.error("Upload image error:", err);
      message.error("Upload image failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) return "Please enter first name";
    if (!formData.last_name.trim()) return "Please enter last name";
    if (!formData.email.trim()) return "Please enter email";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format";

    if (!isEditMode && !formData.password.trim()) {
      return "Please enter password";
    }

    if (!formData.phone_number.trim()) return "Please enter phone number";
    if (formData.phone_number.length !== 10) return "Phone must be 10 digits";
    if (!formData.location.trim()) return "Please enter location";
    if (!formData.position.trim()) return "Please enter position";
    if (!formData.app_role_id) return "Please select role";

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      let res: any;

      if (isEditMode && user) {
        const payload = {
          email: formData.email.trim(),
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          profile: formData.profile || "",
          phone_number: formData.phone_number.trim(),
          location: formData.location.trim(),
          position: formData.position.trim(),
          app_role_id: Number(formData.app_role_id),
        };

        res = await UpdateUserIDByAdmin(user.id, payload);
      } else {
        const payload = {
          email: formData.email.trim(),
          password: formData.password.trim(),
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          profile: formData.profile || "",
          phone_number: formData.phone_number.trim(),
          location: formData.location.trim(),
          position: formData.position.trim(),
          app_role_id: Number(formData.app_role_id),
        };

        res = await CreateUser(payload);
      }

      if (!res) {
        setError(isEditMode ? "Update user failed" : "Create user failed");
        return;
      }

      if (res.error) {
        setError(res.error);
        return;
      }

      message.success(
        res.message || (isEditMode ? "Update success" : "Create success")
      );
      onUpdated();
    } catch (err: any) {
      console.error("Submit user error:", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          (isEditMode ? "Update user failed" : "Create user failed")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center bg-slate-900/25 px-3 py-4 backdrop-blur-[2px]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close modal overlay"
      />

      <div
        className={[
          "relative max-h-[90vh] w-full max-w-135 overflow-y-auto rounded-[18px]",
          "border border-slate-200/80 bg-white px-4 py-4",
          "shadow-[0_20px_60px_rgba(15,23,42,0.12)]",
          "dark:border-white/10 dark:bg-[#0f172a]",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-3 top-3 inline-flex h-7.5 w-7.5 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white/80"
          aria-label="Close modal"
        >
          <FiX className="text-[14px]" />
        </button>

        <div className="mb-3 flex items-center gap-2.5 pr-8">
          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/8 dark:text-white/80">
            <FiUser className="text-[14px]" />
          </div>

          <div>
            <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-white">
              {isEditMode ? "Edit User" : "Create User"}
            </h3>
            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-white/50">
              Compact user account form
            </p>
          </div>
        </div>

        {error ? (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[10.5px] text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-[140px_1fr]">
            <div>
              <label className="mb-1.5 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                Profile
              </label>

              <div className="rounded-[14px] border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col items-center text-center">
                  {formData.profile && isBase64DataImage(formData.profile) ? (
                    <img
                      src={formData.profile}
                      alt="Profile Preview"
                      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-white/40">
                      <FiUser className="text-[20px]" />
                    </div>
                  )}

                  <p className="mt-2 text-[10.5px] font-semibold text-slate-800 dark:text-white">
                    {fullName}
                  </p>
                  <p className="mt-0.5 break-all text-[9.5px] text-slate-500 dark:text-white/50">
                    {formData.email || "No email"}
                  </p>

                  <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/8">
                    <FiUpload className="text-[11px]" />
                    {uploadingImage ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                  First Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    className="h-8.5 w-full rounded-xl border border-slate-300 bg-white pl-8.5 pr-3 text-[10.5px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/15 dark:focus:ring-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                  Last Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="h-8.5 w-full rounded-xl border border-slate-300 bg-white pl-8.5 pr-3 text-[10.5px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/15 dark:focus:ring-white/10"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="h-8.5 w-full rounded-xl border border-slate-300 bg-white pl-8.5 pr-3 text-[10.5px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/15 dark:focus:ring-white/10"
                  />
                </div>
              </div>

              {!isEditMode && (
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                    Password
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="h-8.5 w-full rounded-xl border border-slate-300 bg-white pl-8.5 pr-3 text-[10.5px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/15 dark:focus:ring-white/10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="h-8.5 w-full rounded-xl border border-slate-300 bg-white pl-8.5 pr-3 text-[10.5px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/15 dark:focus:ring-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                  Location
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="h-8.5 w-full rounded-xl border border-slate-300 bg-white pl-8.5 pr-3 text-[10.5px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/15 dark:focus:ring-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                  Position
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400" />
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Position"
                    className="h-8.5 w-full rounded-xl border border-slate-300 bg-white pl-8.5 pr-3 text-[10.5px] text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/15 dark:focus:ring-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10.5px] font-medium text-slate-700 dark:text-white/80">
                  Role
                </label>

                <div className="relative">
                  <FiShield className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[11px] text-slate-400" />
                  <select
                    name="app_role_id"
                    value={formData.app_role_id}
                    onChange={handleChange}
                    disabled={loadingRoles}
                    className={[
                      "h-8.5 w-full appearance-none rounded-xl border bg-white pl-8.5 pr-9 text-[10.5px] font-medium text-slate-900 outline-none transition-all",
                      "border-slate-300 hover:border-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200/70",
                      "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
                      "dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:disabled:bg-white/5 dark:disabled:text-white/35 dark:focus:border-white/15 dark:focus:ring-white/10",
                    ].join(" ")}
                  >
                    <option value="">
                      {loadingRoles ? "Loading roles..." : "Select role"}
                    </option>

                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role}
                      </option>
                    ))}
                  </select>

                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-500 dark:text-white/55" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-slate-500 dark:text-white/45">
                      Current role:
                    </span>

                    {selectedRoleName ? (
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                          getRoleBadgeClass(selectedRoleName),
                        ].join(" ")}
                      >
                        {selectedRoleName === "Admin" ? (
                          <FiShield className="mr-1.5 text-[10px]" />
                        ) : (
                          <FiUser className="mr-1.5 text-[10px]" />
                        )}
                        {selectedRoleName}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-white/35">
                        No role selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex h-8.5 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/8"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={[
                "inline-flex h-8.5 items-center justify-center rounded-xl px-3.5 text-[10.5px] font-medium text-white transition",
                "bg-slate-900 hover:bg-slate-800",
                "dark:bg-white dark:text-slate-900 dark:hover:bg-white/90",
                submitting ? "cursor-not-allowed opacity-70" : "",
              ].join(" ")}
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update User"
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateandUpdateUser;