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
export type { TranslateFn, TranslateQrl } from './use-translate';
export type { PluralFn } from './use-plural';
export type { InlineTranslateFn } from './inline-translate';
export type { FormatDateFn } from './use-format-date';
export type { FormatNumberFn } from './use-format-number';
export type { RelativeTimeFn } from './use-relative-time';
export type { DisplayNameFn } from './use-display-name';
// Components
export { QwikSpeakProvider } from './qwik-speak-component';
export { Speak } from './speak-component';
// Functions
export { $translate } from './use-translate';
export { $plural } from './use-plural';
export { $inlineTranslate } from './inline-translate';
export { formatNumber } from './use-format-number';
export { formatDate } from './use-format-date';
export { relativeTime } from './use-relative-time';
export { displayName } from './use-display-name';
// Use functions
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './use-speak';
export { useTranslate$, useTranslateQrl } from './use-translate';
