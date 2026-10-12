# 12 — Supported environments and compatibility

## Evidence-based runtime matrix

| Component | Baseline | Evidence and support status |
|---|---|---|
| Node.js | **22.x** | Explicit `actions/setup-node` CI runtime, verified by workflow |
| Python | **3.12.x** | Explicit `actions/setup-python` CI runtime, verified by workflow |
| OS | **Ubuntu Linux (GitHub-hosted `ubuntu-latest`)** | Automated CI checks; runner image changes over time |
| Python package | `jsonschema>=4.23,<5` | Declared dependency, installed and exercised by CI; not pinned to exact patch |
| Wix Headless platform | Current official Wix skill and Wix CLI/SDK instructions | External authority; **no live Wix integration tested by toolkit CI** |
| Node.js 20 / 24, Python 3.13, Windows, macOS | Not in official CI matrix | **Not guaranteed**; supplementary local results are not published support commitments |

The items above describe the **currently validated development environment**. They are a proposed baseline for the first toolkit release, not a claim that every system/platform combination is guaranteed. When extending the matrix, first add the environment to CI and record the evidence.

## Compatibility rules

- Run tests with the supported Node and Python versions; record the versions in release notes.
- A contributor may develop elsewhere, but cannot claim support for an untested environment.
- Schema contracts are separately versioned; changes that invalidate existing site manifests need migration guidance and negative tests.
- A Wix dependency or CLI behaviour may change upstream. Review the current official Wix skill in each site project, not as a one-time frozen implementation authority.
- Do not add a live Wix token or live website smoke tests to WHPS CI to establish compatibility; those belong to authorised website projects.
- Before R05, consider dependency pinning/lock strategy and whether the GitHub runner image should be fixed for stronger repeatability.

## Release policy for support

The toolkit has **no published supported release line** today. At R05, specify which WHPS versions are supported, how security fixes are shipped, and what upgrades are recommended. Site repositories pin a toolkit commit/tag; WHPS does not guarantee that downstream sites automatically pick up changes.
