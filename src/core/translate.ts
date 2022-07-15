import { useContext } from '@builder.io/qwik';

import { TranslateContext } from './constants';
import { TranslateState } from './types';

export const translate = (key: string, translateContext?: TranslateState, language?: string): string => {
    translateContext = translateContext ?? useContext(TranslateContext);
    const { locale, translation, config } = translateContext;
    language = language ?? locale.language!;

    if (translation[language] && translation[language][key]) {
        return translation[language][key];
    }

    return 'Not found';
}