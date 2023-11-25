/* eslint-disable */
export const mockSource = `import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import {
  inlineTranslate,
  inlinePlural,
  useFormatDate,
  useFormatNumber,
  useRelativeTime,
  useSpeakLocale,
  type Translation
} from 'qwik-speak';

interface TitleProps {
  name: string;
}

export const Title = component$<TitleProps>(props => {
  return (<h1>{props.name}</h1>)
});

export const SubTitle = () => {
  const t = inlineTranslate();
  return <h2>{t('app.subtitle')}</h2>;
};

export default component$(() => {
  const t = inlineTranslate();
  const p = inlinePlural();

  const fd = useFormatDate();
  const rt = useRelativeTime();
  const fn = useFormatNumber();

  const locale = useSpeakLocale();
  const units = locale.units!;

  const count = useSignal(0);

  const tParam = t('greeting', { name: t('app.title') });
  const tArray = t<string[]>('array@@["{{ name }} one", "{{ name }} two"]', { name: 'n.' });
  const item = t('array.2@@{{ name }} three', { name: 'n.' });
  const tObject = t<Translation>('obj@@{"one": "{{ name }} one", "two": "{{ name }} two"}', { name: 'n.' });
  const tArrayObjects = t<Translation[]>('arrayObjects@@[{"num": "one"}, {"num": "two"}]');
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x['num']));

  return (
    <div class="content">
      <Title name={t('app.title')} />

      <SubTitle />

      <h3>{t('params')}</h3>
      <p>{t('greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('tags')}</h3>
      <p dangerouslySetInnerHTML={t('description')}></p>

      <h3>{t('plural')}</h3>
      <p class="counter">{p(count.value, 'devs')}</p>
      <button class="btn-counter" onClick$={() => count.value++}>{t('increment')}</button>

      <h3>{t('dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p>{rt(-1, 'second')}</p>

      <h3>{t('numbers')}</h3>
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: units['length'] })}</p>
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();

  return {
    title: t('app.head.home.title', { name: 'Qwik Speak' }),
    meta: [
      {
        name: 'description',
        content: t('app.head.home.description')
      }
    ],
  };
};`;

export const mockCode = `import { SubTitle } from "./routes/[...lang]/index.tsx";
import { Title } from "./routes/[...lang]/index.tsx";
import { _jsxC } from "@builder.io/qwik";
import { _jsxQ } from "@builder.io/qwik";
import { inlinePlural } from "qwik-speak";
import { inlineTranslate } from "qwik-speak";
import { qrlDEV } from "@builder.io/qwik";
import { useFormatDate } from "qwik-speak";
import { useFormatNumber } from "qwik-speak";
import { useRelativeTime } from "qwik-speak";
import { useSignal } from "@builder.io/qwik";
import { useSpeakLocale } from "qwik-speak";
export const ____lang__component_eTU0cN78ZUc = ()=>{
    const t = inlineTranslate();
    const p = inlinePlural();
    const fd = useFormatDate();
    const rt = useRelativeTime();
    const fn = useFormatNumber();
    const locale = useSpeakLocale();
    const count = useSignal(0);
    const tParam = t('greeting', {
        name: t('app.title')
    });
    const tArray = t('array@@["{{ name }} one", "{{ name }} two"]', {
        name: 'n.'
    });
    const item = t('array.2@@{{ name }} three', {
        name: 'n.'
    });
    const tObject = t('obj@@{"one": "{{ name }} one", "two": "{{ name }} two"}', {
        name: 'n.'
    });
    const tArrayObjects = t('arrayObjects@@[{"num": "one"}, {"num": "two"}]');
    console.log(tParam);
    tArray.map((x)=>console.log(x));
    console.log(item);
    Object.values(tObject).map((x)=>console.log(x));
    tArrayObjects.map((x)=>console.log(x['num']));
    return /*#__PURE__*/ _jsxQ("div", null, {
        class: "content"
    }, [
        /*#__PURE__*/ _jsxC(Title, {
            name: t('app.title')
        }, 3, "1L_2", {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 52,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxC(SubTitle, null, 3, "1L_3", {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 54,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, t('params'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 56,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, t('greeting', {
            name: 'Qwik Speak'
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 57,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, t('tags'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 59,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", {
            dangerouslySetInnerHTML: t('description')
        }, null, null, 3, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 60,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, t('plural'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 62,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, {
            class: "counter"
        }, p(count.value, 'devs'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 63,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("button", null, {
            class: "btn-counter",
            onClick$: /*#__PURE__*/ qrlDEV(()=>import("./____lang__component_div_button_onclick_xgivgs2jpeg.js"), "____lang__component_div_button_onClick_XGiVgs2jpeg", {
                file: "/home/robisim74/documents/github/qwik-speak/src/routes/[...lang]/index.tsx",
                lo: 1796,
                hi: 1815,
                displayName: "____lang__component_div_button_onClick"
            }, [
                count
            ])
        }, t('increment'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 64,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, t('dates'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 66,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fd(Date.now(), {
            dateStyle: 'full',
            timeStyle: 'short'
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 67,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, rt(-1, 'second'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 68,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, t('numbers'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 70,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 71,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000, {
            style: 'currency'
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 72,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fn(1, {
            style: 'unit',
            unit: locale.units['length']
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 73,
            columnNumber: 7
        })
    ], 1, "1L_4", {
        fileName: "routes/[...lang]/index.tsx",
        lineNumber: 51,
        columnNumber: 5
    });
};`;

