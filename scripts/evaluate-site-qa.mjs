#!/usr/bin/env node
/**
 * WHPS-005: Offline analysis of OPERATOR-REPORTED site QA evidence.
 * Never reads Wix, network state, client credentials or real-site repositories
 * except for the explicit single local JSON file passed by the caller.
 */
import { lstat, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const GATES=Object.freeze([
  'source','build','wix-binding','wix-permissions','wix-app-flows',
  'accessibility-automated','accessibility-manual','responsive','seo','performance','security',
]);
const STATUSES=new Set(['passed','failed','not-run','not-applicable']);
const MODES=new Set(['wix-managed-astro','unbound-astro','other-headless']);
const APPROVALS=new Set(['approved','pending','rejected']);
const DEPLOYMENTS=new Set(['not-attempted','reported-published','reported-failed']);
const sha=/^[0-9a-f]{40}$/;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const isRecord=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function fields(x,keys,where) {
  if(!isRecord(x))throw new TypeError(where+': expected an object');
  for(const k of Object.keys(x))if(!keys.includes(k))throw new TypeError(where+': unexpected field');
}
function ref(x) {return typeof x==='string'&&x.length<=1024&&x.trim().length>=3&&!/[\r\n]/.test(x);}

/** Structure only: no external evidence attestation or deployment authorisation. */
export function evaluateSiteQa(input) {
  const rootFields=['reportVersion','mode','stage','siteCommit','checks','approval','deployment'];
  fields(input,rootFields,'report');
  for(const key of rootFields)if(!own(input,key))throw new TypeError('report: missing '+key);
  if(input.reportVersion!==1)throw new TypeError('reportVersion: expected 1');
  if(!MODES.has(input.mode))throw new TypeError('mode: unsupported');
  if(!['preview','production'].includes(input.stage))throw new TypeError('stage: unsupported');
  if(typeof input.siteCommit!=='string'||!sha.test(input.siteCommit))throw new TypeError('siteCommit: expected full Git SHA');
  if(!Array.isArray(input.checks)||input.checks.length!==GATES.length)
    throw new TypeError('checks: all 11 gate records required');
  const seen=new Map();
  for(const c of input.checks) {
    fields(c,['id','status','evidence','reason'],'check');
    if(!GATES.includes(c.id))throw new TypeError('check: unknown gate identifier');
    if(seen.has(c.id))throw new TypeError('check: duplicate gate '+c.id);
    if(!STATUSES.has(c.status))throw new TypeError('check: invalid status for '+c.id);
    if(own(c,'evidence')&&!ref(c.evidence))throw new TypeError('check: invalid evidence for '+c.id);
    if(own(c,'reason')&&!ref(c.reason))throw new TypeError('check: invalid reason for '+c.id);
    if(c.status==='passed'&&!ref(c.evidence))throw new TypeError('check: passing gate needs evidence for '+c.id);
    if(c.status==='not-applicable'&&!ref(c.reason))throw new TypeError('check: not-applicable gate needs reason for '+c.id);
    seen.set(c.id,c.status);
  }
  for(const gate of GATES)if(!seen.has(gate))throw new TypeError('checks: missing '+gate);
  fields(input.approval,['status','evidence'],'approval');
  if(!APPROVALS.has(input.approval.status))throw new TypeError('approval: invalid status');
  if(own(input.approval,'evidence')&&!ref(input.approval.evidence))throw new TypeError('approval: invalid evidence');
  if(input.approval.status==='approved'&&!ref(input.approval.evidence))throw new TypeError('approval: approval needs evidence');
  fields(input.deployment,['status','evidence'],'deployment');
  if(!DEPLOYMENTS.has(input.deployment.status))throw new TypeError('deployment: invalid status');
  if(own(input.deployment,'evidence')&&!ref(input.deployment.evidence))throw new TypeError('deployment: invalid evidence');
  if(input.deployment.status!=='not-attempted'&&!ref(input.deployment.evidence))
    throw new TypeError('deployment: reported outcome needs evidence');

  const failed=GATES.filter(g=>seen.get(g)==='failed');
  const unrun=GATES.filter(g=>seen.get(g)==='not-run');
  const blockers=[...failed];
  if(input.stage==='production') {
    for(const gate of ['source','build','accessibility-automated','accessibility-manual','responsive','seo','security'])
      if(seen.get(gate)!=='passed')blockers.push('production-required-gate-not-passed:'+gate);
  }
  if(input.stage==='production'&&input.mode==='wix-managed-astro'&&seen.get('wix-binding')!=='passed')
    blockers.push('production-wix-binding-not-reported-passed');
  if(input.deployment.status==='reported-published'&&input.approval.status!=='approved')
    blockers.push('publication-without-recorded-approval');
  if(input.approval.status==='rejected')blockers.push('owner-rejected');
  const state=blockers.length?'blocked':unrun.length?'incomplete':
    input.approval.status==='pending'?'awaiting-owner-approval':'recorded-approval-for-review';
  return Object.freeze({
    reportVersion:1,
    evidenceAuthority:'unverified-site-operator-records',
    operation:'read-only-no-wix-access-or-deployment',
    state,
    reportedGates:Object.fromEntries(GATES.map(g=>[g,seen.get(g)])),
    blockers,unrun,ownerApproval:input.approval.status,
    reportedDeployment:input.deployment.status,
    notice:'This tool never verifies Wix binding, confirms a deployment or grants release permission.',
  });
}
async function main(args) {
  if(args.length!==3||args[0]!=='--input'||args[2]!=='--json'){
    console.error('Usage: node scripts/evaluate-site-qa.mjs --input <site-qa.json> --json');
    process.exitCode=2;return;
  }
  try {
    const p=resolve(args[1]),info=await lstat(p);
    if(!info.isFile()||info.isSymbolicLink()||info.size>262144)
      throw new TypeError('input must be a regular JSON file up to 256 KiB');
    const outcome=evaluateSiteQa(JSON.parse(await readFile(p,'utf8')));
    console.log(JSON.stringify(outcome,null,2));
    if(['blocked','incomplete'].includes(outcome.state))process.exitCode=1;
  }catch(e){
    // Never echo raw site evidence to stdout/stderr.
    console.error('BLOCK: QA record invalid ('+(e instanceof SyntaxError?'invalid JSON':e.message)+')');
    process.exitCode=2;
  }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
  await main(process.argv.slice(2));
