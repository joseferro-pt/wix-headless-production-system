import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const catalog=JSON.parse(await readFile(new URL('../distribution/release-catalog.json',import.meta.url),'utf8'));
const all=catalog.releases;
test('historical catalog preserves exact release identity and sorted SemVer order',()=>{
  assert.equal(catalog.catalogVersion,1);
  assert.equal(catalog.source,'verified-github-public-release-snapshot');
  assert.equal(catalog.verifiedDate,'2026-10-15');
  assert.deepEqual(all.map(x=>x.tag),['v0.1.0','v0.2.0','v0.2.1','v0.3.0']);
  assert.equal(new Set(all.map(x=>x.tag)).size,all.length);
  for(const release of all){
    assert.match(release.commit,/^[a-f0-9]{40}$/);
    assert.match(release.annotatedTagObject,/^[a-f0-9]{40}$/);
    assert.ok(!Number.isNaN(Date.parse(release.publishedAt)));
    assert.equal(new Set(release.components).size,release.components.length);
  }
});
test('v0.3.0 was independently published and exposes additive site QA',()=>{
  const release=all.at(-1);
  assert.equal(release.commit,'bb4d0adcd9021b5cd671e13fed46d5498fac4399');
  assert.equal(release.annotatedTagObject,'7f6712db3d484e42e48a888047018be7dc1da1b6');
  assert.equal(release.publishedAt,'2026-10-15T12:21:25Z');
  assert.deepEqual(release.components.filter(x=>!all.at(-2).components.includes(x)),['site-qa']);
  assert.ok(all.at(-2).components.every(x=>release.components.includes(x)));
});
