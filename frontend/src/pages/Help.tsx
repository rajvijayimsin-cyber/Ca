import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Search as SearchIcon } from '@mui/icons-material';
import { useAppTheme } from '../hooks/useAppTheme';
import { loadSession, isStaff } from '../auth/session';

const ITEMS: { q: string; a: string; staff: boolean }[] = [{"q": "How do I find a caregiver?", "a": "Open Find Caregivers. Filter by service, ZIP code, date, price, rating, language or gender, then press View profile or Book now. Only caregivers verified by CareNest are shown.", "staff": false}, {"q": "How do I book a visit?", "a": "Press Book now on a caregiver, or open Book a Visit. Choose the date, start time and hours (at least 2, in 30-minute steps), add the care recipient's details, check the price summary and press Request booking.", "staff": false}, {"q": "How is the price worked out?", "a": "The caregiver's hourly rate times the hours booked, plus 15% for hours after 8pm or on weekends, plus a 10% platform fee. Every charge is shown before you request the booking.", "staff": false}, {"q": "When is my card charged?", "a": "Your card is authorized when you book and charged after the visit, for the hours actually worked. You are never charged for more than you booked unless you approve the extra time.", "staff": false}, {"q": "Can I cancel a booking?", "a": "Yes, from My Bookings. It is free until 24 hours before the visit; after that, 50% is charged. If the caregiver does not arrive you get a full refund.", "staff": false}, {"q": "How do I message my caregiver?", "a": "Open Messages and press New conversation, then choose the booking you want to talk about.", "staff": false}, {"q": "How do I leave a review?", "a": "After a completed visit, open the visit in Visit Details and press Leave a review. Only families who completed a booking can review.", "staff": false}, {"q": "How do I set my rate and availability?", "a": "Caregivers open Edit Profile to set their bio, services, hourly rate ($15 to $60) and service area, and Availability to set their weekly hours and blocked-off days.", "staff": false}, {"q": "How do I get verified?", "a": "Caregivers open Verification and upload their ID, certifications and background check consent. You can be booked once an admin approves you.", "staff": false}, {"q": "How do I clear my notifications?", "a": "Open Notifications and press Mark all read, or the tick on one notification.", "staff": false}, {"q": "How do I change my details?", "staff": false, "a": "Open Profile from the menu, press Edit, change what you need and press Save."}];

const Help: React.FC = () => {
  const theme = useAppTheme();
  const [search, setSearch] = useState('');
  const [staff, setStaff] = useState(true);
  useEffect(() => { loadSession().then(s => setStaff(isStaff(s.role))); }, []);
  const shown = useMemo(() => ITEMS.filter(i => (staff || !i.staff) &&
    (!search || (i.q + ' ' + i.a).toLowerCase().includes(search.toLowerCase()))), [search, staff]);
  return (
    <Box sx={{ p: 3, maxWidth: 820, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 1 }}>Help</Typography>
      <Typography sx={{ color: theme.textSecondary, mb: 3 }}>How to do the everyday things in CareNest.</Typography>
      <TextField fullWidth size="small" placeholder="Search help..." value={search}
        onChange={e => setSearch(e.target.value)} sx={{ mb: 2 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
      {shown.length === 0 ? (
        <Typography sx={{ color: theme.textSecondary }}>Nothing matches "{search}".</Typography>
      ) : shown.map((i, n) => (
        <Accordion key={n} disableGutters variant="outlined" sx={{ mb: 1, bgcolor: theme.surface,
          border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius + 'px !important', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600, color: theme.text }}>{i.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: theme.textSecondary }}>{i.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Help;
