import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyToolkitRelease} from '../scripts/verify-toolkit-release.mjs';
const tag='v0.2.1',commit='877736282def3631a3fad5d368e3098aadac040f';
const tagObject='fac613c48a4e3dcbbe3081af8f05e8bf02939443';
const releaseUrl='https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/';
const responses={
  ['/git/ref/tags/'+tag]:{ref:'refs/tags/'+tag,object:{type:'tag',sha:tagObject}},
  ['/git/tags/'+tagObject]:{tag,object:{type:'commit',sha:commit}},
  ['/releases/tags/'+tag]:{tag_name:tag,draft:false,prerelease:false,
    published_at:'2026-10-13T15:50:23Z',html_url:releaseUrl+tag},
};
function mock(overrides={}){
  const calls=[];
  return {calls,getJson:async path=>{calls.push(path);return {...responses,...overrides}[path]}};
}
test('valid published annotated release is distinguished from website verification',async()=>{
  const x=mock();
  const result=await verifyToolkitRelease(tag,commit,{getJson:x.getJson});
  assert.equal(result.source,'live-read-only-github-api');
  assert.equal(result.commit,commit);
  assert.equal(result.annotatedTagObject,tagObject);
  assert.equal(x.calls.length,3);
  assert.match(result.claimLimit,/not Wix/);
});
test('rejects malformed tag, short commit, and attempted path injection before API',async()=>{
  let called=false;
  const getJson=async()=>{called=true;throw new Error('should not fetch')};
  for(const bad of ['main','v0.2.1/other','v1.2.3%2Fsecret','v01.2.3','v0.2.1-rc.1'])
    await assert.rejects(verifyToolkitRelease(bad,commit,{getJson}),/exact/);
  await assert.rejects(verifyToolkitRelease(tag,'123',{getJson}),/exact/);
  assert.equal(called,false);
});
test('rejects lightweight tag rather than inferring release identity',async()=>{
  const m=mock({['/git/ref/tags/'+tag]:{ref:'refs/tags/'+tag,object:{type:'commit',sha:commit}}});
  await assert.rejects(verifyToolkitRelease(tag,commit,{getJson:m.getJson}),/annotated/);
});
test('rejects wrong annotated object target',async()=>{
  const m=mock({['/git/tags/'+tagObject]:{tag,object:{type:'commit',sha:'1'.repeat(40)}}});
  await assert.rejects(verifyToolkitRelease(tag,commit,{getJson:m.getJson}),/approved exact commit/);
});
test('rejects deleted, draft, prerelease or mismatched release',async()=>{
  for(const x of [
    undefined,
    {...responses['/releases/tags/'+tag],draft:true},
    {...responses['/releases/tags/'+tag],prerelease:true},
    {...responses['/releases/tags/'+tag],tag_name:'v0.2.0'},
    {...responses['/releases/tags/'+tag],html_url:'https://wrong.example/'},
  ]){
    const m=mock({['/releases/tags/'+tag]:x});
    await assert.rejects(verifyToolkitRelease(tag,commit,{getJson:m.getJson}),/public published/);
  }
});
test('public request failure fails closed without fabricating verification',async()=>{
  const getJson=async()=>{throw new Error('network unavailable')};
  await assert.rejects(verifyToolkitRelease(tag,commit,{getJson}),/network unavailable/);
});
