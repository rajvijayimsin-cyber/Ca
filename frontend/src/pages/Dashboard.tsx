import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import api from '../api';

const Dashboard: React.FC = () => {
  const theme = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [caregivers_count, setCaregiversCount] = useState<number | null>(null);
  const [bookings_count, setBookingsCount] = useState<number | null>(null);
  const [payments_count, setPaymentsCount] = useState<number | null>(null);
  const [messages_count, setMessagesCount] = useState<number | null>(null);
  const [reviews_count, setReviewsCount] = useState<number | null>(null);
  // Which figures could not be loaded. Rendered under the tiles, so a dash
  // on a card is explained instead of just sitting there.
  const [failedMetrics, setFailedMetrics] = useState<string[]>([]);

  const kpiDefs = [{ label: "Find Caregivers", value: (caregivers_count !== null ? String(caregivers_count) : "—"), icon: "chart" }, { label: "My Bookings", value: (bookings_count !== null ? String(bookings_count) : "—"), icon: "chart" }, { label: "Payments & Receipts", value: (payments_count !== null ? String(payments_count) : "—"), icon: "chart" }, { label: "Messages", value: (messages_count !== null ? String(messages_count) : "—"), icon: "chart" }, { label: "Reviews", value: (reviews_count !== null ? String(reviews_count) : "—"), icon: "chart" }];

  useEffect(() => {
    setLoading(true);
    Promise.all([
    api.get('/api/caregivers').then(r => {      const d = r?.data;      const arr = Array.isArray(d) ? d        : Array.isArray(d?.items) ? d.items        : Array.isArray(d?.results) ? d.results        : Array.isArray(d?.data) ? d.data        : null;      setCaregiversCount(arr === null ? null : arr.length);    }).catch(err => { console.error('[KPI] /api/caregivers failed:', err?.response?.status, err?.message); setCaregiversCount(null); setFailedMetrics(prev => prev.includes('Find Caregivers') ? prev : [...prev, 'Find Caregivers']); }),
    api.get('/api/bookings').then(r => {      const d = r?.data;      const arr = Array.isArray(d) ? d        : Array.isArray(d?.items) ? d.items        : Array.isArray(d?.results) ? d.results        : Array.isArray(d?.data) ? d.data        : null;      setBookingsCount(arr === null ? null : arr.length);    }).catch(err => { console.error('[KPI] /api/bookings failed:', err?.response?.status, err?.message); setBookingsCount(null); setFailedMetrics(prev => prev.includes('My Bookings') ? prev : [...prev, 'My Bookings']); }),
    api.get('/api/payments').then(r => {      const d = r?.data;      const arr = Array.isArray(d) ? d        : Array.isArray(d?.items) ? d.items        : Array.isArray(d?.results) ? d.results        : Array.isArray(d?.data) ? d.data        : null;      setPaymentsCount(arr === null ? null : arr.length);    }).catch(err => { console.error('[KPI] /api/payments failed:', err?.response?.status, err?.message); setPaymentsCount(null); setFailedMetrics(prev => prev.includes('Payments & Receipts') ? prev : [...prev, 'Payments & Receipts']); }),
    api.get('/api/messages').then(r => {      const d = r?.data;      const arr = Array.isArray(d) ? d        : Array.isArray(d?.items) ? d.items        : Array.isArray(d?.results) ? d.results        : Array.isArray(d?.data) ? d.data        : null;      setMessagesCount(arr === null ? null : arr.length);    }).catch(err => { console.error('[KPI] /api/messages failed:', err?.response?.status, err?.message); setMessagesCount(null); setFailedMetrics(prev => prev.includes('Messages') ? prev : [...prev, 'Messages']); }),
    api.get('/api/reviews').then(r => {      const d = r?.data;      const arr = Array.isArray(d) ? d        : Array.isArray(d?.items) ? d.items        : Array.isArray(d?.results) ? d.results        : Array.isArray(d?.data) ? d.data        : null;      setReviewsCount(arr === null ? null : arr.length);    }).catch(err => { console.error('[KPI] /api/reviews failed:', err?.response?.status, err?.message); setReviewsCount(null); setFailedMetrics(prev => prev.includes('Reviews') ? prev : [...prev, 'Reviews']); })
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, bgcolor: theme.background }}><CircularProgress sx={{ color: theme.primary }} /></Box>;

  return (
    <Box sx={{ p: 3, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      {/* Header with gradient — uses h1/h2 so Playwright content test finds a heading */}
      <Box sx={{ background: theme.headerGradient, borderRadius: theme.borderRadius + 'px', p: 3, mb: 3, color: '#fff' }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Welcome to Dashboard
        </Typography>
        <Typography component="p" sx={{ fontSize: '0.9rem', opacity: 0.85, mt: 0.5 }}>
          Here is an overview of your application activity and key metrics.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Typography component="h2" variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: theme.text, mb: 1.5 }}>
        Key Metrics
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpiDefs.map((kpi, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper sx={{ p: 2.5, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
              <Typography component="p" sx={{ fontSize: '0.75rem', color: theme.textSecondary, mb: 0.5 }}>{kpi.label}</Typography>
              <Typography component="p" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text }}>{kpi.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {failedMetrics.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: theme.borderRadius + 'px' }}>
          {failedMetrics.length} of {kpiDefs.length} figure{kpiDefs.length === 1 ? '' : 's'} could not be loaded
          ({failedMetrics.join(', ')}). The cards below show a dash rather than a count.
        </Alert>
      )}

      {/* Recent Activity */}
      <Paper sx={{ p: 3, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <Typography component="h3" variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: theme.text, mb: 2 }}>
          Recent Activity
        </Typography>
        <Typography component="p" sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>
          Data will appear here once the backend endpoints are running and records exist.
          You can add records from the menu pages on the left.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
