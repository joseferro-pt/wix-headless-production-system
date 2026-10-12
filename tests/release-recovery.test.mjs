import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const get = (name) => readFile(join(root, name), 'utf8');
const approved = '802acf1b536b502fcacdffc1d6b7ce371aa2d3f7';

test('R05.1 publisher is manual only and pinned to original approved R05 SHA', async () => {
  const source = await get('.github/workflows/publish-v0.1.0.yml');
  assert.match(source, /workflow_dispatch:/);
  assert.doesNotMatch(source, /^\s*workflow_run:/m);
  assert.doesNotMatch(source, /^\s*push:/m);
  assert.match(source, /PUBLISH-v0\.1\.0/);
  assert.match(source, /refs\/heads\/main/);
  assert.ok(source.includes(approved));
  assert.match(source, /cancel-in-progress:\s*false/);
});

test('publisher confirms existing annotated tag, verified CI and release before success', async () => {
  const source = await get('.github/workflows/publish-v0.1.0.yml');
  for(const expectation of [
    'actions/workflows/validate.yml/runs',
    'check-release-readiness.mjs --release --version v0.1.0',
    'git/tags',
    'git/refs',
    '.object.type == "tag"',
    '.object.sha == $sha',
    'gh release create',
    'releases/tags/',
    '.draft == false',
    '.prerelease == false',
    'approved source',
  ]) assert.ok(source.includes(expectation), `Missing safety precondition: ${expectation}`);
  assert.doesNotMatch(source, /git push .*refs\/tags/);
  assert.doesNotMatch(source, /--force/);
});

test('R05.1 recovery documentation records incident and manual approval', async () => {
  const docs = await get('docs/15-PUBLICATION-RECOVERY.md');
  assert.ok(docs.includes(approved));
  assert.match(docs, /fatal error in commit_refs/);
  assert.match(docs, /Run workflow/);
  assert.match(docs, /not.*proof|only after|only then/i);
});
