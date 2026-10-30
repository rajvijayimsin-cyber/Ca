import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Alert, CircularProgress, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, Grid } from '@mui/material';
import { CheckCircle as DoneIcon, RadioButtonUnchecked as NotDoneIcon, Chat as ChatIcon, RateReview as ReviewIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';
import { apiGet, apiPost } from '../apiWithMock';
import { useToast } from '../components/ToastProvider';
import StatusChip from '../components/StatusChip';
import { loadSession } from '../auth/session';
import { fmtDate, fmtMoney, statusLabel } from '../i18n';

const listOf = (d: any): any[] =>
  Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.results) ? d.results
    : Array.isArray(d?.data) ? d.data : [];

// Tasks arrive as [{ task, done }] or as a list of task names that were done.
const tasksOf = (v: any): { label: string; done: boolean }[] =>
  Array.isArray(v) ? v.map((t: any) => typeof t === 'string' ? { label: t, done: true } : { label: String(t?.task ?? t?.label ?? t?.name ?? ''), done: !!t?.done })
    : typeof v === 'string' && v ? v.split(',').map(s => ({ label: s.trim(), done: true })) : [];

const usd = (n: any) => (n === null || n === undefined || n === '' ? '—' : fmtMoney(Number(n), 'USD'));
const time = (v: any) => (v ? fmtDate(v, { dateStyle: 'medium', timeStyle: 'short' }) : 'Not yet');

const VisitDetails: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const showToast = useToast();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<any>([]);
  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => { loadSession().then(s => setRole(s.role)); }, []);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    const req = id
      ? apiGet('/api/bookings/' + id).then(r => setVisit(r.data))
      // No visit chosen: the visits that have started or finished, newest first.
      : apiGet('/api/bookings?status=in_progress,completed,paid&sort=date&order=desc').then(r => setItems(r.data));
    req.catch(err => setLoadError(err?.response?.status === 404 ? 'This visit could not be found.'
      : err?.response?.data?.detail || 'The visit could not be loaded.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleCheckin = useCallback((id: string) => {
    apiPost('/api/bookings/' + id + '/checkin', {})
      .then(() => { showToast('Checked in', 'success'); load(); })
      .catch(() => showToast('Check-in failed', 'error'));
  }, [showToast, load]);
  const handleCheckout = useCallback((id: string) => {
    apiPost('/api/bookings/' + id + '/checkout', {})
      .then(() => { showToast('Checked out', 'success'); load(); })
      .catch(() => showToast('Check-out failed', 'error'));
  }, [showToast, load]);

  const card = { p: 3, mb: 2, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface };
  const isCaregiver = String(role || '').toLowerCase() === 'caregiver';

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress /></Box>;
  }

  if (loadError) {
    return (
      <Box sx={{ p: 3, maxWidth: 820 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>{loadError}</Alert>
        <Button variant="outlined" onClick={load} sx={{ textTransform: 'none' }}>Try again</Button>
      </Box>
    );
  }

  if (!id) {
    const visits = listOf(items);
    return (
      <Box sx={{ p: { xs: 0, md: 1 }, maxWidth: 820, fontFamily: theme.fontFamily }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 2 }}>Visit Details</Typography>
        <Paper sx={{ ...card, p: 0 }}>
          {visits.length === 0 && <Typography sx={{ p: 3, color: theme.textSecondary }}>No visits have started yet. Visit details appear here once a caregiver checks in.</Typography>}
          <List disablePadding>
            {visits.map((v: any, i: number) => (
              <ListItemButton key={v.id ?? i} divider onClick={() => navigate('/bookings/' + v.id)} sx={{ py: 2 }}>
                <ListItemText primary={`${v.caregiver_name || 'Caregiver'} · ${v.date ? fmtDate(v.date) : ''}`}
                  secondary={`${v.actual_hours ?? v.duration_hours ?? '—'} hours · ${usd(v.final_charge ?? v.total)}`}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '1.05rem' }} />
                <StatusChip status={String(v.status || "")} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Box>
    );
  }

  const tasks = tasksOf(visit?.tasks_done);
  const status = String(visit?.status || '').toLowerCase();

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, maxWidth: 820, fontFamily: theme.fontFamily }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, flex: 1 }}>
          Visit with {visit?.caregiver_name || 'your caregiver'}
        </Typography>
        <StatusChip status={String(visit?.status || "")} />
      </Box>

      {/* Actions along the top: what this person can do with this visit now. */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {isCaregiver && status === 'upcoming' && (
          <Button variant="contained" onClick={() => handleCheckin(String(id))}
            sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, minHeight: 48, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>Check in</Button>
        )}
        {isCaregiver && status === 'in_progress' && (
          <Button variant="contained" onClick={() => handleCheckout(String(id))}
            sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, minHeight: 48, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>Check out</Button>
        )}
        <Button variant="outlined" startIcon={<ChatIcon />} onClick={() => navigate('/messages')} sx={{ textTransform: 'none', minHeight: 48 }}>Message</Button>
        {!isCaregiver && (status === 'completed' || status === 'paid') && (
          <Button variant="outlined" startIcon={<ReviewIcon />} onClick={() => navigate('/reviews')} sx={{ textTransform: 'none', minHeight: 48 }}>Leave a review</Button>
        )}
      </Box>

      <Paper sx={card}>
        <Grid container spacing={2}>
          {[
            ['Date', visit?.date ? fmtDate(visit.date) : '—'],
            ['Booked', `${visit?.start_time || '—'} · ${visit?.duration_hours ?? '—'} hours`],
            ['Checked in', time(visit?.check_in_time)],
            ['Checked out', time(visit?.check_out_time)],
            ['Actual hours', visit?.actual_hours != null ? String(visit.actual_hours) : '—'],
            ['Status', statusLabel(visit?.status)],
          ].map(([k, v]) => (
            <Grid item xs={6} md={4} key={k}>
              <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>{k}</Typography>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 600, color: theme.text }}>{v}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={card}>
        <Typography component="h2" sx={{ fontSize: '1.15rem', fontWeight: 600, color: theme.text, mb: 1 }}>Tasks done</Typography>
        {tasks.length === 0 && <Typography sx={{ color: theme.textSecondary }}>The caregiver has not recorded any tasks yet.</Typography>}
        <List dense disablePadding>
          {tasks.map((t, i) => (
            <ListItem key={i} disableGutters>
              <ListItemIcon sx={{ minWidth: 36 }}>{t.done ? <DoneIcon sx={{ color: theme.success }} /> : <NotDoneIcon sx={{ color: theme.textSecondary }} />}</ListItemIcon>
              <ListItemText primary={t.label} primaryTypographyProps={{ fontSize: '1rem' }} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={card}>
        <Typography component="h2" sx={{ fontSize: '1.15rem', fontWeight: 600, color: theme.text, mb: 1 }}>Visit notes</Typography>
        <Typography sx={{ color: visit?.visit_notes ? theme.text : theme.textSecondary, whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
          {visit?.visit_notes || 'No visit notes yet.'}
        </Typography>
      </Paper>

      <Paper sx={card}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="h2" sx={{ fontSize: '1.15rem', fontWeight: 600, color: theme.text }}>Final charge</Typography>
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: theme.text }}>{usd(visit?.final_charge)}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography sx={{ color: theme.textSecondary, fontSize: '0.9rem' }}>
          Charged for the hours actually worked, never more than the hours booked unless you approved extra time.
        </Typography>
      </Paper>
    </Box>
  );
};

export default VisitDetails;
