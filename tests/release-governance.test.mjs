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

test('unaccepted licence prevents release readiness even when all policy files exist',async()=>{
  const findings=await checkReadiness(root,{release:true,version:'v0.1.0'});
  assert.ok(findings.some(x=>x.includes('not explicitly accepted')));
  assert.ok(findings.some(x=>x.includes('LICENSE')));
  assert.ok(findings.some(x=>x.includes('CHANGELOG')));
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
