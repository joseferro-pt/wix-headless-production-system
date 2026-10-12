import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parseHandoff, makeManifest, assertOutsideSystem } from '../scripts/intake-wix-handoff.mjs';

const fixture=await readFile(new URL('../examples/wix-generated-prompt.example.txt',import.meta.url),'utf8');
const fixtureSite='11111111-1111-4111-8111-111111111111';
const fixtureClient='22222222-2222-4222-8222-222222222222';
function seeded(seed){let state=seed>>>0;return()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state>>>16;};}
function fakeUUID(rand){const raw=Array.from({length:32},()=> (rand()%16).toString(16));raw[12]='4';raw[16]='8';const s=raw.join('');return [s.slice(0,8),s.slice(8,12),s.slice(12,16),s.slice(16,20),s.slice(20)].join('-');}

test('80 deterministic synthetic identity substitutions retain the Wix identity invariant',()=>{
  const rand=seeded(20261012);
  for(let i=0;i<80;i++){
    const site=fakeUUID(rand),client=fakeUUID(rand);
    const candidate=fixture.replaceAll(fixtureSite,site).replaceAll(fixtureClient,client);
    const parsed=parseHandoff(candidate);
    assert.equal(parsed.siteId,site);
    assert.equal(parsed.clientId,client);
    const manifest=makeManifest(parsed,candidate,'synthetic-site');
    assert.equal(manifest.handoff.sha256,createHash('sha256').update(candidate).digest('hex'));
    assert.equal(manifest.business.factsStatus,'unknown');
    const broken=candidate.replace(`https://manage.wix.com/dashboard/${site}`,`https://manage.wix.com/dashboard/${fakeUUID(rand)}`);
    assert.throws(()=>parseHandoff(broken),/MISMATCH/);
  }
});

test('randomized normalized paths cannot escape the toolkit exclusion rule',()=>{
  const rand=seeded(9000);
  const root=new URL('..',import.meta.url).pathname;
  for(let i=0;i<80;i++){
    const nested=Array.from({length:1+rand()%4},()=>`workspace-${rand()%1000}`);
    assert.throws(()=>assertOutsideSystem(join(root,...nested)),/inside/);
    assert.doesNotThrow(()=>assertOutsideSystem(join(root,'..',`other-project-${rand()%1000}`)));
  }
});

test('duplicate conflicting Wix Site ID lines must be rejected',()=>{
  const other='33333333-3333-4333-8333-333333333333';
  assert.throws(()=>parseHandoff(fixture+`\nMy Wix Site ID is: ${other}\n`),/MISMATCH|Conflicting/);
});

test('duplicate conflicting Wix Client IDs must be rejected',()=>{
  const other='33333333-3333-4333-8333-333333333333';
  assert.throws(()=>parseHandoff(fixture+`\nMy Wix client ID is: ${other}\n`),/MISMATCH/);
});
