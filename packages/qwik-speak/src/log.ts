export const logWarn = (message: string) => {
  console.warn('\x1b[33mQwik Speak warn\x1b[0m %s', message);
};

export const logDebug = (enabled: boolean | undefined, message: string) => {
  if (enabled) {
    console.debug('\x1b[36mQwik Speak\x1b[0m %s', message);
  }
};

export const logDebugInline = (enabled: boolean | undefined, ...message: any) => {
  if (enabled) {
    console.debug(
      '%cQwik Speak Inline',
      'background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
      ...message
    );
  }
};
