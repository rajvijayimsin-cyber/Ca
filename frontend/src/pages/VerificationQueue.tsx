import { statusLabel, tx } from '../i18n';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DynamicPage from '../components/DynamicPage';
import { generatePageSpecs, PAGE_SECTION_RULES } from '../utils/pageSpecGenerator';
import { useAppTheme } from '../hooks/useAppTheme';
import { apiGet, apiPost } from '../apiWithMock';
import { useToast } from '../components/ToastProvider';

const VerificationQueue: React.FC = () => {
  const theme = useAppTheme();
  const navigate = useNavigate();
  const showToast = useToast();
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/api/verification_queue').then(r => setItems(r.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const handleApprove = useCallback((id: string) => {
    apiPost('/api/verification_queue/' + id + '/approve', {})
      .then(() => showToast('Approve done', 'success'))
      .catch(() => showToast('Approve failed', 'error'));
  }, [showToast]);
  const handleReject = useCallback((id: string) => {
    apiPost('/api/verification_queue/' + id + '/reject', {})
      .then(() => showToast('Reject done', 'success'))
      .catch(() => showToast('Reject failed', 'error'));
  }, [showToast]);

  const handleNavigate = useCallback((pageId: string) => {
    const route = '/' + pageId.replace(/_/g, '-');
    navigate(route);
    showToast('Navigating to ' + pageId.replace(/_/g, ' '), 'info');
  }, [navigate, showToast]);

  const config = useMemo(() => ({
    theme,
    appName: 'CareNest',
    navigation: [],
    pages: [],
    complianceBadges: [],
    designStyle: 'modern_minimal',
    layoutType: 'classic_sidebar',
    userRole: '',
    userDisplayName: '',
    isMobile: false,
    archetype: null,
  }), [theme]);

  const pageSpecs = useMemo(() => {
    const specs = generatePageSpecs(["Caregiver search with filters", "Caregiver profiles with reviews", "3-step booking with hourly price summary", "Booking statuses and cancellation rules", "Check-in/check-out visits with notes", "Payments, receipts and refunds", "Messaging", "Reviews", "Caregiver verification", "Earnings and payouts", "Admin disputes, settings and audit log"]);
    // Ensure this page always has a spec even if no feature maps to it
    const pid = 'verification_queue';
    const pidH = 'verification-queue';
    if (!specs.find(s => s.pageId === pid || s.pageId === pidH)) {
      // Fallback: use PAGE_SECTION_RULES (imported at top) or a basic spec
      const fallbackSections = PAGE_SECTION_RULES[pid] || PAGE_SECTION_RULES[pidH];
      if (fallbackSections) specs.push({ pageId: pid, sections: fallbackSections });
      else specs.push({ pageId: pid, sections: [{ type: 'data_table' as any, title: 'Caregiver Verification Queue', order: 1, gridSpan: 12, config: { columns: ['Documents', 'Decision Reason'], rows: [] } }] });
    }
    return specs;
  }, []);
  // The rows this page fetched, in the table this page renders.
  //
  // The fetch result used to be stored and never read again: the page called
  // its endpoint, dropped the response on the floor, and rendered the spec's
  // empty `rows: []`. Measured across eight projects, 11 pages did this.
  const spec = useMemo(() => {
    const base = pageSpecs.find(s => s.pageId === 'verification_queue' || s.pageId === 'verification-queue');
    if (!base) return undefined;
    const raw: any = items;
    const rows: any[] = Array.isArray(raw) ? raw
      : (raw?.items || raw?.results || raw?.data || []);
    if (!rows.length) return base;
    // The blueprint's field order when it gave one, otherwise whatever the
    // first record actually has — never a guess at what the columns mean.
    const names: string[] = ["documents", "decision_reason"].length
      ? ["documents", "decision_reason"]
      : Object.keys(rows[0] || {}).filter(k => k !== 'id').slice(0, 6);
    const cell = (v: any) =>
      v === null || v === undefined || v === '' ? '—'
        : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return {
      ...base,
      sections: base.sections.map((sec: any) =>
        sec.type === 'data_table'
          ? { ...sec, config: {
                ...sec.config,
                columns: (["documents", "decision_reason"].length && sec.config?.columns?.length)
                  ? sec.config.columns
                  // The word-boundary escape is doubled in the generator: single,
                  // Python wrote a backspace and headers read "first name".
                  : names.map(n => tx(n.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))),
                // a state is shown as its label; the value stays the key
                rows: rows.map((r: any) => names.map(n =>
                  /status|state|severity|priority|stage/i.test(n) && r?.[n] ? statusLabel(r[n]) : cell(r?.[n]))),
              } }
          : sec),
    };
  }, [pageSpecs, items]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!spec) return <Box sx={{ p: 3 }}>No page spec found for Caregiver Verification Queue.</Box>;

  return <DynamicPage spec={spec} config={config} seed="verification_queue" onNavigate={handleNavigate} onToast={showToast} rowActions={[{ label: 'Approve', onClick: handleApprove }, { label: 'Reject', onClick: handleReject }]} />;
};

export default VerificationQueue;
