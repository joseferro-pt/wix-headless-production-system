# Changelog

## Unreleased — WHPS-R01 foundation correction (proposal)

- Enforce JSON Schema Draft 2020-12 with format checking; validate relevant entry modes and fail closed when original Wix handoff is unavailable.
- Prepare Wix-generated intake atomically and block outputs within the toolkit checkout, including symlinked parents.
- Harden untrusted ZIP inspection and distinguish a provenance claim from verified origin.
- Add dependency declaration, failure-path regression tests, and CI installation of validator tooling.

## Unreleased — system/site boundary separation

- Recast WHPS as a site-agnostic tooling and standards distribution.
- Move the site-specific pilot report out of the current repository tree.
- Replace project-specific milestones with synthetic contract tests and system packaging.
- Add generic site-repository blueprints, adoption guidance and a repository-boundary CI guard.
- Preserve the original v0.1 baseline commit and history; this change does not rewrite prior Git history.

## 0.1.0 — 2026-10-12

- Established Wix handoff-first production overlay, authority map and stage gates.
- Added offline prompt parser with strict consistency checks and preservation of original prompt.
- Added project and resource JSON Schema definitions.
- Added baseline governance, QA/release, business brief and decision templates.
- Added automated test suite, read-only Wix project ZIP auditor and example GitHub Actions workflow.
- No live Wix site changes, GitHub commits, or releases performed.
