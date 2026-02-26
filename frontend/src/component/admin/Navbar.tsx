import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Notification, UserProfile } from ".";
import { useStateContext } from "../../contexts/ContextProvider";

// เพิ่มไอคอนให้ใกล้ภาพตัวอย่าง
import { FiSearch, FiSettings } from "react-icons/fi";
import { LuClock3 } from "react-icons/lu";
import { HiOutlineMoon } from "react-icons/hi2";

/* ---------- ปุ่มเมนู/ไอคอน ---------- */
type NavBtnProps = {
  title: string;
  onClick?: () => void;
  icon: React.ReactNode;
  dotColor?: string;
  badgeCount?: number;
  className?: string;
  "aria-label"?: string;
};

const NavButton: React.FC<NavBtnProps> = ({
  title,
  onClick,
  icon,
  dotColor,
  badgeCount,
  className = "",
  "aria-label": ariaLabel,
}) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      aria-label={ariaLabel ?? title}
      onClick={onClick}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl
        text-[19px] text-gray-500 hover:bg-white active:bg-gray-100
        transition-colors ${className}`}
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full"
        />
      )}

      {typeof badgeCount === "number" && badgeCount > 0 && (
        <span
          className="absolute -right-1 -top-1 min-w-4.5 h-4.5 px-1
            inline-flex items-center justify-center rounded-full
            bg-[#6f5be8] text-white text-[10px] font-bold leading-none"
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}

      {icon}
    </button>
  </TooltipComponent>
);

/* -------------------------- Navbar -------------------------- */
const Navbar: React.FC = () => {
  const {
    //@ts-ignore
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  // ✅ ไม่เรียก service แล้ว ใช้ข้อมูลตกแต่งแทน
  const [firstnameUser] = useState<string>("Alex");
  const [profileError, setProfileError] = useState(false);
  const [search, setSearch] = useState("");

  /* ✅ Handle responsive resizing only */
  useEffect(() => {
    const onResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (typeof screenSize === "number") {
      setActiveMenu(screenSize > 900);
    }
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  // ✅ Avatar แบบตกแต่ง (ไม่มี service)
  const fallbackAvatar = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
          <defs>
            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stop-color='#f8fafc'/>
              <stop offset='100%' stop-color='#e2e8f0'/>
            </linearGradient>
          </defs>
          <rect width='100%' height='100%' rx='14' ry='14' fill='url(#g)'/>
          <circle cx='32' cy='24' r='10' fill='#94a3b8'/>
          <path d='M16 50c2-8 10-12 16-12s14 4 16 12' fill='#94a3b8'/>
        </svg>
      `),
    []
  );

  const avatarSrc = profileError ? fallbackAvatar : fallbackAvatar;

  return (
    <header
      className="sticky top-0 z-30 w-full bg-[#efefef]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Outer spacing ให้เหมือนภาพ */}
      <div className="px-3 sm:px-4 md:px-5 pt-3 pb-3">
        {/* Container หลักโค้งใหญ่ */}
        <div
          className="
            w-full h-21 sm:h-22
            rounded-[22px]
            bg-white
            border border-gray-200/80
            shadow-sm
            flex items-center justify-between
            overflow-hidden
          "
        >
          {/* Left area */}
          <div className="flex items-center gap-3 sm:gap-4 pl-4 sm:pl-5 min-w-0 flex-1">
            {/* Menu */}
            <TooltipComponent content={activeMenu ? "Hide menu" : "Open menu"} position="BottomCenter">
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={handleActiveMenu}
                className="
                  inline-flex h-10 w-10 items-center justify-center
                  rounded-xl text-gray-500 hover:bg-white active:bg-gray-100
                  transition-colors
                "
              >
                <AiOutlineMenu className="text-[21px]" />
              </button>
            </TooltipComponent>

            {/* Search box (เหมือนรูป) */}
            <div
              className="
                hidden sm:flex items-center
                h-12
                w-full max-w-90 lg:max-w-95
                rounded-full
                border border-gray-200
                bg-[#fbfbfc]
                px-4
                shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
              "
            >
              <FiSearch className="text-gray-400 text-[18px] mr-3 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="
                  flex-1 bg-transparent outline-none border-none
                  text-[14px] text-gray-700 placeholder:text-gray-400
                "
                aria-label="Search"
              />

              <span className="ml-3 hidden md:inline-flex items-center text-[12px] font-medium text-gray-400 whitespace-nowrap">
                ⌘ + k
              </span>
            </div>
          </div>

          {/* Right area */}
          <div className="flex items-center h-full shrink-0">
            {/* Quick icons */}
            <div className="flex items-center gap-1 px-2 sm:px-3 md:px-4">
              <NavButton
                title="Recent activity"
                icon={<LuClock3 />}
                onClick={() => {}}
                aria-label="Recent activity"
              />

              <NavButton
                title="Theme"
                icon={<HiOutlineMoon />}
                onClick={() => {}}
                aria-label="Theme"
              />

              <NavButton
                title="Settings"
                icon={<FiSettings />}
                onClick={() => {}}
                aria-label="Settings"
              />

              <NavButton
                title="Notifications"
                aria-label="Open notifications"
                badgeCount={0}
                dotColor="#9ca3af"
                onClick={() => handleClick("notification")}
                icon={<RiNotification3Line />}
              />

              {/* Flag button */}
              <TooltipComponent content="Language" position="BottomCenter">
                <button
                  type="button"
                  className="
                    inline-flex h-10 w-10 items-center justify-center rounded-xl
                    hover:bg-white active:bg-gray-100 transition-colors
                  "
                  aria-label="Language"
                >
                  <span className="text-[22px] leading-none">🇺🇸</span>
                </button>
              </TooltipComponent>
            </div>

            {/* Divider ก่อน profile */}
            <div className="h-full w-px bg-gray-200/90" />

            {/* Profile area */}
            <div className="px-3 sm:px-4">
              <TooltipComponent content="Profile" position="BottomCenter">
                <button
                  type="button"
                  onClick={() => handleClick("userProfile")}
                  className="
                    group flex items-center gap-2 sm:gap-3 rounded-2xl
                    px-2 sm:px-3 py-2
                    hover:bg-white active:bg-gray-100
                    transition-colors
                    max-w-[44vw] sm:max-w-none
                  "
                  aria-label="Open profile"
                >
                  <img
                    src={avatarSrc}
                    alt="user"
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200 bg-white"
                    onError={() => setProfileError(true)}
                  />

                  {/* ชื่อแบบในรูป */}
                  <span className="hidden sm:block text-[14px] font-semibold text-gray-700 truncate max-w-22.5 md:max-w-30">
                    {firstnameUser}...
                  </span>

                  <MdKeyboardArrowDown className="hidden sm:block text-gray-400 group-hover:text-gray-600 text-[20px]" />
                </button>
              </TooltipComponent>
            </div>
          </div>
        </div>

        {/* Search mobile */}
        <div className="sm:hidden mt-2">
          <div
            className="
              flex items-center h-11 rounded-2xl border border-gray-200 bg-[#f7f7f8]
              px-3
            "
          >
            <FiSearch className="text-gray-400 text-[17px] mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-400"
              aria-label="Search mobile"
            />
          </div>
        </div>
      </div>

      {/* Panels */}
      {isClicked.notification && <Notification />}
      {isClicked.userProfile && <UserProfile />}
    </header>
  );
};

export default Navbar;