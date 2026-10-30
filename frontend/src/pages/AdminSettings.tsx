import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DynamicPage from '../components/DynamicPage';
import { generatePageSpecs } from '../utils/pageSpecGenerator';
import { useAppTheme } from '../hooks/useAppTheme';
import { apiGet } from '../apiWithMock';
import { useToast } from '../components/ToastProvider';

const AdminSettings: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const showToast = useToast();
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/admin_settings')
      .then((r: any) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleNavigate = useCallback((pageId: string) => {
    navigate('/' + pageId.replace(/_/g, '-'));
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const specs = generatePageSpecs(['admin settings']);
  const spec = specs[0] || { pageId: 'admin settings', title: 'Admin settings', sections: [] };

  return (
    <DynamicPage
      spec={spec}
      config={{ theme, appName: '', navigation: [], pages: [], complianceBadges: [],
               designStyle: '', layoutType: 'classic_sidebar', userRole: '',
               userDisplayName: '', isMobile: false, archetype: null } as any}
      seed="admin settings"
      data={{ items }}
      onNavigate={handleNavigate}
      onToast={showToast}
    />
  );
};

export default AdminSettings;
