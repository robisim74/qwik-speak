import { useContext, $ } from '@builder.io/qwik';

import type { Locale, SpeakConfig, Translation } from './types';
import { SpeakContext } from './constants';
import { changeLocale } from './change-locale';
import { translate } from './translate';
import { formatNumber } from './format-number';
import { formatDate } from './format-date';

export const useLocale = (): Partial<Locale> => useContext(SpeakContext).locale;

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
        ctx: useContext(SpeakContext)
    }
};

export const useFormatDate = () => {
    return {
        formatDate$: formatDate,
        ctx: useContext(SpeakContext)
    }
};
