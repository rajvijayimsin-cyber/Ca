/**
 * Auto-generates PageSpec for novel features based on their description.
 * Uses keyword matching to select appropriate section types (composable blocks).
 * No LLM call needed — works instantly for any feature.
 */

import { PageSpec, SectionSpec, SectionConfig } from '../types/sections';

interface FeatureInfo {
  key: string;
  description?: string;
  isKnown?: boolean;
}

/** Format feature key to human-readable label */
function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Select section types based on feature description keywords */
function selectSections(key: string, description: string): SectionSpec[] {
  const d = (description + ' ' + key).toLowerCase();
  const sections: SectionSpec[] = [];
  let order = 0;

  // Search/find features → search form + results
  if (d.match(/search|find|look.?up|query|discover|browse/)) {
    sections.push({
      type: 'action_toolbar',
      title: 'Search',
      order: order++,
      gridSpan: 12,
      config: {
        actions: [
          { label: `Search ${formatLabel(key.replace(/_engine|_check|_management|_tracking|_input/g, ''))}`, variant: 'primary', icon: 'search' },
          { label: 'Filter Results', variant: 'outlined', icon: 'filter' },
          { label: 'Reset', variant: 'secondary' },
        ],
      },
    });
  }

  // Comparison/pricing features → comparison grid or table
  if (d.match(/compar|price|cost|rank|option|vs|side.by.side|rate/)) {
    sections.push({
      type: 'data_table',
      title: `${formatLabel(key)} Results`,
      order: order++,
      gridSpan: 12,
      config: {
        columns: deriveColumns(d, 'comparison'),
        rows: generateSampleRows(deriveColumns(d, 'comparison'), 5),
      },
    });
  }

  // Form/input features → input form
  if (d.match(/input|enter|submit|register|upload|fill|form|capture|add|create/)) {
    sections.push({
      type: 'card_grid',
      title: `${formatLabel(key)} Form`,
      order: order++,
      gridSpan: 12,
      config: {
        cards: deriveFormFields(d).map((field) => ({
          title: field,
          description: `Enter ${field.toLowerCase()}`,
          icon: 'edit',
          action: 'Input',
        })),
      },
    });
  }

  // List/manage/track features → data table
  if (d.match(/list|manage|track|monitor|history|record|log|inventory|catalog/)) {
    sections.push({
      type: 'data_table',
      title: formatLabel(key),
      order: order++,
      gridSpan: 12,
      config: {
        columns: deriveColumns(d, 'list'),
        rows: generateSampleRows(deriveColumns(d, 'list'), 5),
      },
    });
  }

  // Status/flow/process features → timeline
  if (d.match(/status|flow|process|step|stage|progress|pipeline|journey|sequence/)) {
    sections.push({
      type: 'progress_tracker',
      title: `${formatLabel(key)} Progress`,
      order: order++,
      gridSpan: 12,
      config: {
        steps: deriveSteps(d),
      },
    });
  }

  // Alert/notification features → timeline events
  if (d.match(/alert|notif|remind|warn|trigger|flag|watch/)) {
    sections.push({
      type: 'timeline',
      title: `${formatLabel(key)} Alerts`,
      order: order++,
      gridSpan: 12,
      config: {
        events: [
          { date: 'Just now', title: 'New alert triggered', description: 'A condition was met', status: 'warning' as const },
          { date: '2 hours ago', title: 'Alert resolved', description: 'Condition returned to normal', status: 'complete' as const },
          { date: 'Yesterday', title: 'System notification', description: 'Routine check completed', status: 'info' as const },
        ],
      },
    });
  }

  // Analytics/report/dashboard features → chart + KPIs
  if (d.match(/analytic|report|dashboard|metric|stat|insight|aggregat|summar|overview/)) {
    sections.push({
      type: 'chart',
      title: `${formatLabel(key)} Trends`,
      order: order++,
      gridSpan: 8,
      config: {
        type: 'bar' as const,
        data: [
          { label: 'Mon', value: 45 },
          { label: 'Tue', value: 62 },
          { label: 'Wed', value: 38 },
          { label: 'Thu', value: 71 },
          { label: 'Fri', value: 55 },
        ],
      },
    });
    sections.push({
      type: 'chart',
      title: 'Distribution',
      order: order++,
      gridSpan: 4,
      config: {
        type: 'donut' as const,
        data: [
          { label: 'Category A', value: 40 },
          { label: 'Category B', value: 30 },
          { label: 'Category C', value: 20 },
          { label: 'Other', value: 10 },
        ],
      },
    });
  }

  // Scheduling/booking features → timeline + action toolbar
  if (d.match(/schedul|book|appoint|reserv|slot|calendar|availab/)) {
    if (!sections.some(s => s.type === 'action_toolbar')) {
      sections.push({
        type: 'action_toolbar',
        title: 'Schedule',
        order: order++,
        gridSpan: 12,
        config: {
          actions: [
            { label: `New ${formatLabel(key.replace(/_management|_scheduling|_booking/g, ''))}`, variant: 'primary', icon: 'add' },
            { label: 'View Calendar', variant: 'outlined', icon: 'calendar' },
            { label: 'My Bookings', variant: 'secondary', icon: 'list' },
          ],
        },
      });
    }
    sections.push({
      type: 'timeline',
      title: 'Upcoming',
      order: order++,
      gridSpan: 12,
      config: {
        events: [
          { date: 'Today 2:00 PM', title: 'Upcoming Booking', description: 'Scheduled session with provider.', status: 'info' as const },
          { date: 'Tomorrow 10:00 AM', title: 'Follow-up visit', description: 'Review results and next steps.', status: 'info' as const },
          { date: 'Apr 15', title: 'Annual checkup', description: 'Routine health assessment.', status: 'info' as const },
        ],
      },
    });
  }

  // Communication/messaging features → timeline + actions
  if (d.match(/messag|chat|communicat|send|inbox|notif|email|sms|alert/)) {
    sections.push({
      type: 'timeline',
      title: 'Recent Messages',
      order: order++,
      gridSpan: 12,
      config: {
        events: [
          { date: 'Just now', title: 'New message received', description: 'You have a new message from the care team.', status: 'info' as const },
          { date: '1 hour ago', title: 'Message sent', description: 'Your inquiry was delivered successfully.', status: 'complete' as const },
          { date: 'Yesterday', title: 'Automated reminder', description: 'Booking reminder sent to Care Recipient.', status: 'complete' as const },
        ],
      },
    });
  }

  // Inventory/stock/catalog features → metric bars + table
  if (d.match(/inventor|stock|suppli|warehous|catalog|product|item|quantity/)) {
    sections.push({
      type: 'metric_bar',
      title: 'Stock Levels',
      order: order++,
      gridSpan: 4,
      config: {
        metrics: [
          { label: 'In Stock', value: 85, maxValue: 100, color: '#4caf50' },
          { label: 'Low Stock', value: 12, maxValue: 100, color: '#ff9800' },
          { label: 'Out of Stock', value: 3, maxValue: 100, color: '#f44336' },
        ],
      },
    });
  }

  // Workflow/process/approval features → progress tracker
  if (d.match(/workflow|approval|review|pipeline|queue|stage|phase/) && !sections.some(s => s.type === 'progress_tracker')) {
    sections.push({
      type: 'progress_tracker',
      title: `${formatLabel(key)} Workflow`,
      order: order++,
      gridSpan: 12,
      config: {
        steps: deriveSteps(d),
      },
    });
  }

  // Map/location features → map view
  if (d.match(/map|location|gps|geograph|route|track.*location|pin|marker|zone|area/)) {
    sections.push({
      type: 'map_view' as any,
      title: `${formatLabel(key)} Map`,
      order: order++,
      gridSpan: 12,
      config: {},
    });
  }

  // Calendar/scheduling features → calendar view
  if (d.match(/calendar|week.*view|month.*view|day.*view|planner/) && !sections.some(s => (s.type as any) === 'calendar_view')) {
    sections.push({
      type: 'calendar_view' as any,
      title: `${formatLabel(key)} Calendar`,
      order: order++,
      gridSpan: 12,
      config: {},
    });
  }

  // Board/pipeline features → kanban
  if (d.match(/board|kanban|column|pipeline|drag|stage.*view|task.*board/)) {
    sections.push({
      type: 'kanban_board' as any,
      title: `${formatLabel(key)} Board`,
      order: order++,
      gridSpan: 12,
      config: {},
    });
  }

  // Photo/image/scan features → gallery
  if (d.match(/photo|image|gallery|scan|picture|thumbnail|x.ray|radiograph|ultrasound/)) {
    sections.push({
      type: 'gallery' as any,
      title: `${formatLabel(key)} Gallery`,
      order: order++,
      gridSpan: 12,
      config: {},
    });
  }

  // Chat/conversation features → chat view
  if (d.match(/chat|conversation|ai.*assist|ask|question|explain|interpret|bot/)) {
    sections.push({
      type: 'chat_view' as any,
      title: `${formatLabel(key)}`,
      order: order++,
      gridSpan: 12,
      config: {},
    });
  }

  // Always add a KPI summary at the top if we have other sections
  if (sections.length > 0) {
    sections.unshift({
      type: 'kpi_grid',
      title: 'Overview',
      order: -1,
      gridSpan: 12,
      config: {
        items: deriveKPIs(key, d),
      },
    });
  }

  // Fallback: if no sections matched, create a basic page
  if (sections.length === 0) {
    sections.push(
      {
        type: 'kpi_grid',
        title: 'Overview',
        order: 0,
        gridSpan: 12,
        config: { items: deriveKPIs(key, d) },
      },
      {
        type: 'data_table',
        title: formatLabel(key),
        order: 1,
        gridSpan: 12,
        config: {
          columns: ['ID', 'Name', 'Status', 'Date', 'Actions'],
          rows: generateSampleRows(['ID', 'Name', 'Status', 'Date', 'Actions'], 5),
        },
      },
      {
        type: 'action_toolbar',
        title: 'Actions',
        order: 2,
        gridSpan: 12,
        config: {
          actions: [
            { label: `Add New`, variant: 'primary' as const },
            { label: 'Export', variant: 'outlined' as const },
          ],
        },
      }
    );
  }

  // Re-order
  return sections.map((s, i) => ({ ...s, order: i }));
}

