# 10 — Authority hierarchy and decision register policy

A single global precedence list would confuse **different kinds of authority**. Resolve claims within their domain, and record disagreements instead of silently selecting a convenient source.

## Authority by domain

| Domain | Primary evidence | Reconciliation rule |
|---|---|---|
| Requested outcomes, permission and approvals | Explicit user's current instruction; recorded approved site brief/decision | Do not infer permission to purchase, delete, overwrite or publish from technical setup alone |
| Wix API/CLI behaviour and supported flows | **Current** official Wix skill, applicable platform reference, real API/CLI outcomes | Official technical contract prevails over generic WHPS prose; recheck when changed |
| Existing Wix site identity | Original Wix handoff, actual `wix.config.json`, then verified authorised Wix context | IDs must reconcile; a mismatch is a blocker, not a reason to create another site |
| Existing Wix business data | Verified read-only Wix backend state | Observed data outranks an old resource registry; explicit authorised writes required |
| Business claims, brand and legal facts | Approved client materials and trustworthy evidence | Generic handoff copy is **not** a verified business fact |
| Website implementation | Site repository source, accepted specs, tests and release record | Website repo owns its code, assets, QA and changes, not WHPS |
| WHPS reusable standards and tools | Accepted system changes in `main`, tests and system decisions | Proposals, drafts and unmerged PRs are not operative releases |

**Conflict procedure:** classify the domain, inspect the exact sources, stop if identity/safety is uncertain, record the conflicting evidence and resolution in the **appropriate repository**. Do not conflate a platform fact with a business decision.

## Decision records

Use [the generic template](../templates/DECISION-RECORD.md). A system decision is recorded within WHPS; website-specific decisions belong to the **website's own repository**.

- `proposed`: recommendation without acceptance.
- `accepted`: authorised decision with accountable evidence (for example an explicit user instruction or a recorded approval).
- `superseded`: previous accepted decision explicitly replaced; preserve history.
- `applied working rule`: normative text already merged into `main`; this describes implementation status, **not a fabricated approval**.

Record the scope, rationale, alternatives, owner/authority, status, evidence, date and any review trigger. Do not treat a GitHub CI success as policy approval.

## Baseline system decisions and evidence

| Topic | State as of 2026-10-12 | Source of confidence |
|---|---|---|
| Keep WHPS separate from every site | User-directed and implemented in merged PR #1 | User instruction and repository tree |
| Site repositories own their projects | User-directed and documented, not yet automated | User instruction, blueprints and docs |
| R01 manifest/intake/archive corrections | Implemented and merged (PR #2); CI passed | GitHub commit and workflow |
| R02 toolkit verification controls | Implemented and merged (PR #3); CI passed | GitHub commit and workflow |
| R03 documentation consolidation | Implemented and merged (PR #4); CI passed | GitHub commit and workflow |
| Formal licensing, release versioning and distribution | R04 merged and Apache-2.0 accepted; R05 candidate pending publication | `LICENSE`, `NOTICE`, release record and GitHub verification |

These statements are a **status ledger**, not a claim that every original DR-001–DR-004 was separately approved. Align the [Control Room](CONTROL-ROOM.md) when a PR is merged or a decision changes.
