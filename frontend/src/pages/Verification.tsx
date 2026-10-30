import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, InputAdornment, CircularProgress, Tabs, Tab, Link,
} from '@mui/material';
import { Search as SearchIcon, Inbox as InboxIcon } from '@mui/icons-material';
import { useAppTheme } from '../hooks/useAppTheme';
import { useToast } from '../components/ToastProvider';
import StatusChip from '../components/StatusChip';
import api from '../api';
import { loadSession, canWrite } from '../auth/session';

// Each tab is a status filter sent to the server.
const STATUS_TABS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

type Row = { id?: number | string; [k: string]: any };

const listOf = (d: any): any[] =>
  Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.results) ? d.results
    : Array.isArray(d?.data) ? d.data : [];

// An upload is a link when the server sends one, otherwise whatever it sent.
const upload = (v: any): React.ReactNode => {
  if (v === null || v === undefined || v === '') return '—';
  const s = String(v);
  return /^(https?:)?\//.test(s) ? <Link href={s} target="_blank" rel="noopener">View file</Link> : s;
};

const consent = (v: any): string =>
  v === true ? 'Given' : v === false ? 'Not given' : v === null || v === undefined || v === '' ? '—' : String(v);

const caregiverOf = (row: Row): string =>
  String(row.caregiver_name ?? row.caregiver?.full_name ?? row.caregiver?.name ?? row.caregiver_id ?? '—');

const Verification: React.FC = () => {
  const theme = useAppTheme();
  const showToast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | string | null>(null);
  const [rejecting, setRejecting] = useState<Row | null>(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const [canEdit, setCanEdit] = useState(true);
  useEffect(() => { loadSession().then(s => setCanEdit(canWrite(s.role))); }, []);

  // Search, status and paging go to the server; nothing is filtered here.
  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params: Record<string, any> = { page, limit, status: statusFilter };
      if (search) params.search = search;
      const r = await api.get('/api/verification', { params });
      setTotal(typeof r?.data?.total === 'number' ? r.data.total : null);
      setRows(listOf(r?.data));
    } catch (err: any) {
      console.error('[verification] load failed:', err?.response?.status, err?.message);
      setRows([]);
      setLoadError(err?.response?.status === 404 ? 'Endpoint not available'
        : err?.response?.data?.detail || err?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { load(); }, search ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, statusFilter]);

  const handleApprove = async (row: Row) => {
    if (row.id === undefined || row.id === null) return;
    setBusyId(row.id);
    try {
      await api.post('/api/verification/' + row.id + '/approve', {});
      showToast('Verification approved', 'success');
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Approve failed. Nothing was changed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const openReject = (row: Row) => { setRejecting(row); setReason(''); setReasonError(''); };

  const handleRejectConfirmed = async () => {
    if (rejecting?.id === undefined || rejecting?.id === null) return;
    if (!reason.trim()) { setReasonError('A reason is required'); return; }
    setBusyId(rejecting.id);
    try {
      await api.post('/api/verification/' + rejecting.id + '/reject', { reason: reason.trim(), rejection_reason: reason.trim() });
      showToast('Verification rejected', 'success');
      setRejecting(null);
      load();
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Reject failed. Nothing was changed.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const isOpen = (row: Row) => !['approved', 'rejected'].includes(String(row.status || '').toLowerCase());
  const showActions = canEdit && statusFilter === 'pending';
  const cols = showActions ? 7 : 6;

  return (
    <Box sx={{ p: 3, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text }}>
          Verification
        </Typography>
      </Box>

      <Tabs value={statusFilter} onChange={(_, v) => { setStatusFilter(v); setPage(1); }}
            variant="scrollable" allowScrollButtonsMobile sx={{ mb: 2 }}>
        {STATUS_TABS.map(t => <Tab key={t.value} value={t.value} label={t.label} sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48 }} />)}
      </Tabs>

      <Paper sx={{ p: 2, mb: 2, borderRadius: theme.borderRadius + 'px',
                    border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <TextField fullWidth size="small"
          placeholder="Search verifications by caregiver..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
      </Paper>

      {!loading && loadError ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: theme.borderRadius + 'px',
                      border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: theme.text, mb: 1 }}>
            The request failed
          </Typography>
          <Typography sx={{ color: theme.textSecondary, mb: 3 }}>{loadError}</Typography>
          <Button variant="outlined" onClick={() => { setLoadError(null); load(); }}
                  sx={{ textTransform: 'none', fontWeight: 600, borderColor: theme.border, color: theme.text }}>
            Try again
          </Button>
        </Paper>
      ) : !loading && rows.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: theme.borderRadius + 'px',
                      border: `1px dashed ${theme.border}`, bgcolor: theme.surface }}>
          <InboxIcon sx={{ fontSize: 64, color: theme.textSecondary, opacity: 0.5, mb: 2 }} />
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: theme.text, mb: 1 }}>
            No {(STATUS_TABS.find(t => t.value === statusFilter)?.label || '').toLowerCase()} verifications
          </Typography>
          <Typography sx={{ color: theme.textSecondary }}>
            {search ? 'No verification matches your search.' : 'Caregiver submissions appear here once they upload their documents.'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}
          sx={{ borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Caregiver</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID Upload</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Certifications</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Background Check Consent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rejection Reason</TableCell>
                {showActions && <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={cols} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell></TableRow>
              )}
              {!loading && rows.map((row, idx) => (
                <TableRow key={row.id ?? idx} hover>
                  <TableCell>{caregiverOf(row)}</TableCell>
                  <TableCell>{upload(row.id_upload)}</TableCell>
                  <TableCell>{upload(row.certifications_upload)}</TableCell>
                  <TableCell>{consent(row.background_check_consent)}</TableCell>
                  <TableCell><StatusChip status={String(row.status ?? '')} /></TableCell>
                  <TableCell>{row.rejection_reason || '—'}</TableCell>
                  {showActions && <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {isOpen(row) && <>
                      <Button size="small" variant="contained" disabled={busyId !== null}
                              onClick={() => handleApprove(row)}
                              sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600, mr: 1,
                                    '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
                        {busyId === row.id ? 'Working...' : 'Approve'}
                      </Button>
                      <Button size="small" variant="outlined" color="error" disabled={busyId !== null}
                              onClick={() => openReject(row)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Reject
                      </Button>
                    </>}
                  </TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && total !== null && total > limit && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Typography component="p" sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>
            Showing {(page - 1) * limit + 1}&ndash;{Math.min(page * limit, total)} of {total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
            <Button size="small" variant="outlined" disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </Box>
        </Box>
      )}

      <Dialog open={!!rejecting} onClose={() => busyId === null && setRejecting(null)} fullWidth maxWidth="sm">
        <DialogTitle>Reject verification?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            The caregiver will see this reason and can submit their documents again.
          </DialogContentText>
          <TextField fullWidth multiline minRows={3} margin="dense" label="Rejection reason" required
                     value={reason} onChange={e => { setReason(e.target.value); setReasonError(''); }}
                     error={!!reasonError} helperText={reasonError} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejecting(null)} disabled={busyId !== null}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleRejectConfirmed} disabled={busyId !== null}>
            {busyId !== null ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Verification;
