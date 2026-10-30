import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert, Switch, Chip, Divider } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import { useToast } from '../components/ToastProvider';
import api from '../api';

interface FormState { [k: string]: any; }

const REQUIRED_FIELDS: string[] = ["weekly_schedule"];
const EMAIL_FIELDS: string[] = [];

// The weekly schedule is saved as JSON text: { Mon: { on, start, end }, ... }.
// Blocked-off days are saved as comma-separated ISO dates.
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
type DaySlot = { on: boolean; start: string; end: string };
const emptyWeek = (): Record<string, DaySlot> =>
  Object.fromEntries(DAYS.map(d => [d, { on: false, start: '09:00', end: '17:00' }]));
const parseWeek = (v: any): Record<string, DaySlot> => {
  const base = emptyWeek();
  try {
    const o = typeof v === 'string' ? (v.trim() ? JSON.parse(v) : {}) : (v || {});
    DAYS.forEach(d => { if (o?.[d]) base[d] = { ...base[d], ...o[d] }; });
  } catch { /* text from before the schedule editor: start from an empty week */ }
  return base;
};
const parseDays = (v: any): string[] =>
  (Array.isArray(v) ? v : String(v || '').split(',')).map((x: any) => String(x).trim()).filter(Boolean).sort();

const CaregiverAvailability: React.FC = () => {
  const theme = useAppTheme();
  const showToast = useToast();
  const [form, setForm] = useState<FormState>({ weekly_schedule: "", blocked_days: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [week, setWeek] = useState<Record<string, DaySlot>>(emptyWeek());
  const [blocked, setBlocked] = useState<string[]>([]);
  const [newBlocked, setNewBlocked] = useState('');
  const [saved, setSaved] = useState<'ok' | 'fail' | null>(null);

  useEffect(() => {
    // Single-entity form: unwrap r.data OR r.data.data (wrapper) OR r.data.item
    api.get('/api/caregiver_availability')
      .then(r => {
        const d = r?.data;
        const payload = (d && typeof d === 'object' && !Array.isArray(d))
          ? (d.data && typeof d.data === 'object' ? d.data : (d.item && typeof d.item === 'object' ? d.item : d))
          : d;
        if (payload && typeof payload === 'object') {
          setForm({ ...{ weekly_schedule: "", blocked_days: "" }, ...payload });
          setWeek(parseWeek(payload.weekly_schedule));
          setBlocked(parseDays(payload.blocked_days));
        }
      })
      .catch(err => {
        // 404 is fine for a new user — they haven't saved yet. Surface
        // anything else to the console so it's not invisible.
        if (err?.response?.status !== 404) {
          console.error('[caregiver_availability] load failed:', err?.response?.status, err?.message);
        }
      })
      .finally(() => {
        setLoading(false);
        // A new account has saved nothing yet, so a required email field
        // started empty and the first Save failed validation
        // (healthcare_marketplace001234 Settings: "notification email").
        // The signed-in user's own address is the obvious starting value.
        if (EMAIL_FIELDS.length) {
          api.get('/api/auth/me').then(r => {
            const u: any = r?.data?.user ?? r?.data ?? {};
            if (!u?.email) return;
            setForm(prev => {
              const next = { ...prev };
              EMAIL_FIELDS.forEach(f => { if (!next[f]) next[f] = u.email; });
              return next;
            });
          }).catch(() => {});
        }
      });
  }, []);

  // The structured editors write back into the form the server reads.
  const updateDay = (d: string, patch: Partial<DaySlot>) => {
    const next = { ...week, [d]: { ...week[d], ...patch } };
    setWeek(next);
    setForm(f => ({ ...f, weekly_schedule: DAYS.some(x => next[x].on) ? JSON.stringify(next) : '' }));
  };
  const updateBlocked = (next: string[]) => {
    setBlocked(next);
    setForm(f => ({ ...f, blocked_days: next.join(',') }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const badDay = DAYS.find(d => week[d].on && week[d].start >= week[d].end);
    if (badDay) errors.weekly_schedule = `${badDay}: the end time must be after the start time`;
    for (const f of REQUIRED_FIELDS) {
      const v = form[f];
      if (v === undefined || v === null || v === '' ||
          (typeof v === 'string' && v.trim() === '')) {
        errors[f] = f === 'weekly_schedule' ? 'Turn on at least one day you can work' : 'This field is required';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    setSaving(true);
    setSaved(null);
    try {
      await api.put('/api/caregiver_availability', form);
      showToast('Availability saved', 'success');
      setSaved('ok');
    } catch {
      showToast('Save failed. Please try again.', 'error');
      setSaved('fail');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 720, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 3 }}>
        Availability
      </Typography>

      <Paper sx={{ p: 3, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        {saved === 'ok' && <Alert severity="success" sx={{ mb: 2 }}>Your availability is saved. Families see it on your profile.</Alert>}
        {saved === 'fail' && <Alert severity="error" sx={{ mb: 2 }}>Your availability could not be saved. Please try again.</Alert>}
        <Typography component="h2" sx={{ fontSize: '1.1rem', fontWeight: 600, color: theme.text, mb: 1 }}>Weekly schedule</Typography>
        {DAYS.map(d => (
          <Box key={d} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, flexWrap: 'wrap' }}>
            <Switch checked={week[d].on} onChange={e => updateDay(d, { on: e.target.checked })} inputProps={{ 'aria-label': d }} />
            <Typography sx={{ width: 48, fontWeight: 600, color: theme.text, fontSize: '1.05rem' }}>{d}</Typography>
            {week[d].on ? (
              <>
                <TextField type="time" size="small" label="From" InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} value={week[d].start} onChange={e => updateDay(d, { start: e.target.value })} />
                <TextField type="time" size="small" label="Until" InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }} value={week[d].end} onChange={e => updateDay(d, { end: e.target.value })} />
              </>
            ) : <Typography sx={{ color: theme.textSecondary }}>Not available</Typography>}
          </Box>
        ))}
        {formErrors.weekly_schedule && <Typography sx={{ color: theme.error, fontSize: '0.85rem', mt: 1 }}>{formErrors.weekly_schedule}</Typography>}

        <Divider sx={{ my: 3 }} />
        <Typography component="h2" sx={{ fontSize: '1.1rem', fontWeight: 600, color: theme.text, mb: 1 }}>Blocked-off days</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 1.5 }}>
          <TextField type="date" size="small" label="Date" InputLabelProps={{ shrink: true }} value={newBlocked} onChange={e => setNewBlocked(e.target.value)} />
          <Button variant="outlined" disabled={!newBlocked || blocked.includes(newBlocked)}
            onClick={() => { updateBlocked([...blocked, newBlocked].sort()); setNewBlocked(''); }}
            sx={{ textTransform: 'none', minHeight: 40 }}>Block this day</Button>
        </Box>
        {blocked.length === 0 && <Typography sx={{ color: theme.textSecondary }}>No days blocked off.</Typography>}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {blocked.map(b => <Chip key={b} label={b} onDelete={() => updateBlocked(blocked.filter(x => x !== b))} />)}
        </Box>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" onClick={handleSave} disabled={saving}
            sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600,
                  '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CaregiverAvailability;
