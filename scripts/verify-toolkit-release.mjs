#!/usr/bin/env node
/**
 * WHPS-006: read-only public GitHub tag/release verification.
 * GitHub API HTTPS is the authority for its own repository's public state;
 * this never tests Wix, site ownership, binaries, signing keys or deployment.
 */
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const REPOSITORY='joseferro-pt/wix-headless-production-system';
export const TAG=/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/;
export const SHA=/^[0-9a-f]{40}$/;
const API='https://api.github.com/repos/'+REPOSITORY;
const RELEASE='https://github.com/'+REPOSITORY+'/releases/tag/';
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);

async function publicGet(path) {
  const response=await fetch(API+path,{
    method:'GET',headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},
    redirect:'error',signal:AbortSignal.timeout(12000),
  });
  if(!response.ok)throw new Error('GitHub public verification failed: HTTP '+response.status);
  return response.json();
}
export async function verifyToolkitRelease(tag,expectedCommit,{getJson=publicGet}={}) {
  if(!TAG.test(tag)||!SHA.test(expectedCommit))
    throw new TypeError('Require exact vX.Y.Z and full lowercase 40-character source SHA');
  // Tag is regex-constrained: all endpoint suffixes are safe and repository-constant.
  const ref=await getJson('/git/ref/tags/'+tag);
  if(!object(ref)||ref.ref!=='refs/tags/'+tag||ref.object?.type!=='tag'||
    !SHA.test(ref.object?.sha??''))throw new Error('Expected matching annotated Git tag');
  const annotated=await getJson('/git/tags/'+ref.object.sha);
  if(!object(annotated)||annotated.tag!==tag||annotated.object?.type!=='commit'||
    !SHA.test(annotated.object?.sha??'')||annotated.object.sha!==expectedCommit)
    throw new Error('Annotated tag does not resolve to the approved exact commit');
  const release=await getJson('/releases/tags/'+tag);
  if(!object(release)||release.tag_name!==tag||release.draft!==false||
     release.prerelease!==false||typeof release.published_at!=='string'||
     Number.isNaN(Date.parse(release.published_at))||release.html_url!==RELEASE+tag)
    throw new Error('Missing matching public published GitHub Release');
  return Object.freeze({
    verificationVersion:1,
    source:'live-read-only-github-api',
    repository:'https://github.com/'+REPOSITORY,
    tag,commit:expectedCommit,annotatedTagObject:ref.object.sha,
    publishedAt:release.published_at,releaseUrl:release.html_url,
    claimLimit:'GitHub release identity only; not Wix, site adoption or artifact security attestation',
  });
}
async function main(args) {
  if(args.length!==5||args[0]!=='--tag'||args[2]!=='--sha'||args[4]!=='--json'){
    console.error('Usage: node scripts/verify-toolkit-release.mjs --tag vX.Y.Z --sha <full-SHA> --json');
    process.exitCode=2;return;
  }
  try{console.log(JSON.stringify(await verifyToolkitRelease(args[1],args[3]),null,2));}
  catch(error){
    // Don't log untrusted API bodies, URLs with tokens or local site information.
    console.error('BLOCK: toolkit release could not be verified ('+
      (error instanceof TypeError?'invalid tag or commit':'untrusted or unavailable public release evidence')+')');
    process.exitCode=1;
  }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))
  await main(process.argv.slice(2));
