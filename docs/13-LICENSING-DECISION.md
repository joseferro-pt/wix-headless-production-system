# 13 — Licensing decision record

**Decision ID:** WHPS-R04-LICENCE  
**Status:** Proposed, not accepted  
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

**Propose Apache-2.0** for WHPS, subject to the repository owner's explicit acceptance and a review of third-party content and dependencies. This is a governance recommendation, not a completed legal action and not legal advice.

## Decision gate

- [ ] Owner explicitly selects licence and copyright attribution.
- [ ] Verify no third-party Wix code or client materials are incorrectly included or relicensed.
- [ ] Commit the complete official chosen `LICENSE` text; add a `NOTICE` file only if required/appropriate.
- [ ] Update README and package metadata (if any) with the chosen SPDX identifier.
- [ ] Record decision status as **Accepted** and identify the approving commit or issue.
- [ ] Pass the offline `--release` readiness check before R05 tagging.

## No implicit grant

**No `LICENSE` has been added under this R04 proposal.** Do not infer permission from this decision draft, from synthetic examples, or from passing CI.
