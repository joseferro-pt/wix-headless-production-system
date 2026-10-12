import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve, isAbsolute, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fileNames = ['README.md', 'AGENTS.md', 'CHANGELOG.md'];
const docFolders = ['docs', 'templates', 'blueprints'];

async function markdownFiles(folder) {
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const full = join(folder, entry.name);
    if (entry.isDirectory()) result.push(...await markdownFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) result.push(full);
  }
  return result;
}

// Audit relative links only. External URLs and same-document heading anchors are not fetched.
test('all relative Markdown document links point to an existing file', async () => {
  const docs = [...fileNames.map(name => join(root, name)),
    ...(await Promise.all(docFolders.map(name => markdownFiles(join(root, name))))).flat()];
  const errors = [];
  for (const doc of docs) {
    const source = await readFile(doc, 'utf8');
    const withoutCode = source.replace(/```[\s\S]*?```/g, '');
    const pattern = /\[[^\]\n]+\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g;
    for (const match of withoutCode.matchAll(pattern)) {
      const href = match[1];
      if (/^(https?:|mailto:|#|data:)/i.test(href)) continue;
      const local = decodeURIComponent(href.split('#')[0]);
      if (!local) continue;
      const target = resolve(dirname(doc), local);
      if (isAbsolute(local) || relative(root, target).startsWith('..')) {
        errors.push(`${relative(root, doc)}: escaped link ${href}`);
        continue;
      }
      try { await stat(target); }
      catch { errors.push(`${relative(root, doc)}: missing link target ${href}`); }
    }
  }
  assert.deepEqual(errors, []);
});

test('entry documentation distinguishes the published release from unreleased maintenance', async () => {
  const [readme, room, adoption] = await Promise.all([
    readFile(join(root, 'README.md'), 'utf8'),
    readFile(join(root, 'docs/CONTROL-ROOM.md'), 'utf8'),
    readFile(join(root, 'docs/07-PROJECT-ADOPTION.md'), 'utf8'),
  ]);
  assert.match(readme, /R01[^\n]*merged/i);
  assert.match(readme, /R02[^\n]*merged/i);
  assert.match(room, /WHPS-R04[^\n]*release governance/i);
  assert.match(adoption, /published[^\n]*v0\.1\.0/i);
  assert.ok(adoption.includes('802acf1b536b502fcacdffc1d6b7ce371aa2d3f7'));
  assert.match(readme, /v0\.1\.0 published 12 October 2026/);
  assert.match(room, /Published and verified/i);
  assert.match(room, /WHPS-R05\.2[^\n]*Post-release reconciliation/);
  assert.match(readme, /does \*\*not\*\* download Wix's ZIP/i);
});
