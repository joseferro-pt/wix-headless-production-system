#!/usr/bin/env node
/**
 * WHPS-002: offline, non-destructive scaffold of ONE independent website Git repository.
 * Does not contact Wix, download source, connect a site or publish/deploy.
 * This generator is unreleased development code; the adoption lock references only
 * the previously published WHPS foundation v0.1.0.
 */
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, lstat, realpath, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertOutsideSystem, makeManifest, parseHandoff } from './intake-wix-handoff.mjs';
import { validateManifest } from './validate-manifest.mjs';

const toolRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VALID_KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MODES = new Set(['wix-handoff', 'unbound-frontend']);

export const FOUNDATION = Object.freeze({
  repository: 'https://github.com/joseferro-pt/wix-headless-production-system',
  tag: 'v0.1.0',
  commit: '802acf1b536b502fcacdffc1d6b7ce371aa2d3f7',
});
const USAGE = [
  'Usage: node scripts/bootstrap-site-workspace.mjs --mode wix-handoff|unbound-frontend --output <new-directory>',
  '       [--project-key <lowercase-kebab-key>] [--handoff <original-wix-prompt.txt>]',
  'Creates a NEW local Git repository outside WHPS; never overwrites a directory.',
  'existing-repository is deliberately unsupported: do not scaffold over an existing site.',
].join('\n');

export function parseBootstrapArgs(argv) {
  if (argv.length === 1 && argv[0] === '--help') return { help: true };
  const aliases = new Map([
    ['--mode', 'mode'], ['--output', 'outputDirectory'],
    ['--project-key', 'projectKey'], ['--handoff', 'handoffFile'],
  ]);
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!aliases.has(argv[i]) || i + 1 >= argv.length || argv[i + 1].startsWith('--'))
      throw new Error(USAGE);
    const key = aliases.get(argv[i]);
    if (Object.hasOwn(options, key)) throw new Error('Duplicate argument: ' + argv[i]);
    options[key] = argv[i + 1];
  }
  if (!options.mode || !options.outputDirectory) throw new Error(USAGE);
  if (options.mode === 'existing-repository')
    throw new Error('existing-repository requires site-specific, non-destructive manual adoption; cannot bootstrap over existing source');
  if (!MODES.has(options.mode)) throw new Error('Unsupported bootstrap entry mode');
  if (options.mode === 'wix-handoff' && !options.handoffFile)
    throw new Error('--handoff is required for wix-handoff mode');
  if (options.mode !== 'wix-handoff' && options.handoffFile)
    throw new Error('--handoff is allowed only for wix-handoff mode');
  return options;
}