/** Derive table columns from description */
function deriveColumns(description: string, type: 'comparison' | 'list'): string[] {
  if (type === 'comparison') {
    const cols = ['Name'];
    if (description.match(/price|cost/)) cols.push('Price');
    if (description.match(/provider|pharmacy|vendor|source/)) cols.push('Provider');
    if (description.match(/insurance|coverage|copay/)) cols.push('Coverage');
    if (description.match(/avail|stock|delivery/)) cols.push('Availability');
    if (description.match(/rating|review|score/)) cols.push('Rating');
    if (description.match(/discount|saving|coupon/)) cols.push('Savings');
    if (cols.length < 4) cols.push('Status', 'Actions');
    return cols;
  }
  // List type — healthcare-aware columns
  const cols = ['ID'];
  if (description.match(/patient|resident|donor|pet/)) cols.push('Care Recipient');
  else if (description.match(/medic|drug|prescri/)) cols.push('Medication');
  else cols.push('Name');
  if (description.match(/date|time|schedule|when/)) cols.push('Date');
  if (description.match(/provider|doctor|nurse|vet/)) cols.push('Provider');
  if (description.match(/status|state|result/)) cols.push('Status');
  if (description.match(/type|category|tier/)) cols.push('Type');
  if (description.match(/amount|price|cost|fee/)) cols.push('Amount');
  if (description.match(/location|room|ward|address/)) cols.push('Location');
  if (description.match(/score|value|level|reading/)) cols.push('Value');
  // Ensure at least 5 columns
  if (cols.length < 4) cols.push('Status');
  if (cols.length < 5) cols.push('Date');
  cols.push('Actions');
  return cols;
}

