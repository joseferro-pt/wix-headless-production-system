# CONTROL ROOM — WHPS system development

**Scope:** Reusable production toolkit only. No Wix client site or site delivery is managed here.  
**Canonical repo:** https://github.com/joseferro-pt/wix-headless-production-system  
**Schema contract:** `0.1.0`; **published toolkit releases:** none as of 2026-10-12.  
**Source status:** R01 and R02 merged and CI-passed; R03 proposed for review.

## Evidence baseline (12 October 2026)

| Event | Status | Source |
|---|---|---|
| System/site separation | Merged | PR #1, merge commit `abbf9d4` |
| R01 foundation corrections | Merged, main CI passed | PR #2 |
| R02 verification and security | Merged, main CI passed | PR #3 |
| R03 documentation consolidation | In development / PR review | Current R03 changes; **not accepted until merged** |
| First tagged toolkit release | Not published | GitHub Releases currently empty |

**Revalidation:** review the actual GitHub PR, commit and CI state before changing any of these labels. Merging does not imply a published toolkit release.

## System decision register

| ID | Policy | Evidence/status |
|---|---|---|
| DR-001 | WHPS is site-agnostic, never a client workspace | User-directed; implemented by PR #1 |
| DR-002 | Each website uses its own repository | User-directed; implementation toolkit still evolving |
| DR-003 | System CI uses only synthetic test inputs, no Wix credentials | Implemented working rule; R02 verification passed |
| DR-004 | Current official Wix technical guidance governs Wix operations | Documented working rule; verify upstream when deploying |
| DR-005 | Record system/schema version separately from website releases | Proposed R03 terminology clarification |

Definitions and evidence rules: [authority/decisions](10-AUTHORITY-AND-DECISIONS.md), [terminology](09-TERMINOLOGY.md).

## Review-to-development sequence

| Packet | Status | Exit evidence |
|---|---|---|
| WHPS-R01 · Correct foundation | Merged | PR #2 + CI success |
| WHPS-R02 · Strengthen verification | Merged | PR #3 + CI success |
| WHPS-R03 · Consolidate documentation | In review | Terminology, authority, roadmap, README, blueprints consistent; CI |
| WHPS-R04 · Release governance | Queued | Licence, contribution/security policy, supported runtimes, tags/release workflow |
| WHPS-R05 · Verified foundation | Queued | Approved release candidate, checks, tag and published release evidence |

## Product-development backlog

`WHPS-001`: initial foundation (merged work); `WHPS-002`: generic site-workspace bootstrap (not started); `WHPS-003`: read-only resource planner; `WHPS-004`: frontend primitives; `WHPS-005`: quality framework; `WHPS-006`: distribution/compatibility; `WHPS-007`: maintainability. Details: [roadmap](05-ROADMAP.md).

## Current gate

**Complete and review R03**, then R04 and R05 before presenting the toolkit as a published reusable release. WHPS-002 remains subsequent product work, not a reason to import a real website ZIP into WHPS.

## Constraints and known limits

- No real Wix identifiers, site archives, content or deployments in the toolkit.
- The offline archive auditor does not independently attest original Wix provenance.
- Automated scanning cannot guarantee discovery of every credential or historical secret.
- A website built using WHPS is verified only through that website's own tests and deployment report.
