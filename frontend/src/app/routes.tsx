import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import Alerts from "./pages/Alerts";
import Schedule from "./pages/Schedule";
import CallLogs from "./pages/CallLogs";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import { NotFound } from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "patients", element: <Patients /> },
          { path: "patients/:id", element: <PatientDetail /> },
          { path: "alerts", element: <Alerts /> },
          { path: "schedule", element: <Schedule /> },
          { path: "calls", element: <CallLogs /> },
          { path: "settings", element: <Settings /> },
        ],
      }
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      { path: "", element: <AdminPanel /> }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
