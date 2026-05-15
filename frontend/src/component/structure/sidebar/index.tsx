import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineCancel, MdKeyboardArrowDown } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { getLinks, type SidebarSection } from "./data";
import { useStateContext } from "../../../contexts/ProviderContext";
import { useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/argus-logo-real.png";
import argusWordmark from "../../../assets/argus-font-sidebar.png";
import { message } from "antd";
import { RiDoorOpenLine } from "react-icons/ri";

type SidebarLink = {
  name: string;
  icon?: React.ReactNode;
  badge?: string;
};

type TooltipPosition =
  | "Top"
  | "TopCenter"
  | "BottomCenter"
  | "RightCenter"
  | "LeftCenter";

type SimpleTooltipProps = {
  content: string;
  position?: TooltipPosition;
  children: React.ReactNode;
};

const EXPANDED_WIDTH = 272;
const COLLAPSED_WIDTH = 88;
const DESKTOP_BREAKPOINT = 900;
const TABLET_MIN = 768;
const TABLET_MAX = 1024;
const MINI_MENU_CLOSE_DELAY = 180;

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  position,
  children,
}) => {
  void content;
  void position;

  return <>{children}</>;
};

const getAdminLinkPath = (linkName: string) => `/admin/${linkName}`;

const safeDecodePath = (pathname: string) => {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
};

const normalizePath = (pathname: string) =>
  safeDecodePath(pathname).replace(/\/+$/, "").toLowerCase();

