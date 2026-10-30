import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, InputAdornment, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Autocomplete, useMediaQuery, Tabs, Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon,
         Inbox as InboxIcon } from '@mui/icons-material';
import { useAppTheme } from '../hooks/useAppTheme';
import { useToast } from '../components/ToastProvider';
import StatusChip from '../components/StatusChip';
import api from '../api';
import { loadSession, canWrite } from '../auth/session';
import type { Booking } from '../types/blueprint';

// The tabs a family sorts its bookings by; each one is a status filter sent to the server.
const STATUS_TABS = [
  { value: 'requested', label: 'Requested' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

// The name of the thing a foreign key points at, under whichever shape the
// backend returns it — a flat `client_name`, a nested object, or first and
// last name apart. Falls back to the id, which at least matches another
// screen; a blank column says nothing at all.
const refLabel = (row: any, stem: string, opts?: RefOption[]): string => {
  const o = row?.[stem];
  const parts = [o?.first_name, o?.last_name].filter(Boolean).join(' ');
  const name = row?.[stem + '_name'] ?? row?.[stem + '_title'] ?? o?.name ?? o?.full_name ?? o?.title
    ?? (parts || undefined);
  if (name) return String(name);
  const id = row?.[stem + '_id'];
  if (id === null || id === undefined || id === '') return '—';
  // The record the key points at, from the list this page already loaded
  // for its dropdown, before falling back to the bare id.
  const hit = (opts || []).find(x => x.value === String(id));
  return hit ? hit.label : String(id);
};

type RefOption = { value: string; label: string };

// How a record introduces itself in a dropdown.
const optionLabel = (o: any): string => {
  const parts = [o?.first_name, o?.last_name].filter(Boolean).join(' ');
  return String(o?.full_name ?? (parts || undefined) ?? o?.name ?? o?.title
    ?? o?.email ?? o?.id ?? '');
};

// "2026-10-12T10:00:00" is for a machine. A date-only value is read in UTC
// so it does not slip to the previous day west of Greenwich.
const fmtDate = (v: any): string => {
  if (v === null || v === undefined || v === '') return '—';
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  const hasTime = /T\d|\d:\d/.test(String(v));
  return hasTime
    ? d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

// field -> the list endpoint of the records it points at
const REF_SOURCES: Record<string, string> = {};

type Row = Booking & { id?: number | string; [k: string]: any };

const REQUIRED_FIELDS: string[] = ["caregiver_name", "date", "start_time", "duration_hours", "total", "status"];

const BookingsFamily: React.FC = () => {
  const theme = useAppTheme();
  const showToast = useToast();
  const isPhone = useMediaQuery('(max-width:600px)');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('requested');
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [form, setForm] = useState<Row>(({ caregiver_name: "", date: "", start_time: "", duration_hours: undefined, total: undefined, status: "", can_cancel: false, can_reschedule: false } as Row));
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Options for every field that points at another record. Loaded once:
  // they fill the dropdowns and name the record in the table.
  const [refOptions, setRefOptions] = useState<Record<string, RefOption[]>>({});
  // One literal call per linked field, so the endpoint reader — and the
  // enrichment check that relies on it — can see every URL this page calls.
  // A loop over REF_SOURCES hid each URL behind a variable: 9 "unresolved" calls and
  // two enriched pages reverted (healthcare_marketplace99978858).
  const takeOptions = (field: string) => (r: any) => {
    const d = r?.data;
    const arr = Array.isArray(d) ? d
      : Array.isArray(d?.items) ? d.items
      : Array.isArray(d?.results) ? d.results
      : Array.isArray(d?.data) ? d.data : [];
    setRefOptions(prev => ({ ...prev, [field]: arr
      .filter((o: any) => o && o.id !== undefined && o.id !== null)
      .map((o: any) => ({ value: String(o.id), label: optionLabel(o) })) }));
  };
  useEffect(() => {
    // no linked fields
  }, []);

  // Tolerant to the four common response shapes:
  //   [...]                    → use as-is
  //   { items: [...] }         → Pydantic/FastAPI paginated
  //   { results: [...] }       → DRF-style
  //   { data: [...] }          → wrapper-style
  // On error (404/500/network): logs the failure to console and shows
  // an empty state — no silent "0 rows" masking a missing endpoint.
  const [loadError, setLoadError] = useState<string | null>(null);
  // Server-side query, not a client-side filter.
  //
  // This page used to fetch every row and filter in the browser. Measured
  // across a real build, 0 of 27 pages sent a single query param and 10 pulled
  // the whole table — which does not scale, and sends the entire dataset to the
  // client so the client can throw most of it away. For PHI that is the
  // opposite of minimum-necessary access.
  //
  // `total` comes back only from a paginated response; when the backend answers
  // with a plain array the page still works, it simply has one page of results.
  const [total, setTotal] = useState<number | null>(null);
  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      if (statusFilter) params.status = statusFilter;
      if (sortBy) { params.sort = sortBy; params.order = sortOrder; }
      const r = await api.get('/api/bookings', { params });
      const d = r?.data;
      setTotal(typeof d?.total === 'number' ? d.total : null);
      const arr = Array.isArray(d) ? d
        : Array.isArray(d?.items) ? d.items
        : Array.isArray(d?.results) ? d.results
        : Array.isArray(d?.data) ? d.data
        : [];
      setRows(arr);
    } catch (err: any) {
      console.error('[bookings] load failed:', err?.response?.status, err?.message);
      setRows([]);
      setLoadError(
        err?.response?.status === 404
          ? 'Endpoint not available'
          : err?.response?.data?.detail || err?.message || 'Failed to load'
      );
    } finally {
      setLoading(false);
    }
  };

  // Refetch when any query input changes. Mount-only meant the filters were
  // decoration: typing in the search box changed state and nothing asked the
  // server again.
  //
  // Debounced so a search does not fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => { load(); }, search ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, dateFrom, dateTo, statusFilter, sortBy, sortOrder]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
      const value = form[field];
      if (value === undefined || value === null || value === '' ||
          (typeof value === 'string' && value.trim() === '')) {
        errors[field] = 'This field is required';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // A read-only role (an auditor) sees the records and nothing to change
  // them with. The backend refuses the write as well; this stops offering it.
  const [canEdit, setCanEdit] = useState(true);
  useEffect(() => { loadSession().then(s => setCanEdit(canWrite(s.role))); }, []);

  const handleAdd = () => {
    setEditingId(null);
    setForm(({ caregiver_name: "", date: "", start_time: "", duration_hours: undefined, total: undefined, status: "", can_cancel: false, can_reschedule: false } as Row));
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleEdit = (row: Row) => {
    setEditingId(row.id ?? null);
    setForm({ ...({ caregiver_name: "", date: "", start_time: "", duration_hours: undefined, total: undefined, status: "", can_cancel: false, can_reschedule: false } as Row), ...row });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleDeleteRequest = (row: Row) => {
    if (!row.id) return;
    setConfirmDelete(row);
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete?.id) return;
    setDeleting(true);
    try {
      await api.delete('/api/bookings/' + confirmDelete.id);
      showToast('Booking removed', 'success');
      load();
    } catch {
      showToast('Delete failed. Please try again.', 'error');
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId != null) {
        await api.put('/api/bookings/' + editingId, form);
        showToast('Booking updated', 'success');
      } else {
        await api.post('/api/bookings', form);
        showToast('Booking created', 'success');
      }
      setDialogOpen(false);
      load();
    } catch {
      showToast('Save failed. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // The server has already applied search, filters, sort and paging, so there
  // is nothing left to filter here. Kept as a named value because the table
  // below reads it, and because re-filtering server-filtered rows would hide
  // a backend that ignored the params.
  const filteredRows = rows;

  return (
    <Box sx={{ p: 3, bgcolor: theme.background, minHeight: '100vh', fontFamily: theme.fontFamily }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography component="h1" variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text }}>
          My Bookings
        </Typography>
        {canEdit && <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/bookings/new')}
                sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600,
                      borderRadius: theme.borderRadius + 'px',
                      '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
          Book a Visit
        </Button>}
      </Box>

      <Tabs value={statusFilter} onChange={(_, v) => { setStatusFilter(v); setPage(1); }}
            variant="scrollable" allowScrollButtonsMobile sx={{ mb: 2 }}>
        {STATUS_TABS.map(t => <Tab key={t.value} value={t.value} label={t.label} sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48 }} />)}
      </Tabs>

      <Paper sx={{ p: 2, mb: 2, borderRadius: theme.borderRadius + 'px',
                    border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
        <TextField fullWidth size="small"
          placeholder="Search bookings by caregiver..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
      </Paper>

      {/* A failed load is not an empty list. Rendering "no records yet" for a
          request that never succeeded tells the user the opposite of what
          happened, and hides the outage: a generated page did exactly that
          and only a reviewer reading the source noticed. */}
      {!loading && loadError ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: theme.borderRadius + 'px',
                      border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: theme.text, mb: 1 }}>
            The request failed
          </Typography>
          <Typography sx={{ color: theme.textSecondary, mb: 3 }}>{loadError}</Typography>
          <Button variant="outlined" onClick={() => { setLoadError(null); load(); }}
                  sx={{ textTransform: 'none', fontWeight: 600, borderColor: theme.border,
                        color: theme.text }}>
            Try again
          </Button>
        </Paper>
      ) : null}

      {/* Empty state when no rows at all (pre-search) */}
      {!loading && !loadError && rows.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: theme.borderRadius + 'px',
                      border: `1px dashed ${theme.border}`, bgcolor: theme.surface }}>
          <InboxIcon sx={{ fontSize: 64, color: theme.textSecondary, opacity: 0.5, mb: 2 }} />
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600, color: theme.text, mb: 1 }}>
            No {(STATUS_TABS.find(t => t.value === statusFilter)?.label || '').toLowerCase()} bookings
          </Typography>
          <Typography sx={{ color: theme.textSecondary, mb: 3 }}>
            Find a caregiver and book a visit to see it here.
          </Typography>
          {canEdit && <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/bookings/new')}
                  sx={{ bgcolor: theme.primary, textTransform: 'none', fontWeight: 600,
                        '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
            Book a Visit
          </Button>}
        </Paper>
      ) : loadError ? null : isPhone ? (
        <Box>
          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>}
          {!loading && filteredRows.map((row, idx) => (
            <Paper key={row.id ?? idx} sx={{ p: 2, mb: 1.5, borderRadius: theme.borderRadius + 'px',
                                              border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, color: theme.text }}>{row.caregiver_name ?? "—"}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>Date: {fmtDate(row.date)}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>Start Time: {row.start_time ?? "—"}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>Hours: {row.duration_hours ?? "—"}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>Total: {row.total ?? "—"}</Typography>
                  <Box sx={{ mt: 0.75 }}><StatusChip status={String(row.status ?? "")} /></Box>
                </Box>
                {canEdit && <>
                <IconButton aria-label="edit" size="small" onClick={() => handleEdit(row)} title="Edit">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete" size="small" onClick={() => handleDeleteRequest(row)}
                            title="Delete" sx={{ color: '#d32f2f' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                </>}
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}
          sx={{ borderRadius: theme.borderRadius + 'px', border: `1px solid ${theme.border}`, bgcolor: theme.surface }}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Caregiver</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hours</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                {canEdit && <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell></TableRow>
              )}
              {!loading && filteredRows.length === 0 && rows.length > 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: theme.textSecondary }}>
                  No results match your search.
                </TableCell></TableRow>
              )}
              {!loading && filteredRows.map((row, idx) => (
                <TableRow key={row.id ?? idx} hover>
                <TableCell>{row.caregiver_name ?? "—"}</TableCell>
                <TableCell>{fmtDate(row.date)}</TableCell>
                <TableCell>{row.start_time ?? "—"}</TableCell>
                <TableCell>{row.duration_hours ?? "—"}</TableCell>
                <TableCell>{row.total ?? "—"}</TableCell>
                <TableCell><StatusChip status={String(row.status ?? "")} /></TableCell>
                  {canEdit && <TableCell align="right">
                    <IconButton aria-label="edit" size="small" onClick={() => handleEdit(row)}
                                title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" size="small" onClick={() => handleDeleteRequest(row)}
                                title="Delete" sx={{ color: '#d32f2f' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Paging. The request has always sent `page` and `limit` and read
          `total` back; what was missing was any way to use them. `setPage`
          existed only to reset to 1 on a new search, so the list asked for
          page 1 for ever, `total` was fetched and thrown away, and a customer
          with more records than one page could not reach the rest or even be
          told they existed. Measured: 0 of 95 tables across the stored
          projects offered a way to turn the page.

          Shown only when the server reports a `total` larger than one page. A
          backend that ignores the params returns no total, and then there is
          nothing honest to say — so nothing is rendered. */}
      {!loading && total !== null && total > limit && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Typography component="p" sx={{ fontSize: '0.85rem', color: theme.textSecondary }}>
            Showing {(page - 1) * limit + 1}&ndash;{Math.min(page * limit, total)} of {total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}>
              Previous
            </Button>
            <Button size="small" variant="outlined" disabled={page * limit >= total}
                    onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId != null ? 'Reschedule' : 'Add'} Booking</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Caregiver" name="caregiver_name" type="text" required value={form.caregiver_name ?? ""} onChange={e => setForm({ ...form, caregiver_name: e.target.value })} error={!!formErrors.caregiver_name} helperText={formErrors.caregiver_name || ""} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Date" name="date" type="date" required value={form.date ?? ""} InputLabelProps={{ shrink: true }} onChange={e => setForm({ ...form, date: e.target.value })} error={!!formErrors.date} helperText={formErrors.date || ""} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Start Time" name="start_time" type="text" required value={form.start_time ?? ""} onChange={e => setForm({ ...form, start_time: e.target.value })} error={!!formErrors.start_time} helperText={formErrors.start_time || ""} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Hours" name="duration_hours" type="number" required value={form.duration_hours ?? ""} onChange={e => setForm({ ...form, duration_hours: e.target.value === "" ? undefined : Number(e.target.value) })} error={!!formErrors.duration_hours} helperText={formErrors.duration_hours || ""} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Total" name="total" type="number" required value={form.total ?? ""} onChange={e => setForm({ ...form, total: e.target.value === "" ? undefined : Number(e.target.value) })} error={!!formErrors.total} helperText={formErrors.total || ""} sx={{ mb: 2 }} />
          <TextField fullWidth margin="dense" label="Status" name="status" type="text" required value={form.status ?? ""} onChange={e => setForm({ ...form, status: e.target.value })} error={!!formErrors.status} helperText={formErrors.status || ""} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button type="submit" variant="contained" onClick={handleSave} disabled={saving}
                  sx={{ bgcolor: theme.primary, '&:hover': { bgcolor: theme.primary, opacity: 0.9 } }}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Branded delete-confirmation dialog */}
      <Dialog open={!!confirmDelete} onClose={() => !deleting && setConfirmDelete(null)}
               fullWidth maxWidth="xs">
        <DialogTitle>Remove this booking?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Cancellation is free until 24 hours before the visit; after that, 50% is charged. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)} disabled={deleting}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirmed} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingsFamily;
