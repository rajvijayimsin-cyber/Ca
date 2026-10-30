import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const NAV_LABELS: Record<string, string> = {
  "/": "Store Home",
  "/activity": "Activity",
  "/admin-dashboard-view": "Admin Dashboard View",
  "/analysis": "Analysis",
  "/analytics": "Analytics",
  "/appointments": "Bookings",
  "/assistant": "Assistant",
  "/audit-log": "Audit Log",
  "/billing": "Billing",
  "/blood-bank": "Blood Bank",
  "/booking": "Booking Flow",
  "/booking-status": "Booking Status Flow",
  "/bookings-list": "Bookings List",
  "/bookings/family": "My Bookings",
  "/bookings/new": "Book a Visit",
  "/care-coordination": "Care Coordination",
  "/caregiver-profile": "Caregiver Profile",
  "/caregiver/availability": "Availability",
  "/caregiver/profile": "Edit Profile",
  "/caregivers/search": "Find Caregivers",
  "/cart": "Cart",
  "/claims": "Claims",
  "/coverage-check": "Coverage Check",
  "/dashboard": "Dashboard",
  "/dashboard/admin": "Admin Dashboard",
  "/dashboard/caregiver": "Caregiver Dashboard",
  "/dashboard/family": "Family Dashboard",
  "/dental": "Dental",
  "/disputes": "Disputes and Refunds",
  "/doctors": "Caregivers",
  "/donor-registry": "Donor Registry",
  "/drug-search": "Drug Search",
  "/earnings": "Earnings",
  "/education": "Education",
  "/elder-care": "Elder Care",
  "/emergency": "Emergency",
  "/ems-dispatch": "EMS Dispatch",
  "/features": "Features",
  "/goals": "Goals",
  "/health-analytics": "Health BI",
  "/health-records": "Visit Noteses",
  "/help": "Help",
  "/home": "Home",
  "/home-care": "Home Care",
  "/home-health": "Home Health",
  "/homework": "Homework",
  "/icu": "ICU",
  "/inventory": "Inventory",
  "/lab-results": "Lab Results",
  "/login": "Login",
  "/maternity": "Maternity",
  "/messages": "Messages",
  "/monitoring": "Monitoring",
  "/mood": "Mood",
  "/notices-sent": "Notices sent",
  "/notifications": "Notifications",
  "/nutrition": "Nutrition",
  "/oncology": "Oncology",
  "/operations": "Operations",
  "/orders": "Orders",
  "/patient-hub": "Care Recipient Hub",
  "/patients": "Care Recipients",
  "/patterns": "Patterns",
  "/payments": "Payments & Receipts",
  "/pharmacy": "Pharmacy",
  "/pharmacy-finder": "Find Pharmacy",
  "/policies": "Policies",
  "/population-health": "Population Health",
  "/prescriptions": "Prescriptions",
  "/prescriptions/upload": "Upload Prescription",
  "/price-comparison": "Price Compare",
  "/pricing": "Pricing",
  "/privacy": "Trust, Safety and Privacy Rules",
  "/products": "Products",
  "/profile": "Profile",
  "/public-health": "Public Health",
  "/radiology": "Radiology",
  "/rehabilitation": "Rehabilitation",
  "/research": "Research",
  "/resources": "Resources",
  "/revenue-cycle": "Revenue Cycle",
  "/reviews": "Reviews",
  "/safety": "Safety Resources",
  "/settings": "Settings",
  "/shared-profile": "Shared Profile",
  "/signup": "Signup",
  "/sleep": "Sleep",
  "/staff-roles": "Staff Roles",
  "/subscriptions": "Subscriptions",
  "/surgical": "Surgical",
  "/telemedicine": "Telemedicine",
  "/tests": "Test Catalog",
  "/uploads": "Uploads",
  "/verification": "Verification",
  "/verification-queue": "Caregiver Verification Queue",
  "/veterinary": "Veterinary",
  "/visit": "Visit Screen",
  "/visit-details": "Visit Details",
  "/wellness": "Wellness",
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ fontSize: '0.8rem' }}>
        <Link component={RouterLink} to="/home" underline="hover" color="inherit">Home</Link>
        {segments.map((seg, i) => {
          const path = '/' + segments.slice(0, i + 1).join('/');
          // `\b` — a single backslash here is a Python escape for BACKSPACE,
          // so this shipped as /\x08\w/g, which matches nothing: every
          // breadcrumb read `Home > medical intake` in lowercase.
          const label = NAV_LABELS[path] || seg.replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
          const isLast = i === segments.length - 1;
          return isLast
            ? <Typography key={path} color="text.primary" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{label}</Typography>
            : <Link key={path} component={RouterLink} to={path} underline="hover" color="inherit">{label}</Link>;
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
