import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { checkReadiness, REQUIRED_POLICY_FILES } from '../scripts/check-release-readiness.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('policy mode verifies that repository governance is wired into CI', async()=>{
  assert.deepEqual(await checkReadiness(root),[]);
});

test('Apache-2.0 accepted license and release notes satisfy offline v0.1.0 gate', async()=>{
  assert.deepEqual(await checkReadiness(root,{release:true,version:'v0.1.0'}),[]);
});

test('unaccepted or missing licence fails closed in isolated temporary checkout', async()=>{
  const dir=await mkdtemp(join(tmpdir(),'whps-r05-license-'));
  try{
    for(const name of REQUIRED_POLICY_FILES){
      const target=join(dir,name);
      await mkdir(dirname(target),{recursive:true});
      await writeFile(target,await readFile(join(root,name),'utf8'));
    }
    await writeFile(join(dir,'CHANGELOG.md'),'## v0.1.0\n');
    const missing=await checkReadiness(dir,{release:true,version:'v0.1.0'});
    assert.ok(missing.some(x=>x.includes('LICENSE')));
    await writeFile(join(dir,'LICENSE'),'synthetic licence placeholder');
    const decision=await readFile(join(dir,'docs/13-LICENSING-DECISION.md'),'utf8');
    await writeFile(join(dir,'docs/13-LICENSING-DECISION.md'),decision.replace('**Status:** Accepted','**Status:** Proposed'));
    const pending=await checkReadiness(dir,{release:true,version:'v0.1.0'});
    assert.ok(pending.some(x=>x.includes('not explicitly accepted')));
  } finally { await rm(dir,{recursive:true,force:true}); }
});

test('malformed SemVer tags are rejected in release mode', async()=>{
  const findings=await checkReadiness(root,{release:true,version:'main'});
  assert.ok(findings.some(x=>x.includes('SemVer')));
});

test('policy check fails closed on missing files and missing CI governance gate',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'whps-r04-gate-'));
  try{
    for(const name of REQUIRED_POLICY_FILES){
      const target=join(dir,name);
      await mkdir(dirname(target),{recursive:true});
      await writeFile(target, name.endsWith('validate.yml')?'permissions:\n  contents: write\n':'fixture\n');
    }
    await rm(join(dir,'SECURITY.md'));
    const errors=await checkReadiness(dir);
    assert.ok(errors.some(x=>x.includes('SECURITY.md')));
    assert.ok(errors.some(x=>x.includes('read-only')));
    assert.ok(errors.some(x=>x.includes('Boundary check')));
  }finally{await rm(dir,{recursive:true,force:true});}
});

test('v0.2.0 offline release candidate has licence, changelog and versioned notes',async()=>{
  assert.deepEqual(await checkReadiness(root,{release:true,version:'v0.2.0'}),[]);
});
test('future tag with no approved release notes cannot pass readiness',async()=>{
  const errors=await checkReadiness(root,{release:true,version:'v0.3.0'});
  assert.ok(errors.some(x=>/Version-specific release notes/.test(x)));
});
