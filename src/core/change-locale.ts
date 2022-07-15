import type { Locale, SpeakState } from './types';
import { getTranslation } from './utils';

/**
 * Change locale at runtime
 * @param changedLocale 
 * @param speakContext 
 */
export const changeLocale = async (changedLocale: Locale, speakContext: SpeakState): Promise<void> => {
    const { locale } = speakContext;

    // Load translation data
    await getTranslation(changedLocale, speakContext);

    // Release locale & rerendering components
    Object.assign(locale, changedLocale);
};
