# 05 — Implementation roadmap

## WHPS-001 — Authority, intake and manifest [FOUNDATION PREPARED]

Deliverables: this system baseline, exact-prompt parser, JSON Schema, resource registry contract, process/QA/approval rules, dry-run tests. Exit condition: agent can parse Wix's prompt without changing a user's site.

## WHPS-002 — Validate against a real Wix project [NEXT]

1. Acquire the real Wix-generated blank-site ZIP for the existing example site.
2. Read only; list files, package manager, framework, Wix config and deployment settings with `python scripts/audit-wix-archive.py ./original.zip ./client/site.manifest.json --provenance wix-original`.
3. Compare config IDs to handoff; log any divergence, do not 'fix' by creating a new site.
4. Write an import pilot report and file manifest (hashes, sizes, risks).
5. Decide whether the starter should be a thin overlay or framework-specific package.

## WHPS-003 — Wix reconciliation engine [PLANNED]

Read-only import of actual installed apps and resources, compare with intended integrations, produce a dry-run delta. Only implement writes after exact API contracts and approval rules are settled.

## WHPS-004 — Starter architecture [PLANNED]

Build reusable navigation, layout, form states, SEO, design tokens and error boundaries *on top of* the framework shipped in the actual Wix project. Avoid creating an unrelated static clone.

## WHPS-005 — Automated QA [PLANNED]

Contract validation, fast build checks and optional Playwright/visual tests based on the real framework and access. Clearly separate headless API integration tests from browser/production acceptance.

## WHPS-006 — GitHub and release pilot [PLANNED]

Publish this system as a dedicated GitHub repo; add branch protections if available; test a sample project checkout; make a preview and deliberate release with observed URLs. Avoid using an unrelated existing repository.

## Pilot outcome to target

With nothing more than the exact Wix-generated prompt and an accessible archive, intake should identify the existing Wix project, preserve its identity, produce a versioned specification, implement and validate changes, and return evidence of an approved live release. No duplicate Wix sites and no silent backend side effects.
