# AGENTS.md — WHPS toolkit repository

This is the **system** agent contract. It does not authorise editing, provisioning or releasing any particular website. A separate site's agent guidance starts from `blueprints/site/AGENTS.md`. Read [authority](docs/10-AUTHORITY-AND-DECISIONS.md), [terminology](docs/09-TERMINOLOGY.md) and the [system Control Room](docs/CONTROL-ROOM.md) before modifying this repository.

## Non-negotiable boundaries

- Keep all real Wix IDs, original handoffs, site source, business documents, assets, integrations and release evidence **outside** WHPS. Only synthetic tests and examples belong here.
- Never run Wix login, backend mutations or `wix release` from this toolkit checkout or its CI.
- System scripts writing site-local output must reject destinations inside this repository, including symlink escapes.
- Never store credentials, client data or Wix customer records in source control, CI logs or documentation.
- A website explicitly adopts a toolkit commit or, after an actual published version becomes available, an approved release tag. No automatic cross-site rollout.

## Change procedure

1. Inspect `main`, the current Control Room, relevant source/tests and the actual status of any PRs. Do not rely on an old proposal statement.
2. Identify a **system-scoped** change and a measurable acceptance check. Use a system work packet, not a client website task.
3. Respect the applicable Wix technical documentation for integration facts; this toolkit cannot override Wix API contracts. Do not introduce unverified business facts into examples.
4. Use synthetic fixtures and offline tests. Keep new checks reproducible and fail closed on safety-critical validation errors.
5. Open a PR against current `main`; verify required CI and the actual diff. Record what passed, what was not tested and any known risks. Do not treat a draft PR as merged.
6. Merge or tag only when the review and release rules permit it. A new version string is not proof of a GitHub Release.

## Separate authority domains

- **Technical Wix behaviour:** current official Wix skill and platform documentation, cross-checked against real CLI/API results in a website repository.
- **Site identity and existing resources:** site's original Wix handoff, on-disk configuration and verified live Wix state, reconciled rather than assumed equivalent.
- **Business truth:** approved client requirements and verified sources, not the generic Wix prompt.
- **Toolkit contracts:** accepted system schemas, code, tests and recorded decisions in this repo. Proposed rules are not automatically adopted.

See [authority and decisions](docs/10-AUTHORITY-AND-DECISIONS.md) for conflict handling.

## Status language

Use only evidence-based labels: `proposed`, `implemented`, `CI-passed`, `merged`, `published-release`, `blocked` for **system** work. Site work has its own lifecycle (`HANDOFF_RECEIVED`, `PREFLIGHT_COMPLETE`, `RELEASED`, `VERIFIED`, etc.). Do not call system merges 'website releases'.

## Quality

Run the commands from [README](README.md) or inspect equivalent GitHub Actions evidence. The toolkit boundary scanner is an accidental-exposure guard, not complete secret or Git-history scanning. Do not claim a Wix site's runtime was tested by WHPS CI.
