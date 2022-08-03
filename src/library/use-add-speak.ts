import { useMount$ } from '@builder.io/qwik';

import type { InternalSpeakState, Translation } from './types';
import { useSpeakContext } from './use-functions';
import { addData, loadTranslation } from './core';
import { qDev } from './utils';

/**
 * Add translation data to a Speak context
 * @param assets Assets to be loaded or translation data
 */
export const useAddSpeak = (assets: Array<string | Translation>): void => {
  const ctx = useSpeakContext();
  const { locale, translation, config } = ctx;

  // Will block the rendering until callback resolves
  useMount$(async () => {
    // Load translation data
    const newTranslation = await loadTranslation(locale.lang, ctx, assets);
    // Add data
    addData(newTranslation, translation[locale.lang], locale.lang);
    // Concat assets
    const loadedAssets = config.assets.concat(assets);

    // Update state
    Object.assign(config.assets, loadedAssets);
    Object.assign(translation[locale.lang], newTranslation[locale.lang]);
    // Change of state
    (<InternalSpeakState>ctx).$flags$ += 1;

    if (qDev) {
      console.debug('Qwik Add Speak', '', 'Translation loaded');
    }
  });
};
