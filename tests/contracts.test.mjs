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
