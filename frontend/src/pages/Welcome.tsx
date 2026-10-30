import React, { useState, useMemo } from 'react';
import { useAppTheme } from '../hooks/useAppTheme';
import { Box, Typography } from '@mui/material';
import { primaryButtonSx, secondaryButtonSx, cardSx } from '../utils/themeStyles';
import { NAV_ICONS } from '../config/previewPages';
import { SECTION_REGISTRY } from '../config/sectionRegistry';
import { resolveSections, resolveTextVars } from '../utils/sectionHelpers';
import { getFeatureDisplayForWelcome, FeatureDisplayInfo } from '../config/featureDisplay';
import PreviewBrandMark from '../shared/PreviewBrandMark';


// A value the project's config did not provide. Declared `any` so a
// guard built from it is not a compile error; it is still undefined at runtime.
const cfgMissing: any = undefined;

const compliance: string[] = ["HIPAA"];

/** Section texts map with template vars already resolved */
type ST = Record<string, Record<string, string>>;

/* ── Shared helpers ────────────────────────────────────── */

const SECURITY_ICON = 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-6H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z';

const INTEGRATIONS: string[] = [];

const PALETTE_CYCLE = (theme: any) => [theme.primary, theme.info, theme.success, theme.warning, '#9c27b0', theme.error];

function buildFeatures(theme: any, t: Record<string, string>, contextFeatures?: FeatureDisplayInfo[]) {
  // If context-aware features are available, use them instead of hardcoded defaults
  if (contextFeatures && contextFeatures.length > 0) {
    const colors = PALETTE_CYCLE(theme);
    return contextFeatures.map((f, i) => ({
      icon: NAV_ICONS[f.icon] || NAV_ICONS['dashboard'],
      title: f.title,
      description: f.description,
      color: colors[i % colors.length],
    }));
  }

  // Fallback: use section registry defaults
  return [
    { icon: NAV_ICONS['medical'], title: t.feature1Title || '', description: t.feature1Desc || '', color: theme.primary },
    { icon: NAV_ICONS['calendar'], title: t.feature2Title || '', description: t.feature2Desc || '', color: theme.info },
    { icon: SECURITY_ICON, title: t.feature3Title || '', description: t.feature3Desc || '', color: theme.success },
    { icon: NAV_ICONS['chart'], title: t.feature4Title || '', description: t.feature4Desc || '', color: theme.warning },
    { icon: NAV_ICONS['video'], title: t.feature5Title || '', description: t.feature5Desc || '', color: '#9c27b0' },
    { icon: NAV_ICONS['prescription'], title: t.feature6Title || '', description: t.feature6Desc || '', color: theme.error },
  ].filter(x => x.title);
}

function buildSteps(t: Record<string, string>) {
  return [
    { step: t.step1Number || '01', title: t.step1Title || '', description: t.step1Desc || '' },
    { step: t.step2Number || '02', title: t.step2Title || '', description: t.step2Desc || '' },
    { step: t.step3Number || '03', title: t.step3Title || '', description: t.step3Desc || '' },
  ];
}

// Only the figures the app was actually given.
//
// These used to fall back to a customer count, an uptime percentage, an
// integration count and a review score — all invented, for a product that
// had just been generated and had no users at all. An app that supplies
// no figures now shows no figures, and the bar hides itself.
function buildStats(t: Record<string, string>) {
  return [
    { value: t.stat1Value || '', label: t.stat1Label || '' },
    { value: t.stat2Value || '', label: t.stat2Label || '' },
    { value: t.stat3Value || '', label: t.stat3Label || '' },
    { value: t.stat4Value || '', label: t.stat4Label || '' },
  ].filter(s => s.value);
}

// Only the quotes the app was actually given — see buildStats. The defaults
// behind these were three invented people with names, job titles and
// opinions about a product nobody had used yet.
function buildTestimonials(t: Record<string, string>) {
  return [
    { name: t.testimonial1Name || '', role: t.testimonial1Role || '', quote: t.testimonial1Quote || '' },
    { name: t.testimonial2Name || '', role: t.testimonial2Role || '', quote: t.testimonial2Quote || '' },
    { name: t.testimonial3Name || '', role: t.testimonial3Role || '', quote: t.testimonial3Quote || '' },
  ].filter(x => x.quote);
}

/* ── Shared components ─────────────────────────────────── */

