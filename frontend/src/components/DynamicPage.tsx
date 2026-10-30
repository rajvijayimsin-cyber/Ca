/**
 * DynamicPage renders a PageSpec as a grid of themed, interactive sections.
 * Uses MUI components for professional look and built-in interactivity.
 * Supports search, sort, pagination, navigation, hover effects, responsive layout.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField, InputAdornment,
  LinearProgress, IconButton, Tooltip, Chip, Pagination, Skeleton,
  Snackbar, Alert,
  useMediaQuery, useTheme as useMuiTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';
import InboxIcon from '@mui/icons-material/Inbox';
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PreviewConfiguration } from '../types/preview';
import { PageSpec, SectionSpec } from '../types/sections';
import { loadSession, canWrite } from '../auth/session';

/** Whether the signed-in user may add, change or delete (not a read-only role). */
function useCanWrite(): boolean {
  const [ok, setOk] = React.useState(true);
  React.useEffect(() => { loadSession().then(s => setOk(canWrite(s.role))); }, []);
  return ok;
}

/** A domain action a row can be put through, e.g. a nurse accepting a job.
 *
 * Generic CRUD (add / edit / delete) is built in. This is for the verbs that
 * come from the customer's own idea and have a write endpoint behind them —
 * accept, decline, authorize. Without a slot like this the generated page
 * defined its handlers and passed none of them in, so the buttons never
 * existed and the endpoints were never called. */
export interface RowAction {
  label: string;
  onClick: (id: string, row: string[]) => void;
}

interface DynamicPageProps {
  spec: PageSpec;
  config: PreviewConfiguration;
  seed: string;
  onNavigate?: (pageId: string) => void;
  onToast?: (message: string, severity?: 'info' | 'success' | 'warning' | 'error') => void;
  /** Optional. Omitted everywhere it is not needed, so nothing changes. */
  rowActions?: RowAction[];
}

const ROWS_PER_PAGE = 8;

/** Map action button labels to navigation targets */
const ACTION_NAV_MAP: Record<string, string> = {
  'compare prices': 'price-comparison', 'view prices': 'price-comparison', 'price compare': 'price-comparison',
  'find pharmacy': 'pharmacy-finder', 'find pharmacies': 'pharmacy-finder', 'locate pharmacy': 'pharmacy-finder',
  'check coverage': 'coverage-check', 'coverage check': 'coverage-check', 'view coverage': 'coverage-check',
  'upload': 'uploads', 'upload audio': 'uploads', 'upload file': 'uploads', 'upload document': 'uploads',
  'upload report': 'uploads', 'upload image': 'uploads', 'scan document': 'uploads', 'import file': 'uploads',
  'search drugs': 'drug-search', 'drug search': 'drug-search', 'search medications': 'drug-search',
  'view details': '', 'learn more': '', 'get coupon': '', 'start request': '', 'file appeal': '',
  'book now': 'Bookings', 'schedule': 'Bookings', 'view calendar': 'Bookings',
  'view history': 'analytics', 'view report': 'analytics', 'view analytics': 'analytics',
};