/** Derive form fields from description */
function deriveFormFields(description: string): string[] {
  const fields: string[] = [];
  if (description.match(/name/)) fields.push('Name');
  if (description.match(/email/)) fields.push('Email');
  if (description.match(/drug|medication|medicine/)) fields.push('Medication Name');
  if (description.match(/dosage|dose/)) fields.push('Dosage');
  if (description.match(/quantity|amount/)) fields.push('Quantity');
  if (description.match(/insurance|plan|coverage/)) fields.push('Insurance Plan');
  if (description.match(/blood|type/)) fields.push('Type');
  if (description.match(/location|address|zip/)) fields.push('Location');
  if (description.match(/date|schedule|time/)) fields.push('Date');
  if (description.match(/note|comment|description/)) fields.push('Notes');
  if (description.match(/upload|file|photo|image/)) fields.push('Upload File');
  if (fields.length === 0) fields.push('Name', 'Description', 'Status');
  return fields.slice(0, 6); // Max 6 fields
}

/** Derive KPI items from feature */
function deriveKPIs(key: string, description: string): Array<{ label: string; value: string; trend?: string }> {
  const label = formatLabel(key.replace(/_engine|_check|_management|_tracking|_input|_manager/g, ''));
  const kpis: Array<{ label: string; value: string; trend?: string }> = [];
  const d = description.toLowerCase();

  // Domain-specific KPIs based on description keywords
  if (d.match(/patient|resident|donor|pet|member/)) {
    kpis.push({ label: 'Total Records', value: '1,247', trend: '+12' });
    kpis.push({ label: 'Active', value: '892' });
  } else if (d.match(/price|cost|saving|compar/)) {
    kpis.push({ label: 'Items Compared', value: '342', trend: '+18%' });
    kpis.push({ label: 'Avg. Savings', value: '$47.50', trend: '+12%' });
  } else if (d.match(/schedul|book|appoint/)) {
    kpis.push({ label: 'Scheduled', value: '24', trend: '+3' });
    kpis.push({ label: 'Completed Today', value: '12' });
  } else if (d.match(/monitor|vital|track/)) {
    kpis.push({ label: 'Readings Today', value: '156', trend: '+8' });
    kpis.push({ label: 'Normal Range', value: '94%', trend: '+2%' });
  } else if (d.match(/inventor|stock|supply/)) {
    kpis.push({ label: 'Total Items', value: '2,450' });
    kpis.push({ label: 'Low Stock', value: '12', trend: '-3' });
  } else if (d.match(/alert|notif|campaign/)) {
    kpis.push({ label: 'Active Alerts', value: '5' });
    kpis.push({ label: 'Resolved Today', value: '18', trend: '+4' });
  } else if (d.match(/report|analytic|dashboard/)) {
    kpis.push({ label: 'Reports Generated', value: '89', trend: '+15%' });
    kpis.push({ label: 'Avg. Score', value: '87%', trend: '+3%' });
  } else if (d.match(/imag|scan|xray|mri/)) {
    kpis.push({ label: 'Studies', value: '456', trend: '+22' });
    kpis.push({ label: 'Pending Read', value: '8' });
  } else {
    kpis.push({ label: `Total ${label}`, value: '1,247', trend: '+12%' });
    kpis.push({ label: 'Active', value: '38' });
  }

  // Add contextual KPIs
  if (d.match(/pending|wait|queue/)) kpis.push({ label: 'Pending', value: '15' });
  if (d.match(/complete|done|success/) && kpis.length < 4) kpis.push({ label: 'Completed', value: '892', trend: '+5%' });
  if (d.match(/alert|warn|critical/) && kpis.length < 4) kpis.push({ label: 'Alerts', value: '3' });
  if (d.match(/save|saving|discount/) && kpis.length < 4) kpis.push({ label: 'Total Savings', value: '$4,280', trend: '+8%' });

  // Fill to 4 KPIs with context-aware fillers
  const fillers = d.match(/price|cost|pharma/)
    ? [{ label: 'Providers', value: '34' }, { label: 'Best Deal', value: '$4.50' }]
    : d.match(/patient|clinical/)
    ? [{ label: 'This Week', value: '156', trend: '+7%' }, { label: 'Satisfaction', value: '4.5/5' }]
    : [{ label: 'This Month', value: '156', trend: '+7%' }, { label: 'Success Rate', value: '94%', trend: '+2%' }];

  while (kpis.length < 4) {
    kpis.push(fillers[kpis.length - 2] || { label: 'Avg. Time', value: '2.3 min' });
  }

  return kpis.slice(0, 4);
}

