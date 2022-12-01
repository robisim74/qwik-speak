// Types
export type {
  SpeakLocale,
  Translation,
  TranslateFn,
  SpeakConfig,
  SpeakState,
  InternalSpeakState,
} from './library/types';
export type {
  LoadTranslationFn,
  ResolveLocaleFn,
  StoreLocaleFn
} from './library/types';
export type { QwikSpeakProps } from './library/qwik-speak';
export type { SpeakProps } from './library/speak';
// Components
export { QwikSpeak } from './library/qwik-speak';
export { Speak } from './library/speak';
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
  useTranslation,
  useSpeakConfig,
} from './library/use-functions';
// Inline functions
export {
  $lang,
  $rule,
} from './library/inline-functions';
