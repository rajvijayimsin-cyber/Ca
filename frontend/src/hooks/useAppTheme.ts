export interface AppTheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  sidebar: string;
  sidebarText: string;
  sidebarActive: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  fontFamily: string;
  numberFont: string;
  borderRadius: number;
  spacing: number;
  density: 'comfortable' | 'compact' | 'spacious';
  headerGradient: string;
  cardShadow: string;
  cardStyle: 'elevated' | 'bordered' | 'flat' | 'soft';
  buttonStyle: 'pill' | 'square' | 'outline' | 'rounded';
  tableStyle: 'clean' | 'striped' | 'bordered' | 'minimal';
  kpiLayout: 'standard' | 'compact' | 'horizontal' | 'centered';
}

// Exact theme values matching preview — no MUI derivation needed
const THEME: AppTheme = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  primaryDark: "#3730A3",
  secondary: "#06B6D4",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  sidebar: "#FFFFFF",
  sidebarText: "#334155",
  sidebarActive: "rgba(79, 70, 229, 0.08)",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  fontFamily: "\"Inter\", -apple-system, BlinkMacSystemFont, sans-serif",
  numberFont: "\"Inter\", monospace",
  borderRadius: 12,
  spacing: 24,
  density: "spacious",
  headerGradient: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  cardShadow: "0 1px 3px rgba(0,0,0,0.08)",
  cardStyle: "elevated",
  buttonStyle: "pill",
  tableStyle: "clean",
  kpiLayout: "standard",
};

export function useAppTheme(): AppTheme {
  return THEME;
}
