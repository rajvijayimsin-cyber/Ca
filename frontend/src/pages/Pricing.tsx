import React from 'react';
import { Box, Typography, Grid, Paper, Button, Chip, Container } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import { useNavigate } from 'react-router-dom';
import CheckCircle from '@mui/icons-material/CheckCircle';

// Prices are the owner's to set. Shipping a number here would publish a
// commercial claim nobody made, so each tier reads "Let's talk" until the
// owner edits this file.
const plans = [
  {
    name: 'Starter',
    price: "Let's talk",
    period: '',
    features: ['Getting started with caregivers', 'Email support'],
    highlighted: false,
    cta: 'Contact us',
  },
  {
    name: 'Professional',
    price: "Let's talk",
    period: '',
    features: ['Caregiver Search With Filter included', 'Caregiver Profiles With Review included', '3-Step Booking With Hourly Price Summary included', 'Booking Status included', 'Priority support'],
    highlighted: true,
    cta: 'Contact us',
  },
  {
    name: 'Enterprise',
    price: "Let's talk",
    period: '',
    features: ['Everything in Professional', 'Dedicated support', 'Custom integrations', 'Training included'],
    highlighted: false,
    cta: 'Contact us',
  },
];

const Pricing: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.background }}>
      <Box sx={{ background: theme.headerGradient, py: 6, px: 3, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', mb: 1 }}>Pricing</Typography>
          <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)' }}>
            Simple, transparent pricing for CareNest
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3} justifyContent="center">
          {plans.map((plan, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper sx={{
                p: 4, borderRadius: 3, textAlign: 'center', height: '100%',
                border: plan.highlighted ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
                bgcolor: plan.highlighted ? `${theme.primary}05` : theme.surface,
                position: 'relative',
              }}>
                {plan.highlighted && (
                  <Chip label="Most Popular" size="small" sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: theme.primary, color: '#fff', fontWeight: 700 }} />
                )}
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: theme.text, mb: 1 }}>{plan.name}</Typography>
                <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: theme.primary }}>{plan.price}</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary, mb: 3 }}>{plan.period}</Typography>
                {plan.features.map((feat, fi) => (
                  <Box key={fi} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.8, justifyContent: 'flex-start', textAlign: 'left' }}>
                    <CheckCircle sx={{ color: theme.primary, fontSize: 18 }} />
                    <Typography sx={{ fontSize: '0.85rem', color: theme.text }}>{feat}</Typography>
                  </Box>
                ))}
                <Button variant={plan.highlighted ? "contained" : "outlined"} fullWidth
                  onClick={() => navigate('/signup')}
                  sx={{ mt: 3, py: 1.2, fontWeight: 700, borderRadius: 2,
                    bgcolor: plan.highlighted ? theme.primary : 'transparent',
                    borderColor: plan.highlighted ? theme.primary : theme.border,
                    color: plan.highlighted ? '#fff' : theme.text,
                    '&:hover': { bgcolor: plan.highlighted ? theme.primary : theme.primary + '10', opacity: plan.highlighted ? 0.9 : 1 }
                  }}>
                  {plan.cta}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button onClick={() => navigate('/')} sx={{ color: theme.textSecondary, textTransform: 'none' }}>Back to Home</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;
