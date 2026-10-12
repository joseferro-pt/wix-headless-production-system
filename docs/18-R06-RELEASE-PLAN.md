# 18 — WHPS-R06 · v0.2.0 hardening and publication plan

**Status:** implementation proposed for PR review; `v0.2.0` is NOT published unless GitHub shows a verified annotated tag and GitHub Release. Existing `v0.1.0` is immutable.

## Candidate scope

- WHPS-002 merged offline bootstrap creating an independent local site Git checkout; never overwrites existing directories or touches Wix.
- WHPS-003 merged read-only desired/observed resource planner, with exact identifiers, completeness scoping, review-only proposals and separate output schema.
- R06 corrections: duplicate desired type/name requests block rather than generate competing create proposals; generated site `whps.lock.json` v2 binds to actual checkout SHA/tag, not historical foundation SHA.
- Release engineering: single owner-dispatched `.github/workflows/publish-release.yml` accepts version, source_sha and an explicit matching approval string. It never runs on push or pull request.
- Source-only Apache-2.0 distribution; no Wix accounts, site credentials, customer records, remote GitHub site repositories or deployments.

## Lock semantics and migration

`whps.lock.json` v1 named `toolkitRelease: v0.1.0` while the bootstrap generator itself was not in that published tag. v2 corrects this by recording:

- `toolkitSource.repository`, `toolkitSource.commit`: exact 40-character Git revision which created the workspace.
- `toolkitSource.tag`: exact local SemVer tag pointing to HEAD, or null.
- `toolkitSource.state`: `tagged-checkout-unverified` or `unreleased-checkout`.
- `toolkitSource.releaseVerification`: always `not-performed`. **Never treat a local tag as a confirmed GitHub Release.**
- `foundationBaseline`: historic v0.1.0 tag and commit only, not the generator version.
- `generator.sourceCommit`, `generator.sourceTag`: same exact source identity as toolkitSource.
- `manifestSchemaVersion`: 0.1.0, separately versioned.

No automatic upgrade or mutation of site-local v1 locks is provided. Each website independently reviews and verifies the release, then records adoption/migration evidence.

## Gate sequence

1. **G0/G1:** review this PR, v0.2.0 notes and declared breaking lock change. Publish decision remains owner-controlled.
2. **G2:** run full Node/Python tests, tracked-content security guard, release readiness, bootstrap both modes, planner JSON Schema on a synthetic example. All in toolkit CI, no Wix access.
3. **G3:** report only Node 22, Python 3.12 and GitHub Ubuntu CI as tested. Git CLI is required for bootstrap; macOS and Windows not in matrix. No Wix runtime compatibility claims.
4. **G4:** explicitly approve `v0.2.0` against the **full SHA of the final reviewed merge commit**, after verifying green main `contracts` and CodeQL.
5. **G5:** owner manually dispatches the generic workflow on `main`, entering `v0.2.0`, exact approved SHA and `PUBLISH-v0.2.0`. No auto-publish on merge. Workflow checks that main has not moved, reruns offline checks and creates (or safely verifies) annotated tag and GitHub Release without rewriting any tag.
6. **G6:** independently check Git tag object targets that same commit, GitHub Release is published and contains the SHA and CI evidence, and code at that tag passes source provenance smoke tests. Record release URL and workflow outcome here or in the Control Room **after** actual publication.

The release workflow has read-only default token permissions and scoped `contents: write` only for the manually triggered publication job; other WHPS CI remains read-only.

## Known exceptions

- The repository ruleset list was empty in the previous inspection. Classic branch protection cannot be verified through current integration permissions. Configure protections through the owner's GitHub UI and record actual rule IDs separately.
- Confidential vulnerability intake remains unverified. See [SECURITY](../SECURITY.md).
- A historical project-specific report remains accessible in older commits; no Git history rewrite is authorised by R06.
- Dependency ranges and hosted Ubuntu runners do not create a byte-reproducible build or guarantee external Wix compatibility.
- A metadata-only plan is not a guarantee of observed resource completeness and never authorises backend operations.

## Exit condition

R06 implementation is complete when PR CI and CodeQL pass and a reviewer approves the exact candidate. **Release completion requires a later, separately authorised and verified v0.2.0 tag and GitHub Release.** Do not begin WHPS-004 assuming publication occurred merely because R06 merged.

See [release governance](11-RELEASE-GOVERNANCE.md), [roadmap](05-ROADMAP.md), [bootstrap](16-SITE-WORKSPACE-BOOTSTRAP.md), [planner](17-READ-ONLY-RESOURCE-PLANNER.md), [candidate notes](releases/v0.2.0.md), [Control Room](CONTROL-ROOM.md).
