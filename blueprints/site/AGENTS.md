# Website AGENTS.md — template

This template belongs in a **single website repository**, not the WHPS production-system repo.

## Authorities
1. Explicit business requirements and accepted decisions.
2. Original Wix handoff and the actual website-local `wix.config.json`.
3. Current Wix Headless skill, SDK and CLI documentation.
4. This site's approved brief, designs, content, Wix registry and tests.
5. The adopted tagged WHPS release and its reusable guidance.

## Site operation
- Read the existing Wix binding and backend state before generating resources.
- Never create a replacement Wix site when this repository is already bound to one.
- Keep all real Wix IDs, site artifacts, business facts, design files, code and release records **in this repository**, never upstream in WHPS.
- Verify source, build output, integration and permissions before a production release.
- Keep secrets in secure environment variables, never Git or logs.
- Record the toolkit version in a site-local version record and upgrade deliberately.

## Deployment
Build and release only from this website's own project checkout, following the current Wix instructions. Never deploy from the WHPS toolkit repository.
