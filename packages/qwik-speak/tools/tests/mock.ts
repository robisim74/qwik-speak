/* eslint-disable */
export const mockCode = `import { Fragment as _Fragment } from "@builder.io/qwik/jsx-runtime";
import { _jsxC } from "@builder.io/qwik";
import { _jsxQ } from "@builder.io/qwik";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { $plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
import { relativeTime as rt } from "qwik-speak";
import { $translate as t } from "qwik-speak";
import { useSignal } from "@builder.io/qwik";
import { useSpeakLocale } from "qwik-speak";
export const s_dYGb4b0cyCA = ()=>{
    const units = useSpeakLocale().units;
    const count = useSignal(0);
    return /*#__PURE__*/ _jsxC(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxQ("h1", null, null, t('app.title'), 1, null),
            /*#__PURE__*/ _jsxQ("h2", null, null, t('app.subtitle'), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, t('home.params'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, t('home.greeting', {
                name: 'Qwik Speak'
            }), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, t('home.tags'), 1, null),
            /*#__PURE__*/ _jsxQ("p", {
                dangerouslySetInnerHTML: t('home.text')
            }, null, null, 3, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, t('home.plural'), 1, null),
            /*#__PURE__*/ _jsxQ("button", null, {
                class: "btn-counter",
                onClick$: /*#__PURE__*/ qrl(()=>import("./entry_Home.js"), "s_wpNYQJTE9ZU", [
                    count
                ])
            }, t('home.increment'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, {
                class: "counter"
            }, p(count.value, 'home.devs'), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, t('home.dates'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fd(Date.now(), {
                dateStyle: 'full',
                timeStyle: 'short'
            }), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, rt(-1, 'second'), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, t('home.numbers'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000, {
                style: 'currency'
            }), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fn(1, {
                style: 'unit',
                unit: units['length']
            }), 1, null)
        ]
    }, 1, "1L_0");
};`;

export const transformedCode = `import { Fragment as _Fragment } from "@builder.io/qwik/jsx-runtime";
import { _jsxC } from "@builder.io/qwik";
import { _jsxQ } from "@builder.io/qwik";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { $plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
import { relativeTime as rt } from "qwik-speak";
import { $translate as t } from "qwik-speak";
import { useSignal } from "@builder.io/qwik";
import { useSpeakLocale } from "qwik-speak";
export const s_dYGb4b0cyCA = ()=>{
    const units = useSpeakLocale().units;
    const count = useSignal(0);
    return /*#__PURE__*/ _jsxC(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxQ("h1", null, null, __qsInline('app.title'), 1, null),
            /*#__PURE__*/ _jsxQ("h2", null, null, __qsInline('app.subtitle'), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, __qsInline('home.params'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, __qsInline('home.greeting', {
                name: 'Qwik Speak'
            }), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, __qsInline('home.tags'), 1, null),
            /*#__PURE__*/ _jsxQ("p", {
                dangerouslySetInnerHTML: __qsInline('home.text')
            }, null, null, 3, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, __qsInline('home.plural'), 1, null),
            /*#__PURE__*/ _jsxQ("button", null, {
                class: "btn-counter",
                onClick$: /*#__PURE__*/ qrl(()=>import("./entry_Home.js"), "s_wpNYQJTE9ZU", [
                    count
                ])
            }, __qsInline('home.increment'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, {
                class: "counter"
            }, __qsInlinePlural(count.value, 'home.devs'), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, __qsInline('home.dates'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fd(Date.now(), {
                dateStyle: 'full',
                timeStyle: 'short'
            }), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, rt(-1, 'second'), 1, null),
            /*#__PURE__*/ _jsxQ("h3", null, null, __qsInline('home.numbers'), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000, {
                style: 'currency'
            }), 1, null),
            /*#__PURE__*/ _jsxQ("p", null, null, fn(1, {
                style: 'unit',
                unit: units['length']
            }), 1, null)
        ]
    }, 1, "1L_0");
};`;

export const mockChunkCode = `const s_dYGb4b0cyCA = () => {
    const units = useSpeakLocale().units;
    const count = il(0);
    return /* @__PURE__ */ mr(Sr, {
      children: [
        /* @__PURE__ */ pr("h1", null, null, __qsInline('app.title'), 1, null),
        /* @__PURE__ */ pr("h2", null, null, __qsInline('app.subtitle'), 1, null),
        /* @__PURE__ */ pr("h3", null, null, __qsInline('home.params'), 1, null),
        /* @__PURE__ */ pr("p", null, null, __qsInline('home.greeting', {
            name: 'Qwik Speak'
        }), 1, null),
        /* @__PURE__ */ pr("h3", null, null, __qsInline('home.tags'), 1, null),
        /* @__PURE__ */ pr("p", {
          dangerouslySetInnerHTML: __qsInline('home.text')
        }, null, null, 3, null),
        /* @__PURE__ */ pr("h3", null, null, __qsInline('home.plural'), 1, null),
        /* @__PURE__ */ pr("button", null, {
          class: "btn-counter",
          onClick$: /* @__PURE__ */ K(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), true ? void 0 : void 0), "s_wpNYQJTE9ZU", [
            count
          ])
        }, __qsInline('home.increment'), 1, null),
        /* @__PURE__ */ pr("p", null, {
          class: "counter"
        }, __qsInlinePlural(count.value, 'home.devs'), 1, null),
        /* @__PURE__ */ pr("h3", null, null, __qsInline('home.dates'), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatDate(Date.now(), {
          dateStyle: "full",
          timeStyle: "short"
        }), 1, null),
        /* @__PURE__ */ pr("p", null, null, relativeTime(-1, "second"), 1, null),
        /* @__PURE__ */ pr("h3", null, null, __qsInline('home.numbers'), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1e6), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1e6, {
          style: "currency"
        }), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1, {
          style: "unit",
          unit: units["length"]
        }), 1, null)
      ]
    }, 1, "1L_0");
  };`;

