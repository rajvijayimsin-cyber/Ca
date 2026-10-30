import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Paper, TextField, InputAdornment, IconButton,
         CircularProgress, Chip, FormControlLabel, Switch } from '@mui/material';
import { Search as SearchIcon, DoneAll as DoneAllIcon, Delete as DeleteIcon,
         Check as CheckIcon, NotificationsNone as EmptyIcon } from '@mui/icons-material';
import { useAppTheme } from '../hooks/useAppTheme';
import { useToast } from '../components/ToastProvider';
import api from '../api';

type Note = { id?: number | string; title?: string; message?: string; body?: string;
              read?: boolean; is_read?: boolean; created_at?: string; [k: string]: any };

const isRead = (n: Note) => !!(n.read ?? n.is_read);
const when = (v?: string) => {
  if (!v) return '';
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v)
    : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const Notifications: React.FC = () => {
  const theme = useAppTheme();
  const showToast = useToast();
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const r = await api.get('/api/notifications');
      const d = r?.data;
      setItems(Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items
        : Array.isArray(d?.results) ? d.results : Array.isArray(d?.data) ? d.data : []);
    } catch (err: any) {
      setItems([]);
      setLoadError(err?.response?.status === 404 ? 'Notifications are not available yet'
        : err?.response?.data?.detail || err?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const shown = useMemo(() => items.filter(n =>
    (!unreadOnly || !isRead(n)) &&
    (!search || JSON.stringify([n.title, n.message, n.body]).toLowerCase()
      .includes(search.toLowerCase()))), [items, unreadOnly, search]);
  const unread = items.filter(n => !isRead(n)).length;

  const markAllRead = async () => {
    try {
      await api.post('/api/notifications/mark-all-read', {});
      showToast('All notifications marked as read', 'success');
      load();
    } catch { showToast('Could not mark notifications as read', 'error'); }
  };
  const markRead = async (n: Note) => {
    if (n.id === undefined) return;
    try {
      await api.put('/api/notifications/' + n.id, { read: true, is_read: true });
      load();
    } catch { showToast('Could not mark it as read', 'error'); }
  };
  const remove = async (n: Note) => {
    if (n.id === undefined) return;
    try {
      await api.delete('/api/notifications/' + n.id);
      showToast('Notification removed', 'success');
      load();
    } catch { showToast('Could not remove it', 'error'); }
  };

  return (
    <Box sx={{ p: 3, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text }}>
          Notifications {unread > 0 && <Chip size="small" label={unread + ' unread'} sx={{ ml: 1, verticalAlign: 'middle' }} />}
        </Typography>
        <Button variant="contained" startIcon={<DoneAllIcon />} onClick={markAllRead} disabled={unread === 0}
                sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600,
                      '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
          Mark all read
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap',
                    borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <TextField size="small" placeholder="Search notifications..." value={search}
          onChange={e => setSearch(e.target.value)} sx={{ flex: '1 1 240px' }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
        <FormControlLabel control={<Switch checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} />}
                          label="Unread only" />
      </Paper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={24} /></Box>
      ) : loadError ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
          <Typography sx={{ fontWeight: 600, color: theme.text, mb: 1 }}>The request failed</Typography>
          <Typography sx={{ color: theme.textSecondary, mb: 2 }}>{loadError}</Typography>
          <Button variant="outlined" onClick={load} sx={{ textTransform: 'none' }}>Try again</Button>
        </Paper>
      ) : shown.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: theme.borderRadius + 'px', border: `1px dashed ${theme.border}`, bgcolor: theme.surface }}>
          <EmptyIcon sx={{ fontSize: 56, color: theme.textSecondary, opacity: 0.5, mb: 1 }} />
          <Typography sx={{ fontWeight: 600, color: theme.text }}>
            {items.length === 0 ? "You're all caught up" : 'Nothing matches'}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface, overflow: 'hidden' }}>
          {shown.map((n, i) => (
            <Box key={n.id ?? i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: 2,
                  borderTop: i ? `1px solid ${theme.border}` : 'none',
                  bgcolor: isRead(n) ? 'transparent' : theme.primary + '0D' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: isRead(n) ? 500 : 700, color: theme.text }}>
                  {n.title || n.message || n.body || 'Notification'}
                </Typography>
                {n.title && (n.message || n.body) && (
                  <Typography sx={{ color: theme.textSecondary, fontSize: '0.9rem' }}>{n.message || n.body}</Typography>
                )}
                <Typography sx={{ color: theme.textSecondary, fontSize: '0.75rem', mt: 0.5 }}>{when(n.created_at)}</Typography>
              </Box>
              {!isRead(n) && (
                <IconButton size="small" aria-label="mark read" title="Mark read" onClick={() => markRead(n)}>
                  <CheckIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton size="small" aria-label="delete" title="Remove" onClick={() => remove(n)} sx={{ color: '#d32f2f' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default Notifications;
