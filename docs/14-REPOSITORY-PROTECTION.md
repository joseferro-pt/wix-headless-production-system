# 14 — Repository protection plan

## Current evidence

During R04/R05 inspection, GitHub reported **zero repository rulesets**. The connector cannot confirm classic branch-protection settings through its current permissions; treat those as **unverified**, not disabled. This document proposes settings but does not apply them.

## Recommended `main` rules

- Require changes via pull requests; avoid direct commits to `main` where GitHub settings permit.
- Require at least **one approving review** before merge, with changes re-reviewed after substantial updates.
- Require the successful GitHub Actions `contracts` job at the exact merge candidate/commit where supported; inspect check names in GitHub before configuring a required status context.
- Block force pushes and branch deletion; restrict bypass to a documented emergency process.
- Use read-only default workflow token permissions. Grant narrowly scoped permissions only to specific future release jobs.
- Never add a Wix site token, site-secret or client credential to WHPS Actions secrets as part of protection setup.
- Prefer preventing force-updates/deletion of published `v*` tags using an appropriate tag ruleset when available.

## Release governance

- Only the repository owner or an explicitly delegated maintainer approves version tags and GitHub Releases.
- Keep publication manual at first. Automating release distribution later needs explicit permission scoping, evidence checks and a separate reviewed workflow.
- Do not bypass tests simply because a documentation PR changes only text. Security/agent instructions may be as consequential as code.

## Manual verification procedure

1. Open the repository **Settings → Rules → Rulesets** (or branch protection, depending on available UI/features).
2. Inspect rules on `main` and `v*` tags; apply the approved policy if the account's plan permits it.
3. Confirm the required status check name, PR review count and permitted bypass roles in GitHub.
4. Test with a non-destructive PR; do not force-push or delete a production branch/tag to test safeguards.
5. Record the exact rule IDs and approval in a future system decision or PR; update this document based on observed state.

These are **proposals**, not applied GitHub settings. Use [release governance](11-RELEASE-GOVERNANCE.md) and [security](../SECURITY.md) together.
