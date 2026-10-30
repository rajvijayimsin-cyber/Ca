/**
 * Theme-aware style helpers used across all preview pages.
 * Each function returns an SX-compatible object based on the active theme's
 * cardStyle / buttonStyle / tableStyle properties.
 */

import { AppTheme } from '../hooks/useAppTheme';

/* ------------------------------------------------------------------ */
/*  Card wrapper                                                       */
/* ------------------------------------------------------------------ */
export function cardSx(theme: AppTheme): Record<string, any> {
  const base: Record<string, any> = {
    borderRadius: `${theme.borderRadius}px`,
    backgroundColor: theme.surface,
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  };

  switch (theme.cardStyle) {
    case 'elevated':
      // Modern & Minimal: no border, soft shadow
      return {
        ...base,
        border: 'none',
        boxShadow: theme.cardShadow,
        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.10)' },
      };
    case 'bordered':
      // Clinical: left accent border, no shadow
      return {
        ...base,
        border: `1px solid ${theme.border}`,
        borderLeft: `3px solid ${theme.primary}`,
        boxShadow: 'none',
      };
    case 'flat':
      // Dashboard (dark): subtle border + glow shadow
      return {
        ...base,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.cardShadow,
        '&:hover': { boxShadow: '0 4px 24px rgba(99,102,241,0.18)' },
      };
    case 'soft':
      // Mobile First: larger radius, pastel tint shadow
      return {
        ...base,
        borderRadius: `${theme.borderRadius + 4}px`,
        border: 'none',
        boxShadow: theme.cardShadow,
        '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.10)' },
      };
    default:
      return { ...base, border: `1px solid ${theme.border}` };
  }
}

/* ------------------------------------------------------------------ */
/*  Primary button                                                     */
/* ------------------------------------------------------------------ */
export function primaryButtonSx(theme: AppTheme): Record<string, any> {
  const base: Record<string, any> = {
    px: 2,
    py: 0.8,
    fontSize: '0.8rem',
    fontWeight: 600,
    fontFamily: theme.fontFamily,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  switch (theme.buttonStyle) {
    case 'pill':
      // Modern & Minimal
      return {
        ...base,
        borderRadius: '999px',
        backgroundColor: theme.primary,
        color: '#fff',
        border: 'none',
        '&:hover': { opacity: 0.88, transform: 'translateY(-1px)' },
      };
    case 'square':
      // Clinical
      return {
        ...base,
        borderRadius: '4px',
        backgroundColor: theme.primary,
        color: '#fff',
        border: 'none',
        fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
        '&:hover': { backgroundColor: theme.primaryDark },
      };
    case 'outline':
      // Dashboard
      return {
        ...base,
        borderRadius: `${theme.borderRadius}px`,
        backgroundColor: 'transparent',
        color: theme.primary,
        border: `1px solid ${theme.primary}`,
        '&:hover': {
          backgroundColor: `${theme.primary}15`,
          boxShadow: `0 0 12px ${theme.primary}30`,
        },
      };
    case 'rounded':
      // Mobile First
      return {
        ...base,
        borderRadius: `${theme.borderRadius}px`,
        background: theme.headerGradient,
        color: '#fff',
        border: 'none',
        '&:hover': { opacity: 0.9, transform: 'translateY(-1px)' },
      };
    default:
      return {
        ...base,
        borderRadius: `${theme.borderRadius / 2}px`,
        backgroundColor: theme.primary,
        color: '#fff',
        border: 'none',
      };
  }
}

/* ------------------------------------------------------------------ */
/*  Secondary / outline button                                         */
/* ------------------------------------------------------------------ */
export function secondaryButtonSx(theme: AppTheme): Record<string, any> {
  const base: Record<string, any> = {
    px: 1.5,
    py: 0.6,
    fontSize: '0.8rem',
    fontFamily: theme.fontFamily,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  switch (theme.buttonStyle) {
    case 'pill':
      return {
        ...base,
        borderRadius: '999px',
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
        backgroundColor: 'transparent',
        '&:hover': { borderColor: theme.primary, color: theme.primary },
      };
    case 'square':
      return {
        ...base,
        borderRadius: '4px',
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
        backgroundColor: 'transparent',
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
        '&:hover': { borderColor: theme.primary, color: theme.primary },
      };
    case 'outline':
      return {
        ...base,
        borderRadius: `${theme.borderRadius}px`,
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
        backgroundColor: 'transparent',
        '&:hover': { borderColor: theme.primary, color: theme.primary, boxShadow: `0 0 8px ${theme.primary}20` },
      };
    case 'rounded':
      return {
        ...base,
        borderRadius: `${theme.borderRadius}px`,
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
        backgroundColor: 'transparent',
        '&:hover': { borderColor: theme.primary, color: theme.primary },
      };
    default:
      return {
        ...base,
        borderRadius: `${theme.borderRadius / 2}px`,
        border: `1px solid ${theme.border}`,
        color: theme.textSecondary,
        backgroundColor: 'transparent',
      };
  }
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */
export function sectionHeadingSx(theme: AppTheme): Record<string, any> {
  const base: Record<string, any> = {
    fontFamily: theme.fontFamily,
    color: theme.text,
    mb: 1.5,
  };

  switch (theme.buttonStyle) {
    case 'pill':
      // Modern & Minimal
      return { ...base, fontSize: '0.9rem', fontWeight: 600 };
    case 'square':
      // Clinical
      return { ...base, fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em' };
    case 'outline':
      // Dashboard
      return { ...base, fontSize: '0.9rem', fontWeight: 500 };
    case 'rounded':
      // Mobile First
      return { ...base, fontSize: '0.95rem', fontWeight: 700 };
    default:
      return { ...base, fontSize: '0.9rem', fontWeight: 600 };
  }
}

/* ------------------------------------------------------------------ */
/*  Page padding                                                       */
/* ------------------------------------------------------------------ */
export function pagePadding(theme: AppTheme): number {
  return theme.density === 'spacious' ? 3 : 2;
}
