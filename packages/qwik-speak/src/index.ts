// Types
export type {
  SpeakLocale,
  Translation,
  TranslationFn,
  SpeakConfig,
  SpeakState,
  LoadTranslationFn,
  RewriteRouteOption,
  DomainBasedRoutingOption
} from './types';
export type { QwikSpeakProps, QwikSpeakMockProps } from './use-qwik-speak';
export type { SpeakProps } from './use-speak';
export type { InlinePluralFn } from './inline-plural';
export type { InlineTranslateFn } from './inline-translate';
export type { FormatDateFn } from './use-format-date';
export type { FormatNumberFn } from './use-format-number';
export type { RelativeTimeFn } from './use-relative-time';
export type { DisplayNameFn } from './use-display-name';
export type { LocalizePathFn, TranslatePathFn } from './routing';
// Inline functions
export { inlineTranslate } from './inline-translate';
export { inlinePlural } from './inline-plural';
// Use functions
export { useQwikSpeak } from './use-qwik-speak';
export { useSpeak } from './use-speak';
export { useFormatNumber } from './use-format-number';
export { useFormatDate } from './use-format-date';
export { useRelativeTime } from './use-relative-time';
export { useDisplayName } from './use-display-name';
export {
  useSpeakContext,
  useSpeakLocale,
  useSpeakConfig,
} from './use-functions';
// Routing
export {
  localizePath,
  translatePath,
  validateLocale,
  extractFromDomain,
  extractFromUrl
} from './routing';
// Testing
export { QwikSpeakMockProvider } from './use-qwik-speak';
