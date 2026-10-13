# 00 — Documentation map and reading order

WHPS has **one system repository** and any number of independently owned website repositories. This index describes **system** documentation only.

## Start here

1. [README](../README.md): capability, maturity, safe offline commands.
2. [AGENTS](../AGENTS.md): requirements for modifying WHPS itself.
3. [Control Room](CONTROL-ROOM.md): current decisions, evidence, work status.
4. [Roadmap](05-ROADMAP.md): review milestones R01–R05 and later system work packets.
5. [Authority and decisions](10-AUTHORITY-AND-DECISIONS.md): how to resolve conflicts and record approvals.
6. [Terminology](09-TERMINOLOGY.md): consistent status, release and entry-mode names.
7. [Release governance](11-RELEASE-GOVERNANCE.md): candidate gates, tags, documentation and release evidence.
8. [Support and compatibility](12-SUPPORT-COMPATIBILITY.md), [licence decision](13-LICENSING-DECISION.md), [repository protection](14-REPOSITORY-PROTECTION.md): distribution prerequisites.
9. [Publication recovery](15-PUBLICATION-RECOVERY.md): R05.1 manual release repair and independent verification.
10. [R06 v0.2.0 release plan](18-R06-RELEASE-PLAN.md): completed publication and verification evidence.
11. [R06.1 provenance and patch](19-R061-PROVENANCE-AND-RELEASE.md): merged safeguards, published and verified in v0.2.1.
12. [Astro and Wix capability matrix](20-ASTRO-WIX-COMPATIBILITY.md): Wix-managed Astro, React, Tailwind and API-driven app compatibility.
13. [WHPS-004 frontend primitives](21-WHPS004-FRONTEND-PRIMITIVES.md): closed synthetic reference scope, acceptance and site separation.
14. [WHPS-004 closure and v0.2.1 publication](22-WHPS004-CLOSURE-AND-V021-PUBLICATION.md): immutable tag/release verification, acceptance evidence and unverified Wix boundaries.
15. [WHPS-005 quality framework](23-WHPS005-QUALITY-VERIFICATION.md): type/build/browser checks, lockfile and operator-reported QA contract (in review).
16. [Site-local Wix QA recipes](24-SITE-LOCAL-VERIFICATION.md): independent site evidence/checklist and explicit no-deployment boundary.

## Reference by task

| Task | Authoritative WHPS reference | Where actual site data belongs |
|---|---|---|
| Lifecycle and entry modes | [Operating model](01-OPERATING-MODEL.md) | Site project Control Room |
| Interpret Wix handoff | [Wix handoff](02-WIX-HANDOFF.md) | Original prompt and ZIP in site repo |
| Reconcile Wix backend | [Resource governance](03-WIX-RESOURCE-GOVERNANCE.md) | Site resource registry and Wix backend |
| Compare desired vs supplied observed resource snapshot (WHPS-003) | [Read-only reconciliation planner](17-READ-ONLY-RESOURCE-PLANNER.md) | Site-local snapshot, prior registry and review plan |
| Reuse accessible Astro frontend primitives | [WHPS-004 implementation](21-WHPS004-FRONTEND-PRIMITIVES.md) and [synthetic Astro reference](../frontend/astro-primitives/README.md) | Site-specific frontend, Wix Astro config, SDK integrations and design |
| Check Wix apps and widgets for Headless | [Wix Astro app compatibility](20-ASTRO-WIX-COMPATIBILITY.md) | Site-local app installation and feature verification |
| Validate a website release | [QA/release protocol](04-QA-RELEASE.md) | Site CI and site release report |
| Draw system/site boundary | [System boundaries](06-SYSTEM-BOUNDARIES.md) | One independent repo per website |
| Adopt toolkit in a site | [Project adoption](07-PROJECT-ADOPTION.md) | Site's pinned WHPS SHA/tag |
| Bootstrap a **new** local site Git workspace (published WHPS-002) | [Site bootstrap contract](16-SITE-WORKSPACE-BOOTSTRAP.md) | Generated files in new external website repo |
| Validate a new website's source-provenance lock | [Adoption-lock schema](../schemas/whps-adoption-lock.schema.json) and [R06 plan](18-R06-RELEASE-PLAN.md) | Site-local whps.lock.json |
| Validate a resource plan output from WHPS-003 | [Read-only planner](17-READ-ONLY-RESOURCE-PLANNER.md) and [output schema](../schemas/resource-plan-output.schema.json) | Site-local reviewable proposal |
| System validation and threat model | [Verification/security](08-VERIFICATION-SECURITY.md) and [security policy](../SECURITY.md) | Site-specific security checks |
| Contributing and external distribution | [Contributing](../CONTRIBUTING.md) and [release governance](11-RELEASE-GOVERNANCE.md) | Site-specific contribution/release policy |

## Artifacts and ownership

`templates/` and `blueprints/site/` are **empty generic starting points**; they contain no real website records. `schemas/` defines contract shapes. `examples/` and `tests/` use synthetic identities. `scripts/` implement offline safety checks. The Wix Headless skill is a live **external technical authority**, not copied into this repository.

## Version notes

The manifest schema remains independently versioned as `0.1.0`. WHPS `v0.1.0`, `v0.2.0` and [`v0.2.1`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1) have all been published; latest v0.2.1 resolves to `877736282def3631a3fad5d368e3098aadac040f`. Adopt a specific published tag and full SHA, not floating `main`. WHPS-004 is closed within its documented synthetic scope.