/** Derive progress steps from description */
function deriveSteps(description: string): Array<{ label: string; status: 'complete' | 'active' | 'pending' }> {
  const steps: Array<{ label: string; status: 'complete' | 'active' | 'pending' }> = [];

  if (description.match(/submit|request|initiate/)) steps.push({ label: 'Submitted', status: 'complete' });
  if (description.match(/review|verify|check|valid/)) steps.push({ label: 'Under Review', status: 'complete' });
  if (description.match(/approv|confirm|accept/)) steps.push({ label: 'Approved', status: 'active' });
  if (description.match(/process|execut|run/)) steps.push({ label: 'Processing', status: 'pending' });
  if (description.match(/complete|done|deliver|finish/)) steps.push({ label: 'Completed', status: 'pending' });

  if (steps.length < 3) {
    return [
      { label: 'Started', status: 'complete' },
      { label: 'In Progress', status: 'active' },
      { label: 'Review', status: 'pending' },
      { label: 'Complete', status: 'pending' },
    ];
  }

  return steps;
}

/** Generate sample table rows */
function generateSampleRows(columns: string[], count: number): string[][] {
  const rows: string[][] = [];
  const sampleData: Record<string, string[]> = {
    'ID': ['#1001', '#1002', '#1003', '#1004', '#1005'],
    'Name': ['Metformin 500mg', 'Lisinopril 10mg', 'Atorvastatin 20mg', 'Omeprazole 20mg', 'Amlodipine 5mg'],
    'Price': ['$12.99', '$8.50', '$15.30', '$22.00', '$6.75'],
    'Provider': ['CVS Pharmacy', 'Walgreens', 'Amazon Pharmacy', 'CostPlus', 'Walmart'],
    'Coverage': ['80% covered', '90% covered', 'Not covered', '70% covered', 'Fully covered'],
    'Availability': ['In Stock', 'In Stock', '2-day delivery', '3-5 days', 'In Stock'],
    'Rating': ['4.5★', '4.2★', '4.8★', '4.0★', '4.6★'],
    'Savings': ['$37.01', '$12.50', '$28.70', '$8.00', '$45.25'],
    'Status': ['Active', 'Pending', 'Completed', 'Active', 'Expired'],
    'Date': ['Apr 3, 2026', 'Apr 2, 2026', 'Apr 1, 2026', 'Mar 31, 2026', 'Mar 30, 2026'],
    'Type': ['Prescription', 'OTC', 'Generic', 'Brand', 'Prescription'],
    'Amount': ['$45.99', '$120.00', '$8.50', '$350.00', '$22.75'],
    'Actions': ['View', 'Edit', 'View', 'View', 'Edit'],
  };

  for (let i = 0; i < count; i++) {
    rows.push(columns.map((col) => (sampleData[col] || sampleData['Name'] || ['—'])[i % 5]));
  }
  return rows;
}