function resolveNavTarget(label: string): string | null {
  const lower = label.toLowerCase().trim();
  for (const [key, target] of Object.entries(ACTION_NAV_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return target || null;
  }
  return null;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ spec, config, onNavigate, onToast, rowActions }) => {
  const canEdit = useCanWrite();
  const theme = config.theme;
  const muiTheme = useMuiTheme();
  const [localToast, setLocalToast] = useState<{ message: string; open: boolean }>({ message: '', open: false });

  const showToast = useCallback((msg: string) => {
    if (onToast) { onToast(msg, 'info'); }
    else { setLocalToast({ message: msg, open: true }); }
  }, [onToast]);

  const handleAction = useCallback((label: string) => {
    const target = resolveNavTarget(label);
    const lower = label.toLowerCase();
    if (target && onNavigate) {
      onNavigate(target);
    } else if (lower.includes('mark') && lower.includes('read')) {
      showToast('All notifications marked as read');
    } else if (lower.includes('clear') || lower.includes('delete') || lower.includes('remove')) {
      showToast(`${label} — done`);
    } else if (lower.includes('filter')) {
      showToast('Filter applied');
    } else if (lower.includes('export') || lower.includes('download')) {
      showToast('Export started — downloading file');
    } else if (lower.includes('search')) {
      showToast('Use the search field to find items');
    } else if (lower.includes('add') || lower.includes('new') || lower.includes('create')) {
      showToast(`${label} — use the + Add New button in the table below`);
    } else {
      showToast(`${label} — done`);
    }
  }, [onNavigate, showToast]);
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down('md'));
  const sorted = [...spec.sections].sort((a, b) => a.order - b.order);

  const cardSx = {
    backgroundColor: theme.surface,
    border: theme.cardStyle === 'bordered' ? `1px solid ${theme.border}` : 'none',
    borderRadius: `${theme.borderRadius}px`,
    boxShadow: theme.cardStyle === 'elevated' ? theme.cardShadow : theme.cardStyle === 'soft' ? `0 2px 8px ${theme.primary}10` : 'none',
    transition: 'box-shadow 0.2s ease, transform 0.15s ease',
    '&:hover': {
      boxShadow: theme.cardStyle === 'elevated' ? '0 4px 12px rgba(0,0,0,0.12)' : theme.cardShadow,
    },
  };

  const sectionHeadingSx = {
    fontWeight: 700,
    color: theme.text,
    fontFamily: theme.fontFamily,
    fontSize: isMobile ? '0.95rem' : '1.05rem',
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  };

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, color: theme.textSecondary }}>
      <InboxIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
      <Typography variant="body2" sx={{ fontFamily: theme.fontFamily }}>{message}</Typography>
    </Box>
  );

  const renderSection = (sec: SectionSpec) => {
    const cfg = sec.config || {};

    // A decorative section given nothing renders nothing.
    //
    // These used to carry example content — a card grid headed "Top Rated
    // Doctors" listing four doctors who do not exist, with star ratings and
    // consultation prices. With that content gone the heading was left
    // sitting over an empty grid, which is its own small claim. A table is
    // deliberately not in this list: an empty list with "No results found"
    // is the true answer to "what do I have", and the heading belongs there.
    const DECORATIVE: Record<string, string> = {
      card_grid: 'cards', chat_view: 'messages',
      kanban_board: 'columns', map_view: 'pins',
    };
    const contentKey = DECORATIVE[sec.type as string];
    if (contentKey) {
      const content = (cfg as any)[contentKey];
      if (Array.isArray(content) && content.length === 0) return null;
    }

    switch (sec.type) {
      case 'kpi_grid': {
        const items = cfg.items || [];
        if (items.length === 0) return <EmptyState message="No metrics available" />;
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : `repeat(${Math.min(items.length, 4)}, 1fr)`, gap: isMobile ? 1.5 : 2 }}>
            {items.map((item: any, i: number) => {
              const isPositive = item.trend && (item.trend.startsWith('+') || item.trend.startsWith('-'));
              const trendUp = item.trend?.startsWith('+') || item.trend?.includes('↑');
              return (
                <Card key={i} sx={{ ...cardSx, p: 0, cursor: 'pointer', '&:hover': { ...cardSx['&:hover'], transform: 'translateY(-2px)' } }}>
                  <CardContent sx={{ p: isMobile ? 2 : 2.5, '&:last-child': { pb: isMobile ? 2 : 2.5 } }}>
                    <Typography sx={{ color: theme.textSecondary, fontFamily: theme.fontFamily, fontSize: '0.75rem', fontWeight: 500, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {item.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: theme.text, fontFamily: theme.numberFont, fontSize: isMobile ? '1.3rem' : '1.6rem', lineHeight: 1.2 }}>
                        {item.value}
                      </Typography>
                      {item.trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          {trendUp ? <TrendingUpIcon sx={{ fontSize: 14, color: theme.success }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: item.trend.includes('-') ? theme.error : theme.success }} />}
                          <Typography sx={{ color: trendUp ? theme.success : theme.error, fontWeight: 600, fontSize: '0.75rem', fontFamily: theme.numberFont }}>
                            {item.trend}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        );
      }

      case 'data_table': {
        const columns: string[] = cfg.columns || [];
        const allRows: string[][] = cfg.rows || [];
        if (columns.length === 0) return <EmptyState message="No data available" />;

        return <InteractiveTable columns={columns} rows={allRows} theme={theme} cardSx={cardSx} isMobile={isMobile}
          sectionTitle={sec.title || 'Data'}
          onExport={() => {
            const header = columns.join(',');
            const body = allRows.map(r => r.join(',')).join('\n');
            const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `${sec.title || 'data'}.csv`; a.click();
            URL.revokeObjectURL(url);
            showToast('Exported to CSV');
          }}
          onToast={showToast}
          rowActions={rowActions}
        />;
      }

      case 'chart': {
        const chartData = cfg.data || [];
        const maxVal = Math.max(...chartData.map((d: any) => d.value), 1);
        const chartType = cfg.type || 'bar';
        if (chartData.length === 0) return <EmptyState message="No chart data" />;

        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              {chartType === 'donut' ? (
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 3 }}>
                  <Box sx={{
                    width: 120, height: 120, borderRadius: '50%', position: 'relative',
                    background: `conic-gradient(${chartData.map((d: any, i: number) => {
                      const colors = [theme.primary, theme.info, theme.success, theme.warning, theme.error, '#9c27b0'];
                      const total = chartData.reduce((s: number, x: any) => s + x.value, 0);
                      const start = chartData.slice(0, i).reduce((s: number, x: any) => s + (x.value / total) * 100, 0);
                      const end = start + (d.value / total) * 100;
                      return `${colors[i % colors.length]} ${start}% ${end}%`;
                    }).join(', ')})`,
                  }}>
                    <Box sx={{ position: 'absolute', inset: '25%', borderRadius: '50%', backgroundColor: theme.surface }} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {chartData.map((d: any, i: number) => {
                      const colors = [theme.primary, theme.info, theme.success, theme.warning, theme.error, '#9c27b0'];
                      return (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: colors[i % colors.length] }} />
                          <Typography sx={{ fontSize: '0.78rem', color: theme.text, fontFamily: theme.fontFamily }}>{d.label}</Typography>
                          <Typography sx={{ fontSize: '0.78rem', color: theme.textSecondary, fontFamily: theme.numberFont, ml: 'auto' }}>{d.value}%</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? 0.5 : 1, height: isMobile ? 100 : 140 }}>
                    {chartData.map((d: any, i: number) => (
                      <Tooltip key={i} title={`${d.label}: ${d.value}`} arrow>
                        <Box sx={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                          {chartType === 'line' ? (
                            <Box sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                              <Box sx={{
                                width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.primary,
                                position: 'absolute', bottom: `${(d.value / maxVal) * 100}%`,
                                boxShadow: `0 0 0 3px ${theme.primary}30`,
                              }} />
                              <Box sx={{ width: '100%', height: `${(d.value / maxVal) * 100}%`, backgroundColor: `${theme.primary}08`, borderRadius: '4px 4px 0 0' }} />
                            </Box>
                          ) : (
                            <Box sx={{
                              height: `${(d.value / maxVal) * 100}%`,
                              backgroundColor: theme.primary,
                              borderRadius: `${theme.borderRadius / 2}px ${theme.borderRadius / 2}px 0 0`,
                              opacity: 0.7 + (i / chartData.length) * 0.3,
                              minHeight: 4,
                              transition: 'opacity 0.2s',
                              '&:hover': { opacity: 1 },
                            }} />
                          )}
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: isMobile ? 0.5 : 1, mt: 1 }}>
                    {chartData.map((d: any, i: number) => (
                      <Box key={i} sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography sx={{ color: theme.textSecondary, fontSize: '0.65rem', fontFamily: theme.fontFamily }}>{d.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      }

      case 'timeline': {
        const events = cfg.events || [];
        if (events.length === 0) return <EmptyState message="No events to display" />;
        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              {events.map((evt: any, i: number) => (
                <Box key={i} sx={{
                  display: 'flex', gap: 2, mb: i < events.length - 1 ? 2.5 : 0,
                  cursor: 'pointer', borderRadius: `${theme.borderRadius / 2}px`, p: 1, mx: -1,
                  '&:hover': { backgroundColor: `${theme.primary}05` },
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 24, pt: 0.3 }}>
                    {evt.status === 'warning' ? (
                      <WarningAmberIcon sx={{ fontSize: 16, color: theme.warning }} />
                    ) : evt.status === 'error' ? (
                      <ErrorOutlineIcon sx={{ fontSize: 16, color: theme.error }} />
                    ) : evt.status === 'complete' ? (
                      <CheckCircleIcon sx={{ fontSize: 16, color: theme.success }} />
                    ) : (
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: theme.info }} />
                    )}
                    {i < events.length - 1 && <Box sx={{ width: 2, flex: 1, backgroundColor: theme.border, mt: 0.5, borderRadius: 1 }} />}
                  </Box>
                  <Box sx={{ pb: 1, flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Typography sx={{ fontWeight: 600, color: theme.text, fontSize: '0.85rem', fontFamily: theme.fontFamily }}>{evt.title}</Typography>
                      <Chip label={evt.date} size="small" sx={{ height: 20, fontSize: '0.65rem', backgroundColor: `${theme.primary}10`, color: theme.primary, fontWeight: 500 }} />
                    </Box>
                    <Typography sx={{ color: theme.textSecondary, fontSize: '0.78rem', lineHeight: 1.5, fontFamily: theme.fontFamily }}>{evt.description}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        );
      }

      case 'card_grid': {
        return <EditableCardGrid cards={cfg.cards || []} theme={theme} cardSx={cardSx} isMobile={isMobile} isTablet={isTablet} onNavigate={onNavigate} showToast={showToast} />;
      }

      case 'action_toolbar': {
        const actions = canEdit ? (cfg.actions || []) : [];
        return (
          <Card sx={{ ...cardSx, p: isMobile ? 2 : 2.5 }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small" placeholder="Search..." variant="outlined"
                sx={{
                  flex: isMobile ? '1 1 100%' : '1 1 250px', maxWidth: isMobile ? '100%' : 350,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: `${theme.borderRadius}px`, fontFamily: theme.fontFamily, fontSize: '0.85rem',
                    '& fieldset': { borderColor: theme.border },
                    '&:hover fieldset': { borderColor: theme.primary },
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: theme.textSecondary, fontSize: 20 }} /></InputAdornment>,
                }}
              />
              {actions.map((action: any, i: number) => (
                <Button
                  key={i}
                  variant={action.variant === 'primary' ? 'contained' : action.variant === 'secondary' ? 'contained' : 'outlined'}
                  size="medium"
                  onClick={() => handleAction(action.label)}
                  sx={{
                    backgroundColor: action.variant === 'primary' ? theme.primary : action.variant === 'secondary' ? theme.textSecondary : 'transparent',
                    color: action.variant === 'outlined' ? theme.primary : '#fff',
                    borderColor: action.variant === 'outlined' ? theme.border : 'transparent',
                    borderRadius: `${theme.borderRadius}px`,
                    textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', fontFamily: theme.fontFamily,
                    px: 2.5, minHeight: 38,
                    '&:hover': {
                      backgroundColor: action.variant === 'primary' ? theme.primaryDark : action.variant === 'secondary' ? theme.text : `${theme.primary}08`,
                      boxShadow: action.variant === 'primary' ? `0 4px 12px ${theme.primary}40` : 'none',
                    },
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          </Card>
        );
      }

      case 'metric_bar': {
        const metrics = cfg.metrics || [];
        if (metrics.length === 0) return <EmptyState message="No metrics available" />;
        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              {metrics.map((m: any, i: number) => (
                <Box key={i} sx={{ mb: i < metrics.length - 1 ? 2.5 : 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8, alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: theme.text, fontSize: '0.82rem', fontFamily: theme.fontFamily }}>{m.label}</Typography>
                    <Typography sx={{ color: theme.textSecondary, fontSize: '0.75rem', fontFamily: theme.numberFont, fontWeight: 500 }}>
                      {typeof m.value === 'number' && typeof m.maxValue === 'number'
                        ? `${Math.round((m.value / m.maxValue) * 100)}%`
                        : `${m.value}/${m.maxValue}`}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((m.value / m.maxValue) * 100, 100)}
                    sx={{
                      height: 10, borderRadius: 5,
                      backgroundColor: `${m.color}18`,
                      '& .MuiLinearProgress-bar': { backgroundColor: m.color, borderRadius: 5, transition: 'transform 0.6s ease' },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        );
      }

      case 'progress_tracker': {
        const steps = cfg.steps || [];
        if (steps.length === 0) return <EmptyState message="No steps defined" />;
        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                {steps.map((step: any, i: number) => (
                  <React.Fragment key={i}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: isMobile ? 80 : 100, position: 'relative' }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: step.status === 'complete' ? theme.primary : step.status === 'active' ? theme.warning : theme.surfaceAlt,
                        border: step.status === 'pending' ? `2px solid ${theme.border}` : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {step.status === 'complete' ? (
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#fff' }} />
                        ) : step.status === 'active' ? (
                          <FiberManualRecordIcon sx={{ fontSize: 12, color: '#fff' }} />
                        ) : (
                          <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: theme.textSecondary }} />
                        )}
                      </Box>
                      <Typography sx={{
                        fontWeight: step.status === 'active' ? 700 : step.status === 'complete' ? 600 : 400,
                        color: step.status === 'pending' ? theme.textSecondary : theme.text,
                        fontSize: '0.72rem', mt: 1, textAlign: 'center', fontFamily: theme.fontFamily,
                        maxWidth: 100, lineHeight: 1.3,
                      }}>
                        {step.label}
                      </Typography>
                    </Box>
                    {i < steps.length - 1 && (
                      <Box sx={{
                        flex: 1, height: 2, minWidth: 20, mt: 2,
                        backgroundColor: step.status === 'complete' ? theme.primary : theme.border,
                        borderRadius: 1, transition: 'background-color 0.3s',
                      }} />
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </CardContent>
          </Card>
        );
      }

      case 'split_panel': {
        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                <Box sx={{ flex: 1, p: 2.5, backgroundColor: theme.surfaceAlt, borderRadius: `${theme.borderRadius / 2}px` }}>
                  <Typography sx={{ fontWeight: 600, color: theme.text, mb: 1, fontSize: '0.9rem', fontFamily: theme.fontFamily }}>{cfg.leftTitle || 'Panel A'}</Typography>
                  <Typography sx={{ color: theme.textSecondary, fontSize: '0.8rem', fontFamily: theme.fontFamily }}>Content area</Typography>
                </Box>
                <Box sx={{ width: isMobile ? '100%' : 1, height: isMobile ? 1 : 'auto', backgroundColor: theme.border }} />
                <Box sx={{ flex: 1, p: 2.5, backgroundColor: theme.surfaceAlt, borderRadius: `${theme.borderRadius / 2}px` }}>
                  <Typography sx={{ fontWeight: 600, color: theme.text, mb: 1, fontSize: '0.9rem', fontFamily: theme.fontFamily }}>{cfg.rightTitle || 'Panel B'}</Typography>
                  <Typography sx={{ color: theme.textSecondary, fontSize: '0.8rem', fontFamily: theme.fontFamily }}>Content area</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      }

      case 'map_view': {
        const pins = cfg.pins || [
          { label: 'Location A', lat: 40.71, lng: -74.01, status: 'active' },
          { label: 'Location B', lat: 40.73, lng: -73.99, status: 'active' },
          { label: 'Location C', lat: 40.70, lng: -74.02, status: 'inactive' },
        ];
        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ height: 300, backgroundColor: '#e8f0fe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: `${theme.borderRadius}px` }}>
                <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, background: `repeating-linear-gradient(0deg, ${theme.border}, ${theme.border} 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, ${theme.border}, ${theme.border} 1px, transparent 1px, transparent 30px)` }} />
                {pins.map((pin: any, i: number) => (
                  <Tooltip key={i} title={`${pin.label} (${pin.status})`} arrow>
                    <Box sx={{ position: 'absolute', left: `${20 + (i * 25)}%`, top: `${30 + (i * 15)}%`, width: 24, height: 24, borderRadius: '50% 50% 50% 0', backgroundColor: pin.status === 'active' ? theme.primary : theme.textSecondary, transform: 'rotate(-45deg)', cursor: 'pointer', '&:hover': { transform: 'rotate(-45deg) scale(1.2)' }, transition: 'transform 0.2s' }} />
                  </Tooltip>
                ))}
                <Typography sx={{ color: theme.textSecondary, fontSize: '0.85rem', zIndex: 1, mt: 'auto', mb: 2 }}>Interactive map — connect Google Maps or Mapbox API</Typography>
              </Box>
              <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {pins.map((pin: any, i: number) => (
                  <Chip key={i} label={pin.label} size="small" sx={{ backgroundColor: pin.status === 'active' ? `${theme.primary}15` : `${theme.textSecondary}15`, color: pin.status === 'active' ? theme.primary : theme.textSecondary }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        );
      }

      case 'calendar_view': {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // The month this actually is.
        const _now = new Date();
        const _y = _now.getFullYear();
        const _mo = _now.getMonth();
        const daysInMonth = new Date(_y, _mo + 1, 0).getDate();
        // getDay() is Sunday-first; this grid is Monday-first.
        const leadingBlanks = (new Date(_y, _mo, 1).getDay() + 6) % 7;
        const monthLabel = _now.toLocaleDateString(undefined, {
          month: 'long', year: 'numeric',
        });
        const calEvents: any[] = (cfg as any).calendarEvents || cfg.events || [
          { day: 1, title: 'Booking', color: theme.primary },
          { day: 3, title: 'Follow-up', color: theme.info },
          { day: 5, title: 'Lab Test', color: theme.warning },
        ];
        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: theme.text, mb: 1.5 }}>
                {monthLabel}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 2 }}>
                {days.map(d => (
                  <Typography key={d} sx={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: theme.textSecondary, py: 0.5 }}>{d}</Typography>
                ))}
                {/* Blanks before the 1st, so the dates line up under the right
                    weekday. This grid used to be a flat 1..28 starting on a
                    Monday: it matched no real month, and the "today" ring
                    landed on whatever cell shared the number. */}
                {Array.from({ length: leadingBlanks }, (_, i) => (
                  <Box key={'b' + i} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dayNum = i + 1;
                  const evt = calEvents.find((e: any) => e.day === dayNum);
                  return (
                    <Box key={i} sx={{ textAlign: 'center', py: 1, borderRadius: 1, cursor: 'pointer', backgroundColor: evt ? `${evt.color}15` : 'transparent', border: dayNum === new Date().getDate() ? `2px solid ${theme.primary}` : '1px solid transparent', '&:hover': { backgroundColor: `${theme.primary}08` } }}>
                      <Typography sx={{ fontSize: '0.8rem', color: theme.text, fontWeight: dayNum === new Date().getDate() ? 700 : 400 }}>{dayNum}</Typography>
                      {evt && <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: evt.color, mx: 'auto', mt: 0.3 }} />}
                    </Box>
                  );
                })}
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {calEvents.map((e: any, i: number) => (
                  <Chip key={i} label={`Day ${e.day}: ${e.title}`} size="small" sx={{ backgroundColor: `${e.color}15`, color: e.color, fontWeight: 500 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        );
      }

      case 'kanban_board': {
        const columns_kb = cfg.columns || [
          { title: 'To Do', items: ['Task 1', 'Task 2'] },
          { title: 'In Progress', items: ['Task 3'] },
          { title: 'Review', items: ['Task 4'] },
          { title: 'Done', items: ['Task 5', 'Task 6'] },
        ];
        const colColors = [theme.info, theme.warning, theme.primary, theme.success];
        return (
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {columns_kb.map((col: any, ci: number) => (
              <Card key={ci} sx={{ ...cardSx, minWidth: 200, flex: '0 0 220px' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: theme.text }}>{col.title}</Typography>
                    <Chip label={col.items.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: `${colColors[ci % colColors.length]}15`, color: colColors[ci % colColors.length] }} />
                  </Box>
                  {col.items.map((item: string, ii: number) => (
                    <Box key={ii} sx={{ p: 1.5, mb: 1, borderRadius: 1, backgroundColor: theme.surfaceAlt, border: `1px solid ${theme.border}`, cursor: 'grab', '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderColor: colColors[ci % colColors.length] }, transition: 'all 0.15s' }}>
                      <Typography sx={{ fontSize: '0.8rem', color: theme.text }}>{item}</Typography>
                    </Box>
                  ))}
                  <Button size="small" fullWidth sx={{ mt: 1, textTransform: 'none', color: theme.textSecondary, fontSize: '0.75rem', borderStyle: 'dashed', borderColor: theme.border }} variant="outlined" onClick={() => showToast('Add item — coming soon')}>+ Add</Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        );
      }

      case 'gallery': {
        const images = cfg.images || [
          { title: 'Image 1', type: 'image', status: 'Analyzed' },
          { title: 'Image 2', type: 'image', status: 'Pending' },
          { title: 'Image 3', type: 'image', status: 'Analyzed' },
          { title: 'Document 1', type: 'pdf', status: 'Analyzed' },
        ];
        return (
          <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 2 }}>
            {images.map((img: any, i: number) => (
              <Card key={i} sx={{ ...cardSx, cursor: 'pointer', '&:hover': { ...cardSx['&:hover'], transform: 'translateY(-2px)' } }}>
                <Box sx={{ height: 120, backgroundColor: theme.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '2rem' }}>{img.type === 'image' ? '🖼️' : '📄'}</Typography>
                </Box>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: theme.text }}>{img.title}</Typography>
                  <Chip label={img.status} size="small" sx={{ mt: 0.5, height: 18, fontSize: '0.6rem', backgroundColor: img.status === 'Analyzed' ? `${theme.success}15` : `${theme.warning}15`, color: img.status === 'Analyzed' ? theme.success : theme.warning }} />
                </CardContent>
              </Card>
            ))}
          </Box>
        );
      }

      case 'chat_view': {
        const messages = cfg.messages || [
          { from: 'user', text: 'What do my lab results mean?', time: '10:30 AM' },
          { from: 'ai', text: 'Your blood work shows normal values for most markers. Your hemoglobin is 14.2 g/dL which is within the healthy range. However, your fasting glucose at 118 mg/dL is slightly elevated.', time: '10:31 AM' },
          { from: 'user', text: 'Is that something to worry about?', time: '10:32 AM' },
          { from: 'ai', text: 'A fasting glucose of 118 mg/dL is in the pre-diabetic range (100-125). I recommend discussing this with your Caregiver. Lifestyle changes like diet and exercise can often help.', time: '10:32 AM' },
        ];
        return (
          <Card sx={cardSx}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ maxHeight: 350, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {messages.map((msg: any, i: number) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{ maxWidth: '75%', p: 1.5, borderRadius: 2, backgroundColor: msg.from === 'user' ? theme.primary : theme.surfaceAlt, color: msg.from === 'user' ? '#fff' : theme.text }}>
                      <Typography sx={{ fontSize: '0.83rem', lineHeight: 1.6, fontFamily: theme.fontFamily }}>{msg.text}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', mt: 0.5, opacity: 0.7, textAlign: 'right' }}>{msg.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.border}`, display: 'flex', gap: 1 }}>
                <TextField size="small" fullWidth placeholder="Type a message..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: `${theme.borderRadius}px` } }} />
                <Button variant="contained" sx={{ borderRadius: `${theme.borderRadius}px`, textTransform: 'none', minWidth: 80, backgroundColor: theme.primary }}>Send</Button>
              </Box>
            </CardContent>
          </Card>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : theme.spacing / 8, backgroundColor: theme.background, minHeight: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: isMobile ? 1.5 : 2 }}>
        {sorted.map((sec, i) => (
          <Box key={`${sec.type}_${i}`} sx={{ gridColumn: isMobile ? 'span 12' : `span ${sec.gridSpan || 12}` }}>
            {sec.title && (
              <Typography sx={sectionHeadingSx}>
                {sec.title}
              </Typography>
            )}
            {renderSection(sec)}
          </Box>
        ))}
      </Box>
      {/* Local toast for when ToastProvider is not available (preview mode) */}
      <Snackbar open={localToast.open} autoHideDuration={3000} onClose={() => setLocalToast(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="info" variant="filled" onClose={() => setLocalToast(p => ({ ...p, open: false }))}>{localToast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

/** Editable card grid — cards with edit/manage/delete actions that open inline edit forms */
const EditableCardGrid: React.FC<{
  cards: any[];
  theme: any;
  cardSx: any;
  isMobile: boolean;
  isTablet: boolean;
  onNavigate?: (pageId: string) => void;
  showToast: (msg: string) => void;
}> = ({ cards: initialCards, theme, cardSx, isMobile, isTablet, onNavigate, showToast }) => {
  const [cards, setCards] = useState(initialCards.map((c: any, i: number) => ({ ...c, id: i })));
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const openEdit = (idx: number) => {
    setEditIdx(idx);
    setEditTitle(cards[idx].title);
    setEditDesc(cards[idx].description);
  };

  const saveEdit = () => {
    if (editIdx === null) return;
    setCards(prev => prev.map((c, i) => i === editIdx ? { ...c, title: editTitle, description: editDesc } : c));
    showToast(`${editTitle} — updated successfully`);
    setEditIdx(null);
  };

  const deleteCard = (idx: number) => {
    const name = cards[idx].title;
    setCards(prev => prev.filter((_, i) => i !== idx));
    showToast(`${name} — removed`);
    setEditIdx(null);
  };

  if (cards.length === 0) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, color: theme.textSecondary }}>
      <InboxIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
      <Typography variant="body2" sx={{ fontFamily: theme.fontFamily }}>No items available</Typography>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : `repeat(${Math.min(cards.length, 3)}, 1fr)`, gap: 2 }}>
        {cards.map((card: any, i: number) => (
          <Card key={card.id ?? i} sx={{
            ...cardSx, display: 'flex', flexDirection: 'column', cursor: card.action ? 'pointer' : 'default',
            '&:hover': card.action ? { ...cardSx['&:hover'], transform: 'translateY(-2px)', borderColor: theme.primary } : cardSx['&:hover'],
          }}>
            <CardContent sx={{ flex: 1, p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                {card.icon && (
                  <Box sx={{ width: 32, height: 32, borderRadius: `${theme.borderRadius / 2}px`, backgroundColor: `${theme.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '1rem' }}>
                      {card.icon === 'medication' ? '💊' : card.icon === 'person' ? '👤' : card.icon === 'shield' ? '🛡️' :
                       card.icon === 'phone' ? '📞' : card.icon === 'message' ? '💬' : card.icon === 'book' ? '📖' :
                       card.icon === 'favorite' ? '❤️' : card.icon === 'camera' ? '📷' : card.icon === 'location' ? '📍' :
                       card.icon === 'edit' ? '✏️' : card.icon === 'search' ? '🔍' : card.icon === 'settings' ? '⚙️' : '📋'}
                    </Typography>
                  </Box>
                )}
                <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: '0.9rem', fontFamily: theme.fontFamily, flex: 1 }}>
                  {card.title}
                </Typography>
              </Box>
              <Typography sx={{ color: theme.textSecondary, fontSize: '0.78rem', lineHeight: 1.6, fontFamily: theme.fontFamily, flex: 1, mb: card.action ? 2 : 0 }}>
                {card.description}
              </Typography>
              {card.action && (
                <Button size="small" variant="outlined"
                  onClick={() => {
                    const act = card.action.toLowerCase();
                    const navTarget = resolveNavTarget(act);
                    if (navTarget && onNavigate) { onNavigate(navTarget); }
                    else if (act.includes('edit') || act.includes('change') || act.includes('manage') || act.includes('update')) {
                      openEdit(i);
                    } else if (act.includes('delete') || act.includes('remove') || act.includes('clear')) {
                      deleteCard(i);
                    } else if (act.includes('enable') || act.includes('disable') || act.includes('toggle')) {
                      setCards(prev => prev.map((c, ci) => ci === i ? { ...c, description: c.description.includes('Enabled') ? c.description.replace('Enabled', 'Disabled') : c.description.replace('Disabled', 'Enabled') } : c));
                      showToast(`${card.title} — toggled`);
                    } else if (act.includes('export') || act.includes('download')) {
                      showToast(`${card.title} — exported`);
                    } else {
                      openEdit(i);
                    }
                  }}
                  endIcon={<OpenInNewIcon sx={{ fontSize: '0.8rem !important' }} />}
                  sx={{ borderColor: theme.primary, color: theme.primary, textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, borderRadius: `${theme.borderRadius}px`, alignSelf: 'flex-start', mt: 'auto', '&:hover': { backgroundColor: `${theme.primary}08` } }}
                >
                  {card.action}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editIdx !== null} onClose={() => setEditIdx(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: theme.fontFamily }}>
          Edit {editIdx !== null ? cards[editIdx]?.title : ''}
          <IconButton onClick={() => setEditIdx(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField fullWidth size="small" label={editIdx !== null ? cards[editIdx]?.title || 'Value' : 'Value'} value={editDesc} onChange={e => setEditDesc(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: `${theme.borderRadius}px` } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button color="error" onClick={() => { if (editIdx !== null) deleteCard(editIdx); }} sx={{ textTransform: 'none' }}>Delete</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setEditIdx(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" onClick={saveEdit} sx={{ textTransform: 'none', backgroundColor: theme.primary, borderRadius: `${theme.borderRadius}px` }}>Save Changes</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

/** Interactive table with search, sort, pagination, export, add */
const InteractiveTable: React.FC<{
  columns: string[];
  rows: string[][];
  theme: any;
  cardSx: any;
  isMobile: boolean;
  sectionTitle?: string;
  onExport?: () => void;
  onToast?: (msg: string) => void;
  rowActions?: RowAction[];
}> = ({ columns, rows: initialRows, theme, cardSx, isMobile, sectionTitle, onExport, onToast, rowActions }) => {
  const canEdit = useCanWrite();
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [detailRow, setDetailRow] = useState<string[] | null>(null);
  const [rows, setRows] = useState<string[][]>(initialRows);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editRowIdx, setEditRowIdx] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<string[]>([]);

  const openAddForm = () => {
    setFormValues(columns.map(() => ''));
    setEditRowIdx(null);
    setAddFormOpen(true);
  };

  const openEditForm = (rowIdx: number) => {
    setFormValues([...rows[rowIdx]]);
    setEditRowIdx(rowIdx);
    setAddFormOpen(true);
  };

  const handleSaveForm = () => {
    if (editRowIdx !== null) {
      setRows(prev => prev.map((r, i) => i === editRowIdx ? formValues : r));
      onToast?.(`Record updated successfully`);
    } else {
      setRows(prev => [...prev, formValues]);
      onToast?.(`New record added`);
    }
    setAddFormOpen(false);
    setFormValues([]);
    setEditRowIdx(null);
  };

  const handleDeleteRow = (rowIdx: number) => {
    const name = rows[rowIdx][1] || rows[rowIdx][0] || 'Record';
    setRows(prev => prev.filter((_, i) => i !== rowIdx));
    setDetailRow(null);
    onToast?.(`${name} deleted`);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(row => row.some(cell => cell.toLowerCase().includes(q)));
  }, [rows, search]);

  const sorted = useMemo(() => {
    if (sortCol === null) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortCol] || '';
      const vb = b[sortCol] || '';
      const numA = parseFloat(va.replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(vb.replace(/[^0-9.-]/g, ''));
      if (!isNaN(numA) && !isNaN(numB)) return sortDir === 'asc' ? numA - numB : numB - numA;
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
  const paged = sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleSort = useCallback((colIdx: number) => {
    if (sortCol === colIdx) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(colIdx);
      setSortDir('asc');
    }
    setPage(1);
  }, [sortCol]);

  const statusColors: Record<string, string> = {
    'active': theme.success, 'completed': theme.success, 'approved': theme.success, 'available': theme.success,
    'in stock': theme.success, 'verified': theme.success, 'paid': theme.success, 'open': theme.success, 'yes': theme.success,
    'pending': theme.warning, 'processing': theme.warning, 'under review': theme.warning, 'in progress': theme.warning, 'scheduled': theme.warning,
    'expired': theme.error, 'denied': theme.error, 'critical': theme.error, 'overdue': theme.error, 'no': theme.error,
    'new': theme.info,
  };

  // A spec may already declare an "Actions" column. Reuse it rather than
  // appending a second one, or a table ends up with Actions and Actions.
  const actionColIdx = columns.findIndex(c => c.trim().toLowerCase() === 'actions');
  const hasRowActions = canEdit && !!(rowActions && rowActions.length);

  const renderRowActions = (row: string[]) => (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {(rowActions || []).map((a, ai) => (
        <Button key={ai} size="small" variant="outlined"
          onClick={(e) => { e.stopPropagation(); a.onClick(row[0] ?? '', row); }}
          sx={{
            textTransform: 'none', fontSize: '0.74rem', fontWeight: 600,
            minWidth: 0, px: 1.1, py: '2px', lineHeight: 1.4,
            borderColor: theme.border, color: theme.primary,
            borderRadius: `${theme.borderRadius}px`,
            '&:hover': { borderColor: theme.primary, backgroundColor: `${theme.primary}0d` },
          }}>
          {a.label}
        </Button>
      ))}
    </Box>
  );

  const renderCell = (cell: string, colIdx: number, row?: string[]) => {
    // Domain actions win the Actions column: "Edit" as a text value is a
    // placeholder, the real verbs come from the idea.
    if (!canEdit && colIdx === actionColIdx) return '';
    if (hasRowActions && colIdx === actionColIdx && row) {
      return renderRowActions(row);
    }
    const lower = cell.toLowerCase();
    const statusColor = statusColors[lower];
    if (statusColor && colIdx > 0) {
      return <Chip label={cell} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, backgroundColor: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }} />;
    }
    if (lower === 'view' || lower === 'book now' || lower === 'order' || lower === 'get coupon') {
      return (
        <Button size="small" variant="text"
          onClick={(e) => { e.stopPropagation(); if (row) setDetailRow(row); }}
          sx={{ color: theme.primary, textTransform: 'none', fontSize: '0.78rem', fontWeight: 600, minWidth: 0, p: '2px 8px' }}>
          {cell}
        </Button>
      );
    }
    if (lower === 'edit' && !canEdit) return '';
    if (lower === 'edit') {
      const rowIndex = rows.findIndex(r => r === row);
      return (
        <Button size="small" variant="text"
          onClick={(e) => { e.stopPropagation(); if (rowIndex >= 0) openEditForm(rowIndex); }}
          sx={{ color: theme.primary, textTransform: 'none', fontSize: '0.78rem', fontWeight: 600, minWidth: 0, p: '2px 8px' }}>
          Edit
        </Button>
      );
    }
    return cell;
  };

  return (
    <Card sx={cardSx}>
      <Box sx={{ p: 2, pb: 0, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small" placeholder="Search..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            sx={{
              flex: 1, maxWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: `${theme.borderRadius}px`, fontSize: '0.82rem', fontFamily: theme.fontFamily,
                '& fieldset': { borderColor: theme.border },
              },
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: theme.textSecondary }} /></InputAdornment>,
            }}
          />
          <Typography sx={{ fontSize: '0.75rem', color: theme.textSecondary, fontFamily: theme.fontFamily, ml: 'auto', mr: 1 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </Typography>
          {canEdit && <Button size="small" variant="contained" onClick={openAddForm}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, minHeight: 32,
                backgroundColor: theme.primary, borderRadius: `${theme.borderRadius}px`, '&:hover': { backgroundColor: theme.primaryDark } }}>
              + Add New
            </Button>}
          {onExport && (
            <Button size="small" variant="outlined" onClick={onExport}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600, minHeight: 32,
                borderColor: theme.border, color: theme.textSecondary, borderRadius: `${theme.borderRadius}px` }}>
              Export CSV
            </Button>
          )}
        </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: theme.fontFamily }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(i)}
                  style={{
                    textAlign: 'left', padding: '12px 14px', borderBottom: `2px solid ${theme.border}`,
                    color: sortCol === i ? theme.primary : theme.textSecondary,
                    fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                  }}
                >
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    {col}
                    {sortCol === i && (sortDir === 'asc'
                      ? <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                      : <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                    )}
                  </Box>
                </th>
              ))}
              {hasRowActions && actionColIdx === -1 && (
                <th style={{
                  textAlign: 'left', padding: '12px 14px', borderBottom: `2px solid ${theme.border}`,
                  color: theme.textSecondary, fontSize: '0.73rem', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
                }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length + (hasRowActions && actionColIdx === -1 ? 1 : 0)} style={{ padding: 24, textAlign: 'center', color: theme.textSecondary }}>No results found</td></tr>
            ) : paged.map((row, ri) => (
              <tr key={ri} style={{
                borderBottom: `1px solid ${theme.border}`,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onClick={() => setDetailRow(row)}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${theme.primary}05`)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '11px 14px', fontSize: '0.83rem',
                    color: ci === 0 ? theme.text : theme.textSecondary,
                    fontWeight: ci === 0 ? 600 : 400, whiteSpace: 'nowrap',
                  }}>
                    {renderCell(cell, ci, row)}
                  </td>
                ))}
                {hasRowActions && actionColIdx === -1 && (
                  <td style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}>
                    {renderRowActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} size="small"
            sx={{ '& .MuiPaginationItem-root': { fontFamily: theme.fontFamily, fontSize: '0.78rem' }, '& .Mui-selected': { backgroundColor: `${theme.primary} !important`, color: '#fff' } }}
          />
        </Box>
      )}
      {/* Detail Modal — opens on row click */}
      <Dialog open={!!detailRow} onClose={() => setDetailRow(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: theme.fontFamily }}>
          Record Details
          <IconButton onClick={() => setDetailRow(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {detailRow && columns.map((col, i) => (
            <Box key={col} sx={{ display: 'flex', py: 1.5, borderBottom: i < columns.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
              <Typography sx={{ width: 140, fontWeight: 600, fontSize: '0.85rem', color: theme.textSecondary, fontFamily: theme.fontFamily }}>
                {col}
              </Typography>
              <Typography sx={{ flex: 1, fontSize: '0.85rem', color: theme.text, fontFamily: theme.fontFamily }}>
                {detailRow[i] || '—'}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
          {canEdit ? <Button color="error" onClick={() => {
            const idx = rows.findIndex(r => r === detailRow);
            if (idx >= 0) handleDeleteRow(idx);
          }} sx={{ textTransform: 'none' }}>Delete</Button> : <span />}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canEdit && <Button onClick={() => {
              const idx = rows.findIndex(r => r === detailRow);
              if (idx >= 0) { setDetailRow(null); openEditForm(idx); }
            }} sx={{ textTransform: 'none' }}>Edit</Button>}
            <Button onClick={() => setDetailRow(null)} variant="contained" sx={{ textTransform: 'none' }}>Close</Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={addFormOpen} onClose={() => setAddFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: theme.fontFamily }}>
          {editRowIdx !== null ? 'Edit Record' : `Add New ${sectionTitle || 'Record'}`}
          <IconButton onClick={() => setAddFormOpen(false)} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {columns.filter(c => c.toLowerCase() !== 'actions').map((col, i) => (
              <TextField key={col} fullWidth size="small" label={col}
                value={formValues[i] || ''}
                onChange={e => setFormValues(prev => { const next = [...prev]; next[i] = e.target.value; return next; })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: `${theme.borderRadius}px` } }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddFormOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveForm}
            sx={{ textTransform: 'none', backgroundColor: theme.primary, borderRadius: `${theme.borderRadius}px` }}>
            {editRowIdx !== null ? 'Save Changes' : 'Add Record'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DynamicPage;
