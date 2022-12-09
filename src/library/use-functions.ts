import { useContext } from '@builder.io/qwik';

import type { SpeakLocale, SpeakConfig, SpeakState } from './types';
import { SpeakContext } from './context';

export const useSpeakContext = (): SpeakState => useContext(SpeakContext);

export const useSpeakLocale = (): SpeakLocale => useContext(SpeakContext).locale;

export const useSpeakConfig = (): SpeakConfig => useContext(SpeakContext).config;
