# 04 — QA and Wix-managed release protocol

## Minimum verification matrix

| Gate | Mandatory evidence |
|---|---|
| Identity | handoff Site ID matches `wix.config.json.siteId`; Client ID matches `appId` |
| Code | valid source checkout, dependencies declared, no credentials committed |
| Business facts | no unverified real-world claims represented as facts |
| Integration | live Wix resource IDs tracked; no placeholder integration masquerading as functional |
| Build | documented framework build succeeds, output folder verified |
| Accessibility | basic keyboard/navigation, semantic hierarchy, contrast, form labels |
| Responsive | mobile/tablet/desktop visual check where test environment supports it |
| SEO | titles, descriptions, canonical strategy, robots/indexability review |
| Risk | live-site change approval and non-destructive backend plan |
| Release | actual Wix CLI result, source commit/tag, live URL and dashboard URL |
| Post-release | targeted smoke check, correct domain and Wix functionality; document anything untested |

## Reconcile Wix's official flow

Wix's current managed skill asks agents not to run repeated `build + release` cycles and to release **once at the end**. Therefore:

- Run offline static checks, contract checks, and the **actual documented build** once the implementation is ready.
- If a preview is requested or needed for human acceptance, Wix CLI `preview` is a distinct preview operation **after building**; don't use production release as a preview mechanism.
- Add manual/device/browser testing only when authorized and available. Do not falsely claim unavailable visual or payment tests were performed.
- A failed build is a code defect. A successful release is not proof of every interactive workflow.
- Do not release to an already-published site without release authorization.

## Before `release`

Confirm the original Wix project is on disk and tied to the intended site, `site.outputDirectory` exists and contains correct entry files. For plain static projects, Wix's managed notes call out `index.html` and correct outputDirectory as necessary. Check relevant framework instructions in the current skill.

The exact release command currently documented for managed projects:

```sh
CI=1 npx @wix/cli@latest release
```

Run it in the **actual client project directory** with authenticated Wix CLI. Do not execute it from the production-system repo.

## Final report

Use `templates/RELEASE-REPORT.md`. Distinguish `implemented`, `build-passed`, `released`, and `verified`. Show real URL returned by release, not one inferred from an ID. Always hand off the site dashboard and any outstanding permission/setup requirements. If a release has a real blocker, disclose it.

## Recovery and rollback

Store last known good commit/tag and capture the deployed release reference. For code rollback, reconstruct from that revision and follow documented Wix deployment steps. Wix business data changes require separately scoped backups/export/migrations and **are not** automatically rolled back by redeploying frontend code.

## WHPS R01 validator and archive-audit limitations

- Full manifest validation requires Python 3 and the declared `jsonschema` dependency. Missing or unusable validation tooling is a failure, not a silently skipped check.
- A claimed `--provenance wix-original` archive is **not proof** of original Wix origin; the offline auditor always marks provenance as unverified and returns `REVIEW_REQUIRED` when no structural blockers exist.
- The archive inspector rejects unsafe paths, duplicate members, link entries and bounded excessive sizes/compression. It does not execute, extract, authenticate, deploy, or verify runtime behaviour.
