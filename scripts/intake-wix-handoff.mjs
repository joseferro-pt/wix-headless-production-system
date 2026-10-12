#!/usr/bin/env node
// Offline Wix-generated-prompt intake. Does not download, log in, call Wix APIs or mutate a site.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, join, resolve } from 'node:path';

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
  if (new Set([siteId.toLowerCase(), fromDownload.toLowerCase(), fromDashboard.toLowerCase()]).size !== 1) {
    throw new Error('MISMATCH: Site ID differs from download URL or dashboard URL; do not proceed');
  }
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

async function main() {
  const [, , sourceFile, outputDirectory] = process.argv;
  if (!sourceFile || !outputDirectory) throw new Error('Usage: node scripts/intake-wix-handoff.mjs <wix-prompt.txt> <target-directory>');
  const text = await readFile(sourceFile, 'utf8');
  const parsed = parseHandoff(text);
  const key = basename(resolve(outputDirectory)).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) throw new Error('Target directory basename must be a lowercase kebab-case project key');
  const manifest = makeManifest(parsed, text, key);
  await mkdir(outputDirectory, { recursive: true });
  // The 'wx' flag refuses to overwrite an existing initialized project.
  await writeFile(join(outputDirectory, 'site.manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  await writeFile(join(outputDirectory, 'wix-handoff.original.txt'), text, { flag: 'wx' });
  process.stdout.write(`Intake prepared for site ${parsed.siteId}. Framework, business brief and Wix binding remain UNVERIFIED.\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  main().catch(e => { process.stderr.write(`Intake error: ${e.message}\n`); process.exitCode = 1; });
}
