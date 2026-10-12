# Roadmap — production system, not a website

Only WHPS **tooling** and **standards** belong in this roadmap. Individual site tasks must not appear here.

## WHPS-001 — Foundation [BASELINE PUBLISHED]
- Protocol, handoff parser, manifest schemas, read-only archive audit, synthetic fixtures and initial CI.
- Scope reconciliation and system/site separation introduced in the next proposed change.

## WHPS-002 — Offline website repository bootstrap [NEXT]
- Generate a site-local manifest, project AGENTS, business brief and Control Room **outside this toolkit checkout**.
- Accept the Wix handoff and existing ZIP without provisioning another Wix site.
- Verify source lineage, Wix IDs and output configuration without downloading live customer content.
- Test with synthetic fixtures only; publish a consumable version of the toolkit.

## WHPS-003 — Wix resource planner [PLANNED]
- Pure desired-versus-observed diff, safe dry-run actions, schema verification and idempotency tests.
- No actual Wix writes in the WHPS repo; site adapters and approved mutations run from client projects.

## WHPS-004 — Reusable frontend primitives [PLANNED]
- Accessibility, typography, navigation, form states, SEO and error handling distributed as reusable code/templates.
- Framework-specific modules with documented compatibility, not a single universal site built into WHPS.

## WHPS-005 — Quality framework [PLANNED]
- Contract tests, artifact checks, synthetic integration fixtures, security scanning and optional visual test guidance.
- Per-client CI pipelines are generated in their own repositories; global CI never deploys websites.

## WHPS-006 — Distribution and compatibility [PLANNED]
- Version/tag adoption, semantic versioning, release notes, upgrades and migration checks.
- Document compatibility with upstream Wix CLI, SDK and skill revisions.

## WHPS-007 — Governance and maintainability [PLANNED]
- CONTRIBUTING, SECURITY, license policy, decision records, supported runtimes and maintenance cadence.

## Acceptance criterion
A user can adopt a tagged WHPS release in a new, independent website repository, complete its lifecycle and upgrade the tools without WHPS containing that site's identity, content, code or production records.
