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

## Supported versions

The Apache-2.0 `v0.1.0` toolkit candidate is merged, but no tag or GitHub Release was visible at the R05.1 review. Treat publication as **pending independent verification**. The early 0.x line is a developer-tooling baseline, not a guarantee of Wix site or long-term compatibility. Later support statements must be backed by actual release evidence.

## Detection limitations

CI includes a high-confidence Git-tracked-content boundary check; it is not comprehensive credential detection, historical scanning, dependency vulnerability assessment or proof that the downloaded Wix project is authentic. See [verification/security](docs/08-VERIFICATION-SECURITY.md), [governance](docs/11-RELEASE-GOVERNANCE.md) and the [branch security plan](docs/14-REPOSITORY-PROTECTION.md).
