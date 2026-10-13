# 07 — Adoption by an independent website repository

WHPS is a **toolkit**, not the parent Git repository for websites. Each website checkout is independently owned and deployable. See [system boundaries](06-SYSTEM-BOUNDARIES.md) and [the operating model](01-OPERATING-MODEL.md).

## Current manual adoption: published toolkit v0.2.1 (WHPS-006 additions remain unreleased)

1. Create or locate a **separate site repository**. Do not nest it within WHPS or add it as a submodule.
2. Pin the published [`v0.2.1` toolkit release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1) and its exact source commit `877736282def3631a3fad5d368e3098aadac040f`; verify `git rev-parse 'v0.2.1^{commit}'` resolves to that SHA and confirm the public GitHub Release separately. Earlier v0.2.0/v0.1.0 releases remain immutable. Never depend on a floating `main` branch. Apache-2.0 applies to WHPS, not the site's own content.
3. Preserve the original Wix handoff inside the website repository if provided. From published v0.2.0, `scripts/bootstrap-site-workspace.mjs` can initialise a **new local Git repository** outside WHPS, preserve a handoff and create a manifest. It does not download an existing Wix project or create a GitHub remote.
4. Check the actual downloaded Wix project before altering framework or running `init`; do not duplicate an existing binding.
5. Copy and adapt `blueprints/site/AGENTS.md` and `blueprints/site/docs/CONTROL-ROOM.md`; keep the site business brief, Wix resources and release evidence **in the site repo**.
6. Re-read the current official Wix skill and relevant framework references. Do not treat WHPS as an alternative Wix provisioning specification.
7. Run website-local tests and record the actual release result, permissions and approval using a site-local report. WHPS CI never tests or deploys that live site.

## WHPS-002 bootstrap and R06.1 provenance

Published v0.2.0 includes `scripts/bootstrap-site-workspace.mjs`. The generator creates a new independent local Git checkout; it does not merge with or overwrite an existing one. Published v0.2.1 adds clean working-tree and canonical local `origin` checks; these checks are **not** part of the earlier v0.2.0. The v2 lock still requires independent GitHub Release verification. See the [bootstrap contract](16-SITE-WORKSPACE-BOOTSTRAP.md).

An existing repository must not be used as the output destination. Continue the manual protocol above to inspect and adopt tooling without overwriting source or Wix configuration.

## WHPS-006: source-pinned, non-mutating adoption planning (merged; unreleased)

[WHPS-006](25-WHPS006-DISTRIBUTION-ADOPTION.md) adds a historical catalog, **read-only** GitHub publication verifier, offline upgrade planner and separate website-owned `whps.adoption.json` v1. This is newer **merged but unreleased code** (PR #24), not available inside the published v0.2.1 checkout. The original `whps.lock.json` v2 permanently preserves producing-source provenance, even after site-local toolkit adaptations. Toolkit changes never fan out to sites or alter Wix-generated files automatically. Version or component drops require an explicitly reviewed migration. WHPS-002 was published in v0.2.0, not v0.1.0.

## Site-local resource reconciliation

The published v0.2.0 [WHPS-003 resource planner](17-READ-ONLY-RESOURCE-PLANNER.md) accepts a strict desired/observed metadata bundle from an independent website repository. Its offline JSON proposal does not authorise creating, updating or retiring Wix resources. Snapshot collection, approval and any backend changes remain website-local.

## Release provenance in new site bootstrap locks

R06 introduced whps.lock.json `lockVersion: 2`. The `toolkitSource` and `generator` point to the **actual producing checkout commit**, not the original v0.1.0 foundation. `foundationBaseline` retains that historic v0.1.0 pin for provenance only. A `tagged-checkout-unverified` value records a local tag, **not an independently confirmed GitHub Release**. Verify the tag/commit relationship against the official published Release before marking a site as having adopted a released WHPS generator. Do not automatically overwrite old v1 locks.

## Three entry modes

- `wix-handoff`: Wix-created identity and downloaded project, with preserved prompt.
- `existing-repository`: Existing source and Wix binding examined before iteration.
- `unbound-frontend`: Brought-in frontend with no confirmed Wix binding; potential connect/create activity requires correct Wix flow and approval.

These are manifest modes, not claims that all paths have complete automation today. The offline `intake-wix-handoff.mjs` script handles **only** the first case.
