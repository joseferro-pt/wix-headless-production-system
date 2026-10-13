import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {planToolkitAdoption} from '../scripts/plan-toolkit-adoption.mjs';

const baseline=JSON.parse(await readFile(new URL('../examples/toolkit-adoption.synthetic.json',import.meta.url),'utf8'));
const copy=x=>structuredClone(x);
test('offline proposal pins exact published source but never performs site changes',()=>{
  const input=copy(baseline),out=planToolkitAdoption(input);
  assert.deepEqual(input,baseline);
  assert.deepEqual(out,planToolkitAdoption(copy(input)));
  assert.equal(out.status,'review-required');
  assert.equal(out.execution,'never');
  assert.equal(out.siteAction,'none');
  assert.equal(out.approval,'required-from-independent-site-owner');
  assert.equal(out.target.tag,'v0.2.1');
  assert.equal(out.candidateSiteRecord.approval,'pending');
  assert.match(out.evidence,/fresh-GitHub/);
  assert.deepEqual(out.changes.addComponents,['astro-reference']);
});
test('rejects unlisted or invented future releases, and floating main',()=>{
  for(const tag of ['main','v0.3.0','v0.2.2']){
    const p=copy(baseline);p.target.tag=tag;
    assert.throws(()=>planToolkitAdoption(p),/published release catalog/);
  }
  const p=copy(baseline);p.target.commit='1'.repeat(40);
  assert.throws(()=>planToolkitAdoption(p),/published release catalog/);
});
test('rejects components not shipped by exact tag',()=>{
  const p=copy(baseline);p.target.components.push('site-qa');
  assert.throws(()=>planToolkitAdoption(p),/does not distribute/);
  p.target.components.pop();p.target.tag='v0.2.0';
  p.target.commit='d17abe627f27808611218d0d2f01dd977030913a';
  assert.throws(()=>planToolkitAdoption(p),/does not distribute/);
});
test('downgrade blocks, no implicit removal, unchanged is no-change',()=>{
  const p=copy(baseline);
  p.current={...p.target,components:['governance','validation','astro-reference']};
  p.target={tag:'v0.2.0',commit:'d17abe627f27808611218d0d2f01dd977030913a',
    components:['governance','validation']};
  const bad=planToolkitAdoption(p);
  assert.ok(bad.blockers.includes('downgrade-requires-separate-migration-protocol'));
  assert.ok(bad.blockers.includes('implicit-component-removal-forbidden'));
  p.target=copy(p.current);
  assert.equal(planToolkitAdoption(p).status,'no-change');
});
test('new and existing site modes remain metadata-only',()=>{
  for(const entryMode of ['wix-handoff','existing-repository','unbound-frontend']){
    const p=copy(baseline);p.current=null;p.site.entryMode=entryMode;
    const out=planToolkitAdoption(p);
    assert.equal(out.status,'review-required');
    assert.equal(out.wixConfiguration,'preserve-existing-unmodified');
    assert.equal(out.current,null);
  }
});
test('malformed input, duplicate components and suspicious fields fail closed',()=>{
  const p=copy(baseline);p.target.components.push(p.target.components[0]);
  assert.throws(()=>planToolkitAdoption(p),/unique known components/);
  p.target.components=['governance'];p.site.extra='unexpected';
  assert.throws(()=>planToolkitAdoption(p),/unsupported fields/);
  delete p.site.extra;p.site.siteCommit='not-sha';
  assert.throws(()=>planToolkitAdoption(p),/metadata/);
});
test('CLI is strictly offline and emits JSON plan from explicit synthetic fixture',()=>{
  const script=fileURLToPath(new URL('../scripts/plan-toolkit-adoption.mjs',import.meta.url));
  const file=fileURLToPath(new URL('../examples/toolkit-adoption.synthetic.json',import.meta.url));
  const result=spawnSync(process.execPath,[script,'--input',file,'--json'],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const parsed=JSON.parse(result.stdout);
  assert.equal(parsed.status,'review-required');
  assert.equal(parsed.execution,'never');
});
test('CLI rejects invalid and oversized input without writing',async()=>{
  const script=fileURLToPath(new URL('../scripts/plan-toolkit-adoption.mjs',import.meta.url));
  const path=await mkdtemp(join(tmpdir(),'whps-adoption-test-'));
  try{
    const file=join(path,'bad.json');
    await writeFile(file,'{"planVersion":999}');
    const result=spawnSync(process.execPath,[script,'--input',file,'--json'],{encoding:'utf8'});
    assert.equal(result.status,2);
    assert.doesNotMatch(result.stderr,/999/);
  }finally{await rm(path,{recursive:true,force:true})}
});
