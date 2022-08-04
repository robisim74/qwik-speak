import { Translation } from '../library/types';

/* eslint-disable */
export const appTranslation: Translation = {
  "en-US": {
    "app": {
      "title": "Qwik Speak",
      "subtitle": "Translate your Qwik apps into any language",
      "changeLocale": "Change locale",
      "home": "Home",
      "page": "Page"
    }
  },
  "it-IT": {
    "app": {
      "title": "Qwik Speak",
      "subtitle": "Traduci le tue app Qwik in qualsiasi lingua",
      "changeLocale": "Cambia località",
      "home": "Home",
      "page": "Pagina"
    }
  }
};

export const homeTranslation: Translation = {
  "en-US": {
    "home": {
      "title": "{{name}}",
      "description": "Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps",
      "greeting": "Hi! I am {{name}}",
      "text": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
    }
  },
  "it-IT": {
    "home": {
      "title": "{{name}}",
      "description": "Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik",
      "greeting": "Ciao! Sono {{name}}",
      "text": "<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>"
    }
  }
};

export const pageTranslation: Translation = {
  "en-US": {
    "page": {
      "title": "Page - {{name}}",
      "description": "I'm another page",
      "text": "I'm a fallback text"
    }
  },
  "it-IT": {
    "page": {
      "title": "Pagina - {{name}}",
      "description": "Io sono un'altra pagina"
    }
  }
};
