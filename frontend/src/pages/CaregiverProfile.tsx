import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Chip, Avatar, Rating, Alert, CircularProgress, Divider, Grid } from '@mui/material';
import { Verified as VerifiedIcon, Event as EventIcon, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';
import { apiGet } from '../apiWithMock';
import { useToast } from '../components/ToastProvider';
import { fmtDate } from '../i18n';

// A list arrives as an array or as a comma-separated string; both are shown as chips.
const asList = (v: any): string[] =>
  Array.isArray(v) ? v.map(String).filter(Boolean)
    : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : [];

const listOf = (d: any): any[] =>
  Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.results) ? d.results
    : Array.isArray(d?.data) ? d.data : [];

const CaregiverProfile: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const showToast = useToast();
  const { id } = useParams<{ id: string }>();
  const [caregiver, setCaregiver] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setLoadError(null);
    Promise.all([
      apiGet('/api/caregivers/' + id).then(r => setCaregiver(r.data))
        .catch(err => {
          setCaregiver(null);
          setLoadError(err?.response?.status === 404 ? 'This caregiver could not be found.'
            : err?.response?.data?.detail || 'The caregiver profile could not be loaded.');
        }),
      // reviews for this caregiver only, filtered by the server
      apiGet('/api/reviews?caregiver_id=' + encodeURIComponent(id)).then(r => setReviews(listOf(r.data))).catch(() => setReviews([])),
    ]).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleBook = () => {
    if (!caregiver?.verified) {
      showToast('Only verified caregivers can be booked.', 'warning');
      return;
    }
    navigate('/bookings/new?caregiver_id=' + encodeURIComponent(String(id)));
  };

  const card = { p: 3, mb: 2, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Reached from the menu without a caregiver chosen.
  if (!id) {
    return (
      <Box sx={{ p: 3, maxWidth: 820, fontFamily: theme.fontFamily }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 2 }}>Caregiver Profile</Typography>
        <Paper sx={{ ...card, textAlign: 'center' }}>
          <Typography sx={{ color: theme.textSecondary, mb: 2, fontSize: '1.05rem' }}>
            Choose a caregiver from the search to see their full profile.
          </Typography>
          <Button variant="contained" startIcon={<SearchIcon />} onClick={() => navigate('/caregivers/search')}
            sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, minHeight: 48, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
            Find Caregivers
          </Button>
        </Paper>
      </Box>
    );
  }

  if (loadError || !caregiver) {
    return (
      <Box sx={{ p: 3, maxWidth: 820 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>{loadError || 'This caregiver could not be found.'}</Alert>
        <Button variant="outlined" onClick={load} sx={{ textTransform: 'none', mr: 1 }}>Try again</Button>
        <Button onClick={() => navigate('/caregivers/search')} sx={{ textTransform: 'none' }}>Back to search</Button>
      </Box>
    );
  }

  const services = asList(caregiver.services_offered);
  const certifications = asList(caregiver.certifications);
  const languages = asList(caregiver.languages);
  const ratingValue = typeof caregiver.rating === 'number' ? caregiver.rating : null;
  const reviewCount = caregiver.review_count ?? reviews.length;

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, maxWidth: 820, fontFamily: theme.fontFamily }}>
      <Paper sx={card}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar src={caregiver.photo_url || undefined} alt={caregiver.name} sx={{ width: 112, height: 112, fontSize: '2.5rem' }}>
            {String(caregiver.name || '?').charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography component="h1" variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 700, color: theme.text }}>
                {caregiver.name || 'Caregiver'}
              </Typography>
              {/* Shown only when an admin approved this caregiver. */}
              {caregiver.verified === true && <Chip icon={<VerifiedIcon />} label="Verified" color="success" />}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              {ratingValue !== null && reviewCount > 0
                ? <><Rating value={ratingValue} precision={0.5} readOnly /><Typography sx={{ color: theme.textSecondary }}>{ratingValue.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</Typography></>
                : <Typography sx={{ color: theme.textSecondary }}>No reviews yet</Typography>}
            </Box>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mt: 1 }}>
              {caregiver.hourly_rate != null ? `$${caregiver.hourly_rate}/hr` : 'Rate not set'}
            </Typography>
            {caregiver.years_experience != null && (
              <Typography sx={{ color: theme.textSecondary }}>{caregiver.years_experience} years of experience</Typography>
            )}
          </Box>
          <Button variant="contained" size="large" startIcon={<EventIcon />} onClick={handleBook} disabled={caregiver.verified !== true}
            sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 700, minHeight: 52, px: 4, fontSize: '1.05rem',
                  borderRadius: theme.borderRadius + 'px', '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
            Book now
          </Button>
        </Box>
        {caregiver.verified !== true && (
          <Alert severity="info" sx={{ mt: 2 }}>This caregiver has not been verified yet and cannot be booked.</Alert>
        )}
      </Paper>

      <Paper sx={card}>
        <Typography component="h2" sx={{ fontSize: '1.15rem', fontWeight: 600, color: theme.text, mb: 1 }}>About</Typography>
        <Typography sx={{ color: theme.text, whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>{caregiver.bio || 'No bio yet.'}</Typography>
      </Paper>

      <Grid container spacing={2}>
        {[['Services offered', services], ['Certifications', certifications], ['Languages', languages]].map(([title, items]) => (
          <Grid item xs={12} md={4} key={title as string}>
            <Paper sx={{ ...card, mb: 0, height: '100%' }}>
              <Typography component="h2" sx={{ fontSize: '1.05rem', fontWeight: 600, color: theme.text, mb: 1 }}>{title as string}</Typography>
              {(items as string[]).length
                ? <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{(items as string[]).map(s => <Chip key={s} label={s} />)}</Box>
                : <Typography sx={{ color: theme.textSecondary }}>None listed</Typography>}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ ...card, mt: 2 }}>
        <Typography component="h2" sx={{ fontSize: '1.15rem', fontWeight: 600, color: theme.text, mb: 1 }}>Availability</Typography>
        <Typography sx={{ color: theme.text, whiteSpace: 'pre-wrap' }}>
          {typeof caregiver.availability === 'string' && caregiver.availability ? caregiver.availability : 'This caregiver has not published a schedule yet.'}
        </Typography>
      </Paper>

      <Paper sx={card}>
        <Typography component="h2" sx={{ fontSize: '1.15rem', fontWeight: 600, color: theme.text, mb: 1 }}>Reviews</Typography>
        {reviews.length === 0 && <Typography sx={{ color: theme.textSecondary }}>No reviews yet. Reviews come from families who completed a booking.</Typography>}
        {reviews.map((rv, i) => (
          <Box key={rv.id ?? i}>
            {i > 0 && <Divider sx={{ my: 1.5 }} />}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={Number(rv.rating) || 0} readOnly size="small" />
              <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>{rv.date ? fmtDate(rv.date) : ''}</Typography>
            </Box>
            {rv.comment && <Typography sx={{ color: theme.text, mt: 0.5 }}>{rv.comment}</Typography>}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default CaregiverProfile;
