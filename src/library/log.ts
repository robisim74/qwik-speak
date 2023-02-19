import { isBrowser } from '@builder.io/qwik/build';

const STYLE = isBrowser
  ? `background-color: #0093ee; color: #fff; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`
  : '';

export const logWarn = (message: string) => {
  console.warn('%cQwik Speak warn', STYLE, message);
};

export const logDebug = (message: string) => {
  console.debug('%cQwik Speak', STYLE, message);
};
