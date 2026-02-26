import { MdOutlineCancel } from "react-icons/md";
import { Button } from ".";
import { useNavigate } from "react-router-dom";
import { userProfileData } from "./dummy";
import { type JSX, useMemo } from "react";

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
    UserRole?: {
      RoleName?: string;
    };
  };
};

// ✅ Mock data แทน service / login
const mockEmployee: MockEmployee = {
  User: {
    FirstName: "Guest",
    LastName: "User",
    Email: "guest@example.com",
    Profile: "", // ใส่ URL รูปจริงได้ถ้าต้องการ
    UserRole: {
      RoleName: "Viewer",
    },
  },
};

const UserProfile = () => {
  const navigate = useNavigate();

  const avatarFallback = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#eef2ff'/>
              <stop offset='100%' stop-color='#dbeafe'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' rx='18' fill='url(#g)'/>
          <circle cx='80' cy='62' r='24' fill='#60a5fa'/>
          <path d='M38 126c7-20 24-30 42-30s35 10 42 30' fill='#60a5fa'/>
        </svg>
      `),
    []
  );

  const profileSrc = mockEmployee?.User?.Profile?.trim()
    ? mockEmployee.User.Profile
    : avatarFallback;

  return (
    <div
      className="
        fixed right-3 top-16 z-50
        w-[calc(100vw-24px)] max-w-sm
        rounded-2xl overflow-hidden
        bg-white
        border border-gray-100
        shadow-[0_12px_36px_rgba(37,99,235,0.15)]
      "
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
    >
      {/* Header */}
      <div className="relative">
        <div className="bg-linear-to-br from-blue-600 to-blue-500 h-12" />
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <p className="text-white text-sm font-semibold">User Profile</p>
          <Button
            icon={<MdOutlineCancel />}
            color="#ffffff"
            bgHoverColor="rgba(255,255,255,0.15)"
            size="2xl"
            borderRadius="50%"
          />
        </div>
      </div>

      {/* Header Card */}
      <div className="px-4 pt-4 pb-3 bg-white">
        <div className="flex gap-4 items-center">
          <img
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-100 bg-blue-50"
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
            <p className="text-[12px] text-blue-700 font-medium">
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
        <div className="rounded-xl overflow-hidden border border-gray-100 bg-white">
          {userProfileData.map((item: UserProfileItem, idx: number) => (
            <button
              key={idx}
              onClick={() => navigate(item.link)}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-blue-50 transition-colors"
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
      </div>
    </div>
  );
};

export default UserProfile;