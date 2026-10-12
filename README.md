# Wix Headless Website Production System

**Version:** 0.1.0 — foundation baseline (separation refactor proposed)  
**Date:** 2026-10-12  
**Scope:** repeatable delivery for Wix-managed Headless websites. Not an individual client website.

## Repository boundary

This is a **tooling and standards repository**, not a website repository, project portfolio, client directory, or production Wix integration. It contains only reusable source, schemas, policies, blueprints, documentation and synthetic test fixtures. It must not carry real Wix site IDs, client business details, site code, site-specific audit reports, raw handoffs or deployments. Each website lives in its **own independent repository** and adopts a tagged WHPS release.

The system's GitHub Actions test the **toolkit itself** without reading or mutating any live Wix site. Site code, Wix resources and site releases belong to the corresponding website repository. See `docs/06-SYSTEM-BOUNDARIES.md` and `docs/07-PROJECT-ADOPTION.md`.

## Purpose

Make Wix's generated prompt the **immutable technical handoff**, not a substitute for the business brief. Apply a reproducible governance and delivery overlay while preserving the official Wix skill, existing site identity, project structure, and CLI workflow.

## Start here

1. Read `AGENTS.md` and `docs/CONTROL-ROOM.md`.
2. Read `docs/01-OPERATING-MODEL.md` and `docs/02-WIX-HANDOFF.md`.
3. Install validator dependencies with `python3 -m pip install -r requirements.txt`. For a Wix-generated website, save **the exact original Wix prompt** as a plain UTF-8 text file, then run:

   ```sh
   node scripts/intake-wix-handoff.mjs path/to/wix-prompt.txt ../website-project
   node scripts/validate-manifest.mjs ../website-project/site.manifest.json
   ```

4. Inspect the **actual** Wix-downloaded ZIP and the `wix.config.json` it contains before development; compare `siteId` / `appId` with the handoff. Do not initialise a fresh Wix project over a pre-bound project.
5. Complete the project-specific business brief using `templates/BUSINESS-BRIEF.md` and the phases in `docs/01-OPERATING-MODEL.md`.
6. Follow the currently applicable official Wix skill for implementation and release. Use `docs/04-QA-RELEASE.md` for additional QA and audit requirements.

## Contents

- `AGENTS.md`: AI agent instructions and source-of-truth hierarchy.
- `docs/CONTROL-ROOM.md`: decisions, baseline and work packets.
- `docs/01-OPERATING-MODEL.md`: stages, gates, and ownership.
- `docs/02-WIX-HANDOFF.md`: first-run and existing-project entry routes.
- `docs/03-WIX-RESOURCE-GOVERNANCE.md`: resource registry and safe backend changes.
- `docs/04-QA-RELEASE.md`: source verification, test matrix and release report.
- `docs/05-ROADMAP.md`: work packages and next iteration.
- `docs/06-SYSTEM-BOUNDARIES.md`: enforceable system/site separation.
- `docs/07-PROJECT-ADOPTION.md`: how a separate website repository adopts a system release.
- `blueprints/site/`: generic, synthetic project-local agent and control-room examples.
- `schemas/`: JSON Schemas for project and Wix resource manifests.
- `templates/`: business brief, decision record, work packet, release report.
- `scripts/`: read-only prompt parser, offline manifest validation, and read-only ZIP auditor.
- `tests/`: executable examples for parser/validator.

## Initial boundaries

- **This package does not deploy or create a Wix site.** It is the production system, not a frontend project.
- **This repository is already the system's canonical GitHub source.** Website repositories must be provisioned independently.
- **This package does not replace official Wix skills or SDK docs.** Re-check live docs during each implementation run; they may change independently.
- **No Wix secrets** belong in project manifests, files, issues, chat transcripts, or Git history. A public client ID is not a secret, but credentials/tokens are.

## Official references

- Primary skill: https://wix.com/headless/skill.md
- Public Wix skill source: https://github.com/wix/skills/blob/main/skills/wix-headless/SKILL.md
- Wix Headless AI toolkit: https://dev.wix.com/docs/go-headless/get-started/headless-ai-toolkit
- Wix CLI reference: https://dev.wix.com/docs/wix-cli/command-reference/introduction

## Change control

A change to the **production system** is versioned here. A change to an **individual Wix site** is versioned in that site's repository. Project-specific identity and business content must not be written into these global templates.
