import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Paper, InputAdornment, CircularProgress, MenuItem, Grid, Avatar, Chip, Rating,
} from '@mui/material';
import { Search as SearchIcon, Verified as VerifiedIcon, Inbox as InboxIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';
import api from '../api';
import type { Caregiver } from '../types/blueprint';

type Row = Caregiver & { id?: number | string; [k: string]: any };

const SERVICES = ['Companionship', 'Personal care', 'Meal prep', 'Medication reminders', 'Mobility help', 'Dementia care'];
const LANGUAGES = ['English', 'Spanish', 'Chinese', 'Tagalog', 'Vietnamese', 'French', 'Arabic', 'Korean', 'Russian', 'Portuguese'];

const asList = (v: any): string[] =>
  Array.isArray(v) ? v.map(String) : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : [];

const CaregiverSearch: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [service, setService] = useState('');
  const [zip, setZip] = useState('');
  const [date, setDate] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [minRating, setMinRating] = useState('');
  const [language, setLanguage] = useState('');
  const [gender, setGender] = useState('');
  const [sortBy, setSortBy] = useState('best_match');

  // Server-side query, not a client-side filter: every filter and the sort go
  // to the server as params, and only verified caregivers are ever asked for.
  const [loadError, setLoadError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params: Record<string, any> = { page, limit, verified: true, sort: sortBy };
      if (search) params.search = search;
      if (service) params.service = service;
      if (zip) params.zip = zip;
      if (date) params.available_on = date;
      if (minRate) params.min_rate = minRate;
      if (maxRate) params.max_rate = maxRate;
      if (minRating) params.min_rating = minRating;
      if (language) params.language = language;
      if (gender) params.gender = gender;
      const r = await api.get('/api/caregivers', { params });
      const d = r?.data;
      setTotal(typeof d?.total === 'number' ? d.total : null);
      const arr = Array.isArray(d) ? d
        : Array.isArray(d?.items) ? d.items
        : Array.isArray(d?.results) ? d.results
        : Array.isArray(d?.data) ? d.data
        : [];
      setRows(arr);
    } catch (err: any) {
      console.error('[caregivers] load failed:', err?.response?.status, err?.message);
      setRows([]);
      setLoadError(
        err?.response?.status === 404
          ? 'Endpoint not available'
          : err?.response?.data?.detail || err?.message || 'Failed to load'
      );
    } finally {
      setLoading(false);
    }
  };

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => { load(); }, search || zip ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, service, zip, date, minRate, maxRate, minRating, language, gender, sortBy]);

  // Any filter change goes back to the first page.
  const f = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => { setter(e.target.value); setPage(1); };
  const clearFilters = () => {
    setSearch(''); setService(''); setZip(''); setDate(''); setMinRate(''); setMaxRate('');
    setMinRating(''); setLanguage(''); setGender(''); setSortBy('best_match'); setPage(1);
  };
  const card = { borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface };

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 2 }}>
        Find Caregivers
      </Typography>

      <Paper sx={{ ...card, p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField fullWidth size="small" placeholder="Search caregivers by name..." value={search} onChange={f(setSearch)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" label="ZIP code" value={zip} onChange={f(setZip)} inputProps={{ inputMode: 'numeric', maxLength: 5 }} />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" type="date" label="Available on" InputLabelProps={{ shrink: true }} value={date} onChange={f(setDate)} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField select fullWidth size="small" label="Service" value={service} onChange={f(setService)}>
              <MenuItem value="">Any service</MenuItem>
              {SERVICES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" type="number" label="Min $/hr" value={minRate} onChange={f(setMinRate)} />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField fullWidth size="small" type="number" label="Max $/hr" value={maxRate} onChange={f(setMaxRate)} />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth size="small" label="Rating" value={minRating} onChange={f(setMinRating)}>
              <MenuItem value="">Any rating</MenuItem>
              {['4.5', '4', '3'].map(r => <MenuItem key={r} value={r}>{r}+ stars</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth size="small" label="Language" value={language} onChange={f(setLanguage)}>
              <MenuItem value="">Any language</MenuItem>
              {LANGUAGES.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth size="small" label="Caregiver gender" value={gender} onChange={f(setGender)}>
              <MenuItem value="">No preference</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField select fullWidth size="small" label="Sort by" value={sortBy} onChange={f(setSortBy)}>
              <MenuItem value="best_match">Best match</MenuItem>
              <MenuItem value="price_asc">Price: low to high</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Button size="small" onClick={clearFilters} sx={{ mt: 1, textTransform: 'none' }}>Clear filters</Button>
      </Paper>

      {/* A failed load is not an empty list. */}
      {!loading && loadError ? (
        <Paper sx={{ ...card, p: 6, textAlign: 'center' }}>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: theme.text, mb: 1 }}>
            The request failed
          </Typography>
          <Typography sx={{ color: theme.textSecondary, mb: 3 }}>{loadError}</Typography>
          <Button variant="outlined" onClick={() => { setLoadError(null); load(); }}
                  sx={{ textTransform: 'none', fontWeight: 600, borderColor: theme.border, color: theme.text }}>
            Try again
          </Button>
        </Paper>
      ) : null}

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>}

      {!loading && !loadError && rows.length === 0 && (
        <Paper sx={{ ...card, p: 6, textAlign: 'center', border: `1px dashed ${theme.border}` }}>
          <InboxIcon sx={{ fontSize: 64, color: theme.textSecondary, opacity: 0.5, mb: 2 }} />
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: theme.text, mb: 1 }}>
            No caregivers match your search
          </Typography>
          <Typography sx={{ color: theme.textSecondary }}>
            Try a wider price range, another date, or fewer filters. Only verified caregivers are shown.
          </Typography>
        </Paper>
      )}

      {!loading && !loadError && rows.length > 0 && (
        <Grid container spacing={2}>
          {rows.map((row, idx) => {
            const services = asList(row.services_offered);
            const reviewCount = Number(row.review_count) || 0;
            return (
              <Grid item xs={12} md={6} key={row.id ?? idx}>
                <Paper sx={{ ...card, p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Avatar src={row.photo_url || undefined} alt={row.name} sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
                      {String(row.name || '?').charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: '1.15rem' }}>{row.name ?? '—'}</Typography>
                        {/* Only when an admin approved this caregiver. */}
                        {row.verified === true && <Chip size="small" icon={<VerifiedIcon />} label="Verified" color="success" />}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {typeof row.rating === 'number' && reviewCount > 0
                          ? <><Rating value={row.rating} precision={0.5} readOnly size="small" /><Typography sx={{ fontSize: '0.9rem', color: theme.textSecondary }}>({reviewCount})</Typography></>
                          : <Typography sx={{ fontSize: '0.9rem', color: theme.textSecondary }}>No reviews yet</Typography>}
                      </Box>
                      <Typography sx={{ fontSize: '0.95rem', color: theme.textSecondary }}>
                        {[row.years_experience != null ? `${row.years_experience} yrs experience` : null,
                          row.distance != null ? `${row.distance} mi away` : null].filter(Boolean).join(' · ')}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: '1.25rem', whiteSpace: 'nowrap' }}>
                      {row.hourly_rate != null ? `$${row.hourly_rate}/hr` : '—'}
                    </Typography>
                  </Box>
                  {services.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1.5 }}>
                      {services.map(s => <Chip key={s} size="small" variant="outlined" label={s} />)}
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/caregivers/' + row.id)}
                      sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44, flex: 1 }}>View profile</Button>
                    <Button variant="contained" disabled={row.verified !== true} onClick={() => navigate('/bookings/new?caregiver_id=' + row.id)}
                      sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, minHeight: 44, flex: 1, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
                      Book now
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Paging, shown only when the server reports a total larger than one page. */}
      {!loading && total !== null && total > limit && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Typography component="p" sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>
            Showing {(page - 1) * limit + 1}&ndash;{Math.min(page * limit, total)} of {total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}>
              Previous
            </Button>
            <Button size="small" variant="outlined" disabled={page * limit >= total}
                    onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CaregiverSearch;
