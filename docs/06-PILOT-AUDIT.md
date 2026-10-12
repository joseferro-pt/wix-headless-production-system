# 06 — Initial read-only pilot audit

**Date:** 2026-10-12  
**Pilot target:** existing José Ferro Wix Headless site  
**Status:** Partial, original Wix project archive not verified

## Evidence examined

1. The exact Wix-generated prompt provided in the conversation (Site ID, public Client ID, original download URL, Wix dashboard URL).
2. The derivative frontend archive generated in the previous assistant turn (`joseferro-headless-site.zip`), **not** the original Wix blank template. The derivative archive was audited read-only with `scripts/audit-wix-archive.py`.
3. Current official Wix Headless managed flow, as indexed by Wix's public skill source.

## Findings

- The prompt's Site ID matches the download URL and dashboard URL.
- The derivative ZIP contains `wix.config.json` and its `siteId` and `appId` match the handoff.
- The derivative ZIP contains `index.html`, `styles.css`, `app.js`, `README.md` and `wix.config.json` (with no `package.json`), corresponding to a plain static site.
- `wix.config.json` in that *derivative* ZIP has **no `site.outputDirectory`**. Wix's current managed deployment reference explicitly warns that static projects need the output directory pointing at the actual static entry files. This should block production deployment until verified/fixed in the real project.
- There is **no evidence** from this ZIP that Wix CLI authenticated, built, released or verified a production deployment.

## Non-conclusions

- No claim about the framework or structure of the **original Wix blank template**.
- No claim that the derivative ZIP represents the live published site's files.
- No claim that creating a Wix contact form proves that the frontend submission workflow was successfully tested.

## Next action

Acquire and audit the actual Wix-provided ZIP. Compare it with the derivative archive, decide the correct project-local configuration and record the accepted import path. Do not modify the live site as part of this pilot.

The real pilot's generated manifest and audit JSON were retained outside the reusable system package so the global starter remains client-neutral.
