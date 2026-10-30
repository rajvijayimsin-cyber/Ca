import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme';
import { LocaleTheme } from './i18n';
import MainLayout from './layouts/MainLayout';
import { ToastProvider } from './components/ToastProvider';
import { AppProvider } from './context/AppContext';
import NotFound from './pages/NotFound';
import api from './api';
import { loadSession, isStaff, isAdmin } from './auth/session';
import SessionTimeout from './compliance/SessionTimeout';
import Features from './pages/Features';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardCaregiver from './pages/DashboardCaregiver';
import DashboardFamily from './pages/DashboardFamily';
import CaregiverProfile from './pages/CaregiverProfile';
import CaregiverSearch from './pages/CaregiverSearch';
import Reviews from './pages/Reviews';
import BookingWizard from './pages/BookingWizard';
import BookingsFamily from './pages/BookingsFamily';
import VisitDetails from './pages/VisitDetails';
import Payments from './pages/Payments';
import Messages from './pages/Messages';
import AuditLog from './pages/AuditLog';
import BookingStatus from './pages/BookingStatus';
import Dashboard from './pages/Dashboard';
import Disputes from './pages/Disputes';
import Earnings from './pages/Earnings';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Verification from './pages/Verification';
import VerificationQueue from './pages/VerificationQueue';
import Visit from './pages/Visit';
import CaregiverAvailability from './pages/CaregiverAvailability';
import CaregiverProfileEditor from './pages/CaregiverProfileEditor';
import Help from './pages/Help';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import 3StepBooking from './pages/3StepBooking';
import PaymentsPrivacy from './pages/PaymentsPrivacy';
import CareRecipientManagement from './pages/CareRecipientManagement';
import AdminSettings from './pages/AdminSettings';

const AdminRoute: React.FC = () => {
  const [role, setRole] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    loadSession().then(s => { if (alive) { setRole(s.role); setReady(true); } });
    return () => { alive = false; };
  }, []);
  if (!ready) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (!isAdmin(role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

const PrivateRoute: React.FC = () => {
  const skipAuth = process.env.REACT_APP_SKIP_AUTH === 'true';
  const [auth, setAuth] = React.useState<'loading' | 'ok' | 'fail'>(skipAuth ? 'ok' : 'loading');
  React.useEffect(() => {
    if (skipAuth) return;
    api.get('/api/auth/me').then(() => setAuth('ok')).catch(() => setAuth('fail'));
  }, [skipAuth]);
  if (auth === 'loading') return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (auth === 'fail') return <Navigate to="/login" replace />;
  return <Outlet />;
};

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
  <LocaleTheme>
    <CssBaseline />
    <AppProvider>
    <ToastProvider>
    <BrowserRouter>
      <SessionTimeout />
      <Routes>
        {/* Public pages — no sidebar */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Welcome />} />

        {/* Authenticated pages — with sidebar + auth guard */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/care-recipient-management" element={<CareRecipientManagement />} />
            <Route path="/payments-privacy" element={<PaymentsPrivacy />} />
            <Route path="/3-step-booking" element={<3StepBooking />} />
            <Route path="/dashboard/caregiver" element={<DashboardCaregiver />} />
            <Route path="/dashboard/family" element={<DashboardFamily />} />
            <Route path="/caregiver-profile" element={<CaregiverProfile />} />
            <Route path="/caregivers/:id" element={<CaregiverProfile />} />
            <Route path="/caregivers/search" element={<CaregiverSearch />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/bookings/new" element={<BookingWizard />} />
            <Route path="/bookings/family" element={<BookingsFamily />} />
            <Route path="/visit-details" element={<VisitDetails />} />
            <Route path="/bookings/:id" element={<VisitDetails />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/booking-status" element={<BookingStatus />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/home" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/verification-queue" element={<VerificationQueue />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/caregiver/availability" element={<CaregiverAvailability />} />
            <Route path="/caregiver/profile" element={<CaregiverProfileEditor />} />
            <Route path="/help" element={<Help />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route element={<AdminRoute />}>
                <Route path="/dashboard/admin" element={<DashboardAdmin />} />
                <Route path="/audit-log" element={<AuditLog />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
    </AppProvider>
  </LocaleTheme>
  </ThemeProvider>
);

export default App;
