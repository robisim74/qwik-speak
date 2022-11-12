/**
 * Parse a cli argument to { key: value }
 */
export function parseArgument(arg: string): { key: string, value: any } {
  const property = arg.split('=');
  if (property.length === 2 && property[0].startsWith('--')) {
    const key = property[0].slice(2);
    const value = /,/.test(property[1]) ? property[1].split(',') : property[1];
    return { key, value };
  }
  return { key: 'error', value: `- wrong option: "${property[0]}"` };
}
