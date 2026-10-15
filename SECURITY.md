# Security policy

## Scope

This policy covers vulnerabilities in the **WHPS toolkit and its generic developer scripts**. Each Wix website has its own security and incident-response responsibility in its independent repository and Wix environment. WHPS does not hold Wix administration credentials or customer records.

## Reporting vulnerabilities

**Do not disclose exploit details, live credentials or customer data in a public issue or pull request.**

When private vulnerability reporting is enabled, use GitHub's **Security** tab and the private-reporting or security-advisory workflow for this repository. If it is not enabled, the maintainer must establish an appropriate private reporting channel before inviting sensitive reports. We have not verified a private channel or public security contact address; do not assume either exists.

Include a minimal synthetic reproduction, the affected source revision, conditions for exploitation, potential impact and a safe disclosure plan. Never send live Wix tokens or client data.

## Handling

1. Triage privately and confirm scope, affected versions and reproducibility.
2. Contain active credential exposure: revoke/rotate credentials immediately using the owner-controlled provider; do not rely on deleting a file from Git history.
3. Create a targeted fix and add synthetic regression tests; avoid exposing sensitive details in public logs or diffs.
4. Release an approved fix with notes and, where appropriate, a coordinated advisory.
5. Review downstream site repositories independently when the issue impacts adopted toolkit versions. WHPS must not silently deploy changes to websites.

## Supported versions and security triage

The latest published version is [v0.3.0](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.3.0), published 15 October 2026 at source `bb4d0adcd9021b5cd671e13fed46d5498fac4399`. Previous v0.2.1, v0.2.0 and v0.1.0 remain available and immutable but are **not promised ongoing backports or a fixed security-support window**. Confirm whether any advisory affects a particular **tag and exact source commit** before claiming it is vulnerable or fixed.

Prioritise active credential exposure, exploitable input boundaries and dependency advisories according to verified impact. Triage privately, add synthetic regression tests and only publish a fix through separately approved release governance. WHPS cannot contact or auto-upgrade an adopting Wix website. The [WHPS-007 maintenance guide](docs/28-WHPS007-MAINTENANCE-SECURITY-COMPATIBILITY.md) defines review cadence, owner-only controls, scope and non-promised SLAs.

## Detection limitations

CI includes a high-confidence Git-tracked-content boundary check and an **offline npm provenance/major-version policy**; neither is comprehensive credential detection, whole-history scanning, dependency vulnerability assessment or proof that a downloaded Wix project is authentic. See [verification/security](docs/08-VERIFICATION-SECURITY.md), [governance](docs/11-RELEASE-GOVERNANCE.md) and the [branch security plan](docs/14-REPOSITORY-PROTECTION.md).
