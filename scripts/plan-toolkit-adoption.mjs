#!/usr/bin/env node
/**
 * WHPS-006: deterministic OFFLINE proposal for toolkit adoption in an
 * independent website. No writes, fetches, Git mutations or Wix calls.
 * Never confuse catalogued historical GitHub data with a fresh attestation.
 */
import {lstat,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const CATALOG=JSON.parse(await readFile(new URL('../distribution/release-catalog.json',import.meta.url),'utf8'));
const SHA=/^[0-9a-f]{40}$/;
const MODES=new Set(['wix-handoff','existing-repository','unbound-frontend']);
const COMPONENTS=new Set(['governance','validation','bootstrap-cli','resource-planner','astro-reference','site-qa']);
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
function only(x,keys,label){
  if(!isObject(x))throw new TypeError(label+' must be an object');
  for(const k of Object.keys(x))if(!keys.includes(k))throw new TypeError(label+' has unsupported fields');
}
function validatePin(x,label){
  only(x,['tag','commit','components'],label);
  if(typeof x.tag!=='string'||typeof x.commit!=='string'||!SHA.test(x.commit))
    throw new TypeError(label+' requires an exact tag and full source SHA');
  const release=CATALOG.releases.find(r=>r.tag===x.tag&&r.commit===x.commit);
  if(!release)throw new TypeError(label+' does not match the pinned published release catalog');
  if(!Array.isArray(x.components)||new Set(x.components).size!==x.components.length||
     x.components.some(c=>typeof c!=='string'||!COMPONENTS.has(c)))
    throw new TypeError(label+' requires unique known components');
  return release;
}
const rank=x=>x.tag.slice(1).split('.').map(Number);
function compare(a,b){const x=rank(a),y=rank(b);for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]-y[i];return 0;}
export function planToolkitAdoption(input){
  only(input,['planVersion','site','current','target'], 'input');
  if(input.planVersion!==1)throw new TypeError('planVersion must be 1');
  only(input.site,['entryMode','siteCommit','wixConfigurationPresent'],'site');
  if(!MODES.has(input.site.entryMode)||typeof input.site.siteCommit!=='string'||
     !SHA.test(input.site.siteCommit)||typeof input.site.wixConfigurationPresent!=='boolean')
    throw new TypeError('Invalid website source metadata');
  const targetRelease=validatePin(input.target,'target');
  const currentRelease=input.current===null?null:validatePin(input.current,'current');
  for(const c of input.target.components)
    if(!targetRelease.components.includes(c))
      throw new TypeError('Target release does not distribute requested component');
  if(input.current!==null)
    for(const c of input.current.components)
      if(!currentRelease.components.includes(c))
        throw new TypeError('Current release does not contain claimed component');
  // Different sets of installed, adapted site code must be reviewed manually.
  const currentComponents=input.current?.components??[];
  const dropped=currentComponents.filter(c=>!input.target.components.includes(c));
  const added=input.target.components.filter(c=>!currentComponents.includes(c));
  const downgrade=currentRelease!==null&&compare(targetRelease,currentRelease)<0;
  const sourceChange=currentRelease===null||targetRelease.commit!==currentRelease.commit;
  const blockers=[];
  if(downgrade)blockers.push('downgrade-requires-separate-migration-protocol');
  if(dropped.length)blockers.push('implicit-component-removal-forbidden');
  const noChange=!sourceChange&&added.length===0&&dropped.length===0;
  return {
    planVersion:1,execution:'never',siteAction:'none',
    evidence:'release-catalog-snapshot-only;fresh-GitHub-and-site-verification-required',
    approval:'required-from-independent-site-owner',
    status:blockers.length?'blocked':noChange?'no-change':'review-required',
    sourceSiteCommit:input.site.siteCommit,
    wixConfiguration:'preserve-existing-unmodified',
    current:input.current===null?null:{tag:currentRelease.tag,commit:currentRelease.commit},
    target:{tag:targetRelease.tag,commit:targetRelease.commit,annotatedTagObject:targetRelease.annotatedTagObject},
    changes:{sourceChange,addComponents:added,removeComponents:dropped},
    blockers,
    steps:[
      'Verify target annotated tag and published Release against exact SHA using the read-only public GitHub verifier',
      'Review upstream changes and site-owned diffs, local licences, Wix configuration and application API boundaries',
      'Obtain site-owner permission and keep rollback snapshot before manually adapting each chosen component',
      'Run site-local build, auth/app, accessibility, SEO and privacy checks on the resulting site commit',
      'After acceptance only, record a separate website-owned whps.adoption.json; retain original whps.lock.json unchanged',
    ],
    candidateSiteRecord:{
      recordVersion:1,toolkit:{repository:CATALOG.repository,tag:targetRelease.tag,
        commit:targetRelease.commit,components:[...input.target.components]},
      status:'candidate-unverified',verification:'required-live-github-check',
      approval:'pending',siteCommit:input.site.siteCommit,
    },
    notice:'This proposal never updates a site or certifies Wix compatibility. Verify real site evidence independently.',
  };
}
async function main(args){
  if(args.length!==3||args[0]!=='--input'||args[2]!=='--json'){
    console.error('Usage: node scripts/plan-toolkit-adoption.mjs --input <metadata.json> --json');
    process.exitCode=2;return;
  }
  try{
    const name=resolve(args[1]),info=await lstat(name);
    if(!info.isFile()||info.isSymbolicLink()||info.size>131072)
      throw new TypeError('Input must be a regular JSON file no larger than 128 KiB');
    const plan=planToolkitAdoption(JSON.parse(await readFile(name,'utf8')));
    console.log(JSON.stringify(plan,null,2));
    if(plan.status==='blocked')process.exitCode=1;
  }catch(error){
    // Redact user-supplied values. Reasons use fixed strings only.
    console.error('BLOCK: invalid or unsupported adoption metadata');
    process.exitCode=2;
  }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
  await main(process.argv.slice(2));
