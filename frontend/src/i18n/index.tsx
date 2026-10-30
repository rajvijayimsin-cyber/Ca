/**
 * The app's languages. Every string on screen comes from a catalog in
 * ./locales, under a key; English is the source and the fallback.
 *
 *   const { t, fmtDate } = useT();
 *   t('common.save')                      // "Guardar"
 *   t('common.rows', { count: 3 })        // plural form for the language
 *   t('common.range', { from: 1, to: 10, count: 42 })
 *
 * Data people type is never translated. Licensed or clinical text comes from
 * its official source in that language, not from this file.
 */
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import cat_en from './locales/en.json';

type Catalog = Record<string, any>;
export type Dir = 'ltr' | 'rtl';
export type Vars = Record<string, string | number>;

export const LANGS: { code: string; name: string; dir: Dir; locale: string }[] = [
  { code: "en", name: "English", dir: "ltr" as Dir, locale: "en-US" },
];
export const DEFAULT_LANG = "en";
const SOURCE_LANG = 'en';
const CATALOGS: Record<string, Catalog> = { "en": cat_en as Catalog };
// English text -> this language: the platform's own words, then this app's.
const TEXTS: Record<string, Record<string, string>> = {  };
const STORAGE_KEY = 'app_language';

// Test mode: every translated string is marked, so English left on screen is
// English nobody put through tx(). localStorage.app_pseudo = '1'.
const PSEUDO = (() => { try { return localStorage.getItem('app_pseudo') === '1'; } catch { return false; } })();
const mark = (s: string) => (PSEUDO ? '⟦' + s + '⟧' : s);

const known = (code: string | null | undefined) => !!code && LANGS.some(l => l.code === code);

function initialLang(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (known(saved)) return saved as string;
  } catch { /* storage blocked */ }
  // Not the browser's language: most browsers say English whatever their
  // owner reads, and the customer chose this app's first language.
  return DEFAULT_LANG;
}

let current = initialLang();
const listeners = new Set<() => void>();

const info = (code: string) => LANGS.find(l => l.code === code) || LANGS[0];

// Icons that point along the line of reading. In a right-to-left language
// "next" points left, and the sign-out arrow leaves to the left.
const MIRRORED = ['NavigateNext', 'NavigateBefore', 'ChevronRight', 'ChevronLeft',
  'ArrowForward', 'ArrowBack', 'ArrowForwardIos', 'ArrowBackIos', 'KeyboardArrowRight',
  'KeyboardArrowLeft', 'Logout', 'Login', 'Send', 'LastPage', 'FirstPage', 'OpenInNew'];

function applyToDocument(code: string) {
  try {
    document.documentElement.lang = code;
    document.documentElement.dir = info(code).dir;
    if (!document.getElementById('i18n-mirror')) {
      const style = document.createElement('style');
      style.id = 'i18n-mirror';
      style.textContent = MIRRORED.map(n => `[dir="rtl"] svg[data-testid="${n}Icon"]`).join(',')
        + '{transform:scaleX(-1)}';
      document.head.appendChild(style);
    }
  } catch { /* no document */ }
}
applyToDocument(current);

// What the browser checks read to test every language this app ships
// (playwright_runner): the codes, which read right to left, and the
// translated text. Nothing here is not already in the bundle.
try {
  (window as any).__app_i18n = {
    langs: LANGS.map(l => l.code), defaultLang: DEFAULT_LANG,
    rtl: LANGS.filter(l => l.dir === 'rtl').map(l => l.code),
  };
} catch { /* no window */ }

export function getLang(): string { return current; }

export function setLang(code: string): void {
  if (!known(code) || code === current) return;
  current = code;
  try { localStorage.setItem(STORAGE_KEY, code); } catch { /* storage blocked */ }
  applyToDocument(code);
  listeners.forEach(fn => fn());
  // Labels built when a module loaded keep the language they were built in,
  // so the page starts again in the new one.
  try { window.location.reload(); } catch { /* no window */ }
}

function lookup(key: string, lang: string): string | undefined {
  for (const code of [lang, DEFAULT_LANG, SOURCE_LANG]) {
    const v = CATALOGS[code]?.[key];
    if (typeof v === 'string') return v;
  }
  return undefined;
}

// Numbers are written the way the language writes them (1.234,5 · ١٢٣).
function fill(text: string, vars: Vars | undefined, lang: string): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, name) => {
    if (!(name in vars)) return m;
    const v = vars[name];
    return typeof v === 'number' ? fmtNumber(v, undefined, lang) : String(v);
  });
}

/** The string for `key` in the current language. With `count`, the plural
 *  form for that number (`key.one`, `key.few`, ... falling back to `key.other`). */
export function t(key: string, vars?: Vars, lang: string = current): string {
  if (vars && typeof vars.count === 'number') {
    let form = 'other';
    try { form = new Intl.PluralRules(info(lang).locale).select(vars.count); } catch { /* old engine */ }
    const p = lookup(`${key}.${form}`, lang) ?? lookup(`${key}.other`, lang);
    if (p !== undefined) return mark(fill(p, vars, lang));
  }
  const s = lookup(key, lang);
  return mark(s === undefined ? key : fill(s, vars, lang));
}

