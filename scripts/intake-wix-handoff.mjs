#!/usr/bin/env node
// Offline Wix handoff parser and atomic project intake. No Wix network calls or site mutations.
import { readFile, mkdir, mkdtemp, writeFile, rename, rm, lstat, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, dirname, isAbsolute, relative, resolve, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const systemRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function parseHandoff(text) {
  const grab = (pattern, label) => {
    const match = text.match(pattern);
    if (!match) throw new Error(`Missing ${label} in Wix handoff`);
    return match[1];
  };
  const uuid = '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})';
  const siteId = grab(new RegExp(`My\\s+Wix\\s+Site\\s+ID\\s+is\\s*:\\s*${uuid}`, 'i'), 'Site ID');
  const clientId = grab(new RegExp(`My\\s+Wix\\s+client\\s+ID\\s+is\\s*:\\s*${uuid}`, 'i'), 'Client ID');
  const downloadUrl = grab(/(https:\/\/manage\.wix\.com\/download-headless-business\/[0-9a-f-]+\/download\.zip)/i, 'download URL');
  const skillUrl = grab(/(https:\/\/(?:www\.)?wix\.com\/headless\/skill\.md)/i, 'official skill URL');
  const dashboardUrl = grab(/(https:\/\/manage\.wix\.com\/dashboard\/[0-9a-f-]+)/i, 'dashboard URL');
  const fromDownload = grab(/\/download-headless-business\/([0-9a-f-]{36})\/download\.zip/i, 'download URL site ID');
  const fromDashboard = grab(/\/dashboard\/([0-9a-f-]{36})/i, 'dashboard URL site ID');
  if (new Set([siteId.toLowerCase(), fromDownload.toLowerCase(), fromDashboard.toLowerCase()]).size !== 1)
    throw new Error('MISMATCH: Site ID differs from download URL or dashboard URL; do not proceed');
  return { siteId, clientId, downloadUrl, skillUrl, dashboardUrl };
}

export function makeManifest(input, originalText, projectKey) {
  return {
    schemaVersion: '0.1.0', projectKey, lifecycleState: 'HANDOFF_RECEIVED', entryMode: 'wix-handoff',
    handoff: {
      originalFile: 'wix-handoff.original.txt',
      sha256: createHash('sha256').update(originalText).digest('hex'),
      skillUrl: input.skillUrl, downloadUrl: input.downloadUrl
    },
    business: { factsStatus: 'unknown', name: null, sector: null, primaryAction: null, languages: [] },
    wix: { siteId: input.siteId, clientId: input.clientId, dashboardUrl: input.dashboardUrl, bindingVerified: false, observedLiveUrl: null },
    site: { framework: 'unknown', sourceArchiveInspected: false, productionReleaseApproved: false, pages: [], requiredIntegrations: [] }
  };
}

export function assertOutsideSystem(target) {
  const dest = resolve(target);
  const rel = relative(systemRoot, dest);
  if (rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel)))
    throw new Error('Refusing to create a website project inside the WHPS system repository');
}

async function existing(p) {
  try { await lstat(p); return true; }
  catch (e) { if (e.code === 'ENOENT') return false; throw e; }
}

export async function prepareIntake(text, outputDirectory, write = writeFile) {
  const dest = resolve(outputDirectory);
  assertOutsideSystem(dest);
  const parsed = parseHandoff(text);
  const key = basename(dest).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key) || key !== basename(dest))
    throw new Error('Target directory basename must be lowercase kebab-case');
  if (await existing(dest)) throw new Error('Target already exists; refusing to overwrite a website project');
  const parent = dirname(dest);
  await mkdir(parent, {recursive:true});
  // Reject a symlinked output parent that physically points back into the toolkit.
  assertOutsideSystem(join(await realpath(parent), basename(dest)));
  const stage = await mkdtemp(join(parent, `.${key}-whps-stage-`));
  try {
    const manifest = makeManifest(parsed, text, key);
    await write(join(stage, 'site.manifest.json'), JSON.stringify(manifest, null, 2) + '\n', {flag:'wx'});
    await write(join(stage, 'wix-handoff.original.txt'), text, {flag:'wx'});
    if (await existing(dest)) throw new Error('Target appeared during intake; refusing overwrite');
    await rename(stage, dest);
    return manifest;
  } finally {
    await rm(stage, {recursive:true,force:true});
  }
}

async function main() {
  const [, , sourceFile, outputDirectory] = process.argv;
  if (!sourceFile || !outputDirectory) throw new Error('Usage: node scripts/intake-wix-handoff.mjs <wix-prompt.txt> <target-directory>');
  const original = await readFile(sourceFile, 'utf8');
  const manifest = await prepareIntake(original, outputDirectory);
  process.stdout.write(`Intake prepared for ${manifest.projectKey}. Framework, business brief and Wix binding remain UNVERIFIED.\n`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(e => { process.stderr.write(`Intake error: ${e.message}\n`); process.exitCode = 1; });
}