const Navbar: React.FC<{ config: any; t: Record<string, string>;
 }> = ({ config, t }) => {
  const theme = useAppTheme();
  const m = false;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: m ? 1.5 : 3, py: m ? 1 : 1.5, background: theme.headerGradient, position: 'sticky', top: 0, zIndex: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <PreviewBrandMark logoUrl={cfgMissing} logoMark={cfgMissing} alt={"CareNest"} sx={{ width: 30, height: 30, borderRadius: `${theme.borderRadius / 2}px`, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" />
          </svg>
        </PreviewBrandMark>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: theme.fontFamily }}>Trusted care at home, by the hour</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {!m && [t.navLink1, t.navLink2, t.navLink3].filter(Boolean).map(label => (
          <Box key={label} sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: theme.fontFamily, cursor: 'pointer', borderRadius: '6px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }, transition: 'all 0.15s' }}>
            {label}
          </Box>
        ))}
        <Box onClick={() => (window.location.href = '/login')} sx={{ px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 600, color: '#fff', fontFamily: theme.fontFamily, cursor: 'pointer', borderRadius: '6px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }, transition: 'all 0.15s', ml: 0.5 }}>
          {t.signInLink || 'Sign In'}
        </Box>
        <Box onClick={() => (window.location.href = '/signup')} sx={{ px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 600, color: theme.primary, fontFamily: theme.fontFamily, cursor: 'pointer', borderRadius: '8px', backgroundColor: '#fff', ml: 0.5, '&:hover': { opacity: 0.9 }, transition: 'all 0.15s' }}>
          {t.signUpButton || 'Sign Up'}
        </Box>
      </Box>
    </Box>
  );
};

const FooterSection: React.FC<{ config: any; t: Record<string, string> }> = ({ config, t }) => {
  const theme = useAppTheme();
  const m = false;
  return (
    <Box sx={{ py: m ? 2 : 3, px: m ? 2 : 4, backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}` }}>
      <Box sx={{ display: 'flex', flexDirection: m ? 'column' : 'row', justifyContent: m ? 'center' : 'space-between', alignItems: m ? 'flex-start' : 'center', flexWrap: 'wrap', gap: m ? 1.5 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PreviewBrandMark logoUrl={cfgMissing} logoMark={cfgMissing} alt={"CareNest"} sx={{ width: 24, height: 24, borderRadius: `${theme.borderRadius / 3}px`, background: theme.headerGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" fill="white"/></svg>
          </PreviewBrandMark>
          <Typography sx={{ fontSize: '0.72rem', color: theme.textSecondary, fontFamily: theme.fontFamily }}>
            {t.copyright || `\u00A9 2026 ${"CareNest"}. All rights reserved.`}
          </Typography>
        </Box>
        {(cfgMissing || cfgMissing || cfgMissing) && (
          <Typography sx={{ fontSize: '0.7rem', color: theme.textSecondary, fontFamily: theme.fontFamily }}>
            {[cfgMissing, cfgMissing, cfgMissing].filter(Boolean).join('  ·  ')}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {compliance.map(c => (
            <Box key={c} sx={{ px: 1.5, py: 0.3, borderRadius: '12px', backgroundColor: `${theme.success}12`, fontSize: '0.65rem', fontWeight: 600, color: theme.success, fontFamily: theme.fontFamily }}>{c.toUpperCase()}</Box>
          ))}
          
        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 0: Classic (original)
   ═══════════════════════════════════════════════════════════ */
const Classic: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const hiwT = st['how-it-works'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);
  const steps = buildSteps(hiwT);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Hero */}
      {show['hero'] && (
        <Box sx={{ background: theme.headerGradient, py: m ? 4 : 6, px: m ? 2 : 4, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <Box sx={{ position: 'absolute', top: '30%', right: '10%', width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }} />
          <PreviewBrandMark logoUrl={cfgMissing} logoMark={cfgMissing} alt={"CareNest"} sx={{ width: 72, height: 72, borderRadius: `${theme.borderRadius}px`, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" fill="white"/></svg>
          </PreviewBrandMark>
          <Typography sx={{ fontSize: m ? '1.4rem' : '2.2rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1.5, lineHeight: 1.2 }}>{heroT.headline || "CareNest"}</Typography>
          <Typography sx={{ fontSize: m ? '0.82rem' : '1.05rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: 1, maxWidth: 540, mx: 'auto', lineHeight: 1.6 }}>
            {cfgMissing || heroT.subtitle || ''}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            {compliance.map(c => (
              <Box key={c} sx={{ px: 1.5, py: 0.4, borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.18)', fontSize: '0.7rem', fontWeight: 600, fontFamily: theme.fontFamily }}>{c.toUpperCase()} Compliant</Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: m ? 1.5 : 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: m ? 3 : 4, py: m ? 1 : 1.3, fontSize: m ? '0.82rem' : '0.92rem', fontWeight: 700, backgroundColor: '#fff', color: theme.primary, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', '&:hover': { opacity: 0.95, transform: 'translateY(-2px)', boxShadow: '0 6px 24px rgba(0,0,0,0.2)' }, transition: 'all 0.2s', ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>
              {heroT.primaryButton || 'Get Started Free'}
            </Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: m ? 3 : 4, py: m ? 1 : 1.3, fontSize: m ? '0.82rem' : '0.92rem', fontWeight: 600, border: '2px solid rgba(255,255,255,0.4)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.6)' }, transition: 'all 0.2s', ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>
              {heroT.secondaryButton || 'Request Demo'}
            </Box>
          </Box>
        </Box>
      )}



      {/* Features Grid */}
      {show['features'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Typography sx={{ fontSize: m ? '1.1rem' : '1.4rem', fontWeight: 800, textAlign: 'center', color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{featT.heading || 'Everything You Need'}</Typography>
          <Typography sx={{ fontSize: m ? '0.75rem' : '0.85rem', textAlign: 'center', color: theme.textSecondary, fontFamily: theme.fontFamily, mb: m ? 2.5 : 4, maxWidth: 500, mx: 'auto' }}>
            {featT.subtitle || ''}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: m ? 1.5 : 2.5, maxWidth: 860, mx: 'auto' }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ ...cardSx(theme), p: m ? 1.5 : 2.5, cursor: 'pointer', '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 24px ${f.color}15` }, transition: 'all 0.25s' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                </Box>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.8 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: '0.73rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{f.description}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* How It Works */}
      {show['how-it-works'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
          <Typography sx={{ fontSize: m ? '1.1rem' : '1.3rem', fontWeight: 800, textAlign: 'center', color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{hiwT.heading || 'Get Started in Minutes'}</Typography>
          <Typography sx={{ fontSize: m ? '0.75rem' : '0.82rem', textAlign: 'center', color: theme.textSecondary, fontFamily: theme.fontFamily, mb: m ? 2.5 : 4, maxWidth: 450, mx: 'auto' }}>
            {hiwT.subtitle || ''}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 2 : 3, maxWidth: 760, mx: 'auto' }}>
            {steps.map((item, i) => (
              <Box key={i} sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: '50%', background: theme.headerGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: `0 4px 16px ${theme.primary}30` }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: theme.numberFont }}>{item.step}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: theme.text, fontFamily: theme.fontFamily, mb: 0.8 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: '0.73rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{item.description}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Integrations.
          Guarded on the list as well as the section: with no integrations to
          name, the heading "Seamless Integrations" over an empty row is a
          worse claim than no section at all. A generated app ships an empty
          list, because it integrates with nothing. */}
      {show['how-it-works'] && INTEGRATIONS.length > 0 && (
        <Box sx={{ py: m ? 2.5 : 3.5, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Typography sx={{ fontSize: m ? '0.65rem' : '0.72rem', fontWeight: 600, textAlign: 'center', color: theme.textSecondary, fontFamily: theme.fontFamily, mb: m ? 1.5 : 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{hiwT.integrationsLabel || 'Seamless Integrations'}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: m ? 1 : 2, flexWrap: 'wrap' }}>
            {INTEGRATIONS.map((name, i) => (
              <Box key={i} sx={{ px: m ? 1.5 : 2.5, py: m ? 0.6 : 1, borderRadius: `${theme.borderRadius}px`, border: `1px solid ${theme.border}`, backgroundColor: theme.surface, fontSize: m ? '0.68rem' : '0.78rem', fontWeight: 500, color: theme.text, fontFamily: theme.fontFamily }}>{name}</Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CTA */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1.05rem' : '1.3rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Typography sx={{ fontSize: m ? '0.75rem' : '0.85rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: m ? 2 : 3, maxWidth: 450, mx: 'auto' }}>
            {ctaT.subtitle || ''}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: m ? 1.5 : 2, justifyContent: 'center', alignItems: 'center' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: m ? 3 : 4, py: m ? 1 : 1.2, fontSize: m ? '0.8rem' : '0.9rem', fontWeight: 700, backgroundColor: '#fff', color: theme.primary, '&:hover': { opacity: 0.95, transform: 'translateY(-1px)' }, ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>{ctaT.primaryButton || 'Start Free Trial'}</Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: m ? 3 : 4, py: m ? 1 : 1.2, fontSize: m ? '0.8rem' : '0.9rem', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }, ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>{ctaT.secondaryButton || 'Contact Sales'}</Box>
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 1: Split Hero
   ═══════════════════════════════════════════════════════════ */
const SplitHero: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Two-column hero */}
      {show['hero'] && (
        <Box sx={{ background: theme.headerGradient, py: m ? 4 : 6, px: m ? 2 : 5, color: '#fff', display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: 'center', gap: m ? 3 : 5, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <Box sx={{ flex: 1, textAlign: m ? 'center' : 'left' }}>
            <Typography sx={{ fontSize: m ? '1.3rem' : '2rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1.5, lineHeight: 1.2 }}>
              {heroT.headline || "CareNest"}
            </Typography>
            <Typography sx={{ fontSize: m ? '0.8rem' : '0.95rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: 2, lineHeight: 1.6, maxWidth: 400 }}>
              {cfgMissing || heroT.subtitle || ''}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', justifyContent: m ? 'center' : 'flex-start' }}>
              {compliance.map(c => (
                <Box key={c} sx={{ px: 1.5, py: 0.4, borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.18)', fontSize: '0.7rem', fontWeight: 600, fontFamily: theme.fontFamily }}>{c.toUpperCase()}</Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: m ? 'center' : 'flex-start' }}>
              <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 3, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, '&:hover': { opacity: 0.95 } }}>{heroT.primaryButton || 'Get Started Free'}</Box>
              <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 3, py: 1.2, border: '2px solid rgba(255,255,255,0.4)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{heroT.secondaryButton || 'Request Demo'}</Box>
            </Box>
          </Box>
          {!m && (
            <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, maxWidth: 320 }}>
              {features.slice(0, 4).map((f, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: `${theme.borderRadius}px`, backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, fontFamily: theme.fontFamily }}>{f.title}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}



      {/* Horizontal feature row */}
      {show['features'] && (
        <Box sx={{ py: m ? 3 : 4, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.2rem', fontWeight: 800, textAlign: 'center', color: theme.text, fontFamily: theme.fontFamily, mb: m ? 2 : 3 }}>{featT.heading || 'Everything You Need'}</Typography>
          <Box sx={{ display: 'flex', gap: m ? 1.5 : 2, overflowX: 'auto', pb: 1 }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ ...cardSx(theme), p: 2, minWidth: m ? 160 : 200, flexShrink: 0 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                </Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.5 }}>{f.description}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CTA + Footer */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 4, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.2rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 2 }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 3, py: 1, backgroundColor: '#fff', color: theme.primary, fontWeight: 700 }}>{ctaT.primaryButton || 'Start Free Trial'}</Box>
          </Box>
        </Box>
      )}
      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 2: Dark Cinematic
   ═══════════════════════════════════════════════════════════ */
const DarkCinematic: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const hiwT = st['how-it-works'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);
  const stats = buildStats(hiwT);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Full-bleed dark hero */}
      {show['hero'] && (
        <Box sx={{ background: theme.headerGradient, py: m ? 5 : 8, px: m ? 2 : 4, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }} />
          <Typography sx={{ fontSize: m ? '1.6rem' : '2.6rem', fontWeight: 900, fontFamily: theme.fontFamily, mb: 2, lineHeight: 1.15, maxWidth: 650, mx: 'auto' }}>
            {heroT.headline || "CareNest"}
          </Typography>
          <Typography sx={{ fontSize: m ? '0.82rem' : '1rem', opacity: 0.85, fontFamily: theme.fontFamily, mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}>
            {cfgMissing || heroT.subtitle || ''}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 5, py: 1.4, fontSize: '1rem', fontWeight: 700, backgroundColor: '#fff', color: theme.primary, boxShadow: '0 6px 24px rgba(0,0,0,0.2)', '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.2s', ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>
              {heroT.primaryButton || 'Get Started Free'}
            </Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 5, py: 1.4, fontSize: '1rem', border: '2px solid rgba(255,255,255,0.35)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }, ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>
              {heroT.secondaryButton || 'Request Demo'}
            </Box>
          </Box>
        </Box>
      )}



      {/* Stats bar */}
      {show['how-it-works'] && stats.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 0, borderBottom: `1px solid ${theme.border}` }}>
          {stats.map((s, i) => (
            <Box key={i} sx={{ py: m ? 2 : 3, textAlign: 'center', backgroundColor: theme.surface, borderRight: i < stats.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
              <Typography sx={{ fontSize: m ? '1.2rem' : '1.6rem', fontWeight: 800, color: theme.primary, fontFamily: theme.numberFont }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: theme.textSecondary, fontFamily: theme.fontFamily, mt: 0.3 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Light card section */}
      {show['features'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Typography sx={{ fontSize: m ? '1.1rem' : '1.4rem', fontWeight: 800, textAlign: 'center', color: theme.text, fontFamily: theme.fontFamily, mb: m ? 2.5 : 4 }}>
            {featT.heading || 'Everything You Need'}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 1.5 : 2.5, maxWidth: 860, mx: 'auto' }}>
            {features.slice(0, 3).map((f, i) => (
              <Box key={i} sx={{ ...cardSx(theme), p: m ? 2 : 3 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                </Box>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.8 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: '0.73rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{f.description}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CTA */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.3rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 2 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, display: 'inline-flex' }}>
            {ctaT.primaryButton || 'Start Free Trial'}
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 3: Minimal
   ═══════════════════════════════════════════════════════════ */
const MinimalWelcome: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const features = buildFeatures(theme, st['features'] || {}, contextFeatures);

  return (
    <Box sx={{ height: '100%', overflow: 'auto', backgroundColor: theme.background }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Oversized headline */}
      {show['hero'] && (
        <Box sx={{ py: m ? 5 : 8, px: m ? 2 : 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: m ? '1.6rem' : '2.8rem', fontWeight: 900, fontFamily: theme.fontFamily, color: theme.text, lineHeight: 1.1, mb: 2, maxWidth: 600, mx: 'auto' }}>
            {heroT.headline || "CareNest"}
          </Typography>
          <Typography sx={{ fontSize: m ? '0.82rem' : '0.95rem', color: theme.textSecondary, fontFamily: theme.fontFamily, mb: 4, maxWidth: 450, mx: 'auto', lineHeight: 1.6 }}>
            {cfgMissing || heroT.subtitle || ''}
          </Typography>

          {/* Feature badges */}
          {show['features'] && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
              {features.map((f, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.6, borderRadius: '999px', border: `1px solid ${theme.border}`, backgroundColor: theme.surface, fontSize: '0.72rem', fontWeight: 500, color: theme.text, fontFamily: theme.fontFamily }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                  {f.title}
                </Box>
              ))}
            </Box>
          )}

          {/* CTAs */}
          <Box sx={{ display: 'flex', flexDirection: m ? 'column' : 'row', gap: 1.5, justifyContent: 'center', alignItems: 'center' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 5, py: 1.3, fontSize: '0.95rem', fontWeight: 700, background: theme.headerGradient, color: '#fff', boxShadow: `0 4px 20px ${theme.primary}40`, '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.2s', ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>
              {heroT.primaryButton || 'Get Started Free'}
            </Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 4, py: 1.3, fontSize: '0.95rem', ...(m ? { width: '100%', textAlign: 'center' } : {}) }}>
              {heroT.secondaryButton || 'Request Demo'}
            </Box>
          </Box>
        </Box>
      )}



      {/* Compliance strip */}
      {show['how-it-works'] && (
        <Box sx={{ py: 2.5, px: 3, textAlign: 'center', borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.surface }}>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: theme.textSecondary, fontFamily: theme.fontFamily, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{heroT.complianceLabel || 'Trusted & Compliant:'}</Typography>
            {compliance.map(c => (
              <Box key={c} sx={{ px: 1.5, py: 0.3, borderRadius: '12px', backgroundColor: `${theme.success}12`, fontSize: '0.65rem', fontWeight: 600, color: theme.success, fontFamily: theme.fontFamily }}>{c.toUpperCase()}</Box>
            ))}
            
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 4: Cards First
   ═══════════════════════════════════════════════════════════ */
const CardsFirst: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const hiwT = st['how-it-works'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);
  const testimonials = buildTestimonials(hiwT);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Compact hero */}
      {show['hero'] && (
        <Box sx={{ background: theme.headerGradient, py: m ? 3 : 4, px: m ? 2 : 4, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1.2rem' : '1.8rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1, lineHeight: 1.2 }}>
            {heroT.headline || "CareNest"}
          </Typography>
          <Typography sx={{ fontSize: m ? '0.8rem' : '0.9rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: 2.5, maxWidth: 480, mx: 'auto' }}>
            {cfgMissing || heroT.subtitle || ''}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 3, py: 1, backgroundColor: '#fff', color: theme.primary, fontWeight: 700 }}>{heroT.primaryButton || 'Get Started Free'}</Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 3, py: 1, border: '2px solid rgba(255,255,255,0.4)', color: '#fff' }}>{heroT.secondaryButton || 'Request Demo'}</Box>
          </Box>
        </Box>
      )}



      {/* Large feature cards (2-col) */}
      {show['features'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Typography sx={{ fontSize: m ? '1.1rem' : '1.4rem', fontWeight: 800, textAlign: 'center', color: theme.text, fontFamily: theme.fontFamily, mb: m ? 2.5 : 4 }}>
            {featT.heading || 'Everything You Need'}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(2, 1fr)', gap: m ? 2 : 3, maxWidth: 780, mx: 'auto' }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ ...cardSx(theme), p: m ? 2 : 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 50, height: 50, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{f.title}</Typography>
                  <Typography sx={{ fontSize: '0.73rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{f.description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Testimonials strip */}
      {show['how-it-works'] && testimonials.length > 0 && (
        <Box sx={{ py: m ? 3 : 4, px: m ? 2 : 4, backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}` }}>
          <Typography sx={{ fontSize: m ? '0.65rem' : '0.72rem', fontWeight: 600, textAlign: 'center', color: theme.textSecondary, fontFamily: theme.fontFamily, mb: m ? 2 : 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{hiwT.testimonialsLabel || 'What Our Users Say'}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 1.5 : 2.5, maxWidth: 780, mx: 'auto' }}>
            {testimonials.map((item, i) => (
              <Box key={i} sx={{ ...cardSx(theme), p: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', color: theme.text, fontFamily: theme.fontFamily, mb: 1.5, lineHeight: 1.6, fontStyle: 'italic' }}>
                  &ldquo;{item.quote}&rdquo;
                </Typography>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily }}>{item.name}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: theme.textSecondary, fontFamily: theme.fontFamily }}>{item.role}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CTA */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 4, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.2rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 2 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, display: 'inline-flex' }}>
            {ctaT.primaryButton || 'Start Free Trial'}
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 5: Bento Grid
   ═══════════════════════════════════════════════════════════ */
const BentoGrid: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const hiwT = st['how-it-works'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);
  const stats = buildStats(hiwT);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Bento hero: large card left + small cards right */}
      {show['hero'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1.4fr 1fr', gap: m ? 2 : 2.5, maxWidth: 900, mx: 'auto' }}>
            {/* Main hero card */}
            <Box sx={{ ...cardSx(theme), p: m ? 2.5 : 4, background: theme.headerGradient, color: '#fff', borderRadius: `${theme.borderRadius + 4}px`, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', gridRow: m ? 'auto' : 'span 2' }}>
              <Box sx={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
              <Box sx={{ display: 'flex', gap: 0.8, mb: 2, flexWrap: 'wrap' }}>
                {compliance.map(c => (
                  <Box key={c} sx={{ px: 1.2, py: 0.3, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.18)', fontSize: '0.62rem', fontWeight: 600, fontFamily: theme.fontFamily }}>{c.toUpperCase()}</Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: m ? '1.3rem' : '2rem', fontWeight: 900, fontFamily: theme.fontFamily, mb: 1.5, lineHeight: 1.15 }}>
                {heroT.headline || "CareNest"}
              </Typography>
              <Typography sx={{ fontSize: m ? '0.78rem' : '0.9rem', opacity: 0.88, fontFamily: theme.fontFamily, mb: 3, lineHeight: 1.6, maxWidth: 400 }}>
                {cfgMissing || heroT.subtitle || ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 3, py: 1.1, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, '&:hover': { opacity: 0.95 } }}>{heroT.primaryButton || 'Get Started Free'}</Box>
                <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 3, py: 1.1, border: '2px solid rgba(255,255,255,0.35)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{heroT.secondaryButton || 'Request Demo'}</Box>
              </Box>
            </Box>
            {/* Small feature cards */}
            {show['features'] && features.slice(0, 4).map((f, i) => (
              <Box key={i} sx={{ ...cardSx(theme), p: m ? 1.5 : 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{ width: 38, height: 38, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.3 }}>{f.title}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.5 }}>{f.description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}



      {/* Stats row */}
      {show['how-it-works'] && (
        <Box sx={{ py: m ? 2.5 : 4, px: m ? 2 : 4, backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: m ? 1.5 : 3, maxWidth: 800, mx: 'auto' }}>
            {stats.map((s, i) => (
              <Box key={i} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: m ? '1.3rem' : '1.8rem', fontWeight: 900, color: theme.primary, fontFamily: theme.numberFont, lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: '0.68rem', color: theme.textSecondary, fontFamily: theme.fontFamily, mt: 0.5 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CTA */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.3rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Typography sx={{ fontSize: m ? '0.72rem' : '0.82rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: m ? 2 : 3, maxWidth: 440, mx: 'auto' }}>{ctaT.subtitle || ''}</Typography>
          <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, display: 'inline-flex' }}>
            {ctaT.primaryButton || 'Start Free Trial'}
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 6: Video Hero
   ═══════════════════════════════════════════════════════════ */
const VideoHero: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const hiwT = st['how-it-works'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);
  const steps = buildSteps(hiwT);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Full-width dark hero with play button */}
      {show['hero'] && (
        <Box sx={{ background: theme.headerGradient, py: m ? 5 : 8, px: m ? 2 : 4, textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)' }} />
          <Typography sx={{ fontSize: m ? '1.5rem' : '2.4rem', fontWeight: 900, fontFamily: theme.fontFamily, mb: 1.5, lineHeight: 1.12, maxWidth: 600, mx: 'auto' }}>
            {heroT.headline || "CareNest"}
          </Typography>
          <Typography sx={{ fontSize: m ? '0.8rem' : '0.95rem', opacity: 0.85, fontFamily: theme.fontFamily, mb: 4, maxWidth: 480, mx: 'auto', lineHeight: 1.6 }}>
            {cfgMissing || heroT.subtitle || ''}
          </Typography>
          {/* Play button */}
          <Box sx={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#fff' }, transition: 'all 0.2s' }}>
            <Box sx={{ width: 0, height: 0, borderTop: '14px solid transparent', borderBottom: '14px solid transparent', borderLeft: '22px solid #fff', ml: '4px' }} />
          </Box>
          <Typography sx={{ fontSize: '0.72rem', opacity: 0.6, fontFamily: theme.fontFamily, mb: 3 }}>Watch 2-minute demo</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, '&:hover': { opacity: 0.95 } }}>{heroT.primaryButton || 'Get Started Free'}</Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 4, py: 1.2, border: '2px solid rgba(255,255,255,0.35)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{heroT.secondaryButton || 'Request Demo'}</Box>
          </Box>
        </Box>
      )}

      {/* Feature icon strip */}
      {show['features'] && (
        <Box sx={{ py: m ? 2 : 3, px: m ? 2 : 4, backgroundColor: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: m ? 2 : 4, flexWrap: 'wrap', maxWidth: 860, mx: 'auto' }}>
            {features.map((f, i) => (
              <Box key={i} sx={{ textAlign: 'center', minWidth: m ? 60 : 80 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                </Box>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily }}>{f.title}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}



      {/* Numbered "why us" section */}
      {show['how-it-works'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Typography sx={{ fontSize: m ? '1.1rem' : '1.3rem', fontWeight: 800, textAlign: 'center', color: theme.text, fontFamily: theme.fontFamily, mb: m ? 2.5 : 4 }}>{hiwT.heading || 'Get Started in Minutes'}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: m ? 2 : 3, maxWidth: 700, mx: 'auto' }}>
            {steps.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: theme.headerGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', fontFamily: theme.numberFont }}>{item.step}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{item.title}</Typography>
                  <Typography sx={{ fontSize: '0.73rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{item.description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* CTA */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.3rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 2 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700 }}>{ctaT.primaryButton || 'Start Free Trial'}</Box>
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 7: Sidebar Landing
   ═══════════════════════════════════════════════════════════ */
const SidebarLanding: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const hiwT = st['how-it-works'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);
  const stats = buildStats(hiwT);

  // Mobile: fallback to stacked layout
  if (m) {
    return (
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}
        {show['hero'] && (
          <Box sx={{ background: theme.headerGradient, py: 4, px: 2, textAlign: 'center', color: '#fff' }}>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: theme.fontFamily, mb: 1, lineHeight: 1.15 }}>{heroT.headline || "CareNest"}</Typography>
            <Typography sx={{ fontSize: '0.78rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: 2 }}>{cfgMissing || heroT.subtitle || ''}</Typography>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 3, py: 1, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, width: '100%', textAlign: 'center' }}>{heroT.primaryButton || 'Get Started Free'}</Box>
          </Box>
        )}
  
        {show['features'] && features.slice(0, 4).map((f, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 2, borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.background }}>
            <Box sx={{ width: 36, height: 36, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily }}>{f.title}</Typography>
              <Typography sx={{ fontSize: '0.68rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.5 }}>{f.description}</Typography>
            </Box>
          </Box>
        ))}
        {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Sticky left panel */}
      <Box sx={{ width: 260, flexShrink: 0, background: theme.headerGradient, color: '#fff', display: 'flex', flexDirection: 'column', p: 3, position: 'sticky', top: 0, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <PreviewBrandMark logoUrl={cfgMissing} logoMark={cfgMissing} alt={"CareNest"} sx={{ width: 30, height: 30, borderRadius: `${theme.borderRadius / 2}px`, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" /></svg>
          </PreviewBrandMark>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: theme.fontFamily }}>{"CareNest"}</Typography>
        </Box>

        <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: theme.fontFamily, mb: 1.5, lineHeight: 1.15, flex: 0 }}>
          {heroT.headline || "CareNest"}
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', opacity: 0.85, fontFamily: theme.fontFamily, mb: 3, lineHeight: 1.6 }}>
          {cfgMissing || heroT.subtitle || ''}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 2.5, py: 1, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, textAlign: 'center', '&:hover': { opacity: 0.95 } }}>{heroT.primaryButton || 'Get Started Free'}</Box>
          <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 2.5, py: 1, border: '2px solid rgba(255,255,255,0.35)', color: '#fff', textAlign: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{heroT.secondaryButton || 'Request Demo'}</Box>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
          {compliance.map(c => (
            <Box key={c} sx={{ px: 1, py: 0.3, borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.15)', fontSize: '0.6rem', fontWeight: 600, fontFamily: theme.fontFamily }}>{c.toUpperCase()}</Box>
          ))}
        </Box>
      </Box>

      {/* Right scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: theme.background }}>
        {/* Feature list */}
        {show['features'] && (
          <Box sx={{ py: 4, px: 4 }}>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: theme.text, fontFamily: theme.fontFamily, mb: 3 }}>{featT.heading || 'Everything You Need'}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {features.map((f, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{f.title}</Typography>
                    <Typography sx={{ fontSize: '0.73rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{f.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Stats */}
        {show['how-it-works'] && (
          <Box sx={{ py: 3, px: 4, backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}` }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {stats.map((s, i) => (
                <Box key={i} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: theme.primary, fontFamily: theme.numberFont }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: theme.textSecondary, fontFamily: theme.fontFamily }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Inline CTA */}
        {show['cta'] && (
          <Box sx={{ py: 4, px: 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 2 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, display: 'inline-flex' }}>{ctaT.primaryButton || 'Start Free Trial'}</Box>
          </Box>
        )}

        {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 8: Timeline
   ═══════════════════════════════════════════════════════════ */
const TimelineWelcome: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Compact hero */}
      {show['hero'] && (
        <Box sx={{ background: theme.headerGradient, py: m ? 4 : 5, px: m ? 2 : 4, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1.3rem' : '2rem', fontWeight: 900, fontFamily: theme.fontFamily, mb: 1, lineHeight: 1.15 }}>
            {heroT.headline || "CareNest"}
          </Typography>
          <Typography sx={{ fontSize: m ? '0.78rem' : '0.92rem', opacity: 0.88, fontFamily: theme.fontFamily, mb: 3, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}>
            {cfgMissing || heroT.subtitle || ''}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, '&:hover': { opacity: 0.95 } }}>{heroT.primaryButton || 'Get Started Free'}</Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 4, py: 1.2, border: '2px solid rgba(255,255,255,0.35)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{heroT.secondaryButton || 'Request Demo'}</Box>
          </Box>
        </Box>
      )}



      {/* Features as alternating timeline */}
      {show['features'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.background }}>
          <Typography sx={{ fontSize: m ? '1.1rem' : '1.3rem', fontWeight: 800, textAlign: 'center', color: theme.text, fontFamily: theme.fontFamily, mb: m ? 2.5 : 4 }}>{featT.heading || 'Everything You Need'}</Typography>

          {/* Timeline center line */}
          <Box sx={{ position: 'relative', maxWidth: 700, mx: 'auto' }}>
            {!m && <Box sx={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: theme.border, transform: 'translateX(-50%)' }} />}

            {features.map((f, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Box key={i} sx={{
                  display: 'flex',
                  flexDirection: m ? 'row' : (isLeft ? 'row' : 'row-reverse'),
                  alignItems: 'flex-start',
                  gap: m ? 1.5 : 0,
                  mb: m ? 2 : 3,
                  position: 'relative',
                }}>
                  {/* Card */}
                  <Box sx={{
                    flex: m ? 1 : '0 0 44%',
                    ...cardSx(theme),
                    p: m ? 1.5 : 2.5,
                    ...(m ? {} : isLeft ? { mr: '6%' } : { ml: '6%' }),
                  }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{f.title}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{f.description}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Timeline dot */}
                  {!m && (
                    <Box sx={{
                      position: 'absolute',
                      left: '50%',
                      top: 16,
                      transform: 'translateX(-50%)',
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: f.color,
                      border: `3px solid ${theme.background}`,
                      boxShadow: `0 0 0 2px ${f.color}40`,
                      zIndex: 1,
                    }} />
                  )}

                  {/* Spacer for opposite side */}
                  {!m && <Box sx={{ flex: '0 0 44%' }} />}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* CTA */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.3rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Typography sx={{ fontSize: m ? '0.72rem' : '0.82rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: m ? 2 : 3, maxWidth: 440, mx: 'auto' }}>{ctaT.subtitle || ''}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700 }}>{ctaT.primaryButton || 'Start Free Trial'}</Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 4, py: 1.2, border: '2px solid rgba(255,255,255,0.35)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{ctaT.secondaryButton || 'Contact Sales'}</Box>
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════
   Variant 9: Magazine / Editorial
   ═══════════════════════════════════════════════════════════ */
const MagazineEditorial: React.FC<any> = ({ config, st, show, contextFeatures }) => {
  const theme = useAppTheme();
  const m = false;
  const heroT = st['hero'] || {};
  const featT = st['features'] || {};
  const hiwT = st['how-it-works'] || {};
  const ctaT = st['cta'] || {};
  const features = buildFeatures(theme, featT, contextFeatures);
  const testimonials = buildTestimonials(hiwT);

  return (
    <Box sx={{ height: '100%', overflow: 'auto', backgroundColor: theme.background }}>
      {show['navbar'] && <Navbar config={config} t={st['navbar'] || {}} />}

      {/* Full-bleed color block hero with large serif-like heading */}
      {show['hero'] && (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ background: theme.headerGradient, py: m ? 5 : 8, px: m ? 2 : 6, color: '#fff' }}>
            <Box sx={{ maxWidth: 750, mx: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 0.8, mb: 2.5, flexWrap: 'wrap' }}>
                {compliance.map(c => (
                  <Box key={c} sx={{ px: 1.5, py: 0.3, borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.15)', fontSize: '0.62rem', fontWeight: 700, fontFamily: theme.fontFamily, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c}</Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: m ? '1.8rem' : '3rem', fontWeight: 900, fontFamily: theme.fontFamily, mb: 2, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                {heroT.headline || "CareNest"}
              </Typography>
              <Box sx={{ width: 60, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)', mb: 2.5 }} />
              <Typography sx={{ fontSize: m ? '0.85rem' : '1.05rem', opacity: 0.88, fontFamily: theme.fontFamily, mb: 4, lineHeight: 1.7, maxWidth: 550 }}>
                {cfgMissing || heroT.subtitle || ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.3, backgroundColor: '#fff', color: theme.primary, fontWeight: 700, fontSize: '0.92rem', '&:hover': { opacity: 0.95 } }}>{heroT.primaryButton || 'Get Started Free'}</Box>
                <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 4, py: 1.3, border: '2px solid rgba(255,255,255,0.35)', color: '#fff', fontSize: '0.92rem', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{heroT.secondaryButton || 'Request Demo'}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}



      {/* Masonry-style feature grid (uneven) */}
      {show['features'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4 }}>
          <Typography sx={{ fontSize: m ? '1.1rem' : '1.4rem', fontWeight: 800, color: theme.text, fontFamily: theme.fontFamily, mb: 0.5, maxWidth: 750, mx: 'auto' }}>{featT.heading || 'Everything You Need'}</Typography>
          <Typography sx={{ fontSize: m ? '0.72rem' : '0.82rem', color: theme.textSecondary, fontFamily: theme.fontFamily, mb: m ? 2.5 : 4, maxWidth: 750, mx: 'auto' }}>{featT.subtitle || ''}</Typography>
          <Box sx={{ maxWidth: 750, mx: 'auto', display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? 2 : 2.5, gridAutoRows: 'auto' }}>
            {features.map((f, i) => {
              // First and fourth cards span 2 columns for masonry effect
              const isWide = !m && (i === 0 || i === 3);
              return (
                <Box key={i} sx={{
                  ...cardSx(theme),
                  p: m ? 2 : 2.5,
                  gridColumn: isWide ? 'span 2' : 'span 1',
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: `${theme.borderRadius}px`, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={f.color}><path d={f.icon} /></svg>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily, mb: 0.5 }}>{f.title}</Typography>
                    <Typography sx={{ fontSize: '0.73rem', color: theme.textSecondary, fontFamily: theme.fontFamily, lineHeight: 1.6 }}>{f.description}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Pull-quote testimonial */}
      {show['how-it-works'] && testimonials[0]?.quote && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
          <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
            <Typography sx={{ fontSize: m ? '1.1rem' : '1.4rem', fontWeight: 300, fontStyle: 'italic', color: theme.text, fontFamily: theme.fontFamily, lineHeight: 1.6, mb: 2 }}>
              &ldquo;{testimonials[0].quote}&rdquo;
            </Typography>
            <Box sx={{ width: 40, height: 3, borderRadius: 2, background: theme.headerGradient, mx: 'auto', mb: 1.5 }} />
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.text, fontFamily: theme.fontFamily }}>{testimonials[0].name}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: theme.textSecondary, fontFamily: theme.fontFamily }}>{testimonials[0].role}</Typography>
          </Box>
        </Box>
      )}

      {/* CTA */}
      {show['cta'] && (
        <Box sx={{ py: m ? 3 : 5, px: m ? 2 : 4, background: theme.headerGradient, textAlign: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: m ? '1rem' : '1.3rem', fontWeight: 800, fontFamily: theme.fontFamily, mb: 1 }}>{ctaT.heading || 'Ready to get started?'}</Typography>
          <Typography sx={{ fontSize: m ? '0.72rem' : '0.82rem', opacity: 0.9, fontFamily: theme.fontFamily, mb: m ? 2 : 3, maxWidth: 440, mx: 'auto' }}>{ctaT.subtitle || ''}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box onClick={() => (window.location.href = '/signup')} sx={{ ...primaryButtonSx(theme), px: 4, py: 1.2, backgroundColor: '#fff', color: theme.primary, fontWeight: 700 }}>{ctaT.primaryButton || 'Start Free Trial'}</Box>
            <Box onClick={() => (window.location.href = '/login')} sx={{ ...secondaryButtonSx(theme), px: 4, py: 1.2, border: '2px solid rgba(255,255,255,0.35)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>{ctaT.secondaryButton || 'Contact Sales'}</Box>
          </Box>
        </Box>
      )}

      {show['footer'] && <FooterSection config={config} t={st['footer'] || {}} />}
    </Box>
  );
};

/* ── Dispatch ──────────────────────────────────────────── */

const Welcome: React.FC = () => {
  const featureKeys: string[] = ["Caregiver search with filters", "Caregiver profiles with reviews", "3-step booking with hourly price summary", "Booking statuses and cancellation rules", "Check-in/check-out visits with notes", "Payments, receipts and refunds", "Messaging", "Reviews", "Caregiver verification", "Earnings and payouts", "Admin disputes, settings and audit log"];

  const { st, show } = useMemo(() => {
    const sections = resolveSections(SECTION_REGISTRY['welcome'] || []);
    const vars = { appName: "CareNest", compliance: compliance.join(', ') };
    const sectionTexts: ST = {};
    const visible: Record<string, boolean> = {};
    sections.forEach(sec => {
      const t: Record<string, string> = {};
      for (const [k, v] of Object.entries(sec.effectiveTexts)) {
        t[k] = resolveTextVars(v, vars);
      }
      sectionTexts[sec.id] = t;
      visible[sec.id] = true;
    });
    return { st: sectionTexts, show: visible };
  }, ["CareNest", compliance]);

  // Context-aware feature display: only activate when features are provided
  const contextFeatures = useMemo(() => {
    if (featureKeys && featureKeys.length > 0) {
      return getFeatureDisplayForWelcome(featureKeys, 6);
    }
    return undefined;
  }, [featureKeys]);
return <SplitHero st={st} show={show} contextFeatures={contextFeatures} />;
};

export default Welcome;
