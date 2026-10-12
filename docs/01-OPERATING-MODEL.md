# 01 — Operating model for website delivery

This file defines a **reusable protocol** which is adopted and executed **inside an independent website repository**. It is not a list of website tasks for the WHPS toolkit itself. See [terminology](09-TERMINOLOGY.md) and [authority](10-AUTHORITY-AND-DECISIONS.md).

## Evidence and ownership

- **Wix (actual site/backend):** authorised observations of installed apps, CMS, forms, bookings, commerce records and publishing results.
- **Website Git repository:** original Wix prompt or other confirmed site source, actual `wix.config.json`, project manifest, code, design, content, tests and release records.
- **Client-approved brief:** verified business facts, intended outcomes and approval evidence.
- **WHPS:** reusable policies, schemas, blueprints, synthetic tests and offline checks; no actual client website files.

## Entry modes

| Manifest `entryMode` | Starting point | Wix operational handling |
|---|---|---|
| `wix-handoff` | Original Wix-generated prompt and template download | Inspect provided project/binding; avoid duplicate provisioning |
| `existing-repository` | Existing site repo and verified Wix identity | Use the applicable Wix **iterate** path; preserve binding |
| `unbound-frontend` | Frontend without verified Wix binding | Assess Wix **connect/create** path and necessary authorisation |

The original WHPS intake CLI **implements only offline `wix-handoff` intake**. Separate, unreleased WHPS-002 development tooling can create a **new** local Git repository for `wix-handoff` or `unbound-frontend`, without Wix operations. `existing-repository` continues to require manual, non-destructive adoption; the bootstrap must refuse existing destinations. See [site bootstrap](16-SITE-WORKSPACE-BOOTSTRAP.md).

## Website lifecycle and gates

| Stage | Machine state (where applicable) | Evidence needed |
|---|---|---|
| Intake | `HANDOFF_RECEIVED` for Wix handoff | Original prompt stored and identifiers cross-checked |
| Preflight | `PREFLIGHT_COMPLETE` | Source and binding inspected; authenticated Wix context where available |
| Discovery | `BRIEF_APPROVED` | Client facts, actions, languages, content uncertainties approved |
| Specification | `SPEC_APPROVED` | Sitemap, design, integration intent and scope accepted |
| Implementation | `IMPLEMENTED` | Frontend and relevant backend wiring changed as approved |
| Reconciliation | `BACKEND_SYNCED` | Actual resources reconciled, writes evidenced if permitted |
| Quality | `BUILD_PASSED` | Applicable build and QA checks pass; gaps documented |
| Release decision | `RELEASE_APPROVED` | Site-specific release approval and candidate identified |
| Wix deployment | `RELEASED` | Real Wix release result and published URL recorded |
| Verification | `VERIFIED` | Permitted post-release checks evidenced and outstanding failures recorded |

`BLOCKED` denotes an unresolved prerequisite or validation failure. **Do not** reuse website lifecycle values as statuses for WHPS PRs. For entry modes without a generated Wix handoff, do not fabricate a `HANDOFF_RECEIVED` event; record the real available evidence and the schema-compatible state appropriate to that situation.

## Control and approval

- **Site operator/client:** controls business facts, scope, production approval, destructive changes and purchases.
- **Site implementation agent:** collects evidence, implements approved work, reports actual results.
- **Wix:** authoritative for live resource state and platform outcomes, alongside its published technical contract.

A provided Wix blank site is **not** permission to provision a second site. A passing offline manifest test is **not** proof that backend features, payments, authentication or live deployment work. Do not run live Wix operations from the WHPS toolkit repository.

## Completion

A website is verified only when its independently reproducible checkout, Wix integration, relevant build, authorised deployment and post-release checks are supported by site-local evidence. A generated archive or lone backend form is not a completed website.
