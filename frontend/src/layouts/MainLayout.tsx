import React from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Drawer, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography, Toolbar, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppTheme } from '../hooks/useAppTheme';
import { AdminPanelSettings, AutoAwesome, Chat, Dashboard, Event, ExpandLess, ExpandMore, Favorite, Help, History, Home, Logout, MarkEmailRead, Notifications, Payments, Person, RateReview, Science, Settings, ViewModule, Menu as MenuIcon } from '@mui/icons-material';
import api from '../api';
import Breadcrumbs from '../components/Breadcrumbs';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useT } from '../i18n';
import { loadSession, isStaff, isAdmin } from '../auth/session';

const DRAWER_WIDTH = 240;

const navGroups = [
  { group: 'Dashboard', items: [
      { label: 'Admin Dashboard', path: '/dashboard/admin', icon: <Dashboard />, adminOnly: true },
      { label: 'Caregiver Dashboard', path: '/dashboard/caregiver', icon: <Dashboard /> },
      { label: 'Family Dashboard', path: '/dashboard/family', icon: <Dashboard /> },
    ] },
  { group: 'Caregivers', items: [
      { label: 'Find Caregivers', path: '/caregivers/search', icon: <Favorite /> },
      { label: 'Reviews', path: '/reviews', icon: <RateReview /> },
    ] },
  { group: 'Bookings', items: [
      { label: 'Book a Visit', path: '/bookings/new', icon: <Event /> },
      { label: 'My Bookings', path: '/bookings/family', icon: <Event /> },
      { label: 'Visit Details', path: '/visit-details', icon: <ViewModule /> },
    ] },
  { group: 'Payments', items: [
      { label: 'Payments & Receipts', path: '/payments', icon: <Payments /> },
    ] },
  { group: 'Communication', items: [
      { label: 'Messages', path: '/messages', icon: <Chat /> },
    ] },
  { group: 'For Caregivers', items: [
      { label: 'Edit Profile', path: '/caregiver/profile', icon: <Person /> },
      { label: 'Availability', path: '/caregiver/availability', icon: <Event /> },
      { label: 'Verification', path: '/verification', icon: <ViewModule /> },
      { label: 'Visit Screen', path: '/visit', icon: <ViewModule /> },
      { label: 'Earnings', path: '/earnings', icon: <Payments /> },
    ] },
  { group: 'Admin', items: [
      { label: 'Caregiver Verification Queue', path: '/verification-queue', icon: <ViewModule />, adminOnly: true },
      { label: 'Disputes and Refunds', path: '/disputes', icon: <ViewModule />, adminOnly: true },
      { label: 'Audit Log', path: '/audit-log', icon: <History />, adminOnly: true },
    ] },
  { group: 'Workflows', items: [
      { label: 'Booking Status Flow', path: '/booking-status', icon: <Event /> },
      { label: 'Trust, Safety and Privacy Rules', path: '/privacy', icon: <ViewModule /> },
    ] },
  { group: 'General', items: [
      { label: 'Home', path: '/home', icon: <Home /> },
    ] },
  { group: 'Workspace', items: [
      { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    ] },
  { group: 'Access & Roles', items: [
    ] },
  { group: 'Account', items: [
      { label: 'Help', path: '/help', icon: <Help /> },
      { label: 'Notifications', path: '/notifications', icon: <Notifications /> },
      { label: 'Profile', path: '/profile', icon: <Person /> },
      { label: 'Settings', path: '/settings', icon: <Settings /> },
    ] },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useT();
  // Who is signed in. Until the answer arrives — and if it never does —
  // `isStaff` is true, so nothing disappears on ignorance.
  const [role, setRole] = React.useState<string | null>(null);
  React.useEffect(() => {
    let alive = true;
    loadSession().then(s => { if (alive) setRole(s.role); });
    return () => { alive = false; };
  }, []);
  const staff = isStaff(role);
  const admin = isAdmin(role);
  const visibleGroups = React.useMemo(
    () => navGroups
      .map(g => ({ ...g, items: g.items.filter((i: any) => staff ? (!i.customerOnly && (!i.adminOnly || admin)) : (!i.staffOnly && !i.adminOnly)) }))
      .filter(g => g.items.length > 0),
    [staff, admin]);
  const location = useLocation();
  const theme = useTheme();
  const appTheme = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(navGroups.map(g => [g.group, true]))
  );
  const toggleGroup = (group: string) => setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));

  const handleLogout = () => {
    api.post('/api/auth/logout').finally(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    });
  };

  const drawerContent = (
    <>
      <Toolbar>
        {/* sidebarText, not primary: in the themes whose sidebar IS the
            primary colour the app name was drawn purple on purple and the
            top of the sidebar looked empty. */}
        <Typography variant="h6" noWrap sx={{ color: appTheme.sidebarText, fontWeight: 700, letterSpacing: 0.5, fontFamily: appTheme.fontFamily, minWidth: 0 }}>
          CareNest
        </Typography>
      </Toolbar>
      {/* The nav scrolls, the drawer does not. With fifteen items and
          five group headers the sidebar needed 1031px and a laptop
          gives it 768 or 900, so Logout — the one control that must
          always be reachable — sat below the fold on every page. */}
      <List component="nav" sx={{ px: 0.5, flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        {visibleGroups.map((group, gi) => (
          <React.Fragment key={group.group}>
            {/* Group header — clickable to collapse */}
            <ListItemButton onClick={() => toggleGroup(group.group)}
              sx={{ py: 0.5, px: 1.5, mt: gi > 0 ? 1 : 0 }}>
              <ListItemText primary={group.group}
                primaryTypographyProps={{ fontSize: '0.7rem', fontWeight: 700, color: appTheme.sidebarText, textTransform: 'uppercase', letterSpacing: '0.08em', sx: { opacity: 0.72 } }} />
              {/* textSecondary is the PAGE's grey; on a coloured sidebar it
                  rendered olive-on-purple and could not be read. */}
              {openGroups[group.group] ? <ExpandLess sx={{ color: appTheme.sidebarText, opacity: 0.72, fontSize: 16 }} /> : <ExpandMore sx={{ color: appTheme.sidebarText, opacity: 0.72, fontSize: 16 }} />}
            </ListItemButton>
            {/* Group items — collapsible */}
            {openGroups[group.group] && group.items.map(item => (
              <ListItemButton key={item.path}
                component={RouterLink} to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                selected={location.pathname === item.path}
                sx={{
                  color: appTheme.sidebarText,
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  backgroundColor: location.pathname === item.path ? appTheme.sidebarActive : 'transparent',
                  textDecoration: 'none',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                  borderRadius: 1, mx: 1, mb: 0.3, pl: 3,
                }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.82rem' }} />
              </ListItemButton>
            ))}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 1, flexShrink: 0 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />
        <Box sx={{ px: 1, pb: 1, '&:empty': { display: 'none' } }}><LanguageSwitcher color={appTheme.sidebarText} /></Box>
        <ListItemButton onClick={handleLogout} sx={{ color: appTheme.sidebarText, borderRadius: 1, '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)', color: appTheme.error } }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><Logout /></ListItemIcon>
          <ListItemText primary={t('auth.sign_out')} />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Mobile: hamburger button in top bar */}
      {isMobile && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200,
                  display: 'flex', alignItems: 'center', px: 1, py: 0.5,
                  bgcolor: appTheme.sidebar, color: appTheme.sidebarText }}>
          <IconButton aria-label={t('nav.open_menu')} onClick={() => setMobileOpen(true)}
                      sx={{ color: appTheme.sidebarText }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1 }}>CareNest</Typography>
        </Box>
      )}
      {/* Permanent drawer on desktop, temporary (swipeable) on mobile */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? 0 : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: appTheme.sidebar,
            color: appTheme.sidebarText,
            display: 'flex',
            flexDirection: 'column',
            // Only the nav list scrolls. The paper scrolling as well gave
            // the sidebar two vertical scrollbars and a horizontal one.
            overflow: 'hidden',
          },
        }}>
        {drawerContent}
      </Drawer>
      <Box component="main" sx={{
            flexGrow: 1,
            backgroundColor: 'background.default',
            minHeight: '100vh',
            p: { xs: 2, md: 3 },
            pt: { xs: 7, md: 3 },
            minWidth: 0,
            overflowX: 'hidden',
          }}>
        <Breadcrumbs />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