// ── Workflow page generation ─────────────────────────────────────────

interface WorkflowInfo {
  key: string;
  description?: string;
  steps?: string[];
}

/** Generate a PageSpec for a novel workflow */
function generateWorkflowPage(workflow: WorkflowInfo): PageSpec {
  const label = formatLabel(workflow.key.replace(/_flow$/g, ''));
  const sections: SectionSpec[] = [];

  // Progress tracker showing workflow steps
  if (workflow.steps && workflow.steps.length > 0) {
    sections.push({
      type: 'progress_tracker',
      title: `${label} Steps`,
      order: 0,
      gridSpan: 12,
      config: {
        steps: workflow.steps.map((step, i) => ({
          label: step.length > 50 ? step.substring(0, 50) + '...' : step,
          status: i === 0 ? 'complete' as const : i === 1 ? 'active' as const : 'pending' as const,
        })),
      },
    });
  } else {
    sections.push({
      type: 'progress_tracker',
      title: `${label} Steps`,
      order: 0,
      gridSpan: 12,
      config: {
        steps: [
          { label: 'Initiated', status: 'complete' as const },
          { label: 'Processing', status: 'active' as const },
          { label: 'Review', status: 'pending' as const },
          { label: 'Complete', status: 'pending' as const },
        ],
      },
    });
  }

  // Timeline showing recent activity for this workflow
  sections.push({
    type: 'timeline',
    title: 'Recent Activity',
    order: 1,
    gridSpan: 12,
    config: {
      events: [
        { date: 'Just now', title: `${label} started`, description: 'New workflow instance initiated', status: 'info' as const },
        { date: '1 hour ago', title: 'Step completed', description: 'Previous step finished successfully', status: 'complete' as const },
        { date: 'Yesterday', title: `${label} completed`, description: 'Full workflow completed', status: 'complete' as const },
      ],
    },
  });

  // KPIs for workflow
  sections.push({
    type: 'kpi_grid',
    title: 'Workflow Metrics',
    order: 2,
    gridSpan: 12,
    config: {
      items: [
        { label: 'Active', value: '12', trend: '+3' },
        { label: 'Completed Today', value: '45' },
        { label: 'Avg Duration', value: '4.2 min' },
        { label: 'Success Rate', value: '96%', trend: '+2%' },
      ],
    },
  });

  // Action toolbar
  sections.push({
    type: 'action_toolbar',
    title: 'Actions',
    order: 3,
    gridSpan: 12,
    config: {
      actions: [
        { label: `Start ${label}`, variant: 'primary' as const, icon: 'play' },
        { label: 'View History', variant: 'outlined' as const, icon: 'history' },
        { label: 'Configure', variant: 'secondary' as const, icon: 'settings' },
      ],
    },
  });

  return {
    pageId: `wf_${workflow.key}`,
    sections,
  };
}

