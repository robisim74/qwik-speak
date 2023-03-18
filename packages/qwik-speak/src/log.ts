export const logWarn = (message: string) => {
  console.warn('\x1b[33mQwik Speak warn\x1b[0m %s', message);
};

export const logDebug = (message: string) => {
  console.debug('\x1b[36mQwik Speak\x1b[0m %s', message);
};
