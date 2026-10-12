# 06 — System and website repository boundaries

WHPS is a reusable toolkit, **not** a site checkout, agency client register or deployment system for every client. See [authority](10-AUTHORITY-AND-DECISIONS.md), [terminology](09-TERMINOLOGY.md) and [project adoption](07-PROJECT-ADOPTION.md).

## WHPS owns

- System-level agent rules, operating standards, validation scripts, schemas and synthetic fixtures.
- Generic website blueprints, tests, compatibility notes and system-only decisions.
- Toolkit commits, PRs and, **once formally published**, tagged releases.

## Every independent website repository owns

- Its original Wix handoff or other verified origin, Wix project files, `wix.config.json`, site/client IDs and approved business facts.
- Site-specific source code, design, content, integrations, resource registry, QA and release evidence.
- Its own permissions, operator approvals, recovery plans and documented adoption of a particular WHPS revision.

Secrets belong in a suitably protected environment, **never** in Git, chat transcripts or toolkit tests.

## Enforce the separation

- Do not commit real client identifiers, client business records, website archives, production screenshots or site-local configuration to WHPS, even as a pilot.
- Do not nest client repositories within WHPS and do not use WHPS submodules to collect them.
- WHPS CI is read-only, synthetic and cannot deploy or mutate a client Wix site.
- Use an exact WHPS **commit SHA** for development adoption today. After a published toolkit release exists, a site may adopt a reviewed **tag and SHA**. Never depend blindly on a floating `main` branch.
- Keep real pilot findings in the corresponding site repository. Generic lessons can be promoted into WHPS only after removing identifiers and verifying permission.

## Historical qualification

A project-specific pilot report was included in the **original public Git history**, although removed from the present `main` tree. The current tracked-content scanner does **not** erase or inspect every historical commit. Historical removal would require an independently authorised security/privacy review and careful Git history management.
