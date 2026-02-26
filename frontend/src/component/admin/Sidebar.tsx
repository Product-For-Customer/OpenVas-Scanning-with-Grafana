import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdOutlineCancel, MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { FiLogOut } from "react-icons/fi";
import { getLinks } from "./dummy";
import { useStateContext } from "../../contexts/ContextProvider";

type SidebarLink = {
  name: string;
  icon?: React.ReactNode;
  badge?: string;
};

type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

/** ✅ ปรับตรงนี้: ทำให้ sidebar แคบลงเหมือนรูปตัวอย่าง */
const EXPANDED_WIDTH = 300;   // เดิม 380 -> แนะนำ 280-310
const COLLAPSED_WIDTH = 84;   // เดิม 96  -> ให้ดูมินิลง
const DESKTOP_BREAKPOINT = 900;

const Sidebar: React.FC = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const location = useLocation();

  const [menuLinks, setMenuLinks] = useState<SidebarSection[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const hoverCloseTimer = useRef<number | null>(null);

  const isDesktop =
    typeof screenSize === "number" ? screenSize > DESKTOP_BREAKPOINT : true;

  const isExpanded = isDesktop ? !!activeMenu : !!activeMenu;

  const handleCloseSideBar = () => {
    if (typeof screenSize === "number" && screenSize <= DESKTOP_BREAKPOINT) {
      setActiveMenu(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getLinks();
        const safeData = Array.isArray(data) ? data : [];
        if (!mounted) return;

        setMenuLinks(safeData);

        const nextOpen: Record<string, boolean> = {};
        safeData.forEach((section: SidebarSection, index: number) => {
          const hasActiveChild = section.links?.some((link) =>
            location.pathname.includes(`/admin/${link.name}`)
          );
          nextOpen[section.title] = hasActiveChild || index === 0;
        });
        setOpenSections(nextOpen);
      } catch (error) {
        console.error("Failed to load sidebar links:", error);
        if (!mounted) return;
        setMenuLinks([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (isDesktop && isExpanded) {
      setHoveredSection(null);
    }
  }, [isDesktop, isExpanded]);

  useEffect(() => {
    return () => {
      if (hoverCloseTimer.current) {
        window.clearTimeout(hoverCloseTimer.current);
      }
    };
  }, []);

  const openHoverPopup = (title: string) => {
    if (hoverCloseTimer.current) {
      window.clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setHoveredSection(title);
  };

  const closeHoverPopupWithDelay = (title: string) => {
    if (hoverCloseTimer.current) {
      window.clearTimeout(hoverCloseTimer.current);
    }

    hoverCloseTimer.current = window.setTimeout(() => {
      setHoveredSection((prev) => (prev === title ? null : prev));
      hoverCloseTimer.current = null;
    }, 120);
  };

  const toggleSection = (title: string) => {
    if (isDesktop && !isExpanded) return;

    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isLinkActive = (linkName: string) => {
    return location.pathname === `/admin/${linkName}`;
  };

  const formatLabel = useMemo(
    () => (value: string) => {
      if (!value) return "";
      return value
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (s) => s.toUpperCase());
    },
    []
  );

  if (!isDesktop && !activeMenu) return null;

  return (
    <>
      {/* Backdrop เฉพาะมือถือ */}
      <div
        className={`fixed inset-0 z-30 bg-black/20 transition-opacity md:hidden ${
          activeMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleCloseSideBar}
      />

      <aside
        className="
          fixed inset-y-0 left-0 z-40
          h-screen
          bg-[#efefef]
          shadow-xl md:shadow-none
          transition-all duration-300
        "
        style={{
          width: isDesktop
            ? isExpanded
              ? `${EXPANDED_WIDTH}px`
              : `${COLLAPSED_WIDTH}px`
            : "88vw",
          maxWidth: isDesktop ? undefined : "320px", // ✅ มือถืออย่าให้กว้างเกิน
          padding: isDesktop ? "12px" : "16px",      // ✅ ลด padding ของกรอบนอก (เดิม p-4)
          paddingTop: "max(env(safe-area-inset-top), 16px)",
        }}
      >
        <div
          className="
            h-full rounded-3xl bg-[#f7f7f8] border border-gray-200/80 shadow-sm
            flex flex-col overflow-visible
          "
        >
          {/* Header */}
          <div
            className={`flex items-center ${
              isExpanded
                ? "justify-between px-4 pt-6 pb-4"
                : "justify-center px-2 pt-5 pb-4"
            }`}
          >
            <Link
              to="/admin"
              onClick={handleCloseSideBar}
              className={`flex items-center ${
                isExpanded ? "gap-3" : "justify-center"
              } select-none`}
              aria-label="Go to dashboard"
            >
              <div className="h-10 w-10 rounded-full bg-[#5f4bd8] flex items-center justify-center shadow-sm shrink-0">
                <span className="text-white text-xl font-bold leading-none">
                  ◔
                </span>
              </div>

              {isExpanded && (
                <span className="text-[18px] font-semibold text-[#1f2240] tracking-tight">
                  Dashkit
                </span>
              )}
            </Link>

            {isExpanded && !isDesktop && (
              <TooltipComponent content="Close menu" position="BottomCenter">
                <button
                  type="button"
                  onClick={() => setActiveMenu(false)}
                  className="
                    rounded-xl p-2
                    text-gray-600 hover:bg-gray-200/70 active:bg-gray-300/70
                    transition-colors
                  "
                  aria-label="Close menu"
                >
                  <MdOutlineCancel className="text-xl" />
                </button>
              </TooltipComponent>
            )}
          </div>

          {/* Menu Body */}
          <nav
            className={`flex-1 ${
              isExpanded ? "overflow-y-auto px-3 pb-4" : "overflow-visible px-2 pb-3"
            }`}
          >
            <div className={isExpanded ? "space-y-2" : "space-y-3"}>
              {menuLinks.map((section) => {
                const isOpen = !!openSections[section.title];
                const hasActiveChild =
                  section.links?.some((link) => isLinkActive(link.name)) ?? false;

                const sectionIcon =
                  section.links?.[0]?.icon ?? (
                    <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70" />
                  );

                // =========================
                // EXPANDED MODE
                // =========================
                if (isExpanded) {
                  return (
                    <div key={section.title} className="rounded-2xl">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title)}
                        className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-all ${
                          hasActiveChild || isOpen
                            ? "bg-linear-to-r from-[#6f5be8] to-[#7a67ea] text-white shadow-sm"
                            : "bg-transparent text-[#4b4f63] hover:bg-white"
                        }`}
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-[16px] ${
                              hasActiveChild || isOpen
                                ? "bg-white/15 text-white"
                                : "bg-transparent text-gray-500"
                            }`}
                          >
                            {sectionIcon}
                          </span>

                          <span className="truncate text-[15px] font-medium">
                            {formatLabel(section.title)}
                          </span>
                        </div>

                        <MdKeyboardArrowDown
                          className={`text-xl transition-transform ${
                            isOpen ? "rotate-0" : "-rotate-90"
                          } ${
                            hasActiveChild || isOpen ? "text-white" : "text-gray-500"
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isOpen
                            ? "max-h-150 opacity-100 pt-2 pb-1"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pl-7 pr-2 space-y-1">
                          {section.links?.map((link) => {
                            const active = isLinkActive(link.name);

                            return (
                              <NavLink
                                to={`/admin/${link.name}`}
                                key={`${section.title}-${link.name}`}
                                onClick={handleCloseSideBar}
                                className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-colors ${
                                  active
                                    ? "text-[#6f5be8] font-semibold"
                                    : "text-[#585b6b] hover:bg-white hover:text-[#2b2f45]"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className={`inline-block h-2 w-2 rounded-full border ${
                                      active
                                        ? "bg-[#8a79ff] border-[#8a79ff]"
                                        : "bg-transparent border-gray-400"
                                    }`}
                                  />
                                  <span className="truncate text-[14px]">
                                    {formatLabel(link.name)}
                                  </span>
                                </div>

                                {link.badge && (
                                  <span className="ml-2 shrink-0 rounded-md bg-[#5b8dff] px-2 py-0.5 text-[11px] font-semibold text-white">
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

                // =========================
                // COLLAPSED MODE (Desktop Mini Sidebar)
                // =========================
                return (
                  <div
                    key={section.title}
                    className="relative"
                    onMouseEnter={() => openHoverPopup(section.title)}
                    onMouseLeave={() => closeHoverPopupWithDelay(section.title)}
                  >
                    <TooltipComponent content={formatLabel(section.title)} position="RightCenter">
                      <button
                        type="button"
                        className={`w-full h-12 rounded-xl flex items-center justify-center transition-all ${
                          hasActiveChild
                            ? "bg-linear-to-r from-[#6f5be8] to-[#7a67ea] text-white shadow-sm"
                            : "bg-[#ececef] text-gray-500 hover:bg-white"
                        }`}
                        aria-label={formatLabel(section.title)}
                      >
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[18px] ${
                            hasActiveChild ? "bg-white/15 text-white" : "text-gray-500"
                          }`}
                        >
                          {sectionIcon}
                        </span>
                      </button>
                    </TooltipComponent>

                    {hoveredSection === section.title && (
                      <div
                        className="absolute left-[calc(100%+12px)] top-0 z-70 w-62.5"
                        onMouseEnter={() => openHoverPopup(section.title)}
                        onMouseLeave={() => closeHoverPopupWithDelay(section.title)}
                      >
                        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                          <div className="px-4 py-3 bg-linear-to-r from-[#6f5be8] to-[#7a67ea] text-white">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-[16px]">
                                {sectionIcon}
                              </span>
                              <span className="text-[15px] font-medium truncate">
                                {formatLabel(section.title)}
                              </span>
                            </div>
                          </div>

                          <div className="py-2">
                            {section.links?.map((link) => {
                              const active = isLinkActive(link.name);

                              return (
                                <NavLink
                                  key={`${section.title}-${link.name}-mini`}
                                  to={`/admin/${link.name}`}
                                  onClick={() => {
                                    setHoveredSection(null);
                                    handleCloseSideBar();
                                  }}
                                  className={`flex items-center justify-between px-4 py-2.5 text-[14px] transition-colors ${
                                    active
                                      ? "text-[#6f5be8] font-semibold bg-[#f4f1ff]"
                                      : "text-[#4f5366] hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="truncate">
                                    {formatLabel(link.name)}
                                  </span>

                                  {link.badge && (
                                    <span className="ml-3 shrink-0 rounded-md bg-[#5b8dff] px-2 py-0.5 text-[11px] font-semibold text-white">
                                      {link.badge}
                                    </span>
                                  )}
                                </NavLink>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer - Logout */}
          <div className={`${isExpanded ? "px-3 pb-4 pt-2" : "px-2 pb-4 pt-1"}`}>
            {isExpanded ? (
              <button
                type="button"
                className="
                  w-full flex items-center justify-between
                  rounded-2xl bg-[#ececef] hover:bg-[#e5e5ea]
                  px-5 py-4 text-[#3a3d4f] transition-colors
                "
                aria-label="Logout"
              >
                <span className="text-[15px] font-semibold">Logout</span>
                <span className="inline-flex items-center justify-center text-[20px] text-gray-500">
                  <FiLogOut />
                </span>
              </button>
            ) : (
              <TooltipComponent content="Logout" position="RightCenter">
                <button
                  type="button"
                  className="
                    w-full h-12 rounded-xl
                    flex items-center justify-center
                    bg-[#ececef] hover:bg-[#e5e5ea]
                    text-gray-500 transition-colors
                  "
                  aria-label="Logout"
                >
                  <FiLogOut className="text-[20px]" />
                </button>
              </TooltipComponent>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;