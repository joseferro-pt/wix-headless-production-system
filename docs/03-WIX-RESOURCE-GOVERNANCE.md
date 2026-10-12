# 03 — Wix resource governance

## Desired and observed state

- **Desired state:** accepted business integrations, for example `forms.contact: required` or `cms.services: required`, stored in the client project's manifest/spec.
- **Observed state:** direct read-only Wix context and API responses, with resource IDs, names, revisions and timestamps where present.
- **Change plan:** an explicit `create|reuse|update|retire|blocked` action with reasons and scope, validated against current Wix API contracts.

Never treat a stale JSON registry as definitive proof of what's currently on Wix.

## WHPS-003 offline planner

The [WHPS-003 read-only planner](17-READ-ONLY-RESOURCE-PLANNER.md) consumes supplied desired/observed metadata and an optional historical registry. It **never fetches live Wix data or executes a mutation**. It requires explicit covered resource types and a declared complete/partial snapshot; only complete, type-covered observations can produce create/retire proposals. A missing registered Wix ID, ambiguous type/name match or cross-site identity mismatch blocks planning. The tool emits proposals requiring separate website-local authorisation and fresh Wix verification.

## Safe reconciliation

1. Fetch installed solutions and relevant entities using an authorized read-only context.
2. Match existing resources by stable Wix ID first; for absent ID, use narrowly scoped exact name + type and confirm uniqueness.
3. Record proposed delta before writes; log user-facing changes and potential data loss.
4. Apply only authorized operations with the official skill and current Wix method schema.
5. Record returned IDs and revision metadata in `wix.resources.json`.
6. Re-read when necessary to audit drift; do not assume a previously created ID is still valid forever.

## Strict policies

- No duplicate forms, CMS collections, booking services or sample records on rerun.
- No destructive Wix operation based solely on an AI-generated plan.
- Customer records and live business content remain under Wix, not imported into the source repo.
- No speculative seeding as verified business information.
- No secrets in resource registry.
- `clientId` is a public OAuth app ID, but does not grant admin operations.

## Example registry conventions

See `schemas/wix-resource-registry.schema.json` and `examples/wix.resources.example.json`. A record has `type`, `logicalKey`, `wixId`, `observedName`, `source`, `state`, `observedAt`, and optional notes. Store no PII or content.

## Drift rules

- Resource missing in Wix but listed in registry → `blocked` until investigated.
- Live Wix resource differs from desired schema → propose `update` with validation; do not blindly overwrite.
- Wix resource exists but no manifest entry → mark `untracked` and classify without touching it.
- A backend-only content update usually doesn't require frontend release when the frontend fetches content at runtime; verify current official skill for the capability in question.
