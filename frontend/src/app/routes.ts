import { createBrowserRouter } from 'react-router';

// Lazy load pages
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Alerts from './pages/Alerts';
import Schedule from './pages/Schedule';
import CallLogs from './pages/CallLogs';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'patients',
        Component: Patients,
      },
      {
        path: 'patients/:id',
        Component: PatientDetail,
      },
      {
        path: 'alerts',
        Component: Alerts,
      },
      {
        path: 'schedule',
        Component: Schedule,
      },
      {
        path: 'calls',
        Component: CallLogs,
      },
      {
        path: 'settings',
        Component: Settings,
      },
    ],
  },
  {
    path: '/admin',
    Component: AdminPanel,
  },
]);
