# 23 — WHPS-005 · Quality assurance and verification

**Status:** Development packet under review, not part of the published v0.2.1 tag. **Scope:** Generic, offline system-toolkit checks and guidance, plus synthetic Astro browser QA. No real Wix site access, account verification, SDK invocation or deployment.

## Purpose

WHPS-004 delivered a compile-tested, Wix-neutral Astro 5 reference. WHPS-005 adds reproducible build dependencies, diagnostic type checking, browser-level behaviour/accessibility checks and an offline evidence contract for separately owned Wix-managed sites. These must remain three separate concepts:

1. **Toolkit tested:** local synthetic components compile and behave as expected.
2. **Site operator reported:** an independent site's maintainer supplies evidence for site-local gates. This is unverified by WHPS.
3. **Live Wix verification:** a separately authorised site-level operation tests Wix-managed SDK/auth, CMS, business apps, SEO and deployment. WHPS does not do this.

## Deliverables and repeatable commands

The reference at `frontend/astro-primitives/` now has a committed npm dependency lock, Astro TypeScript diagnostics, and Playwright/Chromium tests using axe-core.

From the **WHPS repository** for synthetic reference tests only:

~~~sh
npm --prefix frontend/astro-primitives ci
npm --prefix frontend/astro-primitives run check
npm --prefix frontend/astro-primitives run build
npm --prefix frontend/astro-primitives exec -- playwright install chromium
npm --prefix frontend/astro-primitives run test:browser
~~~

CI installs Chromium and its OS dependencies, builds only synthetic routes, and exercises the actual React island. No Wix credentials, config, site ID or network connection is required for the content under test. The browser runner downloads its browser binaries from the Playwright supply chain during setup; this is a tooling download, **not Wix site access**.

For site QA evidence, run the standalone **read-only** Node evaluator with an input path from the **independent site repository**:

~~~sh
node scripts/evaluate-site-qa.mjs --input /path/to/site/docs/site-qa.json --json
~~~

- The input must conform to [the v1 JSON Schema](../schemas/site-qa-report.schema.json), and the evaluator separately rejects duplicate/missing gates and contradictory owner/deployment claims.
- The [synthetic example](../examples/site-qa.synthetic.json) is intentionally incomplete and has no Wix source identity. Never use it as proof of any site's readiness.
- Gate statuses: `passed`, `failed`, `not-run`, `not-applicable`. Passing checks must include a real site-owned evidence reference. Not-applicable checks must explain why.
- The evaluator emits only gate names/statuses and a summary. It does not print input evidence values, evaluate URLs, access a backend or attest GitHub/Wix identities.
- Exit code 0 means **internally complete operator-reported records only**, not release permission. Exit 1 means `blocked`/`incomplete`; exit 2 means structurally invalid input.

## Report gates

`source`, `build`, `wix-binding`, `wix-permissions`, `wix-app-flows`, `accessibility-automated`, `accessibility-manual`, `responsive`, `seo`, `performance`, `security`.

Production Wix-managed Astro requires a `passed` Wix binding record, while unused app features may be `not-applicable` with a reason. A recorded publication without prior recorded owner approval is always blocked. Every report must identify a full lower-case 40-character site Git commit SHA, but the **reported SHA is not independently verified**.

Report states: `blocked`, `incomplete`, `awaiting-owner-approval`, `recorded-approval-for-review`. The strongest state is deliberately **not** named `deploy-ready`, `Wix-verified`, or `certified`.

## Review and acceptance gates

1. Audited Astro 5 major-line dependency graph and committed package lock; CI uses immutable `npm ci` and rejects lock drift.
2. Astro `check` and `build` succeed in Node 22 / Ubuntu on the generic reference, with no Wix SDK imports or website configuration.
3. Chromium tests run real hydration/filtering, skip-link focus, mobile/tablet/desktop overflow and reduced-motion expectations.
4. axe-core checks automatically detectable WCAG A/AA violations; explicit **manual** accessibility review remains mandatory in site projects.
5. QA report parser and JSON Schema fail closed on duplicates, invalid statuses, absent evidence, inconsistent publication/approval and Wix-managed production without binding.
6. Site-local [verification recipes](24-SITE-LOCAL-VERIFICATION.md) cover applicable SDK roles, business apps, SEO, security, performance, approval and post-release evidence without claiming they were actually exercised.
7. GitHub CI and CodeQL pass on the final candidate and merged main. Owner review/merge and separate toolkit publication approval remain separate operations.

## Remaining boundaries

- Official Wix linking documentation reviewed 13 October 2026 permits Astro 5 or 7 but not 6. WHPS-005 tests **Astro 5 only** with its current React/Tailwind dependency graph.
- Automated axe rules do not fully establish WCAG compliance, visual quality, assistive technology support or user satisfaction.
- The site-level report is a structured **claim**; the CLI cannot independently prove evidence links, site owner authority, Wix identity or deployment.
- WHPS-006 remains responsible for distribution, per-site adoption, upgrades and precise dependency compatibility policies. A new release is not automatic on merging WHPS-005.

Related: [WHPS-004 closure](22-WHPS004-CLOSURE-AND-V021-PUBLICATION.md), [site verification](24-SITE-LOCAL-VERIFICATION.md), [toolkit boundaries](06-SYSTEM-BOUNDARIES.md), [Wix matrix](20-ASTRO-WIX-COMPATIBILITY.md).
