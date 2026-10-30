import { statusLabel } from '../i18n';
import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { AppTheme } from '../hooks/useAppTheme';
import { STATUS_COLOR_MAP } from '../config/statusColors';
import { cardSx, primaryButtonSx } from '../utils/themeStyles';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  theme: AppTheme;
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  actions?: (row: any) => React.ReactNode;
}

const StatusChip: React.FC<{ status: string; theme: AppTheme }> = ({ status, theme }) => {
  const lower = status.toLowerCase();
  const category = STATUS_COLOR_MAP[lower];
  let color = theme.textSecondary;
  let bg = `${theme.textSecondary}15`;

  if (category === 'success') {
    color = theme.success;
    bg = `${theme.success}15`;
  } else if (category === 'error') {
    color = theme.error;
    bg = `${theme.error}15`;
  } else if (category === 'warning') {
    color = theme.warning;
    bg = `${theme.warning}20`;
  } else if (category === 'neutral') {
    color = theme.textSecondary;
    bg = `${theme.textSecondary}10`;
  }

  return (
    <Box
      component="span"
      sx={{
        px: 1.5,
        py: 0.3,
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: 600,
        color,
        backgroundColor: bg,
        whiteSpace: 'nowrap',
      }}
    >
      {statusLabel(status)}
    </Box>
  );
};

export { StatusChip };

/** Row style based on tableStyle */
function getRowSx(theme: AppTheme, idx: number, isDark: boolean, hasClick: boolean): Record<string, any> {
  const base: Record<string, any> = {
    cursor: hasClick ? 'pointer' : 'default',
    transition: 'background-color 0.15s',
  };

  switch (theme.tableStyle) {
    case 'striped':
      return {
        ...base,
        backgroundColor: idx % 2 === 0 ? theme.surfaceAlt : 'transparent',
        borderBottom: `1px solid ${theme.border}`,
        '&:hover': { backgroundColor: `${theme.primary}08` },
      };
    case 'bordered':
      return {
        ...base,
        borderBottom: `1px solid ${theme.border}`,
        '& td': { borderRight: `1px solid ${theme.border}` },
        '& td:last-child': { borderRight: 'none' },
        '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
      };
    case 'minimal':
      return {
        ...base,
        borderBottom: 'none',
        '&:hover': { backgroundColor: `${theme.primary}12` },
      };
    case 'clean':
    default:
      return {
        ...base,
        borderBottom: `1px solid ${theme.border}`,
        '&:hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
      };
  }
}

/** Header border style based on tableStyle */
function getHeaderBorderSx(theme: AppTheme): Record<string, any> {
  switch (theme.tableStyle) {
    case 'bordered':
      return { borderBottom: `3px solid ${theme.primary}` };
    case 'minimal':
      return { borderBottom: `1px solid ${theme.border}` };
    default:
      return { borderBottom: `2px solid ${theme.border}` };
  }
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  theme,
  searchPlaceholder = 'Search...',
  pageSize = 8,
  onRowClick,
  actions,
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let filtered = data;
    if (search) {
      const lower = search.toLowerCase();
      filtered = data.filter(row =>
        Object.values(row).some(v =>
          String(v).toLowerCase().includes(lower)
        )
      );
    }
    if (sortCol) {
      filtered = [...filtered].sort((a, b) => {
        const av = a[sortCol] ?? '';
        const bv = b[sortCol] ?? '';
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return filtered;
  }, [data, search, sortCol, sortDir]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(page * pageSize, (page + 1) * pageSize);
  const isDark = theme.background.startsWith('#0') || theme.background.startsWith('#1');

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const headerBorder = getHeaderBorderSx(theme);

  return (
    <Box
      sx={{
        ...cardSx(theme),
        overflow: 'hidden',
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 1.5, borderBottom: `1px solid ${theme.border}`, display: 'flex', gap: 1 }}>
        <Box
          component="input"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(0); }}
          placeholder={searchPlaceholder}
          sx={{
            flex: 1,
            border: `1px solid ${theme.border}`,
            borderRadius: `${theme.borderRadius / 2}px`,
            px: 1.5,
            py: 0.8,
            fontSize: '0.85rem',
            fontFamily: theme.fontFamily,
            backgroundColor: theme.surfaceAlt,
            color: theme.text,
            outline: 'none',
            '&:focus': {
              borderColor: theme.primary,
              boxShadow: `0 0 0 2px ${theme.primary}20`,
            },
            '&::placeholder': {
              color: theme.textSecondary,
            },
          }}
        />
        <Box sx={{ ...primaryButtonSx(theme), px: 1.5, py: 0.8 }}>
          + Add New
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
          <Box component="thead">
            <Box component="tr" sx={{ backgroundColor: theme.surfaceAlt }}>
              {columns.map(col => (
                <Box
                  component="th"
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  sx={{
                    px: 1.5,
                    py: 1,
                    textAlign: col.align || 'left',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    ...headerBorder,
                    width: col.width,
                    '&:hover': { color: theme.primary },
                  }}
                >
                  {col.label}
                  {sortCol === col.key && (
                    <Box component="span" sx={{ ml: 0.5, fontSize: '0.65rem' }}>
                      {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
                    </Box>
                  )}
                </Box>
              ))}
              {actions && (
                <Box
                  component="th"
                  sx={{
                    px: 1.5,
                    py: 1,
                    textAlign: 'right',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    ...headerBorder,
                    width: '100px',
                  }}
                >
                  Actions
                </Box>
              )}
            </Box>
          </Box>
          <Box component="tbody">
            {pageData.map((row, idx) => (
              <Box
                component="tr"
                key={idx}
                onClick={() => onRowClick?.(row)}
                sx={getRowSx(theme, idx, isDark, !!onRowClick)}
              >
                {columns.map(col => (
                  <Box
                    component="td"
                    key={col.key}
                    sx={{
                      px: 1.5,
                      py: 1.2,
                      fontSize: '0.82rem',
                      color: theme.text,
                      fontFamily: theme.fontFamily,
                      textAlign: col.align || 'left',
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : (
                      ['status', 'Status'].some(s => col.key.toLowerCase().includes(s.toLowerCase()))
                        ? <StatusChip status={String(row[col.key])} theme={theme} />
                        : String(row[col.key] ?? '')
                    )}
                  </Box>
                ))}
                {actions && (
                  <Box
                    component="td"
                    sx={{
                      px: 1.5,
                      py: 1.2,
                      textAlign: 'right',
                    }}
                  >
                    {actions(row)}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          p: 1.5,
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: theme.textSecondary, fontFamily: theme.fontFamily }}>
          Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredData.length)} of {filteredData.length}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <Box
              key={i}
              onClick={() => setPage(i)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: `${theme.borderRadius / 2}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: page === i ? 600 : 400,
                color: page === i ? '#fff' : theme.textSecondary,
                backgroundColor: page === i ? theme.primary : 'transparent',
                cursor: 'pointer',
                fontFamily: theme.fontFamily,
                '&:hover': {
                  backgroundColor: page === i ? theme.primary : `${theme.primary}10`,
                },
              }}
            >
              {i + 1}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DataTable;
