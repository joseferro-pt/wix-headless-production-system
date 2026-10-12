# Contributing to WHPS

WHPS is a **website-independent toolkit**. Contributions should improve reusable tooling, machine contracts, synthetic tests or system documentation. Do not open pull requests containing client website source, Wix site IDs, customer data, credentials or real deployment records.

## Before contributing

1. Read [agent guidance](AGENTS.md), [system boundaries](docs/06-SYSTEM-BOUNDARIES.md), [authority and decisions](docs/10-AUTHORITY-AND-DECISIONS.md), and [release governance](docs/11-RELEASE-GOVERNANCE.md).
2. Confirm that your change belongs in WHPS rather than an independent website repository.
3. Check current GitHub issues/PRs for related work, or open a scoped issue for larger changes. Do **not** disclose security vulnerabilities in public issues.
4. **Licensing is still under review.** Public GitHub visibility does not grant permission to redistribute or modify this repository. External contributions should wait for an accepted licence and any accompanying contribution terms; no licence grant is implied by this file.

## Development environment

The initial CI-tested environment is **Node.js 22, Python 3.12, Ubuntu Linux**. See [support policy](docs/12-SUPPORT-COMPATIBILITY.md) before claiming additional compatibility.

```sh
python3 -m pip install -r requirements.txt
node scripts/check-repository-boundary.mjs
node scripts/check-release-readiness.mjs --policy
node --test tests/*.test.mjs
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

The toolkit CI must remain **offline with respect to client Wix sites**. Do not add Wix deployment credentials or execute Wix mutations in WHPS GitHub Actions.

## Pull requests

- Use a small, focused branch and the [PR checklist](.github/PULL_REQUEST_TEMPLATE.md).
- Explain the behaviour change, expected users, safety implications, tests run and any limitations.
- Prefer deterministic synthetic fixtures; add negative cases for security- or identity-critical behaviour.
- Document changes to the CLI interface, schema, Wix compatibility expectations and upgrade paths.
- For schema changes, separate the **manifest schema version** from the **toolkit release version**.
- Do not merge until the change is reviewed and the required `contracts` CI check passes.

## Decision authority

A passing test or merged pull request is evidence of implementation, not approval of a legal licence, external release, breaking compatibility or new third-party costs. Those decisions must be recorded and accepted explicitly. See [authority and decisions](docs/10-AUTHORITY-AND-DECISIONS.md).
