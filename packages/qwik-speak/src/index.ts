// Types
export type {
  SpeakLocale,
  Translation,
  TranslationFn,
  SpeakConfig,
  SpeakState,
  LoadTranslationFn,
} from './types';
export type { QwikSpeakProps } from './qwik-speak-component';
export type { SpeakProps } from './speak-component';
// Components
export { QwikSpeakProvider } from './qwik-speak-component';
export { Speak } from './speak-component';
// Functions
export { $translate } from './translate';
export { $plural } from './plural';
export { formatNumber } from './format-number';
export { formatDate } from './format-date';
export { relativeTime } from './relative-time';
export { changeLocale } from './change-locale';
// Use functions
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './use-functions';
// Inline functions
export {
  $lang,
  $rule,
} from './inline-functions';
