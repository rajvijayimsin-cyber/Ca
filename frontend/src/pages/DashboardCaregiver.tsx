import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';
import { useToast } from '../components/ToastProvider';
import api from '../api';
import { fmtDate, fmtMoney } from '../i18n';

const listOf = (d: any): any[] => (Array.isArray(d) ? d : []);

// Hours left before a request expires (requests expire 12 hours after they arrive).
const hoursLeft = (r: any): number | null => {
  const exp = r?.expires_at ? new Date(r.expires_at).getTime()
    : r?.requested_at ? new Date(r.requested_at).getTime() + 12 * 3600000 : NaN;
  return isNaN(exp) ? null : Math.max(0, Math.round((exp - Date.now()) / 360000) / 10);
};

const DashboardCaregiver: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    api.get('/api/dashboard/caregiver')
      .then(r => { setData(r.data); setFailed(false); })
      .catch(err => { console.error('[dashboard/caregiver] failed:', err?.response?.status, err?.message); setFailed(true); })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const decide = async (id: any, action: 'accept' | 'decline') => {
    setBusy(String(id));
    try {
      await api.post('/api/bookings/' + id + '/' + action, {});
      showToast(action === 'accept' ? 'Booking accepted' : 'Booking declined', 'success');
      load();
    } catch {
      showToast('That did not go through. Please try again.', 'error');
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: theme.primary }} /></Box>;

  const today = listOf(data?.todays_visits);
  // Most urgent first: the request that expires soonest.
  const pending = listOf(data?.pending_requests).slice().sort((a, b) => (hoursLeft(a) ?? 99) - (hoursLeft(b) ?? 99));
  const card = { p: 2.5, height: '100%', borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface };
  const heading = { fontSize: '1.1rem', fontWeight: 600, color: theme.text, mb: 1 };

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, fontFamily: theme.fontFamily }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 3 }}>Caregiver Dashboard</Typography>
      {failed && <Alert severity="warning" sx={{ mb: 2 }}>Your visits could not be loaded. They appear here once the server is running.</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={card}>
            <Typography sx={{ color: theme.textSecondary }}>Earned this week</Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: theme.text }}>
              {typeof data?.weekly_earnings === 'number' ? fmtMoney(data.weekly_earnings, 'USD') : '—'}
            </Typography>
            <Button size="small" onClick={() => navigate('/earnings')} sx={{ textTransform: 'none', mt: 1 }}>See earnings</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={card}>
            <Typography component="h2" sx={heading}>Today's visits</Typography>
            {today.length === 0 ? <Typography sx={{ color: theme.textSecondary }}>No visits today.</Typography> : (
              <List dense disablePadding>
                {today.map((v: any, i: number) => (
                  <ListItemButton key={v.id ?? i} divider onClick={() => navigate('/visit')}>
                    <ListItemText primary={`${v.start_time || ''} · ${v.care_recipient_name || 'Visit'}`}
                      secondary={`${v.duration_hours ?? '—'} hours`} primaryTypographyProps={{ fontWeight: 600, fontSize: '1.05rem' }} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={card}>
            <Typography component="h2" sx={heading}>Booking requests</Typography>
            <Typography sx={{ color: theme.textSecondary, fontSize: '0.9rem', mb: 1 }}>Accept or decline within 12 hours, or the request expires.</Typography>
            {pending.length === 0 ? <Typography sx={{ color: theme.textSecondary }}>No requests waiting.</Typography> : (
              <List disablePadding>
                {pending.map((r: any, i: number) => {
                  const left = hoursLeft(r);
                  return (
                    <ListItem key={r.id ?? i} divider sx={{ gap: 1, flexWrap: 'wrap', py: 1.5 }}>
                      <ListItemText sx={{ minWidth: 220 }}
                        primary={`${r.date ? fmtDate(r.date) : ''} ${r.start_time || ''} · ${r.duration_hours ?? '—'} hours`}
                        secondary={left !== null ? `Expires in ${left} hours` : ''}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '1.05rem' }}
                        secondaryTypographyProps={{ color: left !== null && left < 3 ? theme.error : theme.textSecondary }} />
                      <Button variant="contained" disabled={busy === String(r.id)} onClick={() => decide(r.id, 'accept')}
                        sx={{ bgcolor: theme.success, textTransform: 'none', fontWeight: 600, minHeight: 44, '&:hover': { bgcolor: theme.success, opacity: 0.9 } }}>Accept</Button>
                      <Button variant="outlined" color="error" disabled={busy === String(r.id)} onClick={() => decide(r.id, 'decline')}
                        sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44 }}>Decline</Button>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCaregiver;
