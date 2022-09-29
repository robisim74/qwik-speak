import { createWriteStream } from 'fs';
import util from 'util';

const logFile = createWriteStream('./qwik-speak.log', { flags: 'a' });

export default function (s: string) {
  logFile.write(util.format(s) + '\n');
}
