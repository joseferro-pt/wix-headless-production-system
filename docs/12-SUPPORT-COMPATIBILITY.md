# 12 — Supported environments and compatibility

## Evidence-based runtime matrix

| Component | Baseline | Evidence and support status |
|---|---|---|
| Node.js | **22.x** | Explicit `actions/setup-node` CI runtime, verified by workflow |
| Python | **3.12.x** | Explicit `actions/setup-python` CI runtime, verified by workflow |
| OS | **Ubuntu Linux (GitHub-hosted `ubuntu-latest`)** | Automated CI checks; runner image changes over time |
| Python package | `jsonschema>=4.23,<5` | Runtime dependency, installed and exercised by CI; not pinned to exact patch |
| Maintainer YAML verification | `PyYAML>=6.0.2,<7` | Development-only `requirements-dev.txt` dependency used for Dependabot configuration tests in CI, **not included in the v0.1.0 release** |
| Wix Headless platform | Current official Wix skill and Wix CLI/SDK instructions | External authority; **no live Wix integration tested by toolkit CI** |
| Node.js 20 / 24, Python 3.13, Windows, macOS | Not in official CI matrix | **Not guaranteed**; supplementary local results are not published support commitments |

The items above describe the **currently CI-tested development environment**, not every possible system/platform combination or live Wix deployment. The v0.2.0 candidate adds an explicit Git CLI requirement for WHPS-002 bootstrap, but does not expand operating-system support claims. When extending the matrix, first add the environment to CI and record the evidence.

## Compatibility rules

- Run tests with the supported Node and Python versions; record the versions in release notes.
- A contributor may develop elsewhere, but cannot claim support for an untested environment.
- Schema contracts are separately versioned; changes that invalidate existing site manifests need migration guidance and negative tests.
- A Wix dependency or CLI behaviour may change upstream. Review the current official Wix skill in each site project, not as a one-time frozen implementation authority.
- Do not add a live Wix token or live website smoke tests to WHPS CI to establish compatibility; those belong to authorised website projects.
- For future releases, review dependency locking, action pinning and fixed runner images for stronger repeatability. Current Python requirements use version ranges, so exact dependency graphs may vary.

## Release policy for support

The published `v0.1.0` is an **early developer toolkit** on the CI-tested runtimes above. The release notes define known limits; future fixes use reviewed patch releases. Do not claim support for Wix site deployments or untested platforms. Site repositories pin a toolkit commit/tag; WHPS does not guarantee that downstream sites automatically pick up changes.
