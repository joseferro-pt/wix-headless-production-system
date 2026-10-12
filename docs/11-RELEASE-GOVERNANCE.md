# 11 — Toolkit release governance

## Purpose and scope

This policy concerns versioned **WHPS toolkit distributions**, never Wix website deployments. The toolkit is currently an unpublished development baseline. A merged commit, manifest schema version, or green CI workflow alone **is not** a GitHub Release. R05 will publish the first release only after all approval gates are met.

## Independent version numbers

- **Toolkit version:** Git tag `vMAJOR.MINOR.PATCH` and an accompanying GitHub Release, published deliberately.
- **Manifest schema version:** the `schemaVersion` consumed by validators, currently `0.1.0`. It may change independently of the toolkit tag.
- **Wix CLI/SDK/skill versions:** platform dependencies that must be revalidated in a website environment; the toolkit does not freeze Wix's external contracts.
- **Website version:** entirely within that site's repository and release process. No toolkit release implies a website deploy.

Use [Semantic Versioning](https://semver.org/) as the proposed baseline. Prior to 1.0, an incompatible public interface or schema migration should increment **MINOR** and include a migration note; compatible bug fixes normally increment **PATCH**. Any deliberate MAJOR upgrade should document breaking changes and the support timeline. This is a **proposed release policy**, pending accepted R04 decision; the repository has no tags/releases yet.

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
python3 -m pip install -r requirements.txt
node scripts/check-repository-boundary.mjs
node scripts/check-release-readiness.mjs --policy
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

`node scripts/check-release-readiness.mjs --release --version v0.1.0` performs additional **offline prerequisites**. Until licensing is accepted and a real `LICENSE` is committed, it must **fail closed**. A passing local check never proves CI status, a human decision, platform compatibility, tag integrity or a published release. These require separate recorded evidence.

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
- An incorrect release requires a corrective release/advisory, not silent repointing of a public tag.
- Site repositories adopt a **specific tag plus commit** after release, independently. Toolkit updates do not fan out to sites automatically.
- For severe security problems, follow [SECURITY](../SECURITY.md) and the separate incident procedure; public history deletion is never a routine release step.

## Deliberately pending decisions

1. **Licence:** [decision record](13-LICENSING-DECISION.md) is proposed, not accepted. No `LICENSE` exists yet.
2. **GitHub rulesets:** [protection proposal](14-REPOSITORY-PROTECTION.md) is documented but not applied.
3. **First release version:** R05 must select and approve a toolkit tag independently from schema version `0.1.0`.
4. **Maintenance window:** not promised until first release notes establish support expectations.
