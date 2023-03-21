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
// Use functions
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './use-functions';
