import ar from './ar.json';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import ja from './ja.json';
import ko from './ko.json';
import zh from './zh.json';

// 🔒 Inline map so we avoid any path/alias shenanigans
const LABEL_TO_CODE = {
  English: 'en',
  French:  'fr',
  Spanish: 'es',
  German:  'de',
  Arabic:  'ar',
  Japanese:'ja',
  Korean:  'ko',
  Italian: 'it',
  Chinese: 'zh',
};

const RESOURCES = { en, fr, ja, ar, es, de, it, ko, zh };
const RTL_LANGS = new Set(['ar']);

function normalizeLang(lang) {
  if (!lang) return 'en';
  const raw = String(lang).trim();

  // exact code
  if (RESOURCES[raw]) return raw;

  // label → code (e.g., "French" → "fr")
  const fromLabel = LABEL_TO_CODE[raw];
  if (fromLabel && RESOURCES[fromLabel]) return fromLabel;

  // regional → base (e.g., "fr-FR" → "fr")
  const base = raw.toLowerCase().split('-')[0];
  if (RESOURCES[base]) return base;

  return 'en';
}

export function t(key, lang = 'en') {
  const code = normalizeLang(lang);
  const dict = RESOURCES[code] || RESOURCES.en;
  return (dict && dict[key]) ?? (RESOURCES.en && RESOURCES.en[key]) ?? key;
}

export function isRTL(lang = 'en') {
  return RTL_LANGS.has(normalizeLang(lang));
}

if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.log('[i18n] loaded languages:', Object.keys(RESOURCES));
}
