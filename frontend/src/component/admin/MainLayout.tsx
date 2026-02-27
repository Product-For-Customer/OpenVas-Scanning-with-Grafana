import { Outlet } from "react-router-dom";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../../contexts/ContextProvider";
import { Navbar, Sidebar, ThemeSettings } from "./index";
import "./main.css";

const SIDEBAR_EXPANDED_WIDTH = 300;
const SIDEBAR_COLLAPSED_WIDTH = 84;

const MainLayout = () => {
  const { activeMenu, themeSettings, screenSize } = useStateContext();

  const isDesktop = typeof screenSize === "number" ? screenSize > 900 : true;

  const contentMarginLeft = isDesktop
    ? activeMenu
      ? SIDEBAR_EXPANDED_WIDTH
      : SIDEBAR_COLLAPSED_WIDTH
    : 0;

  return (
    <div>
      <div
        className={[
          "relative min-h-screen",
          "bg-[#efefef]",
          "dark:bg-linear-to-br dark:from-[#070A12] dark:via-[#0A1020] dark:to-[#070A12]",
        ].join(" ")}
      >
        <div className="fixed right-4 bottom-4 z-1000">
          <TooltipComponent content="Settings" position={"Top" as any}>
            <div />
          </TooltipComponent>
        </div>

        <Sidebar />

        <div
          className="min-h-screen transition-all duration-300"
          style={{ marginLeft: contentMarginLeft }}
        >
          <Navbar />
          {themeSettings && <ThemeSettings />}

          <main className="px-3 sm:px-4 md:px-5 pb-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;