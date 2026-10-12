# CONTROL ROOM — WHPS system development

**Scope:** Reusable production toolkit only. No Wix client site or site delivery is managed here.  
**Canonical repo:** https://github.com/joseferro-pt/wix-headless-production-system  
**Schema contract:** `0.1.0`; **published toolkit release:** [`v0.1.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0).  
**Source status:** R01–R05 merged; R05.1 recovery merged and publication verified. R05.2 post-release reconciliation has merged. WHPS-002 development is proposed for PR review, and the bootstrap CLI is not published.

## Evidence baseline (12 October 2026)

| Event | Status | Source |
|---|---|---|
| System/site separation | Merged | PR #1, merge commit `abbf9d4` |
| R01 foundation corrections | Merged, main CI passed | PR #2 |
| R02 verification and security | Merged, main CI passed | PR #3 |
| R03 documentation consolidation | Merged, main CI passed | PR #4 |
| Initial toolkit release `v0.1.0` | **Published and verified** on 12 October 2026 | [Release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) and [recovery run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876) |
| Annotated tag | `d1bed61f5f5b731644cb1b0821129514a78c6a93` resolves to approved commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7` | Verified GitHub tag object |
| R05.1 recovery | PR #8 merged; explicit publication succeeded | [PR #8](https://github.com/joseferro-pt/wix-headless-production-system/pull/8), [recovery run](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876) |

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
| WHPS-002 · Independent site bootstrap | **In development; not released** | New-directory Git scaffold, synthetic tests and [contract](16-SITE-WORKSPACE-BOOTSTRAP.md); PR acceptance pending |

## Product-development backlog

`WHPS-001`: initial foundation (merged work); `WHPS-002`: generic site-workspace bootstrap (development); `WHPS-003`: read-only resource planner; `WHPS-004`: frontend primitives; `WHPS-005`: quality framework; `WHPS-006`: distribution/compatibility; `WHPS-007`: maintainability. Details: [roadmap](05-ROADMAP.md).

## Current gate

**Review the WHPS-002 bootstrap PR** with its synthetic safety and Git tests; do not merge without green CI. The first release remains immutable: **do not rerun recovery or move the tag**. Repository protection and confidential vulnerability reporting remain owner-controlled follow-ups.

## Constraints and known limits

- No real Wix identifiers, site archives, content or deployments in the toolkit.
- Apache-2.0 is accepted; v0.1.0 is published and later `main` changes are unreleased.
- No repository rulesets were observed; classic branch protection remains unverified due to connector restrictions.
- The offline archive auditor does not independently attest original Wix provenance.
- Automated scanning cannot guarantee discovery of every credential or historical secret.
- A website built using WHPS is verified only through that website's own tests and deployment report.
