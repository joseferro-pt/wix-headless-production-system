# 30 — WHPS-COMPAT-008 · Wix-managed Astro 7 Integration Validation

**Decision state:** **Validation protocol merged via [PR #34](https://github.com/joseferro-pt/wix-headless-production-system/pull/34); live Wix integration NOT YET TESTED.** The latest WHPS release is still **v0.3.0**; WHPS reference remains **Astro 5**. Previous [PR #33 synthetic trial](29-ASTRO7-COMPATIBILITY-REVIEW.md) passed Astro 7 / @astrojs/react 7 / React 19 / Tailwind 4 build and browser tests, but ran with **no Wix integration**.

## Operating boundary

This packet defines a site-local validation procedure and a *read-only* contract for reporting its results. It does not provision a Wix business, create a GitHub repository, use an SDK token, deploy code, install Wix apps, test against a real site, or advance a framework support claim.

**Separate website, separate authority:** a Wix-managed Astro 7 **dedicated disposable test site** must have its own repository and owner, with explicit approval to provision/link, preview, install apps and (separately) publish. That approval is not inferred from green synthetic CI, PR merge, the user's approval to work on a toolkit, or test data. Do **not** run \`headless link\`, \`wix preview\` or \`wix release\` inside WHPS. No dedicated site repository or owner authorisation is recorded by this packet.

### Required environment and source controls

- A new **independent** website repo, unlinked Astro **7** site code, **Node.js 22** (also meets Wix's published Node ≥20.11 prerequisite), @astrojs/react **7**, React **19** and Tailwind CSS **4**. Lock and document each exact resolved version and its source site commit. Wix docs say Astro **5 and 7** are eligible for linking and Astro **6 is unsupported**; that does not guarantee the particular dependency combination.
- A dedicated synthetic Wix business, never a real client's business or commerce store. No real customer or financial data; use disposable test members, non-chargeable catalogue/booking examples, least-privilege accounts.
- Separate admin/operator roles for negative permission testing. Do not put any service token, Wix ID, site URL or personal data in WHPS; store genuine evidence only in the **test site's access-controlled repository**.
- Preserve Wix CLI-generated \`astro.config.mjs\`, \`wix.config.json\`, integration packages, permissions and secrets. Do not overwrite them with \`frontend/astro-primitives/astro.config.mjs\`; that unbound reference has no \`@wix/astro\` adapter.

## Phase A · Owner-authorised provisioning and **preflight**

| Gate (evidence record ID) | Expected site-local verification |
|---|---|
| \`source-lock\` | Exact independent site's Git SHA; npm dependency lock; Astro 7, @astrojs/react 7, React 19, Tailwind 4, Node 22; independent Wix-app packages reviewed |
| \`wix-project-binding\` | Owner-approved \`npm create @wix/new@latest -- headless link\` **only from a new unlinked test-site repo**; correct generated integration/config, with no credentials copied to WHPS |
| \`wix-build\` | Actual Wix-managed \`wix build\` completes; inspect adapter, extension and reserved-route collision warnings rather than relying only on \`astro build\` |
| \`wix-preview\` | Separate owner-approved \`wix preview\` uploads the trial to the **test Wix business**; actual preview URL works (URL/evidence stays site-local) |
| \`visitor-auth\` | Anonymous visitor Wix SDK request succeeds at visitor scope; repeat navigation preserves intended session only as applicable |
| \`member-auth\` | Disposable member navigates through built-in **GET** \`/api/auth/login\`; verify redirect and session, and **POST** \`/api/auth/logout\`; never fabricate a member token |
| \`permission-denial\` | Expected forbidden business/admin SDK call is rejected for unauthorised visitor/member; verify no admin credentials/elevated server SDK leaks into React/browser bundles |
| \`cms-read\` | Explicit permitted read of a synthetic CMS item through real site SDK, and negative permission case as applicable |
| \`business-app-read\` | At least one owner-installed API-backed Wix app (e.g., Bookings or Stores) has a real, **read-only** SDK request and rendered state; widget-only apps do not count |
| \`react-hydration\` | Test the actual Wix-managed Astro page with a React island, not just the standalone WHPS synthetic reference; keyboard/filter state hydrates |
| \`tailwind-styling\` | Test-site Tailwind 4 output/styles apply on local and Wix preview builds; visual checks across relevant breakpoints |
| \`accessibility\` | Automated axe and manual keyboard, focus, screen reader, labels and motion tests on preview's actual states |
| \`reserved-routes\` | No colliding \`/_api/*\`, \`/_wix/*\`, \`/api/auth/*\`, \`/checkout\`, \`/robots.txt\` or \`/sitemap.xml\` custom routes; check genuine Wix-generated routes |

**Warnings:** A successful \`wix preview\` does **not** register all extensions. Wix says some require an explicit \`wix release\`. Preview results must never be described as published SEO, live extensions or production functionality. [Wix CLI guidance](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/development/build-and-deploy-with-the-cli).

### Phase B · Separate owner decision to publish a **disposable test site**

**HOLD unless the test-site owner explicitly approves the exact site commit, chosen business, allowed operations, rollback and temporary public exposure.** Publishing requires \`wix release\`, which changes externally visible Wix state. It must not occur from WHPS or as part of its CI and should use an authorised operator in the isolated test-site repo. No approval or execution is claimed here.

Only after this decision, test the following three additional gates:

| Gate | Expected test-site evidence |
|---|---|
| \`seo-main\` | Wix dashboard SEO settings registered after initial publication; on published site, injected title/description/canonical/social tags carry \`wix-seo-tag="true"\`, and a dashboard edit propagates without redeploy |
| \`seo-item\` | One server-rendered sample item route with \`@wix/astro-pages\` registration and \`@wix/seo\` configuration, generated metadata and page-registry route observed. No duplicate dashboard/title tags |
| \`wix-release\` | Owner-authorised \`wix release\` succeeds **on the isolated test business only**, extensions register if applicable, preview/published behaviour reconciled, and rollback/retirement recorded |

Wix documents that SEO injection is **not validated by local Wix dev**; test real published pages. Dynamic item SEO requires server rendering, route metadata registration and Wix SDK SEO configuration; a standalone Astro preview proves none of these. The platform reserves \`/robots.txt\` and \`/sitemap.xml\`, and its SEO middleware injects tags with \`wix-seo-tag="true"\`. See [main-page SEO](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/feature-guides/seo/manage-seo-for-main-pages), [item-page SEO](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/feature-guides/seo/add-seo-support-to-item-pages) and [reserved URL paths](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/development/reserved-url-paths-for-the-astro-integration).

## Evidence records and offline evaluator (site-owned records only)

The [v1 JSON Schema](../schemas/wix-astro7-site-evidence.schema.json) and [synthetic starter](../examples/wix-astro7-evidence.synthetic.json) define a closed 16-gate structure. Clone the fixture into your separate website repository; replace **synthetic placeholders** with *links or opaque references to actual site-local evidence*. A check is \`passed\`, \`failed\` or \`not-run\`; there is no silent \`not-applicable\` exemption for the chosen comprehensive test scope. Store the real site commit; do not include site IDs, real URLs, tokens or personal data in this toolkit.

From a trusted WHPS toolkit checkout, **only if the owner authorises reading the one test-site evidence file**:

~~~sh
node scripts/evaluate-wix-astro7-evidence.mjs \
  --input /path/to/test-site/docs/wix-astro7-evidence.json \
  --json
~~~

- **Preflight:** all 13 phase-A checks must be operator-reported \`passed\`, with explicit preview authorisation, and the remaining 3 publication/SEO checks **must** remain \`not-run\`. A zero exit status means structurally complete *operator reports* only, **not permission to publish**.
- **Published-site phase:** only after a separate owner's publication go/no-go, all 16 checks must be operator-reported \`passed\` and both authorisations marked approved with evidence references.
- Incomplete, failed, contradicting or unauthorised records are blocked; CLI exit code 1 indicates blocked, 2 indicates invalid input. The script never authenticates, fetches, checks URLs or verifies external evidence. Its JSON output deliberately omits operator evidence strings and the site SHA.
- The broader [WHPS-005 site QA contract](24-SITE-LOCAL-VERIFICATION.md) remains separately necessary for production readiness, including performance/security; this focused Astro 7 report does not replace it.

## Acceptance and next work

**Toolkit acceptance:** synthetic schema/negative tests, no Wix secrets, no real site or deployment, CI/CodeQL passing. **Real Wix compatibility:** remains **unverified** until both site-local phases are authorised, carried out and independently reviewed. Therefore do **not** change the reviewed Astro 5 dependency policy or merge standalone Astro 7 Dependabot PRs as a shortcut.

**Next site-local packet, after owner authorisation:** create a disposable separate site repository; install Astro 7 / React 7 / React 19 / Tailwind 4, run official Wix linking only there, preserve Wix's generated config, execute phase A, request separate phase B approval, and capture real results. Then a new reviewed WHPS decision could weigh Astro 7 adoption and release migration against actual Wix evidence.

This work packet does **not** certify Wix app compatibility, launch any website, claim live tests were run or publish a new WHPS version.
