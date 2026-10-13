# 19 — WHPS-R06.1 · Post-release provenance and patch plan

**Status:** Merged through PR #15; **v0.2.1 not published**. WHPS `v0.2.0` is published and immutable. A `v0.2.1` patch is proposed, not asserted. Its source candidate also includes merged WHPS-004 frontend reference components, which the release notes must disclose.

## Authority and scope

The owner-approved R06 `v0.2.0` release was published on 12 October 2026:
- Published GitHub Release: https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.0
- Source commit: `d17abe627f27808611218d0d2f01dd977030913a`
- Annotated tag object: `98db3fba737581a4726ae46876a499113ad784f9`
- Independently verified manual publication workflow: https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38277419984
- Exact-source validation: https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38276246716
- Exact-source CodeQL: https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38276246615

This information reconciles post-release status without changing or repointing `v0.2.0`.

## R06.1 technical correction

Published v0.2.0 records `git rev-parse HEAD` and local matching version tags in a site-local `whps.lock.json` v2, but does not check for uncommitted source changes or the Git checkout's configured origin.

R06.1 adds a fail-closed local preflight in `scripts/bootstrap-site-workspace.mjs`:

1. Require a syntactically valid 40-character Git `HEAD`.
2. Require `git status --porcelain=v1 --untracked-files=all --ignore-submodules=none` to be clean, rejecting staged, unstaged, untracked and submodule modifications.
3. Require `git remote get-url origin` to match one of the explicitly approved canonical WHPS HTTPS/SSH spellings. A missing origin, fork or other URL blocks the bootstrap.
4. Reject more than one local matching SemVer release tag on that HEAD.
5. Keep `toolkitSource.releaseVerification: not-performed`; neither a local remote configuration nor a local tag proves authenticated ownership, release publication or unchanged third-party dependencies.

These checks run **before any website output is created**, protecting separate website repositories from an inaccurately attributed generator. No site identity, Wix API, website code, or existing repository is modified.

## Version and compatibility

- Proposed patch `v0.2.1` retains `whps.lock.json` `lockVersion: 2`, `manifestSchemaVersion: 0.1.0` and the read-only planner's `planVersion: 1`.
- The patch **tightens** bootstrap preconditions: dirty checkouts, checkout archives without an `origin`, and noncanonical origins are rejected, whereas published v0.2.0 accepted them. This restriction must be explicit in the patch release notes and adoption guidance.
- Offline source distributions without full Git metadata cannot use the bootstrap CLI under the strict provenance requirement. Website operators should use a clean Git clone of the reviewed WHPS release.
- Canonical remote matching relies on **local Git configuration only**; it is not cryptographic upstream attestation. Exact tag/source verification against the GitHub Release remains a separate site adoption step.
- Test evidence on GitHub-hosted Ubuntu and the published baseline Node 22, Python 3.12 and Git CLI does not claim untested OS support.

## Review and publication gates

1. Review the R06.1 PR, source and tests, including synthetic dirty/untracked/staged and spoofed-origin regressions.
2. Confirm successful exact-head PR validation and CodeQL, and no website/source files or secrets entering WHPS.
3. Merge only with explicit owner approval. Verify the **new full main merge commit SHA** and passing `contracts` and CodeQL **push** runs after merge.
4. With separate owner release approval, dispatch `.github/workflows/publish-release.yml` **on main**, entering `version=v0.2.1`, the exact approved main SHA and `approval=PUBLISH-v0.2.1`. **Do not trigger before the main SHA is final**.
5. Confirm that the annotated `v0.2.1` tag points to that approved SHA, GitHub Release is public and its notes record the SHA, exact-source CI and publication job. Do not infer publication from a merged PR or passing offline readiness.
6. Record the evidence in the Control Room and update release statuses in a subsequent reviewed documentation correction if necessary.

GitHub repository rulesets were unconfigured at the last inspection; classic branch protection and private vulnerability reporting could not be verified via this integration. These are owner-controlled follow-ups. A historical site-specific report in older commits remains an unresolved retention decision. No history rewrite is authorised.

## Exit criteria

**Implementation accepted** means reviewed PR plus successful tests. **R06.1 release complete** requires a separately authorised, independently verified `v0.2.1` tag and GitHub Release. Do not change `v0.1.0` or `v0.2.0`.

See [release governance](11-RELEASE-GOVERNANCE.md), [site adoption](07-PROJECT-ADOPTION.md), [bootstrap contract](16-SITE-WORKSPACE-BOOTSTRAP.md), [roadmap](05-ROADMAP.md), [Control Room](CONTROL-ROOM.md) and [candidate notes](releases/v0.2.1.md).
