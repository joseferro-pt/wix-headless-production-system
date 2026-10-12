#!/usr/bin/env python3
"""Read-only Wix Headless ZIP contract auditor, with untrusted-archive safeguards.

The --provenance flag denotes a CLAIM; this offline program cannot attest Wix origin.
No extraction, network operations, authentication, or Wix mutations.
"""
import argparse
import hashlib
import json
import re
import stat
from pathlib import Path
from zipfile import ZipFile, BadZipFile

MAX_ZIP_BYTES = 200 * 1024 * 1024
MAX_FILES = 10000
MAX_TOTAL_UNCOMPRESSED = 1024 * 1024 * 1024
MAX_MEMBER_BYTES = 100 * 1024 * 1024
MAX_COMPRESSION_RATIO = 1000


def sha256_file(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for data in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(data)
    return digest.hexdigest()


def unsafe_path(name):
    if not name or '\\' in name or '\0' in name or name.startswith('/') or re.match(r'^[A-Za-z]:', name):
        return True
    return any(part in ('.', '..', '') for part in name.split('/'))


def audit(archive: Path, manifest: dict, provenance: str):
    blockers, warnings = [], []
    if archive.stat().st_size > MAX_ZIP_BYTES:
        blockers.append('Archive exceeds configured compressed-size limit')
    with ZipFile(archive) as z:
        members = [i for i in z.infolist() if not i.is_dir()]
        names = [i.filename for i in members]
        if len(members) > MAX_FILES: blockers.append('Too many archive members')
        total_bytes = sum(i.file_size for i in members)
        if total_bytes > MAX_TOTAL_UNCOMPRESSED: blockers.append('Archive exceeds uncompressed-size limit')
        for info in members:
            if unsafe_path(info.filename): blockers.append('Unsafe member path: ' + repr(info.filename))
            if info.file_size > MAX_MEMBER_BYTES: blockers.append('Oversized member: ' + info.filename)
            if info.file_size > 1024 * 1024 and info.file_size / max(info.compress_size, 1) > MAX_COMPRESSION_RATIO:
                blockers.append('Extreme compression ratio: ' + info.filename)
            if stat.S_ISLNK(info.external_attr >> 16): blockers.append('Symbolic link is not allowed: ' + info.filename)
        if len(set(names)) != len(names): blockers.append('Duplicate archive member paths')
        segments = [n.split('/') for n in names]
        prefix = (segments[0][0] + '/') if segments and all(len(s) > 1 and s[0] == segments[0][0] for s in segments) else ''
        by_name = {name[len(prefix):]: name for name in names}
        if len(by_name) != len(names): blockers.append('Duplicate paths after wrapper normalization')
        config = {}
        configfile = by_name.get('wix.config.json')
        # Never read oversized entries or suspicious archive content into memory.
        if not blockers and configfile:
            try: config = json.loads(z.read(configfile))
            except (ValueError, UnicodeError, OSError, BadZipFile) as exc: blockers.append('Cannot parse wix.config.json: ' + str(exc))
        elif not configfile: blockers.append('No wix.config.json at project root')
        if not isinstance(config, dict):
            blockers.append('wix.config.json must be an object'); config = {}
        expected = manifest.get('wix', {})
        if not expected.get('siteId') or not expected.get('clientId'):
            blockers.append('Expected Wix site ID and client ID must be provided')
        if configfile and not blockers and config.get('siteId') != expected.get('siteId'):
            blockers.append('Wix siteId does not match original handoff')
        if configfile and not blockers and config.get('appId') != expected.get('clientId'):
            blockers.append('Wix appId does not match original Client ID')
        packagefile = by_name.get('package.json')
        package = {}
        if packagefile and not blockers:
            try: package = json.loads(z.read(packagefile))
            except (ValueError, UnicodeError, OSError, BadZipFile) as exc: blockers.append('Cannot parse package.json: ' + str(exc))
        if not isinstance(package, dict):
            blockers.append('package.json must be an object'); package = {}
        dependencies = package.get('dependencies') or {}
        dev_dependencies = package.get('devDependencies') or {}
        if not isinstance(dependencies, dict) or not isinstance(dev_dependencies, dict):
            blockers.append('package.json dependencies must be objects')
            dependencies, dev_dependencies = {}, {}
        deps = {**dependencies, **dev_dependencies}
        if 'astro' in deps or '@wix/astro' in deps: framework = 'Astro'
        elif packagefile: framework = 'Node/framework (inspect package.json)'
        elif 'index.html' in by_name: framework = 'plain-static-html'
        else: framework = 'unknown'
        site_settings = config.get('site') or {}
        if not isinstance(site_settings, dict):
            blockers.append('wix.config.json site must be an object')
            site_settings = {}
        if framework == 'plain-static-html' and not site_settings.get('outputDirectory'):
            warnings.append('Plain static frontend lacks site.outputDirectory')
        if not packagefile and 'index.html' not in by_name: blockers.append('No package.json or root index.html')
        warnings.append('Original Wix origin has not been independently verified by this offline audit (provenance is user-supplied)')
        return {
            'tool': 'WHPS archive auditor v0.1.1',
            'status': 'BLOCKED' if blockers else 'REVIEW_REQUIRED',
            'provenanceClaim': provenance, 'provenanceVerified': False,
            'archiveName': archive.name, 'archiveSha256': sha256_file(archive),
            'projectWrapperDirectory': prefix or None, 'fileCount': len(names),
            'files': [{'path':n[len(prefix):], 'bytes':i.file_size} for n,i in zip(names,members)],
            'framework': framework,
            'wixConfig': {'siteId':config.get('siteId'), 'appId':config.get('appId'), 'outputDirectory':site_settings.get('outputDirectory')},
            'identityMatchesHandoff': bool(configfile and not blockers and config.get('siteId') == expected.get('siteId') and config.get('appId') == expected.get('clientId')),
            'blockers': blockers, 'warnings': warnings,
            'note':'No successful Wix build, release or production functionality is established by this audit.'
        }


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('archive',type=Path)
    p.add_argument('manifest',type=Path)
    p.add_argument('--provenance',choices=['wix-original','developer-derived','unverified'],default='unverified')
    p.add_argument('--out',type=Path)
    args=p.parse_args()
    try: result=audit(args.archive,json.loads(args.manifest.read_text()),args.provenance)
    except (OSError, KeyError, BadZipFile, ValueError) as exc: p.error(str(exc))
    output=json.dumps(result,indent=2)+'\n'
    if args.out: args.out.write_text(output)
    print(output)
    if result['blockers']: raise SystemExit(2)

if __name__ == '__main__': main()
