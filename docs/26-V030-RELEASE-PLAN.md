# 26 — WHPS v0.3.0 · Release Preparation and Separate Owner Approval

**Stage:** Candidate preparation; **publication approval: not granted by preparation**.  
**Version:** `v0.3.0`, proposed next minor release after verified `v0.2.1`.  
**Scope:** WHPS-005 ([PR #20](https://github.com/joseferro-pt/wix-headless-production-system/pull/20)) and WHPS-006 ([PR #24](https://github.com/joseferro-pt/wix-headless-production-system/pull/24)), plus the reviewed release-specific documentation and automated checks.  
**Versioned code:** existing source in `main` plus release-preparation PR. No unpublished dependency change, unrelated maintenance packet, website repo or Wix infrastructure belongs in this candidate.

## Release authority

- A user request to **prepare** this release authorises release-note preparation and an ordinary reviewed PR; it does **not** authorise creating an annotated release tag, publicly publishing the GitHub Release or deploying any Wix site.
- The version and included packet scope are proposed for review. G4 requires a distinct owner **PUBLISH** decision after exact source SHA and required main checks are known. No claim of approval is made until this happens.
- No change to previous release tags, GitHub Releases, historical v2 bootstrap locks, Wix-managed project configuration or user data is permitted.
- The owner must separately evaluate the known limitations, including unverified real Wix apps and the v0.3.0 catalog-self-adoption limitation.

## Preparation evidence and acceptance gates

| Gate | Owner and evidence | State before release |
|---|---|---|
| G0 · Licence and version | Apache-2.0 accepted, SemVer minor `v0.3.0`, 005+006 exact scope | **Proposed; licence already accepted** |
| G1 · Candidate | Reviewed notes, changelog, source/compatibility matrix and migration limitations | **Prepare in dedicated PR** |
| G2 · CI and security | All tests and CodeQL on release PR; post-merge `main` exact-SHA *push* runs success | **Pending final source** |
| G3 · Compatibility | Node 22, Python 3.12, locked Astro 5/React 19/Tailwind 4, browser/axe; no live Wix claim | **Documented; verify exact CI** |
| G4 · Separate owner approval | Explicit `v0.3.0` + final full source SHA go/no-go, after G0-G3 | **HOLD: no publication authorisation** |
| G5 · Publish | Manually dispatch `publish-release.yml` on `main` using version, source SHA and exact `PUBLISH-v0.3.0` | **HOLD until G4** |
| G6 · Verify | Recheck annotated Git tag, source, public Release, checks, publication workflow and record | **Not yet applicable** |

## Release preflight and fail-closed commands

```sh
node scripts/check-repository-boundary.mjs
node scripts/check-release-readiness.mjs --policy
node scripts/check-release-readiness.mjs --release --version v0.3.0
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py' -v
npm --prefix frontend/astro-primitives ci --no-audit --no-fund
npm --prefix frontend/astro-primitives run check
npm --prefix frontend/astro-primitives run build
npm --prefix frontend/astro-primitives exec -- playwright install chromium
npm --prefix frontend/astro-primitives run test:browser
```

The full required CI executes on a GitHub-hosted Ubuntu runner (with the declared Python requirements and browser dependencies). These commands alone are not owner approval, a public release or site QA. The manual publisher independently checks exact source and verified **push** workflow runs, and reruns offline release contracts before creating immutable objects.

## Publication after explicit owner go/no-go

1. **Do not preselect a SHA.** Merge the reviewed candidate, verify current `main` commit and successful *push* `validate.yml` and `codeql.yml` runs for that **exact** SHA.
2. Reconfirm the version-specific release notes match the actual source and that existing tags (`v0.1.0`, `v0.2.0`, `v0.2.1`) are unchanged.
3. Request/record a **separate approval** for *publishing `v0.3.0` at the exact final SHA*. The approval is a policy requirement, not inferred from PR merge.
4. Run [Publish and verify WHPS release](https://github.com/joseferro-pt/wix-headless-production-system/actions/workflows/publish-release.yml) on `main`, supplying:
   - `version`: `v0.3.0`
   - `source_sha`: **the approved, checked 40-character current `main` commit**
   - `approval`: `PUBLISH-v0.3.0`
5. Independently inspect the successful workflow, annotated tag object and public GitHub Release, then record status in the Control Room in a **post-release** PR.

**Known publication boundary:** even after public release, the historical catalog in the tagged source intentionally ends at v0.2.1. Add the independently verified v0.3.0 entry *after* publication by reviewed PR; do not include an imaginary published candidate in the catalog. This is an adoption-planner limitation to disclose, not a reason to mutate a tag.

## Non-goals

No `@wix/astro` integration or live Wix site exercise, no automatic migration, no npm toolkit publication, no unvalidated Astro 7 upgrade, no real site secrets or content, no client deployment, no unilateral publication. WHPS-007 remains a separate maintenance packet.

See [release notes](releases/v0.3.0.md), [release governance](11-RELEASE-GOVERNANCE.md), [Control Room](CONTROL-ROOM.md) and [WHPS-006](25-WHPS006-DISTRIBUTION-ADOPTION.md).
