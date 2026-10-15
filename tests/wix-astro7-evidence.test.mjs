import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {evaluateWixAstro7Evidence,PREVIEW_GATES,HOSTED_GATES,ALL_GATES} from '../scripts/evaluate-wix-astro7-evidence.mjs';
const fixture=JSON.parse(await readFile(new URL('../examples/wix-astro7-evidence.synthetic.json',import.meta.url),'utf8'));
const clone=x=>structuredClone(x);
function populated(phase){
  const x=clone(fixture);
  x.phase=phase;
  x.previewAuthorization={status:'approved',reference:'synthetic:owner-approved-test-preview'};
  for(const c of x.checks)if(PREVIEW_GATES.includes(c.id))c.status='passed';
  if(phase==='published-test-site'){
    x.publishAuthorization={status:'approved',reference:'synthetic:independent-publication-go-no-go'};
    for(const c of x.checks)if(HOSTED_GATES.includes(c.id))c.status='passed';
  }
  return x;
}
test('sample contains no inferred Wix integration status and fails closed',()=>{
  const x=evaluateWixAstro7Evidence(fixture);
  assert.equal(x.state,'blocked');
  assert.equal(x.requiredGateCount,13);
  assert.equal(x.siteReleaseAuthorizedByThisTool,false);
  assert.equal(x.unrun.length,16);
});
test('operator-only preview evidence does not confer release authority',()=>{
  const r=evaluateWixAstro7Evidence(populated('preflight'));
  assert.equal(r.state,'operator-reported-preflight-complete');
  assert.equal(r.approvalIsExternallyVerified,false);
  assert.equal(r.siteReleaseAuthorizedByThisTool,false);
  assert.deepEqual(r.unrun,HOSTED_GATES);
});
test('published phase requires explicit separate authorization and all 16 evidence records',()=>{
  const x=populated('published-test-site');
  assert.equal(evaluateWixAstro7Evidence(x).state,'operator-reported-published-site-checks-complete');
  x.publishAuthorization.status='pending';
  assert.ok(evaluateWixAstro7Evidence(x).blockers.includes('independent-owner-publication-authorization-required'));
  x.publishAuthorization.status='approved';
  x.checks.find(v=>v.id==='seo-main').status='not-run';
  assert.ok(evaluateWixAstro7Evidence(x).blockers.includes('required-gate-not-reported-passed:seo-main'));
});
test('preflight rejects premature SEO and release claims',()=>{
  const x=populated('preflight');
  x.checks.find(v=>v.id==='wix-release').status='passed';
  assert.ok(evaluateWixAstro7Evidence(x).blockers.includes('preflight-must-not-claim-published-evidence:wix-release'));
  x.checks.find(v=>v.id==='wix-release').status='not-run';
  x.publishAuthorization.status='approved';
  assert.ok(evaluateWixAstro7Evidence(x).blockers.includes('separate-publication-decision-must-follow-preflight'));
});
test('duplicate/missing/unknown gates, unsupported version and extra site secrets rejected',()=>{
  const x=populated('preflight');x.checks[1].id=x.checks[0].id;
  assert.throws(()=>evaluateWixAstro7Evidence(x),/duplicate/);
  x.checks.pop();
  assert.throws(()=>evaluateWixAstro7Evidence(x),/all 16/);
  const y=populated('preflight');y.versions.astro='5.18.2';
  assert.throws(()=>evaluateWixAstro7Evidence(y),/research scope/);
  const z=populated('preflight');z.siteId='live-id';
  assert.throws(()=>evaluateWixAstro7Evidence(z),/invalid object fields/);
});
test('CLI redacts operator input and returns non-zero for unverified synthetic example',()=>{
  const path=fileURLToPath(new URL('../scripts/evaluate-wix-astro7-evidence.mjs',import.meta.url));
  const sample=fileURLToPath(new URL('../examples/wix-astro7-evidence.synthetic.json',import.meta.url));
  const result=spawnSync(process.execPath,[path,'--input',sample,'--json'],{encoding:'utf8'});
  assert.equal(result.status,1);
  assert.equal(JSON.parse(result.stdout).state,'blocked');
  assert.doesNotMatch(result.stdout,/synthetic:|siteCommit/);
  assert.equal(ALL_GATES.length,16);
});