export const mockTransformedCode = `import { SubTitle } from "./routes/[...lang]/index.tsx";
import { Title } from "./routes/[...lang]/index.tsx";
import { _jsxC } from "@builder.io/qwik";
import { _jsxQ } from "@builder.io/qwik";
import { inlinePlural } from "qwik-speak";
import { inlineTranslate } from "qwik-speak";
import { qrlDEV } from "@builder.io/qwik";
import { useFormatDate } from "qwik-speak";
import { useFormatNumber } from "qwik-speak";
import { useRelativeTime } from "qwik-speak";
import { useSignal } from "@builder.io/qwik";
import { useSpeakLocale } from "qwik-speak";
export const ____lang__component_eTU0cN78ZUc = ()=>{
    
    
    const fd = useFormatDate();
    const rt = useRelativeTime();
    const fn = useFormatNumber();
    const locale = useSpeakLocale();
    const count = useSignal(0);
    const tParam = __qsInlineTranslate('greeting', {
        name: __qsInlineTranslate('app.title')
    });
    const tArray = __qsInlineTranslate('array@@["{{ name }} one", "{{ name }} two"]', {
        name: 'n.'
    });
    const item = __qsInlineTranslate('array.2@@{{ name }} three', {
        name: 'n.'
    });
    const tObject = __qsInlineTranslate('obj@@{"one": "{{ name }} one", "two": "{{ name }} two"}', {
        name: 'n.'
    });
    const tArrayObjects = __qsInlineTranslate('arrayObjects@@[{"num": "one"}, {"num": "two"}]');
    console.log(tParam);
    tArray.map((x)=>console.log(x));
    console.log(item);
    Object.values(tObject).map((x)=>console.log(x));
    tArrayObjects.map((x)=>console.log(x['num']));
    return /*#__PURE__*/ _jsxQ("div", null, {
        class: "content"
    }, [
        /*#__PURE__*/ _jsxC(Title, {
            name: __qsInlineTranslate('app.title')
        }, 3, "1L_2", {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 52,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxC(SubTitle, null, 3, "1L_3", {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 54,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, __qsInlineTranslate('params'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 56,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, __qsInlineTranslate('greeting', {
            name: 'Qwik Speak'
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 57,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, __qsInlineTranslate('tags'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 59,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", {
            dangerouslySetInnerHTML: __qsInlineTranslate('description')
        }, null, null, 3, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 60,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, __qsInlineTranslate('plural'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 62,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, {
            class: "counter"
        }, __qsInlinePlural(count.value, 'devs'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 63,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("button", null, {
            class: "btn-counter",
            onClick$: /*#__PURE__*/ qrlDEV(()=>import("./____lang__component_div_button_onclick_xgivgs2jpeg.js"), "____lang__component_div_button_onClick_XGiVgs2jpeg", {
                file: "/home/robisim74/documents/github/qwik-speak/src/routes/[...lang]/index.tsx",
                lo: 1796,
                hi: 1815,
                displayName: "____lang__component_div_button_onClick"
            }, [
                count
            ])
        }, __qsInlineTranslate('increment'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 64,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, __qsInlineTranslate('dates'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 66,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fd(Date.now(), {
            dateStyle: 'full',
            timeStyle: 'short'
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 67,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, rt(-1, 'second'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 68,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("h3", null, null, __qsInlineTranslate('numbers'), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 70,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 71,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fn(1000000, {
            style: 'currency'
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 72,
            columnNumber: 7
        }),
        /*#__PURE__*/ _jsxQ("p", null, null, fn(1, {
            style: 'unit',
            unit: locale.units['length']
        }), 1, null, {
            fileName: "routes/[...lang]/index.tsx",
            lineNumber: 73,
            columnNumber: 7
        })
    ], 1, "1L_4", {
        fileName: "routes/[...lang]/index.tsx",
        lineNumber: 51,
        columnNumber: 5
    });
};`;

