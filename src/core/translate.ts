import { useContext } from '@builder.io/qwik';

import { TranslateContext } from './constants';

export const translate = (key: string, language?: string): string => {
    const { locale, translation, config } = useContext(TranslateContext);
    language = language ?? locale.language!;

    if (translation[language] && translation[language][key]) {
        return translation[language][key];
    }

    return 'Not found';
}