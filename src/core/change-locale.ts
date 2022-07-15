import type { Locale, SpeakState } from './types';
import { getTranslation } from './utils';

/**
 * Change locale at runtime
 * @param changedLocale 
 * @param speakContext 
 */
export const changeLocale = async (changedLocale: Locale, speakContext: SpeakState): Promise<void> => {
    const { locale } = speakContext;
    const language = changedLocale.language;

    // Load translation data
    await getTranslation(language, speakContext);

    // Release locale & rerendering components
    Object.assign(locale, changedLocale);
};
