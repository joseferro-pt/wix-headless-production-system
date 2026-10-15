#!/usr/bin/env node
/** Offline, read-only structural dependency policy check. NOT a vulnerability scan. */
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const semverMajor=x=>typeof x==='string'&&/^\d+\.\d+\.\d+/.test(x)?Number(x.match(/^(\d+)/)[1]):null;
const rangeMajor=x=>typeof x==='string'&&/^\^\d+\.\d+\.\d+$/.test(x)?Number(x.match(/^\^(\d+)/)[1]):null;
export function inspectDependencyPolicy(manifest,lock,policy){
  const issues=[];
  const bad=c=>issues.push(c);
  if(!isObj(policy)||policy.policyVersion!==1||policy.scope!=='offline-synthetic-astro-reference-only'||
     policy.allowedRegistry!=='https://registry.npmjs.org/'||!isObj(policy.dependencyMajorLines))
     return {valid:false,issues:['invalid-reviewed-policy']};
  if(!isObj(manifest)||!isObj(lock))return {valid:false,issues:['invalid-package-or-lockfile']};
  if(manifest.private!==true||manifest.type!=='module')bad('reference-must-be-private-module');
  if(manifest.engines?.node!==policy.enginesNode)bad('node-engine-baseline-mismatch');
  if(lock.lockfileVersion!==3||lock.name!==manifest.name||!isObj(lock.packages)||!isObj(lock.packages['']))
     return {valid:false,issues:[...issues,'invalid-lockfile-format']};
  const root=lock.packages[''];
  for(const section of ['dependencies','devDependencies']){
    if(!isObj(manifest[section])||!isObj(root[section])){bad('invalid-root-dependency-section');continue;}
    const norm=x=>JSON.stringify(Object.fromEntries(Object.entries(x).sort()));
    if(norm(manifest[section])!==norm(root[section]))bad('lockfile-manifest-drift');
    for(const name of Object.keys(manifest[section]))
      if(name.startsWith('@wix/')||name.startsWith('wix-'))bad('wix-sdk-in-synthetic-reference');
  }
  if(root.engines?.node!==manifest.engines?.node)bad('lockfile-node-engine-drift');
  for(const [name,major] of Object.entries(policy.dependencyMajorLines)){
    if(!Number.isSafeInteger(major)||major<1){bad('invalid-major-policy');continue;}
    if(rangeMajor(manifest.dependencies?.[name])!==major)bad('unreviewed-direct-major:'+name);
    if(semverMajor(lock.packages['node_modules/'+name]?.version)!==major)
      bad('unreviewed-resolved-major:'+name);
  }
  let scanned=0;
  for(const [key,entry] of Object.entries(lock.packages)){
    if(key==='')continue;
    scanned++;
    if(!key.startsWith('node_modules/')||!isObj(entry)||
       typeof entry.resolved!=='string'||
       !/^https:\/\/registry\.npmjs\.org\/[a-zA-Z0-9@%._+/-]+\.tgz$/.test(entry.resolved))
      bad('untrusted-package-source');
    if(typeof entry.integrity!=='string'||!/^sha(?:512|384|256)-[A-Za-z0-9+/=]+$/.test(entry.integrity))
      bad('missing-package-integrity');
    if(semverMajor(entry.version)===null)bad('invalid-locked-version');
  }
  return {valid:issues.length===0,policyVersion:1,scannedPackages:scanned,
    issues:[...new Set(issues)].sort(),
    scope:'standalone-reference-only',
    limitation:'Not a dependency vulnerability scan, lockfile signature or Wix integration test.'};
}
async function main(args){
  if(args.length!==1||args[0]!=='--json'){
    console.error('Usage: node scripts/check-maintenance-policy.mjs --json');
    process.exitCode=2;return;
  }
  try{
    const paths=['../frontend/astro-primitives/package.json',
      '../frontend/astro-primitives/package-lock.json',
      '../maintenance/compatibility-baseline.json'];
    const objects=await Promise.all(paths.map(async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'))));
    const result=inspectDependencyPolicy(...objects);
    console.log(JSON.stringify(result,null,2));
    if(!result.valid)process.exitCode=1;
  }catch{
    console.error('BLOCK: invalid maintenance policy inputs');
    process.exitCode=2;
  }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
  await main(process.argv.slice(2));
