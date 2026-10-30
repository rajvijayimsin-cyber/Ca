import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Button, TextField, MenuItem, Stepper, Step, StepLabel, Alert, Chip,
  FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, ToggleButton, ToggleButtonGroup, Divider, CircularProgress } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';
import { apiGet, apiPost } from '../apiWithMock';
import { useToast } from '../components/ToastProvider';
import { fmtMoney } from '../i18n';

// Shown to the family as an estimate; the server prices the booking itself.
const PLATFORM_FEE_PCT = 10;
const SURCHARGE_PCT = 15;
const MIN_HOURS = 2;
const CARE_NEEDS = ['Companionship', 'Personal care', 'Meal prep', 'Medication reminders', 'Mobility help', 'Dementia care'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STEPS = ['Date and time', 'Care recipient', 'Price summary'];

const listOf = (d: any): any[] =>
  Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.results) ? d.results
    : Array.isArray(d?.data) ? d.data : [];

const usd = (n: number) => fmtMoney(Math.round(n * 100) / 100, 'USD');

// Splits the visit into 30-minute slots and counts those that fall on a
// weekend or at night (8pm to 6am), which carry the surcharge.
const surchargeHours = (date: string, start: string, hours: number): number => {
  if (!date || !start || !hours) return 0;
  const begin = new Date(`${date}T${start}:00`);
  if (isNaN(begin.getTime())) return 0;
  let extra = 0;
  for (let i = 0; i < Math.round(hours * 2); i++) {
    const t = new Date(begin.getTime() + i * 30 * 60000);
    const weekend = t.getDay() === 0 || t.getDay() === 6;
    const night = t.getHours() >= 20 || t.getHours() < 6;
    if (weekend || night) extra += 0.5;
  }
  return extra;
};

