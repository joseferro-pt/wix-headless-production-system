# Site AGENTS.md — generic blueprint

**Copy and customise in one independent website repository.** This file in WHPS is only a template: never add real Wix site identifiers, client facts or deployment evidence to the toolkit source.

## Authority by domain

1. User/client-approved outcomes and factual business brief govern what the website should say and do.
2. Current official Wix Headless/CLI/SDK technical references govern Wix integration behaviour.
3. The original Wix handoff, actual `wix.config.json` and verified Wix backend observations must reconcile for identity and resource operations.
4. This website's accepted code, content, designs, tests and decision records govern its implementation.
5. The explicitly pinned WHPS **Git SHA** or, after a release has actually been published, approved release tag supplies reusable tooling guidance. It cannot overrule Wix API contracts or client approvals.

Follow the full system decision model: `docs/10-AUTHORITY-AND-DECISIONS.md` in the adopted WHPS source.

## Site-only operations

- Keep Wix site/client IDs, original prompt/archive, media, business facts, resource registry, release logs and approvals in **this site's repository**; never push them upstream into WHPS.
- Investigate a mismatching Wix binding rather than provisioning another site.
- Review read-only Wix resource state before any authorised mutation; do not create duplicate forms, apps or CMS collections.
- Keep Wix session secrets and API tokens in a secure environment, never source control or logs.
- Record the WHPS revision adopted here; update only through reviewed, site-specific changes.
- Build and release only from this site project using its applicable Wix hosting path and permissions.

## Evidence

A passing WHPS toolkit test is not a site build or deploy. Record actual site QA, operator approval, release command result and post-release verification in this website repository's Control Room.
