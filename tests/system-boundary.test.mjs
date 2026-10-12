import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
const root = resolve(new URL('..', import.meta.url).pathname);
const included = ['docs', 'blueprints', 'templates', 'examples', 'scripts', 'schemas', 'tests'];
const top = ['README.md','AGENTS.md','CHANGELOG.md'];
const allowedUuids = new Set(['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333']);
const uuid = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/ig;
async function scan(dir) {
  const result=[];
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const p=join(dir,entry.name);
    if(entry.isDirectory()) result.push(...await scan(p));
    else if (/\.(md|json|mjs|js|py|txt|yaml|yml)$/.test(entry.name)) result.push(p);
  }
  return result;
}
test('system repository contains only permitted synthetic Wix UUID fixtures',async()=>{
  const paths=[...top.map(x=>join(root,x)),...(await Promise.all(included.map(x=>scan(join(root,x))))).flat()];
  const unauthorized=[];
  for(const p of paths){
    const source=await readFile(p,'utf8');
    for(const id of (source.match(uuid)||[])) if(!allowedUuids.has(id.toLowerCase())) unauthorized.push(p+': '+id);
  }
  assert.deepEqual(unauthorized,[]);
});
test('system repository does not contain client website configuration or pilot report',async()=>{
  for(const path of ['wix.config.json','docs/06-PILOT-AUDIT.md']){
    await assert.rejects(access(join(root,path)));
  }
});
