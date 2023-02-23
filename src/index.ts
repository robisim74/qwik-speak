// Types
export type {
  SpeakLocale,
  Translation,
  TranslationFn,
  SpeakConfig,
  SpeakState,
  LoadTranslationFn,
} from './library/types';
export type { QwikSpeakProps } from './library/qwik-speak-component';
export type { SpeakProps } from './library/speak-component';
// Components
export { QwikSpeakProvider } from './library/qwik-speak-component';
export { Speak } from './library/speak-component';
// Functions
export { $translate } from './library/translate';
export { $plural } from './library/plural';
export { formatNumber } from './library/format-number';
export { formatDate } from './library/format-date';
export { relativeTime } from './library/relative-time';
export { changeLocale } from './library/change-locale';
// Use functions
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './library/use-functions';
// Inline functions
export {
  $lang,
  $rule,
} from './library/inline-functions';
