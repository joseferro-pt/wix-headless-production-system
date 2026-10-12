# CONTROL ROOM — WHPS system development

**Scope:** Reusable production toolkit only. No Wix client site or site delivery is managed here.  
**Canonical repo:** https://github.com/joseferro-pt/wix-headless-production-system  
**Schema contract:** `0.1.0`; **toolkit candidate:** `v0.1.0`, publication verified through GitHub Releases.  
**Source status:** R01–R05 code merged with green CI; GitHub rejected the original R05 tag push. R05.1 recovery is proposed; tag and GitHub Release are unverified until separately confirmed.

## Evidence baseline (12 October 2026)

| Event | Status | Source |
|---|---|---|
| System/site separation | Merged | PR #1, merge commit `abbf9d4` |
| R01 foundation corrections | Merged, main CI passed | PR #2 |
| R02 verification and security | Merged, main CI passed | PR #3 |
| R03 documentation consolidation | Merged, main CI passed | PR #4 |
| Initial toolkit release | R05 merged, initial publisher failed; **not published as of R05.1 review** | PR #6, original failed Actions run, GitHub tag/release lookups |

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
| WHPS-R05 · Verified foundation | Candidate merged, publication incomplete | PR #6 + exact commit CI; no tag or Release confirmed |
| WHPS-R05.1 · Publication recovery | Proposed, review required | Explicit manual recovery; annotated tag and GitHub Release verified against approved R05 SHA |

## Product-development backlog

`WHPS-001`: initial foundation (merged work); `WHPS-002`: generic site-workspace bootstrap (not started); `WHPS-003`: read-only resource planner; `WHPS-004`: frontend primitives; `WHPS-005`: quality framework; `WHPS-006`: distribution/compatibility; `WHPS-007`: maintainability. Details: [roadmap](05-ROADMAP.md).

## Current gate

**Review the R05.1 publication recovery**, then manually trigger and verify the approved R05 release through GitHub Actions. This is a separate user action after the reviewed recovery change reaches `main`. Repository protection settings remain a separately recorded improvement. WHPS-002 remains subsequent product work, not a reason to import a real website ZIP into WHPS.

## Constraints and known limits

- No real Wix identifiers, site archives, content or deployments in the toolkit.
- Apache-2.0 licence is accepted; `v0.1.0` must not be represented as published until the GitHub tag and Release are confirmed.
- No repository rulesets were observed; classic branch protection remains unverified due to connector restrictions.
- The offline archive auditor does not independently attest original Wix provenance.
- Automated scanning cannot guarantee discovery of every credential or historical secret.
- A website built using WHPS is verified only through that website's own tests and deployment report.
