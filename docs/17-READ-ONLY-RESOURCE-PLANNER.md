# 17 — WHPS-003 · Read-only Wix resource reconciliation

**Status:** WHPS-003 merged, validated and proposed for v0.2.0. Not in published v0.1.0.

The tool compares resource metadata supplied by an **independent website repository**. It does not query Wix, authenticate, install apps, modify CMS collections, alter forms, run Wix CLI or deploy.

## Input

See [the input schema](../schemas/resource-plan-input.schema.json), [output contract](../schemas/resource-plan-output.schema.json) (planVersion 1), and [synthetic fixture](../examples/resource-plan.synthetic.json).

- A schema version of 0.1.0 and exact Wix site ID.
- Desired resource metadata: type, logicalKey, desiredName, optional Wix ID and optional explicit intent (present or retire).
- Observed snapshot metadata: matching site ID, source, capture timestamp, coveredTypes, completeness (complete or partial), and observed resource IDs, types and names.
- Optional historical resource registry (same site ID and version). A registry is **not proof** of live Wix state.

**Completeness applies only to the declared coveredTypes.** An exhaustive CMS collection snapshot cannot justify a claim that Wix Forms are missing. A partial snapshot cannot justify proposing creation or retirement.

Only metadata is allowed. Do not include submissions, customer records, personal data, credentials, source code or privileged business content. Real snapshots and output belong in the website repository, not WHPS.

## Usage

Run from a WHPS-003 development checkout with Node.js 22 and Python 3.12. Install runtime dependencies with: python3 -m pip install -r requirements.txt.

Synthetic offline example: node scripts/plan-wix-resources.mjs --input examples/resource-plan.synthetic.json

For a real site, supply an input JSON file inside its separate repository to the same CLI. Its JSON output goes to stdout, which may be redirected to a separately reviewed website-local proposed plan. The CLI validates both input and proposed output against JSON Schema before writing JSON to stdout. It never creates or overwrites output files. The input file must be a regular file no larger than 512 KiB.

## Matching order

1. Reject unknown fields, duplicate IDs or logical keys, invalid resource types, invalid snapshot coverage and cross-site identity conflicts.
2. **Reject multiple desired logical keys requesting the same exact resource type/name** before proposing creates, even when nothing is observed. Match an explicitly specified Wix ID first, or the ID registered for that logical key. A missing, wrong-type, contradictory or historically missing/retired ID **blocks** rather than silently creating a replacement.
3. Without a known ID, use a *unique exact type/name* match. Ambiguous matches block. No fuzzy matching.
4. A successful match proposes reuse; a pinned/name difference may propose update only with a complete, type-covered snapshot. Arbitrary resource-schema updates are **not** inferred.
5. Create requires complete coverage for that type and absence of any exact match or identity conflict. It still requires live absence verification and operator approval.
6. Retire requires **explicit desired retirement**, stable identity and complete coverage. Omission from desired state never implies deletion.
7. Observed resources without desired claims become untracked, never deleted.

The labels are create, reuse, update, retire, blocked and untracked. Every row carries approvalRequired=true; the plan states execution=never and confidence=unverified-user-supplied-snapshot. **They are proposals, not executable operations or granted permissions.**

## Limits and next stages

The tool does not certify observation origin, freshness, completeness, Wix permissions, collection schemas, booking services, e-commerce data or supported API mutations. The resource types are WHPS registry classifications, not claims of a uniform Wix CRUD API. Before any real change, work **in the website repository**, obtain a fresh authorised read-only Wix observation, consult [current official Wix technical guidance](https://wix.com/headless/skill.md), approve the exact proposed operation, and record results.

WHPS CI stays entirely synthetic and offline. See [resource governance](03-WIX-RESOURCE-GOVERNANCE.md), [system/site boundaries](06-SYSTEM-BOUNDARIES.md) and [site adoption](07-PROJECT-ADOPTION.md).
