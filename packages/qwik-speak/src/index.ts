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
export type { TranslateFn } from './use-translate';
export type { PluralFn } from './plural';
export type { InlineTranslateFn } from './inline-translate';
export type { FormatDateFn } from './format-date';
export type { FormatNumberFn } from './format-number';
export type { RelativeTimeFn } from './relative-time';
export type { DisplayNameFn } from './display-name';
// Components
export { QwikSpeakProvider } from './qwik-speak-component';
export { Speak } from './speak-component';
// Functions
export { $translate } from './use-translate';
export { $plural } from './plural';
export { $inlineTranslate } from './inline-translate';
export { formatNumber } from './format-number';
export { formatDate } from './format-date';
export { relativeTime } from './relative-time';
export { displayName } from './display-name';
// Use functions
export { useTranslate } from './use-translate';
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './use-speak';

