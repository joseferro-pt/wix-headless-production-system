# 15 — R05.1 publication recovery and verification

**Scope:** WHPS toolkit release only. No Wix website deployments, customer repositories or live Wix credentials.

## Observed incident (12 October 2026)

- The Apache-2.0 R05 candidate was merged as `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7` in PR #6.
- `Validate production protocol` passed for that exact source commit (run `38252364682`). The original publisher then failed during `git push origin refs/tags/v0.1.0` with GitHub reporting `fatal error in commit_refs` (run `38252394032`).
- Subsequent commits added CodeQL and an empty funding template; those revisions are **not** the previously approved R05 release candidate.
- Subsequent publisher runs either failed to confirm the expected `main` head or passed without executing publication steps. At the time of the original R05.1 review, the API showed no `refs/tags/v0.1.0` and no GitHub Releases. Publication was subsequently recovered and verified.
- No root cause for GitHub's internal tag push rejection has been established. This procedure uses the documented GitHub REST API as an alternative; its success remains subject to actual GitHub permissions and server behaviour.

## Recovery design

The existing `.github/workflows/publish-v0.1.0.yml` is replaced by a **manual-only `workflow_dispatch` workflow**. A normal push or CI completion does not publish a release. The repository owner runs it explicitly on `main` and enters the exact acknowledgement `PUBLISH-v0.1.0`.

The job must:

1. Check out the approved source commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7`; verify it remains an ancestor of `main`.
2. Query GitHub Actions and require a successful `Validate production protocol` push run on that exact SHA.
3. Rerun the toolkit's offline release gate and synthetic checks against the approved source snapshot.
4. Create an **annotated** Git tag via the GitHub Git Tags and Git Refs REST endpoints if absent; never move or overwrite an existing ref.
5. If an annotated tag already exists, resolve its tag object and require its target commit to be exactly the approved SHA. Reject lightweight or mismatched tags.
6. Publish a GitHub Release only if absent, and verify that it is public, tagged `v0.1.0`, and its notes contain the approved source SHA. A previously created tag with an incomplete release can be recovered without rewriting the tag.
7. Report the release URL and preserve a verification record in the next system-only governance update.

**If GitHub again rejects the tag-reference creation**, stop. Do not change tag targets, force-push, invent a successful release, or try creating a release at an arbitrary new commit. Review the job logs and repository permissions with the owner. A release created manually through GitHub's Releases UI is a possible separate approved fallback, but verify annotated-tag requirements before claiming G5/G6 acceptance.

## Verified publication outcome (12 October 2026)

The explicit [R05.1 recovery workflow](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38257202876) completed successfully, including both the annotated-tag and GitHub Release steps. The published [`v0.1.0` release](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) is neither a draft nor a prerelease. Annotated tag object `d1bed61f5f5b731644cb1b0821129514a78c6a93` points to the exact approved source commit `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7`, which passed [CI](https://github.com/joseferro-pt/wix-headless-production-system/actions/runs/38252364682).

**G5 and G6 are satisfied.** The later `main` maintenance commits (including the recovery workflow itself) are not contained in that immutable release. The recovery workflow should not be rerun for routine maintenance or a new version.

## Historical operator procedure (already completed)

1. Verify the PR was merged and the new `main` CI run succeeded.
2. Go to **Actions → Recover and verify WHPS v0.1.0 → Run workflow**.
3. Choose branch **main** and enter `PUBLISH-v0.1.0` as the approval input.
4. Open the resulting run. A green run counts only if the *Recover annotated tag* and *Publish GitHub Release* steps both executed successfully. A skipped workflow or job does not count.
5. Open the repository GitHub Release `v0.1.0`; verify the annotated tag resolves to the approved SHA and the release is published rather than draft.
6. Record the actual tag object SHA, release URL, workflow URL and source SHA in the Control Room. At that point, and only then, mark R05/R05.1 complete.

## GitHub settings and outstanding risks

- GitHub reported **zero repository rulesets** during the R05.1 review. Classic branch protection could not be inspected with the current connector. See [repository protection](14-REPOSITORY-PROTECTION.md) for manual owner settings; no changes are claimed here.
- Verify GitHub private vulnerability reporting via repository **Settings → Security → Code security and analysis** (wording varies by UI). `SECURITY.md` does not substitute for a private contact channel.
- Historical public commits still contain a project-specific pilot report, removed from the current source tree. Assess confidentiality and any history-cleanup action separately. Do not rewrite history during release recovery.
- The original `v0.1.0` source snapshot includes the obsolete automatic publisher. The revised recovery workflow is an operational correction on a newer `main` commit, not a silent modification of the approved release contents. Future patch releases should incorporate maintenance corrections.

## Acceptance gate

**Gate satisfied:** PR #8 merged, the recovery workflow succeeded, and the annotated tag and published GitHub Release match `802acf1b536b502fcacdffc1d6b7ce371aa2d3f7`. Refer to the verified evidence above.
