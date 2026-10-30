import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel, Alert, Paper, Divider } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import api from '../api';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { LANGS, useT } from '../i18n';

const Settings: React.FC = () => {
  const theme = useAppTheme();
  const { t } = useT();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    timezone: 'UTC',
  });
  const [saved, setSaved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setFailed(false);
    try {
      await api.put('/api/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // It said "saved" when the server refused; say what happened.
      setFailed(true);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setSettings({ emailNotifications: true, smsNotifications: false, darkMode: false, timezone: 'UTC' });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 650, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, mb: 3 }}>Settings</Typography>
      {saved && <Alert severity="success" sx={{ mb: 2, borderRadius: theme.borderRadius + 'px' }}>Settings saved successfully</Alert>}
      {failed && <Alert severity="error" sx={{ mb: 2, borderRadius: theme.borderRadius + 'px' }}>Could not save. Please try again.</Alert>}

      <Paper sx={{ p: 3, mb: 3, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: theme.text, mb: 2 }}>Notifications</Typography>
        <FormControlLabel control={<Switch checked={settings.emailNotifications} onChange={e => setSettings({...settings, emailNotifications: e.target.checked})} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: theme.primary } }} />} label="Email notifications" />
        <FormControlLabel control={<Switch checked={settings.smsNotifications} onChange={e => setSettings({...settings, smsNotifications: e.target.checked})} />} label="SMS notifications" />
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: theme.text, mb: 2 }}>Preferences</Typography>
        {/* The app's real language, not a text box nothing read: it showed
            "en" in a Turkish app. With one language there is nothing to pick. */}
        {LANGS.length > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ color: theme.textSecondary, fontSize: '0.9rem', minWidth: 90 }}>{t('nav.language')}</Typography>
            <LanguageSwitcher color={theme.text} />
          </Box>
        )}
        <TextField fullWidth label="Timezone" value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} size="small" />
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: theme.text, mb: 2 }}>Appearance</Typography>
        <FormControlLabel control={<Switch checked={settings.darkMode} onChange={e => setSettings({...settings, darkMode: e.target.checked})} />} label="Dark mode" />
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving}
          sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, borderRadius: theme.borderRadius + 'px', '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outlined" onClick={handleCancel}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: theme.borderRadius + 'px', borderColor: theme.border, color: theme.textSecondary }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
