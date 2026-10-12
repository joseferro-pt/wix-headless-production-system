# CONTROL ROOM — WHPS (system only)

**Scope:** Wix Headless production *toolkit*, never a client website.
**Baseline:** v0.1.0, committed to main. **Next:** system/site boundary proposal; adoption subject to review.
**Canonical repository:** https://github.com/joseferro-pt/wix-headless-production-system

## Authority and limits
- Official Wix skill and live Wix docs: implementation contract, rechecked when required.
- WHPS repo: reusable policies, schemas, blueprints, validators, tests and versioned releases.
- Individual website repo: Wix site binding, handoff, verified business facts, design, frontend code, Wix resources, decisions, QA and release evidence.
- No real client IDs, client audits, website source or Wix site mutations inside WHPS.

## Decisions
| ID | Decision | Status |
|---|---|---|
| DR-001 | WHPS is site-agnostic and reusable, not a portfolio or multi-client workspace. | Proposed |
| DR-002 | Each website owns a standalone repository and chooses a WHPS release version. | Proposed |
| DR-003 | System CI runs against synthetic fixtures and does not access client Wix sites. | Proposed |
| DR-004 | Wix provisioning/CLI semantics remain governed by current official Wix references. | Existing principle |

## System work packets
| ID | Goal | Status |
|---|---|---|
| WHPS-001 | Foundation and source-control baseline | Prepared; GitHub baseline published |
| WHPS-002 | Project generator contracts and synthetic fixtures | Next |
| WHPS-003 | Pure Wix resource reconciliation planner; dry run only | Planned |
| WHPS-004 | Framework-specific reusable starter primitives | Planned |
| WHPS-005 | Automated contract, accessibility and release-policy checks | Planned |
| WHPS-006 | Versioned distribution, changelog and migration policy | Planned |
| WHPS-007 | Security, contribution and multi-project adoption documentation | Planned |

## Acceptance gate for site independence
- No live Wix IDs, customer content, site-specific audit reports or site application code in tracked files.
- Synthetic fixtures exercise parsers and validators.
- A generated project goes outside the system checkout and contains its own AGENTS and Control Room.
- WHPS can be tested without credentials or network access to client sites.

## Next step
Complete WHPS-002 with a generic, offline site-workspace initializer and tests using synthetic fixtures. Pilot deployments, where authorized, take place in separate site repositories, not here.
