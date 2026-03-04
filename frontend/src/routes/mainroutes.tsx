import { lazy } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import Loadable from "../component/third-patry/Loadable";

// ===== Admin Pages =====
const Dashboard = Loadable(lazy(() => import("../page/dashboard/index")));
const Account = Loadable(lazy(() => import("../page/Account/index")));
const Target = Loadable(lazy(() => import("../page/target/index")));
const LineNotification = Loadable(lazy(() => import("../page/line/index")));
const User = Loadable(lazy(() => import("../page/user/index")));
const MainLayout = Loadable(lazy(() => import("../component/admin/MainLayout")));
const VulnerabilityByDevice = Loadable(lazy(() => import("../page/target/RiskScoreTable/vulnerability/index")));
import Vulnerability from "../page/vulnerability/index";
import VulnerabilityDetail from "../page/vulnerability/List/Detail/index";
// ===== Login Pages =====
const SignIn = Loadable(lazy(() => import("../page/Authentication/Signin/index")));
const SignUp = Loadable(lazy(() => import("../page/Authentication/Signup/index")));
const Forget = Loadable(lazy(() => import("../page/Authentication/Forget/index")));
const Reset = Loadable(lazy(() => import("../page/Authentication/Reset/index")));
const Loader = Loadable(lazy(() => import("../component/third-patry/Loader")));
// ======================= ROUTES =======================
const AdminRoutes = (): RouteObject[] => [
  // หน้าแรก
 {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> }, 
    ],
  },

  { path: "login", element: <SignIn /> }, // /login
  { path: "signup", element: <SignUp /> }, // /signup
  { path: "forget", element: <Forget /> }, // /forget
  { path: "reset", element: <Reset /> }, // /reset

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
      { path: "vulnerability-by-device", element: <VulnerabilityByDevice /> }, // /admin/vulnerability-by-device
      { path: "user", element: <User /> }, // /admin/user
      { path: "vulnerability-detail", element: <VulnerabilityDetail /> }, // /admin/vulnerability-detail
    ],
  },
];

// @ts-ignore
const MainRoutes = (): RouteObject[] => [
  {
    path: "/",
    children: [
      { index: true, element: <SignIn /> },
      { path: "/register", element: <SignUp /> },
      { path: "/loader", element: <Loader /> },
      { path: "/forgot-password", element: <Forget /> },
      { path: "/reset-password", element: <Reset /> },
      { path: "*", element: <SignIn /> },
    ],
  },
];


// ======================= MAIN CONFIG =======================
function ConfigRoutes() {
  return useRoutes(AdminRoutes());
}

export default ConfigRoutes;