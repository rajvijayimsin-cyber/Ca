import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Button, Alert, TextField, List, ListItemButton, ListItemText, Chip, Badge,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import api from '../api';
import { loadSession, isStaff, canWrite } from '../auth/session';
import { fmtDate, statusLabel, tx } from '../i18n';
// What the server can really send (notify_layer): the line says so.
const CHANNEL_LINES: Record<string, string> = {"none": "Nobody is emailed or texted yet: people see new things when they sign in.", "email": "People are told by email when something new is waiting. The email says only that, never the details.", "sms": "People are told by text message when something new is waiting. The text says only that, never the details.", "both": "People are told by email and text message when something new is waiting. They say only that, never the details."};
const useChannelLine = () => {
  const [line, setLine] = React.useState(CHANNEL_LINES.none);
  React.useEffect(() => {
    api.get('/api/notify/channels').then(r => {
      const c: string[] = r.data?.channels || [];
      const e = c.includes('email'), s = c.includes('sms');
      setLine(CHANNEL_LINES[e && s ? 'both' : e ? 'email' : s ? 'sms' : 'none']);
    }).catch(() => {});
  }, []);
  return line;
};

// Conversations between the staff and the people this app serves. Stored in
// the app. Whether anyone is emailed or texted is what the server says
// (useChannelLine). New messages appear on the next check (every 15 seconds).
const SERVER_DOWN = "This needs the app's server, which is not running yet. Nothing was sent.";
const errorOf = (e: any, fallback: string) => {
  const st = e?.response?.status;
  return !st || st === 404 && !e?.response?.data?.detail ? tx(SERVER_DOWN)
    : (e?.response?.data?.detail ? tx(String(e.response.data.detail)) : fallback);
};

