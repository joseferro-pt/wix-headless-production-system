# 13 — Licensing decision record

**Decision ID:** WHPS-R04-LICENCE  
**Status:** Accepted (12 October 2026; explicit owner choice: Apache License 2.0)  
**Authority:** Repository owner  
**Scope:** Distribution, modification and external contributions to WHPS itself; not client websites or Wix's code.

## Why a decision is necessary

A **public GitHub repository is not automatically open source**. Until a licence is selected, others have no general permission to copy, modify or redistribute the toolkit beyond rights imposed by law and the GitHub platform terms. Existing website code and third-party dependencies have separate rights and are not relicensed by choosing a WHPS licence.

## Options

| Candidate | Trade-offs | Suitability |
|---|---|---|
| **Apache License 2.0** (recommended) | Permissive commercial use with an express contributor patent licence; requires preservation of licence, notices and relevant modification notices | Good fit for a reusable developer toolkit adopted by independent websites and companies |
| MIT License | Very short, permissive commercial-use licence; no express patent grant | Simpler if minimal licensing overhead is most important |
| Proprietary / source-available | Would require individual terms for reuse | Conflicts with a genuinely open-source toolkit goal |

## Recommendation

**Apache-2.0 is the accepted WHPS repository licence.** The complete standard terms are committed as [`LICENSE`](../LICENSE). Copyright attribution is in [`NOTICE`](../NOTICE) as “Copyright 2026 José Ferro”. This applies to original WHPS material; third-party Wix software, Wix trademarks and website repositories are not relicensed. This record is not legal advice.

## Decision gate

- [x] Owner explicitly selected Apache-2.0 on 12 October 2026; repository-owner attribution is recorded in `NOTICE`.
- [x] Checked the **current tree** for bundled Wix code or client project assets: it contains only original system code, documentation, generated fixtures and external links. History-scanning and legal ownership of outside contributions remain separate risks.
- [x] Add the complete official Apache License 2.0 text as `LICENSE` and a project-specific `NOTICE`.
- [x] Update README with `Apache-2.0` and separate toolkit/site licensing.
- [x] Record this decision as **Accepted**, with release-candidate changes reviewable under R05.
- [x] Offline `--release` readiness must pass before a tag can be created. GitHub release publication is independently verified after the tag is created.

## Scope of grant

WHPS source and its contribution policy are Apache-2.0 licensed after the licence-bearing commit is merged. This does **not** grant rights to Wix intellectual property or client website data, and does not establish that a GitHub Release was published. The GitHub Release remains a distinct R05 event.
