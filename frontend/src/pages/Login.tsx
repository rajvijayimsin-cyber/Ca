import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import api from '../api';
import { useT } from '../i18n';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login: React.FC = () => {
  const theme = useAppTheme();
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
      window.location.href = '/home';
    } catch (err: any) {
      // Demo fallback: if API is unreachable (offline), grant a demo token
      // so the UI is still browsable. Real HTTP errors surface normally.
      if (!err?.response || err?.code === 'ERR_NETWORK') {
        localStorage.setItem('access_token', 'demo-token');
        localStorage.setItem('refresh_token', 'demo-refresh');
        window.location.href = '/home';
        return;
      }
      const status = err?.response?.status;
      if (status === 401) setError('Invalid email or password.');
      else if (status === 403) setError('Please verify your email before signing in.');
      else setError(err?.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const compliance: string[] = ["HIPAA"];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Brand panel */}
      <Box sx={{ flex: '0 0 45%', background: theme.headerGradient, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6, color: '#fff' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontFamily: theme.fontFamily }}>
          CareNest
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, textAlign: 'center', maxWidth: 400 }}>
          Secure healthcare platform
        </Typography>
        {compliance.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {compliance.map(c => (
              <Box key={c} sx={{ px: 2, py: 0.5, borderRadius: '20px', border: '1px solid rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 600 }}>
                {c}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Form panel */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, backgroundColor: theme.background }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}><LanguageSwitcher color={theme.text} /></Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.text }}>
            {t('auth.welcome_back')}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 4 }}>
            {t('auth.sign_in_title')}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField fullWidth label={t('auth.email')} type="email" value={email} onChange={e => setEmail(e.target.value)} required sx={{ mb: 2 }} autoComplete="email" />
          <TextField fullWidth label={t('auth.password')} type="password" value={password} onChange={e => setPassword(e.target.value)} required sx={{ mb: 1 }} autoComplete="current-password" />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <MuiLink href="#" variant="body2" sx={{ color: theme.primary, textDecoration: 'none' }}>
              {t('auth.forgot')}
            </MuiLink>
          </Box>

          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5, borderRadius: `${theme.borderRadius}px`, textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : t('auth.sign_in')}
          </Button>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: theme.textSecondary }}>
            {t('auth.no_account')}{' '}
            <MuiLink href="/signup" sx={{ color: theme.primary, fontWeight: 600, textDecoration: 'none' }}>
              {t('auth.sign_up')}
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
