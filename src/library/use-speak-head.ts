import { useDocument } from '@builder.io/qwik';

import { useSpeakLocale } from './use-functions';
import { translate as t } from './translate';

/**
 * Set html lang, and translate head title and description
 */
export const useSpeakHead = (title?: string, description?: string, params?: any): void => {
  const locale = useSpeakLocale();
  const doc = useDocument();

  // Set html lang
  doc.documentElement.lang = locale.lang;
  // Translate title
  if (title) {
    doc.title = t(title, params);
  }
  // Translate description
  if (description) {
    let meta = doc.head.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (meta) {
      doc.head.removeChild(meta);
    }
    meta = doc.createElement('meta');
    meta.name = 'description';
    meta.content = t(description, params);
    doc.head.appendChild(meta)
  }
};
