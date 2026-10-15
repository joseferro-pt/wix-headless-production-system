import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspectDependencyPolicy} from '../scripts/check-maintenance-policy.mjs';
const [manifest,lock,policy]=await Promise.all([
  '../frontend/astro-primitives/package.json',
  '../frontend/astro-primitives/package-lock.json',
  '../maintenance/compatibility-baseline.json',
].map(async p=>JSON.parse(await readFile(new URL(p,import.meta.url),'utf8'))));
const copy=x=>structuredClone(x);
const fails=(r,s)=>assert.ok(r.issues.some(x=>x.includes(s)),JSON.stringify(r.issues));
test('reviewed synthetic dependency tree has expected integrity and origin',()=>{
  const r=inspectDependencyPolicy(manifest,lock,policy);
  assert.equal(r.valid,true,JSON.stringify(r.issues));
  assert.ok(r.scannedPackages>100);
  assert.match(r.limitation,/Not a dependency vulnerability scan/);
});
test('every critical framework major must remain reviewed',()=>{
  for(const name of Object.keys(policy.dependencyMajorLines)){
    const m=copy(manifest);m.dependencies[name]='^99.0.0';
    fails(inspectDependencyPolicy(m,lock,policy),'unreviewed-direct-major:'+name);
    const l=copy(lock);l.packages['node_modules/'+name].version='99.0.0';
    fails(inspectDependencyPolicy(manifest,l,policy),'unreviewed-resolved-major:'+name);
  }
});
test('manifest and lockfile direct dependencies must agree',()=>{
  const m=copy(manifest);m.devDependencies.typescript='^99.0.0';
  fails(inspectDependencyPolicy(m,lock,policy),'lockfile-manifest-drift');
  const l=copy(lock);delete l.packages[''].dependencies.react;
  fails(inspectDependencyPolicy(manifest,l,policy),'lockfile-manifest-drift');
});
test('unknown registry and missing digest fail closed',()=>{
  const l=copy(lock);l.packages['node_modules/astro'].resolved='https://evil.example/astro.tgz';
  fails(inspectDependencyPolicy(manifest,l,policy),'untrusted-package-source');
  const k=copy(lock);delete k.packages['node_modules/astro'].integrity;
  fails(inspectDependencyPolicy(manifest,k,policy),'missing-package-integrity');
});
test('Wix SDK and Node engine changes require separate review',()=>{
  const m=copy(manifest);m.dependencies['@wix/sdk']='^1.0.0';
  fails(inspectDependencyPolicy(m,lock,policy),'wix-sdk-in-synthetic-reference');
  const n=copy(manifest);n.engines.node='>=24';
  fails(inspectDependencyPolicy(n,lock,policy),'node-engine-baseline-mismatch');
  const p=copy(policy);p.allowedRegistry='https://evil.example/';
  fails(inspectDependencyPolicy(manifest,lock,p),'invalid-reviewed-policy');
});
test('CLI is read-only, emits JSON, rejects mutation requests',()=>{
  const path=fileURLToPath(new URL('../scripts/check-maintenance-policy.mjs',import.meta.url));
  const ok=spawnSync(process.execPath,[path,'--json'],{encoding:'utf8'});
  assert.equal(ok.status,0,ok.stderr);
  assert.equal(JSON.parse(ok.stdout).valid,true);
  const bad=spawnSync(process.execPath,[path,'--write'],{encoding:'utf8'});
  assert.equal(bad.status,2);
});
