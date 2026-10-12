# 07 — Adoption by an independent website repository

WHPS is a **toolkit**, not the parent Git repository for websites. Each website checkout is independently owned and deployable. See [system boundaries](06-SYSTEM-BOUNDARIES.md) and [the operating model](01-OPERATING-MODEL.md).

## Today: development-only manual adoption

1. Create or locate a **separate site repository**. Do not nest it within WHPS or add it as a submodule.
2. Record the exact WHPS **Git commit SHA** used for any scripts/templates copied. There is **no published WHPS release tag yet**; R04 defines a proposed release policy, while R05 is the future publication gate. This repository also has **no accepted licence yet**; consult [the licence decision](13-LICENSING-DECISION.md) before copying/distributing WHPS source.
3. If Wix provided an original handoff, preserve it in that site workspace. The current offline CLI can create a manifest and copy the prompt into a **new, empty** outside directory. It does not create the Git repository or download the Wix template.
4. Check the actual downloaded Wix project before altering framework or running `init`; do not duplicate an existing binding.
5. Copy and adapt `blueprints/site/AGENTS.md` and `blueprints/site/docs/CONTROL-ROOM.md`; keep the site business brief, Wix resources and release evidence **in the site repo**.
6. Re-read the current official Wix skill and relevant framework references. Do not treat WHPS as an alternative Wix provisioning specification.
7. Run website-local tests and record the actual release result, permissions and approval using a site-local report. WHPS CI never tests or deploys that live site.

## Future: versioned adoption

After R05 and an accepted licence, a website may pin a reviewed WHPS release **tag plus commit**, with a recorded upgrade decision. Later tooling may generate a version lock and update proposal. No automatic change propagation to websites is permitted by the current governance policy.

## Three entry modes

- `wix-handoff`: Wix-created identity and downloaded project, with preserved prompt.
- `existing-repository`: Existing source and Wix binding examined before iteration.
- `unbound-frontend`: Brought-in frontend with no confirmed Wix binding; potential connect/create activity requires correct Wix flow and approval.

These are manifest modes, not claims that all paths have complete automation today. The offline `intake-wix-handoff.mjs` script handles **only** the first case.
