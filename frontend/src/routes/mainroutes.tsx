import { lazy } from "react";
import { Navigate, useRoutes, type RouteObject } from "react-router-dom";
import Loadable from "../component/third-patry/Loadable";
import { useAuth } from "../contexts/AuthContext";

// ===== Admin Pages =====
const Dashboard = Loadable(lazy(() => import("../page/dashboard/index")));
const Account = Loadable(lazy(() => import("../page/Account/index")));
const Target = Loadable(lazy(() => import("../page/target/index")));
const LineNotification = Loadable(lazy(() => import("../page/line/index")));
const User = Loadable(lazy(() => import("../page/user/index")));
const MainLayout = Loadable(lazy(() => import("../component/admin/MainLayout")));
const Service = Loadable(lazy(() => import("../component/admin/Service")));
const VulnerabilityByDevice = Loadable(
  lazy(() => import("../page/target/RiskScoreTable/vulnerability/index"))
);
const Vulnerability = Loadable(lazy(() => import("../page/vulnerability/index")));
const VulnerabilityDetail = Loadable(
  lazy(() => import("../page/vulnerability/List/Detail/index"))
);

// ===== Login Pages =====
const SignIn = Loadable(lazy(() => import("../page/Authentication/Signin/index")));
const SignUp = Loadable(lazy(() => import("../page/Authentication/Signup/index")));
const Forget = Loadable(lazy(() => import("../page/Authentication/Forget/index")));
const Reset = Loadable(lazy(() => import("../page/Authentication/Reset/index")));
const Loader = Loadable(lazy(() => import("../component/third-patry/Loader")));

// ======================= ROUTES =======================
const AdminRoutes = (): RouteObject[] => [
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Dashboard /> }],
  },
  {
    path: "/admin",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <Account /> },
      { path: "target", element: <Target /> },
      { path: "vulnerability", element: <Vulnerability /> },
      { path: "line notification", element: <LineNotification /> }, // ✅ แก้ path อย่าเว้นวรรค
      { path: "vulnerability-by-device", element: <VulnerabilityByDevice /> },
      { path: "user", element: <User /> },
      { path: "vulnerability-detail", element: <VulnerabilityDetail /> },
      { path: "service", element: <Service /> }
    ],
  },
  // ✅ กันเส้นทางหลุด
  { path: "*", element: <Navigate to="/admin" replace /> },
];

const MainRoutes = (): RouteObject[] => [
  {
    path: "/",
    children: [
      { index: true, element: <SignIn /> },
      { path: "register", element: <SignUp /> },
      { path: "loader", element: <Loader /> },
      { path: "forgot-password", element: <Forget /> },
      { path: "reset-password", element: <Reset /> },
      { path: "*", element: <SignIn /> },
    ],
  },
];

// ======================= MAIN CONFIG =======================
function ConfigRoutes() {
  const { isLoading, isAdmin } = useAuth();

  // โหลด /me ตอนเปิดเว็บ
  if (isLoading) return useRoutes([{ path: "*", element: <Loader /> }]);

  // Admin เท่านั้นถึงเห็น admin routes
  if (isAdmin) return useRoutes(AdminRoutes());

  // ไม่ใช่ admin -> ไป login routes
  return useRoutes(MainRoutes());
}

export default ConfigRoutes;