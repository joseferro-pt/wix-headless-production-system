# 02 — Wix-generated prompt as technical handoff

## Expected Wix prompt

The prompt may include a generic brief plus: `https://wix.com/headless/skill.md`, a Wix-managed Headless template download URL, public Client ID, Site ID and target dashboard URL. Use the official prompt **verbatim** as input.

## Repository isolation

Always invoke the intake tool with an output directory **outside this repository**. The tool's generated handoff, manifests, real identifiers and Wix project source belong solely in the website repository. A system-level sample may use synthetic identifiers for tests.

## Automated intake

```sh
node scripts/intake-wix-handoff.mjs ./incoming/original-wix-prompt.txt ../my-site-repository
node scripts/validate-manifest.mjs ./clients/my-site/site.manifest.json
```

The intake parser:

- Extracts and cross-checks the explicit site/client IDs and download/dashboard site IDs.
- Writes `wix-handoff.original.txt` unchanged and records SHA-256 in the manifest.
- Creates a `site.manifest.json` with `business.factsStatus: unknown`.
- Emits *no* Wix API calls, backend mutations, login, build or deployment.
- Refuses to overwrite an existing target manifest.

## Do not confuse bootstrap and provisioning

**Wix-generated original blank ZIP:** already represents a site created by Wix. Download and inspect it before doing anything else. If `wix.config.json` contains site/client IDs, reuse them; do not call `init` or create a new site. If missing/mismatched, stop and diagnose instead of silently issuing fresh IDs.

**Existing connected repo:** inspect Git history and `wix.config.json`, then follow the official `iterate` track. Never re-`init` an already-bound repository.

**An unconnected custom frontend:** may require the official `connect`/`init` route, which can provision a new Wix Headless site. That route is **not** a valid substitute when the owner provided an already-created Wix site identity.

## Preflight evidence to record

1. Source download URL and acquisition status.
2. ZIP SHA-256, file manifest, sizes, package files, framework and required package manager.
3. `wix.config.json`: actual `siteId`, `appId`, `site.outputDirectory` if present.
4. Handoff cross-check (URL IDs, config IDs; mismatches are a blocker).
5. Read-only Wix site context: published flag, domain, region, apps, CMS collection inventory where accessible.
6. Risks: already-live domain, authentication availability, environment prerequisites.
7. Decision on entry route: `handoff` or `iterate`.

## What the original Wix prompt does not establish

True company category, real services, pricing, opening hours, location, voice, legally required policies, completed client assets, booking/payments requirements or whether live production may be replaced. Separate these from technical fields.

## No secrets

Client ID is public OAuth identity. Admin tokens, bearer credentials, session cookies and API keys are secrets. They must never be stored in the project manifest or in issue/PR text.
