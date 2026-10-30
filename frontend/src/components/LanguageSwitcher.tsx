import React from 'react';
import { MenuItem, Select } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useT } from '../i18n';

/** Only the languages this app ships. With one, there is nothing to switch. */
const LanguageSwitcher: React.FC<{ color?: string }> = ({ color }) => {
  const { lang, langs, setLang, t } = useT();
  if (langs.length < 2) return null;
  return (
    // translate="no": each language is shown by its own name ("Español"),
    // never translated, and the language checks skip it
    <Select size="small" value={lang} onChange={e => setLang(String(e.target.value))} translate="no"
      inputProps={{ 'aria-label': t('nav.language') }}
      startAdornment={<TranslateIcon fontSize="small" sx={{ mr: 1, color: color || 'inherit', opacity: 0.8 }} />}
      sx={{ color: color || 'inherit', fontSize: '0.82rem', minWidth: 0,
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(127,127,127,0.35)' },
            '.MuiSvgIcon-root': { color: color || 'inherit' } }}>
      {langs.map(l => (
        <MenuItem key={l.code} value={l.code} lang={l.code} dir={l.dir}>{l.name}</MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
