import { Project } from 'ts-morph';
import { globby } from 'globby'; // npm i -D globby

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
const files = await globby(['app/**/*.{ts,tsx,js}', 'components/**/*.{ts,tsx,js}']);

files.forEach(f => project.addSourceFileAtPath(f));

project.getSourceFiles().forEach(sf => {
  sf.getImportDeclarations().forEach(imp => {
    const spec = imp.getModuleSpecifierValue();
    if (spec.includes('/components/')) {
      const tail = spec.split('/components/')[1];
      imp.setModuleSpecifier(`@components/${tail}`);
    }
    if (spec.includes('/lib/')) {
      const tail = spec.split('/lib/')[1];
      imp.setModuleSpecifier(`@lib/${tail}`);
    }
  });
});

await project.save(); // перезаписывает только изменённые файлы
console.log('✅  imports rewritten');
