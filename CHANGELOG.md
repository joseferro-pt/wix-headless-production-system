# Changelog

This file records **toolkit development**, not website deployments. Entries under **Unreleased** do not imply a version tag or published GitHub Release. The manifest `schemaVersion` is tracked separately.

## Unreleased

### WHPS-005 · Quality and verification (implementation in PR; unreleased)

- Add a committed npm lockfile for the Astro 5/React 19/Tailwind 4 synthetic frontend with `npm ci`, `astro check`, browser Playwright/Chromium tests and axe-core automated accessibility scanning.
- Introduce a read-only operator-reported site QA evidence report contract (JSON Schema, evaluator, negative tests and synthetic example); it cannot verify a real Wix site or authorise release.
- Add Wix-aware site-local testing and evidence recipes, retaining app/SDK/auth/SEO/production testing inside independent website repositories.
- This is **not** included in the already published v0.2.1 source. WHPS-006 remains planned.

## v0.2.1 — Published 2026-10-13

- [Public release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1), annotated tag `fac613c48a4e3dcbbe3081af8f05e8bf02939443` resolving to source `877736282def3631a3fad5d368e3098aadac040f`; [successful manual publication](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38425418129).
- Includes WHPS-004's synthetic Astro 5/React 19/Tailwind 4 reference and WHPS-R06.1's provenance safeguards, with unchanged schema versions. Site-specific Wix compatibility remains unverified.
- See [post-release WHPS-004 closure and independent publication evidence](docs/22-WHPS004-CLOSURE-AND-V021-PUBLICATION.md). Published tag and historic candidate notes remain unchanged.

### WHPS-004 · Astro-first reusable frontend primitives (released and closed)

- Add a generic Astro 5 reference with accessible semantic layout/section/card/status components, optional React 19 filter island, and Tailwind CSS 4 Vite integration.
- Separate read-only server data contracts from serialisable browser components. All synthetic data only, no Wix auth, app installations, site IDs, Wix CLI release or real Wix SDK integration in WHPS.
- Publish documentation-based compatibility rules for Wix-managed Astro, Wix business-solution APIs versus widget-only apps, Astro 5 reference baseline (the current Wix link flow also supports Astro 7 but not Astro 6), and maximal site-local design freedom.
- Add isolated Astro compile check to CI and static boundary/accessibility tests. PR #16 merged on 13 October 2026; included in published v0.2.1. No live Wix integration or app certification is implied.

### WHPS-R06.1 · Post-release provenance safeguards (released in v0.2.1)

- Fail closed when the WHPS bootstrap generator runs from a Git checkout with staged, unstaged, untracked or submodule changes.
- Require a local `origin` URL matching the canonical WHPS repository via approved HTTPS or SSH formats before attributing generator provenance. Local origin is **not independently attested remote ownership**.
- Add negative regression tests for dirty checkouts, missing/spoofed origins and allowed canonical URL variants.
- Reconcile published v0.2.0 provenance and include the changes in owner-approved v0.2.1. Publication was manual, verified, and made no website source changes.

## v0.2.0 — Published 2026-10-12

- First prospective release of WHPS-002 independent local Git site bootstrap and WHPS-003 read-only resource planner.
- Correct planner duplicate-creation ambiguity, validate plan output contract, and record exact source checkout provenance for generated site workspaces.
- Introduce explicitly approved and verifiable generic GitHub release publication and documented compatibility scope.
- No website deployments, live Wix API access, client data or migrations of existing website repositories.

### WHPS-R06 · v0.2.0 release hardening (merged and published, 2026-10-12)

- Block duplicate desired type/name resource creations and add machine-readable output schema validation for the offline WHPS-003 planner.
- Record the **exact generating Git checkout** and optional unverified exact tag in a v2 website adoption lock; keep v0.1.0 only as historical foundation evidence.
- Add a reusable, manual-only source-SHA-bound release publisher with no tag rewrites, exact-commit CI/CodeQL checks and independent release verification.
- Add release-focused regression tests, integration smoke checks and candidate release notes. No live Wix site work and no automatic publication.

### WHPS-003 · Offline read-only Wix resource planner (published in v0.2.0)

- Add metadata-only desired/observed reconciliation with a strict standalone JSON Schema, optional historical registry and synthetic example.
- Prefer stable ID and unique exact type/name; block missing, ambiguous and cross-site identities; require type coverage for absence claims.
- Propose create/reuse/update/retire/blocked/untracked actions without API calls or backend mutations. Explicit retirement intent and human approval are required.
- Add negative regression tests, documentation and offline CI smoke check.

### WHPS-002 · Independent website workspace bootstrap (published in v0.2.0)

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
