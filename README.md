# Wix Headless Website Production System (WHPS)

**Status:** [v0.3.0 published and verified 15 October 2026](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0), approved source `bb4d0adcd9021b5cd671e13fed46d5498fac4399` (annotated tag `7f6712db3d484e42e48a888047018be7dc1da1b6`, [successful manual publication](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38733962956)). WHPS-005 and WHPS-006 are released.  
**Release record:** [v0.3.0 post-publication evidence](docs/27-V030-PUBLICATION-AND-CATALOG.md). Earlier releases, including v0.2.1, remain immutable. **No live Wix integration is certified by WHPS.**  
**Manifest schema version:** `0.1.0`.  
**Scope:** A reusable toolkit and operating framework for Wix Headless website delivery. **Not** a website repository or a multi-client workspace.

## What belongs here

Reusable policies, automation, schemas, synthetic fixtures, checks, blueprints and documentation. Each website has **its own repository**, Wix identity, frontend, content, client decisions, QA records and releases. Do not copy real Wix identifiers or site data into WHPS. See [system boundaries](docs/06-SYSTEM-BOUNDARIES.md).

The Wix-generated handoff establishes technical identity, **not** verified business facts. The current official Wix skill and documentation govern Wix API/CLI behaviour; our toolkit governs repeatable delivery. See [authority and decisions](docs/10-AUTHORITY-AND-DECISIONS.md).

## Current maturity

