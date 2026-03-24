import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { PatientList } from "./pages/PatientList";
import { PatientDetail } from "./pages/PatientDetail";
import { Alerts } from "./pages/Alerts";
import { Schedule } from "./pages/Schedule";
import { AdminPanel } from "./pages/AdminPanel";
import { NotFound } from "./pages/NotFound";
import { DashboardLayout } from "./components/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "patients", element: <PatientList /> },
      { path: "patients/:id", element: <PatientDetail /> },
      { path: "alerts", element: <Alerts /> },
      { path: "schedule", element: <Schedule /> },
      { path: "admin", element: <AdminPanel /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
