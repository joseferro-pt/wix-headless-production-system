# 21 — WHPS-004 · Generic frontend blocks and validation

**Status:** Merged through PR #16 on 13 October 2026; **not released or deployed**. Current published WHPS toolkit remains v0.2.0 (v0.2.1 is not yet published). Scope: generic code, patterns, synthetic tests and an offline Astro compile reference only.

## Objective

Maximise Wix-managed Headless compatibility with **Astro 5 first**, optional **React 19 islands** and optional **Tailwind CSS 4**. Maintain near-total design freedom by separating content/backend contracts from presentation, while not claiming universal Wix App support.

## Deliverables

- `frontend/astro-primitives/`: local Astro 5 + React + Tailwind 4 **synthetic reference**, not a Wix CLI checkout. Contains no Wix IDs, app tokens or site-specific data.
- Astro layout `SiteFrame.astro`: head elements, language, skip navigation, main landmark, header/footer slots; real Wix sites preserve their own SEO integration.
- Astro `Section.astro`, `ContentCard.astro`, `ContentState.astro`: semantic structural components and explicit loading/empty/error states, all without brand lock-in.
- Optional React `FilterableList.tsx`: client-side filtering from **public serialisable props**, internal href guard, labelled search field, keyboard-native controls and polite result announcements.
- `src/server/reader.ts`: injected Wix-neutral read-only data provider, typed ready/empty/error result, generic error masking. Site-specific authorised Wix SDK code belongs outside WHPS.
- `src/server/wix-capabilities.ts`: documentation-backed Wix feature inventory; statuses distinguish template support from per-feature verification and widget non-portability.
- [Wix compatibility matrix](20-ASTRO-WIX-COMPATIBILITY.md), site adoption notes, automated source/API-boundary tests and local compilation.

## Explicit non-goals

Do not create or connect a real Wix site, run `wix init`/`headless link`, install live Wix apps, fetch or write real Wix CMS records, copy a client handoff, deploy an Astro site to Wix, or bundle `@wix/astro` configuration in WHPS. Wix-managed SDK auth **cannot be inferred from a standalone Astro build**. Do not describe the synthetic demo as a production-ready Wix-managed site.

## Acceptance gates

1. Repo and site ownership stay separated; the toolkit remains Apache-2.0, with generic code and synthetic fixtures only.
2. Use **Astro 5** as the supported Wix-managed target, `@astrojs/react` for optional islands, and Tailwind 4 through `@tailwindcss/vite`. No Astro 6 claim, no replacing Wix-generated Astro config.
3. CI builds the standalone synthetic Astro reference without Wix credentials; no live Wix operations. Unit tests detect accidental browser-side Wix SDK imports, privileged props and forbidden Wix site files.
4. Accessibility defaults include semantic sections, main landmark and skip link, labelled search, status/error semantics and reduced-motion accommodation. Site-specific accessibility audits remain separate.
5. App matrix reflects official business-solution templates and identifies widget-only app incompatibility. Stronger Wix-feature claims require verified site-local evidence.
6. Docs distinguish compiled framework compatibility from Wix-managed hosting/auth/SEO/app compatibility; unresolved extensions, payments, custom domain and member journeys are site-local QA.
7. PR CI and CodeQL succeed on exact final candidate, ready for **explicit owner review**, **not auto-merge**. Releasing WHPS code is an independent later approval.

## Next WHPS milestones

WHPS-005 adds deeper automated QA, accessibility checks and Wix-aware site-local verification recipes. WHPS-006 defines packaging, per-site adoption/version migration and exact dependency compatibility. WHPS-004 deliberately avoids locking all websites into one mandatory visual system.

Reference example: [Astro primitives](../frontend/astro-primitives/README.md); [system boundaries](06-SYSTEM-BOUNDARIES.md); [R06.1 provenance](19-R061-PROVENANCE-AND-RELEASE.md).