const Messages: React.FC = () => {
  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down('md'));
  const [staff, setStaff] = useState(true);
  const [edit, setEdit] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [starting, setStarting] = useState<any>(null);
  const [people, setPeople] = useState<any[]>([]);
  // Families and caregivers talk about a booking that is still active.
  const [bookings, setBookings] = useState<any[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);
  const channelLine = useChannelLine();
  const currentId = current?.id;

  const loadThreads = () => api.get('/api/inbox/threads').then(r => { setThreads(Array.isArray(r.data) ? r.data : []); setError(''); })
    .catch(e => setError(errorOf(e, tx('Could not load the conversations.'))));
  const open = (id: number) => api.get('/api/inbox/threads/' + id).then(r => { setCurrent(r.data); loadThreads(); })
    .catch(e => setError(errorOf(e, tx('Could not open the conversation.'))));

  useEffect(() => {
    loadSession().then(s => {
      setStaff(isStaff(s.role)); setEdit(canWrite(s.role));
      if (!isStaff(s.role)) api.get('/api/bookings', { params: { status: 'accepted,upcoming,in_progress', limit: 50 } })
        .then(r => setBookings(Array.isArray(r.data) ? r.data : Array.isArray(r.data?.items) ? r.data.items : [])).catch(() => {});
      if (isStaff(s.role)) api.get('/api/inbox/people').then(r => setPeople(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    });
    loadThreads();
  }, []);
  // the other side's replies arrive on the next check
  useEffect(() => {
    const t = setInterval(() => { loadThreads(); if (currentId) api.get('/api/inbox/threads/' + currentId).then(r => setCurrent(r.data)).catch(() => {}); }, 15000);
    return () => clearInterval(t);
  }, [currentId]);
  useEffect(() => { endRef.current?.scrollIntoView?.({ block: 'end' }); }, [current?.messages?.length]);

  const send = async () => {
    if (!draft.trim() || !current) return;
    try { await api.post('/api/inbox/threads/' + current.id + '/messages', { body: draft }); setDraft(''); open(current.id); }
    catch (e) { setError(errorOf(e, tx('The message could not be sent.'))); }
  };
  const start = async () => {
    try { const r = await api.post('/api/inbox/threads', starting); setStarting(null); await loadThreads(); open(r.data.id); }
    catch (e) { setError(errorOf(e, tx('The conversation could not be started.'))); }
  };
  const setStatus = async (status: string) => {
    try { await api.post('/api/inbox/threads/' + current.id + '/status', { status }); open(current.id); }
    catch (e) { setError(errorOf(e, tx('The conversation could not be updated.'))); }
  };
  const totalUnread = threads.reduce((n, t) => n + (t.unread || 0), 0);

  const list = (
    <Paper variant="outlined" sx={{ width: narrow ? '100%' : 320, flexShrink: 0, overflow: 'auto', maxHeight: narrow ? 'none' : '70vh' }}>
      <List dense disablePadding>
        {threads.length === 0 && <Typography sx={{ p: 2, color: 'text.secondary' }}>No conversations yet. You can message a caregiver about any active booking.</Typography>}
        {threads.map(t => (
          <ListItemButton key={t.id} selected={t.id === currentId} onClick={() => open(t.id)} divider>
            <ListItemText
              primary={<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography component="span" sx={{ fontWeight: t.unread ? 700 : 500, flex: 1, minWidth: 0 }} noWrap>{t.subject}</Typography>
                {t.unread > 0 && <Chip size="small" color="primary" label={t.unread} />}
              </Box>}
              secondary={(staff && t.customer_name ? t.customer_name + ' · ' : '') + (t.last_message || '')}
              secondaryTypographyProps={{ noWrap: true }} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );

  const pane = current && (
    <Paper variant="outlined" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: narrow ? 'none' : '70vh' }}>
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        {narrow && <Button size="small" onClick={() => setCurrent(null)} sx={{ textTransform: 'none' }}>Back</Button>}
        <Typography sx={{ fontWeight: 700, flex: 1 }}>{current.subject}</Typography>
        {staff && current.customer_name && <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{current.customer_name}</Typography>}
        <Chip size="small" label={statusLabel(current.status)} />
        {staff && edit && <Button size="small" onClick={() => setStatus(current.status === 'open' ? 'closed' : 'open')} sx={{ textTransform: 'none' }}>
          {current.status === 'open' ? 'Close conversation' : 'Reopen conversation'}</Button>}
      </Box>
      <Box sx={{ p: 1.5, overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {(current.messages || []).map((m: any) => (
          <Box key={m.id} sx={{ alignSelf: m.mine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <Box sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: m.mine ? 'primary.main' : 'action.hover', color: m.mine ? 'primary.contrastText' : 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.body}</Box>
            <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', textAlign: m.mine ? 'right' : 'left', mt: 0.25 }}>
              {(m.mine ? '' : (m.author_name ? m.author_name + ' · ' : '')) + fmtDate(m.at, { dateStyle: 'medium', timeStyle: 'short' })}
            </Typography>
          </Box>
        ))}
        <div ref={endRef} />
      </Box>
      {edit && (current.status === 'open' ? (
        <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
          <TextField fullWidth size="small" multiline maxRows={5} placeholder="Write a message" value={draft}
            onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <Button variant="contained" disabled={!draft.trim()} onClick={send} sx={{ textTransform: 'none' }}>Send</Button>
        </Box>
      ) : <Typography sx={{ p: 1.5, color: 'text.secondary', borderTop: 1, borderColor: 'divider' }}>This conversation is closed.</Typography>)}
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        {/* the count beside the title, not floating over the button */}
        <Box sx={{ flex: 1 }}>
          <Badge color="primary" badgeContent={totalUnread}>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, pe: 1 }}>Messages</Typography>
          </Badge>
        </Box>
        {edit && <Button variant="contained" onClick={() => setStarting({ subject: '', body: '', customer_id: '', booking_id: '' })} sx={{ textTransform: 'none' }}>New conversation</Button>}
      </Box>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2 }}>{tx(channelLine)}</Typography>
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
        {(!narrow || !current) && list}
        {pane || (!narrow && <Paper variant="outlined" sx={{ flex: 1, p: 3, color: 'text.secondary' }}>Choose a conversation.</Paper>)}
      </Box>

      <Dialog open={!!starting} onClose={() => setStarting(null)} fullWidth maxWidth="sm">
        <DialogTitle>New conversation</DialogTitle>
        <DialogContent>
          {staff && <TextField select fullWidth margin="dense" label="With" value={starting?.customer_id || ''} onChange={e => setStarting({ ...starting, customer_id: e.target.value })}>
            {people.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </TextField>}
          {!staff && <TextField select fullWidth margin="dense" label="Booking" value={starting?.booking_id || ''}
            helperText={bookings.length === 0 ? 'You have no active bookings to message about.' : ''}
            onChange={e => {
              const b = bookings.find(x => String(x.id) === String(e.target.value));
              setStarting({ ...starting, booking_id: e.target.value,
                subject: starting?.subject || (b ? 'Booking with ' + (b.caregiver_name || 'caregiver') + (b.date ? ' on ' + fmtDate(b.date) : '') : '') });
            }}>
            {bookings.map(b => <MenuItem key={b.id} value={String(b.id)}>{(b.caregiver_name || 'Caregiver') + (b.date ? ' · ' + fmtDate(b.date) : '') + (b.start_time ? ' ' + b.start_time : '')}</MenuItem>)}
          </TextField>}
          <TextField fullWidth margin="dense" label="Subject" value={starting?.subject || ''} onChange={e => setStarting({ ...starting, subject: e.target.value })} />
          <TextField fullWidth margin="dense" multiline minRows={3} label="Message" value={starting?.body || ''} onChange={e => setStarting({ ...starting, body: e.target.value })} />
        </DialogContent>
        <DialogActions><Button onClick={() => setStarting(null)}>Cancel</Button>
          <Button variant="contained" disabled={!starting?.subject || !starting?.body || (staff && !starting?.customer_id) || (!staff && !starting?.booking_id)} onClick={start}>Send</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default Messages;
