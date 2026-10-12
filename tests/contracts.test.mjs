import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseHandoff, makeManifest } from '../scripts/intake-wix-handoff.mjs';
import { validateManifest } from '../scripts/validate-manifest.mjs';

const fixturePath = new URL('../examples/wix-generated-prompt.example.txt', import.meta.url);
const fixture = await readFile(fixturePath, 'utf8');
const valid = parseHandoff(fixture);

test('parses a Wix-generated handoff without inventing a business', () => {
  const m = makeManifest(valid, fixture, 'sample-client');
  assert.equal(m.business.factsStatus,'unknown');
  assert.equal(m.site.sourceArchiveInspected,false);
  assert.equal(m.wix.bindingVerified,false);
  assert.equal(validateManifest(m,fixture).length,0);
});

test('refuses mismatched dashboard site ID', () => {
  const invalid = fixture.replace('https://manage.wix.com/dashboard/11111111-1111-4111-8111-111111111111','https://manage.wix.com/dashboard/33333333-3333-4333-8333-333333333333');
  assert.throws(()=>parseHandoff(invalid),/MISMATCH/);
});

test('rejects tampered preserved prompt checksum', () => {
  const m=makeManifest(valid,fixture,'sample-client');
  assert.ok(validateManifest(m,fixture+'changed').some(x=>x.includes('sha256')));
});

test('rejects credential fields', () => {
  const m=makeManifest(valid,fixture,'sample-client');
  m.accessToken='never-write-this';
  assert.ok(validateManifest(m,fixture).some(x=>x.includes('secret')));
});

import { mkdtemp, readdir, symlink, rm, writeFile, readFile as readText } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareIntake, assertOutsideSystem } from '../scripts/intake-wix-handoff.mjs';

test('rejects unknown manifest properties according to JSON Schema', () => {
  const m = makeManifest(valid, fixture, 'sample-client');
  m.unexpected = 'should fail';
  assert.ok(validateManifest(m,fixture).some(x => x.includes('schema')));
});

test('fails closed without the preserved original handoff', () => {
  const m = makeManifest(valid, fixture, 'sample-client');
  assert.ok(validateManifest(m).some(x => x.includes('original')));
});

test('existing repository does not require a Wix download handoff', () => {
  const m = makeManifest(valid, fixture, 'sample-client');
  m.entryMode = 'existing-repository';
  m.lifecycleState = 'PREFLIGHT_COMPLETE';
  delete m.handoff;
  delete m.wix.dashboardUrl;
  assert.deepEqual(validateManifest(m), []);
});

test('unbound frontend does not require an existing Wix identity', () => {
  const m = makeManifest(valid, fixture, 'sample-client');
  m.entryMode = 'unbound-frontend';
  delete m.handoff;
  delete m.wix;
  assert.deepEqual(validateManifest(m), []);
});

test('cannot output a website project inside the toolkit checkout', () => {
  assert.throws(() => assertOutsideSystem(new URL('../clients/demo', import.meta.url).pathname), /inside/);
});

test('atomic intake cleans staging if second write fails', async () => {
  const root = await mkdtemp(join(tmpdir(), 'whps-r01-'));
  const target = join(root, 'sample-client');
  let writes = 0;
  try {
    await assert.rejects(prepareIntake(fixture,target,async (...args)=> {
      if (++writes === 2) throw new Error('simulated disk error');
      return writeFile(...args);
    }),/disk error/);
    assert.deepEqual(await readdir(root), []);
  } finally {await rm(root, {recursive:true, force:true});}
});

test('atomic intake preserves originals and refuses existing target', async () => {
  const root=await mkdtemp(join(tmpdir(),'whps-r01-'));
  const target=join(root,'sample-client');
  try {
    await prepareIntake(fixture,target);
    assert.equal(await readText(join(target,'wix-handoff.original.txt'),'utf8'),fixture);
    await assert.rejects(prepareIntake(fixture,target),/exists/);
  } finally {await rm(root,{recursive:true,force:true});}
});


test('rejects a symlinked output parent pointing into the toolkit', async () => {
  const root = await mkdtemp(join(tmpdir(), 'whps-r01-link-'));
  const parent = join(root, 'linked');
  try {
    await symlink(new URL('../examples', import.meta.url).pathname, parent, 'dir');
    await assert.rejects(prepareIntake(fixture, join(parent, 'sample-client')), /inside/);
  } finally { await rm(root, {recursive:true,force:true}); }
});
