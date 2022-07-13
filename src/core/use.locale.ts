import type { Locale, TranslationState } from './types';
import { getTranslation } from './utils';

/**
 * Change locale at runtime
 * @param changedLocale 
 * @param translationContext 
 */
export const useLocale = async (changedLocale: Locale, translationContext: TranslationState): Promise<void> => {
    const { locale, translation, config } = translationContext;
    const language = changedLocale.language;

    // Load translation data
    await getTranslation(language, config, translation);

    // Release locale & rerendering components
    locale.language = changedLocale.language;
};