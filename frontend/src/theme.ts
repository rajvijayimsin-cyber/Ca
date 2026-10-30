import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4F46E5', light: '#818CF8', dark: '#3730A3' },
    secondary: { main: '#06B6D4' },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#3B82F6' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "\"Inter\", -apple-system, BlinkMacSystemFont, sans-serif",
  },
});

export default theme;
