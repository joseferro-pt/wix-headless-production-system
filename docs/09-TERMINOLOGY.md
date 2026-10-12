# 09 — Terminology and statuses

Avoid reusing one status term for different objects. See [authority](10-AUTHORITY-AND-DECISIONS.md).

| Term | Meaning | Evidence |
|---|---|---|
| **WHPS** | Site-agnostic production toolkit and delivery operating framework | This repository's accepted code, docs and policies |
| **Website repository** | One site's independently versioned source and project records | Its separate Git repository and Wix binding |
| **Wix handoff** | Original Wix-generated prompt, download reference and declared identifiers | Exact preserved source + checksum in site repo |
| **Wix binding** | On-disk `wix.config.json` relating a frontend to Wix | File inspection and identity reconciliation |
| **Observed Wix state** | Latest directly queried Wix apps, content metadata or IDs | Authenticated, read-only Wix results in site context |
| **Business brief** | Client-approved facts, audience, content and intended features | Source and explicit approval in site repo |
| **Manifest schema version** | Data contract recognised by validator (`0.1.0` currently) | JSON Schema and validator implementation |
| **Toolkit baseline** | A reviewed set of files present on `main` | Git commit SHA |
| **Toolkit release** | Deliberately published and versioned distribution of WHPS | Release tag plus release record; **none published yet** |
| **Website release** | Actual deployment of one site using its Wix project | Wix CLI result, commit and site-local report |
| **Verified website** | Deployed site with recorded permitted post-release checks | Site-level verification evidence; not system CI |
| **Work packet** | Bounded change request with acceptance checks | System Control Room or separately in site repo |
| **Review milestone R01–R05** | Foundation review/remediation sequence | Merged PR and passing CI for implemented review steps |
| **WHPS-00x milestone** | Later system product-development packet | System roadmap and PR evidence |

## Status vocabulary

**System work:** `proposed` → `implemented` → `CI-passed` → `merged`; `published-release` is a **separate** event. A draft PR is not merged. `blocked` records an obstacle. A commit in `main` does not by itself create a tag or release.

**Decisions:** `proposed`, `accepted`, `superseded`. An implementation merged into `main` can be an **applied working policy** even before formal decision-record approval; label it accurately rather than claiming an approval that was never made.

**Website lifecycle:** machine values are defined in [the manifest schema](../schemas/site-manifest.schema.json), including `HANDOFF_RECEIVED`, `PREFLIGHT_COMPLETE`, `BRIEF_APPROVED`, `SPEC_APPROVED`, `IMPLEMENTED`, `BACKEND_SYNCED`, `BUILD_PASSED`, `RELEASE_APPROVED`, `RELEASED`, `VERIFIED`, `BLOCKED`. These are site states, **not** system work statuses. `HANDOFF_RECEIVED` describes Wix-generated-prompt intake, not a claim that every website has that prompt.

**Entry modes:** `wix-handoff`, `existing-repository`, `unbound-frontend` are machine values. Wix's managed operational paths additionally distinguish `create`, `connect` and `iterate`. These vocabularies overlap conceptually but are **not** direct one-to-one replacements.

## Canonical terminology rules

Use "original Wix-provided archive" only when its origin is independently grounded. The offline ZIP auditor can verify structure and match identifiers, **not** independently prove provenance. Do not call its result a successful deployment. Use "adopted tag" only once a tag actually exists; before R05 say "pinned commit SHA".
