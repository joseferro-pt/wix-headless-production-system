# 22 — WHPS-004 Closure and WHPS v0.2.1 Publication Evidence

**Decision:** **WHPS-004 CLOSED / ACCEPTED** for a generic, synthetic Astro-first frontend reference only.  
**Recorded:** 13 October 2026, following independently verified WHPS v0.2.1 publication.  
**Repository:** https://github.com/joseferro-pt/wix-headless-production-system  
**Published toolkit version:** [v0.2.1](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1), Apache-2.0.  
**Manifest / adoption-lock / planner contracts:** `schemaVersion: 0.1.0`, `lockVersion: 2`, `planVersion: 1` (separate from toolkit version).

## Publication identity, checked against live GitHub evidence

- **WHPS-004 implementation:** [PR #16](https://github.com/joseferro-pt/wix-headless-production-system/pull/16), merged 13 October 2026 at 15:20:18 UTC, merge commit `3a1bdf90067881ffb5dc2b119162e02a4262f05e`. Repository checks `contracts`, CodeQL JavaScript/TypeScript, Actions and Python passed.
- **Release reconciliation:** [PR #18](https://github.com/joseferro-pt/wix-headless-production-system/pull/18), merged source `877736282def3631a3fad5d368e3098aadac040f`. It reconciled WHPS-R06.1 plus WHPS-004 release scope and restored the tested Astro 5 reference after the unvalidated Astro 7 Dependabot change.
- **Annotated tag:** `refs/tags/v0.2.1` resolves to Git tag object `fac613c48a4e3dcbbe3081af8f05e8bf02939443`, which dereferences to **exact commit `877736282def3631a3fad5d368e3098aadac040f`**.
- **Published GitHub Release:** [WHPS v0.2.1](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1), publicly published at **2026-10-13 15:50:23 UTC**; it identifies `877736282def3631a3fad5d368e3098aadac040f`.
- **Validated release source:** exact-commit `contracts` and CodeQL Actions/JS/Python checks returned **success** on `877736282def3631a3fad5d368e3098aadac040f`.
- **Owner-dispatched publication:** [workflow run 38425418129](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38425418129), event `workflow_dispatch`, conclusion **success**, source `877736282def3631a3fad5d368e3098aadac040f`.
- **Prior publications:** `v0.1.0` and `v0.2.0` are preserved and are not retagged. This closure document is a **post-release `main` record**, not part of the immutable `v0.2.1` tagged tree.

## WHPS-004 acceptance (reference-level only)

| Gate | Result | Evidence and boundary |
|---|---|---|
| 1 · System/site separation | **Accepted** | Apache-2.0, synthetic generic code only; independent real sites own Wix identities, installations, secrets and releases. |
| 2 · Framework choice | **Accepted** | Standalone Astro 5, `@astrojs/react` 4 / React 19 islands, Tailwind CSS 4 / Vite plugin; leave site-local Wix-generated `astro.config.mjs` and `wix.config.json` intact. |
| 3 · Synthetic compilation and source boundaries | **Accepted** | WHPS-004 CI, `contracts` and CodeQL passed; no real Wix credentials or backend actions; static checks cover forbidden Wix/browser boundary usage. |
| 4 · Accessible defaults | **Accepted** | Semantic landmarks, skip link, labelled filtering, result announcements and reduced-motion design defaults. **Not** a completed site/browser accessibility audit. |
| 5 · Wix app/API capability documentation | **Accepted** | [Compatibility matrix](20-ASTRO-WIX-COMPATIBILITY.md) distinguishes supported template routes and business APIs from widget-only apps; any site feature needs API and permissions verification. |
| 6 · Honest compatibility claims | **Accepted** | A standalone build verifies Astro/React/Tailwind interoperability only; **not** Wix-managed auth, SEO, CMS, checkout, bookings, runtime, apps or payments. |
| 7 · Explicit review, validation and publication | **Accepted** | PR #16 merged with green CI/CodeQL; PR #18 resolved release-scope issues; exact-source CI/CodeQL and approved manual v0.2.1 publication succeeded. |

**Official Wix documentation as reviewed on 13 October 2026** supports linking **Astro 5 or Astro 7**, not 6. This WHPS reference specifically builds Astro 5; it does **not** imply Astro 7 has passed the WHPS React/Tailwind or Wix-managed integration matrix.

## Immutable source and historical notes

The `docs/releases/v0.2.1.md` included in the published tag is a **candidate-stage source document**, and its wording is preserved in Git history. The GitHub Release body inherited that candidate wording before appending the actual source, CI and workflow publication evidence. **Its “candidate only” heading is stale as a current-status statement:** the independently verified annotated tag, successful manual publication run and public Release establish publication. This additive record and the reconciled Control Room are the current-status authority. No tag, published source, website, Wix site or existing GitHub Release is mutated by this reconciliation.

## Closure decision and next work

- **Close WHPS-004:** no remaining gate within the approved *synthetic toolkit reference* scope. Do not re-open it to require site-specific Wix services or deployments.
- **WHPS-005 (planned):** reproducible npm dependency lock, type diagnostics, browser/component-level accessibility and behavior tests, reusable Wix-aware site-local verification recipes.
- **WHPS-006 (planned):** versioned distribution, per-site adoption and explicit migrations. Astro 7 interoperability and Wix-managed verification may be separately scoped, never assumed from WHPS-004 compilation.
- **Other open governance:** repository protection and separate-site security/QA remain independent tasks, not WHPS-004 release blockers.

See [frontend reference](../frontend/astro-primitives/README.md), [acceptance contract](21-WHPS004-FRONTEND-PRIMITIVES.md), [Control Room](CONTROL-ROOM.md), [roadmap](05-ROADMAP.md) and [release policy](11-RELEASE-GOVERNANCE.md).
