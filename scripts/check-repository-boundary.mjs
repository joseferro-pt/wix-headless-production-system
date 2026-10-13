#!/usr/bin/env node
/**
 * Read-only, high-confidence guard for the generic WHPS toolkit repository.
 * Inspects ALL Git-tracked paths, including hidden files and GitHub workflows.
 * Never prints detected credential values. This is a guard, not a replacement
 * for professional secret scanning or manual review of Git history.
 */
import { execFileSync } from 'node:child_process';
import { readFile, lstat } from 'node:fs/promises';
import { join, dirname, resolve, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureIds = new Set([
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
]);
const uuidRE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const contentPatterns = [
  { code: 'private-key', re: /-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g },
  { code: 'github-credential', re: /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g },
  { code: 'aws-access-key', re: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g },
  { code: 'wix-credential-assignment', re: /^\s*(?:(?:export|const|let|var)\s+)?(?:WIX_(?:CLIENT_SECRET|API_KEY|ACCESS_TOKEN|REFRESH_TOKEN)|GITHUB_TOKEN|AWS_SECRET_ACCESS_KEY)\s*[:=]\s*['"`]?([^\s'"`]+)/gm },
];
const allowedExtensions = new Set(['.md','.json','.mjs','.js','.ts','.tsx','.jsx','.py','.txt','.yml','.yaml','.toml','.css','.html','.astro','.svg','.sh','.lock']);
const allowedNames = new Set(['.gitignore','.gitattributes','.editorconfig','LICENSE','LICENSE.md','NOTICE','NOTICE.md','Dockerfile','Makefile']);

const report = (path, code, line=null) => ({path, code, ...(line===null?{}:{line})});

export function scanPath(path) {
  const p = path.replaceAll('\\','/');
  const findings=[];
  const name=basename(p);
  const parts=p.split('/');
  if (/^(?:\.env(?:\..*)?|wix\.config\.json|site\.manifest\.json|wix\.resources\.json|wix-handoff\.original\.txt)$/i.test(name))
    findings.push(report(path,'website-specific-file'));
  if (parts.some(x=>['clients','client-projects','sites','incoming','generated','.whps-workspace'].includes(x)))
    findings.push(report(path,'website-workspace-in-toolkit'));
  if (/\.(?:zip|bundle|pem|key|p12|pfx|sqlite|db)$/i.test(name))
    findings.push(report(path,'unreviewed-binary-or-secret-format'));
  if (!allowedNames.has(name) && !allowedExtensions.has(extname(name).toLowerCase()))
    findings.push(report(path,'unreviewed-file-format'));
  return findings;
}

export function scanText(path, text) {
  const findings=[];
  for (const match of text.matchAll(uuidRE)) {
    if (!fixtureIds.has(match[0].toLowerCase()))
      findings.push(report(path,'non-synthetic-wix-identifier',1 + text.slice(0,match.index).split('\n').length - 1));
  }
  for (const {code,re} of contentPatterns) {
    // matchAll clones the regex; repeated calls do not retain lastIndex.
    for (const match of text.matchAll(re)) {
      if (code === 'wix-credential-assignment' && /^(?:<.*>|\$\{.*\}|\$[A-Z_]+|\*+|REDACTED|placeholder|example|dummy)$/i.test(match[1])) continue;
      findings.push(report(path,code,1 + text.slice(0,match.index).split('\n').length - 1));
    }
  }
  return findings;
}

export function trackedFiles(repoRoot=root) {
  const raw = execFileSync('git',['ls-files','--stage','-z'],{cwd:repoRoot,encoding:'buffer'});
  const records=raw.toString('utf8').split('\0').filter(Boolean);
  if (!records.length) throw new Error('No tracked files: repository verification cannot be bypassed');
  return records.map(record=>{
    const match=/^([0-7]{6}) ([a-f0-9]{40,64}) \d+\t(.+)$/s.exec(record);
    if (!match) throw new Error('Cannot parse a Git index entry');
    return {mode:match[1],path:match[3]};
  });
}

export async function scanRepository(repoRoot=root) {
  const findings=[];
  for (const entry of trackedFiles(repoRoot)) {
    const {mode,path}=entry;
    findings.push(...scanPath(path));
    if (mode !== '100644' && mode !== '100755') {
      findings.push(report(path,'nonregular-tracked-entry'));
      continue;
    }
    const abs=join(repoRoot,path);
    let stat;
    try { stat=await lstat(abs); }
    catch(e) { findings.push(report(path,'missing-tracked-file')); continue; }
    if (!stat.isFile() || stat.size > 2 * 1024 * 1024) {
      findings.push(report(path,'nontext-or-oversized-file'));
      continue;
    }
    const bytes=await readFile(abs);
    if (bytes.includes(0)) { findings.push(report(path,'binary-content')); continue; }
    let content;
    try { content = new TextDecoder('utf-8',{fatal:true}).decode(bytes); }
    catch { findings.push(report(path,'non-utf8-text')); continue; }
    findings.push(...scanText(path,content));
  }
  return findings;
}

if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  scanRepository().then(findings=>{
    for (const f of findings) console.error(`BLOCK ${f.code}: ${f.path}${f.line?`:${f.line}`:''}`);
    if (findings.length) process.exitCode=1;
    else console.log('PASS: all Git-tracked toolkit files conform to the repository boundary guard');
  }).catch(e=>{console.error(`Boundary guard failed: ${e.message}`);process.exitCode=1;});
}
