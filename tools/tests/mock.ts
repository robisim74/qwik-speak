/* eslint-disable */
export const mockCode = `import { RelativeTime } from "./app/routes/[...lang]/index";
import { Fragment as _Fragment } from "@builder.io/qwik/jsx-runtime";
import { jsx as _jsx } from "@builder.io/qwik/jsx-runtime";
import { jsxs as _jsxs } from "@builder.io/qwik/jsx-runtime";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
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
            /*#__PURE__*/ _jsx(RelativeTime, {}),
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

export const inlinedCode = `import { RelativeTime } from "./app/routes/[...lang]/index";
import { Fragment as _Fragment } from "@builder.io/qwik/jsx-runtime";
import { jsx as _jsx } from "@builder.io/qwik/jsx-runtime";
import { jsxs as _jsxs } from "@builder.io/qwik/jsx-runtime";
import { formatDate as fd } from "qwik-speak";
import { formatNumber as fn } from "qwik-speak";
import { plural as p } from "qwik-speak";
import { qrl } from "@builder.io/qwik";
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
                children: $lang === \`it-IT\` && \`Qwik Speak\` || \`Qwik Speak\`
            }),
            /*#__PURE__*/ _jsx("h2", {
                children: $lang === \`it-IT\` && \`Traduci le tue app Qwik in qualsiasi lingua\` || \`Translate your Qwik apps into any language\`
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang === \`it-IT\` && \`Parametri\` || \`Parameters\`
            }),
            /*#__PURE__*/ _jsx("p", {
                children: $lang === \`it-IT\` && \`Ciao! Sono \${'Qwik Speak'}\` || \`Hi! I am \${'Qwik Speak'}\`
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang === \`it-IT\` && \`Tag Html\` || \`Html tags\`
            }),
            /*#__PURE__*/ _jsx("p", {
                dangerouslySetInnerHTML: $lang === \`it-IT\` && \`<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>\` || \`<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>\`
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang === \`it-IT\` && \`Plurale\` || \`Plural\`
            }),
            /*#__PURE__*/ _jsx("button", {
                onClick$: qrl(()=>import("./entry_Home.js"), "s_d7QwW4Vfl2A", [
                    state
                ]),
                children: $lang === \`it-IT\` && \`Incrementa\` || \`Increment\`
            }),
            /*#__PURE__*/ _jsx("p", {
                children: p(state.count, 'home.devs')
            }),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang === \`it-IT\` && \`Date e tempo relativo\` || \`Dates & relative time\`
            }),
            /*#__PURE__*/ _jsx("p", {
                children: fd(Date.now(), {
                    dateStyle: 'full',
                    timeStyle: 'short'
                })
            }),
            /*#__PURE__*/ _jsx(RelativeTime, {}),
            /*#__PURE__*/ _jsx("h3", {
                children: $lang === \`it-IT\` && \`Numeri e valute\` || \`Numbers & currencies\`
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
