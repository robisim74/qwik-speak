import { createWriteStream } from 'fs';
import util from 'util';

const logFile = createWriteStream('./qwik-speak.log', { flags: 'w' });

export default function (s: string) {
  logFile.write(util.format(s) + '\n');
}