export const mockChunkCode = `const s_eTU0cN78ZUc = () => {
  const fd = useFormatDate();
  const rt = useRelativeTime();
  const fn = useFormatNumber();
  const locale = useSpeakLocale();
  const count = Qc(0);
  const tParam = __qsInlineTranslate("greeting", {
    name: __qsInlineTranslate("app.title")
  });
  const tArray = __qsInlineTranslate('array@@["{{ name }} one", "{{ name }} two"]', {
    name: "n."
  });
  const item = __qsInlineTranslate("array.2@@{{ name }} three", {
    name: "n."
  });
  const tObject = __qsInlineTranslate('obj@@{"one": "{{ name }} one", "two": "{{ name }} two"}', {
    name: "n."
  });
  const tArrayObjects = __qsInlineTranslate('arrayObjects@@[{"num": "one"}, {"num": "two"}]');
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x["num"]));
  return /* @__PURE__ */ Cr("div", null, {
    class: "content"
  }, [
    /* @__PURE__ */ jr(Title, {
      name: __qsInlineTranslate("app.title")
    }, 3, "1L_2"),
    /* @__PURE__ */ jr(SubTitle, null, 3, "1L_3"),
    /* @__PURE__ */ Cr("h3", null, null, __qsInlineTranslate("params"), 1, null),
    /* @__PURE__ */ Cr("p", null, null, __qsInlineTranslate("greeting", {
      name: "Qwik Speak"
    }), 1, null),
    /* @__PURE__ */ Cr("h3", null, null, __qsInlineTranslate("tags"), 1, null),
    /* @__PURE__ */ Cr("p", {
      dangerouslySetInnerHTML: __qsInlineTranslate("description")
    }, null, null, 3, null),
    /* @__PURE__ */ Cr("h3", null, null, __qsInlineTranslate("plural"), 1, null),
    /* @__PURE__ */ Cr("p", null, {
      class: "counter"
    }, __qsInlinePlural(count.value, "devs"), 1, null),
    /* @__PURE__ */ Cr("button", null, {
      class: "btn-counter",
      onClick$: /* @__PURE__ */ vs(() => __vitePreload(() => Promise.resolve().then(() => entry_____lang_), true ? void 0 : void 0), "s_XGiVgs2jpeg", [
        count
      ])
    }, __qsInlineTranslate("increment"), 1, null),
    /* @__PURE__ */ Cr("h3", null, null, __qsInlineTranslate("dates"), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fd(Date.now(), {
      dateStyle: "full",
      timeStyle: "short"
    }), 1, null),
    /* @__PURE__ */ Cr("p", null, null, rt(-1, "second"), 1, null),
    /* @__PURE__ */ Cr("h3", null, null, __qsInlineTranslate("numbers"), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1e6), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1e6, {
      style: "currency"
    }), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1, {
      style: "unit",
      unit: locale.units["length"]
    }), 1, null)
  ], 1, "1L_4");
};`;

