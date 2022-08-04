import { useMount$ } from '@builder.io/qwik';

import type { InternalSpeakState, Translation } from './types';
import { useSpeakContext } from './use-functions';
import { addData, loadTranslation } from './core';
import { qDev } from './utils';

/**
 * Add translation data to a Speak context
 * @param assets Assets to be loaded or translation data
 * @param langs Optional additional languages to preload data for
 */
export const useAddSpeak = (assets: Array<string | Translation>, langs: string[] = []): void => {
  const ctx = useSpeakContext();
  const { locale, translation, config } = ctx;

  // Will block the rendering until callback resolves
  useMount$(async () => {
    const resolvedLangs = new Set(langs);
    resolvedLangs.add(locale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const newTranslation = await loadTranslation(lang, ctx, assets);
      addData(newTranslation, translation[lang], lang);
      Object.assign(translation[lang], newTranslation[lang]);
    }

    const resolvedAssets = new Set(config.assets);
    for (const asset of assets) {
      resolvedAssets.add(asset);
    }
    Object.assign(config.assets, Array.from(resolvedAssets));

    // Change of state
    (<InternalSpeakState>ctx).$flags$ += 1;

    if (qDev) {
      console.debug('Qwik Add Speak', '', 'Translation loaded');
    }
  });
};
