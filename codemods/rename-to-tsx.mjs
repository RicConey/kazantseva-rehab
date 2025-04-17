// codemods/rename-to-tsx.mjs
import { globby } from 'globby';
import fs from 'fs/promises';

const files = await globby(['app/**/*.js', 'components/**/*.js']);

for (const file of files) {
  const code = await fs.readFile(file, 'utf8');

  // простая эвристика: есть "<" сразу после return/(
  const needsTsx = /return\s*\(\s*<|>\s*<\/\w+>/.test(code);
  const newExt = needsTsx ? '.tsx' : '.ts';
  const newFile = file.replace(/\.js$/, newExt);

  await fs.rename(file, newFile);
  console.log('renamed:', file, '→', newFile);
}
