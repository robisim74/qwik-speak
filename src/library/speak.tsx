import { component$, Slot, useEnvData, useTask$ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import { useSpeakContext } from './use-functions';
import { loadTranslations } from './core';

export interface SpeakProps {
  /**
   * Assets to load
   */
  assets: string[];
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
  const { locale } = ctx;

  // Get URL object
  const urlEnv = useEnvData<string>('url');
  const url = isServer && urlEnv ? new URL(urlEnv) : null;

  // Called the first time when the component mounts, and when lang changes
  useTask$(async ({ track }) => {
    track(() => locale.lang);

    // Load translations
    await loadTranslations(ctx, url?.origin, props.langs, props.assets);
  });

  return <Slot />;
});
