#!/usr/bin/env python3
"""Read-only audit of a local Wix Headless ZIP against intake manifest.

No extraction, network, Wix API calls, authentication or writes to the source ZIP.
"""
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile, BadZipFile


def audit(archive: Path, manifest: dict, provenance: str):
    data = archive.read_bytes()
    with ZipFile(archive) as z:
        names = [i.filename for i in z.infolist() if not i.is_dir()]
        # Wix downloads and exported artifacts may contain a single wrapper directory.
        segments = [n.split('/') for n in names]
        prefix = segments[0][0] + '/' if segments and all(len(s) > 1 and s[0] == segments[0][0] for s in segments) else ''
        by_name = {n[len(prefix):]: n for n in names}
        blockers, warnings = [], []
        config = {}
        configfile = by_name.get('wix.config.json')
        if configfile:
            try: config = json.loads(z.read(configfile))
            except Exception as exc: blockers.append('Could not parse wix.config.json: ' + str(exc))
        else:
            blockers.append('No wix.config.json at project root; cannot establish existing-site binding')
        expected_id = manifest['wix']['siteId']
        expected_app = manifest['wix']['clientId']
        if configfile and config.get('siteId') != expected_id: blockers.append('Wix siteId does not match original handoff')
        if configfile and config.get('appId') != expected_app: blockers.append('Wix appId does not match original Client ID')
        packagefile = by_name.get('package.json')
        package = {}
        if packagefile:
            try: package = json.loads(z.read(packagefile))
            except Exception as exc: blockers.append('Could not parse package.json: ' + str(exc))
        deps = {**package.get('dependencies', {}), **package.get('devDependencies', {})}
        if 'astro' in deps or '@wix/astro' in deps: framework = 'Astro'
        elif packagefile: framework = 'Node/framework (inspect package.json)'
        elif 'index.html' in by_name: framework = 'plain-static-html'
        else: framework = 'unknown'
        if framework == 'plain-static-html' and not (config.get('site') or {}).get('outputDirectory'):
            warnings.append('Plain static frontend lacks explicit wix.config.json site.outputDirectory; Wix managed release may publish the wrong directory')
        if not packagefile and 'index.html' not in by_name:
            blockers.append('Neither package.json nor root index.html found')
        if provenance != 'wix-original':
            warnings.append('Source ZIP is not established as the original Wix-downloaded template; cannot complete primary handoff provenance gate')
        if any(n.startswith('../') or '/../' in n or n.startswith('/') for n in names):
            blockers.append('Archive contains unsafe traversal paths')
        return {
            'tool': 'WHPS archive auditor v0.1.0',
            'status': 'BLOCKED' if blockers else ('REVIEW_REQUIRED' if warnings else 'PASS'),
            'provenance': provenance,
            'archiveName': archive.name,
            'archiveSha256': hashlib.sha256(data).hexdigest(),
            'projectWrapperDirectory': prefix or None,
            'fileCount': len(names),
            'files': [{'path':n[len(prefix):], 'bytes':z.getinfo(n).file_size} for n in names],
            'framework': framework,
            'wixConfig': {'siteId':config.get('siteId'), 'appId':config.get('appId'), 'outputDirectory':(config.get('site') or {}).get('outputDirectory')},
            'identityMatchesHandoff': bool(configfile and config.get('siteId') == expected_id and config.get('appId') == expected_app),
            'blockers': blockers,
            'warnings': warnings,
            'note':'Archive audit does NOT confirm any successful Wix CLI build, preview, release, form submission, or production test.'
        }


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('archive',type=Path)
    p.add_argument('manifest',type=Path)
    p.add_argument('--provenance',choices=['wix-original','developer-derived','unverified'],default='unverified')
    p.add_argument('--out',type=Path)
    args=p.parse_args()
    try:
        result=audit(args.archive,json.loads(args.manifest.read_text()),args.provenance)
    except (OSError, KeyError, BadZipFile, json.JSONDecodeError) as exc:
        p.error(str(exc))
    output=json.dumps(result,indent=2)+'\n'
    if args.out: args.out.write_text(output)
    print(output)
    if result['blockers']: raise SystemExit(2)

if __name__=='__main__':main()
