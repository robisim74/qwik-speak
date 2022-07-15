import { useContext } from '@builder.io/qwik';

import { SpeakContext } from './constants';
import { SpeakState } from './types';

export const translate = (key: string, speakContext?: SpeakState, language?: string): string => {
    speakContext = speakContext ?? useContext(SpeakContext);
    const { locale, translation, config } = speakContext;
    language = language ?? locale.language!;

    if (translation[language] && translation[language][key]) {
        return translation[language][key];
    }

    return 'Not found';
}