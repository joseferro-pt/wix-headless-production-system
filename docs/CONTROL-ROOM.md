# CONTROL ROOM — Wix Headless Website Production System

**System ID:** WHPS  
**Version:** 0.1.0  
**Date:** 2026-10-12  
**Status:** Foundation prepared / not yet adopted as frozen release  
**Owner:** Project operator  
**Primary scope:** Meta-workflow, not any single website.

## Current purpose

Define an audit-friendly, reusable and scalable delivery workflow beginning from Wix's *own* generated Headless site prompt. Don't replace Wix's site provisioning or official skill.

## Technical evidence baseline

- Wix Headless skill source: `wix/skills/skills/wix-headless/SKILL.md` (observed Git blob SHA `9f8dea32724e09baf33bf32452912236337d2783` on 2026-10-12). Revalidate on each client build; this is an observation, not a frozen API contract.
- Core skill distinguishes managed / self-managed / stripe; managed create / connect / iterate.
- Existing connected project uses `wix.config.json` and skips `init` on iterate.
- Managed release publishes via Wix CLI; Wix's managed guide instructs to release once at the end.
- This v0.1 package does not copy the Wix skill; it links to the official source.

## Adopted working decisions

| ID | Decision | State |
|---|---|---|
| DR-001 | Wix-provided handoff is authoritative for site identity, not for business truth. | Proposed for adoption |
| DR-002 | Retain original Wix project and do not create duplicate sites on handoff entry. | Proposed for adoption |
| DR-003 | Keep a central production-system repository and separate repos per actual site. | Proposed for adoption |
| DR-004 | Store desired Wix integration state separately from observed Wix resource state. | Proposed for adoption |
| DR-005 | Explicit source, QA, deployment and verified-production statuses. | Proposed for adoption |
| DR-006 | No destructive or unapproved already-live production operations. | Proposed for adoption |

## Work packets

| ID | Name | Status | Deliverable |
|---|---|---|---|
| WHPS-001 | Authority, intake and manifests | Draft prepared | this baseline, parser, schema |
| WHPS-002 | Existing project import pilot | Partial: derived archive audited | original Wix ZIP remains unavailable |
| WHPS-003 | Wix state reconciliation | Not started | read-only inventory and dry-run change plan |
| WHPS-004 | Starter architecture | Not started | framework-appropriate shared primitives, no duplicate boilerplate |
| WHPS-005 | QA and deployment gates | Draft protocol | actionable integration/check scripts |
| WHPS-006 | GitHub pilot repository and CI | Not started | repository with controlled checks and branch policy |

## Acceptance criteria for WHPS-001

- [x] Recorded source-of-truth and existing-site identity safeguards.
- [x] Captured workflow modes and lifecycle.
- [x] Authored parser for Wix-generated prompt and JSON Schema manifest.
- [x] Authored read-only/offline validation and fixtures.
- [x] Defined backend registry and release report templates.
- [ ] Review and adopt working decisions.
- [ ] Test against the **actual** downloaded Wix project ZIP and verified `wix.config.json`.
- [ ] Commit into a dedicated GitHub repository.

## Open questions for next phase

- Which stack is shipped by the real Wix ZIP? (Do not infer.)
- Which test runner and visual checks should be standard per framework?
- What is the preferred Git branching/deployment policy for an agency vs solo site?
- Is release approval required on every production push or only on published/monetized sites?
- What is the default policy for brand imagery and user-approved copy?

## Next operation

Complete **WHPS-002** against the original Wix-provided project archive in a read-only development checkout: examine files, validate IDs, record the framework, run the official skill preflight, and create an import checklist. Do not release the website as part of the system pilot.
