// UserProfile.tsx
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { type JSX, useMemo, useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";

// ✅ ถ้าคุณมี dummy เดิมอยู่ ใช้ต่อได้เลย
// import { userProfileData } from "./dummy";

// ✅ หรือจะทำ mock actions แนว network scanning ให้เข้าธีมก็ได้
import {
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

type UserProfileItem = {
  icon: JSX.Element;
  title: string;
  desc: string;
  iconColor: string;
  iconBg: string;
  link: string;
};

type MockEmployee = {
  User?: {
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Profile?: string;
    UserRole?: { RoleName?: string };
  };
};

// ✅ Mock data แทน service / login
const mockEmployee: MockEmployee = {
  User: {
    FirstName: "Guest",
    LastName: "User",
    Email: "guest@example.com",
    Profile: "",
    UserRole: { RoleName: "Viewer" },
  },
};

// ✅ mock เมนูแนว Network Scanning (ถ้าคุณอยากใช้ของเดิม ให้ลบอันนี้แล้ว import userProfileData)
const userProfileData: UserProfileItem[] = [
  {
    icon: <FiSettings />,
    title: "Settings",
    desc: "ตั้งค่าระบบ / integrations",
    iconColor: "#111827",
    iconBg: "#e5e7eb",
    link: "/admin/Profile",
  },
  {
    icon: <FiLogOut />,
    title: "Logout",
    desc: "ออกจากระบบ",
    iconColor: "#b91c1c",
    iconBg: "#ffe4e6",
    link: "/",
  },
];

const UserProfile = () => {
  const navigate = useNavigate();

  // ✅ ปิดได้จริงเหมือน Notification
  const ctx = useStateContext() as any;
  const isClicked = ctx?.isClicked;
  const setIsClicked = ctx?.setIsClicked;

  const [open, setOpen] = useState(true);

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
              <stop offset='0%' stop-color='#f8fafc'/>
              <stop offset='100%' stop-color='#e2e8f0'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' rx='18' fill='url(#g)'/>
          <circle cx='80' cy='62' r='24' fill='#94a3b8'/>
          <path d='M38 126c7-20 24-30 42-30s35 10 42 30' fill='#94a3b8'/>
          <text x='50%' y='150' dominant-baseline='middle' text-anchor='middle'
            font-size='12' fill='#64748b' font-family='Arial'>SEC OPS</text>
        </svg>
      `),
    []
  );

  const profileSrc = mockEmployee?.User?.Profile?.trim()
    ? mockEmployee.User.Profile
    : avatarFallback;

  if (!open) return null;

  return (
    <div
      className={[
        "fixed right-3 top-16 z-50",
        "w-[calc(100vw-24px)] max-w-sm",
        "rounded-[22px] overflow-hidden",
        // ✅ modal ขาวเหมือนเดิม (ไม่ตาม dark)
        "bg-white border border-gray-200/80 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)]",
      ].join(" ")}
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200/80">
        <p className="text-[13px] font-semibold text-gray-800">User Profile</p>

        <button
          type="button"
          onClick={close}
          aria-label="Close user profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        >
          <MdOutlineCancel className="text-[20px]" />
        </button>
      </div>

      {/* Header Card */}
      <div className="px-4 pt-4 pb-3 bg-white">
        <div className="flex gap-4 items-center">
          <img
            className="h-16 w-16 rounded-2xl object-cover ring-1 ring-gray-200 bg-white"
            src={profileSrc}
            alt="user-profile"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = avatarFallback;
            }}
          />
          <div className="min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {mockEmployee?.User?.FirstName || "Guest"}{" "}
              {mockEmployee?.User?.LastName || "User"}
            </p>
            <p className="text-[12px] text-[#6f5be8] font-semibold">
              {mockEmployee?.User?.UserRole?.RoleName ?? "Viewer"}
            </p>
            <p className="text-[12px] text-gray-500 truncate">
              {mockEmployee?.User?.Email || "guest@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 pb-3 bg-white">
        <div className="rounded-2xl overflow-hidden border border-gray-200/80 bg-white">
          {userProfileData.map((item: UserProfileItem, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                close(); // ✅ คลิกแล้วปิดให้เนียนเหมือน dropdown
                navigate(item.link);
              }}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors"
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-xl"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              >
                {item.icon}
              </span>

              <div className="text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-[12px] text-gray-500 truncate">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer small hint */}
        <div className="px-2 pt-3">
          <p className="text-[11px] text-gray-400">
            Tip: ตรวจสอบ Tasks/Reports หลังการสแกนเสมอ
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;