#!/usr/bin/env node
// Contract validator without dependencies: focus on Wix handoff consistency and safety.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';

export function validateManifest(m, originalText = undefined) {
  const errors = [];
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (m?.schemaVersion !== '0.1.0') errors.push('schemaVersion must be 0.1.0');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m?.projectKey || '')) errors.push('projectKey must be lowercase kebab-case');
  if (!uuidRe.test(m?.wix?.siteId || '')) errors.push('wix.siteId must be a UUID');
  if (!uuidRe.test(m?.wix?.clientId || '')) errors.push('wix.clientId must be a UUID');
  if (m?.handoff?.skillUrl !== 'https://wix.com/headless/skill.md' && m?.handoff?.skillUrl !== 'https://www.wix.com/headless/skill.md') errors.push('handoff.skillUrl must be the official Wix Headless skill');
  const s = m?.wix?.siteId || '';
  const dl = m?.handoff?.downloadUrl || '';
  const db = m?.wix?.dashboardUrl || '';
  if (dl !== `https://manage.wix.com/download-headless-business/${s}/download.zip`) errors.push('handoff.downloadUrl must match siteId');
  if (db !== `https://manage.wix.com/dashboard/${s}`) errors.push('wix.dashboardUrl must match siteId');
  if (m?.entryMode === 'wix-handoff' && m?.lifecycleState === 'HANDOFF_RECEIVED' && (m?.wix?.bindingVerified || m?.site?.sourceArchiveInspected)) errors.push('handoff intake cannot claim binding or archive inspection before checking the actual ZIP');
  if (!['unknown','proposed','approved'].includes(m?.business?.factsStatus)) errors.push('business.factsStatus has invalid value');
  if (originalText !== undefined) {
    const digest = createHash('sha256').update(originalText).digest('hex');
    if (digest !== m?.handoff?.sha256) errors.push('sha256 does not match preserved original Wix prompt');
  }
  // Prevent high-risk credential fields even if the JSON Schema is not separately executed.
  const serialized = JSON.stringify(m || {});
  if (/"(?:accessToken|refreshToken|clientSecret|apiKey|bearerToken|password)"\s*:/i.test(serialized)) errors.push('manifest contains forbidden secret material field');
  return errors;
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) throw new Error('Usage: node scripts/validate-manifest.mjs <site.manifest.json>');
  const m = JSON.parse(await readFile(manifestPath,'utf8'));
  let original;
  try { original = await readFile(join(dirname(manifestPath), m.handoff.originalFile),'utf8'); } catch {}
  const errors = validateManifest(m, original);
  if (errors.length) { for (const x of errors) console.error(`FAIL: ${x}`); process.exitCode = 1; }
  else process.stdout.write(`PASS: project ${m.projectKey}; handoff URLs and IDs consistent. Note: Wix on-disk binding not yet verified.\n`);
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  main().catch(e => { console.error(`Validation error: ${e.message}`); process.exitCode=1; });
}
