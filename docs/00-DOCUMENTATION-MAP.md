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

## Reference by task

| Task | Authoritative WHPS reference | Where actual site data belongs |
|---|---|---|
| Lifecycle and entry modes | [Operating model](01-OPERATING-MODEL.md) | Site project Control Room |
| Interpret Wix handoff | [Wix handoff](02-WIX-HANDOFF.md) | Original prompt and ZIP in site repo |
| Reconcile Wix backend | [Resource governance](03-WIX-RESOURCE-GOVERNANCE.md) | Site resource registry and Wix backend |
| Validate a website release | [QA/release protocol](04-QA-RELEASE.md) | Site CI and site release report |
| Draw system/site boundary | [System boundaries](06-SYSTEM-BOUNDARIES.md) | One independent repo per website |
| Adopt toolkit in a site | [Project adoption](07-PROJECT-ADOPTION.md) | Site's pinned WHPS SHA/tag |
| System validation and threat model | [Verification/security](08-VERIFICATION-SECURITY.md) and [security policy](../SECURITY.md) | Site-specific security checks |
| Contributing and external distribution | [Contributing](../CONTRIBUTING.md) and [release governance](11-RELEASE-GOVERNANCE.md) | Site-specific contribution/release policy |

## Artifacts and ownership

`templates/` and `blueprints/site/` are **empty generic starting points**; they contain no real website records. `schemas/` defines contract shapes. `examples/` and `tests/` use synthetic identities. `scripts/` implement offline safety checks. The Wix Headless skill is a live **external technical authority**, not copied into this repository.

## Version notes

The `0.1.0` number in the manifest schema is a **schema contract version**. It is **not** a published WHPS release. The repository currently has no accepted licence, so no external reuse grant should be inferred. Until a versioned release is actually published, sites may record a specific reviewed Git commit SHA for development-only adoption.
