import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Button, List, ListItemButton, ListItemText } from '@mui/material';
import { Search as SearchIcon, Event as EventIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';
import api from '../api';
import StatusChip from '../components/StatusChip';
import { fmtDate } from '../i18n';

const listOf = (d: any): any[] => (Array.isArray(d) ? d : []);

const DashboardFamily: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.get('/api/dashboard/family')
      .then(r => setData(r.data))
      .catch(err => { console.error('[dashboard/family] failed:', err?.response?.status, err?.message); setFailed(true); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: theme.primary }} /></Box>;

  const upcoming = listOf(data?.upcoming_bookings);
  const messages = listOf(data?.recent_messages);
  const reviews = listOf(data?.pending_reviews);
  const card = { p: 2.5, height: '100%', borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface };
  const heading = { fontSize: '1.1rem', fontWeight: 600, color: theme.text, mb: 1 };
  const empty = (text: string) => <Typography sx={{ color: theme.textSecondary }}>{text}</Typography>;

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, fontFamily: theme.fontFamily }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, flex: 1 }}>Family Dashboard</Typography>
        <Button variant="contained" startIcon={<SearchIcon />} onClick={() => navigate('/caregivers/search')}
          sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, minHeight: 48, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>Find a caregiver</Button>
        <Button variant="outlined" startIcon={<EventIcon />} onClick={() => navigate('/bookings/family')} sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48 }}>My bookings</Button>
      </Box>
      {failed && <Alert severity="warning" sx={{ mb: 2 }}>Your bookings could not be loaded. They appear here once the server is running.</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={card}>
            <Typography component="h2" sx={heading}>Upcoming visits</Typography>
            {upcoming.length === 0 ? empty('No upcoming visits.') : (
              <List dense disablePadding>
                {upcoming.map((b: any, i: number) => (
                  <ListItemButton key={b.id ?? i} divider onClick={() => navigate('/bookings/' + b.id)}>
                    <ListItemText primary={`${b.caregiver_name || 'Caregiver'} · ${b.date ? fmtDate(b.date) : ''} ${b.start_time || ''}`}
                      secondary={b.duration_hours != null ? `${b.duration_hours} hours` : ''} primaryTypographyProps={{ fontWeight: 600 }} />
                    <StatusChip status={String(b.status || '')} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={card}>
            <Typography component="h2" sx={heading}>Recent messages</Typography>
            {messages.length === 0 ? empty('No new messages.') : (
              <List dense disablePadding>
                {messages.map((m: any, i: number) => (
                  <ListItemButton key={m.id ?? i} divider onClick={() => navigate('/messages')}>
                    <ListItemText primary={m.sender_name || m.subject || 'Message'} secondary={m.message_text || m.last_message || ''}
                      secondaryTypographyProps={{ noWrap: true }} primaryTypographyProps={{ fontWeight: m.read ? 400 : 700 }} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={card}>
            <Typography component="h2" sx={heading}>Waiting for your review</Typography>
            {reviews.length === 0 ? empty('Nothing to review. After a completed visit you can rate your caregiver here.') : (
              <List dense disablePadding>
                {reviews.map((b: any, i: number) => (
                  <ListItemButton key={b.id ?? i} divider onClick={() => navigate('/reviews')}>
                    <ListItemText primary={`${b.caregiver_name || 'Caregiver'} · ${b.date ? fmtDate(b.date) : ''}`} secondary="Leave a review" primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardFamily;
