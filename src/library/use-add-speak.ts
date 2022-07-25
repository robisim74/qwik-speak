import { useMount$, useContext } from '@builder.io/qwik';

import type { SpeakState, Translation } from './types';
import { SpeakContext } from './constants';
import { loadTranslation, mergeDeep, parseLanguage, qDev } from './utils';

/**
 * Add translation data to a Speak context
 * @param assets Assets to be loaded or translation data
 * @param ctx Optional Speak context
 * @returns The context
 */
export const useAddSpeak = (assets: Array<string | Translation>, ctx?: SpeakState): SpeakState => {
    ctx = ctx ?? useContext(SpeakContext);

    const { locale, translation, config } = ctx;

    // Will block the rendering until callback resolves
    useMount$(async () => {
        if (!ctx || !locale.language) return;

        const language = parseLanguage(locale.language, config.languageFormat);

        // Load translation data
        const newTranslation = await loadTranslation(locale, ctx, assets);

        // Merge data
        const data = mergeDeep(translation[language], newTranslation[language]);
        // Concat assets
        const loadedAssets = config.assets.concat(assets);

        // Update state
        Object.assign(config.assets, loadedAssets);
        Object.assign(translation[language], data);

        if (qDev) {
            console.debug('Qwik Add Speak', '', 'Translation loaded');
        }
    });

    return ctx;
};
