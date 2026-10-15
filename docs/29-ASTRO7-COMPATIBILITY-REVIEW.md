# 29 — Astro 7 / React 7 Compatibility Review (Experimental)

**Status:** **Synthetic trial passed** in [CI run 38739222799](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38739222799); still experimental, not a WHPS baseline upgrade or published release. No Wix project, site IDs, credentials, `wix.config.json`, Wix adapter or site deployment are used.

## Decision being investigated

Whether the existing **synthetic WHPS frontend reference** can pass the same Astro/TypeScript diagnostics, build, React hydration, keyboard, responsive, reduced-motion and axe-core checks on **Astro 7.3.8 + @astrojs/react 7.0.1 + React 19 + Tailwind CSS 4**. Even a green result does not establish live Wix-managed Astro compatibility.

Current main and published v0.3.0 keep the reviewed Astro **5** and `@astrojs/react` **4** versions and their immutable package lock. The separate Dependabot [#31](https://github.com/joseferro-pt/wix-headless-production-system/pull/31) and [#29](https://github.com/joseferro-pt/wix-headless-production-system/pull/29) must not be merged independently: a compatible upgrade would update both majors together, along with their lockfile and policy. [#32](https://github.com/joseferro-pt/wix-headless-production-system/pull/32), TypeScript 7, is a separate proposed major and excluded.

## Documentation evidence

1. [Wix: connect an existing Astro project](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project) specifies Astro **5 or 7**, explicitly excludes 6, and requires an unlinked project. Its `headless link` command creates a Wix business/site and configures framework integration. **Never invoke this command in WHPS.**
2. [Wix: About supported frameworks](https://dev.wix.com/docs/go-headless/wix-managed-headless/about-supported-frameworks) distinguishes Astro's **full** Wix-managed hosting, authentication, SEO, extensions and CLI integration from limited other-framework support.
3. [Wix: About the Astro integration](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/about-the-astro-integration) documents automatic visitor/member auth and optional server-side elevation. A standalone Astro build tests none of those Wix behaviours.
4. [Astro 7 upgrade](https://docs.astro.build/en/guides/upgrade-to/v7/) introduces Vite 8 and removals/deprecations. Review any Vite/Tailwind-specific adapters and server-side API changes.
5. [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/) v7 moves JSX/Fast Refresh to Oxc and removes the former `babel` integration option. The WHPS sample uses `react()` without custom Babel and should be checked in the real browser.

## Isolated trial and deterministic boundaries

The `astro7-compatibility.yml` GitHub Actions workflow runs only for the dedicated probe changes or authorised manual dispatch, using GitHub Ubuntu and Node 22. Its shell script:

- Copies only `frontend/astro-primitives/` into a temporary directory, **outside the checkout**.
- Performs a clean `npm ci` baseline before temporarily installing **exact** Astro 7.3.8 and @astrojs/react 7.0.1. The candidate's **resolved** transitive lock hash and framework versions are logged; they are not silently committed. The default Astro 5 project is unmodified.
- Runs `npm run check`, `npm run build` and the same Chromium Playwright/axe regression suite on the Astro 7 copy, then deletes it. A failing check is a documented blocker, not an upgrade approval.
- Uses registry downloads and browser-dependency downloads as test tooling only, without any Wix API calls. This is an **experimental resolved dependency tree**, not a published reproducible Astro 7 lock until a separate accepted upgrade PR pins it.

## Acceptance matrix

| Gate | Requirement | Result |
|---|---|---|
| A · Wix documentation | Official 5/7 linking support; Wix 6 unsupported | Documentation establishes 7 is **eligible**, not certified |
| B · Astro + React + Tailwind | Jointly install Astro 7.3.8, @astrojs/react 7.0.1, React 19 and Tailwind 4 | **Passed** in [CI run 38739222799](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38739222799) |
| C · Diagnostics and build | TypeScript/Astro `check`, production `build` succeed in Node 22 | **Passed** in [CI run 38739222799](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38739222799) |
| D · Browser + accessibility | Playwright React hydration, keyboard, responsive, reduced-motion, axe tests | **Passed** in [CI run 38739222799](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38739222799) |
| E · Wix integration | Independently owner-authorised Wix Astro adapter, SDK auth, app flows, SEO, preview/hosting | **Not performed in toolkit; site-local requirement** |
| F · Upgrade decision | Explicit reviewed version policy, production impact and site migration/rollback | **Not authorised by this investigation** |

**Important:** WHPS-004 synthetic page text still labels its intended baseline Astro 5. The trial test copy is an experiment, not evidence that its visible label has been migrated.

## Observed experiment · 15 October 2026

[Experimental workflow run 38739222799](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38739222799), job `Astro 7 synthetic probe (NOT Wix)`, completed successfully on GitHub-hosted Ubuntu, Node **v22.23.3**. The disposable npm dependency graph resolved:

- Astro **7.3.8**
- @astrojs/react **7.0.1**
- React **19.3.0**
- Tailwind CSS **4.3.3**
- @tailwindcss/vite **4.3.3**
- npm lockfile v3, trial lock SHA-256: `68c68efe390078e9c82c955567c829d3a52cd4c4115072dc739919813d8cbdd6` (ephemeral, not committed)

Astro diagnostics and production build passed; **6/6** Chromium Playwright tests passed, covering client hydration/filter state, keyboard focus, axe-core automated WCAG rules, responsive overflow, reduced motion, and no external Wix requests. The original Astro 5 manifest, stable lockfile and baseline policy were **not altered**. The trial's bundled transitive dependencies are pinned only by the ephemeral lock hash in the CI logs, not a reviewed production upgrade lock.

This establishes **standalone synthetic compatibility**, *not* Wix-managed framework integration or site availability. No Wix adapter, OAuth/visitor/member auth, SDK business APIs, elevated permissions, SEO integration, extensions, production hosting, `wix build` or `wix release` was tested. The current change does not approve a major dependency upgrade, and the published v0.3.0 source stays immutable.

## Follow-on Wix integration validation

The subsequent [WHPS-COMPAT-008 site-local readiness packet](30-WIX-ASTRO7-SITE-VALIDATION.md) defines a real Wix-managed Astro 7 test-site workflow, two separate owner decisions for preview and publication, and structured evidence requirements. It **does not** yet constitute live Wix validation or authorise changing the stable Astro 5 dependencies.

## Outcome rule

Even if B–D pass, the only defensible conclusion is *synthetic Astro 7 compatibility observed in CI*. Keep the published baseline at Astro 5 until separately authorised adoption/migration decisions, reviewed major package/lock policy, and independent Wix integration tests. Any subsequent toolkit release requires its own approval and tag/Release verification.

This packet neither closes [WHPS-007](28-WHPS007-MAINTENANCE-SECURITY-COMPATIBILITY.md) retrospectively nor changes immutable v0.3.0.
