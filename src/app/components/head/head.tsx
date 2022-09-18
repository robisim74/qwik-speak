import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { translate as t } from '../../../library/translate';

export const Head = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <head>
      <meta charSet="utf-8" />

      {/* Translate title */}
      <title>{t(head.title, { name: 'Qwik Speak' })}</title>

      <link rel="canonical" href={loc.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Translate description */}
      {head.meta.map((m) => (
        m.name === 'description' ? <meta name="description" content={t(m.content!)} /> : <meta {...m} />
      ))}

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.styles.map((s) => (
        <style {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </head>
  );
});