/** English text in the current language: `tx("Save changes")`,
 *  `tx("{label} created", { label })`. Untranslated text stays English. */
// What tx() has already produced: a label that was translated where it was
// written must not be translated again where it is read ("Dashboard" -> "Panel",
// then "Panel" -> "Perfil", because "Panel" is also an English word here).
const PRODUCED = new Set<string>();

export function tx(text: string, vars?: Vars, lang: string = current): string {
  const s = (lang === SOURCE_LANG ? undefined : TEXTS[lang]?.[text]) ?? text;
  const out = mark(fill(s, vars, lang));
  if (out !== text) PRODUCED.add(out);
  return out;
}

/** The locale dates and numbers are written in: es-419, ar, tr-TR ... */
export function appLocale(lang: string = current): string { return info(lang).locale; }

/** A stored state ("no_show", "IN_PROGRESS", "Awaiting Review") as a person
 *  reads it, in the current language. The value itself never changes: it is
 *  what the database holds, what filters match and what colours key on. */
export function statusLabel(value: unknown, lang: string = current): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const words = raw.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  const sentence = words.charAt(0).toUpperCase() + words.slice(1);
  if (lang !== SOURCE_LANG) {
    for (const k of [raw, sentence]) {
      const s = TEXTS[lang]?.[k];
      if (s) return mark(s);
    }
  }
  // already written for people ("ICU", "In Review"): leave it as it is
  return mark(/[A-Z]/.test(raw) && !/_/.test(raw) ? raw : sentence);
}

/** The stored value for what someone picked or typed: a state's label
 *  ("Activo") back to its key ("active"); anything else as typed. */
export function statusKey(input: string, options: string[], lang: string = current): string {
  const t = String(input ?? '').trim().toLowerCase();
  const hit = options.find(o => o.toLowerCase() === t
    || statusLabel(o, lang).toLowerCase().replace(/[⟦⟧]/g, '') === t);
  return hit ?? input;
}

/** tx() for a value that may not be a string (a label passed as a node). */
export function txv<T>(value: T): T | string {
  return typeof value === 'string' && value && !PRODUCED.has(value) ? tx(value) : value;
}

export function fmtNumber(n: number | string, opts?: Intl.NumberFormatOptions, lang: string = current): string {
  const v = typeof n === 'string' ? Number(n) : n;
  if (n === '' || n == null || Number.isNaN(v)) return String(n ?? '');
  try { return new Intl.NumberFormat(info(lang).locale, opts).format(v); } catch { return String(v); }
}

export function fmtMoney(amount: number | string, currency: string, lang: string = current): string {
  return fmtNumber(amount, { style: 'currency', currency }, lang);
}

/** A server value as the moment it means. The server writes UTC with no zone
 *  ("2026-10-19T10:18:28", datetime.utcnow()); JavaScript would read that as
 *  local time, off by the viewer's offset. A plain date ("2026-10-19") is a
 *  calendar day, not UTC midnight, which shows as the day before west of UTC. */
export function toDate(value: string | number | Date): Date {
  if (typeof value !== 'string') return value instanceof Date ? value : new Date(value);
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (day) return new Date(+day[1], +day[2] - 1, +day[3]);
  return new Date(/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(value) ? value.replace(' ', 'T') + 'Z' : value);
}

/** Dates are stored as ISO strings; they are only ever formatted on screen. */
export function fmtDate(value: string | number | Date | null | undefined,
                        opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
                        lang: string = current): string {
  if (value == null || value === '') return '';
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try { return new Intl.DateTimeFormat(info(lang).locale, opts).format(d); } catch { return d.toISOString(); }
}

function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }

/** Re-renders the component when the language changes. */
export function useT() {
  const lang = React.useSyncExternalStore(subscribe, getLang, getLang);
  return React.useMemo(() => ({
    lang,
    dir: info(lang).dir,
    langs: LANGS,
    setLang,
    t: (key: string, vars?: Vars) => t(key, vars, lang),
    tx: (text: string, vars?: Vars) => tx(text, vars, lang),
    fmtNumber: (n: number | string, o?: Intl.NumberFormatOptions) => fmtNumber(n, o, lang),
    fmtMoney: (a: number | string, c: string) => fmtMoney(a, c, lang),
    fmtDate: (v: string | number | Date | null | undefined, o?: Intl.DateTimeFormatOptions) => fmtDate(v, o, lang),
  }), [lang]);
}

/** Wraps the whole app (index.tsx). */
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dir } = useT();
  return <>{children}</>;
};

/** Inside the app's ThemeProvider: MUI reads the reading direction from the
 *  theme (the drawer opens from the right in Arabic, arrows point the other way). */
export const LocaleTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dir } = useT();
  return <ThemeProvider theme={(outer: any) => ({ ...outer, direction: dir })}>{children}</ThemeProvider>;
};
