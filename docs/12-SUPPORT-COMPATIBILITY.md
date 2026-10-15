# 12 — Supported environments and compatibility

## Evidence-based runtime matrix

| Component | Baseline | Evidence and support status |
|---|---|---|
| Node.js | **22.x** | Explicit `actions/setup-node` CI runtime, verified by workflow |
| Python | **3.12.x** | Explicit `actions/setup-python` CI runtime, verified by workflow |
| OS | **Ubuntu Linux (GitHub-hosted `ubuntu-latest`)** | Automated CI checks; runner image changes over time |
| Python package | `jsonschema>=4.23,<5` | Runtime dependency, installed and exercised by CI; not pinned to exact patch |
| Maintainer YAML verification | `PyYAML>=6.0.2,<7` | Development-only `requirements-dev.txt` dependency used for Dependabot configuration tests in CI, **not included in the v0.1.0 release** |
| WHPS-004 / WHPS-005 synthetic frontend reference | **Astro 5; @astrojs/react 4; React 19; Tailwind 4 / @tailwindcss/vite** | WHPS-005 locked `npm ci`, Astro diagnostics/build and Chromium/axe browser checks in CI; Wix-managed runtime/auth/apps and full accessibility conformance unverified |
| Wix Headless platform | Current official Wix skill and Wix CLI/SDK instructions | External authority; **no live Wix integration tested by toolkit CI** |
| Node.js 20 / 24, Python 3.13, Windows, macOS | Not in official CI matrix | **Not guaranteed**; supplementary local results are not published support commitments |

The items above describe the **currently CI-tested development environment**, not every possible system/platform combination or live Wix deployment. Published v0.2.0 adds an explicit Git CLI requirement for WHPS-002 bootstrap, but does not expand operating-system support claims. When extending the matrix, first add the environment to CI and record the evidence.

Official Wix-managed Headless documentation currently supports Astro **5 or 7** (not Astro 6) in its existing-Astro linking flow. WHPS v0.3.0 retains a deliberately tested **Astro 5** reference, not a verified Astro 7 integration. Wix-managed hosting/auth/SEO and Wix business apps require the **site-local Wix Astro integration**. The standalone WHPS Astro reference does not include it and is not proof of Wix runtime compatibility. See [Wix Astro compatibility](20-ASTRO-WIX-COMPATIBILITY.md) and [WHPS-004](21-WHPS004-FRONTEND-PRIMITIVES.md).

## Published v0.3.0 compatibility boundary

Published v0.3.0 retains the locked **Astro 5** reference (resolved Astro 5.18.2), optional React islands and Tailwind 4. The separate Astro 7 major-upgrade Dependabot PR #23 is *not* included. WHPS-005 adds automated Chromium/axe tests only for the standalone synthetic reference, while WHPS-006 adds a historical version catalog and read-only tools, not live Wix project SDK/app verification. Node 22, Python 3.12 and GitHub-hosted Ubuntu are the only validated toolkit runtimes; independent websites must separately test their Wix-managed integration, performance, accessibility and deployments. See [v0.3.0 candidate notes](releases/v0.3.0.md).

## WHPS-007 reviewed compatibility baseline (development)

The [reviewed major-version baseline](../maintenance/compatibility-baseline.json) pins **synthetic** Astro 5, @astrojs/react 4, React 19, Tailwind 4, @tailwindcss/vite 4 and Node 22. [Offline maintenance preflight](../scripts/check-maintenance-policy.mjs) verifies declared/locked majors and npm registry integrity fields. It cannot detect vulnerable package versions, audit Git history or certify a Wix-managed application. Dependency-review proposals do not auto-merge. Major changes need a separate PR with reviewed baseline changes and CI evidence; real Wix SDK/apps/hosting remain independently site-tested. See [WHPS-007](28-WHPS007-MAINTENANCE-SECURITY-COMPATIBILITY.md).

## Astro 7 experimental research, not a supported baseline

Wix's [existing Astro project linking documentation](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project) lists Astro **5 or 7**, not 6. WHPS's [isolated Astro 7 / React 7 experiment](29-ASTRO7-COMPATIBILITY-REVIEW.md) succeeded in [CI](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38739222799) on Node 22 with Astro 7.3.8, @astrojs/react 7.0.1, React 19 and Tailwind 4. This proves only standalone build, hydration, keyboard, responsive and automated accessibility checks. It **does not** verify actual Wix-managed project/auth/backend/app/SEO deployment integration and does not replace the reviewed Astro **5** baseline. Separate major-package and Wix site-local decisions are required.

## Compatibility rules

- Run tests with the supported Node and Python versions; record the versions in release notes.
- A contributor may develop elsewhere, but cannot claim support for an untested environment.
- Schema contracts are separately versioned; changes that invalidate existing site manifests need migration guidance and negative tests.
- A Wix dependency or CLI behaviour may change upstream. Review the current official Wix skill in each site project, not as a one-time frozen implementation authority.
- Do not add a live Wix token or live website smoke tests to WHPS CI to establish compatibility; those belong to authorised website projects.
- For future releases, review dependency locking, action pinning and fixed runner images for stronger repeatability. Current Python requirements use version ranges, so exact dependency graphs may vary.

## Release policy for support

Published `v0.1.0` and `v0.2.0` are **early developer toolkits** on the CI-tested runtimes above. The release notes define known limits; future fixes use reviewed patch releases. Do not claim support for Wix site deployments or untested platforms. Site repositories pin a toolkit commit/tag; WHPS does not guarantee that downstream sites automatically pick up changes.
