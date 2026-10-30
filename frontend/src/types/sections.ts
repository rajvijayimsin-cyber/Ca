/**
 * Types for the dynamic page-spec / section system.
 *
 * SectionSpec describes a single visual section on a page (e.g. a KPI grid,
 * a data table, a chart, a card grid, etc.).
 * PageSpec groups sections together for a named page.
 */

// ── Section-level config sub-types ──────────────────────────────────────

export interface ActionItem {
  label: string;
  variant: 'primary' | 'secondary' | 'outlined';
  icon?: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status?: 'complete' | 'warning' | 'error' | 'info';
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface CardItem {
  title: string;
  description: string;
  icon?: string;
  action?: string;
}

export interface MetricBarItem {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export interface ProgressStep {
  label: string;
  status: 'complete' | 'active' | 'pending';
}

// ── Section config (union of all possible configs) ──────────────────────

export interface SectionConfig {
  // action_toolbar
  actions?: ActionItem[];

  // data_table
  columns?: string[];
  rows?: string[][];

  // kpi_grid
  items?: KpiItem[];

  // timeline
  events?: TimelineEvent[];

  // chart
  type?: 'line' | 'bar' | 'donut';
  data?: ChartDataPoint[];

  // card_grid
  cards?: CardItem[];

  // metric_bar
  metrics?: MetricBarItem[];

  // progress_tracker
  steps?: ProgressStep[];

  // split_panel
  leftTitle?: string;
  rightTitle?: string;
  ratio?: string;

  // map_view
  pins?: Array<{ label: string; lat: number; lng: number; status?: string }>;

  // gallery
  images?: Array<{ title: string; type: string; status?: string; thumbnailUrl?: string }>;

  // chat_view
  messages?: Array<{ from: string; text: string; time: string }>;

  // Generic catch-all for custom configs
  [key: string]: any;
}

// ── Core types ──────────────────────────────────────────────────────────

export type SectionType =
  | 'action_toolbar'
  | 'data_table'
  | 'kpi_grid'
  | 'timeline'
  | 'chart'
  | 'card_grid'
  | 'metric_bar'
  | 'progress_tracker'
  | 'split_panel'
  | 'map_view'
  | 'calendar_view'
  | 'kanban_board'
  | 'gallery'
  | 'chat_view';

export interface SectionSpec {
  type: SectionType;
  title: string;
  order: number;
  gridSpan: number;
  config: SectionConfig;
}

export interface PageSpec {
  pageId: string;
  sections: SectionSpec[];
}
