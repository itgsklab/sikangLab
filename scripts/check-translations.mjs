import { readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const contentRoot = fileURLToPath(new URL('../content/', import.meta.url));
const localizedFiles = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(?:zh|en)\.md$/.test(entry.name)) localizedFiles.push(path);
  }
}

await walk(contentRoot);

const missing = [];
for (const file of localizedFiles) {
  const counterpart = file.endsWith('.zh.md')
    ? file.replace(/\.zh\.md$/, '.en.md')
    : file.replace(/\.en\.md$/, '.zh.md');
  try {
    await access(counterpart);
  } catch {
    missing.push(counterpart.replace(contentRoot, 'content/'));
  }
}

if (missing.length) {
  console.error('Every localized article must have both Chinese and English files. Missing:');
  for (const file of [...new Set(missing)].sort()) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`Translation check passed: ${localizedFiles.length / 2} Chinese/English content pairs.`);
