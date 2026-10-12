# 04 — QA and Wix-managed site release protocol

This is **site-project guidance**, not a WHPS system deployment workflow. Site releases use the *website's* source checkout and current applicable Wix instructions; WHPS CI only validates toolkit code and synthetic fixtures.

## Site quality gates

| Gate | Minimum site-local evidence |
|---|---|
| Identity | Real Wix binding reconciles with supplied identifiers; conflicts blocked |
| Source | Commit, dependencies, framework and output directory verified |
| Business | Published claims traceable to approved facts, no invented details |
| Wix integrations | Real resource bindings; no pretend working form/cart/member workflow |
| Quality | Applicable build, accessibility, keyboard, responsive and SEO checks recorded |
| Approval | Required production or destructive-change authorisations documented |
| Deployment | Actual Wix command result and live URL, not guessed URLs |
| Post-release | Permitted smoke checks with any unavailable checks explicitly disclosed |

## Operational principles

- Follow the **current** Wix managed project flow, checking create/connect/iterate distinctions and framework-specific commands.
- Avoid repeated build-plus-release attempts simply to preview. Use the current documented preview mechanisms only where supported and requested.
- Wix backend data writes do not automatically roll back with a frontend redeploy; record an independent recovery plan before destructive changes.
- Release to a published site only when the necessary approval is clear.
- Treat `implemented`, `build-passed`, `released` and `verified` as different states. See [terminology](09-TERMINOLOGY.md).

## Deployment boundary

For Wix-managed projects, the current documented release command is:

```sh
CI=1 npx @wix/cli@latest release
```

Run it **only from the independently managed site checkout** after its applicable preflight and approval gates, not from WHPS. Re-check Wix's current platform contract rather than assuming the command never changes. Site release reports should use [the reusable template](../templates/RELEASE-REPORT.md) **within that site repo**.

## Toolkit validation limits

- Full manifest validation requires the declared Python `jsonschema` dependency; missing tooling fails validation.
- The offline ZIP auditor rejects known unsafe archive structures and size/compression cases, but cannot prove original Wix provenance, source trust, active Wix integration, build success or website runtime behaviour.
- A passing WHPS test suite is **not** a valid proof of a deployed Wix website.

See [verification/security](08-VERIFICATION-SECURITY.md) and [authority](10-AUTHORITY-AND-DECISIONS.md).
