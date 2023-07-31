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
export type { PluralFn } from './use-plural';
export type { InlineTranslateFn } from './inline-translate';
export type { FormatDateFn } from './use-format-date';
export type { FormatNumberFn } from './use-format-number';
export type { RelativeTimeFn } from './use-relative-time';
export type { DisplayNameFn } from './use-display-name';
// Components
export { QwikSpeakProvider } from './qwik-speak-component';
export { Speak } from './speak-component';
export { QwikSpeakInline } from './qwik-speak-inline-component';
// Functions
export { inlineTranslate } from './inline-translate';
// Use functions
export { useTranslate } from './use-translate';
export { usePlural } from './use-plural';
export { useFormatNumber } from './use-format-number';
export { useFormatDate } from './use-format-date';
export { useRelativeTime } from './use-relative-time';
export { useDisplayName } from './use-display-name';
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './use-speak';
