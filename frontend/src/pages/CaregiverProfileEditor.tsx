import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert, Avatar, Chip, InputAdornment } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import { useToast } from '../components/ToastProvider';
import api from '../api';

interface FormState { [k: string]: any; }

const SERVICES = ['Companionship', 'Personal care', 'Meal prep', 'Medication reminders', 'Mobility help', 'Dementia care'];
const LANGUAGES = ['English', 'Spanish', 'Chinese', 'Tagalog', 'Vietnamese', 'French', 'Arabic', 'Korean', 'Russian', 'Portuguese'];
const RATE_MIN = 15;
const RATE_MAX = 60;
const EMPTY: FormState = { photo_url: '', bio: '', services_offered: [], hourly_rate: '', languages: [], service_area_zip: '', service_area_radius: '' };

// Lists are saved as arrays; an older record may hold comma-separated text.
const asList = (v: any): string[] =>
  Array.isArray(v) ? v.map(String) : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : [];

const CaregiverProfileEditor: React.FC = () => {
  const theme = useAppTheme();
  const showToast = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<'ok' | 'fail' | null>(null);

  useEffect(() => {
    api.get('/api/caregivers/me')
      .then(r => {
        const d = r?.data;
        const p = d?.data && typeof d.data === 'object' ? d.data : d;
        if (p && typeof p === 'object') {
          setForm({ ...EMPTY, ...p, services_offered: asList(p.services_offered), languages: asList(p.languages) });
        }
      })
      .catch(err => {
        // 404: a new caregiver who has not saved a profile yet.
        if (err?.response?.status !== 404) console.error('[caregivers/me] load failed:', err?.response?.status, err?.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (k: string, v: string) => {
    const cur: string[] = form[k] || [];
    set(k, cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    const rate = Number(form.hourly_rate);
    if (form.hourly_rate === '' || !(rate >= RATE_MIN && rate <= RATE_MAX)) e.hourly_rate = `Set a rate between $${RATE_MIN} and $${RATE_MAX}`;
    if (!String(form.bio || '').trim()) e.bio = 'Tell families a little about yourself';
    if (!(form.services_offered || []).length) e.services_offered = 'Pick at least one service';
    if (!(form.languages || []).length) e.languages = 'Pick at least one language';
    if (!/^\d{5}$/.test(String(form.service_area_zip || ''))) e.service_area_zip = 'Enter a 5-digit ZIP code';
    const radius = Number(form.service_area_radius);
    if (!(radius > 0 && radius <= 100)) e.service_area_radius = 'Enter a radius between 1 and 100 miles';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    setSaved(null);
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put('/api/caregivers/me', {
        photo_url: form.photo_url, bio: form.bio,
        services_offered: form.services_offered, languages: form.languages,
        hourly_rate: Number(form.hourly_rate),
        service_area_zip: form.service_area_zip, service_area_radius: Number(form.service_area_radius),
      });
      showToast('Profile saved', 'success');
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

  const chipGroup = (k: string, options: string[]) => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
      {options.map(o => {
        const on = (form[k] || []).includes(o);
        return <Chip key={o} label={o} clickable color={on ? 'primary' : 'default'} variant={on ? 'filled' : 'outlined'}
          onClick={() => toggle(k, o)} sx={{ minHeight: 40, fontSize: '0.95rem' }} />;
      })}
    </Box>
  );
  const section = { fontSize: '1.05rem', fontWeight: 600, color: theme.text, mt: 3 };

  return (
    <Box sx={{ p: 3, maxWidth: 720, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 3 }}>
        Edit Profile
      </Typography>

      <Paper sx={{ p: 3, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        {saved === 'ok' && <Alert severity="success" sx={{ mb: 2 }}>Your profile is saved. Families see these details once you are verified.</Alert>}
        {saved === 'fail' && <Alert severity="error" sx={{ mb: 2 }}>Your profile could not be saved. Please try again.</Alert>}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={form.photo_url || undefined} sx={{ width: 72, height: 72 }} />
          <TextField fullWidth margin="normal" label="Photo link" value={form.photo_url ?? ''} onChange={e => set('photo_url', e.target.value)}
            helperText="A friendly, recent photo of your face" />
        </Box>

        <TextField fullWidth multiline minRows={4} margin="normal" label="About you" value={form.bio ?? ''} onChange={e => set('bio', e.target.value)}
          error={!!formErrors.bio} helperText={formErrors.bio || 'Your experience, how you work, what families can expect'} />

        <TextField margin="normal" type="number" label="Hourly rate" value={form.hourly_rate ?? ''} onChange={e => set('hourly_rate', e.target.value)}
          inputProps={{ min: RATE_MIN, max: RATE_MAX, step: 1 }}
          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, endAdornment: <InputAdornment position="end">/hr</InputAdornment> }}
          error={!!formErrors.hourly_rate} helperText={formErrors.hourly_rate || `Between $${RATE_MIN} and $${RATE_MAX}`} sx={{ maxWidth: 260 }} />

        <Typography sx={section}>Services offered</Typography>
        {chipGroup('services_offered', SERVICES)}
        {formErrors.services_offered && <Typography sx={{ color: theme.error, fontSize: '0.8rem', mt: 0.5 }}>{formErrors.services_offered}</Typography>}

        <Typography sx={section}>Languages</Typography>
        {chipGroup('languages', LANGUAGES)}
        {formErrors.languages && <Typography sx={{ color: theme.error, fontSize: '0.8rem', mt: 0.5 }}>{formErrors.languages}</Typography>}

        <Typography sx={section}>Service area</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField margin="normal" label="ZIP code" value={form.service_area_zip ?? ''} onChange={e => set('service_area_zip', e.target.value)}
            inputProps={{ inputMode: 'numeric', maxLength: 5 }} error={!!formErrors.service_area_zip} helperText={formErrors.service_area_zip || ''} />
          <TextField margin="normal" type="number" label="Radius" value={form.service_area_radius ?? ''} onChange={e => set('service_area_radius', e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">miles</InputAdornment> }}
            error={!!formErrors.service_area_radius} helperText={formErrors.service_area_radius || ''} />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" onClick={handleSave} disabled={saving}
            sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, minHeight: 48, px: 4,
                  '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CaregiverProfileEditor;
