# Changelog

This file records **toolkit development**, not website deployments. Entries under **Unreleased** do not imply a version tag or published GitHub Release. The manifest `schemaVersion` is tracked separately.

## Unreleased

### WHPS-002 · Independent website workspace bootstrap (in PR, not published)

- Add a strictly offline new-directory CLI supporting `wix-handoff` and `unbound-frontend`; initialise an independent local Git repository and copy generic site guidance.
- Lock the **published v0.1.0 foundation tag and full SHA** while explicitly identifying the WHPS-002 generator as unreleased development tooling.
- Reject existing destinations and existing-repository mode; block unsafe paths and symlinked parents; rollback staging on errors.
- Add synthetic failure tests and CI smoke checks; no Wix backend interactions, GitHub repository creation, or deployments.

### WHPS-R05.2 · Post-release reconciliation (merged, 2026-10-12)

- Configure grouped weekly Python and GitHub Actions Dependabot updates with CI-tested YAML structure.
- Reconcile Control Room, release governance, adoption documentation and release verification evidence.
- Preserve the already published `v0.1.0` source and keep all real websites in independent repositories.

### WHPS-R05.1 · Publication recovery (merged and executed, 2026-10-12)

- Replace the failed automatic publisher with an explicit, verified manual recovery procedure.
- Successfully publish the v0.1.0 annotated tag and GitHub Release targeting `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7`.
- See [recovery workflow](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876) and [GitHub Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0). Recovery code is **unreleased** and not included in the original v0.1.0 snapshot.

- Post-v0.1.0 changes will be documented here.

## v0.1.0 — 2026-10-12

First published toolkit release: Apache-2.0 licensing and the R01–R04 validated offline framework. [GitHub Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0); source commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7`. Later maintenance belongs to **Unreleased** and does not change this tag.

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
