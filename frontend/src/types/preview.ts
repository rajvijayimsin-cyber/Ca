
export interface PreviewTheme {
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
  cardStyle: 'elevated' | 'bordered' | 'flat' | 'soft';
  buttonStyle: 'pill' | 'square' | 'outline' | 'rounded';
  tableStyle: 'clean' | 'striped' | 'bordered' | 'minimal';
  kpiLayout: 'standard' | 'compact' | 'horizontal' | 'centered';
  cardShadow: string;
}

export interface PreviewConfiguration {
  theme: PreviewTheme;
  appName: string;
  navigation: Array<{ id: string; label: string; icon: string; page: string }>;
  pages: string[];
  complianceBadges: string[];
  designStyle: string;
  layoutType: string;
  userRole: string;
  userDisplayName: string;
  isMobile: boolean;
  archetype: string | null;
  [key: string]: any;
}
