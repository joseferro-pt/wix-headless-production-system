# AGENTS.md — Wix Headless Production Protocol

Applies to AI coding agents operating the production system or individual websites created from it. This is an **overlay** on official Wix instructions, not a substitute for them.

## Read order and authority

1. Direct user decisions and explicitly approved requirements for this engagement.
2. Wix-generated original handoff and actual `wix.config.json` for project identity.
3. **Current** Wix Headless skill (`https://wix.com/headless/skill.md`), the linked project-type guides, and current Wix API/CLI docs for implementation semantics.
4. Project-specific accepted manifest, business brief, design specification and decision records.
5. Existing site code, Wix observed state and tests.
6. These reusable production templates.

Where a generic production rule conflicts with a **technical Wix API/CLI contract**, the verified current Wix technical contract wins; record the conflict and adjust our overlay. Where requirements are ambiguous, do not silently promote guesses into business facts.

## Mode routing

- `handoff`: Wix has supplied Site ID, Client ID, skill URL and project download. **Import the supplied project**; do not provision another site.
- `iterate`: existing repository and Wix configuration are present. **Reuse** project config; do not re-`init` or seed duplicates.
- `bring-your-own-frontend`: connect an unbound frontend only after checking if a Wix binding already exists; a fresh Wix project may otherwise be required per current skill.

## Always do

- Preserve original Wix prompt verbatim and record its checksum in the project record.
- Inspect downloaded project files before changing framework, package manager or deployment configuration.
- Compare Wix handoff Site ID with `wix.config.json.siteId`; compare Client ID with `wix.config.json.appId` when available. Halt on mismatch.
- Use an explicit business brief; distinguish `confirmed`, `proposed` and `unknown` values.
- Audit existing Wix apps, forms, CMS collections, services, and other resources before mutating them.
- Keep a Wix resource registry of observed IDs and intended operations. Existing Wix business data is authoritative; registry entries are references, not a shadow database.
- Use idempotent read/plan/apply operations; avoid duplicate entities.
- Keep Wix tokens/CLI session material out of chat, stdout logs, source control and generated artifacts.
- Keep source, content, design tokens and Wix adapters separable; do not impose a framework over the supplied Wix template without a documented reason.
- Run the supported build and contract checks; use one intentional final release, never release just to discover whether a build works.
- Return observed outcomes and blockers, not assumed success.

## Approval boundaries

- A newly created Wix site is not authorized merely because a blank Wix project was supplied.
- For an **already-published live site**, require an explicit production-release approval, unless the user's current request unambiguously authorizes publishing now.
- Destructive Wix changes (delete, overwrite client data, replace collections/schema, remove apps) require explicit confirmation and a recovery plan.
- Seed/sample data must be clearly distinguished from real business data; never fabricate testimonials, opening hours, addresses, pricing or certifications.
- No paid service, domain purchase or paid generation without authorization. Respect the current Wix skill's cost controls for generated images.

## Status language

Use only states supported by evidence: `planned`, `prepared`, `implemented`, `build-passed`, `previewed`, `released`, `verified`, `blocked`. `Implemented` is not `released`. A generated ZIP is not a deployed website.

## Release record

A release report must identify: source commit/tag, site ID, build result, deployment command outcome, actual live URL, Wix dashboard link, backend resources changed, checks run (and not run), remaining blockers, and recovery procedure.

## Implementation caveats

- The official Wix-managed Headless flow distinguishes create/connect/iterate. Follow the exact current flow for the actual project.
- If the supplied ZIP already contains `wix.config.json`, do not run `npm create @wix/new init` merely because the local working directory was empty.
- Wix's official managed flow currently favors **release once at the end**. Preview is a distinct optional review artifact after a successful build, not a substitute for a final release. Do not add repeated release cycles.
- For non-Astro frameworks, use the documented OAuth client path. For Wix-managed Astro integration, don't add a redundant manual OAuth client.