export const mockInlinedCode = `const s_eTU0cN78ZUc = () => {
  const fd = useFormatDate();
  const rt = useRelativeTime();
  const fn = useFormatNumber();
  const locale = useSpeakLocale();
  const count = Qc(0);
  const tParam = \`Hi! I am \${\`Qwik Speak\`}\`;
  const tArray = [\`n. one\`,\`n. two\`,\`n. three\`];
  const item = \`n. three\`;
  const tObject = {"one":\`n. one\`,"two":\`n. two\`};
  const tArrayObjects = [{"num":"one"},{"num":"two"}];
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x["num"]));
  return /* @__PURE__ */ Cr("div", null, {
    class: "content"
  }, [
    /* @__PURE__ */ jr(Title, {
      name: \`Qwik Speak\`
    }, 3, "1L_2"),
    /* @__PURE__ */ jr(SubTitle, null, 3, "1L_3"),
    /* @__PURE__ */ Cr("h3", null, null, \`Parameters\`, 1, null),
    /* @__PURE__ */ Cr("p", null, null, \`Hi! I am Qwik Speak\`, 1, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Html tags\`, 1, null),
    /* @__PURE__ */ Cr("p", {
      dangerouslySetInnerHTML: \`<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>\`
    }, null, null, 3, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Plural\`, 1, null),
    /* @__PURE__ */ Cr("p", null, {
      class: "counter"
    }, (new Intl.PluralRules(\`en-US\`).select(+count.value) === \`other\` && \`\${count.value} software developers\` || \`\${count.value} software developer\`), 1, null),
    /* @__PURE__ */ Cr("button", null, {
      class: "btn-counter",
      onClick$: /* @__PURE__ */ vs(() => __vitePreload(() => Promise.resolve().then(() => entry_____lang_), true ? void 0 : void 0), "s_XGiVgs2jpeg", [
        count
      ])
    }, \`Increment\`, 1, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Dates & relative time\`, 1, null),
    /* @__PURE__ */ Cr("p", null, null, fd(Date.now(), {
      dateStyle: "full",
      timeStyle: "short"
    }), 1, null),
    /* @__PURE__ */ Cr("p", null, null, rt(-1, "second"), 1, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Numbers & currencies\`, 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1e6), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1e6, {
      style: "currency"
    }), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1, {
      style: "unit",
      unit: locale.units["length"]
    }), 1, null)
  ], 1, "1L_4");
};`;

export const mockInlinedCodeByLang = `const s_eTU0cN78ZUc = () => {
  const fd = useFormatDate();
  const rt = useRelativeTime();
  const fn = useFormatNumber();
  const locale = useSpeakLocale();
  const count = Qc(0);
  const tParam = \`Ciao! Sono \${\`Qwik Speak\`}\`;
  const tArray = [\`n. uno\`,\`n. due\`,\`n. tre\`];
  const item = \`n. tre\`;
  const tObject = {"one":\`n. uno\`,"two":\`n. due\`};
  const tArrayObjects = [{"num":"uno"},{"num":"due"}];
  console.log(tParam);
  tArray.map((x) => console.log(x));
  console.log(item);
  Object.values(tObject).map((x) => console.log(x));
  tArrayObjects.map((x) => console.log(x["num"]));
  return /* @__PURE__ */ Cr("div", null, {
    class: "content"
  }, [
    /* @__PURE__ */ jr(Title, {
      name: \`Qwik Speak\`
    }, 3, "1L_2"),
    /* @__PURE__ */ jr(SubTitle, null, 3, "1L_3"),
    /* @__PURE__ */ Cr("h3", null, null, \`Parametri\`, 1, null),
    /* @__PURE__ */ Cr("p", null, null, \`Ciao! Sono Qwik Speak\`, 1, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Tag Html\`, 1, null),
    /* @__PURE__ */ Cr("p", {
      dangerouslySetInnerHTML: \`<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>\`
    }, null, null, 3, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Plurale\`, 1, null),
    /* @__PURE__ */ Cr("p", null, {
      class: "counter"
    }, (new Intl.PluralRules(\`it-IT\`).select(+count.value) === \`other\` && \`\${count.value} sviluppatori di software\` || \`\${count.value} sviluppatore di software\`), 1, null),
    /* @__PURE__ */ Cr("button", null, {
      class: "btn-counter",
      onClick$: /* @__PURE__ */ vs(() => __vitePreload(() => Promise.resolve().then(() => entry_____lang_), true ? void 0 : void 0), "s_XGiVgs2jpeg", [
        count
      ])
    }, \`Incremento\`, 1, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Date e tempo relativo\`, 1, null),
    /* @__PURE__ */ Cr("p", null, null, fd(Date.now(), {
      dateStyle: "full",
      timeStyle: "short"
    }), 1, null),
    /* @__PURE__ */ Cr("p", null, null, rt(-1, "second"), 1, null),
    /* @__PURE__ */ Cr("h3", null, null, \`Numeri e valute\`, 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1e6), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1e6, {
      style: "currency"
    }), 1, null),
    /* @__PURE__ */ Cr("p", null, null, fn(1, {
      style: "unit",
      unit: locale.units["length"]
    }), 1, null)
  ], 1, "1L_4");
};`;

