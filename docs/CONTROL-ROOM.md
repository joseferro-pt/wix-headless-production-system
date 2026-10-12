# CONTROL ROOM — WHPS system development

**Scope:** Reusable production toolkit only. No Wix client site or site delivery is managed here.  
**Canonical repo:** https://github.com/joseferro-pt/wix-headless-production-system  
**Schema contract:** `0.1.0`; **toolkit candidate:** `v0.1.0`, publication verified through GitHub Releases.  
**Source status:** R01–R04 merged with green CI; R05 release candidate is pending review/publish verification.

## Evidence baseline (12 October 2026)

| Event | Status | Source |
|---|---|---|
| System/site separation | Merged | PR #1, merge commit `abbf9d4` |
| R01 foundation corrections | Merged, main CI passed | PR #2 |
| R02 verification and security | Merged, main CI passed | PR #3 |
| R03 documentation consolidation | Merged, main CI passed | PR #4 |
| Initial toolkit release | v0.1.0 candidate; publication must be checked | `docs/releases/v0.1.0.md` and GitHub Releases |

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
| DR-007 | Release evidence and offline preflight govern toolkit publication | R04 merged; R05 candidate uses CI-gated release workflow |

Definitions and evidence rules: [authority/decisions](10-AUTHORITY-AND-DECISIONS.md), [terminology](09-TERMINOLOGY.md).

## Review-to-development sequence

| Packet | Status | Exit evidence |
|---|---|---|
| WHPS-R01 · Correct foundation | Merged | PR #2 + CI success |
| WHPS-R02 · Strengthen verification | Merged | PR #3 + CI success |
| WHPS-R03 · Consolidate documentation | Merged | PR #4 + main CI success |
| WHPS-R04 · Release governance | Merged | PR #5 + `main` CI success |
| WHPS-R05 · Verified foundation | Release candidate under review | Apache-2.0, notes, CI-gated annotated tag, GitHub Release and verification |

## Product-development backlog

`WHPS-001`: initial foundation (merged work); `WHPS-002`: generic site-workspace bootstrap (not started); `WHPS-003`: read-only resource planner; `WHPS-004`: frontend primitives; `WHPS-005`: quality framework; `WHPS-006`: distribution/compatibility; `WHPS-007`: maintainability. Details: [roadmap](05-ROADMAP.md).

## Current gate

**Review and merge the R05 release candidate**; verify tag and GitHub Release after green `main` CI. Repository protection settings remain a separately recorded improvement. WHPS-002 remains subsequent product work, not a reason to import a real website ZIP into WHPS.

## Constraints and known limits

- No real Wix identifiers, site archives, content or deployments in the toolkit.
- Apache-2.0 licence is accepted; `v0.1.0` must not be represented as published until the GitHub tag and Release are confirmed.
- No repository rulesets were observed; classic branch protection remains unverified due to connector restrictions.
- The offline archive auditor does not independently attest original Wix provenance.
- Automated scanning cannot guarantee discovery of every credential or historical secret.
- A website built using WHPS is verified only through that website's own tests and deployment report.
