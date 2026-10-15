#!/usr/bin/env node
/**
 * WHPS-COMPAT-008: Read-only, offline evaluation of operator-REPORTED
 * evidence about a separately owned Wix-managed Astro 7 test website.
 * Never connects to Wix, reads a website tree, or releases/deploys code.
 */
import {lstat,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const PREVIEW_GATES=Object.freeze(["source-lock","wix-project-binding","wix-build","wix-preview","visitor-auth","member-auth","permission-denial","cms-read","business-app-read","react-hydration","tailwind-styling","accessibility","reserved-routes"]);
export const HOSTED_GATES=Object.freeze(["seo-main","seo-item","wix-release"]);
export const ALL_GATES=Object.freeze([...PREVIEW_GATES,...HOSTED_GATES]);
const STATUSES=new Set(['passed','failed','not-run']);
const AUTH=new Set(['approved','pending','rejected']);
const FORTY=/^[a-f0-9]{40}$/;
const VERSION=/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
function fields(x,expected,name){
  if(!isObject(x)||Object.keys(x).some(k=>!expected.includes(k))||
    expected.some(k=>!own(x,k)))throw new TypeError(name+': invalid object fields');
}
function reference(x){return typeof x==='string'&&x.trim().length>=3&&x.length<=512&&!/[\r\n]/.test(x);}
function auth(x,label){
  fields(x,['status','reference'],label);
  if(!AUTH.has(x.status)||!reference(x.reference))throw new TypeError(label+': invalid');
}
export function evaluateWixAstro7Evidence(input){
  fields(input,['recordVersion','phase','environment','siteCommit','versions','previewAuthorization','publishAuthorization','checks'], 'record');
  if(input.recordVersion!==1||!['preflight','published-test-site'].includes(input.phase)||
    input.environment!=='dedicated-disposable-wix-test-site'||
    !FORTY.test(input.siteCommit))throw new TypeError('record: invalid scope or commit');
  fields(input.versions,['astro','astroReact','react','tailwind','node'], 'versions');
  for(const k of ['astro','astroReact','react','tailwind','node']){
    if(!VERSION.test(input.versions[k]))throw new TypeError('versions: invalid version');
  }
  if(Number(input.versions.astro.split('.')[0])!==7||
    Number(input.versions.astroReact.split('.')[0])!==7||
    Number(input.versions.react.split('.')[0])!==19||
    Number(input.versions.tailwind.split('.')[0])!==4||
    Number(input.versions.node.split('.')[0])!==22)
    throw new TypeError('versions: outside Astro 7 research scope');
  auth(input.previewAuthorization,'previewAuthorization');
  auth(input.publishAuthorization,'publishAuthorization');
  if(!Array.isArray(input.checks)||input.checks.length!==ALL_GATES.length)
    throw new TypeError('checks: all 16 gate records required');
  const checked=new Map();
  for(const c of input.checks){
    fields(c,['id','status','reference'],'check');
    if(!ALL_GATES.includes(c.id)||checked.has(c.id)||!STATUSES.has(c.status))
      throw new TypeError('checks: unexpected, duplicate or invalid gate');
    if(!reference(c.reference))throw new TypeError('check: invalid evidence reference');
    checked.set(c.id,c.status);
  }
  const blockers=[];
  const required=input.phase==='preflight'?PREVIEW_GATES:ALL_GATES;
  for(const k of required){
    if(checked.get(k)!=='passed')blockers.push('required-gate-not-reported-passed:'+k);
  }
  if(input.previewAuthorization.status!=='approved')
    blockers.push('independent-owner-preview-authorization-required');
  if(input.phase==='preflight'){
    for(const k of HOSTED_GATES)
      if(checked.get(k)!=='not-run')blockers.push('preflight-must-not-claim-published-evidence:'+k);
    if(input.publishAuthorization.status==='approved')
      blockers.push('separate-publication-decision-must-follow-preflight');
  }else{
    if(input.publishAuthorization.status!=='approved')
      blockers.push('independent-owner-publication-authorization-required');
  }
  for(const k of ALL_GATES)
    if(checked.get(k)==='failed'&&!blockers.includes('reported-failed-gate:'+k))
      blockers.push('reported-failed-gate:'+k);
  return Object.freeze({
    recordVersion:1,phase:input.phase,
    state:blockers.length?'blocked':input.phase==='preflight'?'operator-reported-preflight-complete':'operator-reported-published-site-checks-complete',
    evidenceAuthority:'unverified-operator-records-in-independent-site-repository',
    operation:'offline-read-only-no-wix-operations',
    siteReleaseAuthorizedByThisTool:false,
    approvalIsExternallyVerified:false,
    requiredGateCount:required.length,
    blockers,unrun:ALL_GATES.filter(k=>checked.get(k)==='not-run'),
    notice:'An accepted report is not proof of Wix connectivity, approved publication, security, performance, or real site compatibility.',
  });
}
async function main(args){
  if(args.length!==3||args[0]!=='--input'||args[2]!=='--json'){
    console.error('Usage: node scripts/evaluate-wix-astro7-evidence.mjs --input <site-local.json> --json');
    process.exitCode=2;return;
  }
  try{
    const filename=resolve(args[1]),stat=await lstat(filename);
    if(!stat.isFile()||stat.isSymbolicLink()||stat.size>131072)
      throw new TypeError('invalid evidence file');
    const report=evaluateWixAstro7Evidence(JSON.parse(await readFile(filename,'utf8')));
    console.log(JSON.stringify(report,null,2));
    if(report.state==='blocked')process.exitCode=1;
  }catch{
    // No output from untrusted evidence: might contain private website data.
    console.error('BLOCK: malformed or unsupported site-local evidence');
    process.exitCode=2;
  }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
  await main(process.argv.slice(2));
