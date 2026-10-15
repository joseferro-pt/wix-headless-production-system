# 28 — WHPS-007 · Sustainable Maintenance, Security and Compatibility

**Status:** Development work packet under review, newer than published v0.3.0. **Scope:** WHPS generic toolkit only. No live Wix site monitoring, client-repo updates, auto deployment or public release.

## Maintenance operating procedure

The repository owner approves support promises, public releases, protection settings, security reporting channels, and major compatibility changes. Maintainers propose narrowly scoped pull requests with evidence. The frequencies below are **recommended procedures**, not an automatic monitoring service or a guaranteed response-time SLA.

| Frequency or trigger | Review and record |
|---|---|
| Weekly | Triage Dependabot PRs for Python, GitHub Actions and npm synthetic Astro reference; check lock drift, CodeQL, new advisories and review backlog. |
| Monthly | Investigate dependency-security advisories from authorised tools, supported runtimes, licences, documentation drift and upstream framework changes. Record actual scope and dates. |
| Quarterly | Revalidate latest official Wix-managed Astro/API/app documentation, Wix-related risk, Node/Python runtime support and major-version matrix; agree upgrades only after measured CI and site-local Wix evidence. |
| Breaking upstream change / security report | Privately triage actual impact, tags, severity, repro, remediation and client-repo notification responsibilities. Prioritise active credential exposure. |
| Release | Verify source/branch reviews and exact-main CI/CodeQL, compatibility, security, licensing and migration; publish only with explicit owner decision. |
| After publishing | Independently verify immutable annotated tag/public Release, then reconcile the historical catalog through a new reviewed PR. |

## Dependency change control

The weekly Dependabot configuration watches **pip** and **github-actions** in the repository root and **npm** in /frontend/astro-primitives. npm minor/patch updates are grouped; majors are proposed separately, never accepted automatically. All PRs require source review and exact-commit tests.

The [offline dependency check](../scripts/check-maintenance-policy.mjs) reads the private synthetic frontend manifest, npm lock and [reviewed compatibility baseline](../maintenance/compatibility-baseline.json). It rejects unexpected core majors (Astro 5, @astrojs/react 4, React 19, Tailwind 4, @tailwindcss/vite 4), changes to Node 22 engine policy, stale direct dependencies, non-npm registry tarballs and missing package integrity fields. Its structured result intentionally says it is **not a vulnerability scanner, lock signature or Wix integration test**. The registry and dependency supply chain are not thereby independently trusted.

To review a major upgrade, establish a dedicated work packet; consult the latest official Astro, React, Tailwind and Wix Headless technical docs; update the framework baseline only alongside a reviewed PR and synthetic type/build/hydration/a11y evidence; and independently verify Wix-managed adapters, SDK authentication, SEO and installed apps in any actual site with owner permission. The outstanding [Astro 7 dependency PR #23](https://github.com/joseferro-pt/wix-headless-production-system/pull/23) remains **unaccepted** by this packet; Wix-supported Astro framework versions are not evidence that WHPS's exact integration is ready.

## Security and disclosures

- **Report privately:** consult [SECURITY.md](../SECURITY.md). Never open public issues exposing live credentials, site IDs, customer records, exploit details or secrets.
- **Triage:** reproduce issues with synthetic data, identify exact affected release tags and source SHAs, and distinguish toolkit flaws from actual Wix-site vulnerabilities.
- **Contain:** rotate compromised keys with the provider immediately; removing source text is not a substitute for key revocation. Coordinate with individual site owners independently.
- **Fix:** review regression tests and potential breaking changes in a PR, then publish an advisory or patched version only after authorised owner approval.
- **Owner-only GitHub controls:** the repo API returned **zero rulesets** as of 15 October 2026. Classic branch protection and private vulnerability intake remain **unverified**. The owner should inspect Settings for default permissions, required PR reviews/checks, force-push/tag protection, dependency alerts, security advisories and private reporting. A code PR cannot assert or enact these settings.
- No response-time or old-tag patch-support commitment is promised for early 0.x releases. v0.3.0 is latest public, and previous releases remain immutable.

## Contributions and compatibility evidence

Contributions must remain WHPS-only and synthetic; document exact source, threat/compatibility scope, changed runtime/framework versions, test failures, security impact and owner decisions. See [CONTRIBUTING](../CONTRIBUTING.md), [PR checklist](../.github/PULL_REQUEST_TEMPLATE.md), and [tested environment matrix](12-SUPPORT-COMPATIBILITY.md).

Real Wix-managed sites retain their own repos, project identity, SDK/app authorisation, SEO, security reports, testing and deployment approval. GitHub toolkit CI cannot certify website functionality, billing, payments, WCAG conformity or production performance.

## Acceptance

1. Python, Actions and npm Dependabot ecosystem monitoring with strict config/negative tests.
2. Offline audited framework-major, npm registry and lockfile-integrity policy with failing negative tests.
3. CI integrates that policy before synthetic Astro install/check/build and Chromium/axe tests.
4. Contributing, security, compatibility, support and owner settings have explicit scope, decision authority and review cadence.
5. All PR and merged-main tests/CodeQL pass; a merge does not publish a release.

The release catalog and immutable v0.3.0 source remain unchanged. WHPS-007 can be considered **merged, not released** after successful PR merge and main validation.
