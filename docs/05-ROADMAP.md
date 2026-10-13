# 05 — WHPS system roadmap

This roadmap contains **only WHPS tooling and governance** work. Real websites have separate repositories, milestones, and deployment records. Status is evidence-based; see [Control Room](CONTROL-ROOM.md) and [terminology](09-TERMINOLOGY.md).

## Foundation review sequence (R01–R05)

| ID | Objective | Current status (2026-10-13) | Acceptance evidence |
|---|---|---|---|
| WHPS-R01 | Correct schema validation, atomic intake and archive safeguards | **Merged**, CI passed | PR #2 |
| WHPS-R02 | Strengthen negative tests and repo boundary scanning | **Merged**, CI passed | PR #3 |
| WHPS-R03 | Consolidate authority, terminology and documentation | **Merged**, CI passed | PR #4 |
| WHPS-R04 | Establish licence, security, contribution, runtime and release governance | **Merged**, CI passed | PR #5; owner selected Apache-2.0 for R05 |
| WHPS-R05 | Publish first verified toolkit foundation | **Published and verified** | PR #6, annotated v0.1.0 tag and [Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) |
| WHPS-R05.1 | Recover publication and reconcile repository readiness | **Merged and verified** | PR #8, [recovery run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876), approved commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7` |
| WHPS-R05.2 | Reconcile post-release status and dependency-update configuration | **Merged** | PR #9, Dependabot YAML and CI checks |

Apache-2.0 is accepted and the first WHPS toolkit release [`v0.1.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) has been published and verified. The initial publication failure was resolved in [R05.1](15-PUBLICATION-RECOVERY.md). The manifest `0.1.0` schema version remains independent. WHPS v0.2.0 was subsequently published and verified; R06.1 merged, but the v0.2.1 patch is not yet published.

## Later system-development work packets

| ID | Deliverable | Status |
|---|---|---|
| WHPS-001 | Original framework, docs and first safety tooling | Baseline present, subsequently corrected in R01/R02 |
| WHPS-002 | Generic offline website repository bootstrap outside WHPS | **Released in v0.2.0** |
| WHPS-003 | Pure desired-vs-observed Wix resource reconciliation planner | **Released in v0.2.0** |
| WHPS-R06 | v0.2.0 planner/bootstrap hardening and reusable publication | **Published and verified** | PR #14, [v0.2.0 Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.0), source `d17abe627f27808611218d0d2f01dd977030913a` |
| WHPS-R06.1 | v0.2.1 source-integrity and post-release status reconciliation | **Merged, patch unpublished** | Clean Git checkout, canonical local origin checks, tests, accurate release records |
| WHPS-004 | Astro 5-first generic components, optional React islands and Tailwind 4; Wix API/app support contract | **In PR, not released** | [Astro reference](../frontend/astro-primitives/README.md), [Wix compatibility](20-ASTRO-WIX-COMPATIBILITY.md), [acceptance](21-WHPS004-FRONTEND-PRIMITIVES.md) |
| WHPS-005 | Automated quality guidance and contract tests for adopters | Planned |
| WHPS-006 | Versioned distribution and explicit adoption/migration process | Planned |
| WHPS-007 | Sustainable maintenance, contributing, security and compatibility guidance | Governance baseline merged in R04; further work later |

WHPS-002 must support the separate-site architecture without invoking Wix backend writes or deploying real sites from the WHPS repository. See [the WHPS-002 offline bootstrap contract](16-SITE-WORKSPACE-BOOTSTRAP.md). The pre-existing Wix handoff CLI still performs **offline manifest intake only**. The separate WHPS-002 development CLI can initialise a new local Git repository and copy generic site blueprints, but does not download a Wix template, handle existing repository adoption or create a remote.

WHPS-003 is intentionally an [offline, read-only planner](17-READ-ONLY-RESOURCE-PLANNER.md). It does not query Wix, claim snapshot provenance, infer unsafe deletions or implement resource-specific Wix operations. Real observations and plan approval belong to independent website repositories.

## Product completion criterion

An independent site repository can adopt an **actual, versioned** WHPS release, validate its own Wix handoff or other supported entry mode, and follow an explicit upgrade path. The site owns all real Wix identity, source and release evidence; WHPS ships the generic tools and contracts only.
