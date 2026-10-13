import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {evaluateSiteQa,GATES} from '../scripts/evaluate-site-qa.mjs';

const example=JSON.parse(await readFile(new URL('../examples/site-qa.synthetic.json',import.meta.url),'utf8'));
const clone=x=>structuredClone(x);
const completed=()=>{
  const r=clone(example);
  r.checks=r.checks.map(({id})=>({id,status:'passed',evidence:'synthetic:test-evidence'}));
  return r;
};
test('synthetic report remains incomplete and does not claim Wix proof',()=>{
  const r=evaluateSiteQa(example);
  assert.equal(r.state,'incomplete');
  assert.equal(r.evidenceAuthority,'unverified-site-operator-records');
  assert.equal(r.operation,'read-only-no-wix-access-or-deployment');
  assert.equal(r.unrun.length,8);
  assert.equal(GATES.length,11);
});
test('complete records still require independent owner approval',()=>{
  const r=evaluateSiteQa(completed());
  assert.equal(r.state,'awaiting-owner-approval');
  assert.match(r.notice,/never verifies Wix binding/);
});
test('approved operator claims are not externally attested',()=>{
  const r=completed();r.approval={status:'approved',evidence:'synthetic:approval-reference'};
  const out=evaluateSiteQa(r);
  assert.equal(out.state,'recorded-approval-for-review');
  assert.equal(out.evidenceAuthority,'unverified-site-operator-records');
});
test('failed checks, rejected approval and premature publication are blocked',()=>{
  const r=completed();r.checks[0].status='failed';
  assert.deepEqual(evaluateSiteQa(r).blockers,['source']);
  r.checks[0].status='passed';
  r.approval.status='rejected';
  assert.ok(evaluateSiteQa(r).blockers.includes('owner-rejected'));
  r.approval.status='pending';r.deployment={status:'reported-published',evidence:'synthetic:release-report'};
  assert.ok(evaluateSiteQa(r).blockers.includes('publication-without-recorded-approval'));
});
test('Wix-managed production cannot ignore its binding evidence',()=>{
  const r=completed();r.stage='production';r.mode='wix-managed-astro';
  const c=r.checks.find(x=>x.id==='wix-binding');
  c.status='not-applicable';delete c.evidence;c.reason='Synthetic omitted Wix binding';
  assert.ok(evaluateSiteQa(r).blockers.includes('production-wix-binding-not-reported-passed'));
});
test('production does not accept not-applicable for core quality gates',()=>{
  const r=completed();r.stage='production';
  const c=r.checks.find(x=>x.id==='security');
  c.status='not-applicable';delete c.evidence;c.reason='Synthetic site security not yet tested';
  assert.ok(evaluateSiteQa(r).blockers.includes('production-required-gate-not-passed:security'));
});
test('duplicate, unknown, missing or extra fields fail closed',()=>{
  const r=completed();r.checks[1].id='source';
  assert.throws(()=>evaluateSiteQa(r),/duplicate gate/);
  r.checks[1].id='arbitrary';
  assert.throws(()=>evaluateSiteQa(r),/unknown gate/);
  r.checks.pop();
  assert.throws(()=>evaluateSiteQa(r),/all 11/);
  const x=completed();x.token='not-allowed';
  assert.throws(()=>evaluateSiteQa(x),/unexpected field/);
});
test('passed/NA gates and approval need evidence or reason',()=>{
  const r=completed();delete r.checks[0].evidence;
  assert.throws(()=>evaluateSiteQa(r),/needs evidence/);
  r.checks[0]={id:'source',status:'not-applicable'};
  assert.throws(()=>evaluateSiteQa(r),/needs reason/);
  r.checks[0].reason='Synthetic no source needed';
  assert.equal(evaluateSiteQa(r).state,'awaiting-owner-approval');
  r.approval.status='approved';
  assert.throws(()=>evaluateSiteQa(r),/approval needs evidence/);
});
test('CLI emits redacted outcome and nonzero incomplete exit',()=>{
  const script=fileURLToPath(new URL('../scripts/evaluate-site-qa.mjs',import.meta.url));
  const sample=fileURLToPath(new URL('../examples/site-qa.synthetic.json',import.meta.url));
  const p=spawnSync(process.execPath,[script,'--input',sample,'--json'],{encoding:'utf8'});
  assert.equal(p.status,1);
  const output=JSON.parse(p.stdout);
  assert.equal(output.state,'incomplete');
  assert.doesNotMatch(p.stdout,/Synthetic unbound Astro/);
});
