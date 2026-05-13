import React, { useMemo, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/ProviderContext";
import { Navbar, Sidebar, ThemeSettings } from "./path";
import "./main.css";

const SIDEBAR_EXPANDED_WIDTH = 272;
const SIDEBAR_COLLAPSED_WIDTH = 88;
const DESKTOP_BREAKPOINT = 900;

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

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  position,
  children,
}) => {
  void content;
  void position;

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const { activeMenu, themeSettings, screenSize, setIsClicked } =
    useStateContext();

  const scrollLockRef = useRef(false);

  const isDesktop =
    typeof screenSize === "number" ? screenSize > DESKTOP_BREAKPOINT : true;

  const contentMarginLeft = useMemo(() => {
    if (!isDesktop) return 0;
    return activeMenu ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;
  }, [activeMenu, isDesktop]);

  const isInsideScrollablePopup = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest('[data-allow-popup-scroll="true"]'));
  };

  const closeNavbarPopups = (event?: React.SyntheticEvent) => {
    if (scrollLockRef.current) return;

    if (isInsideScrollablePopup(event?.target ?? null)) {
      return;
    }

    scrollLockRef.current = true;

    setIsClicked((prev) => {
      if (!prev.notification && !prev.userProfile) return prev;

      return {
        ...prev,
        notification: false,
        userProfile: false,
      };
    });

    window.requestAnimationFrame(() => {
      scrollLockRef.current = false;
    });
  };

  return (
    <div className="min-h-dvh">
      <div
        className={[
          "relative min-h-dvh overflow-x-hidden",
          "bg-[#f4f7fb]",
          "dark:bg-[#070b14]",
        ].join(" ")}
        onScrollCapture={closeNavbarPopups}
        onWheelCapture={closeNavbarPopups}
        onTouchMoveCapture={closeNavbarPopups}
      >
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-white via-[#f4f8fd] to-[#eef4fb] dark:from-[#070b14] dark:via-[#0a1020] dark:to-[#070b14]" />

          <div className="absolute left-[12%] top-30 h-90 w-90 rounded-full bg-cyan-300/16 blur-[120px] dark:bg-cyan-400/10" />

          <div className="absolute right-30 top-[18%] h-95 w-95 rounded-full bg-violet-300/14 blur-[130px] dark:bg-violet-500/9" />

          <div className="absolute bottom-40 left-[34%] h-85 w-85 rounded-full bg-sky-300/12 blur-[120px] dark:bg-sky-500/8" />

          <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white/75 via-white/25 to-transparent dark:from-[#070b14]/90 dark:via-[#070b14]/25 dark:to-transparent" />

          <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#f4f7fb] via-[#f4f7fb]/55 to-transparent dark:from-[#070b14] dark:via-[#070b14]/55 dark:to-transparent" />
        </div>

        <div className="fixed bottom-4 right-4 z-1000">
          <SimpleTooltip content="Settings" position="Top">
            <div />
          </SimpleTooltip>
        </div>

        <Sidebar />

        <div
          className={[
            "relative z-10 min-h-dvh",
            "transform-gpu",
            "transition-[margin-left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "will-change-[margin-left]",
          ].join(" ")}
          style={{
            marginLeft: contentMarginLeft,
            backfaceVisibility: "hidden",
          }}
        >
          <Navbar />
          {themeSettings && <ThemeSettings />}

          <main className="relative px-2.5 pb-4 sm:px-3.5 md:px-4.5 md:pb-5 lg:px-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;