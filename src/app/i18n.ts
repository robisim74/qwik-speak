import { Translation } from '../library/types';

export const appTranslation: Translation = {
    "en-US": {
        "app": {
            "title": "Qwik Speak",
            "subtitle": "Make your Qwik app speak any language",
            "changeLocale": "Change locale"
        }
    },
    "it-IT": {
        "app": {
            "title": "Qwik Speak",
            "subtitle": "Fai parlare alla tua app Qwik qualsiasi lingua",
            "changeLocale": "Cambia località"
        }
    }
};

export const homeTranslation: Translation = {
    "en-US": {
        "home": {
            "greeting": "Hi! I am {{name}}",
            "description": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
        }
    },
    "it-IT": {
        "home": {
            "greeting": "Ciao! Sono {{name}}",
            "description": "<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>"
        }
    }
};

export const lazyTranslation: Translation = {
    "en-US": {
        "lazy": {
            "subtitle": "I'm a lazy component"
        }
    },
    "it-IT": {
        "lazy": {
            "subtitle": "Sono un componente pigro"
        }
    }
};