/** Generate nav items for novel workflows */
export function generateNovelWorkflowNavItems(
  workflows: WorkflowInfo[]
): Array<{ id: string; label: string; icon: string; page: string }> {
  return workflows.map((w) => ({
    id: `wf_${w.key}`,
    label: formatLabel(w.key.replace(/_flow$/g, '')),
    icon: 'AccountTree',
    page: `wf_${w.key}`,
  }));
}

/** Generate PageSpecs for novel workflows */
export function generateNovelWorkflowPages(
  workflows: WorkflowInfo[]
): PageSpec[] {
  return workflows.map(generateWorkflowPage);
}

// ── Main export ──────────────────────────────────────────────────────

/**
 * Generate PageSpecs for novel features that don't have dedicated preview pages.
 * Uses keyword matching on feature descriptions to select appropriate section types.
 */
export function generateNovelFeaturePages(
  features: FeatureInfo[],
  knownFeatureKeys: Set<string>
): PageSpec[] {
  return features
    .filter((f) => !f.isKnown && !knownFeatureKeys.has(f.key))
    .map((f) => ({
      pageId: f.key,
      sections: selectSections(f.key, f.description || f.key),
    }));
}

/**
 * Generate navigation items for novel features.
 */
export function generateNovelNavItems(
  features: FeatureInfo[],
  knownFeatureKeys: Set<string>
): Array<{ id: string; label: string; icon: string; page: string }> {
  const icons: Record<string, string> = {
    search: 'Search', find: 'Search', compare: 'CompareArrows', price: 'AttachMoney',
    cost: 'AttachMoney', insurance: 'Shield', medication: 'Medication', drug: 'Medication',
    track: 'Timeline', alert: 'Notifications', report: 'Assessment', upload: 'CloudUpload',
    manage: 'Settings', list: 'List', schedule: 'CalendarToday', location: 'LocationOn',
    donor: 'Favorite', blood: 'Bloodtype', patient: 'Person', inventory: 'Inventory',
    monitor: 'Monitor', vital: 'FavoriteBorder', heart: 'Favorite', sleep: 'NightsStay',
    mood: 'SentimentSatisfied', nutrition: 'Restaurant', fitness: 'FitnessCenter',
    dental: 'MedicalServices', eye: 'Visibility', rehab: 'Accessibility', surgery: 'LocalHospital',
    lab: 'Science', radiology: 'Scanner', pharmacy: 'LocalPharmacy', emergency: 'LocalHospital',
    elder: 'Elderly', child: 'ChildCare', vet: 'Pets', ambulance: 'LocalShipping',
    education: 'School', research: 'Biotech', billing: 'Receipt', claim: 'Description',
    form: 'Assignment', profile: 'AccountCircle', chart: 'BarChart', dashboard: 'Dashboard',
    message: 'Chat', care: 'HealthAndSafety', home: 'Home', genetic: 'Biotech',
    vaccine: 'Vaccines', wound: 'Healing', pain: 'Warning', seizure: 'FlashOn',
    oxygen: 'Air', growth: 'TrendingUp', specimen: 'Science', tissue: 'Layers',
  };

  return features
    .filter((f) => !f.isKnown && !knownFeatureKeys.has(f.key))
    .map((f) => {
      const d = (f.key + ' ' + (f.description || '')).toLowerCase();
      const iconKey = Object.keys(icons).find((k) => d.includes(k)) || 'ViewModule';
      return {
        id: f.key,
        label: formatLabel(f.key.replace(/_engine|_check|_management|_tracking|_input|_manager/g, '')),
        icon: icons[iconKey] || 'ViewModule',
        page: f.key,
      };
    });
}
