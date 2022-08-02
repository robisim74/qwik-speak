import { useContext, $ } from '@builder.io/qwik';

import type { SpeakLocale, SpeakConfig, Translation, SpeakState } from './types';
import { SpeakContext } from './context';
import { changeLocale } from './change-locale';
import { translate } from './translate';
import { formatNumber } from './format-number';
import { formatDate } from './format-date';

export const useSpeakContext = (): SpeakState => useContext(SpeakContext);

export const useSpeakLocale = (): SpeakLocale => <SpeakLocale>useContext(SpeakContext).locale;

export const useTranslation = (): Translation => useContext(SpeakContext).translation;

export const useSpeakConfig = (): SpeakConfig => useContext(SpeakContext).config;

export const useChangeLocale = () => {
  return {
    changeLocale$: $(changeLocale),
    ctx: useContext(SpeakContext)
  }
};

export const useTranslate = () => {
  return {
    translate: translate,
    ctx: useContext(SpeakContext)
  }
};

export const useFormatNumber = () => {
  return {
    formatNumber: formatNumber,
    locale: useSpeakLocale()
  }
};

export const useFormatDate = () => {
  return {
    formatDate: formatDate,
    locale: useSpeakLocale()
  }
};
