import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { access, mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  bootstrapSiteWorkspace, buildInitialManifest, createAdoptionLock,
  FOUNDATION, parseBootstrapArgs, detectToolkitSource,
} from '../scripts/bootstrap-site-workspace.mjs';
import { validateManifest } from '../scripts/validate-manifest.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixture = await readFile(new URL('../examples/wix-generated-prompt.example.txt', import.meta.url), 'utf8');
const temporary = async (fn) => {
  const parent = await mkdtemp(join(tmpdir(), 'whps-002-test-'));
  try { return await fn(parent); }
  finally { await rm(parent, { recursive: true, force: true }); }
};

test('argument parser rejects ambiguity, unknown flags and existing-repository mode', () => {
  assert.equal(parseBootstrapArgs(['--help']).help, true);
  assert.equal(parseBootstrapArgs(['--mode', 'unbound-frontend', '--output', '/tmp/my-site']).mode, 'unbound-frontend');
  for (const args of [
    [], ['--mode', 'unbound-frontend'],
    ['--mode', 'wix-handoff', '--output', '/tmp/my-site'],
    ['--mode', 'unbound-frontend', '--output', '/tmp/my-site', '--handoff', 'source.txt'],
    ['--mode', 'existing-repository', '--output', '/tmp/my-site'],
    ['--mode', 'unbound-frontend', '--output', '/tmp/my-site', '--mode', 'unbound-frontend'],
    ['--mode', 'unbound-frontend', '--output', '/tmp/my-site', '--unknown', 'yes'],
  ]) assert.throws(() => parseBootstrapArgs(args));
});

test('lock captures the exact generator Git revision, separately from the historic baseline', () => {
  const lock = createAdoptionLock();
  const source = detectToolkitSource();
  assert.equal(lock.lockVersion, 2);
  assert.deepEqual(lock.toolkitSource, source);
  assert.deepEqual(lock.foundationBaseline, FOUNDATION);
  assert.equal(lock.generator.sourceCommit, source.commit);
  assert.equal(lock.generator.sourceTag, source.tag);
  assert.equal(lock.toolkitSource.releaseVerification, 'not-performed');
  assert.equal(lock.manifestSchemaVersion, '0.1.0');
});
// All tests use only synthetic Git outputs: no real website or Wix identity.
function fakeToolkitGit({
  sha='a'.repeat(40),
  status='',
  origin='https://github.com/joseferro-pt/wix-headless-production-system',
  tags='',
}={}) {
  return args => {
    if (args[0]==='rev-parse' && args[1]==='HEAD') return sha+'\n';
    if (args[0]==='status' && args.includes('--untracked-files=all')) return status;
    if (args[0]==='remote' && args[1]==='get-url' && args[2]==='origin') return origin+'\n';
    if (args[0]==='tag' && args[1]==='--points-at') return tags+'\n';
    throw new Error('Unexpected Git command: '+args.join(' '));
  };
}
test('tag at clean canonical checkout is recorded without claiming remote release verification', () => {
  const sha='a'.repeat(40);
  const lock=createAdoptionLock(detectToolkitSource(fakeToolkitGit({sha,tags:'v0.2.0'})));
  assert.equal(lock.toolkitSource.commit,sha);
  assert.equal(lock.toolkitSource.tag,'v0.2.0');
  assert.equal(lock.toolkitSource.state,'tagged-checkout-unverified');
  assert.equal(lock.toolkitSource.releaseVerification,'not-performed');
});
test('bootstrap rejects unstaged, staged, untracked and submodule changes before claiming provenance', () => {
  for (const status of [' M scripts/bootstrap-site-workspace.mjs','M  scripts/bootstrap-site-workspace.mjs','?? new-file.txt',' m vendor/submodule']) {
    assert.throws(()=>detectToolkitSource(fakeToolkitGit({status})),/checkout is dirty/);
  }
});
test('bootstrap rejects missing and spoofed local remote origins', () => {
  for (const origin of ['', 'https://github.com/another/repository', 'https://github.com/joseferro-pt/wix-headless-production-system.evil.example',
    'https://github.com@bad.example/joseferro-pt/wix-headless-production-system',
    'https://github.com/joseferro-pt/wix-headless-production-system-fork',
  ]) {
    assert.throws(()=>detectToolkitSource(fakeToolkitGit({origin})),/origin is missing or not the canonical/);
  }
});
test('bootstrap accepts exact canonical https and ssh origin spellings without verifying publication', () => {
  for (const origin of [
    'https://github.com/joseferro-pt/wix-headless-production-system',
    'https://github.com/joseferro-pt/wix-headless-production-system.git',
    'git@github.com:joseferro-pt/wix-headless-production-system.git',
    'ssh://git@github.com/joseferro-pt/wix-headless-production-system.git',
  ]) {
    const source=detectToolkitSource(fakeToolkitGit({origin}));
    assert.equal(source.repository,FOUNDATION.repository);
    assert.equal(source.releaseVerification,'not-performed');
  }
});
test('bootstrap source identification rejects ambiguous revision tags and malformed SHA', () => {
  assert.throws(() => detectToolkitSource(fakeToolkitGit({tags:'v0.2.0\nv0.3.0'})), /Multiple release/);
  assert.throws(() => detectToolkitSource(fakeToolkitGit({sha:'not-a-commit'})), /valid generating/);
});

