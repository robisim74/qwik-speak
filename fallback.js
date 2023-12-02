import { qwikSpeakExtract, deepMergeMissing } from './packages/qwik-speak/extract/index.js';

const defaultLang = 'en-US';
const supportedLangs = ['en-US', 'it-IT', 'de-DE'];

/**
 * Fallback missing values to default lang
 */
const fallback = (translation) => {
  const defaultTranslation = translation[defaultLang];
  for (const lang of supportedLangs) {
    if (lang !== defaultLang) {
      deepMergeMissing(translation[lang], defaultTranslation);
    }
  }
  return translation;
};

await qwikSpeakExtract({
  supportedLangs: supportedLangs,
  fallback: fallback
});
