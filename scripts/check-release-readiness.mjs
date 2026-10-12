#!/usr/bin/env node
/** Offline WHPS release governance gate. Never tags, uploads or deploys anything. */
import { readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REQUIRED_POLICY_FILES = [
  'README.md','AGENTS.md','CHANGELOG.md','CONTRIBUTING.md','SECURITY.md',
  '.github/workflows/validate.yml','.github/PULL_REQUEST_TEMPLATE.md',
  'docs/00-DOCUMENTATION-MAP.md','docs/05-ROADMAP.md','docs/CONTROL-ROOM.md',
  'docs/11-RELEASE-GOVERNANCE.md','docs/12-SUPPORT-COMPATIBILITY.md',
  'docs/13-LICENSING-DECISION.md','docs/14-REPOSITORY-PROTECTION.md',
];

const errorsOf = (label, errors) => errors.push(label);

/**
 * Policy mode confirms artifacts exist. Release mode additionally checks the
 * accepted licence and changelog entry. Other release gates remain manual.
 */
export async function checkReadiness(repoRoot=root, {release=false, version=null}={}) {
  const errors=[];
  for(const path of REQUIRED_POLICY_FILES) {
    try {if(!(await stat(join(repoRoot,path))).isFile()) errorsOf(`Not a file: ${path}`,errors);}
    catch {errorsOf(`Missing governance file: ${path}`,errors);}
  }
  const read=async name=>{try{return await readFile(join(repoRoot,name),'utf8');}catch{return '';}};
  const ci=await read('.github/workflows/validate.yml');
  if(!ci.includes('contents: read'))errorsOf('GitHub Actions must use read-only default token',errors);
  if(!ci.includes('scripts/check-repository-boundary.mjs'))errorsOf('Boundary check not configured in CI',errors);
  if(!ci.includes('scripts/check-release-readiness.mjs --policy'))errorsOf('Governance check not configured in CI',errors);
  if(release){
    if(!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(version??''))
      errorsOf('Release version must be a SemVer tag such as v0.1.0',errors);
    const decision=await read('docs/13-LICENSING-DECISION.md');
    if(!/\*\*Status:\*\*\s*Accepted\b/.test(decision))
      errorsOf('Licence choice is not explicitly accepted',errors);
    const license=(await read('LICENSE')) || (await read('LICENSE.md'));
    if(!license.trim())errorsOf('An accepted complete LICENSE file is required',errors);
    const changelog=await read('CHANGELOG.md');
    if(version && !changelog.includes(`## ${version}`))
      errorsOf(`CHANGELOG is missing approved release heading ${version}`,errors);
  }
  return errors;
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const release=process.argv.includes('--release');
  const idx=process.argv.indexOf('--version');
  const version=idx>=0?process.argv[idx+1]:null;
  if(process.argv.includes('--policy')===release || (idx>=0 && !release)){
    console.error('Usage: node scripts/check-release-readiness.mjs --policy | --release --version vX.Y.Z');
    process.exitCode=2;
  } else {
    checkReadiness(root,{release,version}).then(errors=>{
      for(const error of errors)console.error(`BLOCK: ${error}`);
      if(errors.length)process.exitCode=1;
      else console.log(release ? 'PASS: offline release prerequisites satisfied (manual approval still required)' : 'PASS: governance policy files and CI checks present');
    }).catch(error=>{console.error(`Governance gate failed: ${error.message}`);process.exitCode=1;});
  }
}