test('new unbound workspace is local Git repository with valid blocked manifest', async () => {
  await temporary(async (parent) => {
    const outputDirectory = join(parent, 'unbound-site');
    const created = await bootstrapSiteWorkspace({ mode: 'unbound-frontend', outputDirectory });
    assert.equal(created.mode, 'unbound-frontend');
    const m = JSON.parse(await readFile(join(outputDirectory, 'site.manifest.json'), 'utf8'));
    assert.equal(m.entryMode, 'unbound-frontend');
    assert.equal(m.lifecycleState, 'BLOCKED');
    assert.equal(m.business.factsStatus, 'unknown');
    assert.equal(m.site.productionReleaseApproved, false);
    assert.equal(m.wix, undefined);
    assert.deepEqual(validateManifest(m), []);
    const lock = JSON.parse(await readFile(join(outputDirectory, 'whps.lock.json'), 'utf8'));
    assert.equal(lock.foundationBaseline.commit, FOUNDATION.commit);
    assert.equal(lock.toolkitSource.commit, execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim());
    assert.equal(lock.generator.sourceCommit, lock.toolkitSource.commit);
    const branch = execFileSync('git', ['-C', outputDirectory, 'branch', '--show-current'], { encoding: 'utf8' }).trim();
    assert.equal(branch, 'main');
    assert.match(await readFile(join(outputDirectory, 'README.md'), 'utf8'), /Generator source commit/);
    assert.match(await readFile(join(outputDirectory, 'docs/CONTROL-ROOM.md'), 'utf8'), /unbound-site/);
    assert.match(await readFile(join(outputDirectory, 'docs/BUSINESS-BRIEF.md'), 'utf8'), /Facts|Business identity/);
    await assert.rejects(access(join(outputDirectory, 'wix.config.json')));
    await assert.rejects(access(join(outputDirectory, 'wix-handoff.original.txt')));
    await assert.rejects(access(join(outputDirectory, '.git', 'config.nonexistent')));
  });
});

test('handoff mode preserves exact synthetic Wix prompt and marks binding unverified', async () => {
  await temporary(async (parent) => {
    const outputDirectory = join(parent, 'handoff-site');
    await bootstrapSiteWorkspace({ mode: 'wix-handoff', outputDirectory, handoffText: fixture });
    const m = JSON.parse(await readFile(join(outputDirectory, 'site.manifest.json'), 'utf8'));
    assert.equal(m.entryMode, 'wix-handoff');
    assert.equal(m.lifecycleState, 'HANDOFF_RECEIVED');
    assert.equal(m.wix.bindingVerified, false);
    assert.equal(m.site.sourceArchiveInspected, false);
    assert.equal(m.site.productionReleaseApproved, false);
    assert.equal(await readFile(join(outputDirectory, 'wix-handoff.original.txt'), 'utf8'), fixture);
    assert.deepEqual(validateManifest(m, fixture), []);
    assert.match(await readFile(join(outputDirectory, '.gitignore'), 'utf8'), /\.env/);
    const status = execFileSync('git', ['-C', outputDirectory, 'status', '--porcelain'], { encoding: 'utf8' });
    assert.match(status, /site\.manifest\.json/);
  });
});

test('fails closed rather than overwriting an existing website directory', async () => {
  await temporary(async (parent) => {
    const outputDirectory = join(parent, 'existing-site');
    await mkdir(outputDirectory);
    await writeFile(join(outputDirectory, 'source.txt'), 'do-not-edit');
    await assert.rejects(bootstrapSiteWorkspace({ mode: 'unbound-frontend', outputDirectory }), /already exists/);
    assert.equal(await readFile(join(outputDirectory, 'source.txt'), 'utf8'), 'do-not-edit');
    assert.deepEqual(await readdir(outputDirectory), ['source.txt']);
  });
});

