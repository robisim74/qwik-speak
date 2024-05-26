import { useTask$ } from '@builder.io/qwik';
import { isBrowser, isDev } from '@builder.io/qwik/build';

import { useSpeakContext } from './use-functions';
import { loadTranslations } from './load';
import { getSpeakContext } from './context';
import { logDebugInline, logWarn } from './log';

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
 * Add translation data to the context.
 * Translations will only be available in child components
 */
export const useSpeak = (props: SpeakProps) => {
  const ctx = useSpeakContext();

  const { config } = ctx;

  // Load translations
  useTask$(async () => {
    if (isDev) {
      if (!props.assets && !props.runtimeAssets) logWarn('useSpeak: no assets provided');
      const duplicateAsset = config.assets?.find(asset => props.assets?.includes(asset));
      if (duplicateAsset) {
        logWarn(`useSpeak: duplicate assets '${duplicateAsset}'`);
      }
      const duplicateRuntimeAsset = config.runtimeAssets?.find(asset => props.runtimeAssets?.includes(asset));
      if (duplicateRuntimeAsset) {
        logWarn(`useSpeak: duplicate runtimeAssets '${duplicateRuntimeAsset}'`);
      }
    }

    await loadTranslations(ctx, props.assets, props.runtimeAssets, props.langs);

    if (isDev && isBrowser) {
      const _speakContext = getSpeakContext();
      logDebugInline(config.showDebugMessagesLocally,  'Client context', _speakContext)
    }
  });
};
