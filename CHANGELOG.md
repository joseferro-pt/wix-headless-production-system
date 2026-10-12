# Changelog

This file records **toolkit development**, not website deployments. Entries under **Unreleased** do not imply a version tag or published GitHub Release. The manifest `schemaVersion` is tracked separately.

## Unreleased

### WHPS-R05.1 · Recover release publication (proposed)

- Replace the failed one-time automatic v0.1.0 publisher with an explicit, idempotent and independently verified manual recovery procedure.
- Reconcile R05 merge, Apache-2.0 contribution/security guidance and missing publication evidence.
- Keep the approved R05 source commit unchanged and keep all website projects outside WHPS.

- Post-v0.1.0 changes will be documented here.

## v0.1.0 — 2026-10-12

First toolkit release candidate: Apache-2.0 licensing and the R01–R04 tested offline production-system foundation. See [v0.1.0 release notes](docs/releases/v0.1.0.md). Git tag and GitHub Release must be verified separately.

### WHPS-R04 · Release governance (merged, 2026-10-12)

- Add contributor and security policies, a CI-tested runtime matrix, draft licence decision and repository-protection recommendations.
- Define versioning, release approval gates and independently verifiable release evidence.
- Add a read-only release-governance checker and synthetic tests, and integrate policy validation into CI.
- R04 did not itself publish a licence or release; licensing and release-candidate publication are handled by R05.

### WHPS-R03 · Documentation consolidation (merged, 2026-10-12)

- Align README, agent rules, Control Room, roadmap, project adoption and website blueprints with merged R01/R02 state.
- Add a documentation map, terminology glossary and domain-specific authority/decision contract.
- Clarify that WHPS does **not** yet have a published toolkit release, tagged adoption mechanism or complete website bootstrap engine.
- Add a synthetic, offline documentation-reference test.

### WHPS-R02 · Verification and security (merged, 2026-10-12)

- Add Git-indexed scanning for accidental Wix identifiers and high-confidence credentials without echoing their values.
- Add deterministic identity/path property-style tests, negative manifest/archive cases and symlink protections.
- Apply read-only GitHub Actions permissions and document detection limits.

### WHPS-R01 · Foundation correction (merged, 2026-10-12)

- Enforce JSON Schema Draft 2020-12 validation, entry-mode conditions and preserved original handoff requirements.
- Make offline intake atomic and block targets inside the toolkit checkout.
- Harden untrusted ZIP inspection and distinguish provenance claims from proof.

### Site-independence refactor (merged, 2026-10-12)

- Separate system governance from project-specific site records and roadmap milestones.
- Introduce generic website blueprints and site-repository boundaries.
- Remove one site-specific pilot report from the current tree; **historical Git commits still retain it**.

## Initial development baseline — 2026-10-12

- Created the first Wix handoff parser, JSON Schemas, read-only archive auditor, synthetic tests and operating documents.
- Published the baseline **commit** to GitHub, followed by the reviewed refactors above.
- **Not a formally tagged or published WHPS release.**
