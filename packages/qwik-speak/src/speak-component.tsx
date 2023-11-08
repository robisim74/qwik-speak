import { component$, Slot, useTask$ } from '@builder.io/qwik';
import { isDev } from '@builder.io/qwik/build';

import { useSpeakContext } from './use-speak';
import { loadTranslations } from './core';
import { logWarn } from './log';

export interface SpeakProps {
  /**
   * Assets to load
   */
  assets?: string[];
  /**
   * Assets to load available at runtime
   */
  runtimeAssets?: string[];
  /**
   * Optional additional languages to preload data for (multilingual)
   */
  langs?: string[];
}

/**
 * Add scoped translation data to the context
 */
export const Speak = component$((props: SpeakProps) => {
  const ctx = useSpeakContext();

  const { config } = ctx;

  // Called the first time when the component mounts
  useTask$(async () => {
    if (isDev) {
      if (!props.assets && !props.runtimeAssets) logWarn('Speak component: no assets provided');
      const duplicateAsset = config.assets?.find(asset => props.assets?.includes(asset));
      if (duplicateAsset) {
        logWarn(`Speak component: duplicate assets '${duplicateAsset}'`);
      }
      const duplicateRuntimeAsset = config.runtimeAssets?.find(asset => props.runtimeAssets?.includes(asset));
      if (duplicateRuntimeAsset) {
        logWarn(`Speak component: duplicate runtimeAssets '${duplicateRuntimeAsset}'`);
      }
    }

    await loadTranslations(ctx, props.assets, props.runtimeAssets, props.langs);
  });

  return <Slot />;
});
