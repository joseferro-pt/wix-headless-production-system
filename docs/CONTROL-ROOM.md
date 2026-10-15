# CONTROL ROOM — WHPS system development

**Scope:** Reusable production toolkit only. No Wix client site or site delivery is managed here.  
**Canonical repo:** https://github.com/joseferro-pt/wix-headless-production-system  
**Schema contract:** `0.1.0`; **latest published toolkit:** [`v0.3.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0); source `bb4d0adcd9021b5cd671e13fed46d5498fac4399` (verified annotated tag `7f6712db3d484e42e48a888047018be7dc1da1b6`, [publisher](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38733962956)).  
**Source status:** R01–R05 merged; R05.1 recovery merged and publication verified. R05.2 post-release reconciliation has merged. WHPS-002, WHPS-003 and R06 are merged and included in published v0.2.0. R06.1 merged through PR #15 and WHPS-004 merged through PR #16; both shipped in verified **v0.2.1** following PR #18. WHPS-004 is **closed** at the synthetic reference and documentation contract level; live Wix integration is out of scope.

## Evidence baseline (12–15 October 2026)

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
| WHPS-005 and WHPS-006 implementations | Merged and **published in v0.3.0** | PR #20 (QA), PR #24 (adoption), [v0.3.0 release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0) |
| v0.3.0 publication | **Verified 15 October 2026**; annotated `7f6712db3d484e42e48a888047018be7dc1da1b6` resolves to `bb4d0adcd9021b5cd671e13fed46d5498fac4399` | [Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0), [successful publisher](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38733962956), [exact-commit validation](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38732747755), [CodeQL](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38732747746) |
| WHPS-R07 post-publication catalog | New reviewed source changes **after** immutable v0.3.0 | [Publication/reconciliation record](27-V030-PUBLICATION-AND-CATALOG.md) |

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

`WHPS-001`: initial foundation (merged work); `WHPS-002`: generic site-workspace bootstrap (released in v0.2.0); `WHPS-003`: read-only resource planner (released in v0.2.0); `WHPS-004`: frontend primitives (closed, published v0.2.1); `WHPS-005`: quality framework (published v0.3.0); `WHPS-006`: versioned distribution/adoption (published v0.3.0); `WHPS-007`: maintainability. Details: [roadmap](05-ROADMAP.md).

## Historical WHPS-004 acceptance

WHPS-004 remains **accepted and closed** at the synthetic Astro 5 toolkit-reference level, first published in v0.2.1. Its closure does not assert live Wix integration. The newer WHPS-005 and WHPS-006 packets are separately published in v0.3.0.

## WHPS-005 · Current development review

**Status:** Merged via [PR #20](https://github.com/joseferro-pt/wix-headless-production-system/pull/20), main merge commit `5b1989a4579a115d36a4301ff0f9f0c3313b3e22`; **released in verified v0.3.0**. The [quality work packet](23-WHPS005-QUALITY-VERIFICATION.md) defines gates for locked dependencies, Astro diagnostics/build, Chromium/axe browser checks, offline fail-closed site QA records and [site-local Wix verification](24-SITE-LOCAL-VERIFICATION.md). A successful synthetic browser run cannot verify Wix integrations, site identity or owner deployment approval. The reviewed PR and [independently verified v0.3.0 publication](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0) are separate evidence gates; passing synthetic QA does not certify a live site.

## Current next gate

**WHPS-R07 release and catalog reconciliation:** v0.3.0 was published and verified independently on 15 October 2026. A post-release reviewed `main` catalog update now makes v0.3.0 available as a target to the offline adoption planner, without retagging the original release. **Next development packet: WHPS-007 sustainable maintenance, security, contribution and compatibility.** The pending Astro 7 Dependabot PR #23 requires separate compatibility evidence; live Wix SDK, apps, hosting, SEO, identity, payments and deployments stay in independent site repositories. Repository protection/private security intake remain owner-controlled.

## WHPS-006 · Versioned distribution and adoption (released)

**Status:** Merged via [PR #24](https://github.com/joseferro-pt/wix-headless-production-system/pull/24), merge commit `1c43f240b3d8efe3c114c30d0a77116a329256ae`; **published in v0.3.0**. See [distribution and adoption contract](25-WHPS006-DISTRIBUTION-ADOPTION.md). The historical public-release catalog, online read-only GitHub provenance verifier, offline adoption/upgrade planner and website-owned `whps.adoption.json` are intended to prevent floating `main` adoption and accidental overwriting of original site-generation locks. The tools do not perform site Git/Wix operations or apply migrations. The separate release-approval, exact-main CI and public publication verification succeeded; see [permanent evidence](27-V030-PUBLICATION-AND-CATALOG.md). Next maintenance packet: WHPS-007.

## WHPS-R07 · v0.3.0 published and catalog reconciled

**Stage:** **Published and independently verified** on 15 October 2026, scoped to WHPS-005 + WHPS-006. [Release notes](releases/v0.3.0.md) identify additive schemas and CI coverage, explicitly exclude Dependabot PR #23's Astro 7 upgrade and live Wix validation, and disclose that the historical distribution catalog needs a post-publication update before the offline planner can target v0.3.0. The manual owner-authorised [publication workflow](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38733962956) succeeded and the annotated tag and GitHub Release match the approved SHA; [historical approval plan](26-V030-RELEASE-PLAN.md) is preserved as a candidate-stage record, with [post-publication verification](27-V030-PUBLICATION-AND-CATALOG.md). Preserve all immutable historical tags.

## WHPS-007 · Maintenance and compatibility (development)

**Stage:** Implemented and merged via [PR #28](https://github.com/joseferro-pt/wix-headless-production-system/pull/28), main merge commit `82381d92871476fd62a06cb288b76c7b98ec66f2`; **not part of published v0.3.0**. The [WHPS-007 operating guide](28-WHPS007-MAINTENANCE-SECURITY-COMPATIBILITY.md) adds weekly npm Dependabot coverage, an offline reviewed Astro/React/Tailwind-major and npm lock provenance guard, dependency/security review cadence and major-upgrade discipline. The existing [Astro 7 PR #23](https://github.com/joseferro-pt/wix-headless-production-system/pull/23) is excluded from the accepted Astro 5 reference until independently verified. The GitHub API currently reports **no rulesets**; classic branch protection and private vulnerability reporting remain owner-unverified. No real Wix integration was tested, and no release publication is authorised by merging this work. **Next owner-controlled actions:** verify main push checks, confirm branch/tag protection and private vulnerability reporting in Settings, review new npm Dependabot alerts separately, and decide whether/when to initiate the independently tested Astro 7 compatibility packet.

## Constraints and known limits

- No real Wix identifiers, site archives, content or deployments in the toolkit.
- Apache-2.0 is accepted; v0.1.0, v0.2.0 and v0.2.1 are published. The post-release closure documentation is newer than the immutable v0.2.1 tagged source.
- No repository rulesets were observed; classic branch protection remains unverified due to connector restrictions.
- The offline archive auditor does not independently attest original Wix provenance.
- Automated scanning cannot guarantee discovery of every credential or historical secret.
- A website built using WHPS is verified only through that website's own tests and deployment report.
