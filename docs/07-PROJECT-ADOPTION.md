# 07 — Adoption by an independent website repository

WHPS is a **toolkit**, not the parent Git repository for websites. Each website checkout is independently owned and deployable. See [system boundaries](06-SYSTEM-BOUNDARIES.md) and [the operating model](01-OPERATING-MODEL.md).

## Today: manual adoption of the published v0.1.0 toolkit

1. Create or locate a **separate site repository**. Do not nest it within WHPS or add it as a submodule.
2. Pin the published [`v0.1.0` toolkit release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) and record its full source commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7` in the site's own adoption record. In a separate WHPS checkout, check `git rev-parse 'v0.1.0^{commit}'` matches that SHA. Never depend on a floating `main` revision. Apache-2.0 governs WHPS, not a site's own code or content.
3. If Wix provided an original handoff, preserve it in that site workspace. The current offline CLI can create a manifest and copy the prompt into a **new, empty** outside directory. It does not create the Git repository or download the Wix template.
4. Check the actual downloaded Wix project before altering framework or running `init`; do not duplicate an existing binding.
5. Copy and adapt `blueprints/site/AGENTS.md` and `blueprints/site/docs/CONTROL-ROOM.md`; keep the site business brief, Wix resources and release evidence **in the site repo**.
6. Re-read the current official Wix skill and relevant framework references. Do not treat WHPS as an alternative Wix provisioning specification.
7. Run website-local tests and record the actual release result, permissions and approval using a site-local report. WHPS CI never tests or deploys that live site.

## WHPS-002 development bootstrap (not released in v0.1.0)

For a **brand-new** site workspace, a newer WHPS development checkout offers `scripts/bootstrap-site-workspace.mjs`, which initialises local Git and copies site-specific generic templates. This executable does **not** belong to the published v0.1.0 tag. It records a v0.1.0 foundation pin with an explicit unreleased-generator designation. See [the bootstrap contract](16-SITE-WORKSPACE-BOOTSTRAP.md) before using it.

An existing repository must not be used as the output destination. Continue the manual protocol above to inspect and adopt tooling without overwriting source or Wix configuration.

## Future: automated adoption


WHPS-002 is developing an offline website-repository bootstrap with a recorded, exact WHPS version. **This automation is not in v0.1.0 and remains unreleased.** Later upgrades still require a decision in each independent website repository. No automatic change propagation is permitted.

## Three entry modes

- `wix-handoff`: Wix-created identity and downloaded project, with preserved prompt.
- `existing-repository`: Existing source and Wix binding examined before iteration.
- `unbound-frontend`: Brought-in frontend with no confirmed Wix binding; potential connect/create activity requires correct Wix flow and approval.

These are manifest modes, not claims that all paths have complete automation today. The offline `intake-wix-handoff.mjs` script handles **only** the first case.