- **R01:** foundation corrections merged: schema-aware validation, atomic intake, ZIP safeguards.
- **R02:** verification improvements merged: synthetic negative tests and tracked-content security guard.
- **R03:** documentation consolidation merged; policy and status terminology reconciled.
- **R04:** governance merged. **R05:** release candidate merged. **R05.1:** recovery merged and v0.1.0 publication verified. **R05.2:** post-release reconciliation merged. **WHPS-002, WHPS-003 and R06:** merged, validated and released as v0.2.0. **WHPS-R06.1:** published in v0.2.1 with exact-source provenance checks. **WHPS-004:** published in v0.2.1 and accepted/closed as a synthetic Astro-first reference; live Wix integration remains site-local.
- **Latest published toolkit release:** [`v0.3.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0), annotated tag `7f6712db3d484e42e48a888047018be7dc1da1b6` targeting `bb4d0adcd9021b5cd671e13fed46d5498fac4399`; verified [publication workflow](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38733962956). Earlier `v0.2.1`, `v0.2.0` and `v0.1.0` tags remain immutable. Manifest schema `0.1.0` is independently versioned; see [publication record](docs/27-V030-PUBLICATION-AND-CATALOG.md).
- **Licence:** [Apache-2.0](LICENSE), with repository copyright attribution in [NOTICE](NOTICE). This does not license Wix-owned code or independently managed websites.

## Astro-first frontend architecture (WHPS-004, released v0.2.1; closed)

The [Astro 5 generic component reference](frontend/astro-primitives/README.md) demonstrates **Astro pages/layouts**, optional **React 19 islands**, and **Tailwind CSS 4**. The [Wix Headless app and feature matrix](docs/20-ASTRO-WIX-COMPATIBILITY.md) distinguishes Wix business APIs and verified integration paths from site-widget-only apps, which do not automatically work in Headless. See [WHPS-004 acceptance](docs/21-WHPS004-FRONTEND-PRIMITIVES.md) and [closure evidence](docs/22-WHPS004-CLOSURE-AND-V021-PUBLICATION.md).

The reference is synthetic and unbound. **It is not Wix-managed hosting, does not contain `@wix/astro` or a `wix.config.json` and cannot prove live Wix app compatibility.** Each real website creates/preserves its own Wix-managed Astro 5 project with the official CLI, SDK authentication, SEO, extensions, app installations, design and deployment. Do not replace Wix-generated config with the standalone reference. Only copy/adapt chosen primitives into a separately owned site repo.

## Quick start: offline Wix handoff intake

From a WHPS checkout, with the [CI-tested environment](docs/12-SUPPORT-COMPATIBILITY.md) of Node.js 22 and Python 3.12:

```sh
python3 -m pip install -r requirements.txt
node scripts/intake-wix-handoff.mjs /path/to/original-wix-prompt.txt ../example-website
node scripts/validate-manifest.mjs ../example-website/site.manifest.json
```

`../example-website` is a **new path outside WHPS**, not an existing website or Git repository. The script only creates the original handoff and a site manifest, and refuses existing target directories. It does **not** download Wix's ZIP, initialise Git, provision Wix resources, authenticate or deploy. Preserve the original Wix-provided project and check its binding in the **website workspace**, following [handoff instructions](docs/02-WIX-HANDOFF.md). For existing-site or unbound-frontend modes, follow the [operating model](docs/01-OPERATING-MODEL.md); the current intake CLI only implements the Wix-generated-handoff mode.

## WHPS-002 · New independent local site bootstrap (development)

The [WHPS-002 bootstrap design](docs/16-SITE-WORKSPACE-BOOTSTRAP.md) documents a **published (since v0.2.0)** CLI that creates a local Git repository in a **new directory outside this toolkit**. It does not create Wix resources, download a site, authenticate, create a GitHub remote or deploy.

```sh
python3 -m pip install -r requirements.txt
node scripts/bootstrap-site-workspace.mjs --mode unbound-frontend --output ../new-website
# For an original Wix handoff instead:
node scripts/bootstrap-site-workspace.mjs --mode wix-handoff --output ../new-wix-website --handoff /path/to/original-wix-prompt.txt
```

It supports `wix-handoff` and `unbound-frontend` only. For `existing-repository`, follow [manual adoption](docs/07-PROJECT-ADOPTION.md); the CLI will refuse to overwrite an existing site. Each new workspace now records the **exact current generator checkout SHA**, an optional locally observed Git release tag and an explicit unverified-release status. The original v0.1.0 foundation is retained separately as historical provenance. The published v0.1.0 source does **not** contain this CLI; published v0.2.0 does. Published v0.2.1 adds fail-closed checks for dirty local checkouts and incorrect local Git origin configuration.



## WHPS-006 · Versioned distribution and site adoption (published v0.3.0)

The [versioned adoption contract](docs/25-WHPS006-DISTRIBUTION-ADOPTION.md) introduces a verified historical release catalog, a **read-only public GitHub tag/Release verifier**, a **non-mutating offline adoption planner**, and a separate **site-owned adoption record** (version 1). `whps.lock.json` version 2 remains the original bootstrap provenance, never overwritten by WHPS-006. Upgrades, component selection and every Wix change remain separately reviewed within each website's repository. The WHPS-006 implementation [merged via PR #24](https://github.com/joseferro-pt/wix-headless-production-system/pull/24) and is **published in v0.3.0**. The independently verified release catalog is updated on post-release main; the immutable tagged v0.3.0 tree retains its original v0.2.1-only historical catalog.

## WHPS-003 · Read-only resource reconciliation (development)

The [published v0.2.0 offline planner](docs/17-READ-ONLY-RESOURCE-PLANNER.md) compares desired resource metadata with an explicitly supplied observed snapshot, and optionally a historical registry. It emits JSON proposals (`create`, `reuse`, `update`, `retire`, `blocked`, `untracked`) **without contacting Wix or executing any change**. Snapshot coverage, uniqueness and identity mismatches are checked; all proposed operations require site-local approval.

    node scripts/plan-wix-resources.mjs --input examples/resource-plan.synthetic.json

WHPS-003 is not part of published v0.1.0; published v0.2.0 additionally rejects duplicate desired type/name requests and validates the output against [a JSON Schema](schemas/resource-plan-output.schema.json). Real snapshot inputs and plans belong in each independent website repository, never WHPS.

## WHPS-R06 and R06.1 · Publication and provenance

The [R06 release plan](docs/18-R06-RELEASE-PLAN.md) now records verified [v0.2.0 publication](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.0). [R06.1 provenance hardening](docs/19-R061-PROVENANCE-AND-RELEASE.md) shipped in the verified [`v0.2.1` release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1), together with WHPS-004. Publication remains a **separate owner action**: review the final merged SHA, verify main-branch CI and CodeQL, then manually run the [generic publisher](.github/workflows/publish-release.yml). Never re-point v0.2.0.

## WHPS-005 · Quality and verification (published v0.3.0)

The [WHPS-005 quality contract](docs/23-WHPS005-QUALITY-VERIFICATION.md) adds a committed npm lockfile and `npm ci`, Astro TypeScript diagnostics, synthetic Chromium/Playwright UI and axe-core accessibility tests, plus an offline `scripts/evaluate-site-qa.mjs` operator-evidence validator. The [site-local verification recipes](docs/24-SITE-LOCAL-VERIFICATION.md) help independent website maintainers record actual Wix SDK/app, accessibility, responsive, SEO and approval checks. **Tooling checks do not prove any live Wix site works or grant deployment authority.** These changes [merged through PR #20](https://github.com/joseferro-pt/wix-headless-production-system/pull/20) and were **published in v0.3.0**; the earlier v0.2.1 tag remains unchanged.

## Published release scope

WHPS v0.3.0 includes WHPS-005 and WHPS-006 with the tested Astro 5 baseline and **excludes** the unvalidated Astro 7 [Dependabot PR #23](https://github.com/joseferro-pt/wix-headless-production-system/pull/23). See the [post-release verification record](docs/27-V030-PUBLICATION-AND-CATALOG.md). This reconciliation does not alter the immutable published tag or any Wix-managed website.

## Wix-managed Astro 7 test-site validation (protocol, not yet executed)

[WHPS-COMPAT-008](docs/30-WIX-ASTRO7-SITE-VALIDATION.md) defines a 13-gate owner-authorised Wix-managed preflight and three additional **separately approved published-test-site gates** for main/item SEO and site release. A v1 site-owned evidence schema and **offline read-only** evaluator require exact Astro 7/React 7/React 19/Tailwind 4/Node 22 provenance and report missing evidence without reading Wix or publishing anything. **No separate test site has been provisioned and no live Wix integration has been certified.** Published v0.3.0 and stable Astro 5 remain unchanged.

## Experimental Astro 7 compatibility research

A separate [Astro 7 / React 7 compatibility investigation](docs/29-ASTRO7-COMPATIBILITY-REVIEW.md) passed [synthetic framework checks](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38739222799) on Node 22: Astro 7.3.8, @astrojs/react 7.0.1, React 19 and Tailwind CSS 4. **Wix-managed authentication, site adapter, business apps, SEO and deployment were not tested.** This experimental lane does not change the reviewed Astro **5** baseline or the published v0.3.0 release.

## WHPS-007 · Sustainable maintenance and compatibility (merged; unreleased)

[WHPS-007 operating rules](docs/28-WHPS007-MAINTENANCE-SECURITY-COMPATIBILITY.md) (implemented in [PR #28](https://github.com/joseferro-pt/wix-headless-production-system/pull/28), merged to main) introduce weekly Dependabot coverage for the Astro npm workspace alongside Python/Actions, an offline reviewed-major/lockfile provenance check, and maintenance/security/upgrade decision procedures. The guard is **not** a vulnerability scan or Wix site runtime test. The separately published v0.3.0 source remains unchanged. Current standalone baseline: Astro 5, React 19, Tailwind 4 and Node 22; major updates including Dependabot PR #23 need a distinct compatibility review.

## Validate this toolkit

Install runtime requirements plus the maintainer-only YAML checker:

```sh
python3 -m pip install -r requirements.txt -r requirements-dev.txt
node scripts/check-repository-boundary.mjs
node scripts/check-release-readiness.mjs --policy
node scripts/check-maintenance-policy.mjs --json
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

The tests use synthetic inputs and do not access Wix. The `--policy` gate checks release-governance wiring; `--release --version v0.3.0` additionally checks accepted licensing and the new candidate notes/changelog prerequisites. Passing does not itself prove a GitHub Release. A passing system CI run **does not** verify an individual website or a deployment. See [verification and security](docs/08-VERIFICATION-SECURITY.md).

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
| `requirements-dev.txt` | Additional maintainer-only YAML verification dependency |
| `docs/16-SITE-WORKSPACE-BOOTSTRAP.md` | Published site-bootstrap CLI behaviour and safety boundaries |
| `docs/17-READ-ONLY-RESOURCE-PLANNER.md` | WHPS-003 read-only desired-vs-observed reconciliation contract |
| `.github/` | CI for the toolkit, never Wix deployments |

## Governance and contributing

- [Contributing and review process](CONTRIBUTING.md)
- [Security reporting and triage](SECURITY.md)
- [Release governance](docs/11-RELEASE-GOVERNANCE.md)
- [Supported environments](docs/12-SUPPORT-COMPATIBILITY.md)
- [Accepted Apache-2.0 licence decision](docs/13-LICENSING-DECISION.md)
- [Branch and tag protection proposal](docs/14-REPOSITORY-PROTECTION.md)

Apache-2.0 is accepted. GitHub protection settings remain proposed, not applied. The [v0.1.0 release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) is published and [R05.1 recovery evidence](docs/15-PUBLICATION-RECOVERY.md) records the successful verification; neither R05.1 nor R05.2 changes its immutable source.

## Official Wix references

- [Wix Headless skill](https://wix.com/headless/skill.md)
- [Public skill source](https://github.com/wix/skills/blob/main/skills/wix-headless/SKILL.md)
- [Wix Headless AI toolkit](https://dev.wix.com/docs/go-headless/get-started/headless-ai-toolkit)
- [Wix CLI](https://dev.wix.com/docs/wix-cli/command-reference/introduction)

Always check currently applicable Wix instructions when working on a site; the toolkit does not freeze Wix platform behaviour.

## Change control

Changes to WHPS use reviewed commits and its system-only work packets. Changes to websites use **their own** repositories, approvals and releases. Do not represent merged code, a schema version, a Git tag or a verified live website as interchangeable milestones. [Terminology](docs/09-TERMINOLOGY.md) defines each.
