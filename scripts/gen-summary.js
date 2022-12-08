import { fileURLToPath } from 'url';
import { readFile, readdir, writeFile } from 'fs/promises';

const baseDir = fileURLToPath(new URL('../docs/api', import.meta.url));;

const structure = [];

const genSummary = async () => {
  let files = await readdir(baseDir);

  // Create structure
  if (files.length > 0) {
    files = files.filter(filename => filename !== 'index.md');

    for (const filename of files) {
      const levels = filename.split('.');

      let node = structure.find(x => x.name === levels[0]);
      if (!node) {
        node = {
          name: levels[0],
          file: levels.length === 2 ? filename : undefined,
          values: []
        };
        structure.push(node);
      } else if (!node.file) {
        node.file = levels.length === 2 ? filename : undefined
      }

      for (let i = 1; i < levels.length - 1; i++) {
        let child = node.values.find(x => x.name === levels[i]);
        if (!child) {
          child = {
            name: levels[i],
            file: levels.length === i + 2 ? filename : undefined,
            values: []
          };
          node.values.push(child);
        } else if (!child.file) {
          child.file = levels.length === i + 2 ? filename : undefined
        }
        node = child;
      }
    }
  }

  // Create SUMMARY.md
  if (structure.length > 0) {
    let str = await readFile(fileURLToPath(new URL('./summary-base.txt', import.meta.url)), 'utf8');

    const walk = (node, i) => {
      let line = ' '.repeat(i * 4);
      line += `* [${node.name}](docs/api/${node.file})\r\n`;
      str += line;
      i++;

      for (const child of node.values) {
        walk(child, i);
      }
    }

    for (const node of structure) {
      walk(node, 1);
    }

    const summary = fileURLToPath(new URL('../SUMMARY.md', import.meta.url));
    await writeFile(summary, str);

    console.log(summary);
  }
};

genSummary();
