/* eslint-disable */
export const mockCode = `import { Fragment as _Fragment } from "@builder.io/qwik/jsx-runtime";
import { jsx as _jsx } from "@builder.io/qwik/jsx-runtime";
import { jsxs as _jsxs } from "@builder.io/qwik/jsx-runtime";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { $plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
import { relativeTime as rt } from "qwik-speak";
import { $translate as t } from "qwik-speak";
import { useSpeakLocale } from "qwik-speak";
import { useStore } from "@builder.io/qwik";
export const s_xJBzwgVGKaQ = ()=>{
    const units = useSpeakLocale().units;
    const state = useStore({
        count: 0
    });
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx("h1", {
                children: t('app.title')
            }),
            /*#__PURE__*/ _jsx("h2", {
                children: t('app.subtitle')
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: t('home.params')
            }),
            /*#__PURE__*/ _jsx("p", {
                children: t('home.greeting', {
                    name: 'Qwik Speak'
                })
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: t('home.tags')
            }),
            /*#__PURE__*/ _jsx("p", {
                dangerouslySetInnerHTML: t('home.text')
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: t('home.plural')
            }),
            /*#__PURE__*/ _jsx("button", {
                onClick$: qrl(()=>import("./entry_Home.js"), "s_d7QwW4Vfl2A", [
                    state
                ]),
                children: t('home.increment')
            }),
            /*#__PURE__*/ _jsx("p", {
                children: p(state.count, 'home.devs')
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: t('home.dates')
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fd(Date.now(), {
                    dateStyle: 'full',
                    timeStyle: 'short'
                })
            }),
            /*#__PURE__*/ _jsx("p", {
                children: rt(-1, 'second')
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: t('home.numbers')
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fn(1000000)
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fn(1000000, {
                    style: 'currency'
                })
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fn(1, {
                    style: 'unit',
                    unit: units['length']
                })
            })
        ]
    });
};`;

export const inlinedCode = `import { $lang } from "qwik-speak";
import { $rule } from "qwik-speak";
import { Fragment as _Fragment } from "@builder.io/qwik/jsx-runtime";
import { jsx as _jsx } from "@builder.io/qwik/jsx-runtime";
import { jsxs as _jsxs } from "@builder.io/qwik/jsx-runtime";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { $plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
import { relativeTime as rt } from "qwik-speak";
import { $translate as t } from "qwik-speak";
import { useSpeakLocale } from "qwik-speak";
import { useStore } from "@builder.io/qwik";
export const s_xJBzwgVGKaQ = ()=>{
    const units = useSpeakLocale().units;
    const state = useStore({
        count: 0
    });
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx("h1", {
                children: $lang(\`it-IT\`) && \`Qwik Speak\` || \`Qwik Speak\`
            }),
            /*#__PURE__*/ _jsx("h2", {
                children: $lang(\`it-IT\`) && \`Traduci le tue app Qwik in qualsiasi lingua\` || \`Translate your Qwik apps into any language\`
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang(\`it-IT\`) && \`Parametri\` || \`Parameters\`
            }),
            /*#__PURE__*/ _jsx("p", {
                children: $lang(\`it-IT\`) && \`Ciao! Sono \${'Qwik Speak'}\` || \`Hi! I am \${'Qwik Speak'}\`
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang(\`it-IT\`) && \`Tag Html\` || \`Html tags\`
            }),
            /*#__PURE__*/ _jsx("p", {
                dangerouslySetInnerHTML: $lang(\`it-IT\`) && \`<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>\` || \`<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>\`
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang(\`it-IT\`) && \`Plurale\` || \`Plural\`
            }),
            /*#__PURE__*/ _jsx("button", {
                onClick$: qrl(()=>import("./entry_Home.js"), "s_d7QwW4Vfl2A", [
                    state
                ]),
                children: $lang(\`it-IT\`) && \`Incrementa\` || \`Increment\`
            }),
            /*#__PURE__*/ _jsx("p", {
                children: $lang(\`it-IT\`) && ($rule(\`it-IT\`, state.count, \`other\`) && 
            \`\${state.count} sviluppatori software\` || \`\${state.count} sviluppatore software\`) || ($rule(\`en-US\`, state.count, \`other\`) && 
            \`\${state.count} software developers\` || \`\${state.count} software developer\`)
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang(\`it-IT\`) && \`Date e tempo relativo\` || \`Dates & relative time\`
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fd(Date.now(), {
                    dateStyle: 'full',
                    timeStyle: 'short'
                })
            }),
            /*#__PURE__*/ _jsx("p", {
                children: rt(-1, 'second')
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang(\`it-IT\`) && \`Numeri e valute\` || \`Numbers & currencies\`
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fn(1000000)
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fn(1000000, {
                    style: 'currency'
                })
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fn(1, {
                    style: 'unit',
                    unit: units['length']
                })
            })
        ]
    });
};`;

export const mockSource = `import { component$, useStore } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import {
  $translate as t,
  $plural as p,
  formatDate as fd,
  formatNumber as fn,
  relativeTime as rt,
  Speak,
  useSpeakLocale
} from 'qwik-speak';

export const Home = component$(() => {
  const units = useSpeakLocale().units!;

  const state = useStore({ count: 0 });

  const tArray = t<string[]>('home.array@@["one", "two"]');
  const item = t('home.array.2@@three');
  const tObject = t<Translation>('home.obj@@{"one": "1", "two": "2"}');
  const tArrayObjects = t<Translation[]>('home.arrayObjects@@[{"one": "1", "two": "2"}]');
  
  return (
    <>
      <h1>{t('app.title@@Qwik Speak')}</h1>
      <h2>{t('app.subtitle@@Translate your Qwik apps into any language')}</h2>

      <h3>{t('home.params')}</h3>
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('home.tags')}</h3>
      <p dangerouslySetInnerHTML={t('home.text')}></p>

      <h3>{t('home.plural')}</h3>
      <button onClick$={() => state.count++}>{t('home.increment')}</button>
      <p>{p(state.count, 'home.devs')}</p>

      <h3>{t('home.dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p>{rt(-1, 'second')}</p>

      <h3>{t('home.numbers')}</h3>
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: units['length'] })}</p>
    </>
  );
});

export default component$(() => {
  return (
    /**
     * Add Home translation (only available in child components)
     */
    <Speak assets={['home']}>
      <Home />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'runtime.head.home.title',
  meta: [{ name: 'description', content: 'runtime.head.home.description' }]
};`;

export const mockAsset = JSON.stringify({
  "home": {
    "dates": "Dates & relative time",
    "greeting": "Hi! I am {{name}}",
    "increment": "Increment",
    "numbers": "Numbers & currencies",
    "plural": "Plural",
    "tags": "Html tags",
    "text": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
  }
}, null, 2);
