# 05 — WHPS system roadmap

This roadmap contains **only WHPS tooling and governance** work. Real websites have separate repositories, milestones, and deployment records. Status is evidence-based; see [Control Room](CONTROL-ROOM.md) and [terminology](09-TERMINOLOGY.md).

## Foundation review sequence (R01–R05)

| ID | Objective | Current status (2026-10-12) | Acceptance evidence |
|---|---|---|---|
| WHPS-R01 | Correct schema validation, atomic intake and archive safeguards | **Merged**, CI passed | PR #2 |
| WHPS-R02 | Strengthen negative tests and repo boundary scanning | **Merged**, CI passed | PR #3 |
| WHPS-R03 | Consolidate authority, terminology and documentation | **Merged**, CI passed | PR #4 |
| WHPS-R04 | Establish licence, security, contribution, runtime and release governance | **Merged**, CI passed | PR #5; owner selected Apache-2.0 for R05 |
| WHPS-R05 | Publish first verified toolkit foundation | **Published and verified** | PR #6, annotated v0.1.0 tag and [Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) |
| WHPS-R05.1 | Recover publication and reconcile repository readiness | **Merged and verified** | PR #8, [recovery run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876), approved commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7` |
| WHPS-R05.2 | Reconcile post-release status and dependency-update configuration | **Proposed in PR** | Valid Dependabot config, CI checks, updated release evidence |

Apache-2.0 is accepted and the first WHPS toolkit release [`v0.1.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) has been published and verified. The initial publication failure was resolved in [R05.1](15-PUBLICATION-RECOVERY.md). The manifest `0.1.0` schema version remains independent; later work is unreleased.

## Later system-development work packets

| ID | Deliverable | Status |
|---|---|---|
| WHPS-001 | Original framework, docs and first safety tooling | Baseline present, subsequently corrected in R01/R02 |
| WHPS-002 | Generic offline website repository bootstrap outside WHPS | **Not started**; follow R05.2 acceptance |
| WHPS-003 | Pure desired-vs-observed Wix resource reconciliation planner | Planned |
| WHPS-004 | Framework-specific reusable frontend building blocks | Planned |
| WHPS-005 | Automated quality guidance and contract tests for adopters | Planned |
| WHPS-006 | Versioned distribution and explicit adoption/migration process | Planned |
| WHPS-007 | Sustainable maintenance, contributing, security and compatibility guidance | Governance baseline merged in R04; further work later |

WHPS-002 must support the separate-site architecture without invoking Wix backend writes or deploying real sites from the WHPS repository. The current Wix handoff CLI performs **offline manifest intake only** and does not yet create a complete Git repository or download a template.

## Product completion criterion

An independent site repository can adopt an **actual, versioned** WHPS release, validate its own Wix handoff or other supported entry mode, and follow an explicit upgrade path. The site owns all real Wix identity, source and release evidence; WHPS ships the generic tools and contracts only.
