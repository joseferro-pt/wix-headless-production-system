# 27 — WHPS v0.3.0 Publication and Historical Catalog Reconciliation

**Outcome:** **Published and independently verified** on 15 October 2026.  
**Latest published toolkit:** [WHPS v0.3.0](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0)  
**Scope:** WHPS-005 quality framework + WHPS-006 versioned distribution/site adoption; no live Wix site, data or deployment.

## Verified publication identity

| Evidence | Verified GitHub record |
|---|---|
| Release tag | `v0.3.0` annotated reference |
| Annotated tag object | `7f6712db3d484e42e48a888047018be7dc1da1b6` |
| Dereferenced commit | `bb4d0adcd9021b5cd671e13fed46d5498fac4399` |
| Public GitHub Release | [WHPS v0.3.0](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0), non-draft, non-prerelease |
| Published | `2026-10-15T12:21:25Z` |
| Successful manual workflow | [Run 38733962956](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38733962956), `workflow_dispatch`, successful at exactly `bb4d0adcd9021b5cd671e13fed46d5498fac4399` |
| Source validation | [Validation run 38732747755](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38732747755), `push`, success at exact source |
| Source security scans | [CodeQL run 38732747746](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38732747746), `push`, success at exact source |
| Release preparation | [PR #26](https://github.com/joseferro-pt/wix-headless-production-system/pull/26), merged to approved source with green PR checks |

The source commit is the same current `main` commit at the time of publication. The manual workflow completed successfully with the expected inputs and GitHub Release notes include the exact source SHA, CI and publication workflow URLs. Earlier v0.1.0, v0.2.0 and v0.2.1 annotated tags remain unchanged.

## Post-publication catalog decision

The [published v0.3.0 source](https://github.com/joseferro-pt/wix-headless-production-system/tree/v0.3.0) legitimately contains a **historical** catalog through v0.2.1 because adding an unpublished release to the catalog would have misrepresented its existence.

Only **after** the annotated v0.3.0 tag and public Release were independently verified, this separate reviewed update appended:

- Tag `v0.3.0`, exact commit `bb4d0adcd9021b5cd671e13fed46d5498fac4399`, annotated tag object `7f6712db3d484e42e48a888047018be7dc1da1b6`, published timestamp `2026-10-15T12:21:25Z`.
- Shipped components: `governance`, `validation`, `bootstrap-cli`, `resource-planner`, `astro-reference` and **new `site-qa`**.
- `catalogVersion: 1` remains unchanged. `verifiedDate` advances to `2026-10-15`.
- Regression tests now assert the release identity, successful **offline** v0.2.1 → v0.3.0 upgrade planning and unchanged blocking of downgrades, implicit removals, invented versions and missing approval.

**Important distinction:** This **post-release `main` update is not in the immutable v0.3.0 source**. An adopter checking out `v0.3.0` obtains exactly the published toolkit, but its embedded historical catalog still ends at v0.2.1. For offline v0.3.0 self-adoption planning, use a separately reviewed later toolkit checkout containing this catalog update, or prepare an explicit site-owned plan with independent verification; do not modify the published tag or invent a prepublication entry.

The online `scripts/verify-toolkit-release.mjs` checks GitHub's public release identity directly and can verify the published v0.3.0 tag regardless of the embedded catalog, but **cannot certify Wix integration, site quality or release authority**.

## Accepted scope and limits

- **WHPS-005 published:** committed dependency lock, `npm ci`, Astro 5 diagnostics/build, Chromium hydration/keyboard/responsive checks, axe automated accessibility rules, site QA schema and offline evidence evaluator.
- **WHPS-006 published:** source-pinned annotated tag verification, offline adoption planner, separate website adoption records and migration instructions.
- **No Wix certification:** no real Wix-managed Astro adapter/auth/API, CMS, members, commerce, bookings, payments, SEO or site deployment verified here. Automated axe findings are not a comprehensive accessibility audit.
- **No Astro 7 switch:** Dependabot PR #23 is separate and requires compatibility tests. The reference remains Astro 5 + optional React 19 + Tailwind 4.
- **No automatic site changes:** sites own their code, Wix project configuration, records, permissions and releases.
- **Next packet:** WHPS-007 sustainable maintenance, security, contributing and compatibility governance.

## Authority and historical records

The [v0.3.0 candidate-stage notes](releases/v0.3.0.md), [original approval preparation plan](26-V030-RELEASE-PLAN.md), Git tag and public Release are preserved. Statements such as “candidate” or “not yet published” in the *original tagged files* are **historical context**, not current status.

This additive record, the updated Control Room, the public GitHub Release and the verified tag/workflow are the current status authority. Do **not** retag v0.3.0 or edit its published GitHub Release merely to restate current status.
