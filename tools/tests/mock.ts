/* eslint-disable */
export const mockChunk = `const s_xJBzwgVGKaQ = () => {
  const units = useSpeakLocale().units;
  const state = Yo({
    count: 0
  });
  return /*#__PURE__*/ X(Y, {
    children: [
          /*#__PURE__*/ X("h1", {
      children: $translate('app.title')
    }),
          /*#__PURE__*/ X("h2", {
      children: $translate('app.subtitle')
    }),
          /*#__PURE__*/ X("h3", {
      children: $translate('home.params')
    }),
          /*#__PURE__*/ X("p", {
      children: $translate('home.greeting', {
        name: 'Qwik Speak'
      })
    }),
          /*#__PURE__*/ X("h3", {
      children: $translate('home.tags')
    }),
          /*#__PURE__*/ X("p", {
      dangerouslySetInnerHTML: $translate('home.text')
    }),
          /*#__PURE__*/ X("h3", {
      children: $translate('home.plural')
    }),
          /*#__PURE__*/ X("button", {
      onClick$: uo(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), __VITE_IS_MODERN__ ? "__VITE_PRELOAD__" : void 0), "s_d7QwW4Vfl2A", [
        state
      ]),
      children: $translate('home.increment')
    }),
          /*#__PURE__*/ X("p", {
      children: plural(state.count, 'home.devs')
    }),
          /*#__PURE__*/ X("h3", {
      children: $translate('home.dates')
    }),
          /*#__PURE__*/ X("p", {
      children: formatDate(Date.now(), {
        dateStyle: 'full',
        timeStyle: 'short'
      })
    }),
          /*#__PURE__*/ X(RelativeTime, {}),
          /*#__PURE__*/ X("h3", {
      children: $translate('home.numbers')
    }),
          /*#__PURE__*/ X("p", {
      children: formatNumber(1000000)
    }),
          /*#__PURE__*/ X("p", {
      children: formatNumber(1000000, {
        style: 'currency'
      })
    }),
          /*#__PURE__*/ X("p", {
      children: formatNumber(1, {
        style: 'unit',
        unit: units['length']
      })
    })
    ]
  });
};`;

export const inlinedChunk = `const s_xJBzwgVGKaQ = () => {
  const units = useSpeakLocale().units;
  const state = Yo({
    count: 0
  });
  return /*#__PURE__*/ X(Y, {
    children: [
          /*#__PURE__*/ X("h1", {
      children: $lang === \`it-IT\` && \`Qwik Speak\` || \`Qwik Speak\`
    }),
          /*#__PURE__*/ X("h2", {
      children: $lang === \`it-IT\` && \`Traduci le tue app Qwik in qualsiasi lingua\` || \`Translate your Qwik apps into any language\`
    }),
          /*#__PURE__*/ X("h3", {
      children: $lang === \`it-IT\` && \`Parametri\` || \`Parameters\`
    }),
          /*#__PURE__*/ X("p", {
      children: $lang === \`it-IT\` && \`Ciao! Sono \${'Qwik Speak'}\` || \`Hi! I am \${'Qwik Speak'}\`
    }),
          /*#__PURE__*/ X("h3", {
      children: $lang === \`it-IT\` && \`Tag Html\` || \`Html tags\`
    }),
          /*#__PURE__*/ X("p", {
      dangerouslySetInnerHTML: $lang === \`it-IT\` && \`<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>\` || \`<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>\`
    }),
          /*#__PURE__*/ X("h3", {
      children: $lang === \`it-IT\` && \`Plurale\` || \`Plural\`
    }),
          /*#__PURE__*/ X("button", {
      onClick$: uo(() => __vitePreload(() => Promise.resolve().then(() => entry_Home), __VITE_IS_MODERN__ ? "__VITE_PRELOAD__" : void 0), "s_d7QwW4Vfl2A", [
        state
      ]),
      children: $lang === \`it-IT\` && \`Incrementa\` || \`Increment\`
    }),
          /*#__PURE__*/ X("p", {
      children: plural(state.count, 'home.devs')
    }),
          /*#__PURE__*/ X("h3", {
      children: $lang === \`it-IT\` && \`Date e tempo relativo\` || \`Dates & relative time\`
    }),
          /*#__PURE__*/ X("p", {
      children: formatDate(Date.now(), {
        dateStyle: 'full',
        timeStyle: 'short'
      })
    }),
          /*#__PURE__*/ X(RelativeTime, {}),
          /*#__PURE__*/ X("h3", {
      children: $lang === \`it-IT\` && \`Numeri e valute\` || \`Numbers & currencies\`
    }),
          /*#__PURE__*/ X("p", {
      children: formatNumber(1000000)
    }),
          /*#__PURE__*/ X("p", {
      children: formatNumber(1000000, {
        style: 'currency'
      })
    }),
          /*#__PURE__*/ X("p", {
      children: formatNumber(1, {
        style: 'unit',
        unit: units['length']
      })
    })
    ]
  });
};`;
