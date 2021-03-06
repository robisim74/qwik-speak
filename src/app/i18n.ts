import { Translation } from '../library/types';

export const appTranslation: Translation = {
    "en-US": {
        "app": {
            "title": "Qwik Speak",
            "subtitle": "Make your Qwik app speak any language",
            "changeLocale": "Change locale",
            "home": "Home",
            "page": "Page"
        }
    },
    "it-IT": {
        "app": {
            "title": "Qwik Speak",
            "subtitle": "Fai parlare alla tua app Qwik qualsiasi lingua",
            "changeLocale": "Cambia località",
            "home": "Home",
            "page": "Pagina"
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

export const pageTranslation: Translation = {
    "en-US": {
        "page": {
            "subtitle": "I'm another page"
        }
    },
    "it-IT": {
        "page": {
            "subtitle": "Io sono un'altra pagina"
        }
    }
};
