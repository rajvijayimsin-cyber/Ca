import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Paper, TextField, MenuItem, Checkbox, Chip, Tabs, Tab,
         CircularProgress, Alert, FormControlLabel, Switch, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useAppTheme } from '../hooks/useAppTheme';
import { useToast } from '../components/ToastProvider';
import { loadSession, canWrite } from '../auth/session';
import api from '../api';

const listOf = (d: any): any[] => Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items
  : Array.isArray(d?.results) ? d.results : Array.isArray(d?.data) ? d.data : [];
const nameOf = (o: any): string => String(o?.full_name ?? ([o?.first_name, o?.last_name].filter(Boolean).join(' ') || undefined)
  ?? o?.name ?? o?.title ?? o?.email ?? o?.id ?? '');
const num = (v: any, d: number) => (v === '' || v == null || isNaN(Number(v)) ? d : Number(v));

type Line = { c: any; met: boolean; why: string };

/** The whole rule, in one place: weight met against the threshold, and every
 *  required criterion present. Every line says why. */
export function evaluate(set: any, criteria: any[], met: Set<string>) {
  const lines: Line[] = criteria.map(c => {
    const isMet = met.has(String(c.id));
    const req = !!c.required;
    return { c, met: isMet,
      why: isMet ? 'Met — marked present'
        : req ? 'Missing — required for this set' : 'Missing — not marked present' };
  });
  const score = lines.filter(l => l.met).reduce((s, l) => s + num(l.c.weight, 1), 0);
  const total = criteria.reduce((s, c) => s + num(c.weight, 1), 0);
  const threshold = num(set?.threshold, total);
  const missingRequired = lines.filter(l => !l.met && l.c.required);
  const meets = criteria.length > 0 && score >= threshold && missingRequired.length === 0;
  const reason = criteria.length === 0 ? 'This set has no criteria yet.'
    : missingRequired.length ? `Required criterion ${missingRequired.map(l => l.c.code || l.c.text).join(', ')} is missing.`
    : score >= threshold ? `${score} of ${total} met; the threshold is ${threshold}.`
    : `${score} of ${total} met; the threshold is ${threshold}, so ${threshold - score} more needed.`;
  return { lines, score, total, threshold, meets, reason };
}