export const inlinedCode = `const s_dYGb4b0cyCA = () => {
    const units = useSpeakLocale().units;
    const count = il(0);
    return /* @__PURE__ */ mr(Sr, {
      children: [
        /* @__PURE__ */ pr("h1", null, null, \`Qwik Speak\`, 1, null),
        /* @__PURE__ */ pr("h2", null, null, \`Translate your Qwik apps into any language\`, 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Parameters\`, 1, null),
        /* @__PURE__ */ pr("p", null, null, \`Hi! I am Qwik Speak\`, 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Html tags\`, 1, null),
        /* @__PURE__ */ pr("p", {
          dangerouslySetInnerHTML: \`<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>\`
        }, null, null, 3, null),
        /* @__PURE__ */ pr("h3", null, null, \`Plural\`, 1, null),
        /* @__PURE__ */ pr("button", null, {
          class: "btn-counter",
          onClick$: /* @__PURE__ */ K(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), true ? void 0 : void 0), "s_wpNYQJTE9ZU", [
            count
          ])
        }, \`Increment\`, 1, null),
        /* @__PURE__ */ pr("p", null, {
          class: "counter"
        }, (new Intl.PluralRules(\`en-US\`).select(+count.value) === \`other\` && \`\${count.value} software developers\` || \`\${count.value} software developer\`), 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Dates & relative time\`, 1, null),
        /* @__PURE__ */ pr("p", null, null, formatDate(Date.now(), {
          dateStyle: "full",
          timeStyle: "short"
        }), 1, null),
        /* @__PURE__ */ pr("p", null, null, relativeTime(-1, "second"), 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Numbers & currencies\`, 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1e6), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1e6, {
          style: "currency"
        }), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1, {
          style: "unit",
          unit: units["length"]
        }), 1, null)
      ]
    }, 1, "1L_0");
  };`;

export const inlinedCodeByLang = `const s_dYGb4b0cyCA = () => {
    const units = useSpeakLocale().units;
    const count = il(0);
    return /* @__PURE__ */ mr(Sr, {
      children: [
        /* @__PURE__ */ pr("h1", null, null, \`Qwik Speak\`, 1, null),
        /* @__PURE__ */ pr("h2", null, null, \`Traduci le tue app Qwik in qualsiasi lingua\`, 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Parametri\`, 1, null),
        /* @__PURE__ */ pr("p", null, null, \`Ciao! Sono Qwik Speak\`, 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Tag Html\`, 1, null),
        /* @__PURE__ */ pr("p", {
          dangerouslySetInnerHTML: \`<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>\`
        }, null, null, 3, null),
        /* @__PURE__ */ pr("h3", null, null, \`Plurale\`, 1, null),
        /* @__PURE__ */ pr("button", null, {
          class: "btn-counter",
          onClick$: /* @__PURE__ */ K(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), true ? void 0 : void 0), "s_wpNYQJTE9ZU", [
            count
          ])
        }, \`Incrementa\`, 1, null),
        /* @__PURE__ */ pr("p", null, {
          class: "counter"
        }, (new Intl.PluralRules(\`it-IT\`).select(+count.value) === \`other\` && \`\${count.value} sviluppatori software\` || \`\${count.value} sviluppatore software\`), 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Date e tempo relativo\`, 1, null),
        /* @__PURE__ */ pr("p", null, null, formatDate(Date.now(), {
          dateStyle: "full",
          timeStyle: "short"
        }), 1, null),
        /* @__PURE__ */ pr("p", null, null, relativeTime(-1, "second"), 1, null),
        /* @__PURE__ */ pr("h3", null, null, \`Numeri e valute\`, 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1e6), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1e6, {
          style: "currency"
        }), 1, null),
        /* @__PURE__ */ pr("p", null, null, formatNumber(1, {
          style: "unit",
          unit: units["length"]
        }), 1, null)
      ]
    }, 1, "1L_0");
  };`;


export const mockSource = `import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
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

  const count = useSignal(0);

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
      <button class="btn-counter" onClick$={() => count.value++}>{t('home.increment')}</button>
      <p class="counter">{p(count.value, 'home.devs')}</p>

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
     * Add Home translations (only available in child components)
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
