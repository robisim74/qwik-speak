import type { RequestHandler } from '@builder.io/qwik-city';
import { Translation } from '~/library/types';

export const onGet: RequestHandler = ({ params }) => {
  return { [params.asset]: i18n[params.lang][params.asset] };
};

export const i18n: Translation = {
  'en-US': {
    'app': {
      'title': 'Qwik Speak',
      'subtitle': 'Translate your Qwik apps into any language',
      'changeLocale': 'Change locale',
      'nav': {
        'home': 'Home',
        'page': 'Page'
      },
      'home': {
        'title': '{{name}}',
        'description': 'Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps'
      },
      'page': {
        'title': 'Page - {{name}}',
        'description': "I'm another page"
      }
    },
    'home': {
      'greeting': 'Hi! I am {{name}}',
      'text': '<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>'
    },
    'page': {
      'text': "I'm a fallback text"
    }
  },
  'it-IT': {
    'app': {
      'title': 'Qwik Speak',
      'subtitle': 'Traduci le tue app Qwik in qualsiasi lingua',
      'changeLocale': 'Cambia località',
      'nav': {
        'home': 'Home',
        'page': 'Pagina'
      },
      'home': {
        'title': '{{name}}',
        'description': 'Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik'
      },
      'page': {
        'title': 'Pagina - {{name}}',
        'description': "Io sono un'altra pagina"
      }
    },
    'home': {
      'greeting': 'Ciao! Sono {{name}}',
      'text': '<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>'
    },
    'page': {}
  }
};