test('does not bootstrap a website inside the WHPS toolkit', async () => {
  await assert.rejects(
    bootstrapSiteWorkspace({ mode: 'unbound-frontend', outputDirectory: join(root, 'docs', 'new-site') }),
    /inside/,
  );
});

test('rejects symlinked output parents that resolve into WHPS', async () => {
  await temporary(async (parent) => {
    const alias = join(parent, 'toolkit-link');
    await symlink(join(root, 'examples'), alias, 'dir');
    await assert.rejects(
      bootstrapSiteWorkspace({ mode: 'unbound-frontend', outputDirectory: join(alias, 'my-site') }),
      /inside/,
    );
    await assert.rejects(access(join(root, 'examples', 'my-site')));
  });
});

test('invalid keys, unexpected handoff, and synthetic mismatched IDs fail closed', async () => {
  assert.throws(() => buildInitialManifest('unbound-frontend', 'UPPER'), /kebab/);
  assert.throws(() => buildInitialManifest('unbound-frontend', 'valid-site', fixture), /Unexpected handoff/);
  assert.throws(() => buildInitialManifest('wix-handoff', 'valid-site'), /required/);
  await temporary(async (parent) => {
    await assert.rejects(bootstrapSiteWorkspace({
      mode: 'unbound-frontend', outputDirectory: join(parent, 'valid-site'), projectKey: 'different-key',
    }), /match/);
    const bad = fixture.replace(
      'https://manage.wix.com/dashboard/11111111-1111-4111-8111-111111111111',
      'https://manage.wix.com/dashboard/33333333-3333-4333-8333-333333333333',
    );
    await assert.rejects(bootstrapSiteWorkspace({
      mode: 'wix-handoff', outputDirectory: join(parent, 'mismatch-site'), handoffText: bad,
    }), /MISMATCH/);
    assert.deepEqual(await readdir(parent), []);
  });
});

test('failed content write rolls back all staging files', async () => {
  await temporary(async (parent) => {
    const outputDirectory = join(parent, 'broken-site');
    let writes = 0;
    await assert.rejects(bootstrapSiteWorkspace(
      { mode: 'unbound-frontend', outputDirectory },
      { write: async (...args) => { if (++writes === 3) throw new Error('simulated storage failure'); return writeFile(...args); } },
    ), /storage failure/);
    assert.deepEqual(await readdir(parent), []);
  });
});

test('failed git initialization rolls back all staging files', async () => {
  await temporary(async (parent) => {
    const outputDirectory = join(parent, 'git-fail-site');
    await assert.rejects(bootstrapSiteWorkspace(
      { mode: 'unbound-frontend', outputDirectory },
      { initGit: async () => { throw new Error('simulated git failure'); } },
    ), /git failure/);
    assert.deepEqual(await readdir(parent), []);
  });
});

test('existing-repository mode never touches an existing site', async () => {
  await temporary(async (parent) => {
    const outputDirectory = join(parent, 'existing-repo');
    await mkdir(outputDirectory);
    await writeFile(join(outputDirectory, 'site.config'), 'original');
    await assert.rejects(bootstrapSiteWorkspace({
      mode: 'existing-repository', outputDirectory,
    }), /existing/);
    assert.deepEqual(await readdir(outputDirectory), ['site.config']);
  });
});

test('generated v2 site lock passes machine schema and invalid source identity fails',()=>{
 const real=createAdoptionLock();
 const validator=join(root,'scripts/validate-json-schema.py');
 const schemaPath=join(root,'schemas/whps-adoption-lock.schema.json');
 const validate=value=>{
   const result=spawnSync('python3',[validator,schemaPath],{input:JSON.stringify(value),encoding:'utf8'});
   assert.equal(result.status,0,result.stderr);
   return JSON.parse(result.stdout);
 };
 assert.equal(validate(real).valid,true);
 const broken=structuredClone(real);broken.toolkitSource.commit='not-a-git-revision';
 assert.equal(validate(broken).valid,false);
 const falseTag=structuredClone(real);falseTag.toolkitSource.tag='v0.2.0';falseTag.toolkitSource.state='unreleased-checkout';
 assert.equal(validate(falseTag).valid,false);
});
