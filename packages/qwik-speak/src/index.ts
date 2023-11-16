// Types
export type {
  SpeakLocale,
  Translation,
  TranslationFn,
  SpeakConfig,
  SpeakState,
  LoadTranslationFn,
  RewriteRouteOption
} from './types';
export type { QwikSpeakProps } from './qwik-speak-component';
export type { SpeakProps } from './speak-component';
export type { TranslateFn } from './use-translate';
export type { TranslatePathFn } from './use-translate-path';
export type { InlinePluralFn as PluralFn } from './inline-plural';
export type { InlineTranslateFn } from './inline-translate';
export type { FormatDateFn } from './use-format-date';
export type { FormatNumberFn } from './use-format-number';
export type { RelativeTimeFn } from './use-relative-time';
export type { DisplayNameFn } from './use-display-name';
// Components
export { QwikSpeakProvider } from './qwik-speak-component';
export { QwikSpeakInline } from './qwik-speak-inline-component';
export { Speak } from './speak-component';
// Inline functions
export { t } from './inline-translate';
export { p } from './inline-plural';

export { useTranslate } from './use-translate';
export { useTranslatePath } from './use-translate-path';
export { useFormatNumber } from './use-format-number';
export { useFormatDate } from './use-format-date';
export { useRelativeTime } from './use-relative-time';
export { useDisplayName } from './use-display-name';

// Use functions
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './use-functions';
