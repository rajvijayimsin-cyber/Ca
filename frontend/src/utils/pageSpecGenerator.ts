/**
 * Page-spec generator — maps page IDs to their section layouts.
 *
 * PAGE_SECTION_RULES  : Static registry of section definitions per page.
 * FEATURE_PAGE_MAP    : Maps feature keys to the page IDs they activate.
 * generatePageSpecs() : Given a list of selected features, returns the
 *                       relevant PageSpec objects for the preview system.
 */

import { SectionSpec, PageSpec } from '../types/sections';

// ---------------------------------------------------------------------------
// PAGE_SECTION_RULES — one entry per page, each with an array of SectionSpec
// ---------------------------------------------------------------------------

export const PAGE_SECTION_RULES: Record<string, SectionSpec[]> = {

  // ── Uploads page ────────────────────────────────────────────────────────
  uploads: [
    {
      type: 'action_toolbar',
      title: 'Upload',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Upload Audio', variant: 'primary', icon: 'mic' },
          { label: 'Upload File', variant: 'secondary', icon: 'upload' },
          { label: 'Record Now', variant: 'outlined', icon: 'fiber_manual_record' },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Recent Uploads',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['File Name', 'Type', 'Duration', 'Status', 'Uploaded', 'Actions'],
        rows: [],
      },
    },
    {
      type: 'kpi_grid',
      title: 'Upload Stats',
      order: 3,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
  ],

  // ── Analysis page ───────────────────────────────────────────────────────
  analysis: [
    {
      type: 'kpi_grid',
      title: 'Analysis Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'timeline',
      title: 'Recent Analyses',
      order: 2,
      gridSpan: 8,
      config: {
        events: [],
      },
    },
    {
      type: 'chart',
      title: 'Communication Score Trend',
      order: 3,
      gridSpan: 4,
      config: {
        type: 'line',
        data: [
          { label: 'Week 1', value: 55 },
          { label: 'Week 2', value: 62 },
          { label: 'Week 3', value: 58 },
          { label: 'Week 4', value: 72 },
          { label: 'Week 5', value: 78 },
        ],
      },
    },
    {
      type: 'card_grid',
      title: 'Latest Feedback',
      order: 4,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
  ],

  // ── Homework page ───────────────────────────────────────────────────────
  homework: [
    {
      type: 'progress_tracker',
      title: 'Current Assignments',
      order: 1,
      gridSpan: 12,
      config: {
        steps: [
          { label: 'I-Statements Practice', status: 'complete' },
          { label: 'Active Listening Exercise', status: 'active' },
          { label: 'Conflict De-escalation', status: 'pending' },
          { label: 'Weekly Appreciation Journal', status: 'pending' },
        ],
      },
    },
    {
      type: 'card_grid',
      title: "This Week's Homework",
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'data_table',
      title: 'Homework History',
      order: 3,
      gridSpan: 12,
      config: {
        columns: ['Assignment', 'Assigned', 'Due', 'Status', 'Score'],
        rows: [],
      },
    },
  ],

  // ── Subscriptions page ──────────────────────────────────────────────────
  subscriptions: [
    {
      type: 'kpi_grid',
      title: 'Subscription Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'card_grid',
      title: 'Available Plans',
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'data_table',
      title: 'Billing History',
      order: 3,
      gridSpan: 12,
      config: {
        columns: ['Date', 'Description', 'Amount', 'Status'],
        rows: [],
      },
    },
  ],

  // ── Patterns page ───────────────────────────────────────────────────────
  patterns: [
    {
      type: 'kpi_grid',
      title: 'Pattern Summary',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'chart',
      title: 'Communication Score Over Time',
      order: 2,
      gridSpan: 8,
      config: {
        type: 'line',
        data: [
          { label: 'Jan', value: 45 },
          { label: 'Feb', value: 52 },
          { label: 'Mar W1', value: 58 },
          { label: 'Mar W2', value: 62 },
          { label: 'Mar W3', value: 72 },
          { label: 'Mar W4', value: 78 },
        ],
      },
    },
    {
      type: 'metric_bar',
      title: 'Communication Areas',
      order: 3,
      gridSpan: 4,
      config: {
        metrics: [
          { label: 'Active Listening', value: 82, maxValue: 100, color: '#4caf50' },
          { label: 'Emotional Regulation', value: 65, maxValue: 100, color: '#ff9800' },
          { label: 'Conflict Resolution', value: 58, maxValue: 100, color: '#f44336' },
          { label: 'Empathy Expression', value: 75, maxValue: 100, color: '#2196f3' },
        ],
      },
    },
    {
      type: 'timeline',
      title: 'Pattern Evolution',
      order: 4,
      gridSpan: 12,
      config: {
        events: [],
      },
    },
  ],

  // ── Safety page ─────────────────────────────────────────────────────────
  safety: [
    {
      type: 'card_grid',
      title: 'Crisis Resources',
      order: 1,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'kpi_grid',
      title: 'Safety Status',
      order: 2,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
  ],

  // ── Resources page ──────────────────────────────────────────────────────
  resources: [
    {
      type: 'card_grid',
      title: 'Recommended Resources',
      order: 1,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'data_table',
      title: 'Articles & Guides',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Title', 'Category', 'Read Time', 'Status'],
        rows: [],
      },
    },
  ],

  // ── Shared Profile page ─────────────────────────────────────────────────
  'shared-profile': [
    {
      type: 'kpi_grid',
      title: 'Couple Profile',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'split_panel',
      title: 'Individual Summaries',
      order: 2,
      gridSpan: 12,
      config: {
        leftTitle: 'Partner A - Summary',
        rightTitle: 'Partner B - Summary',
        ratio: '50/50',
      },
    },
    {
      type: 'chart',
      title: 'Joint Progress',
      order: 3,
      gridSpan: 8,
      config: {
        type: 'line',
        data: [
          { label: 'Week 1', value: 45 },
          { label: 'Week 2', value: 55 },
          { label: 'Week 3', value: 52 },
          { label: 'Week 4', value: 65 },
          { label: 'Week 5', value: 72 },
        ],
      },
    },
    {
      type: 'progress_tracker',
      title: 'Milestones',
      order: 4,
      gridSpan: 4,
      config: {
        steps: [
          { label: 'Profile Created', status: 'complete' },
          { label: 'First Upload', status: 'complete' },
          { label: 'First Analysis', status: 'complete' },
          { label: '5 Sessions', status: 'active' },
          { label: '10 Sessions', status: 'pending' },
        ],
      },
    },
  ],
  // ── Elder Care page ────────────────────────────────────────────────────
  'elder-care': [
    {
      type: 'kpi_grid',
      title: 'Resident Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: 'Resident Care Schedule',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Resident', 'Room', 'Medication Due', 'ADL Status', 'Last Check', 'Alert'],
        rows: [],
      },
    },
    {
      type: 'timeline',
      title: 'Recent Care Events',
      order: 3,
      gridSpan: 8,
      config: {
        events: [],
      },
    },
    {
      type: 'metric_bar',
      title: 'Wellness Metrics',
      order: 4,
      gridSpan: 4,
      config: {
        metrics: [
          { label: 'Mobility', value: 72, maxValue: 100, color: '#4caf50' },
          { label: 'Cognition', value: 65, maxValue: 100, color: '#ff9800' },
          { label: 'Nutrition', value: 85, maxValue: 100, color: '#2196f3' },
          { label: 'Social Activity', value: 58, maxValue: 100, color: '#9c27b0' },
        ],
      },
    },
  ],

  // ── Blood Bank page ───────────────────────────────────────────────────
  'blood-bank': [
    {
      type: 'kpi_grid',
      title: 'Inventory Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'chart',
      title: 'Blood Type Inventory',
      order: 2,
      gridSpan: 8,
      config: {
        type: 'bar',
        data: [
          { label: 'O+', value: 320 },
          { label: 'A+', value: 280 },
          { label: 'B+', value: 195 },
          { label: 'AB+', value: 85 },
          { label: 'O-', value: 120 },
          { label: 'A-', value: 98 },
          { label: 'B-', value: 82 },
          { label: 'AB-', value: 67 },
        ],
      },
    },
    {
      type: 'metric_bar',
      title: 'Stock Level by Type',
      order: 3,
      gridSpan: 4,
      config: {
        metrics: [
          { label: 'O-', value: 120, maxValue: 200, color: '#f44336' },
          { label: 'AB-', value: 67, maxValue: 150, color: '#ff9800' },
          { label: 'B-', value: 82, maxValue: 150, color: '#ff9800' },
          { label: 'O+', value: 320, maxValue: 350, color: '#4caf50' },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Recent Donations',
      order: 4,
      gridSpan: 12,
      config: {
        columns: ['Donor ID', 'Blood Type', 'Collection Date', 'Volume (ml)', 'Status', 'Expiry'],
        rows: [],
      },
    },
  ],

  // ── Donor Registry page ───────────────────────────────────────────────
  'donor-registry': [
    {
      type: 'kpi_grid',
      title: 'Registry Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: 'Waitlist Care Recipients',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Care Recipient ID', 'Organ Needed', 'Blood Type', 'Wait Time', 'Urgency', 'Status'],
        rows: [],
      },
    },
    {
      type: 'progress_tracker',
      title: 'Transplant Workflow',
      order: 3,
      gridSpan: 12,
      config: {
        steps: [
          { label: 'Donor Identified', status: 'complete' },
          { label: 'Compatibility Testing', status: 'complete' },
          { label: 'Consent & Ethics', status: 'active' },
          { label: 'Procurement', status: 'pending' },
          { label: 'Transplant Surgery', status: 'pending' },
          { label: 'Post-Op Monitoring', status: 'pending' },
        ],
      },
    },
  ],

  // ── Ambulance / EMS page ──────────────────────────────────────────────
  'ambulance-dispatch': [
    {
      type: 'kpi_grid',
      title: 'Dispatch Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: 'Active Dispatches',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Call ID', 'Priority', 'Location', 'Unit', 'Status', 'ETA'],
        rows: [],
      },
    },
    {
      type: 'chart',
      title: 'Response Times (Today)',
      order: 3,
      gridSpan: 6,
      config: {
        type: 'bar',
        data: [
          { label: '6AM', value: 6.5 },
          { label: '8AM', value: 8.1 },
          { label: '10AM', value: 7.2 },
          { label: '12PM', value: 9.4 },
          { label: '2PM', value: 8.8 },
          { label: '4PM', value: 7.6 },
        ],
      },
    },
    {
      type: 'metric_bar',
      title: 'Fleet Status',
      order: 4,
      gridSpan: 6,
      config: {
        metrics: [
          { label: 'Available', value: 7, maxValue: 12, color: '#4caf50' },
          { label: 'On Call', value: 4, maxValue: 12, color: '#2196f3' },
          { label: 'Maintenance', value: 1, maxValue: 12, color: '#f44336' },
        ],
      },
    },
  ],

  // ── Public Health Dashboard ───────────────────────────────────────────
  'public-health-dashboard': [
    {
      type: 'kpi_grid',
      title: 'Surveillance Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'chart',
      title: 'Case Trends (30 Days)',
      order: 2,
      gridSpan: 8,
      config: {
        type: 'line',
        data: [
          { label: 'Week 1', value: 280 },
          { label: 'Week 2', value: 342 },
          { label: 'Week 3', value: 298 },
          { label: 'Week 4', value: 314 },
        ],
      },
    },
    {
      type: 'chart',
      title: 'Cases by Disease',
      order: 3,
      gridSpan: 4,
      config: {
        type: 'donut',
        data: [
          { label: 'Influenza', value: 45 },
          { label: 'COVID-19', value: 28 },
          { label: 'RSV', value: 15 },
          { label: 'Other', value: 12 },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Vaccination Campaign Progress',
      order: 4,
      gridSpan: 12,
      config: {
        columns: ['Campaign', 'Target Pop.', 'Vaccinated', 'Coverage', 'Status'],
        rows: [],
      },
    },
  ],

  // ── Medical Education page ────────────────────────────────────────────
  'medical-education': [
    {
      type: 'kpi_grid',
      title: 'Learning Dashboard',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'progress_tracker',
      title: 'Current Training Track',
      order: 2,
      gridSpan: 12,
      config: {
        steps: [
          { label: 'Basic Life Support', status: 'complete' },
          { label: 'Advanced Cardiac', status: 'complete' },
          { label: 'Trauma Assessment', status: 'active' },
          { label: 'Pediatric Emergency', status: 'pending' },
          { label: 'Final Assessment', status: 'pending' },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Course Catalog',
      order: 3,
      gridSpan: 12,
      config: {
        columns: ['Course', 'Category', 'Duration', 'CME Credits', 'Enrolled', 'Status'],
        rows: [],
      },
    },
    {
      type: 'chart',
      title: 'Completion by Department',
      order: 4,
      gridSpan: 12,
      config: {
        type: 'bar',
        data: [
          { label: 'Nursing', value: 92 },
          { label: 'Physicians', value: 78 },
          { label: 'Pharmacy', value: 85 },
          { label: 'Lab', value: 88 },
          { label: 'Admin', value: 70 },
        ],
      },
    },
  ],

  // ── Health Analytics / BI page ────────────────────────────────────────
  'health-analytics': [
    {
      type: 'kpi_grid',
      title: 'Key Performance Indicators',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'chart',
      title: 'Revenue vs Cost Trend',
      order: 2,
      gridSpan: 8,
      config: {
        type: 'line',
        data: [
          { label: 'Jan', value: 2800 },
          { label: 'Feb', value: 3100 },
          { label: 'Mar', value: 2950 },
          { label: 'Apr', value: 3400 },
        ],
      },
    },
    {
      type: 'chart',
      title: 'Cases by Department',
      order: 3,
      gridSpan: 4,
      config: {
        type: 'donut',
        data: [
          { label: 'Emergency', value: 30 },
          { label: 'Surgery', value: 25 },
          { label: 'Internal Med', value: 22 },
          { label: 'Pediatrics', value: 13 },
          { label: 'OB/GYN', value: 10 },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Department Performance',
      order: 4,
      gridSpan: 12,
      config: {
        columns: ['Department', 'Care Recipients', 'Avg Wait', 'Satisfaction', 'Revenue', 'Trend'],
        rows: [],
      },
    },
  ],

  // ── Revenue Cycle Management page ─────────────────────────────────────
  'revenue-cycle': [
    {
      type: 'kpi_grid',
      title: 'Revenue Cycle Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'progress_tracker',
      title: 'Claim Lifecycle',
      order: 2,
      gridSpan: 12,
      config: {
        steps: [
          { label: 'Charge Capture', status: 'complete' },
          { label: 'Coding', status: 'complete' },
          { label: 'Claim Submission', status: 'active' },
          { label: 'Payer Processing', status: 'pending' },
          { label: 'Payment Posted', status: 'pending' },
          { label: 'Denial Mgmt', status: 'pending' },
        ],
      },
    },
    {
      type: 'chart',
      title: 'Collections Trend',
      order: 3,
      gridSpan: 8,
      config: {
        type: 'bar',
        data: [
          { label: 'Jan', value: 3800 },
          { label: 'Feb', value: 4100 },
          { label: 'Mar', value: 3950 },
          { label: 'Apr', value: 4200 },
        ],
      },
    },
    {
      type: 'metric_bar',
      title: 'AR Aging',
      order: 4,
      gridSpan: 4,
      config: {
        metrics: [
          { label: '0-30 days', value: 62, maxValue: 100, color: '#4caf50' },
          { label: '31-60 days', value: 22, maxValue: 100, color: '#ff9800' },
          { label: '61-90 days', value: 10, maxValue: 100, color: '#f44336' },
          { label: '90+ days', value: 6, maxValue: 100, color: '#d32f2f' },
        ],
      },
    },
  ],

  // ── Home Care Management page ─────────────────────────────────────────
  'home-care': [
    {
      type: 'kpi_grid',
      title: 'Home Care Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: "Today's Visit Schedule",
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Care Recipient', 'Caregiver', 'Visit Type', 'Time', 'Duration', 'Status'],
        rows: [],
      },
    },
    {
      type: 'timeline',
      title: 'Recent Visit Notes',
      order: 3,
      gridSpan: 8,
      config: {
        events: [],
      },
    },
    {
      type: 'metric_bar',
      title: 'Care Quality Metrics',
      order: 4,
      gridSpan: 4,
      config: {
        metrics: [
          { label: 'Visit Compliance', value: 98, maxValue: 100, color: '#4caf50' },
          { label: 'Care Recipient Satisfaction', value: 92, maxValue: 100, color: '#2196f3' },
          { label: 'Care Plan Adherence', value: 88, maxValue: 100, color: '#ff9800' },
          { label: 'Documentation', value: 95, maxValue: 100, color: '#4caf50' },
        ],
      },
    },
  ],
  // ── Test Catalog / Lab Booking page ────────────────────────────────────
  'test-catalog': [
    {
      type: 'action_toolbar',
      title: 'Book a Test',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Search Tests', variant: 'primary', icon: 'search' },
          { label: 'Popular Tests', variant: 'outlined', icon: 'trending_up' },
          { label: 'Health Packages', variant: 'secondary', icon: 'package' },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Available Tests',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Test Name', 'Category', 'Price', 'Report Time', 'Home Collection', 'Book'],
        rows: [],
      },
    },
    {
      type: 'kpi_grid',
      title: 'Your Lab History',
      order: 3,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
  ],

  // ── Doctor Directory / Marketplace page ───────────────────────────────
  'Caregiver-directory': [
    {
      type: 'action_toolbar',
      title: 'Find a Caregiver',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Search Caregivers', variant: 'primary', icon: 'search' },
          { label: 'By Specialty', variant: 'outlined', icon: 'filter' },
          { label: 'Near Me', variant: 'secondary', icon: 'location' },
        ],
      },
    },
    {
      type: 'card_grid',
      title: 'Top Rated Caregivers',
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'kpi_grid',
      title: 'Platform Stats',
      order: 3,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
  ],

  // ── Claims page (Insurance) ──────────────────────────────────────────
  claims: [
    {
      type: 'kpi_grid',
      title: 'Claims Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: 'Recent Claims',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Claim ID', 'Date', 'Home/Provider', 'Amount', 'Covered', 'Status'],
        rows: [],
      },
    },
    {
      type: 'action_toolbar',
      title: 'Actions',
      order: 3,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'File New Claim', variant: 'primary', icon: 'add' },
          { label: 'Upload Documents', variant: 'secondary', icon: 'upload' },
          { label: 'Track Claim', variant: 'outlined', icon: 'search' },
        ],
      },
    },
  ],

  // ── Policies page (Insurance) ─────────────────────────────────────────
  policies: [
    {
      type: 'kpi_grid',
      title: 'Policy Summary',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'card_grid',
      title: 'Your Policies',
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'metric_bar',
      title: 'Coverage Utilization',
      order: 3,
      gridSpan: 12,
      config: {
        metrics: [
          { label: 'Health Shield Gold', value: 15200, maxValue: 500000, color: '#4caf50' },
          { label: 'Critical Illness', value: 0, maxValue: 200000, color: '#2196f3' },
        ],
      },
    },
  ],

  // ── Prescription Upload page ──────────────────────────────────────────
  'prescription-upload': [
    {
      type: 'action_toolbar',
      title: 'Upload Prescription',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Upload Photo', variant: 'primary', icon: 'camera' },
          { label: 'Upload PDF', variant: 'secondary', icon: 'upload' },
          { label: 'Enter Manually', variant: 'outlined', icon: 'edit' },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Uploaded Prescriptions',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Prescription', 'Caregiver', 'Date', 'Medications', 'Status', 'Actions'],
        rows: [],
      },
    },
    {
      type: 'kpi_grid',
      title: 'Prescription Summary',
      order: 3,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
  ],

  // ── Drug Search page ───────────────────────────────────────────────────
  'drug-search': [
    {
      type: 'action_toolbar',
      title: 'Search Medications',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Search Drug Name', variant: 'primary', icon: 'search' },
          { label: 'Scan Prescription', variant: 'secondary', icon: 'camera' },
          { label: 'Browse by Category', variant: 'outlined', icon: 'category' },
        ],
      },
    },
    {
      type: 'card_grid',
      title: 'Your Medications',
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'kpi_grid',
      title: 'Savings Summary',
      order: 3,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
  ],

  // ── Price Comparison page ─────────────────────────────────────────────
  'price-comparison': [
    {
      type: 'kpi_grid',
      title: 'Price Comparison — Metformin 500mg',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: 'Pharmacy Prices (30-day supply)',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Pharmacy', 'Retail Price', 'With Insurance', 'With Coupon', 'Availability', 'Distance'],
        rows: [],
      },
    },
    {
      type: 'chart',
      title: 'Price History (6 months)',
      order: 3,
      gridSpan: 8,
      config: {
        type: 'line',
        data: [
          { label: 'Nov', value: 14.5 },
          { label: 'Dec', value: 13.99 },
          { label: 'Jan', value: 12.99 },
          { label: 'Feb', value: 12.99 },
          { label: 'Mar', value: 12.50 },
          { label: 'Apr', value: 12.99 },
        ],
      },
    },
    {
      type: 'card_grid',
      title: 'Savings Tips',
      order: 4,
      gridSpan: 4,
      config: {
        cards: [],
      },
    },
  ],

  // ── Coverage Check page ───────────────────────────────────────────────
  'coverage-check': [
    {
      type: 'kpi_grid',
      title: 'Insurance Coverage Summary',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: 'Medication Coverage Details',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Medication', 'Tier', 'Copay', 'Covered %', 'Prior Auth', 'Quantity Limit'],
        rows: [],
      },
    },
    {
      type: 'metric_bar',
      title: 'Annual Benefits Used',
      order: 3,
      gridSpan: 6,
      config: {
        metrics: [
          { label: 'Deductible', value: 1200, maxValue: 2000, color: '#ff9800' },
          { label: 'Out-of-Pocket Max', value: 3400, maxValue: 8000, color: '#4caf50' },
          { label: 'Rx Spending', value: 890, maxValue: 5000, color: '#2196f3' },
        ],
      },
    },
    {
      type: 'card_grid',
      title: 'Coverage Actions',
      order: 4,
      gridSpan: 6,
      config: {
        cards: [],
      },
    },
  ],

  // ── Pharmacy Finder page ──────────────────────────────────────────────
  'pharmacy-finder': [
    {
      type: 'action_toolbar',
      title: 'Find Pharmacies',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Search by Location', variant: 'primary', icon: 'location' },
          { label: 'Filter by Insurance', variant: 'outlined', icon: 'filter' },
          { label: 'Open Now Only', variant: 'secondary', icon: 'schedule' },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Nearby Pharmacies',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Pharmacy', 'Address', 'Distance', 'Hours', 'In-Network', 'Services'],
        rows: [],
      },
    },
    {
      type: 'kpi_grid',
      title: 'Your Pharmacy Profile',
      order: 3,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
  ],

  // ── Veterinary / Animal Health page ────────────────────────────────────
  'veterinary': [
    {
      type: 'kpi_grid',
      title: 'Home Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: 'Care Recipient Schedule',
      order: 2,
      gridSpan: 12,
      config: {
        columns: ['Pet Name', 'Species', 'Breed', 'Owner', 'Visit Type', 'Time', 'Vet'],
        rows: [],
      },
    },
    {
      type: 'timeline',
      title: 'Recent Activity',
      order: 3,
      gridSpan: 8,
      config: {
        events: [],
      },
    },
    {
      type: 'metric_bar',
      title: 'Department Status',
      order: 4,
      gridSpan: 4,
      config: {
        metrics: [
          { label: 'Exam Rooms', value: 4, maxValue: 6, color: '#4caf50' },
          { label: 'Surgery Suite', value: 1, maxValue: 2, color: '#2196f3' },
          { label: 'Boarding', value: 18, maxValue: 25, color: '#ff9800' },
          { label: 'ICU Cages', value: 2, maxValue: 4, color: '#f44336' },
        ],
      },
    },
  ],

  // ══════════════════════════════════════════════════════════════════════
  // Core app pages — used instead of static preview transforms
  // ══════════════════════════════════════════════════════════════════════

  // ── Home page ─────────────────────────────────────────────────────────
  home: [
    {
      type: 'kpi_grid',
      title: 'Overview',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'chart',
      title: 'Weekly Activity',
      order: 2,
      gridSpan: 8,
      config: {
        type: 'bar',
        data: [
          { label: 'Mon', value: 18 }, { label: 'Tue', value: 24 }, { label: 'Wed', value: 22 },
          { label: 'Thu', value: 28 }, { label: 'Fri', value: 26 }, { label: 'Sat', value: 12 },
        ],
      },
    },
    {
      type: 'timeline',
      title: 'Recent Activity',
      order: 3,
      gridSpan: 4,
      config: {
        events: [],
      },
    },
    {
      type: 'card_grid',
      title: 'Quick Actions',
      order: 4,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
  ],

  // ── Dashboard page ────────────────────────────────────────────────────
  dashboard: [
    {
      type: 'kpi_grid',
      title: 'Dashboard',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'chart',
      title: 'Trends',
      order: 2,
      gridSpan: 8,
      config: {
        type: 'line',
        data: [
          { label: 'Jan', value: 65 }, { label: 'Feb', value: 72 }, { label: 'Mar', value: 68 },
          { label: 'Apr', value: 85 }, { label: 'May', value: 92 }, { label: 'Jun', value: 88 },
        ],
      },
    },
    {
      type: 'chart',
      title: 'Distribution',
      order: 3,
      gridSpan: 4,
      config: {
        type: 'donut',
        data: [
          { label: 'Category A', value: 40 },
          { label: 'Category B', value: 30 },
          { label: 'Category C', value: 20 },
          { label: 'Other', value: 10 },
        ],
      },
    },
    {
      type: 'data_table',
      title: 'Recent Records',
      order: 4,
      gridSpan: 12,
      config: {
        columns: ['ID', 'Name', 'Type', 'Date', 'Status', 'Actions'],
        rows: [],
      },
    },
  ],

  // ── Profile page ──────────────────────────────────────────────────────
  profile: [
    {
      type: 'kpi_grid',
      title: 'Your Profile',
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'card_grid',
      title: 'Personal Information',
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'card_grid',
      title: 'Preferences',
      order: 3,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
  ],

  // ── Settings page ─────────────────────────────────────────────────────
  settings: [
    {
      type: 'card_grid',
      title: 'Account Settings',
      order: 1,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'card_grid',
      title: 'App Settings',
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'card_grid',
      title: 'Privacy & Security',
      order: 3,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
  ],

  // ── Notifications page ────────────────────────────────────────────────
  notifications: [
    {
      type: 'action_toolbar',
      title: 'Notifications',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Mark All Read', variant: 'primary', icon: 'check' },
          { label: 'Filter', variant: 'outlined', icon: 'filter' },
          { label: 'Clear All', variant: 'secondary', icon: 'delete' },
        ],
      },
    },
    {
      type: 'timeline',
      title: 'Recent Notifications',
      order: 2,
      gridSpan: 12,
      config: {
        events: [],
      },
    },
  ],

  // ── Help page ─────────────────────────────────────────────────────────
  help: [
    {
      type: 'action_toolbar',
      title: 'Help & Support',
      order: 1,
      gridSpan: 12,
      config: {
        actions: [
          { label: 'Search Help Articles', variant: 'primary', icon: 'search' },
          { label: 'Contact Support', variant: 'outlined', icon: 'message' },
          { label: 'FAQs', variant: 'secondary', icon: 'help' },
        ],
      },
    },
    {
      type: 'card_grid',
      title: 'Frequently Asked Questions',
      order: 2,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
    {
      type: 'card_grid',
      title: 'Resources',
      order: 3,
      gridSpan: 12,
      config: {
        cards: [],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// FEATURE_PAGE_MAP — feature key → page IDs it activates
// ---------------------------------------------------------------------------

export const FEATURE_PAGE_MAP: Record<string, string[]> = {
  file_upload: ['uploads'],
  audio_upload: ['uploads'],
  ai_content_analysis: ['analysis'],
  speech_to_text: ['analysis'],
  conversation_summary: ['analysis'],
  subscription_billing: ['subscriptions'],
  homework_tasks: ['homework'],
  pattern_tracking: ['patterns'],
  safety_detection: ['safety'],
  resource_library: ['resources'],
  shared_profile: ['shared-profile'],
  messaging: ['telemedicine'],
  // New healthcare domain features
  adl_assessment: ['elder-care'],
  fall_risk_assessment: ['elder-care'],
  blood_bank: ['blood-bank'],
  transfusion_management: ['blood-bank'],
  disease_surveillance: ['public-health-dashboard'],
  population_health: ['public-health-dashboard'],
  immunization_tracking: ['public-health-dashboard'],
  home_visit_scheduling: ['home-care'],
  hospice_palliative: ['home-care'],
  medical_coding: ['revenue-cycle'],
  claims_processing: ['revenue-cycle'],
  eligibility_verification: ['revenue-cycle'],
  prior_authorization: ['revenue-cycle'],
  data_analytics: ['health-analytics'],
  quality_measures: ['health-analytics'],
  patient_education: ['medical-education'],
  health_literacy: ['medical-education'],
  clinical_trials: ['donor-registry'],
  research_protocols: ['donor-registry'],
  emergency_triage: ['ambulance-dispatch', 'emergency'],
  veterinary_practice: ['veterinary'],
  // Prescription comparison domain
  prescription_comparison: ['drug-search', 'price-comparison'],
  drug_database_search: ['drug-search'],
  pharmacy_finder: ['pharmacy-finder'],
  cost_calculator: ['price-comparison'],
  insurance_coverage_check: ['coverage-check'],
  // Core page mappings — ensures static pages find their specs
  prescription_management: ['prescriptions'],
  medication_tracking: ['prescriptions'],
  appointment_scheduling: ['Bookings'],
  patient_management: ['Care Recipients'],
  ehr: ['ehr'],
  lab_integration: ['lab_results'],
  billing: ['billing'],
  // emergency_triage already mapped to ambulance-dispatch above
  surgical_scheduling: ['surgical'],
  medical_imaging: ['radiology'],
  pharmacy_inventory: ['pharmacy'],
  icu_management: ['icu'],
  health_monitoring: ['monitoring'],
  telemedicine: ['telemedicine'],
  analytics: ['analytics'],
  reporting: ['analytics'],
  staff_scheduling: ['operations'],
  rehab_plans: ['rehab'],
  dental_charting: ['dental'],
  prenatal_tracking: ['maternity'],
  chemotherapy_management: ['oncology'],
  activity_tracking: ['activity'],
  sleep_tracking: ['sleep'],
  nutrition_tracking: ['nutrition'],
  mood_tracking: ['mood'],
  health_goals: ['goals'],
  supply_chain: ['inventory'],
};

// ---------------------------------------------------------------------------
// generatePageSpecs — resolves features → page specs
// ---------------------------------------------------------------------------

/**
 * Given a list of selected feature keys, returns the set of PageSpec objects
 * whose pages are activated by those features (via FEATURE_PAGE_MAP).
 */
export function generatePageSpecs(features: string[]): PageSpec[] {
  const pageIds = new Set<string>();

  // Map features to their pages
  for (const feat of features) {
    const pages = FEATURE_PAGE_MAP[feat];
    if (pages) {
      for (const pid of pages) {
        pageIds.add(pid);
      }
    }
  }

  // Also include ALL pages that have section rules — ensures any nav page
  // that has a dynamic spec can render even if the feature mapping is incomplete
  for (const pid of Object.keys(PAGE_SECTION_RULES)) {
    pageIds.add(pid);
  }

  const specs: PageSpec[] = [];
  pageIds.forEach((pid) => {
    const sections = PAGE_SECTION_RULES[pid];
    if (sections) {
      specs.push({ pageId: pid, sections });
    } else {
      // Auto-generate a standard page spec for pages without dedicated rules
      specs.push({ pageId: pid, sections: generateFallbackSections(pid) });
    }
  });

  return specs;
}

/** Auto-generate sections for any page without dedicated PAGE_SECTION_RULES */
function generateFallbackSections(pageId: string): SectionSpec[] {
  const label = pageId.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Healthcare-aware column/data generation based on page name
  const pageColumns: Record<string, string[]> = {
    patients: ['ID', 'Care Recipient Name', 'DOB', 'Gender', 'Phone', 'Status', 'Actions'],
    appointments: ['ID', 'Care Recipient', 'Provider', 'Date', 'Time', 'Type', 'Status', 'Actions'],
    prescriptions: ['ID', 'Medication', 'Dosage', 'Frequency', 'Prescriber', 'Status', 'Actions'],
    billing: ['Invoice', 'Care Recipient', 'Amount', 'Date', 'Insurance', 'Status', 'Actions'],
    ehr: ['Record ID', 'Care Recipient', 'Type', 'Provider', 'Date', 'Status', 'Actions'],
    lab_results: ['Test ID', 'Test Name', 'Care Recipient', 'Result', 'Date', 'Status', 'Actions'],
    emergency: ['Case ID', 'Care Recipient', 'Chief Complaint', 'Triage', 'Arrival', 'Status', 'Actions'],
    radiology: ['Study ID', 'Care Recipient', 'Study Type', 'Body Part', 'Date', 'Status', 'Actions'],
    surgical: ['Case ID', 'Care Recipient', 'Procedure', 'Surgeon', 'Date', 'Status', 'Actions'],
    pharmacy: ['Rx ID', 'Medication', 'Care Recipient', 'Quantity', 'Filled', 'Status', 'Actions'],
    monitoring: ['Device', 'Care Recipient', 'Metric', 'Value', 'Time', 'Status', 'Actions'],
    telemedicine: ['Session ID', 'Care Recipient', 'Provider', 'Date', 'Duration', 'Status', 'Actions'],
    analytics: ['Report', 'Category', 'Period', 'Value', 'Trend', 'Actions'],
    products: ['SKU', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'],
    orders: ['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Actions'],
    cart: ['Item', 'Quantity', 'Price', 'Subtotal', 'Actions'],
  };

  const columns = pageColumns[pageId] || ['ID', 'Name', 'Category', 'Date', 'Status', 'Actions'];

  // Generate sample rows
  const sampleRows: string[][] = [];
  for (let i = 0; i < 5; i++) {
    sampleRows.push(columns.map((col, ci) => {
      const c = col.toLowerCase();
      if (c === 'id' || c.includes('id')) return `#${1001 + i}`;
      if (c === 'actions') return 'View';
      if (c === 'status') return ['Active', 'Pending', 'Completed', 'Active', 'Completed'][i];
      if (c === 'date' || c === 'time' || c.includes('date')) return `Apr ${4 - i}, 2026`;
      if (c.includes('name') || c.includes('Care Recipient') || c.includes('customer')) return `${label} Record ${i + 1}`;
      if (c.includes('price') || c.includes('amount') || c.includes('total') || c.includes('value')) return `$${(50 + i * 25).toFixed(2)}`;
      if (c.includes('type') || c.includes('category')) return `Type ${String.fromCharCode(65 + i)}`;
      return `${col} ${i + 1}`;
    }));
  }

  return [
    {
      type: 'kpi_grid',
      title: `${label} Overview`,
      order: 1,
      gridSpan: 12,
      config: {
        items: [],
      },
    },
    {
      type: 'data_table',
      title: `${label} Records`,
      order: 2,
      gridSpan: 12,
      config: { columns, rows: sampleRows },
    },
  ];
}