const BookingWizard: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const showToast = useToast();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState<any>({
    caregiver_id: searchParams.get('caregiver_id') || '',
    date: '', start_time: '09:00', duration_hours: MIN_HOURS,
    recurring: 'one_time', recurring_days: [] as string[],
    care_recipient_name: '', care_recipient_age: '', care_recipient_address: '',
    care_needs: [] as string[], notes: '', emergency_contact: '',
    payment_method_id: '',
  });

  useEffect(() => {
    Promise.all([
      // only verified caregivers can be booked
      apiGet('/api/caregivers?verified=true&limit=100').then(r => setCaregivers(listOf(r.data))).catch(() => setCaregivers([])),
      apiGet('/api/payment_methods').then(r => setCards(listOf(r.data))).catch(() => setCards([])),
    ]).finally(() => setLoading(false));
  }, []);

  const caregiver = caregivers.find(c => String(c.id) === String(form.caregiver_id));
  const rate = Number(caregiver?.hourly_rate) || 0;

  const price = useMemo(() => {
    const hours = Number(form.duration_hours) || 0;
    const base = rate * hours;
    const extraHours = surchargeHours(form.date, form.start_time, hours);
    const surcharge = rate * extraHours * SURCHARGE_PCT / 100;
    const fee = (base + surcharge) * PLATFORM_FEE_PCT / 100;
    return { hours, base, extraHours, surcharge, fee, total: base + surcharge + fee };
  }, [rate, form.duration_hours, form.date, form.start_time]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.caregiver_id) e.caregiver_id = 'Choose a caregiver';
      if (!form.date) e.date = 'Choose a date';
      else if (new Date(form.date + 'T23:59:59') < new Date()) e.date = 'Choose a date that has not passed';
      if (!form.start_time) e.start_time = 'Choose a start time';
      const h = Number(form.duration_hours);
      if (!(h >= MIN_HOURS)) e.duration_hours = `The minimum booking is ${MIN_HOURS} hours`;
      else if (Math.round(h * 2) !== h * 2) e.duration_hours = 'Use 30-minute steps (for example 2.5)';
      if (form.recurring === 'specific_days' && form.recurring_days.length === 0) e.recurring_days = 'Pick at least one day';
    }
    if (s === 1) {
      if (!form.care_recipient_name.trim()) e.care_recipient_name = 'Enter the care recipient\'s name';
      const age = Number(form.care_recipient_age);
      if (!form.care_recipient_age || !(age > 0 && age < 130)) e.care_recipient_age = 'Enter a valid age';
      if (!form.care_recipient_address.trim()) e.care_recipient_address = 'Enter the address for the visit';
      if (form.care_needs.length === 0) e.care_needs = 'Pick at least one care need';
      if (!form.emergency_contact.trim()) e.emergency_contact = 'Enter an emergency contact';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => Math.max(0, s - 1));

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const r = await apiPost('/api/bookings', {
        ...form,
        duration_hours: Number(form.duration_hours),
        care_recipient_age: Number(form.care_recipient_age),
        price_summary: {
          hourly_rate: rate, hours: price.hours, base: price.base, surcharge: price.surcharge,
          platform_fee: price.fee, total: price.total, currency: 'USD',
        },
      });
      showToast('Booking requested. The caregiver has 12 hours to accept.', 'success');
      const newId = r?.data?.id;
      navigate(newId ? '/bookings/' + newId : '/bookings/family');
    } catch (err: any) {
      const st = err?.response?.status;
      setSubmitError(!st ? 'The booking could not be sent because the server is not reachable. Nothing was booked.'
        : err?.response?.data?.detail ? String(err.response.data.detail) : 'The booking could not be requested. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const card = { p: { xs: 2, md: 3 }, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface };
  const bigBtn = { textTransform: 'none' as const, fontWeight: 600, minHeight: 48, px: 3, borderRadius: theme.borderRadius + 'px' };
  const line = (label: string, value: string, strong = false) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
      <Typography sx={{ color: strong ? theme.text : theme.textSecondary, fontWeight: strong ? 700 : 400, fontSize: strong ? '1.15rem' : '1rem' }}>{label}</Typography>
      <Typography sx={{ color: theme.text, fontWeight: strong ? 700 : 500, fontSize: strong ? '1.15rem' : '1rem' }}>{value}</Typography>
    </Box>
  );

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, maxWidth: 760, fontFamily: theme.fontFamily }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 2 }}>Book a Visit</Typography>
      <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      <Paper sx={card}>
        {step === 0 && (
          <Box>
            <TextField select fullWidth margin="normal" label="Caregiver" value={form.caregiver_id}
              onChange={e => set('caregiver_id', e.target.value)} error={!!errors.caregiver_id}
              helperText={errors.caregiver_id || (caregivers.length === 0 ? 'No verified caregivers are available yet.' : '')}>
              {caregivers.map(c => <MenuItem key={c.id} value={String(c.id)}>{c.name}{c.hourly_rate != null ? ` — $${c.hourly_rate}/hr` : ''}</MenuItem>)}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField margin="normal" type="date" label="Date" InputLabelProps={{ shrink: true }} value={form.date}
                onChange={e => set('date', e.target.value)} error={!!errors.date} helperText={errors.date || ''} sx={{ flex: 1, minWidth: 180 }} />
              <TextField margin="normal" type="time" label="Start time" InputLabelProps={{ shrink: true }} inputProps={{ step: 1800 }}
                value={form.start_time} onChange={e => set('start_time', e.target.value)} error={!!errors.start_time} helperText={errors.start_time || ''} sx={{ flex: 1, minWidth: 140 }} />
              <TextField margin="normal" type="number" label="Hours" inputProps={{ min: MIN_HOURS, step: 0.5 }}
                value={form.duration_hours} onChange={e => set('duration_hours', e.target.value)} error={!!errors.duration_hours}
                helperText={errors.duration_hours || `Minimum ${MIN_HOURS} hours, in 30-minute steps`} sx={{ flex: 1, minWidth: 140 }} />
            </Box>
            <FormControl sx={{ mt: 2 }} fullWidth>
              <FormLabel sx={{ mb: 1 }}>How often</FormLabel>
              <ToggleButtonGroup exclusive value={form.recurring} onChange={(_, v) => v && set('recurring', v)} sx={{ flexWrap: 'wrap' }}>
                <ToggleButton value="one_time" sx={{ textTransform: 'none', minHeight: 48 }}>One time</ToggleButton>
                <ToggleButton value="weekly" sx={{ textTransform: 'none', minHeight: 48 }}>Weekly</ToggleButton>
                <ToggleButton value="specific_days" sx={{ textTransform: 'none', minHeight: 48 }}>Specific days</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            {form.recurring === 'specific_days' && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {WEEKDAYS.map(d => {
                    const on = form.recurring_days.includes(d);
                    return <Chip key={d} label={d} clickable color={on ? 'primary' : 'default'} variant={on ? 'filled' : 'outlined'}
                      onClick={() => set('recurring_days', on ? form.recurring_days.filter((x: string) => x !== d) : [...form.recurring_days, d])}
                      sx={{ minHeight: 40, fontSize: '0.95rem' }} />;
                  })}
                </Box>
                {errors.recurring_days && <Typography sx={{ color: theme.error, fontSize: '0.8rem', mt: 0.5 }}>{errors.recurring_days}</Typography>}
              </Box>
            )}
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 1 }}>The address and care needs are shared with the caregiver only after they accept the booking.</Alert>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField margin="normal" label="Care recipient's name" value={form.care_recipient_name} onChange={e => set('care_recipient_name', e.target.value)}
                error={!!errors.care_recipient_name} helperText={errors.care_recipient_name || ''} sx={{ flex: 2, minWidth: 220 }} />
              <TextField margin="normal" type="number" label="Age" value={form.care_recipient_age} onChange={e => set('care_recipient_age', e.target.value)}
                error={!!errors.care_recipient_age} helperText={errors.care_recipient_age || ''} sx={{ flex: 1, minWidth: 100 }} />
            </Box>
            <TextField fullWidth margin="normal" label="Address for the visit" value={form.care_recipient_address} onChange={e => set('care_recipient_address', e.target.value)}
              error={!!errors.care_recipient_address} helperText={errors.care_recipient_address || ''} />
            <FormControl component="fieldset" error={!!errors.care_needs} sx={{ mt: 2 }}>
              <FormLabel component="legend">Care needs</FormLabel>
              <FormGroup row>
                {CARE_NEEDS.map(n => (
                  <FormControlLabel key={n} label={n} sx={{ minWidth: 220 }}
                    control={<Checkbox checked={form.care_needs.includes(n)}
                      onChange={e => set('care_needs', e.target.checked ? [...form.care_needs, n] : form.care_needs.filter((x: string) => x !== n))} />} />
                ))}
              </FormGroup>
              {errors.care_needs && <Typography sx={{ color: theme.error, fontSize: '0.8rem' }}>{errors.care_needs}</Typography>}
            </FormControl>
            <TextField fullWidth multiline minRows={3} margin="normal" label="Notes for the caregiver" value={form.notes} onChange={e => set('notes', e.target.value)} />
            <TextField fullWidth margin="normal" label="Emergency contact (name and phone)" value={form.emergency_contact} onChange={e => set('emergency_contact', e.target.value)}
              error={!!errors.emergency_contact} helperText={errors.emergency_contact || ''} />
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography component="h2" sx={{ fontSize: '1.15rem', fontWeight: 600, color: theme.text, mb: 1 }}>
              {caregiver?.name || 'Caregiver'} · {form.date} at {form.start_time} · {price.hours} hours
              {form.recurring === 'weekly' ? ' · weekly' : form.recurring === 'specific_days' ? ` · every ${form.recurring_days.join(', ')}` : ''}
            </Typography>
            {line(`$${rate}/hr × ${price.hours} hours`, usd(price.base))}
            {line(`Night and weekend surcharge (+${SURCHARGE_PCT}% on ${price.extraHours} hours)`, usd(price.surcharge))}
            {line(`Platform fee (${PLATFORM_FEE_PCT}%)`, usd(price.fee))}
            <Divider sx={{ my: 1 }} />
            {line(form.recurring === 'one_time' ? 'Total' : 'Total per visit', usd(price.total), true)}
            <Typography sx={{ color: theme.textSecondary, fontSize: '0.9rem', mt: 1 }}>
              Your card is authorized now and charged after the visit, for the hours actually worked and never more than booked unless you approve extra time.
              Cancel free until 24 hours before the visit; after that, 50% is charged.
            </Typography>
            <TextField select fullWidth margin="normal" label="Card" value={form.payment_method_id} onChange={e => set('payment_method_id', e.target.value)}
              helperText={cards.length === 0 ? 'No saved card yet. You can add one on Payments & Receipts.' : ''}>
              {cards.map(c => <MenuItem key={c.id} value={String(c.id)}>{(c.brand || 'Card')} ending {c.last4 || '••••'}</MenuItem>)}
            </TextField>
            {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, gap: 2 }}>
          <Button onClick={back} disabled={step === 0 || submitting} variant="outlined"
            sx={{ ...bigBtn, borderColor: theme.border, color: theme.text }}>Back</Button>
          {step < STEPS.length - 1
            ? <Button variant="contained" onClick={next} sx={{ ...bigBtn, bgcolor: theme.primary, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>Next</Button>
            : <Button variant="contained" onClick={handleSubmit} disabled={submitting || !form.payment_method_id}
                sx={{ ...bigBtn, bgcolor: theme.primary, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
                {submitting ? 'Sending...' : 'Request booking'}
              </Button>}
        </Box>
      </Paper>
    </Box>
  );
};

export default BookingWizard;
