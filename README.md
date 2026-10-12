# Wix Headless Website Production System (WHPS)

**Status:** Development baseline, not yet published as a release.  
**Manifest schema version:** `0.1.0`.  
**Scope:** A reusable toolkit and operating framework for Wix Headless website delivery. **Not** a website repository or a multi-client workspace.

## What belongs here

Reusable policies, automation, schemas, synthetic fixtures, checks, blueprints and documentation. Each website has **its own repository**, Wix identity, frontend, content, client decisions, QA records and releases. Do not copy real Wix identifiers or site data into WHPS. See [system boundaries](docs/06-SYSTEM-BOUNDARIES.md).

The Wix-generated handoff establishes technical identity, **not** verified business facts. The current official Wix skill and documentation govern Wix API/CLI behaviour; our toolkit governs repeatable delivery. See [authority and decisions](docs/10-AUTHORITY-AND-DECISIONS.md).

## Current maturity

- **R01:** foundation corrections merged: schema-aware validation, atomic intake, ZIP safeguards.
- **R02:** verification improvements merged: synthetic negative tests and tracked-content security guard.
- **R03:** documentation consolidation under review, not yet accepted or merged.
- **R04/R05:** release governance and first verified toolkit release remain ahead.
- `0.1.0` currently identifies a manifest contract and historical foundation baseline. **There is no published WHPS GitHub Release or endorsed version tag yet.** Until R05, record an exact Git commit SHA when adopting this development toolkit.

## Quick start: offline Wix handoff intake

From a WHPS checkout, with Python 3 and Node.js 22 available:

```sh
python3 -m pip install -r requirements.txt
node scripts/intake-wix-handoff.mjs /path/to/original-wix-prompt.txt ../example-website
node scripts/validate-manifest.mjs ../example-website/site.manifest.json
```

`../example-website` is a **new path outside WHPS**, not an existing website or Git repository. The script only creates the original handoff and a site manifest, and refuses existing target directories. It does **not** download Wix's ZIP, initialise Git, provision Wix resources, authenticate or deploy. Preserve the original Wix-provided project and check its binding in the **website workspace**, following [handoff instructions](docs/02-WIX-HANDOFF.md). For existing-site or unbound-frontend modes, follow the [operating model](docs/01-OPERATING-MODEL.md); the current intake CLI only implements the Wix-generated-handoff mode.

## Validate this toolkit

```sh
python3 -m pip install -r requirements.txt
node scripts/check-repository-boundary.mjs
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

The tests use synthetic inputs and do not access Wix. A passing system CI run **does not** verify an individual website or a deployment. See [verification and security](docs/08-VERIFICATION-SECURITY.md).

## Documentation

Start with the [documentation map](docs/00-DOCUMENTATION-MAP.md), then the [system Control Room](docs/CONTROL-ROOM.md) and [roadmap](docs/05-ROADMAP.md). Reusable site-specific examples are in `blueprints/site/`; they are **not** actual clients.

| Path | Responsibility |
|---|---|
| `AGENTS.md` | Agent rules for WHPS **itself** |
| `docs/` | Operating model, Wix coordination, quality, boundaries, decisions and system roadmap |
| `blueprints/site/` | Generic website-local files to copy/adapt into a separate site repo |
| `schemas/` | Machine-readable project data contracts |
| `scripts/` | Offline intake, inspection and validation tools |
| `tests/`, `examples/` | Tests and explicitly synthetic fixtures |
| `.github/` | CI for the toolkit, never Wix deployments |

## Official Wix references

- [Wix Headless skill](https://wix.com/headless/skill.md)
- [Public skill source](https://github.com/wix/skills/blob/main/skills/wix-headless/SKILL.md)
- [Wix Headless AI toolkit](https://dev.wix.com/docs/go-headless/get-started/headless-ai-toolkit)
- [Wix CLI](https://dev.wix.com/docs/wix-cli/command-reference/introduction)

Always check currently applicable Wix instructions when working on a site; the toolkit does not freeze Wix platform behaviour.

## Change control

Changes to WHPS use reviewed commits and its system-only work packets. Changes to websites use **their own** repositories, approvals and releases. Do not represent merged code, a schema version, a Git tag or a verified live website as interchangeable milestones. [Terminology](docs/09-TERMINOLOGY.md) defines each.
