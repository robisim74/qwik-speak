import { useContext } from '@builder.io/qwik';

import { TranslationContext } from './constants';

export const useTranslate = (key: string, language?: string): string => {
    const { locale, translation, config } = useContext(TranslationContext);
    language = language ?? locale.language;

    if (translation[language] && translation[language][key]) {
        return translation[language][key];
    }

    return 'Not found';
}