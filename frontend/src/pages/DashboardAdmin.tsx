import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';
import api from '../api';
import { fmtMoney, fmtNumber } from '../i18n';

const DashboardAdmin: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.get('/api/dashboard/admin')
      .then(r => setData(r.data))
      .catch(err => { console.error('[dashboard/admin] failed:', err?.response?.status, err?.message); setFailed(true); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: theme.primary }} /></Box>;

  const num = (v: any) => (typeof v === 'number' ? fmtNumber(v) : '—');
  const tiles = [
    { label: 'Pending verifications', value: num(data?.pending_verifications), to: '/verification-queue', action: 'Review queue' },
    { label: 'Open disputes', value: num(data?.open_disputes), to: '/disputes', action: 'Handle disputes' },
    { label: 'Total bookings', value: num(data?.total_bookings), to: '/bookings/family', action: 'See bookings' },
    { label: 'Revenue', value: typeof data?.total_revenue === 'number' ? fmtMoney(data.total_revenue, 'USD') : '—', to: '/payments', action: 'See payments' },
    { label: 'Active caregivers', value: num(data?.active_caregivers), to: '/verification-queue', action: '' },
  ];

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, fontFamily: theme.fontFamily }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 3 }}>Admin Dashboard</Typography>
      {failed && <Alert severity="warning" sx={{ mb: 2 }}>The platform totals could not be loaded. They appear here once the server is running.</Alert>}
      <Grid container spacing={2}>
        {tiles.map(t => (
          <Grid item xs={12} sm={6} md={4} key={t.label}>
            <Paper sx={{ p: 2.5, height: '100%', borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
              <Typography sx={{ color: theme.textSecondary }}>{t.label}</Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: theme.text }}>{t.value}</Typography>
              {t.action && <Button size="small" onClick={() => navigate(t.to)} sx={{ textTransform: 'none', mt: 1 }}>{t.action}</Button>}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardAdmin;
