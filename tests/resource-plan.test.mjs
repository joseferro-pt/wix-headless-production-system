import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { assertPlanInput, planResources } from '../scripts/plan-wix-resources.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const baseline=JSON.parse(await readFile(join(root,'examples/resource-plan.synthetic.json'),'utf8'));
const copy=x=>structuredClone(x);
const actions=x=>planResources(x).decisions.map(r=>r.action);
const row=(type,logicalKey,desiredName,more={})=>({type,logicalKey,desiredName,...more});
const syntheticId='22222222-2222-4222-8222-222222222222';

test('pure deterministic plan is a proposal and never executes',()=>{
 const b=copy(baseline),p=planResources(b);
 assert.deepEqual(p,planResources(copy(b)));
 assert.deepEqual(b,baseline);
 assert.equal(p.execution,'never');
 assert.equal(p.confidence,'unverified-user-supplied-snapshot');
 assert.deepEqual(p.summary,{create:1,reuse:1,update:0,retire:0,blocked:0,untracked:0});
 assert.ok(p.decisions.every(x=>x.approvalRequired===true));
});
test('coverage and incomplete snapshots cannot infer absence',()=>{
 const b=copy(baseline);b.observed.coveredTypes=['form'];
 assert.equal(planResources(b).summary.blocked,1);
 assert.equal(planResources(b).summary.create,0);
 b.observed.coveredTypes.push('cms-collection');b.observed.completeness='partial';
 assert.equal(planResources(b).summary.blocked,1);
 assert.equal(planResources(b).summary.create,0);
});
test('explicit retirement requires pinned Wix ID and complete snapshot',()=>{
 const b=copy(baseline);b.desired.resources=b.desired.resources.slice(0,1);
 b.desired.resources[0].intent='retire';
 assert.deepEqual(actions(b),['retire']);
 b.observed.completeness='partial';
 assert.deepEqual(actions(b),['blocked']);
 b.desired.resources[0].wixId=undefined;delete b.desired.resources[0].wixId;
 b.registry.resources=[];b.observed.completeness='complete';
 assert.deepEqual(actions(b),['blocked']);
});
test('ID match takes precedence; different observed names require update review',()=>{
 const b=copy(baseline);b.desired.resources=b.desired.resources.slice(0,1);
 b.desired.resources[0].desiredName='New enquiry name';
 assert.deepEqual(actions(b),['update']);
 assert.match(planResources(b).decisions[0].reason,/proposal only/);
 b.observed.completeness='partial';
 assert.deepEqual(actions(b),['blocked']);
});
test('name match only when unique within exact type',()=>{
 const b=copy(baseline);b.registry.resources=[];
 b.desired.resources=[row('form','new-key','Website enquiry')];
 assert.deepEqual(actions(b),['reuse']);
 b.observed.resources.push({type:'form',wixId:'another-form-id',observedName:'Website enquiry'});
 const plan=planResources(b);
 assert.equal(plan.summary.blocked,1);
 assert.equal(plan.summary.retire,0);
});
test('observed without desired stays untracked and never implicitly retires',()=>{
 const b=copy(baseline);b.desired.resources=[];
 assert.deepEqual(actions(b),['untracked']);
});
test('pinned absent Wix ID blocks, even if another observed name matches',()=>{
 const b=copy(baseline);b.desired.resources=b.desired.resources.slice(0,1);
 b.observed.resources=[{type:'form',wixId:'new-identity',observedName:'Website enquiry'}];
 assert.equal(planResources(b).summary.blocked,1);
 assert.equal(planResources(b).summary.create,0);
});
test('site ID/type/registry conflicts block or reject',()=>{
 const b=copy(baseline);b.observed.siteId='33333333-3333-4333-8333-333333333333';
 assert.throws(()=>planResources(b),/site ID mismatch/);
 const c=copy(baseline);c.observed.resources[0].type='cms-collection';
 assert.equal(planResources(c).summary.blocked,1);
 const e=copy(baseline);e.desired.resources[0].wixId='different-id';
 assert.equal(planResources(e).summary.blocked,1);
 const f=copy(baseline);f.registry.resources[0].state='retired';
 assert.equal(planResources(f).summary.blocked,1);
});
test('cannot claim a Wix ID under a different registry logical key',()=>{
 const b=copy(baseline);b.desired.resources=[row('form','someone-else','Website enquiry')];
 assert.equal(planResources(b).summary.blocked,1);
});
test('duplicate observed IDs, desired keys or registry keys fail closed',()=>{
 const b=copy(baseline);b.observed.resources.push(copy(b.observed.resources[0]));
 assert.throws(()=>planResources(b),/Duplicate observed Wix ID/);
 const c=copy(baseline);c.desired.resources.push(copy(c.desired.resources[0]));
 assert.throws(()=>planResources(c),/Duplicate desired/);
 const d=copy(baseline);d.registry.resources.push(copy(d.registry.resources[0]));
 assert.throws(()=>planResources(d),/Duplicate registry/);
});
test('two desired keys cannot claim a single observed resource',()=>{
 const b=copy(baseline);b.registry.resources=[];
 b.desired.resources=[row('form','key-one','Website enquiry'),row('form','key-two','Website enquiry')];
 assert.equal(planResources(b).summary.blocked,2);
});
test('unknown fields, unsupported intent and missing completeness are invalid',()=>{
 const b=copy(baseline);b.observed.resources[0].customerEmail='never';
 assert.throws(()=>planResources(b),/forbidden property/);
 const c=copy(baseline);c.desired.resources[0].intent='delete';
 assert.throws(()=>planResources(c),/Unsupported intent/);
 const d=copy(baseline);delete d.observed.completeness;
 assert.throws(()=>planResources(d),/completeness/);
 const e=copy(baseline);delete e.observed.coveredTypes;
 assert.throws(()=>planResources(e),/coveredTypes/);
});
test('CLI validates schema and emits only JSON plan from supplied synthetic metadata',()=>{
 const p=spawnSync(process.execPath,[join(root,'scripts/plan-wix-resources.mjs'),'--input',join(root,'examples/resource-plan.synthetic.json')],{encoding:'utf8'});
 assert.equal(p.status,0,p.stderr);
 const plan=JSON.parse(p.stdout);assert.equal(plan.summary.reuse,1);assert.equal(plan.summary.create,1);
 assert.match(plan.warnings.join(' '),/No Wix API/);
});
test('CLI fails closed on forbidden payload fields',async()=>{
 const d=await mkdtemp(join(tmpdir(),'whps-003-'));
 try {
  const b=copy(baseline);b.observed.resources[0].submissions=[];
  const f=join(d,'input.json');await writeFile(f,JSON.stringify(b));
  const run=spawnSync(process.execPath,[join(root,'scripts/plan-wix-resources.mjs'),'--input',f],{encoding:'utf8'});
  assert.notEqual(run.status,0);
  assert.match(run.stderr,/Schema rejected input|Planning blocked/);
 }finally{await rm(d,{recursive:true,force:true});}
});

