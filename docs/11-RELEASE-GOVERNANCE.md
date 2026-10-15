# 11 — Toolkit release governance

## Purpose and scope

This policy concerns versioned **WHPS toolkit distributions**, never Wix website deployments. The earlier [`v0.1.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.1.0) and [`v0.2.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.0) releases remain immutable; current [`v0.2.1`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1) was published and verified on 13 October 2026 against `877736282def3631a3fad5d368e3098aadac040f`. See [publication and WHPS-004 acceptance](22-WHPS004-CLOSURE-AND-V021-PUBLICATION.md). A merged commit, manifest schema version or green CI workflow alone **is not** a GitHub Release; future publications still require all acceptance gates.

## Independent version numbers

- **Toolkit version:** Git tag `vMAJOR.MINOR.PATCH` and an accompanying GitHub Release, published deliberately.
- **Manifest schema version:** the `schemaVersion` consumed by validators, currently `0.1.0`. It may change independently of the toolkit tag.
- **Wix CLI/SDK/skill versions:** platform dependencies that must be revalidated in a website environment; the toolkit does not freeze Wix's external contracts.
- **Website version:** entirely within that site's repository and release process. No toolkit release implies a website deploy.

Use [Semantic Versioning](https://semver.org/) as the proposed baseline. Prior to 1.0, an incompatible public interface or schema migration should increment **MINOR** and include a migration note; compatible bug fixes normally increment **PATCH**. Any deliberate MAJOR upgrade should document breaking changes and the support timeline. This policy was implemented in R04 and applied to published v0.1.0. The annotated tag and GitHub Release were independently verified.

## Site adoption is separate from toolkit distribution

From WHPS-006 onward, the [distribution/adoption contract](25-WHPS006-DISTRIBUTION-ADOPTION.md) records exact annotated tag, source SHA and public Release evidence, then leaves adaptation and approval to an **independent** website repository. Catalogued historical releases do not prove current tag integrity: perform a fresh GitHub verification. The site maintains its own `whps.adoption.json` **alongside**, not in place of, the initial v2 `whps.lock.json`. WHPS-006 is unreleased until a new toolkit release is approved and published; its planner does not authorise Wix work or site deployment.

## Release lifecycle and evidence

| Gate | Required evidence | Owner |
|---|---|---|
| G0 · Decision | Licence choice explicitly accepted; distribution rights and scope recorded | Repository owner |
| G1 · Candidate | Approved version and scope, clean reviewed commit, changelog/release-notes draft | Maintainer |
| G2 · Validation | `contracts` CI passed for the exact commit, offline tests and boundary guard; known limitations listed | Maintainer/reviewer |
| G3 · Compatibility | Tested runtimes listed; upstream Wix compatibility claims labelled verified or unverified | Maintainer |
| G4 · Approval | Release go/no-go and exception approvals recorded; no site deployment implied | Repository owner |
| G5 · Publish | Annotated `vX.Y.Z` tag on approved commit and GitHub Release with source SHA, notes and checksums for any assets | Maintainer |
| G6 · Verify | Confirm tag resolves to approved commit, GitHub Release is public as intended, notes and attached assets match | Reviewer |

Do not tag or publish before gates G0–G4. Release assets are optional; if supplied, publish SHA-256 checksums. Do not publish client source archives or any site-linked identities.

## Local preflight commands

```sh
python3 -m pip install -r requirements.txt -r requirements-dev.txt
node scripts/check-repository-boundary.mjs
node scripts/check-release-readiness.mjs --policy
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

`node scripts/check-release-readiness.mjs --release --version v0.1.0` performs additional **offline prerequisites**. It must **fail closed** if an accepted licence or matching release-specific changelog is missing. A passing local check never proves CI status, a human decision, platform compatibility, tag integrity or a published release. These require separate recorded evidence.

## v0.3.0 candidate and separate approval

The [v0.3.0 release plan](26-V030-RELEASE-PLAN.md) proposes the already merged WHPS-005 and WHPS-006 packets for a minor release, with unchanged manifest and bootstrap schema versions. The preparation and merge of release notes **cannot satisfy G4 owner publication approval**; that gate must be recorded after the exact final main SHA and successful main push checks are independently verified. The existing generic publisher requires an explicit `PUBLISH-v0.3.0` input from an authorised operator. The historical release catalog must not list v0.3.0 as published before its GitHub release is verified.

## Version-agnostic manual publisher

From R06 onward, the [manual release workflow](../.github/workflows/publish-release.yml) is the established publication mechanism, successfully exercised for v0.2.0 and v0.2.1. It accepts approved SemVer, full source SHA and exact typed `PUBLISH-vX.Y.Z` authorisation. It requires the candidate be the current `main` commit with successful exact-SHA validation and CodeQL push runs, checks version-specific release notes, reruns offline contracts and synthetic site bootstrap/planner smoke tests, and creates or verifies an immutable annotated tag and public GitHub Release. A skipped job, merged PR, or green CI run **is not publication**.

The historic [v0.1.0 recovery workflow](../.github/workflows/publish-v0.1.0.yml) must not be repurposed for future releases. Follow the [R06 acceptance plan](18-R06-RELEASE-PLAN.md). No tag or live Wix site is modified by this documentation.

## Release record minimum

- Tag and full commit SHA; relationship to schema version.
- Scope, major changes, migration notes and breaking changes.
- Current tested runtime matrix, known Wix version assumptions and untested environments.
- `contracts` workflow URL and outcome on release commit; security/boundary checks.
- Accepted licence and recorded go/no-go authority.
- Known defects, security caveats and support policy.
- Artifact names and SHA-256 checksums (if any), GitHub Release URL and verification outcome.

## Change control and reversibility

- All system modifications use PRs against `main`, no direct production site actions.
- Prefer fast-forward-compatible changes and reviewed merges; do not rewrite published release tags.
- An incorrect release requires a corrective release/advisory, not silent repointing of a public tag. For R05.1 use the [explicit recovery procedure](15-PUBLICATION-RECOVERY.md); a green skipped publication job is not a published release.
- Site repositories adopt a **specific tag plus commit** after release, independently. Toolkit updates do not fan out to sites automatically.
- For severe security problems, follow [SECURITY](../SECURITY.md) and the separate incident procedure; public history deletion is never a routine release step.

## Deliberately pending decisions

1. **Licence:** [decision record](13-LICENSING-DECISION.md) accepted; Apache-2.0 terms committed in `LICENSE`.
2. **GitHub rulesets:** [protection proposal](14-REPOSITORY-PROTECTION.md) remains documented but unimplemented. This open governance exception is disclosed; it does not authorise force pushes.
3. **First release version:** `v0.1.0` is published and distinct from `schemaVersion: 0.1.0`. Future tags require independent approval and verification. The post-publication documentation correction does not alter any published tag.
4. **Support commitment:** only CI-tested runtime versions and documented issues; no website-specific Wix runtime support guarantee.
