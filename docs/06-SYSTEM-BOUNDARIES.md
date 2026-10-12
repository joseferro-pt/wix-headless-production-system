# System vs website repository — boundaries

## System owns
- Reusable operating policies and `AGENTS.md` for the **toolkit itself**.
- Schemas, validators, CLI tooling, tests, synthetic fixtures and project blueprints.
- Compatibility references, system roadmap, decisions, releases and migration guides.

## Website repository owns
- Original Wix prompt and ZIP; actual `wix.config.json`, site ID and OAuth client ID.
- Site code, content, design tokens, assets, branding, legal policies and business brief.
- Wix resource registry, desired/observed state snapshots, decisions, work packets, QA evidence and releases.
- Deployment secrets in a secure environment, never in Git.

## Do not cross the boundary
- Never commit a real site ID, Wix resource ID, project ZIP, customer name, client asset or production screenshot to WHPS.
- Never put client projects in subdirectories or Git submodules of WHPS.
- Never run authenticated Wix deployment or business-data mutation from WHPS CI.
- Never make the latest toolkit commit a mandatory floating dependency for live websites; adopt explicit tags.
- Real pilot findings belong to the pilot site's own repository or a separately controlled issue, not this toolkit.

## Example consumer relationship
WHPS release -> explicit adoption in Site A repository; WHPS release -> explicit adoption in Site B repository.
Each consumer remains independently deployable and can upgrade the WHPS version at a different time.

## History note
The initial WHPS v0.1 commit included one site-specific pilot report. Removing it from the current tree does not erase it from public Git history. Do not rewrite public history without an explicit, separately reviewed decision.