const isSamePath = (currentPath: string, targetPath: string) =>
  normalizePath(currentPath) === normalizePath(targetPath);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isAdmin } = useAuth();
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const [menuLinks, setMenuLinks] = useState<SidebarSection[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [activeMiniSection, setActiveMiniSection] = useState<string | null>(
    null
  );
  const [loggingOut, setLoggingOut] = useState(false);

  const miniCloseTimerRef = useRef<number | null>(null);

  const currentScreen =
    typeof screenSize === "number" ? screenSize : window.innerWidth;

  const isDesktop = currentScreen > DESKTOP_BREAKPOINT;
  const isTablet = currentScreen >= TABLET_MIN && currentScreen <= TABLET_MAX;
  const isExpanded = !!activeMenu;

  const sidebarShellRadiusClass = isExpanded
    ? "rounded-[28px]"
    : "rounded-[18px]";

  const sidebarInnerRingRadiusClass = isExpanded
    ? "rounded-[27px]"
    : "rounded-[17px]";

  const collapsedButtonRadiusClass = isExpanded
    ? "rounded-2xl"
    : "rounded-[14px]";

  const collapsedIconRadiusClass = isExpanded
    ? "rounded-xl"
    : "rounded-[10px]";

  const argusWordmarkSizeClass =
    isDesktop && !isTablet ? "h-[22px]" : isTablet ? "h-[15px]" : "h-[16px]";

  const sidebarWidth = useMemo(() => {
    if (!isDesktop) return "88vw";
    return isExpanded ? `${EXPANDED_WIDTH}px` : `${COLLAPSED_WIDTH}px`;
  }, [isDesktop, isExpanded]);

  const clearMiniCloseTimer = () => {
    if (miniCloseTimerRef.current) {
      window.clearTimeout(miniCloseTimerRef.current);
      miniCloseTimerRef.current = null;
    }
  };

  const openMiniSection = (title: string) => {
    clearMiniCloseTimer();
    setActiveMiniSection(title);
  };

  const scheduleCloseMiniSection = (title?: string) => {
    clearMiniCloseTimer();

    miniCloseTimerRef.current = window.setTimeout(() => {
      setActiveMiniSection((prev) => {
        if (title && prev !== title) return prev;
        return null;
      });

      miniCloseTimerRef.current = null;
    }, MINI_MENU_CLOSE_DELAY);
  };

  const handleCloseSideBar = () => {
    clearMiniCloseTimer();
    setActiveMiniSection(null);

    if (typeof screenSize === "number" && screenSize <= DESKTOP_BREAKPOINT) {
      setActiveMenu(false);
    }
  };

  useEffect(() => {
    try {
      const data = getLinks({ isAdmin });
      const safeData = Array.isArray(data) ? data : [];

      setMenuLinks(safeData);

      const nextOpen: Record<string, boolean> = {};

      safeData.forEach((section: SidebarSection) => {
        const hasActiveChild = section.links?.some((link) =>
          isSamePath(location.pathname, getAdminLinkPath(link.name))
        );

        nextOpen[section.title] = !!hasActiveChild;
      });

      setOpenSections(nextOpen);
      clearMiniCloseTimer();
      setActiveMiniSection(null);
    } catch (error) {
      console.error("Failed to load sidebar links:", error);
      setMenuLinks([]);
      clearMiniCloseTimer();
      setActiveMiniSection(null);
    }
  }, [location.pathname, isAdmin]);

  useEffect(() => {
    if (isExpanded) {
      clearMiniCloseTimer();
      setActiveMiniSection(null);
    }
  }, [isExpanded]);

  useEffect(() => {
    return () => {
      clearMiniCloseTimer();
    };
  }, []);

  const toggleSection = (title: string) => {
    if (isDesktop && !isExpanded) return;
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleMiniSection = (title: string) => {
    clearMiniCloseTimer();
    setActiveMiniSection((prev) => (prev === title ? null : title));
  };

  const isLinkActive = (linkName: string) =>
    isSamePath(location.pathname, getAdminLinkPath(linkName));

  const formatLabel = useMemo(
    () => (value: string) => {
      if (!value) return "";
      return value
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (s) => s.toUpperCase());
    },
    []
  );

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      clearMiniCloseTimer();
      setActiveMiniSection(null);
      await logout();
      message.success("logout success");
      handleCloseSideBar();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("logout failed");
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  if (!isDesktop && !activeMenu) return null;

  return (
    <>
      <style>
        {`
          @keyframes argusLogoFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-3px) scale(1.01);
            }
          }

          @keyframes argusLogoGlow {
            0%, 100% {
              opacity: 0.28;
              transform: scale(0.96);
            }
            50% {
              opacity: 0.58;
              transform: scale(1.05);
            }
          }

          @keyframes argusPulseRingOne {
            0% {
              opacity: 0;
              transform: scale(0.74);
            }
            18% {
              opacity: 0.34;
            }
            46% {
              opacity: 0.16;
            }
            100% {
              opacity: 0;
              transform: scale(1.36);
            }
          }

          @keyframes argusPulseRingTwo {
            0% {
              opacity: 0;
              transform: scale(0.82);
            }
            20% {
              opacity: 0.24;
            }
            44% {
              opacity: 0.12;
            }
            100% {
              opacity: 0;
              transform: scale(1.48);
            }
          }

          @keyframes argusScanLine {
            0% {
              opacity: 0;
              transform: translateX(-16px) rotate(-16deg);
            }
            20% {
              opacity: 0.34;
            }
            80% {
              opacity: 0.12;
            }
            100% {
              opacity: 0;
              transform: translateX(16px) rotate(-16deg);
            }
          }

          @keyframes argusHorizontalBeam {
            0% {
              opacity: 0;
              transform: translateX(-10px) scaleX(0.85);
            }
            25% {
              opacity: 0.26;
            }
            75% {
              opacity: 0.10;
            }
            100% {
              opacity: 0;
              transform: translateX(10px) scaleX(1.06);
            }
          }

          @keyframes argusInnerArc {
            0%, 100% {
              opacity: 0.16;
              transform: scale(0.98) rotate(0deg);
            }
            50% {
              opacity: 0.34;
              transform: scale(1.03) rotate(8deg);
            }
          }

          @keyframes argusDotTwinkle {
            0%, 100% {
              opacity: 0.18;
              transform: scale(1);
            }
            50% {
              opacity: 0.82;
              transform: scale(1.2);
            }
          }

          @keyframes argusDotFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2px);
            }
          }

          @keyframes sidebarShimmer {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }
            22% {
              opacity: 0.26;
            }
            100% {
              transform: translateX(130%);
              opacity: 0;
            }
          }

          @keyframes sidebarMiniModalIn {
            0% {
              opacity: 0;
              transform: translateX(-8px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateX(0px) scale(1);
            }
          }
        `}
      </style>

      {!isExpanded && activeMiniSection && (
        <div
          className="fixed inset-0 z-35 bg-transparent"
          onClick={() => {
            clearMiniCloseTimer();
            setActiveMiniSection(null);
          }}
        />
      )}

      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          activeMenu ? "opacity-100" : "pointer-events-none opacity-0"
        } bg-[#020817]/35 dark:bg-black/45`}
        onClick={handleCloseSideBar}
      />

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 h-dvh",
          "bg-transparent dark:bg-transparent",
          "transform-gpu will-change-[width,transform]",
          "transition-[width,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        ].join(" ")}
        style={{
          width: sidebarWidth,
          height: "100dvh",
          maxHeight: "100dvh",
          maxWidth: isDesktop ? undefined : "320px",
          padding: isDesktop ? "10px" : isTablet ? "10px 8px 8px 8px" : "14px",
          paddingTop: isTablet
            ? "max(env(safe-area-inset-top), 8px)"
            : "max(env(safe-area-inset-top), 12px)",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      >
        <div
          className={[
            "relative flex h-full max-h-full min-h-0 flex-col",
            sidebarShellRadiusClass,
            "overflow-visible",
            "border border-gray-200/80 bg-white/92 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.35)] backdrop-blur",
            "dark:border-white/10 dark:bg-[#08111f]/88 dark:ring-1 dark:ring-cyan-400/10 dark:shadow-none",
          ].join(" ")}
        >
          <div
            className={[
              "pointer-events-none absolute inset-0 overflow-hidden",
              sidebarShellRadiusClass,
            ].join(" ")}
          >
            <div className="absolute inset-x-5 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/55 to-transparent" />
            <div
              className={[
                "absolute inset-px ring-1 ring-white/45 dark:ring-white/5",
                sidebarInnerRingRadiusClass,
              ].join(" ")}
            />
            <div className="absolute -top-12 right-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-0 -left-10 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
          </div>

          <div
            className={`relative z-10 flex shrink-0 items-center ${
              isExpanded
                ? isTablet
                  ? "justify-between px-3 pb-2 pt-3"
                  : "justify-between px-3.5 pb-3 pt-4.5"
                : "justify-center px-2 pb-3 pt-4.5"
            }`}
          >
            <Link
              to="/admin"
              onClick={handleCloseSideBar}
              className={`select-none ${
                isExpanded
                  ? "flex items-center gap-3"
                  : "flex items-center justify-center"
              }`}
              aria-label="Go to dashboard"
            >
              <div
                className={`group relative flex shrink-0 items-center justify-center overflow-visible ${
                  isTablet ? "h-13 w-13" : "h-16 w-16"
                }`}
              >
                <span
                  className="pointer-events-none absolute inset-2 rounded-full bg-cyan-400/15 blur-lg dark:bg-cyan-400/20"
                  style={{
                    animation: "argusLogoGlow 3.9s ease-in-out infinite",
                  }}
                />

                <span
                  className="pointer-events-none absolute inset-2.5 rounded-full border border-cyan-300/18 border-dashed"
                  style={{
                    animation: "argusInnerArc 3.4s ease-in-out infinite",
                  }}
                />

                <span
                  className="pointer-events-none absolute inset-1.25 rounded-full border border-cyan-400/32"
                  style={{
                    animation: "argusPulseRingOne 2.2s ease-out infinite",
                  }}
                />

                <span
                  className="pointer-events-none absolute inset-0.75 rounded-full border border-sky-300/22"
                  style={{
                    animation: "argusPulseRingTwo 2.2s ease-out 0.7s infinite",
                  }}
                />

                <span
                  className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-b from-transparent via-cyan-300/45 to-transparent blur-[5px] ${
                    isTablet ? "h-9 w-2.5" : "h-11 w-3"
                  }`}
                  style={{
                    animation: "argusScanLine 2.4s ease-in-out infinite",
                  }}
                />

                <span
                  className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-transparent via-cyan-300/34 to-transparent blur-[1px] ${
                    isTablet ? "h-0.5 w-9" : "h-0.5 w-11"
                  }`}
                  style={{
                    animation: "argusHorizontalBeam 2.8s ease-in-out infinite",
                  }}
                />

                <span
                  className="pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300/90 blur-[1px]"
                  style={{
                    animation:
                      "argusDotTwinkle 2s ease-in-out infinite, argusDotFloat 2.6s ease-in-out infinite",
                  }}
                />

                <span
                  className="pointer-events-none absolute bottom-2 left-2 h-1 w-1 rounded-full bg-sky-300/85 blur-[1px]"
                  style={{
                    animation:
                      "argusDotTwinkle 2.2s ease-in-out 0.55s infinite, argusDotFloat 2.9s ease-in-out 0.2s infinite",
                  }}
                />

                <div
                  className={`relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.04] group-hover:rotate-3 ${
                    isTablet ? "h-13 w-13" : "h-16 w-16"
                  }`}
                  style={{
                    animation: "argusLogoFloat 4.2s ease-in-out infinite",
                    willChange: "transform",
                  }}
                >
                  <img
                    src={logo}
                    alt="Logo"
                    className={`object-contain drop-shadow-[0_8px_18px_rgba(34,211,238,0.14)] transition-all duration-300 group-hover:drop-shadow-[0_10px_22px_rgba(34,211,238,0.22)] ${
                      isTablet ? "h-18 w-18" : "h-24 w-24"
                    }`}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="min-w-0">
                  <img
                    src={argusWordmark}
                    alt="Argus"
                    className={`block w-auto object-contain drop-shadow-[0_5px_12px_rgba(59,130,246,0.18)] dark:drop-shadow-[0_5px_14px_rgba(34,211,238,0.26)] ${argusWordmarkSizeClass}`}
                  />

                  <span
                    className={`block text-gray-500 dark:text-white/45 ${
                      isTablet ? "text-[10px]" : "text-[10.5px]"
                    }`}
                  >
                    Vulnerability Monitoring
                  </span>
                </div>
              )}
            </Link>

            {isExpanded && !isDesktop && (
              <SimpleTooltip content="Close menu" position="BottomCenter">
                <button
                  type="button"
                  onClick={() => setActiveMenu(false)}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  className={[
                    isTablet ? "rounded-xl p-1.5" : "rounded-xl p-2",
                    "transition-colors",
                    "text-gray-600 hover:bg-gray-200/70 active:bg-gray-300/70",
                    "dark:text-white/70 dark:hover:bg-white/10 dark:active:bg-white/15",
                    "focus:outline-none focus:ring-0",
                  ].join(" ")}
                  aria-label="Close menu"
                >
                  <MdOutlineCancel
                    className={isTablet ? "text-[20px]" : "text-xl"}
                  />
                </button>
              </SimpleTooltip>
            )}
          </div>

          <nav
            className={`relative z-10 min-h-0 flex-1 ${
              isExpanded
                ? isTablet
                  ? "overflow-y-auto overflow-x-hidden px-2 pb-1"
                  : "overflow-y-auto overflow-x-hidden px-2.5 pb-2"
                : "overflow-visible px-2 pb-2"
            }`}
          >
            <div
              className={
                isExpanded
                  ? isTablet
                    ? "space-y-1"
                    : "space-y-1.5"
                  : "space-y-2.5"
              }
            >
              {menuLinks.map((section) => {
                const isOpen = !!openSections[section.title];
                const isMiniOpen = activeMiniSection === section.title;

                const hasActiveChild =
                  section.links?.some((link: SidebarLink) =>
                    isLinkActive(link.name)
                  ) ?? false;

                const sectionIcon = (section as SidebarSection & {
                  icon?: React.ReactNode;
                }).icon ?? (
                  <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70" />
                );

                if (isExpanded) {
                  return (
                    <div key={section.title} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title)}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                        className={[
                          "flex w-full items-center justify-between rounded-2xl text-left transition-all duration-200",
                          isTablet ? "px-3 py-2" : "px-3.5 py-2.75",
                          isOpen
                            ? "bg-linear-to-r from-cyan-500 via-sky-500 to-violet-500 text-white shadow-[0_12px_24px_-18px_rgba(56,189,248,0.88)]"
                            : hasActiveChild
                              ? "bg-white text-[#1f2937] shadow-[0_8px_18px_-16px_rgba(15,23,42,0.22)] dark:bg-white/5 dark:text-white/90"
                              : "bg-transparent text-[#4b4f63] hover:bg-gray-50 dark:text-white/70 dark:hover:bg-white/8",
                          "focus:outline-none focus:ring-0",
                        ].join(" ")}
                        aria-expanded={isOpen}
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <span
                            className={[
                              "inline-flex items-center justify-center rounded-xl transition-all duration-200",
                              isTablet
                                ? "h-7 w-7 text-[14px]"
                                : "h-8 w-8 text-[15px]",
                              isOpen
                                ? "bg-white/18 text-white ring-1 ring-white/18"
                                : hasActiveChild
                                  ? "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-400/10"
                                  : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-white/55",
                            ].join(" ")}
                          >
                            {sectionIcon}
                          </span>

                          <div className="min-w-0">
                            <span
                              className={`block truncate font-medium ${
                                isTablet ? "text-[13px]" : "text-[14px]"
                              }`}
                            >
                              {formatLabel(section.title)}
                            </span>

                            <span
                              className={[
                                "block truncate",
                                isTablet ? "text-[9.5px]" : "text-[10px]",
                                isOpen
                                  ? "text-white/70"
                                  : "text-slate-400 dark:text-white/34",
                              ].join(" ")}
                            >
                              {section.links?.length ?? 0} items
                            </span>
                          </div>
                        </div>

                        <MdKeyboardArrowDown
                          className={[
                            "transition-transform",
                            isTablet ? "text-[18px]" : "text-[19px]",
                            isOpen ? "rotate-0" : "-rotate-90",
                            isOpen
                              ? "text-white"
                              : "text-gray-500 dark:text-white/55",
                          ].join(" ")}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen
                            ? isTablet
                              ? "max-h-44 pb-0.5 pt-1 opacity-100"
                              : "max-h-55 pb-0.5 pt-1 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div
                          className={
                            isTablet
                              ? "space-y-1 pl-5 pr-1.5"
                              : "space-y-1 pl-5.5 pr-2"
                          }
                        >
                          {section.links?.map((link: SidebarLink) => {
                            const active = isLinkActive(link.name);

                            return (
                              <NavLink
                                to={getAdminLinkPath(link.name)}
                                key={`${section.title}-${link.name}`}
                                onClick={handleCloseSideBar}
                                className={[
                                  "group relative flex items-center justify-between gap-2 overflow-hidden rounded-xl transition-all duration-200",
                                  isTablet ? "px-2.5 py-1.75" : "px-3 py-2.25",
                                  active
                                    ? "bg-cyan-50 font-semibold text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-400/10"
                                    : "text-[#585b6b] hover:bg-white hover:text-[#2b2f45] dark:text-white/60 dark:hover:bg-white/8 dark:hover:text-white/85",
                                ].join(" ")}
                              >
                                {active && (
                                  <span className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-linear-to-b from-cyan-500 to-violet-500" />
                                )}

                                <div className="min-w-0 flex items-center gap-2.5">
                                  <span
                                    className={[
                                      "inline-flex shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                                      isTablet
                                        ? "h-6.5 w-6.5 text-[13px]"
                                        : "h-7 w-7 text-[14px]",
                                      active
                                        ? "bg-white text-cyan-600 shadow-sm dark:bg-white/10 dark:text-cyan-300"
                                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-white/6 dark:text-white/55 dark:group-hover:bg-white/10",
                                    ].join(" ")}
                                  >
                                    {link.icon ?? (
                                      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                                    )}
                                  </span>

                                  <span
                                    className={
                                      isTablet
                                        ? "truncate text-[12.5px]"
                                        : "truncate text-[13px]"
                                    }
                                  >
                                    {formatLabel(link.name)}
                                  </span>
                                </div>

                                {link.badge && (
                                  <span
                                    className={`ml-2 shrink-0 rounded-full bg-linear-to-r from-cyan-500 to-violet-500 font-semibold text-white shadow-[0_8px_18px_-14px_rgba(59,130,246,0.95)] ${
                                      isTablet
                                        ? "px-2 py-0.5 text-[9px]"
                                        : "px-2.5 py-0.5 text-[10px]"
                                    }`}
                                  >
                                    {link.badge}
                                  </span>
                                )}
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={section.title}
                    className="relative"
                    onMouseEnter={() => openMiniSection(section.title)}
                    onMouseLeave={() => scheduleCloseMiniSection(section.title)}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleMiniSection(section.title);
                      }}
                      onFocus={() => openMiniSection(section.title)}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                      className={[
                        "flex h-12 w-full items-center justify-center border transition-all duration-200",
                        collapsedButtonRadiusClass,
                        isMiniOpen || hasActiveChild
                          ? "border-cyan-200/70 bg-linear-to-r from-cyan-500 via-sky-500 to-violet-500 text-white shadow-[0_10px_18px_-14px_rgba(56,189,248,0.85)] dark:border-cyan-400/20"
                          : "border-transparent bg-[#eef3f8] text-gray-500 hover:border-slate-200 hover:bg-gray-50 dark:bg-white/8 dark:text-white/60 dark:hover:border-white/10 dark:hover:bg-white/10",
                        "focus:outline-none focus:ring-0",
                      ].join(" ")}
                      aria-label={formatLabel(section.title)}
                      aria-expanded={isMiniOpen}
                    >
                      <span
                        className={[
                          "inline-flex h-8.5 w-8.5 items-center justify-center text-[18px] transition-all duration-200",
                          collapsedIconRadiusClass,
                          isMiniOpen || hasActiveChild
                            ? "bg-white/15 text-white"
                            : "text-gray-500 dark:text-white/60",
                        ].join(" ")}
                      >
                        {sectionIcon}
                      </span>
                    </button>

                    {isMiniOpen && (
                      <div
                        className="absolute left-[calc(100%+12px)] top-0 z-70 w-64 origin-left"
                        style={{
                          animation: "sidebarMiniModalIn 160ms ease-out both",
                        }}
                        onMouseEnter={() => openMiniSection(section.title)}
                        onMouseLeave={() =>
                          scheduleCloseMiniSection(section.title)
                        }
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="absolute -left-3 top-0 h-full w-3 bg-transparent" />

                        <div className="overflow-hidden rounded-[18px] border border-gray-200 bg-white shadow-[0_18px_42px_-22px_rgba(15,23,42,0.5)] ring-1 ring-white/70 backdrop-blur dark:border-white/10 dark:bg-[#0B1220] dark:ring-white/5 dark:shadow-none">
                          <div className="relative overflow-hidden bg-linear-to-r from-cyan-500 via-sky-500 to-violet-500 px-4 py-3 text-white">
                            <span
                              className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-white/18 to-transparent skew-x-[-20deg]"
                              style={{
                                animation:
                                  "sidebarShimmer 2.8s ease-in-out infinite",
                              }}
                            />

                            <div className="relative flex items-center gap-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/16 text-[16px] ring-1 ring-white/15">
                                {sectionIcon}
                              </span>

                              <div className="min-w-0">
                                <span className="block truncate text-[14px] font-semibold">
                                  {formatLabel(section.title)}
                                </span>
                                <span className="block text-[10px] text-white/72">
                                  {section.links?.length ?? 0} menu items
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="max-h-[58vh] overflow-y-auto py-2">
                            {section.links?.length ? (
                              section.links.map((link: SidebarLink) => {
                                const active = isLinkActive(link.name);

                                return (
                                  <NavLink
                                    key={`${section.title}-${link.name}-mini-click`}
                                    to={getAdminLinkPath(link.name)}
                                    onClick={() => {
                                      clearMiniCloseTimer();
                                      setActiveMiniSection(null);
                                      handleCloseSideBar();
                                    }}
                                    className={[
                                      "group flex items-center justify-between gap-2 px-4 py-2.5 text-[13px] transition-colors",
                                      active
                                        ? "bg-cyan-50 font-semibold text-cyan-700 dark:bg-white/8 dark:text-cyan-300"
                                        : "text-[#4f5366] hover:bg-gray-50 dark:text-white/65 dark:hover:bg-white/8",
                                    ].join(" ")}
                                  >
                                    <div className="min-w-0 flex items-center gap-3">
                                      <span
                                        className={[
                                          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[14px] transition-all duration-200",
                                          active
                                            ? "bg-white text-cyan-600 shadow-sm dark:bg-white/10 dark:text-cyan-300"
                                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-white/6 dark:text-white/55 dark:group-hover:bg-white/10",
                                        ].join(" ")}
                                      >
                                        {link.icon ?? (
                                          <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                                        )}
                                      </span>

                                      <span className="truncate">
                                        {formatLabel(link.name)}
                                      </span>
                                    </div>

                                    {link.badge && (
                                      <span className="ml-3 shrink-0 rounded-full bg-linear-to-r from-cyan-500 to-violet-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                                        {link.badge}
                                      </span>
                                    )}
                                  </NavLink>
                                );
                              })
                            ) : (
                              <div className="px-4 py-5 text-center text-[12px] text-slate-400 dark:text-white/45">
                                No menu items
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          <div
            className={`relative z-10 shrink-0 ${
              isExpanded
                ? isTablet
                  ? "px-2 pb-2 pt-1"
                  : "px-2.5 pb-3 pt-1"
                : "px-2 pb-3 pt-1"
            }`}
          >
            {isExpanded ? (
              <div className="rounded-2xl bg-linear-to-r from-cyan-500/14 via-sky-500/8 to-violet-500/14 p-px">
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={loggingOut}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  className={[
                    "group relative flex w-full items-center justify-between overflow-hidden rounded-[15px] transition-all duration-300",
                    isTablet ? "px-2.5 py-2" : "px-3 py-2.25",
                    "bg-white text-[#303446] hover:bg-slate-50 dark:bg-[#0b1322] dark:text-white/82 dark:hover:bg-[#101a2d]",
                    loggingOut ? "cursor-not-allowed opacity-70" : "",
                    "focus:outline-none focus:ring-0",
                  ].join(" ")}
                  aria-label="Logout"
                >
                  <span
                    className="pointer-events-none absolute inset-y-0 left-[-20%] w-[34%] bg-linear-to-r from-transparent via-cyan-200/35 to-transparent opacity-0 skew-x-[-18deg] transition-opacity duration-300 group-hover:opacity-100 dark:via-cyan-300/10"
                    style={{
                      animation: loggingOut
                        ? "none"
                        : "sidebarShimmer 2.8s ease-in-out infinite",
                    }}
                  />

                  <div
                    className={`relative z-10 flex items-center ${
                      isTablet ? "gap-2" : "gap-2.5"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-violet-500 text-white shadow-[0_10px_18px_-14px_rgba(59,130,246,0.85)] transition-transform duration-300 group-hover:scale-[1.03] ${
                        isTablet ? "h-7 w-7" : "h-8 w-8"
                      }`}
                    >
                      <RiDoorOpenLine
                        className={isTablet ? "text-[14px]" : "text-[15px]"}
                      />
                    </span>

                    <div className="text-left leading-tight">
                      <span
                        className={`block font-semibold ${
                          isTablet ? "text-[11.5px]" : "text-[12.5px]"
                        }`}
                      >
                        {loggingOut ? "Logging out..." : "Logout"}
                      </span>
                      <span
                        className={`block text-slate-500 dark:text-white/45 ${
                          isTablet ? "text-[8.5px]" : "text-[9.5px]"
                        }`}
                      >
                        End session
                      </span>
                    </div>
                  </div>

                  <FiLogOut
                    className={`relative z-10 text-slate-400 transition-colors duration-300 group-hover:text-cyan-600 dark:text-white/45 dark:group-hover:text-cyan-300 ${
                      isTablet ? "text-[13px]" : "text-[14px]"
                    }`}
                  />
                </button>
              </div>
            ) : (
              <SimpleTooltip
                content={loggingOut ? "Logging out..." : "Logout"}
                position="RightCenter"
              >
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={loggingOut}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  className={[
                    "flex h-12 w-full items-center justify-center border transition-all duration-200",
                    "rounded-[14px]",
                    "border-transparent bg-[#eef3f8] text-gray-500 hover:border-cyan-100 hover:bg-linear-to-r hover:from-cyan-50 hover:to-violet-50 hover:text-cyan-700",
                    "dark:bg-white/8 dark:text-white/60 dark:hover:border-white/10 dark:hover:bg-white/10 dark:hover:text-cyan-300",
                    loggingOut ? "cursor-not-allowed opacity-70" : "",
                    "focus:outline-none focus:ring-0",
                  ].join(" ")}
                  aria-label="Logout"
                >
                  <FiLogOut className="text-[18px]" />
                </button>
              </SimpleTooltip>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;