test('same type/name under two different desired keys never proposes duplicate creations',()=>{
 const b=copy(baseline);b.desired.resources=[
   row('cms-collection','services-one','Services'),
   row('cms-collection','services-two','Services'),
 ];
 const plan=planResources(b);
 assert.equal(plan.summary.create,0);
 assert.equal(plan.summary.blocked,2);
 assert.ok(plan.decisions.filter(x=>x.action==='blocked').every(x=>/Multiple desired logical keys/.test(x.reason)));
});
test('duplicate desired type/name blocks even with different pinned IDs',()=>{
 const b=copy(baseline);b.desired.resources=[
   row('form','first-form','Website enquiry',{wixId:syntheticId}),
   row('form','second-form','Website enquiry',{wixId:'unused-other-id'}),
 ];
 b.registry.resources=[];
 const plan=planResources(b);
 assert.equal(plan.summary.blocked,2);
 assert.equal(plan.summary.create,0);
});
test('same desired name for different resource types remains independent',()=>{
 const b=copy(baseline);b.desired.resources=[
   row('form','first-form','Services'),
   row('cms-collection','services','Services')
 ];
 b.registry.resources=[];b.observed.resources=[];
 const plan=planResources(b);assert.equal(plan.summary.create,2);
});
test('CLI verifies its own emitted output against the output schema',()=>{
 const run=spawnSync(process.execPath,[join(root,'scripts/plan-wix-resources.mjs'),'--input',join(root,'examples/resource-plan.synthetic.json')],{encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
 const p=JSON.parse(run.stdout);
 const validate=spawnSync('python3',[join(root,'scripts/validate-json-schema.py'),join(root,'schemas/resource-plan-output.schema.json')],{input:JSON.stringify(p),encoding:'utf8'});
 assert.equal(validate.status,0,validate.stderr);
 assert.equal(JSON.parse(validate.stdout).valid,true);
});
