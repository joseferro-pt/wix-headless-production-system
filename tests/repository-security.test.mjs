import test from 'node:test';
import assert from 'node:assert/strict';
import { scanPath, scanText, scanRepository, trackedFiles } from '../scripts/check-repository-boundary.mjs';
import { readOriginalPrompt } from '../scripts/validate-manifest.mjs';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const categories = findings => findings.map(x=>x.code);

test('the complete Git-tracked toolkit passes the boundary scanner', async () => {
  assert.deepEqual(await scanRepository(), []);
  assert.ok(trackedFiles().some(x=>x.path==='.github/workflows/validate.yml'));
});

test('blocks site-specific files anywhere in the toolkit', () => {
  for (const path of ['wix.config.json','blueprints/site/wix.config.json','site.manifest.json',
    'sites/acme/README.md','.env','.env.local','work/client-projects/a/index.html',
    'incoming/real-site.zip','fixtures/client/wix.resources.json']) {
    assert.ok(scanPath(path).length>0,path);
  }
});

test('permits site-neutral sources and synthetic identities', () => {
  for (const path of ['.github/workflows/validate.yml','schemas/site-manifest.schema.json',
    'blueprints/site/AGENTS.md','examples/wix.resources.example.json', 'frontend/astro-primitives/src/layouts/SiteFrame.astro','scripts/check-repository-boundary.mjs'])
    assert.deepEqual(scanPath(path), [], path);
  assert.deepEqual(scanText('examples/fixture.txt','11111111-1111-4111-8111-111111111111'),[]);
});

test('rejects non-fixture identifiers even inside hidden GitHub workflow files', () => {
  const id=['12345678','abcd','4eef','8abc','1234567890ab'].join('-');
  assert.ok(categories(scanText('.github/workflows/deploy.yml',`siteId: ${id}`)).includes('non-synthetic-wix-identifier'));
});

test('reports high-confidence credential signatures without ever echoing values', () => {
  const candidates=[
    ['github-credential','ghp_'+'A'.repeat(36)],
    ['github-credential','github_pat_'+'a'.repeat(36)],
    ['aws-access-key','AKIA'+'A'.repeat(16)],
    ['private-key','-----BEGIN '+'PRIVATE KEY-----'],
    ['wix-credential-assignment','WIX_CLIENT_SECRET='+'sensitive-value-for-test'],
  ];
  for(const [code,secret] of candidates){
    const found=scanText('test.txt',secret);
    assert.ok(categories(found).includes(code),code);
    assert.ok(!JSON.stringify(found).includes(secret),`leaked detected ${code}`);
  }
});

test('allows documented placeholder assignments without false positives', () => {
  for(const placeholder of ['<token>','${TOKEN}','REDACTED','placeholder']) {
    assert.deepEqual(scanText('docs/synthetic.md',`WIX_API_KEY=${placeholder}`),[]);
  }
});

test('preserved Wix prompt cannot be loaded via symlink outside the client repository',async()=>{
  const base=await mkdtemp(join(tmpdir(),'whps-synthetic-symlink-'));
  const site=join(base,'site');
  try {
    await mkdir(site);
    const file=join(base,'outside.txt');
    await writeFile(file,'synthetic fixture only');
    await symlink(file,join(site,'handoff.txt'));
    await assert.rejects(readOriginalPrompt(join(site,'site.manifest.json'),'handoff.txt'),/outside/);
  } finally { await rm(base,{recursive:true,force:true}); }
});
