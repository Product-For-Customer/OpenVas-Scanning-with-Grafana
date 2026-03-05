import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { type JSX, useMemo, useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  FiSettings,
  FiLogOut,
  FiShield,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

type UserProfileItem = {
  icon: JSX.Element;
  title: string;
  desc: string;
  iconColor: string;
  iconBg: string;
  link?: string;
  action?: "logout" | "navigate";
};

const userProfileData: UserProfileItem[] = [
  {
    icon: <FiSettings />,
    title: "Settings",
    desc: "ตั้งค่าระบบ / integrations",
    iconColor: "#06b6d4",
    iconBg: "#ecfeff",
    link: "/admin/profile",
    action: "navigate",
  },
  {
    icon: <FiLogOut />,
    title: "Logout",
    desc: "ออกจากระบบ",
    iconColor: "#dc2626",
    iconBg: "#fff1f2",
    action: "logout",
  },
];

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const ctx = useStateContext() as any;
  const isClicked = ctx?.isClicked;
  const setIsClicked = ctx?.setIsClicked;

  const [open, setOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isClicked?.userProfile) setOpen(true);
  }, [isClicked?.userProfile]);

  const close = () => {
    if (typeof setIsClicked === "function") {
      setIsClicked((prev: any) => ({ ...(prev || {}), userProfile: false }));
    }
    setOpen(false);
  };

  const avatarFallback = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#dbeafe'/>
              <stop offset='100%' stop-color='#c4b5fd'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' rx='18' fill='url(#g)'/>
          <circle cx='80' cy='62' r='24' fill='#475569'/>
          <path d='M38 126c7-20 24-30 42-30s35 10 42 30' fill='#475569'/>
          <text x='50%' y='150' dominant-baseline='middle' text-anchor='middle'
            font-size='12' fill='#334155' font-family='Arial'>SEC OPS</text>
        </svg>
      `),
    []
  );

  const profileSrc = user?.profile?.trim() ? user.profile : avatarFallback;
  const fullName = `${user?.first_name || "Guest"} ${user?.last_name || "User"}`.trim();
  const roleName = user?.role || "Viewer";
  const email = user?.email || "guest@example.com";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      close();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      close();
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  const handleItemClick = async (item: UserProfileItem) => {
    if (item.action === "logout") {
      await handleLogout();
      return;
    }

    close();
    if (item.link) {
      navigate(item.link);
    }
  };

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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 right-4 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-gray-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 via-sky-500 to-violet-500 text-white shadow-sm">
            <FiUser className="text-[18px]" />
          </span>

          <div>
            <p className="text-[14px] font-semibold text-gray-800 dark:text-white/90">
              User Profile
            </p>
            <p className="text-[12px] text-gray-500 dark:text-white/50">
              Security analyst profile
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close user profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-colors text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:text-white/70 dark:hover:bg-white/10 dark:active:bg-white/15"
        >
          <MdOutlineCancel className="text-[20px]" />
        </button>
      </div>

      {/* Hero */}
      <div className="relative z-10 px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-200/70 bg-linear-to-br from-cyan-50 via-white to-violet-50 p-4 dark:border-cyan-400/15 dark:from-cyan-500/10 dark:via-white/4 dark:to-violet-500/10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative flex gap-4 items-center">
            <div className="relative shrink-0">
              <img
                className="h-18 w-18 rounded-3xl object-cover ring-1 ring-gray-200 bg-white dark:ring-white/10 dark:bg-white/10"
                src={profileSrc}
                alt="user-profile"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = avatarFallback;
                }}
              />
              <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-[#08111f]" />
            </div>

            <div className="min-w-0">
              <p className="text-[18px] font-semibold text-gray-900 dark:text-white/90 truncate">
                {fullName}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  <FiShield className="mr-1" />
                  {roleName}
                </span>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                  Analyst Access
                </span>
              </div>

              <p className="mt-2 text-[12px] text-gray-500 dark:text-white/55 truncate">
                {email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 px-4 pb-4 pt-3">
        <div className="rounded-3xl overflow-hidden border border-gray-200/80 bg-white dark:border-white/10 dark:bg-white/4">
          {userProfileData.map((item: UserProfileItem, idx: number) => (
            <button
              key={idx}
              onClick={() => void handleItemClick(item)}
              disabled={loggingOut}
              className={[
                "w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left",
                "hover:bg-gray-50 dark:hover:bg-white/6",
                idx !== 0 ? "border-t border-gray-200/80 dark:border-white/10" : "",
                loggingOut ? "opacity-70 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-xl shrink-0"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              >
                {item.icon}
              </span>

              <div className="text-left min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white/85 truncate">
                  {item.action === "logout" && loggingOut ? "Logging out..." : item.title}
                </p>
                <p className="text-[12px] text-gray-500 dark:text-white/55 truncate">
                  {item.desc}
                </p>
              </div>

              <FiChevronRight className="text-gray-400 dark:text-white/35 shrink-0" />
            </button>
          ))}
        </div>

        <div className="px-1 pt-3">
          <p className="text-[11px] text-gray-400 dark:text-white/35">
            Tip: ตรวจสอบ Tasks / Reports / Findings หลังการสแกนเสมอ
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;