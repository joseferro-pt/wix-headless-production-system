#!/usr/bin/env node
// WHPS-003: metadata-only, deterministic read-only planner. Never calls Wix.
import { readFile, lstat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const schemaPath=join(root,'schemas/resource-plan-input.schema.json');
const validator=join(root,'scripts/validate-json-schema.py');
const outputSchema=join(root,'schemas/resource-plan-output.schema.json');
const kinds=new Set(['form','cms-collection','booking-service','store-product','event','app','other']);
const keyPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const nonempty=x=>typeof x==='string'&&x.trim().length>0&&x.length<=256;
const has=(x,k)=>Object.hasOwn(x,k);
const key=r=>r.type+'\u0000'+r.logicalKey;
const byName=r=>r.type+'\u0000'+r.observedName;
export function assertPlanInput(b){
  const errors=[], fail=x=>errors.push(x);
  const shape=(obj,allow,required,where)=>{
    if(!isObj(obj)){fail(where+' must be object');return false;}
    for(const k of Object.keys(obj))if(!allow.includes(k))fail(where+' forbidden property '+k);
    for(const k of required)if(!has(obj,k))fail(where+' missing '+k);
    return true;
  };
  if(!shape(b,['schemaVersion','siteId','desired','observed','registry'],['schemaVersion','siteId','desired','observed'],'input'))throw Error(errors.join('; '));
  if(b.schemaVersion!=='0.1.0'||!uuidPattern.test(b.siteId||''))fail('Invalid schema version or site ID');
  const site=String(b.siteId||'').toLowerCase();
  if(shape(b.desired,['resources'],['resources'],'desired')){
    if(!Array.isArray(b.desired.resources)||b.desired.resources.length>500)fail('Invalid desired resources');
    else for(const [i,r] of b.desired.resources.entries()){
      if(!shape(r,['type','logicalKey','desiredName','wixId','intent'],['type','logicalKey','desiredName'],'desired['+i+']'))continue;
      if(!kinds.has(r.type)||!keyPattern.test(r.logicalKey||'')||!nonempty(r.desiredName))fail('Invalid desired resource '+i);
      if(has(r,'wixId')&&!nonempty(r.wixId))fail('Invalid desired Wix ID');
      if(has(r,'intent')&&!['present','retire'].includes(r.intent))fail('Unsupported intent');
    }
  }
  if(shape(b.observed,['siteId','source','capturedAt','completeness','coveredTypes','resources'],['siteId','source','capturedAt','completeness','coveredTypes','resources'],'observed')){
    if(String(b.observed.siteId||'').toLowerCase()!==site)fail('Observed site ID mismatch');
    if(!nonempty(b.observed.source))fail('Missing observed source');
    if(!['complete','partial'].includes(b.observed.completeness))fail('Invalid snapshot completeness');
    const covered=b.observed.coveredTypes;
    if(!Array.isArray(covered)||!covered.length||covered.length>7||covered.some(x=>!kinds.has(x))||new Set(covered).size!==covered.length)fail('Invalid coveredTypes');
    if(typeof b.observed.capturedAt!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(b.observed.capturedAt)||!Number.isFinite(Date.parse(b.observed.capturedAt)))fail('Invalid capturedAt');
    if(!Array.isArray(b.observed.resources)||b.observed.resources.length>2000)fail('Invalid observed resources');
    else for(const [i,r] of b.observed.resources.entries()){
      if(!shape(r,['type','wixId','observedName','revision'],['type','wixId','observedName'],'observed['+i+']'))continue;
      if(!kinds.has(r.type)||!nonempty(r.wixId)||!nonempty(r.observedName)||!covered?.includes(r.type))fail('Invalid observed resource '+i);
      if(has(r,'revision')&&!nonempty(r.revision))fail('Invalid observed revision');
    }
  }
  if(has(b,'registry')&&shape(b.registry,['schemaVersion','siteId','resources'],['schemaVersion','siteId','resources'],'registry')){
    if(b.registry.schemaVersion!=='0.1.0'||String(b.registry.siteId||'').toLowerCase()!==site)fail('Registry site ID or schema version mismatch');
    if(!Array.isArray(b.registry.resources)||b.registry.resources.length>2000)fail('Invalid registry resources');
    else for(const [i,r] of b.registry.resources.entries()){
      if(!shape(r,['type','logicalKey','wixId','state','source','observedName','observedAt','notes'],['type','logicalKey','wixId','state','source'],'registry['+i+']'))continue;
      if(!kinds.has(r.type)||!keyPattern.test(r.logicalKey||'')||!nonempty(r.wixId)||!nonempty(r.source)||!['observed','verified','untracked','missing','retired'].includes(r.state))fail('Invalid registry resource '+i);
      if(has(r,'observedName')&&r.observedName!==null&&!nonempty(r.observedName))fail('Invalid registry name');
      if(has(r,'observedAt')&&r.observedAt!==null&&(typeof r.observedAt!=='string'||!Number.isFinite(Date.parse(r.observedAt))))fail('Invalid registry timestamp');
      if(has(r,'notes')&&typeof r.notes!=='string')fail('Invalid registry notes');
    }
  }
  const uniq=(records,project,label)=>{
    if(!Array.isArray(records))return;
    const seen=new Set();
    for(const r of records){if(!isObj(r))continue;const x=project(r);if(x===undefined)continue;if(seen.has(x))fail('Duplicate '+label);seen.add(x);}
  };
  uniq(b.desired?.resources,key,'desired logical key');
  uniq(b.desired?.resources,r=>r.wixId,'desired Wix ID');
  uniq(b.observed?.resources,r=>r.wixId,'observed Wix ID');
  uniq(b.registry?.resources,key,'registry logical key');
  uniq(b.registry?.resources,r=>r.wixId,'registry Wix ID');
  if(errors.length)throw Error('Invalid planning input: '+errors.join('; '));
}
const entry=(d,action,reason,m)=>({type:d.type,logicalKey:d.logicalKey,action,reason,...(m?{wixId:m.wixId,observedName:m.observedName}:{}),approvalRequired:true});
export function planResources(b){
  assertPlanInput(b);
  const observed=b.observed.resources,desired=b.desired.resources,registry=b.registry?.resources||[];
  const obsId=new Map(observed.map(r=>[r.wixId,r]));
  const regKey=new Map(registry.map(r=>[key(r),r]));
  const regId=new Map(registry.map(r=>[r.wixId,r]));
  const names=new Map();
  for(const r of observed){const k=byName(r);names.set(k,[...(names.get(k)||[]),r]);}
  // Never propose two independent creations for the same exact type/name,
  // even when logical keys differ. These may describe one intended resource.
  const requestedNames=new Map();
  for(const d of desired){const k=d.type+'\u0000'+d.desiredName;requestedNames.set(k,(requestedNames.get(k)||0)+1);}
  const candidates=desired.map(d=>{
    const old=regKey.get(key(d)), errors=[];
    if(requestedNames.get(d.type+'\u0000'+d.desiredName)>1)
      errors.push('Multiple desired logical keys request same exact type/name; reconcile identity before planning');
    if(!b.observed.coveredTypes.includes(d.type))errors.push('Resource type not covered by snapshot');
    if(old&&['missing','retired'].includes(old.state))errors.push('Registry state requires investigation');
    if(old&&d.wixId&&old.wixId!==d.wixId)errors.push('Registry and desired IDs conflict');
    const id=d.wixId||old?.wixId, matchId=id?obsId.get(id):undefined;
    if(id&&!matchId)errors.push('Pinned/registered ID absent from observed snapshot');
    if(matchId&&matchId.type!==d.type)errors.push('Wix ID type mismatch');
    const nameMatches=id?[]:(names.get(d.type+'\u0000'+d.desiredName)||[]);
    if(!id&&nameMatches.length>1)errors.push('Ambiguous exact type/name match');
    const match=matchId?.type===d.type?matchId:!id&&nameMatches.length===1?nameMatches[0]:null;
    const owner=match?regId.get(match.wixId):null;
    if(owner&&(owner.type!==d.type||owner.logicalKey!==d.logicalKey))errors.push('Wix ID belongs to different registry key');
    if(d.intent==='retire'&&!id)errors.push('Retire requires pinned or registered ID');
    return {d,match,errors};
  });
  const claimed=new Map();
  for(const c of candidates)if(c.match)claimed.set(c.match.wixId,(claimed.get(c.match.wixId)||0)+1);
  const decisions=[];
  for(const c of candidates){
    const {d,match,errors}=c;
    if(match&&claimed.get(match.wixId)>1)errors.push('Resource claimed by multiple desired keys');
    if(errors.length){decisions.push(entry(d,'blocked',errors.join('; '),match));continue;}
    if(d.intent==='retire')decisions.push(entry(d,b.observed.completeness==='complete'?'retire':'blocked',b.observed.completeness==='complete'?'Explicit retirement intent; requires separate approval and live verification':'Retirement requires complete snapshot',match));
    else if(match&&match.observedName!==d.desiredName)decisions.push(entry(d,b.observed.completeness==='complete'?'update':'blocked',b.observed.completeness==='complete'?'Name differs; proposal only, verify Wix API and get approval':'Update requires complete snapshot',match));
    else if(match)decisions.push(entry(d,'reuse','Matched ID or uniquely exact type/name; separately verify Wix state',match));
    else if(b.observed.completeness==='complete')decisions.push(entry(d,'create','No exact match in covered complete snapshot; verify absence and permissions'));
    else decisions.push(entry(d,'blocked','Partial snapshot cannot establish resource absence'));
  }
  const associated=new Set(candidates.filter(c=>c.match).map(c=>c.match.wixId));
  for(const r of observed)if(!associated.has(r.wixId))decisions.push({type:r.type,logicalKey:null,action:'untracked',reason:'Observed without desired claim; do not mutate',wixId:r.wixId,observedName:r.observedName,approvalRequired:true});
  decisions.sort((a,b)=>a.type.localeCompare(b.type)||(a.logicalKey||a.wixId).localeCompare(b.logicalKey||b.wixId));
  const summary={create:0,reuse:0,update:0,retire:0,blocked:0,untracked:0};
  for(const x of decisions)summary[x.action]++;
  return {planVersion:1,siteId:b.siteId,observation:{source:b.observed.source,capturedAt:b.observed.capturedAt,completeness:b.observed.completeness,coveredTypes:[...b.observed.coveredTypes]},execution:'never',approval:'required-for-every-change',confidence:'unverified-user-supplied-snapshot',warnings:['Offline comparison; coverage is scoped to coveredTypes and source freshness is not certified','No Wix API was called and no backend mutation is authorised','Registry values are historical context, not proof of current state'],summary,decisions};
}
async function main(){
  const a=process.argv.slice(2);
  if(a.length!==2||a[0]!=='--input')throw Error('Usage: node scripts/plan-wix-resources.mjs --input <site-local-input.json> (prints JSON plan to stdout)');
  const f=await lstat(a[1]);if(!f.isFile()||f.size>512*1024)throw Error('Input must be a regular file of at most 512 KiB');
  const b=JSON.parse(await readFile(a[1],'utf8'));
  const run=spawnSync(process.env.WHPS_PYTHON||'python3',[validator,schemaPath],{input:JSON.stringify(b),encoding:'utf8',maxBuffer:1024*1024});
  if(run.error||run.status!==0)throw Error('JSON Schema validator unavailable: '+(run.error?.message||run.stderr?.slice(0,200)||run.status));
  const v=JSON.parse(run.stdout);
  if(!v.valid)throw Error('Schema rejected input: '+v.errors.slice(0,12).map(x=>x.path+': '+x.message).join('; '));
  const proposed=planResources(b);
  const checked=spawnSync(process.env.WHPS_PYTHON||'python3',[validator,outputSchema],{input:JSON.stringify(proposed),encoding:'utf8',maxBuffer:1024*1024});
  if(checked.error||checked.status!==0)throw Error('Output schema validator unavailable: '+(checked.error?.message||checked.stderr?.slice(0,200)||checked.status));
  const result=JSON.parse(checked.stdout);
  if(!result.valid)throw Error('Generated plan violates output contract: '+result.errors.slice(0,12).map(x=>x.path+': '+x.message).join('; '));
  process.stdout.write(JSON.stringify(proposed,null,2)+'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{process.stderr.write('Planning blocked: '+e.message+'\n');process.exitCode=1;});
