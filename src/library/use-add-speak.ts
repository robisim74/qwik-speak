import { useMount$ } from '@builder.io/qwik';

import type { SpeakState, Translation } from './types';
import { useSpeakContext } from './use-functions';
import { loadTranslation, mergeDeep } from './core';
import { qDev } from './utils';

/**
 * Add translation data to a Speak context
 * @param assets Assets to be loaded or translation data
 * @param ctx Optional Speak context
 */
export const useAddSpeak = (assets: Array<string | Translation>, ctx?: SpeakState): void => {
  ctx = ctx ?? useSpeakContext();

  const { locale, translation, config } = ctx;

  // Will block the rendering until callback resolves
  useMount$(async () => {
    if (!ctx) return;

    // Load translation data
    const newTranslation = await loadTranslation(locale.lang, ctx, assets);

    // Merge data
    const data = mergeDeep(translation[locale.lang], newTranslation[locale.lang]);
    // Concat assets
    const loadedAssets = config.assets.concat(assets);

    // Update state
    Object.assign(config.assets, loadedAssets);
    Object.assign(translation[locale.lang], data);

    if (qDev) {
      console.debug('Qwik Add Speak', '', 'Translation loaded');
    }
  });
};