export const mockAsset = JSON.stringify({
  "dates": "Dates & relative time",
  "greeting": "Hi! I am {{name}}",
  "increment": "Increment",
  "numbers": "Numbers & currencies",
  "params": "Parameters",
  "plural": "Plural",
  "tags": "Html tags",
  "description": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
}, null, 2);

export const mockExtractedAsset = JSON.stringify({
  "app": {
    "head": {
      "home": {
        "description": "",
        "title": ""
      }
    },
    "subtitle": "",
    "title": ""
  },
  "array": [
    "{{ name }} one",
    "{{ name }} two",
    "{{ name }} three"
  ],
  "arrayObjects": [
    {
      "num": "one"
    },
    {
      "num": "two"
    }
  ],
  "dates": "Dates & relative time",
  "description": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>",
  "devs": {
    "one": "",
    "other": ""
  },
  "greeting": "Hi! I am {{name}}",
  "increment": "Increment",
  "numbers": "Numbers & currencies",
  "obj": {
    "one": "{{ name }} one",
    "two": "{{ name }} two"
  },
  "params": "Parameters",
  "plural": "Plural",
  "tags": "Html tags"
}, null, 2);

export const mockTranslatedAsset = JSON.stringify({
  "app": {
    "subtitle": "Translate your Qwik apps into any language",
    "title": "Qwik Speak"
  },
  "array": [
    "{{ name }} one",
    "{{ name }} two",
    "{{ name }} three"
  ],
  "arrayObjects": [
    {
      "num": "one"
    },
    {
      "num": "two"
    }
  ],
  "dates": "Dates & relative time",
  "description": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>",
  "devs": {
    "one": "{{ value }} software developer",
    "other": "{{ value }} software developers"
  },
  "greeting": "Hi! I am {{name}}",
  "increment": "Increment",
  "numbers": "Numbers & currencies",
  "obj": {
    "one": "{{ name }} one",
    "two": "{{ name }} two"
  },
  "params": "Parameters",
  "plural": "Plural",
  "tags": "Html tags"
}, null, 2);

export const mockTranslatedAssetByLang = JSON.stringify({
  "app": {
    "subtitle": "Traduci le tue app Qwik in qualsiasi lingua",
    "title": "Qwik Speak"
  },
  "array": [
    "{{ name }} uno",
    "{{ name }} due",
    "{{ name }} tre"
  ],
  "arrayObjects": [
    {
      "num": "uno"
    },
    {
      "num": "due"
    }
  ],
  "dates": "Date e tempo relativo",
  "description": "<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>",
  "devs": {
    "one": "{{ value }} sviluppatore di software",
    "other": "{{ value }} sviluppatori di software"
  },
  "greeting": "Ciao! Sono {{name}}",
  "increment": "Incremento",
  "numbers": "Numeri e valute",
  "obj": {
    "one": "{{ name }} uno",
    "two": "{{ name }} due"
  },
  "params": "Parametri",
  "plural": "Plurale",
  "tags": "Tag Html"
}, null, 2);
