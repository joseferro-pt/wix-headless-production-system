# 25 — WHPS-006 · Versioned distribution, site adoption and migration

**Status:** Merged via [PR #24](https://github.com/joseferro-pt/wix-headless-production-system/pull/24), source `1c43f240b3d8efe3c114c30d0a77116a329256ae`; **included in proposed v0.3.0 candidate, not yet released**. The latest independently verified public distribution is [v0.2.1](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.1). WHPS-005 and WHPS-006 exist only on newer source commits until a separately approved release is published.

## Decision: pin releases, do not publish a hidden package or rewrite websites

- **Distribution channel v1:** the canonical WHPS GitHub repository, with an **annotated release tag plus a full commit SHA**, a public GitHub Release, and a release-specific component catalog. There is currently **no** npm-published WHPS component package, installer that modifies website source, or automatic site update service.
- **Component model:** use the published checkout for **reference**, then copy/adapt only selected reusable policies, scripts and components after a site-owned review. The Astro reference is a deliberately independent **synthetic** application, not a drop-in replacement for Wix-managed \`astro.config.mjs\`, \`wix.config.json\`, SDK authentication, Wix adapters, installed apps or client design. The real website owns all modifications, history and releases.
- **Versioning:** toolkit release \`vX.Y.Z\`; independent manifest schema \`0.1.0\`; historical bootstrap \`whps.lock.json\` lockVersion \`2\`; new, separately tracked site adoption \`whps.adoption.json\` recordVersion \`1\`; planner contract planVersion \`1\`. These are **not interchangeable**.
- **Approval:** WHPS can recommend a review plan; only the independent site's owner can approve changes, run Wix/site QA and deploy. Do not infer permission from a green toolkit CI run or a complete report.

## A. Verify a published WHPS distribution before adoption

Use a trusted WHPS checkout; never execute this from an unreviewed third-party package. The verifier performs **only HTTPS GET** requests against GitHub's public API, checking (1) the exact annotated tag object, (2) its exact resolved commit, and (3) the public non-draft, non-prerelease GitHub Release at the canonical URL.

~~~sh
node scripts/verify-toolkit-release.mjs \
  --tag v0.2.1 \
  --sha 877736282def3631a3fad5d368e3098aadac040f \
  --json
~~~

The CLI fails closed if GitHub is unreachable, the tag moved, the annotated ref/commit differ or the Release is not public. The returned \`source: live-read-only-github-api\` records **GitHub publication identity only**. It does not verify a website, package integrity, signatures, GitHub workflow state or the trustworthiness of the computer running it. Independently review repository ownership, approval and the published release description.

[distribution/release-catalog.json](../distribution/release-catalog.json) is a **reviewed historical snapshot**, not a real-time source of truth. New versions enter the catalog only after separately verified release publication and a reviewed change. WHPS v0.2.1 contains \`governance\`, \`validation\`, \`bootstrap-cli\`, \`resource-planner\` and \`astro-reference\`; WHPS-005 \`site-qa\` is not a published component of v0.2.1.

For independently examining the tagged tree in a **separate local toolkit directory**, not in a Wix site checkout, use an isolated Git clone, then check both the current commit and the tag's dereference:

~~~sh
git clone https://github.com/joseferro-pt/wix-headless-production-system.git /tmp/whps-release-audit
git -C /tmp/whps-release-audit fetch --tags
git -C /tmp/whps-release-audit cat-file -t refs/tags/v0.2.1
git -C /tmp/whps-release-audit rev-parse 'refs/tags/v0.2.1^{commit}'
git -C /tmp/whps-release-audit checkout --detach 877736282def3631a3fad5d368e3098aadac040f
~~~

Confirm \`cat-file -t\` returned \`tag\` and \`rev-parse\` returned the exact SHA above. A Git tag and matching checkout alone do not establish a public Release; also run the read-only GitHub verifier. **Never** use floating \`main\` for production site adoption, and do not apply \`git pull\` from WHPS to a Wix site repository.

## B. Plan adoption or an upgrade without modifying a site

Prepare a small metadata description **in the website's repository** based on [the synthetic sample](../examples/toolkit-adoption.synthetic.json). The sample deliberately contains no Wix identifiers, credentials, site URL, business records or real website commit.

From the WHPS toolkit checkout, run:

~~~sh
node scripts/plan-toolkit-adoption.mjs \
  --input /path/to/independent-site/docs/toolkit-adoption-input.json \
  --json
~~~

- The planner reads **one** explicit local JSON file and prints a deterministic proposal. It does not read the site's Git repository or source, query Wix/GitHub, mutate the site, commit a lock, install packages or run migrations.
- Its current/target release pins must match a **known, exact, previously published release** in the catalog. Unsupported/future/unpublished versions, mismatched full commit SHAs and unavailable components are rejected.
- It reports \`review-required\`, \`no-change\` or \`blocked\`, always with \`execution: never\`. Downgrades and silent removal of previously adopted components **block**, rather than risk deleting site code. \`no-change\` merely means that **operator-supplied metadata** shows no pin/component delta, not that a real website is unchanged.
- The planned output provides a **candidate** \`whps.adoption.json\` record. It is \`candidate-unverified\`, \`approval: pending\`, with mandatory fresh GitHub verification. It does not automatically write this record or alter the original \`whps.lock.json\`.

## C. Website-owned acceptance and migration

1. Confirm the owner, the existing site's real Git commit, branch, worktree status and binding, including any existing Wix-generated configuration, manually and independently. Save an off-site backup/rollback point before changing Wix/site code. Do **not** run the WHPS new-workspace bootstrap against an existing site.
2. Cross-check the chosen release's source and contents against the live GitHub verification in Step A, then review changes from the site's **current adopted** source and components. Keep the source artifact reference and SHA in the site-owned decision record.
3. Manually map each selected generic file or primitive to **site-owned equivalents**. Prefer applying a reviewed diff in a separate website PR, and deliberately avoid replacing Wix \`astro.config.mjs\`, \`wix.config.json\`, extension configuration, auth/permissions, deployments, CSS design tokens or app integrations. Historical site modifications win unless independently agreed otherwise.
4. Validate actual site-local framework/Wix contracts, React hydration, Tailwind configuration, accessibility, SEO, commerce, bookings, forms, privacy, permissions and CI as applicable. Follow [site-local QA recipes](24-SITE-LOCAL-VERIFICATION.md); do not equate WHPS synthetic tests with live Wix functionality.
5. Obtain explicit site-owner approval tied to a **new** site commit. Only after real adoption succeeds may the operator record \`whps.adoption.json\` as \`adopted-owner-recorded\` with \`verification: operator-checked-github\` and \`approval: approved\`. This is an **operator claim**, not something the WHPS toolkit externally certifies.
6. Keep the original generated \`whps.lock.json\` version 2 unchanged to preserve creation provenance. Existing untagged or earlier lock formats require **manual reconciliation**, not an automatic destructive upgrade. Maintain a per-site change log and rollback decision. Future toolkit releases do not propagate automatically.

The new [site adoption record schema](../schemas/site-toolkit-adoption.schema.json) and [planner input schema](../schemas/toolkit-adoption-plan-input.schema.json) are versioned independently. CLI tests use only synthetic values. A website's real adoption record, Wix identity, evidence links and test reports must not be committed to WHPS.

## Explicit framework and distribution boundaries

Official Wix-managed Astro linking instructions currently permit **Astro 5 or Astro 7**, not Astro 6; new linking provisions a Wix business/site and requires separate authority. Existing Wix-managed sites must preserve their generated integration, auth and adapters. Third-party widget-only Wix apps are **not inherently headless compatible**. As of this packet, WHPS's tested synthetic reference remains **Astro 5 + React 19 + Tailwind CSS 4**; a Wix-managed runtime remains unverified here. Review both supported framework integrations and individual Wix app APIs on the actual independent site.

- [Wix: connect an existing Astro project](https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/connect-an-existing-astro-project)
- [Wix: develop a managed project](https://dev.wix.com/docs/go-headless/wix-managed-headless/develop-your-project)
- [Wix: API-based apps vs widget-only apps](https://dev.wix.com/docs/go-headless/project-management/add-apps-to-a-project)
- [WHPS site QA](24-SITE-LOCAL-VERIFICATION.md), [release governance](11-RELEASE-GOVERNANCE.md), [existing adoption rules](07-PROJECT-ADOPTION.md)

## WHPS-006 acceptance and what remains unproved

- Historical catalog exact SHAs and tag objects independently matched the three existing GitHub Releases.
- Live verifier unit tests reject lightweight/mismatched tags, draft/prerelease/noncanonical Releases and unverified network errors using injected synthetic GitHub responses. No GitHub credentials are used in CI.
- Adoption planner and JSON Schemas have negative tests for floating refs, wrong sources, missing/unpublished components, implicit removal/downgrades and site report state.
- CI must pass at the **exact WHPS-006 PR head and subsequent main merge**. Site source files, Wix state and real-world adoption remain untested until done in a separate website repository.
- Merging WHPS-006 does **not** publish a new toolkit version, distribute \`site-qa\`, approve a site upgrade or close the separate release-governance gate. A future **v0.3.0** is a reasonable candidate, but requires its own approved notes, exact-main checks and manual publication.
