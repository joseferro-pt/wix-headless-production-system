# CONTROL ROOM — WHPS system development

**Scope:** Reusable production toolkit only. No Wix client site or site delivery is managed here.  
**Canonical repo:** https://github.com/joseferro-pt/wix-headless-production-system  
**Schema contract:** `0.1.0`; **latest published toolkit:** [`v0.2.1`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1); source `877736282def3631a3fad5d368e3098aadac040f` (verified annotated tag `fac613c48a4e3dcbbe3081af8f05e8bf02939443`).  
**Source status:** R01–R05 merged; R05.1 recovery merged and publication verified. R05.2 post-release reconciliation has merged. WHPS-002, WHPS-003 and R06 are merged and included in published v0.2.0. R06.1 merged through PR #15 and WHPS-004 merged through PR #16; both shipped in verified **v0.2.1** following PR #18. WHPS-004 is **closed** at the synthetic reference and documentation contract level; live Wix integration is out of scope.

## Evidence baseline (12–13 October 2026)

| Event | Status | Source |
|---|---|---|
| System/site separation | Merged | PR #1, merge commit `abbf9d4` |
| R01 foundation corrections | Merged, main CI passed | PR #2 |
| R02 verification and security | Merged, main CI passed | PR #3 |
| R03 documentation consolidation | Merged, main CI passed | PR #4 |
| Initial toolkit release `v0.1.0` | **Published and verified** on 12 October 2026 | [Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) and [recovery run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876) |
| Annotated tag | `d1bed61f5f5b731644cb1b0821129514a78c6a93` resolves to approved commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7` | Verified GitHub tag object |
| R05.1 recovery | PR #8 merged; explicit publication succeeded | [PR #8](https://github.com/joseferro-pt/wix-headless-production-system/pull/8), [recovery run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876) |
| v0.2.0 publication | **Verified** on 12 October 2026; annotated tag `98db3fba737581a4726ae46876a499113ad784f9` resolves to `d17abe627f27808611218d0d2f01dd977030913a` | [GitHub Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.0), [manual publication run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38277419984) |
| WHPS-004 implementation | **PR #16 merged** 13 October 2026, standalone Astro 5/React/Tailwind synthetic reference; main CI and CodeQL passed | [PR #16](https://github.com/joseferro-pt/wix-headless-production-system/pull/16); [WHPS-004 acceptance](21-WHPS004-FRONTEND-PRIMITIVES.md) |
| v0.2.1 publication | **Published and independently verified** 13 October 2026; annotated tag `fac613c48a4e3dcbbe3081af8f05e8bf02939443` resolves to `877736282def3631a3fad5d368e3098aadac040f`; PR #18 prepared its scope | [GitHub Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1), [publication run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38425418129), [PR #18](https://github.com/joseferro-pt/wix-headless-production-system/pull/18) |
| WHPS-004 closure | **Accepted and closed** for synthetic reusable primitives; no live Wix functionality certified | [Closure/evidence record](22-WHPS004-CLOSURE-AND-V021-PUBLICATION.md) |

**Revalidation:** review the actual GitHub PR, commit and CI state before changing any of these labels. Merging does not imply a published toolkit release.

## System decision register

| ID | Policy | Evidence/status |
|---|---|---|
| DR-001 | WHPS is site-agnostic, never a client workspace | User-directed; implemented by PR #1 |
| DR-002 | Each website uses its own repository | User-directed; implementation toolkit still evolving |
| DR-003 | System CI uses only synthetic test inputs, no Wix credentials | Implemented working rule; R02 verification passed |
| DR-004 | Current official Wix technical guidance governs Wix operations | Documented working rule; verify upstream when deploying |
| DR-005 | Record system/schema version separately from website releases | Applied by merged R03 terminology |
| DR-006 | Apache License 2.0 for WHPS; not for Wix or site projects | **Accepted by owner, 2026-10-12**; `LICENSE`, `NOTICE`, licensing decision |
| DR-007 | Release evidence and offline preflight govern toolkit publication | Adopted: verified annotated tag, exact-commit CI and GitHub Release |

Definitions and evidence rules: [authority/decisions](10-AUTHORITY-AND-DECISIONS.md), [terminology](09-TERMINOLOGY.md).

## Review-to-development sequence

| Packet | Status | Exit evidence |
|---|---|---|
| WHPS-R01 · Correct foundation | Merged | PR #2 + CI success |
| WHPS-R02 · Strengthen verification | Merged | PR #3 + CI success |
| WHPS-R03 · Consolidate documentation | Merged | PR #4 + main CI success |
| WHPS-R04 · Release governance | Merged | PR #5 + `main` CI success |
| WHPS-R05 · Verified foundation | **Published and verified** | PR #6, annotated tag and GitHub Release |
| WHPS-R05.1 · Publication recovery | **Merged and verified** | PR #8 and recovery run `38257202876` |
| WHPS-R05.2 · Post-release reconciliation | **Merged** | PR #9, merged validation and Dependabot checks |
| WHPS-002 · Independent site bootstrap | **Released in v0.2.0** | PR #12, validated site scaffold and [contract](16-SITE-WORKSPACE-BOOTSTRAP.md) |
| WHPS-003 · Read-only reconciliation planner | **Released in v0.2.0** | PR #13 and green CI; strict desired/observed contract and [governance](17-READ-ONLY-RESOURCE-PLANNER.md) |
| WHPS-R06 · v0.2.0 hardening and release | **Published and verified** | PR #14, source `d17abe627f27808611218d0d2f01dd977030913a`, [publication run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38277419984) |
| WHPS-R06.1 · Post-release provenance correction | **Published in v0.2.1** | Fail-closed checkout/origin validation, synthetic regression checks, [patch plan](19-R061-PROVENANCE-AND-RELEASE.md) |

| WHPS-004 · Astro-first frontend primitives | **Closed; published in v0.2.1** | [Wix compatibility matrix](20-ASTRO-WIX-COMPATIBILITY.md), [frontend reference](../frontend/astro-primitives/README.md) and [acceptance plan](21-WHPS004-FRONTEND-PRIMITIVES.md) |

## Product-development backlog

`WHPS-001`: initial foundation (merged work); `WHPS-002`: generic site-workspace bootstrap (released in v0.2.0); `WHPS-003`: read-only resource planner (released in v0.2.0); `WHPS-004`: frontend primitives (closed, published v0.2.1); `WHPS-005`: quality framework; `WHPS-006`: distribution/compatibility; `WHPS-007`: maintainability. Details: [roadmap](05-ROADMAP.md).

## Current gate

**WHPS-004 complete and closed.** Verified publication of v0.2.1 and accepted the scoped synthetic Astro 5 reference through the evidence record. Next milestone: **WHPS-005 quality framework**; WHPS-006 site adoption/distribution follows separately. Astro 7 compatibility work and all actual Wix SDK/app, hosting, SEO, identity, payments and site deployments remain outside the accepted WHPS-004 scope. Preserve immutable prior tags. Repository protection, private vulnerability intake and historical retention remain owner-controlled follow-ups.

## WHPS-005 · Current development review

**Status:** Implementation in a separate feature branch; unpublished. The [quality work packet](23-WHPS005-QUALITY-VERIFICATION.md) defines gates for locked dependencies, Astro diagnostics/build, Chromium/axe browser checks, offline fail-closed site QA records and [site-local Wix verification](24-SITE-LOCAL-VERIFICATION.md). A successful synthetic browser run cannot verify Wix integrations, site identity or owner deployment approval. A merged PR is not an automatic toolkit release; the latest published version remains v0.2.1.

## Constraints and known limits

- No real Wix identifiers, site archives, content or deployments in the toolkit.
- Apache-2.0 is accepted; v0.1.0, v0.2.0 and v0.2.1 are published. The post-release closure documentation is newer than the immutable v0.2.1 tagged source.
- No repository rulesets were observed; classic branch protection remains unverified due to connector restrictions.
- The offline archive auditor does not independently attest original Wix provenance.
- Automated scanning cannot guarantee discovery of every credential or historical secret.
- A website built using WHPS is verified only through that website's own tests and deployment report.
