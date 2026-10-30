import React from 'react';
import { Box, Typography, Grid, Paper, Container, Button, Chip } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import { useNavigate } from 'react-router-dom';
import CheckCircle from '@mui/icons-material/CheckCircle';

const Features: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.background }}>
      <Box sx={{ background: theme.headerGradient, py: 6, px: 3, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', mb: 1 }}>Features</Typography>
          <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Everything CareNest does
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>

      <Grid item xs={12} md={6} key="0">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Caregiver Search With Filters</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="1">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Caregiver Profiles With Reviews</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="2">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>3-Step Booking With Hourly Price Summary</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="3">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Booking Statuses And Cancellation Rules</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="4">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Check-In/Check-Out Visits With Notes</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="5">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Payments, Receipts And Refunds</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="6">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Messaging</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="7">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Reviews</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="8">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Caregiver Verification</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="9">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Earnings And Payouts</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} key="10">
        <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.border}`, bgcolor: theme.surface, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: theme.primary + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ color: theme.primary, fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.text }}>Admin Disputes, Settings And Audit Log</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, lineHeight: 1.7 }}>Built into CareNest, and ready to use.</Typography>
        </Paper>
      </Grid>
        </Grid>
        
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: theme.text, mb: 2 }}>Compliance Standards</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip label="Built for HIPAA" sx={{ mr: 1, mb: 1, bgcolor: theme.primary + "15", color: theme.primary, fontWeight: 600 }} />
        </Box>
      </Box>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button variant="contained" size="large" onClick={() => navigate('/signup')}
            sx={{ bgcolor: theme.primary, fontWeight: 700, px: 5, borderRadius: 2, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
            Get Started Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