async function exists(path) {
  try { await lstat(path); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

/** Check physical path BEFORE creating any parent directories, including via symlinks. */
async function safeParent(parent, targetName) {
  let ancestor = parent;
  while (!(await exists(ancestor))) {
    const next = dirname(ancestor);
    if (next === ancestor) throw new Error('Cannot locate existing output ancestor');
    ancestor = next;
  }
  const physical = await realpath(ancestor);
  const physicalParent = resolve(physical, relative(ancestor, parent));
  assertOutsideSystem(join(physicalParent, targetName));
}

const genericBusiness = () => ({
  factsStatus: 'unknown', name: null, sector: null, primaryAction: null, languages: [],
});
const genericSite = () => ({
  framework: 'unknown', sourceArchiveInspected: false,
  productionReleaseApproved: false, pages: [], requiredIntegrations: [],
});

export function buildInitialManifest(mode, projectKey, handoffText) {
  if (!VALID_KEY.test(projectKey)) throw new Error('Project key must be lowercase kebab-case');
  if (mode === 'existing-repository') throw new Error('Refusing to bootstrap an existing repository');
  if (!MODES.has(mode)) throw new Error('Unsupported bootstrap entry mode');
  if (mode === 'wix-handoff') {
    if (typeof handoffText !== 'string' || !handoffText.trim())
      throw new Error('Original Wix handoff is required');
    if (Buffer.byteLength(handoffText, 'utf8') > 1024 * 1024)
      throw new Error('Original Wix handoff exceeds 1 MiB limit');
    return makeManifest(parseHandoff(handoffText), handoffText, projectKey);
  }
  if (handoffText !== undefined) throw new Error('Unexpected handoff for unbound mode');
  return {
    schemaVersion: '0.1.0', projectKey, lifecycleState: 'BLOCKED',
    entryMode: 'unbound-frontend', business: genericBusiness(), site: genericSite(),
  };
}

export function createAdoptionLock() {
  return {
    lockVersion: 1,
    toolkitRelease: { ...FOUNDATION },
    manifestSchemaVersion: '0.1.0',
    generator: { name: 'WHPS-002', status: 'unreleased-development' },
  };
}

function siteReadme(projectKey, mode) {
  const next = mode === 'wix-handoff'
    ? 'Preserve and examine the original Wix-provided project; cross-check wix.config.json and the supplied identifiers before any connect/iterate operation.'
    : 'Add or inspect the real frontend in this repository. Determine whether to use the current Wix connect/create process, with explicit approval, before assigning any binding.';
  return [
    '# Website workspace: ' + projectKey,
    '',
    '**Entry mode:** ' + mode,
    '**Current status:** unverified bootstrap; no site implementation or Wix release has been performed.',
    '**Toolkit foundation:** WHPS v0.1.0, pinned in whps.lock.json.',
    '**Generator:** WHPS-002 unreleased development code; this generator is NOT part of v0.1.0.',
    '',
    'This is a new **independent local Git repository**, not a Wix project, not a hosted website and not a remote GitHub repository.',
    'The original handoff (if provided), site identifiers, business facts and source belong here, never upstream in WHPS.',
    '',
    '## Next steps',
    '',
    '1. ' + next,
    '2. Complete docs/BUSINESS-BRIEF.md with source-backed information and approval; no business details were invented.',
    '3. Record identity checks, design decisions, QA and release approvals in docs/CONTROL-ROOM.md.',
    '4. Check the current official Wix Headless skill and CLI guidance in this website context before live work.',
    '5. Create a separately owned remote Git repository and push only after reviewing all files for confidential data.',
    '',
    'No Wix login, download, resource provisioning, build or deployment was performed by WHPS.',
    '',
  ].join('\n');
}
const siteIgnore = [
  '.env', '.env.*', '!.env.example', '.wix/', 'node_modules/', 'dist/',
  'coverage/', '.DS_Store', '*.pem', '*.key', '*.p12', '*.pfx',
  '',
].join('\n');

/**
 * Atomic contents, no overwrite. Creates only a new directory outside the WHPS checkout.
 * Injectable write/initGit functions exist solely for synthetic failure tests.
 */
export async function bootstrapSiteWorkspace(
  { mode, outputDirectory, projectKey, handoffText },
  { write = writeFile, initGit = (stage) => execFileSync('git', ['init', '-b', 'main', stage], { encoding: 'utf8' }) } = {},
) {
  if (typeof outputDirectory !== 'string' || !outputDirectory.trim())
    throw new Error('An output directory is required');
  const target = resolve(outputDirectory);
  assertOutsideSystem(target);
  const name = basename(target);
  const key = projectKey ?? name;
  if (!VALID_KEY.test(name) || !VALID_KEY.test(key) || key !== name)
    throw new Error('Directory basename and project key must match in lowercase kebab-case');
  if (await exists(target)) throw new Error('Output already exists: refusing to modify existing source');
  const manifest = buildInitialManifest(mode, key, handoffText);
  const errors = validateManifest(manifest, handoffText);
  if (errors.length) throw new Error('Invalid bootstrap manifest: ' + errors.join('; '));
  const parent = dirname(target);
  await safeParent(parent, name);
  await mkdir(parent, { recursive: true });
  await safeParent(parent, name);

  let stage;
  try {
    stage = await mkdtemp(join(parent, '.' + name + '-whps-stage-'));
    const source = async (path) => readFile(join(toolRoot, path), 'utf8');
    const pinned = FOUNDATION.tag + ' @ ' + FOUNDATION.commit;
    const agent = await source('blueprints/site/AGENTS.md');
    const control = await source('blueprints/site/docs/CONTROL-ROOM.md');
    const brief = await source('templates/BUSINESS-BRIEF.md');
    const files = new Map([
      ['site.manifest.json', JSON.stringify(manifest, null, 2) + '\n'],
      ['whps.lock.json', JSON.stringify(createAdoptionLock(), null, 2) + '\n'],
      ['README.md', siteReadme(key, mode)],
      ['.gitignore', siteIgnore],
      ['AGENTS.md', agent.replace(
        'The explicitly pinned WHPS **Git SHA** or, after a release has actually been published, approved release tag',
        'The pinned WHPS **release tag and Git SHA**')],
      ['docs/CONTROL-ROOM.md', control
        .replace('[site project name]', key)
        .replace('[exact toolkit commit SHA; later release tag + SHA when available]', pinned)],
      ['docs/BUSINESS-BRIEF.md', brief.replace('[Site name]', key)],
    ]);
    if (mode === 'wix-handoff') files.set('wix-handoff.original.txt', handoffText);
    for (const [path, content] of files) {
      const destination = join(stage, path);
      await mkdir(dirname(destination), { recursive: true });
      await write(destination, content, { flag: 'wx' });
    }
    await initGit(stage);
    if (!(await exists(join(stage, '.git')))) throw new Error('Local Git initialisation did not succeed');
    if (await exists(target)) throw new Error('Output appeared during bootstrap; refusing overwrite');
    await safeParent(parent, name);
    await rename(stage, target);
    return { projectKey: key, mode, outputDirectory: target, foundation: FOUNDATION, files: [...files.keys()] };
  } finally {
    if (stage) await rm(stage, { recursive: true, force: true });
  }
}

async function main() {
  const options = parseBootstrapArgs(process.argv.slice(2));
  if (options.help) { process.stdout.write(USAGE + '\n'); return; }
  let handoffText;
  if (options.handoffFile) {
    const info = await lstat(options.handoffFile);
    if (!info.isFile() || info.size > 1024 * 1024)
      throw new Error('Handoff source must be a regular file no larger than 1 MiB');
    handoffText = await readFile(options.handoffFile, 'utf8');
  }
  const result = await bootstrapSiteWorkspace({ ...options, handoffText });
  process.stdout.write(
    'Created NEW local Git workspace: ' + result.outputDirectory +
    '\nEntry mode: ' + result.mode +
    '\nToolkit pin: ' + FOUNDATION.tag + ' @ ' + FOUNDATION.commit +
    '\nWix identity, business facts and deployment remain unverified.\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    process.stderr.write('Bootstrap failed: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
