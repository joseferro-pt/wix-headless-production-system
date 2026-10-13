# WHPS-004 · Astro-first technical reference

**Scope:** Synthetic, generic Astro 5 reference components for independent Wix-managed Headless websites. This is **not a Wix project**, not a deployable website repository, and contains no Wix configuration, app credentials, or site data.

## Choices

- **Astro 5** owns server-rendered pages, layouts, semantics, SEO-compatible HTML and most content.
- **React 19** with `@astrojs/react` is optional. Use small hydrated islands (`client:idle` and other explicit strategies), not a mandatory React SPA.
- **Tailwind 4** uses `@tailwindcss/vite`. CSS custom properties and utilities are controlled by **each site**, never a WHPS brand design system.
- **Wix-managed Astro** remains the authoritative site-local integration. Its generated `astro.config.mjs`, `wix.config.json`, SDK authentication, extensions, infrastructure and deploy pipeline belong only in each site's independent repository.
- Current Wix linking documentation supports **Astro 5 or Astro 7** and does not support Astro 6 (checked 13 October 2026). This WHPS v0.2.1 reference deliberately targets **Astro 5**; Astro 7 integration needs separate framework/React/Tailwind validation.

## Synthetic local compile

```sh
cd frontend/astro-primitives
npm install
npm run build
npm run dev
```

The local build demonstrates only **Astro + React + Tailwind** compile compatibility. No Wix SDK, Wix CLI, server integration, authenticated member journey, widget, checkout or live deployment has been tested.

## Adoption in a separate Wix-managed Astro project

1. Use the official Wix-managed Astro project creation flow and choose a Wix business template for the required apps (Stores, Bookings, Events, Blog, CMS, Forms) or use a blank template for design freedom. If linking existing Astro, verify it is unbound and Astro 5 before using Wix CLI.
2. Preserve the **Wix-generated** Astro config and integrations. **Never replace** the project's Wix adapter/auth/SEO/extension configuration with the standalone `astro.config.mjs` shown here.
3. Enable React via `@astrojs/react` only if a component needs client interactivity. Add Tailwind 4 via the official Vite plugin and import your site-owned styles. Check dependency and plugin compatibility in the actual Wix-generated project.
4. Copy/adapt selected `src/components`, `src/layouts`, `src/islands`, `src/styles` and the read-only `src/server/reader.ts` contracts into the **site repository**; no WHPS site migration or provisioning happens automatically.
5. Implement the site's own SDK-backed `ReadOnlySource<T>` in Wix-managed Astro server logic using current official backend module docs and the correct visitor/member identity. No browser-side admin SDK/auth/secret should be serialised into React props.
6. Run the site-local build, Wix preview, SEO checks and app-by-app Wix APIs and checkout/member journeys before any separately authorised `wix release`. Toolkit CI never deploys.

### Official references

- Wix Astro 5: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project
- Wix business templates: https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/astro-templates
- Wix app limitations: https://dev.wix.com/docs/go-headless/project-management/add-apps-to-a-project
- Astro React: https://docs.astro.build/en/guides/integrations-guide/react/
- Tailwind Astro: https://tailwindcss.com/docs/installation/framework-guides/astro
- WHPS capability matrix: [Wix Astro compatibility](../../docs/20-ASTRO-WIX-COMPATIBILITY.md)
- WHPS-004 acceptance: [Frontend primitives](../../docs/21-WHPS004-FRONTEND-PRIMITIVES.md)