const Privacy: React.FC = () => {
  const theme = useAppTheme();
  const showToast = useToast();
  const [tab, setTab] = useState(0);
  const [sets, setSets] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [checks, setChecks] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [setId, setSetId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [met, setMet] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [newSet, setNewSet] = useState<any>({ name: '', threshold: '' });
  const [newCrit, setNewCrit] = useState<any>({ code: '', text: '', weight: 1, required: false });
  useEffect(() => { loadSession().then(s => setCanEdit(canWrite(s.role))); }, []);

  const load = () => Promise.all([
      api.get('/api/privacy_sets', { params: { limit: 200 } }).then(r => setSets(listOf(r?.data))).catch(() => setSets([])),
      api.get('/api/privacy_criteria', { params: { limit: 500 } }).then(r => setCriteria(listOf(r?.data))).catch(() => setCriteria([])),
      api.get('/api/privacy_checks', { params: { limit: 50, sort: 'checked_at', order: 'desc' } }).then(r => setChecks(listOf(r?.data))).catch(() => setChecks([])),
  ]).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = sets.find(s => String(s.id) === setId);
  const inSet = useMemo(() => criteria.filter(c => String(c.set_id) === setId), [criteria, setId]);
  const result = useMemo(() => evaluate(set, inSet, met), [set, inSet, met]);
  const toggle = (id: string) => setMet(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const saveCheck = async () => {
    if (!set) { showToast('Choose a criteria set first', 'error'); return; }
    setSaving(true);
    try {
      await api.post('/api/privacy_checks', { set_id: set.id, met_ids: Array.from(met),
        score: result.score, threshold: result.threshold, result: result.meets ? 'meets' : 'does_not_meet',
        reason: result.reason, notes, checked_at: new Date().toISOString() });
      showToast('Check saved', 'success'); setNotes(''); load();
    } catch { showToast('Could not save the check', 'error'); }
    finally { setSaving(false); }
  };
  const addSet = async () => {
    if (!newSet.name.trim()) return;
    try { await api.post('/api/privacy_sets', { name: newSet.name.trim(), threshold: num(newSet.threshold, 0) });
      setNewSet({ name: '', threshold: '' }); load(); } catch { showToast('Could not add the set', 'error'); }
  };
  const addCrit = async () => {
    if (!setId || !newCrit.text.trim()) { showToast('Choose a set and enter the criterion', 'error'); return; }
    try { await api.post('/api/privacy_criteria', { set_id: setId, code: newCrit.code.trim(), text: newCrit.text.trim(),
        weight: num(newCrit.weight, 1), required: !!newCrit.required });
      setNewCrit({ code: '', text: '', weight: 1, required: false }); load(); } catch { showToast('Could not add the criterion', 'error'); }
  };

  const card = { p: 2.5, border: `1px solid ${theme.border}`, bgcolor: theme.surface, borderRadius: 2, mb: 2 };
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily, maxWidth: 1000 }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 1 }}>Trust, Safety and Privacy Rules</Typography>
      <Typography sx={{ color: theme.textSecondary, fontSize: '0.85rem', mb: 2 }}>Decision support only. The result does not replace professional judgment.</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Check" sx={{ textTransform: 'none' }} />
        <Tab label="Criteria library" sx={{ textTransform: 'none' }} />
        <Tab label="Saved checks" sx={{ textTransform: 'none' }} />
      </Tabs>
      {loading ? <CircularProgress size={22} /> : tab === 0 ? (
        <>
          <Paper sx={card}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField select size="small" label="Criteria set" value={setId} onChange={e => { setSetId(String(e.target.value)); setMet(new Set()); }} sx={{ minWidth: 260 }}>
                {sets.map(s => <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>)}
              </TextField>

            </Box>
            {sets.length === 0 && <Alert severity="info" sx={{ mt: 2 }}>No criteria sets yet. Add them under Criteria library, from your licensed source.</Alert>}
          </Paper>
          {set && (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, alignItems: 'start' }}>
              <Paper sx={card}>
                {result.lines.length === 0 && <Typography sx={{ color: theme.textSecondary }}>This set has no criteria yet.</Typography>}
                {result.lines.map(l => (
                  <Box key={l.c.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 1, borderTop: `1px solid ${theme.border}` }}>
                    <Checkbox size="small" checked={l.met} onChange={() => toggle(String(l.c.id))} sx={{ p: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, color: theme.text, fontSize: '0.92rem' }}>
                        {l.c.code ? l.c.code + ' · ' : ''}{l.c.text} {l.c.required && <Chip size="small" label="required" sx={{ ml: 0.5, height: 18, fontSize: '0.65rem' }} />}
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: l.met ? theme.success : (l.c.required ? theme.error : theme.textSecondary) }}>{l.why}</Typography>
                    </Box>
                    {l.met ? <CheckCircleIcon sx={{ color: theme.success }} fontSize="small" />
                      : l.c.required ? <CancelIcon sx={{ color: theme.error }} fontSize="small" />
                      : <RadioButtonUncheckedIcon sx={{ color: theme.textSecondary }} fontSize="small" />}
                  </Box>
                ))}
              </Paper>
              <Paper sx={card}>
                <Typography sx={{ fontSize: '0.8rem', color: theme.textSecondary }}>Result</Typography>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: result.meets ? theme.success : theme.text, mb: 0.5 }}>
                  {result.meets ? 'Meets the criteria' : 'Does not meet the criteria'}
                </Typography>
                <Typography sx={{ color: theme.text, mb: 2 }}>{result.reason}</Typography>
                <TextField fullWidth multiline minRows={2} size="small" label="Notes" value={notes} onChange={e => setNotes(e.target.value)} sx={{ mb: 2 }} />
                {canEdit && <Button variant="contained" onClick={saveCheck} disabled={saving} sx={{ bgcolor: theme.primary, textTransform: 'none' }}>{saving ? 'Saving…' : 'Save check'}</Button>}
              </Paper>
            </Box>
          )}
        </>
      ) : tab === 1 ? (
        <Paper sx={card}>
          {canEdit && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <TextField size="small" label="New set name" value={newSet.name} onChange={e => setNewSet({ ...newSet, name: e.target.value })} />
              <TextField size="small" type="number" label="Threshold" value={newSet.threshold} onChange={e => setNewSet({ ...newSet, threshold: e.target.value })} sx={{ width: 120 }} />
              <Button variant="outlined" onClick={addSet} sx={{ textTransform: 'none' }}>Add set</Button>
            </Box>
          )}
          <TextField select size="small" label="Set" value={setId} onChange={e => setSetId(String(e.target.value))} sx={{ minWidth: 260, mb: 2 }}>
            {sets.map(s => <MenuItem key={s.id} value={String(s.id)}>{s.name} — threshold {s.threshold ?? '—'}</MenuItem>)}
          </TextField>
          {inSet.map(c => (
            <Typography key={c.id} sx={{ py: 0.75, borderTop: `1px solid ${theme.border}`, color: theme.text, fontSize: '0.9rem' }}>
              {c.code ? c.code + ' · ' : ''}{c.text} <span style={{ color: theme.textSecondary }}>· weight {c.weight ?? 1}{c.required ? ' · required' : ''}</span>
            </Typography>
          ))}
          {canEdit && setId && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField size="small" label="Code" value={newCrit.code} onChange={e => setNewCrit({ ...newCrit, code: e.target.value })} sx={{ width: 100 }} />
                <TextField size="small" label="Criterion" value={newCrit.text} onChange={e => setNewCrit({ ...newCrit, text: e.target.value })} sx={{ flex: '1 1 260px' }} />
                <TextField size="small" type="number" label="Weight" value={newCrit.weight} onChange={e => setNewCrit({ ...newCrit, weight: e.target.value })} sx={{ width: 90 }} />
                <FormControlLabel control={<Switch checked={!!newCrit.required} onChange={e => setNewCrit({ ...newCrit, required: e.target.checked })} />} label="Required" />
                <Button variant="outlined" onClick={addCrit} sx={{ textTransform: 'none' }}>Add criterion</Button>
              </Box>
            </>
          )}
        </Paper>
      ) : (
        <Paper sx={card}>
          {checks.length === 0 && <Typography sx={{ color: theme.textSecondary }}>No saved checks yet.</Typography>}
          {checks.map((k, i) => (
            <Box key={k.id ?? i} sx={{ py: 1, borderTop: i ? `1px solid ${theme.border}` : 'none' }}>
              <Typography sx={{ fontWeight: 600, color: theme.text }}>
                {sets.find(s => String(s.id) === String(k.set_id))?.name || 'Check'}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                {k.result === 'meets' ? 'Meets' : 'Does not meet'} · {k.reason || ''} · {k.checked_at ? new Date(k.checked_at).toLocaleString() : ''}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default Privacy;
