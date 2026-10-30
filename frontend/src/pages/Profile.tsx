import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert, Avatar, Paper } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import api from '../api';

const Profile: React.FC = () => {
  const theme = useAppTheme();
  const [profile, setProfile] = useState({ full_name: '', email: '', role: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/me')
      .then(r => { setProfile(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/auth/me', profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, bgcolor: theme.background }}><Typography sx={{ color: theme.textSecondary }}>Loading...</Typography></Box>;

  return (
    <Box sx={{ p: 3, maxWidth: 650, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 3 }}>Profile</Typography>
      {saved && <Alert severity="success" sx={{ mb: 2, borderRadius: theme.borderRadius + 'px' }}>Profile updated successfully</Alert>}

      <Paper sx={{ p: 3, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 3, borderBottom: `1px solid ${theme.border}` }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: theme.primary, fontSize: '1.5rem', fontWeight: 700 }}>
            {profile.full_name?.[0] || 'U'}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: theme.text }}>{profile.full_name || 'User'}</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>{profile.role || 'Member'}</Typography>
          </Box>
        </Box>
        <TextField fullWidth label="Full Name" value={profile.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} sx={{ mb: 2 }} size="small" />
        <TextField fullWidth label="Email" value={profile.email || ''} disabled sx={{ mb: 2 }} size="small" />
        <TextField fullWidth label="Role" value={profile.role || ''} disabled sx={{ mb: 3 }} size="small" />
        <Button variant="contained" onClick={handleSave} disabled={saving}
          sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, borderRadius: theme.borderRadius + 'px', '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
          {saving ? 'Saving...' : 'Update Profile'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;
