import { component$, Slot, useMount$ } from '@builder.io/qwik';

import type { Translation } from './types';
import { useSpeakContext } from './use-functions';
import { loadTranslation, addData } from './core';
import { qDev } from './utils';

export interface SpeakProps {
  /**
   * Assets to be loaded or translation data
   */
  assets: Array<string | Translation>;
  /**
   * Optional additional languages to preload data for
   */
  langs?: string[];
}

/**
 * Add translation data to a Speak context
 */
export const Speak = component$((props: SpeakProps) => {
  const ctx = useSpeakContext();
  const { locale, translation, config } = ctx;

  // Will block the rendering until callback resolves
  useMount$(async () => {
    const resolvedLangs = new Set(props.langs || []);
    resolvedLangs.add(locale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const newTranslation = await loadTranslation(lang, ctx, props.assets);
      addData(newTranslation, translation[lang], lang);
      Object.assign(translation[lang], newTranslation[lang]);
    }

    const resolvedAssets = new Set(config.assets);
    for (const asset of props.assets) {
      resolvedAssets.add(asset);
    }
    Object.assign(config.assets, Array.from(resolvedAssets));

    if (qDev) {
      console.debug('Qwik Add Speak', '', 'Translation loaded');
    }
  });

  return <Slot />
}, { tagName: 'speak' });