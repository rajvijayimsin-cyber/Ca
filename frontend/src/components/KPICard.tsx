import React from 'react';
import { Box, Typography } from '@mui/material';
import { AppTheme } from '../hooks/useAppTheme';
import { cardSx } from '../utils/themeStyles';

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  theme: AppTheme;
}

function getIconSvg(icon: string, color: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    people: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill={color}/>
      </svg>
    ),
    calendar: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill={color}/>
      </svg>
    ),
    shield: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill={color}/>
      </svg>
    ),
    dollar: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill={color}/>
      </svg>
    ),
    chart: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill={color}/>
      </svg>
    ),
    video: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill={color}/>
      </svg>
    ),
    users: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={color}/>
      </svg>
    ),
  };
  return iconMap[icon] || iconMap.users;
}

const ChangeIndicator: React.FC<{ change: string; changeType: string; theme: AppTheme }> = ({ change, changeType, theme }) => {
  const changeColor = changeType === 'up' ? theme.success : changeType === 'down' ? theme.error : theme.textSecondary;
  return (
    <Typography
      sx={{
        fontSize: '0.75rem',
        fontWeight: 500,
        color: changeColor,
        fontFamily: theme.fontFamily,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {changeType === 'up' && '\u2191'}
      {changeType === 'down' && '\u2193'}
      {change}
    </Typography>
  );
};

/* ---- Standard layout (Modern & Minimal) ---- */
const StandardLayout: React.FC<KPICardProps> = ({ label, value, change, changeType, icon, theme }) => (
  <Box sx={{ ...cardSx(theme), p: theme.density === 'spacious' ? 2.5 : 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: theme.textSecondary, fontFamily: theme.fontFamily, letterSpacing: '0.02em' }}>
        {label}
      </Typography>
      <Box sx={{ width: 36, height: 36, borderRadius: `${theme.borderRadius / 2}px`, backgroundColor: `${theme.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getIconSvg(icon, theme.primary)}
      </Box>
    </Box>
    <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: theme.text, fontFamily: theme.numberFont, lineHeight: 1.2, mb: 0.5 }}>
      {value}
    </Typography>
    <ChangeIndicator change={change} changeType={changeType} theme={theme} />
  </Box>
);

/* ---- Compact layout (Clinical & Professional) ---- */
const CompactLayout: React.FC<KPICardProps> = ({ label, value, change, changeType, theme }) => (
  <Box sx={{ ...cardSx(theme), p: 1.5, borderTop: `3px solid ${theme.primary}`, borderLeft: `1px solid ${theme.border}` }}>
    <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: theme.textSecondary, fontFamily: theme.fontFamily, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, fontFamily: theme.numberFont, lineHeight: 1.2, mb: 0.25 }}>
      {value}
    </Typography>
    <ChangeIndicator change={change} changeType={changeType} theme={theme} />
  </Box>
);

/* ---- Horizontal layout (Dashboard Focused) ---- */
const HorizontalLayout: React.FC<KPICardProps> = ({ label, value, change, changeType, icon, theme }) => (
  <Box sx={{ ...cardSx(theme), p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ width: 44, height: 44, borderRadius: `${theme.borderRadius}px`, backgroundColor: `${theme.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {getIconSvg(icon, theme.primary)}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: theme.textSecondary, fontFamily: theme.fontFamily, mb: 0.25 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text, fontFamily: theme.numberFont, lineHeight: 1.2 }}>
          {value}
        </Typography>
        <ChangeIndicator change={change} changeType={changeType} theme={theme} />
      </Box>
    </Box>
  </Box>
);

/* ---- Centered layout (Mobile First) ---- */
const CenteredLayout: React.FC<KPICardProps> = ({ label, value, change, changeType, icon, theme }) => (
  <Box sx={{ ...cardSx(theme), p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: theme.headerGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
      {getIconSvg(icon, '#fff')}
    </Box>
    <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: theme.text, fontFamily: theme.numberFont, lineHeight: 1.2, mb: 0.25 }}>
      {value}
    </Typography>
    <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: theme.textSecondary, fontFamily: theme.fontFamily, mb: 0.5 }}>
      {label}
    </Typography>
    <ChangeIndicator change={change} changeType={changeType} theme={theme} />
  </Box>
);

const KPICard: React.FC<KPICardProps> = (props) => {
  switch (props.theme.kpiLayout) {
    case 'compact':
      return <CompactLayout {...props} />;
    case 'horizontal':
      return <HorizontalLayout {...props} />;
    case 'centered':
      return <CenteredLayout {...props} />;
    case 'standard':
    default:
      return <StandardLayout {...props} />;
  }
};

export default KPICard;
