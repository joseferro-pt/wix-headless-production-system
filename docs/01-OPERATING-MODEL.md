# 01 — Operating model

## Roles and sources of truth

- **Wix (live business):** Wix-native apps, CRM, forms/submissions, CMS content, bookings and commerce data.
- **Client site's Git repository:** frontend source, design tokens, tests, the actual project-local `wix.config.json`, accepted copy/config and release history.
- **System repository:** generic templates, policies, scripts and regression tests; never a client's live Wix data.
- **Original Wix prompt:** immutable bootstrap evidence (identifiers and source URLs).
- **Client business brief:** verified commercial facts, offers, voice, positioning and primary customer actions.

## Entry modes

**A · Wix handoff:** Exact user-supplied Wix prompt → parse IDs/URLs → download original project → inspect/verify Wix binding → scope business brief → plan → implement → build → review/release.

**B · Existing site:** Locate repo and deployed revision → inspect Wix binding and current Wix site → requirements delta → implement → build → review/release.

**C · Brought-in unbound frontend:** Inspect project + target/site identity before following Wix's official managed connect instructions. May involve creating a new Wix binding only when *no existing Wix site is supplied* and explicitly authorized.

## Stages and transitions

| Stage | State | Evidence required to exit |
|---|---|---|
| 00 Intake | `HANDOFF_RECEIVED` | original prompt captured; ID/URL cross-check passes |
| 01 Preflight | `PREFLIGHT_COMPLETE` | actual ZIP/repo inspected; `wix.config.json` site/client IDs matched; live site read-only inventory |
| 02 Discovery | `BRIEF_APPROVED` | primary CTA, business facts, required solutions, languages and unknowns documented |
| 03 Specification | `SPEC_APPROVED` | site map, design tokens, content plan, integration delta accepted |
| 04 Implementation | `IMPLEMENTED` | code integrated without destroying binding; resource changes logged |
| 05 Backend reconciliation | `BACKEND_SYNCED` | observed state and changes reconcile; relevant write operations confirmed |
| 06 Quality | `BUILD_PASSED` | framework build succeeds; applicable checks pass; exceptions documented |
| 07 Release decision | `RELEASE_APPROVED` | actual published-site change authorized; release candidate identified |
| 08 Release | `RELEASED` | Wix CLI reports published origin and records source revision |
| 09 Verify | `VERIFIED` | production URL works and permitted post-release checks pass |

`BLOCKED` is a side-state when identity, authentication, missing files, absent required facts or critical QA prevents progress. The evidence for unblocking must be recorded. A state can't be advanced by narrative assertion alone.

## Responsibilities and review gates

- **Agent:** generate read-only intake artifacts and proposed business/design specs; implement approved work; show explicit proof of checks.
- **Operator:** approve factual claims and design direction; grant release approval for already-published sites; authorize destructive actions/costs.
- **Wix:** business-record authority and actual deployment results.

Do not ask unnecessary questions when the source provides the answer. Ask only when a materially business-specific decision lacks a trustworthy source, particularly claims that would be published as fact.

## Completion definition

A website is complete only when its project checkout is reproducible, Wix integration is real (not a mocked façade), the configured build works, release is verified, and the operator gets the deployed URL plus the Wix dashboard URL. A local ZIP alone is **prepared**. A Wix form created in the backend alone is **partially integrated**.
