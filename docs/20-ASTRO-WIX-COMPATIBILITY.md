# 20 — WHPS-004 · Wix-managed Astro compatibility and design freedom

**Evidence reviewed:** Official Wix, Astro and Tailwind documentation on **13 October 2026**. This matrix documents **known capabilities and implementation routes**, not a live Wix compatibility certification. Revalidate upstream in every independently owned website repository.

## Adopted default architecture

| Layer | Default | Reason and boundary |
|---|---|---|
| Hosting, backend and auth | Wix-managed Headless with **Wix's Astro integration** | Maximum Wix-managed feature integration (visitor/member authentication, extensions, SEO, analytics, logs). Authentication is provided by the **actual Wix Astro integration**, not standalone Astro. |
| Frontend framework | **Astro 5** | Wix link documentation explicitly supports Astro 5 and says **Astro 6 is not supported**. Keep the Wix-generated adapter, CLI and configuration intact. |
| Interactive components | **React islands, optional** | `@astrojs/react` supports React rendering/hydration in Astro. Prefer Astro/native HTML first; use `client:idle`, `client:visible` or `client:load` selectively. |
| Styling | **Tailwind CSS 4, optional** | Supported by Astro with `@tailwindcss/vite`. Owner-defined tokens and styles provide creative freedom. Preserve Wix-generated Astro integration and other Vite plugins. |
| Wix API access | Official Wix SDK **backend modules** in the Wix-managed Astro context | Call documented SDK methods under appropriate visitor/member/app authority; do not put secrets or elevated/admin capabilities in React island props. |
| Application experience | Custom Astro + React UI using Wix business APIs | Headless offers custom layouts and interactions, **not automatic re-rendering of native Wix site widgets**. |

## Business app capability matrix

Wix offers Astro business-solution templates for the first six entries. **A template is evidence of an integration starting point, not universal functionality support.**

| App / capability | Official basis | Recommended implementation | Per-site verification required |
|---|---|---|---|
| Wix Stores | `commerce` Astro template | Astro product routes/catalog; optional React cart UI; site-local Wix Stores/eCom APIs | Product models, variants, cart, permissions, prices, taxes, payments, redirects/checkout |
| Wix Bookings | `scheduler` Astro template | Astro service/schedule pages, selective React calendar UI, Wix Bookings APIs | Availability, timezone, staff, bookings, member identity, payment and cancellation flows |
| Wix Events | `events` Astro template | Astro listings, details and event registration via APIs | Ticketing/RSVP, eligibility, member flows, refunds and confirmations |
| Wix Blog | `blog` Astro template | Astro article pages, server-read content and semantic HTML | Rich content, SEO metadata, pagination, comments, visibility, multilingual |
| Wix CMS | `cms-catalog` Astro template | Server-read typed content in Astro routes/components | Dataset permissions, queries, media, localisation, dynamic routes, pagination |
| Wix Forms | `registration` Astro template | Accessible native/React forms backed by authorised Wix APIs | Spam controls, input validation, consents, submissions, notifications, privacy |
| Wix Members | Auth supported by Wix Astro integration; check each backend SDK API | Wix-managed visitor/member identity with site-local member account UI | Registration, login/logout, sessions, protected content, role boundaries |
| Wix Pricing Plans | Wix business solution with API access subject to installed app and scopes | Per-feature SDK integration and custom site-local design | Checkout, subscriptions, plan lifecycle and entitlement APIs |
| Native Wix widget-centric or third-party App Market app | Wix explicitly notes widget-only apps don't work on headless frontends | **Not portable by default**; seek a documented API or alternative | App-by-app vendor evidence, API availability and permission support |

Never claim every Wix App Market app is compatible. Installing an app in Wix does not turn its embedded editor widgets into Astro/React components. In the Wix-managed app marketplace, choose API-providing business solutions.

## SEO, analytics, multilingual and extensions

The Wix Astro integration (not generic React hosting) supports built-in Wix-managed SEO and features including site analytics, multilingual, logs, backend logic and dashboard extensions. Preserve the Wix-generated configuration and use Wix's specific integration guidance. Standard Astro semantic HTML remains useful for page quality, but generic toolkit metadata is **not a replacement for Wix SEO integration**.

## Trust and execution boundaries

- **Server:** Wix-managed Astro SDK integration, backend API modules, request-specific visitor/member/app scopes, server endpoints and extensions. No public hardcoded credentials. Use elevation only when documented and authorised.
- **Browser:** Static Astro HTML and optional React islands with **public, serialisable presentation props**. Avoid importing privileged Wix SDK modules, secrets, full member records, private IDs or raw SDK exceptions.
- **Wix operation:** Site-local `wix build`, `wix preview`, `wix release` and provisioning are explicitly reviewed steps in the **separate site repository**. WHPS CI must never call them.
- **Checkout/cart/booking:** These require real Wix SDK APIs, authentication, domain/redirect configuration and site-local functional testing. A Tailwind/React UI alone does not implement them.
- **Site source:** The Wix CLI project remains the authority for `wix.config.json`, `astro.config.mjs`, `@wix/astro` integration, app extensions, secrets, dependencies, SEO and production deployment.

## Native design freedom

You can change layouts, visual hierarchy, responsive breakpoints, typography, animation, CMS data presentation and React island behaviour with Astro/Tailwind. WHPS supplies neutral semantic primitives and safe contracts, **not a predesigned site**. Do not impose fixed colors or brand elements on downstream sites. The only restrictions are framework/runtime compatibility, accessible HTML, Wix API permissions, security and actual business feature constraints.

## Validated vs unvalidated

**WHPS-004 CI goal:** use synthetic data to build **Astro 5 + React + Tailwind 4** locally on GitHub-hosted Ubuntu. If CI succeeds it validates compile interoperability only. It does **not** exercise Wix-managed Astro runtime, Wix OAuth, production hosting, Wix SDK business apps, payments, member login or SEO.

**Wix production test must be done separately**, in a real site with explicit owner approval and a verified Wix-managed setup. Do not treat upstream documentation as proof of an integrated real app in a specific project.

## Official source references

- Wix-managed Astro path: https://dev.wix.com/docs/go-headless/get-started/choose-your-development-path
- Wix Astro setup/version constraint: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project
- Wix Astro templates: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/astro-templates
- Wix SDK setup/auth: https://dev.wix.com/docs/api-reference/articles/sdk-setup-and-usage/set-up-a-wix-client
- Wix app/API-vs-widget limitation: https://dev.wix.com/docs/go-headless/project-management/add-apps-to-a-project
- Wix frontend SDK modules not available for Headless: https://dev.wix.com/docs/sdk/frontend-modules/about-frontend-modules
- Wix managed SDK: https://dev.wix.com/docs/go-headless/wix-managed-headless/develop-your-project
- Astro React integration: https://docs.astro.build/en/guides/integrations-guide/react/
- Astro Tailwind: https://docs.astro.build/en/guides/styling/
- Tailwind with Astro: https://tailwindcss.com/docs/installation/framework-guides/astro

**The Wix frontend SDK modules designed for Wix-hosted site/editor environments are not the supported Headless SDK route.** Use appropriate Wix SDK backend modules in the actual Wix-managed Astro integration.
