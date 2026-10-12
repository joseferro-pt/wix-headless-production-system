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
10. [R06 v0.2.0 release plan](18-R06-RELEASE-PLAN.md): owner approval gates, exact-checkout provenance and future publication.

## Reference by task

| Task | Authoritative WHPS reference | Where actual site data belongs |
|---|---|---|
| Lifecycle and entry modes | [Operating model](01-OPERATING-MODEL.md) | Site project Control Room |
| Interpret Wix handoff | [Wix handoff](02-WIX-HANDOFF.md) | Original prompt and ZIP in site repo |
| Reconcile Wix backend | [Resource governance](03-WIX-RESOURCE-GOVERNANCE.md) | Site resource registry and Wix backend |
| Compare desired vs supplied observed resource snapshot (WHPS-003) | [Read-only reconciliation planner](17-READ-ONLY-RESOURCE-PLANNER.md) | Site-local snapshot, prior registry and review plan |
| Validate a website release | [QA/release protocol](04-QA-RELEASE.md) | Site CI and site release report |
| Draw system/site boundary | [System boundaries](06-SYSTEM-BOUNDARIES.md) | One independent repo per website |
| Adopt toolkit in a site | [Project adoption](07-PROJECT-ADOPTION.md) | Site's pinned WHPS SHA/tag |
| Bootstrap a **new** local site Git workspace (unreleased WHPS-002) | [Site bootstrap contract](16-SITE-WORKSPACE-BOOTSTRAP.md) | Generated files in new external website repo |
| Validate a new website's source-provenance lock | [Adoption-lock schema](../schemas/whps-adoption-lock.schema.json) and [R06 plan](18-R06-RELEASE-PLAN.md) | Site-local whps.lock.json |
| Validate a resource plan output from WHPS-003 | [Read-only planner](17-READ-ONLY-RESOURCE-PLANNER.md) and [output schema](../schemas/resource-plan-output.schema.json) | Site-local reviewable proposal |
| System validation and threat model | [Verification/security](08-VERIFICATION-SECURITY.md) and [security policy](../SECURITY.md) | Site-specific security checks |
| Contributing and external distribution | [Contributing](../CONTRIBUTING.md) and [release governance](11-RELEASE-GOVERNANCE.md) | Site-specific contribution/release policy |

## Artifacts and ownership

`templates/` and `blueprints/site/` are **empty generic starting points**; they contain no real website records. `schemas/` defines contract shapes. `examples/` and `tests/` use synthetic identities. `scripts/` implement offline safety checks. The Wix Headless skill is a live **external technical authority**, not copied into this repository.

## Version notes

The `0.1.0` number in the manifest schema is a **schema contract version**. It is **not** a published WHPS release. Apache-2.0 is accepted, and [`v0.1.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) has been published, resolving to `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7`. Site repositories should adopt the tag together with the full resolved SHA, never a floating `main`.
