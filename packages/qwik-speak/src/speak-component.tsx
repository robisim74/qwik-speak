import { component$, Slot, useServerData, useTask$ } from '@builder.io/qwik';
import { isDev, isServer } from '@builder.io/qwik/build';

import { useSpeakContext } from './use-functions';
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

  // Get URL object
  const urlEnv = useServerData<string>('url');
  const url = isServer && urlEnv ? new URL(urlEnv) : null;

  // Called the first time when the component mounts
  useTask$(async () => {
    if (isDev && !props.assets && !props.runtimeAssets) logWarn('Speak component: no assets provided');

    await loadTranslations(ctx, props.assets, props.runtimeAssets, props.langs, url?.origin);
  });

  return <Slot />;
});
