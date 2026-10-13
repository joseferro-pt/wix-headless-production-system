# Verification and security contract (WHPS-R02)

This repository tests the **generic toolkit only**. It has no Wix credentials or website deployment workflow. Real Wix site IDs, production content, site assets and release records belong to independently managed website repositories.

## Automated checks

- `node scripts/check-repository-boundary.mjs` enumerates **all Git-indexed paths**, including `.github/`, and rejects real/non-synthetic UUIDs, known credential signatures, tracked site configuration files, client workspace directories, symlinks/submodules, binary files and unsafe file types.
- `node --test tests/*.test.mjs` exercises manifest parsing, schema validation, atomic intake, safe output paths, credential detection and deterministic property-style identity/path tests.
- `python -m unittest discover -s tests -p 'test_*.py' -v` exercises benign and synthetic adversarial Wix archive structures.
- `node scripts/intake-wix-handoff.mjs examples/wix-generated-prompt.example.txt /tmp/whps-example` followed by manifest validation checks end-to-end offline intake.
- All these commands run in GitHub Actions on pushes and pull requests. The CI job is read-only and requires no Wix authentication.

## WHPS-005 quality additions (under review)

The generic Astro reference adds `npm ci` against a reviewed lockfile, `astro check`, Chromium browser interaction tests and axe-core automated WCAG rules. These inspect a **synthetic local reference**, never Wix-managed hosting, customer data, SDK sessions or a deployed website. An offline QA report evaluator handles *self-reported* site evidence and deliberately cannot attest it. See [quality scope](23-WHPS005-QUALITY-VERIFICATION.md) and [site-local recipes](24-SITE-LOCAL-VERIFICATION.md).

## Threat model and boundaries

The guard is intended to catch **accidental** inclusion of Wix identities, site-specific files and common high-confidence credential patterns. It is not proof that content is non-sensitive, and it cannot detect every possible token format, obfuscation technique or confidential business fact. Git index scanning is the deliberate baseline: it verifies what will be committed, not every untracked file on a developer's machine.

The scanner intentionally **does not print detected credential values**, only the finding type, path and line number. Identifiers used in examples are explicitly synthetic. Suspicious binaries are blocked until their format and purpose are reviewed. Avoid copying live site archives into this repository.

The ZIP auditor does not extract files, make API calls or verify source authenticity. It records an original-site **provenance claim** but cannot independently attest that the archive came from Wix. Archive metadata guardrails bound size, member count and compression, and dangerous names or links are blocked. A clean metadata audit is not a valid Wix deployment, runtime test or proof of site origin.

## Important limitations / further work

- Existing **Git history** may contain content removed from the current branch. This guard does not scan all historical commits, and deleting a file from the current tree does not purge it from history. Treat verified credential exposure as an incident requiring revocation and separately approved cleanup.
- Enable and review GitHub's native secret scanning and push protection wherever the repository's GitHub plan and settings make them available. Consider a dedicated scanner (such as Gitleaks) with a reviewed rule set before WHPS is broadly distributed.
- No property-style testing in this release uses nondeterministic external inputs. Tests are deterministic and reproducible; a fuller property-testing framework remains optional.
- Project-local security and deployment tests must run from **each website's repository**. The system CI must never include a privileged Wix token or deploy a client website.
