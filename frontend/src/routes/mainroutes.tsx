import { lazy } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import Loadable from "../component/third-patry/Loadable";

// ===== Admin Pages =====
const Dashboard = Loadable(lazy(() => import("../page/dashboard/index")));
const Account = Loadable(lazy(() => import("../page/Account/index")));
const Target = Loadable(lazy(() => import("../page/target/index")));
const Vulnerability = Loadable(lazy(() => import("../page/vulnerability/index")));
const LineNotification = Loadable(lazy(() => import("../page/line/index")));
const User = Loadable(lazy(() => import("../page/user/index")));
const MainLayout = Loadable(lazy(() => import("../component/admin/MainLayout")));

// ======================= ROUTES =======================
const MainRoutes = (): RouteObject[] => [
  // หน้าแรก
 {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> }, 
    ],
  },

  // กลุ่ม /admin
  {
    path: "/admin",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> }, // /admin
      { path: "dashboard", element: <Dashboard /> }, // /admin/dashboard
      { path: "profile", element: <Account /> }, // /admin/profile
      { path: "target", element: <Target /> }, // /admin/target
      { path: "vulnerability", element: <Vulnerability /> }, // /admin/vulnerability
      { path: "line notification", element: <LineNotification /> }, // /admin/line-notification
      { path: "user", element: <User /> }, // /admin/user
    ],
  },
];

// ======================= MAIN CONFIG =======================
function ConfigRoutes() {
  return useRoutes(MainRoutes());
}

export default ConfigRoutes;