#!/usr/bin/env node
// Offline Wix manifest validator. JSON Schema Draft 2020-12 is enforced by Python jsonschema.
// Requires: python3 -m pip install -r requirements.txt
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const schemaFile = join(repoRoot, 'schemas/site-manifest.schema.json');
const schemaValidator = join(repoRoot, 'scripts/validate-json-schema.py');

export function validateManifest(m, originalText = undefined) {
  const errors = [];
  const runner = spawnSync(process.env.WHPS_PYTHON || 'python3', [schemaValidator, schemaFile], {
    input: JSON.stringify(m ?? null), encoding: 'utf8', maxBuffer: 2 * 1024 * 1024,
  });
  if (runner.error || runner.status !== 0) {
    errors.push(`JSON Schema validator unavailable: ${runner.error?.message || runner.stderr?.trim() || `exit ${runner.status}`}`);
  } else {
    try {
      const result = JSON.parse(runner.stdout);
      for (const item of result.errors ?? []) errors.push(`schema ${item.path}: ${item.message}`);
    } catch { errors.push('JSON Schema validator returned an invalid response'); }
  }

  const id = m?.wix?.siteId;
  if (m?.entryMode === 'wix-handoff') {
    if (m?.handoff?.skillUrl !== 'https://wix.com/headless/skill.md' && m?.handoff?.skillUrl !== 'https://www.wix.com/headless/skill.md')
      errors.push('handoff.skillUrl must be the official Wix Headless skill');
    if (m?.handoff?.downloadUrl !== `https://manage.wix.com/download-headless-business/${id}/download.zip`)
      errors.push('handoff.downloadUrl must match siteId');
    if (m?.wix?.dashboardUrl !== `https://manage.wix.com/dashboard/${id}`)
      errors.push('wix.dashboardUrl must match siteId');
    if (m?.lifecycleState === 'HANDOFF_RECEIVED' && (m?.wix?.bindingVerified || m?.site?.sourceArchiveInspected))
      errors.push('handoff intake cannot claim binding or archive inspection before checking the actual ZIP');
    if (originalText === undefined) errors.push('preserved original Wix prompt is required for wix-handoff validation');
    else if (createHash('sha256').update(originalText).digest('hex') !== m?.handoff?.sha256)
      errors.push('sha256 does not match preserved original Wix prompt');
  }
  if (/"(?:accessToken|refreshToken|clientSecret|apiKey|bearerToken|password|privateKey)"\s*:/i.test(JSON.stringify(m ?? {})))
    errors.push('manifest contains forbidden secret material field');
  return errors;
}

export function resolveOriginalPrompt(manifestPath, originalFile) {
  const base = dirname(resolve(manifestPath));
  if (typeof originalFile !== 'string' || !originalFile || isAbsolute(originalFile))
    throw new Error('handoff.originalFile must be a local relative path');
  const full = resolve(base, originalFile);
  const rel = relative(base, full);
  if (rel === '..' || rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(rel))
    throw new Error('handoff.originalFile cannot escape the project directory');
  return full;
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) throw new Error('Usage: node scripts/validate-manifest.mjs <site.manifest.json>');
  const m = JSON.parse(await readFile(manifestPath, 'utf8'));
  const original = m.entryMode === 'wix-handoff'
    ? await readFile(resolveOriginalPrompt(manifestPath, m.handoff?.originalFile), 'utf8')
    : undefined;
  const errors = validateManifest(m, original);
  if (errors.length) { for (const e of errors) console.error(`FAIL: ${e}`); process.exitCode = 1; }
  else process.stdout.write(`PASS: project ${m.projectKey}; schema and applicable contracts valid. Wix binding remains independently verifiable.\n`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(e => { console.error(`Validation error: ${e.message}`); process.exitCode = 1; });
}
