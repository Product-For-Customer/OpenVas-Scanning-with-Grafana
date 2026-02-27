import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Notification, UserProfile } from ".";
import { useStateContext } from "../../contexts/ContextProvider";

import { FiSearch, FiSettings } from "react-icons/fi";
import { LuClock3 } from "react-icons/lu";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";

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
      className={[
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-[19px] transition-colors",
        "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
        "dark:text-white/75 dark:hover:bg-white/10 dark:active:bg-white/15",
        className,
      ].join(" ")}
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full"
        />
      )}

      {typeof badgeCount === "number" && badgeCount > 0 && (
        <span
          className={[
            "absolute -right-1 -top-1 min-w-4.5 h-4.5 px-1",
            "inline-flex items-center justify-center rounded-full",
            "bg-[#6f5be8] text-white text-[10px] font-bold leading-none",
          ].join(" ")}
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}

      {icon}
    </button>
  </TooltipComponent>
);

const Navbar: React.FC = () => {
  const {
    //@ts-ignore
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
    currentMode,
    toggleMode,
  } = useStateContext();

  const [firstnameUser] = useState<string>("Alex");
  const [profileError, setProfileError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (typeof screenSize === "number") setActiveMenu(screenSize > 900);
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

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
      className={["sticky top-0 z-30 w-full", "bg-transparent", "dark:bg-transparent"].join(" ")}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="px-3 sm:px-4 md:px-5 pt-3 pb-3">
        <div
          className={[
            "w-full h-21 sm:h-22 rounded-[22px] flex items-center justify-between overflow-hidden",
            "bg-white border border-gray-200/80 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)]",
            "dark:bg-white/5 dark:border-white/10 dark:ring-1 dark:ring-white/10 dark:shadow-none",
          ].join(" ")}
        >
          {/* Left */}
          <div className="flex items-center gap-3 sm:gap-4 pl-4 sm:pl-5 min-w-0 flex-1">
            <TooltipComponent content={activeMenu ? "Hide menu" : "Open menu"} position="BottomCenter">
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={handleActiveMenu}
                className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                  "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
                  "dark:text-white/75 dark:hover:bg-white/10 dark:active:bg-white/15",
                ].join(" ")}
              >
                <AiOutlineMenu className="text-[21px]" />
              </button>
            </TooltipComponent>

            {/* Search desktop */}
            <div
              className={[
                "hidden sm:flex items-center h-12 w-full max-w-90 lg:max-w-95 rounded-full px-4",
                "border border-gray-200 bg-[#f5f6fa]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
                "dark:border-white/10 dark:bg-white/5 dark:shadow-none",
              ].join(" ")}
            >
              <FiSearch className="text-gray-400 dark:text-white/40 text-[18px] mr-3 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className={[
                  "flex-1 bg-transparent outline-none border-none text-[14px]",
                  "text-gray-700 placeholder:text-gray-400",
                  "dark:text-white/80 dark:placeholder:text-white/35",
                ].join(" ")}
                aria-label="Search"
              />
              <span className="ml-3 hidden md:inline-flex items-center text-[12px] font-medium text-gray-400 dark:text-white/35 whitespace-nowrap">
                ⌘ + k
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center h-full shrink-0">
            <div className="flex items-center gap-1 px-2 sm:px-3 md:px-4">
              <NavButton title="Recent activity" icon={<LuClock3 />} onClick={() => {}} />

              {/* ✅ Toggle Theme */}
              <NavButton
                title={currentMode === "Dark" ? "Light mode" : "Dark mode"}
                aria-label="Toggle theme"
                onClick={toggleMode}
                icon={currentMode === "Dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
              />

              <NavButton title="Settings" icon={<FiSettings />} onClick={() => {}} />

              <NavButton
                title="Notifications"
                aria-label="Open notifications"
                badgeCount={0}
                dotColor="#9ca3af"
                onClick={() => handleClick("notification")}
                icon={<RiNotification3Line />}
              />

              <TooltipComponent content="Language" position="BottomCenter">
                <button
                  type="button"
                  className={[
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                    "hover:bg-gray-100 active:bg-gray-200",
                    "dark:hover:bg-white/10 dark:active:bg-white/15",
                  ].join(" ")}
                  aria-label="Language"
                >
                  <span className="text-[22px] leading-none">🇺🇸</span>
                </button>
              </TooltipComponent>
            </div>

            <div className="h-full w-px bg-gray-200/90 dark:bg-white/10" />

            <div className="px-3 sm:px-4">
              <TooltipComponent content="Profile" position="BottomCenter">
                <button
                  type="button"
                  onClick={() => handleClick("userProfile")}
                  className={[
                    "group flex items-center gap-2 sm:gap-3 rounded-2xl px-2 sm:px-3 py-2 transition-colors max-w-[44vw] sm:max-w-none",
                    "hover:bg-gray-100 active:bg-gray-200",
                    "dark:hover:bg-white/10 dark:active:bg-white/15",
                  ].join(" ")}
                  aria-label="Open profile"
                >
                  <img
                    src={avatarSrc}
                    alt="user"
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200 bg-white dark:ring-white/15 dark:bg-white/10"
                    onError={() => setProfileError(true)}
                  />
                  <span className="hidden sm:block text-[14px] font-semibold text-gray-700 dark:text-white/80 truncate max-w-22.5 md:max-w-30">
                    {firstnameUser}...
                  </span>
                  <MdKeyboardArrowDown className="hidden sm:block text-gray-400 dark:text-white/45 group-hover:text-gray-600 dark:group-hover:text-white/70 text-[20px]" />
                </button>
              </TooltipComponent>
            </div>
          </div>
        </div>

        {/* Search mobile */}
        <div className="sm:hidden mt-2">
          <div
            className={[
              "flex items-center h-11 rounded-2xl px-3 border",
              "border-gray-200 bg-[#f5f6fa]",
              "dark:border-white/10 dark:bg-white/5",
            ].join(" ")}
          >
            <FiSearch className="text-gray-400 dark:text-white/40 text-[17px] mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-[14px] text-gray-700 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/35"
              aria-label="Search mobile"
            />
          </div>
        </div>
      </div>

      {isClicked.notification && <Notification />}
      {isClicked.userProfile && <UserProfile />}
    </header>
  );
};

export default Navbar;