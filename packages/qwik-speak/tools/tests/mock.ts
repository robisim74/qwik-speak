/* eslint-disable */
export const mockSource = `import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import {
  $translate as t,
  $plural as p,
  $inlineTranslate,
  formatDate as fd,
  formatNumber as fn,
  relativeTime as rt,
  Speak,
  useSpeakLocale,
  useSpeakContext
} from 'qwik-speak';
import type { SpeakState, Translation } from 'qwik-speak';

export const TitleComponent = (props: { ctx: SpeakState }) => {
  return <h1>{$inlineTranslate('app.title', props.ctx)}</h1>;
};

export const Home = component$(() => {
  const ctx = useSpeakContext();
  const locale = useSpeakLocale();
  const units = locale.units!;

  const count = useSignal(0);

  const tParam = t('home.greeting', { name: t('app.title') });
  const tArray = t<string[]>('home.array@@["one", "two"]');
  const item = t('home.array.2@@three');
  const tObject = t<Translation>('home.obj@@{"one": "1", "two": "2"}');
  const tArrayObjects = t<Translation[]>('home.arrayObjects@@[{"num": "1"}, {"num": "2"}]');
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x['num']));

  return (
    <div class="content">
      <TitleComponent ctx={ctx} />
      <h2>{t('app.subtitle')}</h2>

      <h3>{t('home.params')}</h3>
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('home.tags')}</h3>
      <p dangerouslySetInnerHTML={t('home.text')}></p>

      <h3>{t('home.plural')}</h3>
      <p class="counter">{p(count.value, 'home.devs')}</p>
      <button class="btn-counter" onClick$={() => count.value++}>{t('home.increment')}</button>

      <h3>{t('home.dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p>{rt(-1, 'second')}</p>

      <h3>{t('home.numbers')}</h3>
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: units['length'] })}</p>
    </div>
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

export const mockCode = `import { TitleComponent } from "./routes/[...lang]/index.tsx";
import { _IMMUTABLE } from "@builder.io/qwik";
import { _jsxC } from "@builder.io/qwik";
import { _jsxQ } from "@builder.io/qwik";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { $plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
import { relativeTime as rt } from "qwik-speak";
import { $translate as t } from "qwik-speak";
import { useSignal } from "@builder.io/qwik";
import { useSpeakContext } from "qwik-speak";
import { useSpeakLocale } from "qwik-speak";
export const s_dYGb4b0cyCA = ()=>{
    const ctx = useSpeakContext();
    const locale = useSpeakLocale();
    const count = useSignal(0);
    const tParam = t('home.greeting', { name: t('app.title') });
    const tArray = t('home.array@@["one", "two"]');
    const item = t('home.array.2@@three');
    const tObject = t('home.obj@@{"one": "1", "two": "2"}');
    const tArrayObjects = t('home.arrayObjects@@[{"num": "1"}, {"num": "2"}]');
    console.log(tParam);
    tArray.map((x)=>console.log(x));
    console.log(item);
    Object.values(tObject).map((x)=>console.log(x));
    tArrayObjects.map((x)=>console.log(x['num']));
    return /*#__PURE__*/ _jsxQ("div", null, {
        class: "content"
    }, [
        /*#__PURE__*/ _jsxC(TitleComponent, {
            ctx: ctx,
            [_IMMUTABLE]: {
                ctx: _IMMUTABLE
            }
        }, 3, "1L_1"),
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
        /*#__PURE__*/ _jsxQ("p", null, {
            class: "counter"
        }, p(count.value, 'home.devs'), 1, null),
        /*#__PURE__*/ _jsxQ("button", null, {
            class: "btn-counter",
            onClick$: /*#__PURE__*/ qrl(()=>import("./entry_Home.js"), "s_UVYDAmatcag", [
                count
            ])
        }, t('home.increment'), 1, null),
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
            unit: locale.units['length']
        }), 1, null)
    ], 1, "1L_2");
};`;

export const mockTransformedCode = `import { TitleComponent } from "./routes/[...lang]/index.tsx";
import { _IMMUTABLE } from "@builder.io/qwik";
import { _jsxC } from "@builder.io/qwik";
import { _jsxQ } from "@builder.io/qwik";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { $plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
import { relativeTime as rt } from "qwik-speak";
import { $translate as t } from "qwik-speak";
import { useSignal } from "@builder.io/qwik";
import { useSpeakContext } from "qwik-speak";
import { useSpeakLocale } from "qwik-speak";
export const s_dYGb4b0cyCA = ()=>{
    const ctx = useSpeakContext();
    const locale = useSpeakLocale();
    const count = useSignal(0);
    const tParam = __qsInline('home.greeting', { name: __qsInline('app.title') });
    const tArray = __qsInline('home.array@@["one", "two"]');
    const item = __qsInline('home.array.2@@three');
    const tObject = __qsInline('home.obj@@{"one": "1", "two": "2"}');
    const tArrayObjects = __qsInline('home.arrayObjects@@[{"num": "1"}, {"num": "2"}]');
    console.log(tParam);
    tArray.map((x)=>console.log(x));
    console.log(item);
    Object.values(tObject).map((x)=>console.log(x));
    tArrayObjects.map((x)=>console.log(x['num']));
    return /*#__PURE__*/ _jsxQ("div", null, {
        class: "content"
    }, [
        /*#__PURE__*/ _jsxC(TitleComponent, {
            ctx: ctx,
            [_IMMUTABLE]: {
                ctx: _IMMUTABLE
            }
        }, 3, "1L_1"),
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
        /*#__PURE__*/ _jsxQ("p", null, {
            class: "counter"
        }, __qsInlinePlural(count.value, 'home.devs'), 1, null),
        /*#__PURE__*/ _jsxQ("button", null, {
            class: "btn-counter",
            onClick$: /*#__PURE__*/ qrl(()=>import("./entry_Home.js"), "s_UVYDAmatcag", [
                count
            ])
        }, __qsInline('home.increment'), 1, null),
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
            unit: locale.units['length']
        }), 1, null)
    ], 1, "1L_2");
};`;

export const mockChunkCode = `const s_dYGb4b0cyCA = () => {
  const ctx = useSpeakContext();
  const locale = useSpeakLocale();
  const count = gc(0);
  const tParam = __qsInline('home.greeting', { name: __qsInline('app.title') });
  const tArray = __qsInline('home.array@@["one", "two"]');
  const item = __qsInline("home.array.2@@three");
  const tObject = __qsInline('home.obj@@{"one": "1", "two": "2"}');
  const tArrayObjects = __qsInline('home.arrayObjects@@[{"num": "1"}, {"num": "2"}]');
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x["num"]));
  return /* @__PURE__ */ Ar("div", null, {
    class: "content"
  }, [
    /* @__PURE__ */ Nr(TitleComponent, {
      ctx,
      [Mt]: {
        ctx: Mt
      }
    }, 3, "1L_1"),
    /* @__PURE__ */ Ar("h2", null, null, __qsInline("app.subtitle"), 1, null),
    /* @__PURE__ */ Ar("h3", null, null, __qsInline("home.params"), 1, null),
    /* @__PURE__ */ Ar("p", null, null, __qsInline("home.greeting", {
      name: "Qwik Speak"
    }), 1, null),
    /* @__PURE__ */ Ar("h3", null, null, __qsInline("home.tags"), 1, null),
    /* @__PURE__ */ Ar("p", {
      dangerouslySetInnerHTML: __qsInline("home.text")
    }, null, null, 3, null),
    /* @__PURE__ */ Ar("h3", null, null, __qsInline("home.plural"), 1, null),
    /* @__PURE__ */ Ar("p", null, {
      class: "counter"
    }, __qsInlinePlural(count.value, "home.devs"), 1, null),
    /* @__PURE__ */ Ar("button", null, {
      class: "btn-counter",
      onClick$: /* @__PURE__ */ z(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), true ? void 0 : void 0), "s_UVYDAmatcag", [
        count
      ])
    }, __qsInline("home.increment"), 1, null),
    /* @__PURE__ */ Ar("h3", null, null, __qsInline("home.dates"), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatDate(Date.now(), {
      dateStyle: "full",
      timeStyle: "short"
    }), 1, null),
    /* @__PURE__ */ Ar("p", null, null, relativeTime(-1, "second"), 1, null),
    /* @__PURE__ */ Ar("h3", null, null, __qsInline("home.numbers"), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1e6), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1e6, {
      style: "currency"
    }), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1, {
      style: "unit",
      unit: locale.units["length"]
    }), 1, null)
  ], 1, "1L_2");
};`;

export const mockInlinedCode = `const s_dYGb4b0cyCA = () => {
  const ctx = useSpeakContext();
  const locale = useSpeakLocale();
  const count = gc(0);
  const tParam = \`Hi! I am \${\`\`}\`;
  const tArray = ["one","two","three"];
  const item = \`three\`;
  const tObject = {"one":"1","two":"2"};
  const tArrayObjects = [{"num":"1"},{"num":"2"}];
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x["num"]));
  return /* @__PURE__ */ Ar("div", null, {
    class: "content"
  }, [
    /* @__PURE__ */ Nr(TitleComponent, {
      ctx,
      [Mt]: {
        ctx: Mt
      }
    }, 3, "1L_1"),
    /* @__PURE__ */ Ar("h2", null, null, \`\`, 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Parameters\`, 1, null),
    /* @__PURE__ */ Ar("p", null, null, \`Hi! I am Qwik Speak\`, 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Html tags\`, 1, null),
    /* @__PURE__ */ Ar("p", {
      dangerouslySetInnerHTML: \`<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>\`
    }, null, null, 3, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Plural\`, 1, null),
    /* @__PURE__ */ Ar("p", null, {
      class: "counter"
    }, (new Intl.PluralRules(\`en-US\`).select(+count.value) === \`other\` && \`\${count.value} software developers\` || \`\${count.value} software developer\`), 1, null),
    /* @__PURE__ */ Ar("button", null, {
      class: "btn-counter",
      onClick$: /* @__PURE__ */ z(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), true ? void 0 : void 0), "s_UVYDAmatcag", [
        count
      ])
    }, \`Increment\`, 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Dates & relative time\`, 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatDate(Date.now(), {
      dateStyle: "full",
      timeStyle: "short"
    }), 1, null),
    /* @__PURE__ */ Ar("p", null, null, relativeTime(-1, "second"), 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Numbers & currencies\`, 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1e6), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1e6, {
      style: "currency"
    }), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1, {
      style: "unit",
      unit: locale.units["length"]
    }), 1, null)
  ], 1, "1L_2");
};`;

export const mockInlinedCodeByLang = `const s_dYGb4b0cyCA = () => {
  const ctx = useSpeakContext();
  const locale = useSpeakLocale();
  const count = gc(0);
  const tParam = \`Ciao! Sono \${\`\`}\`;
  const tArray = ["uno","due","tre"];
  const item = \`tre\`;
  const tObject = {"one":"1","two":"2"};
  const tArrayObjects = [{"num":"1"},{"num":"2"}];
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x["num"]));
  return /* @__PURE__ */ Ar("div", null, {
    class: "content"
  }, [
    /* @__PURE__ */ Nr(TitleComponent, {
      ctx,
      [Mt]: {
        ctx: Mt
      }
    }, 3, "1L_1"),
    /* @__PURE__ */ Ar("h2", null, null, \`\`, 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Parametri\`, 1, null),
    /* @__PURE__ */ Ar("p", null, null, \`Ciao! Sono Qwik Speak\`, 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Tag Html\`, 1, null),
    /* @__PURE__ */ Ar("p", {
      dangerouslySetInnerHTML: \`<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>\`
    }, null, null, 3, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Plurale\`, 1, null),
    /* @__PURE__ */ Ar("p", null, {
      class: "counter"
    }, (new Intl.PluralRules(\`it-IT\`).select(+count.value) === \`other\` && \`\${count.value} sviluppatori software\` || \`\${count.value} sviluppatore software\`), 1, null),
    /* @__PURE__ */ Ar("button", null, {
      class: "btn-counter",
      onClick$: /* @__PURE__ */ z(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), true ? void 0 : void 0), "s_UVYDAmatcag", [
        count
      ])
    }, \`Incrementa\`, 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Date e tempo relativo\`, 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatDate(Date.now(), {
      dateStyle: "full",
      timeStyle: "short"
    }), 1, null),
    /* @__PURE__ */ Ar("p", null, null, relativeTime(-1, "second"), 1, null),
    /* @__PURE__ */ Ar("h3", null, null, \`Numeri e valute\`, 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1e6), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1e6, {
      style: "currency"
    }), 1, null),
    /* @__PURE__ */ Ar("p", null, null, formatNumber(1, {
      style: "unit",
      unit: locale.units["length"]
    }), 1, null)
  ], 1, "1L_2");
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

export const mockExtractedAsset = JSON.stringify({
  "home": {
    "array": [
      "one",
      "two",
      "three"
    ],
    "arrayObjects": [
      {
        "num": "1"
      },
      {
        "num": "2"
      }
    ],
    "dates": "Dates & relative time",
    "devs": {
      "one": "",
      "other": ""
    },
    "greeting": "Hi! I am {{name}}",
    "increment": "Increment",
    "numbers": "Numbers & currencies",
    "obj": {
      "one": "1",
      "two": "2"
    },
    "params": "",
    "plural": "Plural",
    "tags": "Html tags",
    "text": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
  }
}, null, 2);

export const mockTranslatedAsset = JSON.stringify({
  "home": {
    "array": [
      "one",
      "two",
      "three"
    ],
    "arrayObjects": [
      {
        "num": "1"
      },
      {
        "num": "2"
      }
    ],
    "dates": "Dates & relative time",
    "devs": {
      "one": "{{ value }} software developer",
      "other": "{{ value }} software developers"
    },
    "greeting": "Hi! I am {{name}}",
    "increment": "Increment",
    "numbers": "Numbers & currencies",
    "obj": {
      "one": "1",
      "two": "2"
    },
    "params": "Parameters",
    "plural": "Plural",
    "tags": "Html tags",
    "text": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
  }
}, null, 2);

export const mockTranslatedAssetByLang = JSON.stringify({
  "home": {
    "array": [
      "uno",
      "due",
      "tre"
    ],
    "arrayObjects": [
      {
        "num": "1"
      },
      {
        "num": "2"
      }
    ],
    "dates": "Date e tempo relativo",
    "devs": {
      "one": "{{ value }} sviluppatore software",
      "other": "{{ value }} sviluppatori software"
    },
    "greeting": "Ciao! Sono {{name}}",
    "increment": "Incrementa",
    "numbers": "Numeri e valute",
    "obj": {
      "one": "1",
      "two": "2"
    },
    "params": "Parametri",
    "plural": "Plurale",
    "tags": "Tag Html",
    "text": "<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>",
  }
}, null, 2);
