import React from 'react';
import { Box } from '@mui/material';
import { useAppTheme } from '../hooks/useAppTheme';
import { statusLabel } from '../i18n';

const STATUS_COLOR_MAP: Record<string, string> = {
  active: 'success', confirmed: 'success', completed: 'success', paid: 'success',
  approved: 'success', normal: 'success', stable: 'success', resolved: 'success',
  discharged: 'neutral', reported: 'success', collected: 'success', resulted: 'success',
  'on track': 'success', achieved: 'success', 'on target': 'success',
  pending: 'warning', 'in progress': 'warning', 'partially paid': 'warning',
  scheduled: 'warning', ordered: 'warning', waiting: 'warning', triage: 'warning',
  'on hold': 'warning', processing: 'warning', observation: 'warning', 'pre-op': 'warning',
  critical: 'error', overdue: 'error', cancelled: 'error', inactive: 'error',
  abnormal: 'error', urgent: 'error', stat: 'error', discontinued: 'error',
  expired: 'error', failed: 'error', 'high risk': 'error',
  routine: 'neutral', draft: 'neutral', unknown: 'neutral', read: 'neutral',
  // Review-queue vocabulary. Without these an async-review product showed
  // "Awaiting review", "More info needed" and "Declined" in the same grey as
  // the email beside them — on the screen where the state is the whole point.
  submitted: 'warning', 'awaiting review': 'warning', 'in review': 'warning',
  'under review': 'warning', 'needs info': 'warning', 'more info needed': 'warning',
  'action required': 'warning', escalated: 'warning', 'follow up': 'warning',
  denied: 'error', declined: 'error', rejected: 'error', 'not eligible': 'error',
  eligible: 'success', dispensed: 'success', shipped: 'success',
  fulfilled: 'success', signed: 'success', verified: 'success',
  // Booking and outreach vocabulary. "No Show" rendered grey on a studio's
  // session list (healthcare_marketplace232323213).
  'no show': 'error', missed: 'error', 'did not attend': 'error', 'late cancel': 'error',
  'checked in': 'warning', arrived: 'warning', sent: 'warning', requested: 'warning',
  assigned: 'warning', accepted: 'success', reviewed: 'success', done: 'success', closed: 'neutral',
};

// This project's own states, from the blueprint. They win over the
// generic map above, which cannot know a domain's vocabulary.
const PROJECT_STATES: Record<string, string> = {
  "requested": "warning",
  "confirmed": "success",
  "in progress": "neutral",
  "completed": "success",
  "declined": "error",
  "cancelled": "neutral",
  "disputed": "warning",
  "scheduled": "neutral",
  "checked in": "warning",
  "missed": "error",
  "pending": "warning",
  "paid": "success",
  "failed": "error",
  "refund requested": "warning",
  "refunded": "neutral",
};
Object.assign(STATUS_COLOR_MAP, PROJECT_STATES);

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const theme = useAppTheme();
  // "no_show", "No-Show" and "No Show" are one state.
  const category = STATUS_COLOR_MAP[String(status).toLowerCase().replace(/[_-]+/g, ' ').trim()];
  let color = theme.textSecondary;
  let bg = `${theme.textSecondary}15`;
  if (category === 'success') { color = theme.success; bg = `${theme.success}15`; }
  else if (category === 'error') { color = theme.error; bg = `${theme.error}15`; }
  else if (category === 'warning') { color = theme.warning; bg = `${theme.warning}20`; }
  return (
    <Box component="span" sx={{
      px: 1.5, py: 0.3, borderRadius: '20px', fontSize: '0.72rem',
      fontWeight: 600, color, backgroundColor: bg, whiteSpace: 'nowrap',
    }}>{statusLabel(status)}</Box>
  );
};

export default StatusChip;
