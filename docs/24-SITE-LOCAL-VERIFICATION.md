# 24 — Site-local Wix-managed QA verification recipes

**Audience:** Independently owned website repositories. This file is a generic reusable checklist, not a WHPS Wix runbook or production authorisation. Real QA evidence, credentials, site IDs, screenshots and logs belong only in the **site repository** under its own retention and access rules.

## Record evidence in the website repository

Adapt the structure of [the synthetic example](../examples/site-qa.synthetic.json), using the version-1 [schema](../schemas/site-qa-report.schema.json), to create a real `docs/site-qa.json` **inside the actual website checkout**. Record the full site source SHA and applicable site-local evidence for each gate. Never add an actual site's record to the WHPS toolkit.

Optional **offline structural preflight** from a WHPS checkout:

~~~sh
node scripts/evaluate-site-qa.mjs --input /path/to/site-repo/docs/site-qa.json --json
~~~

This evaluator reports only *operator-stated* results, does not independently inspect Wix or GitHub, and never confirms a live deployment. A zero exit code is **not** a release go-ahead.

## Per-site evidence matrix

| Gate | Site-local evidence required |
|---|---|
| `source` | Reviewed site commit, framework/runtime versions, exact lock, Wix-generated configuration provenance, source boundary |
| `build` | Successful actual site build/preview output for that commit, plus error and empty-state checks |
| `wix-binding` | Actual expected Wix site/project binding checked through current official site-local instructions |
| `wix-permissions` | Visitor/member/staff/auth scopes, allowed and forbidden SDK requests, no privileged SDK in React/browser bundles |
| `wix-app-flows` | For each installed API-backed app, real route and API flow evidence; document legitimate exclusions |
| `accessibility-automated` | Browser-based axe/lint results on real routes and meaningful UI states |
| `accessibility-manual` | Keyboard focus, assistive technology, screen-reader labelling, motion, contrast and input validation |
| `responsive` | Real mobile, tablet and desktop route tests and overflow/focus checks |
| `seo` | Wix Astro SEO implementation, titles/canonicals, crawlability, robots, actual route metadata and sitemap as applicable |
| `performance` | Device/network context, representative route metrics and approved budgets |
| `security` | Secret boundary, privacy/consent, session and errors/logging, redirects, abuse/rate limits as applicable |
| `approval` | Separate site-owner recorded go/no-go decision and evidence reference |
| `deployment` | Actual site deployment attempt/outcome, logs and independently checked URL if authorised; never guessed |

Use `not-applicable` only when the feature is truly absent and record a concrete reason. Untested features *present* in the site are `not-run`, not `not-applicable`.

## Wix-managed Astro verification workflow

1. **Establish site identity before testing.** Preserve Wix-created `wix.config.json`, Astro integration and project binding. For existing projects, Wix's link flow currently supports Astro 5 or 7, **not 6**; linking provisions a Wix project and therefore requires site-owner authority. Do not link or provision from WHPS.
2. **Verify actual framework and Wix runtime.** The Wix-managed Astro integration handles authentication for Wix SDK methods. Check that backend calls execute under the correct visitor/member permissions and that disallowed access is denied. A successful standalone Astro build does **not** test this.
3. **Use Wix-managed build/preview separately from release.** The official managed Astro development guidance documents `wix build`, `wix preview`, `wix release`, and `wix env`. Verify the current commands in the **site repository** before acting. Never run them from this toolkit.
4. **Test installed API-backed business apps, not assumed Wix widgets.** For Stores, test products/variants, cart, totals/tax, checkout/payment and redirects. For Bookings, test availability, timezone, staff, cancellation and payment. For Events, test RSVP/tickets and eligibility; for CMS, query permissions, media/locales; for Blog, rich content and SEO; for Forms, validation, submissions, consent and abuse controls. Members and Pricing Plans require their own auth/entitlement checks. All such tests are **site-local** and scope-dependent.
5. **Audit accessibility and privacy.** Browser automation catches some defects, but manual keyboard/screen-reader review, human content verification and real-world responsive behaviour are separate evidence. The site must enforce lawful consents and avoid leaking privileged data into browser islands.
6. **Authorise actual publication separately.** Approval must be explicit, tied to the site commit and deployment intent. Wix backend data mutations may not roll back with a frontend revert; maintain a separate recovery plan. Document actual release/monitoring outcomes, or an explicit block.

Wix warns that app-market features delivered solely as Wix editor/site widgets do **not** work as headless UI. Templates are useful starters, not blanket per-site certification.

## Official references (reviewed 13 October 2026)

- [Connect existing Astro project](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project)
- [Wix-managed development and CLI](https://dev.wix.com/docs/go-headless/wix-managed-headless/develop-your-project)
- [Astro business-solution templates](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/astro-templates)
- [Add API-compatible apps](https://dev.wix.com/docs/go-headless/project-management/add-apps-to-a-project)
- [WHPS compatibility matrix](20-ASTRO-WIX-COMPATIBILITY.md)
