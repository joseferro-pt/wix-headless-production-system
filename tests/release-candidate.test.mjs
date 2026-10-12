import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const get=name=>readFile(join(root,name),'utf8');
test('v0.1.0 contains full Apache-2.0 legal terms',async()=>{
 const legal=await get('LICENSE');
 assert.ok(legal.length>10000);
 assert.match(legal,/Apache License\s+Version 2\.0, January 2004/);
 for(const label of ['Definitions','Grant of Copyright License','Grant of Patent License','Redistribution','Submission of Contributions','Trademarks','Disclaimer of Warranty','Limitation of Liability','Accepting Warranty or Additional Liability']) assert.ok(legal.includes(label));
 assert.match(await get('docs/13-LICENSING-DECISION.md'),/\*\*Status:\*\* Accepted/);
 assert.match(await get('NOTICE'),/Copyright 2026/);
});
test('first release notes are honest about schema and site deployment',async()=>{
 const notes=await get('docs/releases/v0.1.0.md');
 assert.match(notes,/Manifest schema version.*0\.1\.0/);
 assert.match(notes,/not.*production-complete website generator/i);
 assert.match(notes,/cannot independently prove Wix source provenance/i);
});
test('manual release recovery requires exact approved source and permission gate', async()=>{
 const workflow=await get('.github/workflows/publish-v0.1.0.yml');
 assert.match(workflow,/workflow_dispatch:/);
 assert.doesNotMatch(workflow,/workflow_run:/);
 assert.match(workflow,/PUBLISH-v0\.1\.0/);
 assert.match(workflow,/802acf1b536b502fcacdffc1d6b7ce371aa2d3f7/);
 assert.match(workflow,/check-release-readiness\.mjs --release --version v0\.1\.0/);
 assert.match(workflow,/gh api --method POST/);
 assert.match(workflow,/gh release create/);
});

test('reusable R06 publication workflow is separate from the historical v0.1.0 recovery',async()=>{
 const newWorkflow=await get('.github/workflows/publish-release.yml');
 assert.match(newWorkflow,/workflow_dispatch:/);
 assert.match(newWorkflow,/source_sha:/);
 assert.match(newWorkflow,/PUBLISH-\$RELEASE_TAG/);
 assert.match(newWorkflow,/codeql\.yml/);
 assert.match(newWorkflow,/object\.sha==\$sha/);
 assert.doesNotMatch(newWorkflow,/^\s+push:/m);
});
