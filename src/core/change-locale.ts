import type { Locale, TranslateState } from './types';
import { getTranslation } from './utils';

/**
 * Change locale at runtime
 * @param changedLocale 
 * @param translateContext 
 */
export const changeLocale = async (changedLocale: Locale, translateContext: TranslateState): Promise<void> => {
    const { locale } = translateContext;
    const language = changedLocale.language;

    // Load translation data
    await getTranslation(language, translateContext);

    // Release locale & rerendering components
    Object.assign(locale, changedLocale);
};