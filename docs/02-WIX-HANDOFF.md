# 02 — Wix-generated prompt as technical handoff

The original Wix prompt, with Site ID, public Client ID, download URL, skill URL and dashboard reference, is **technical identity evidence** and must be preserved unchanged in the **website repository**. Its generic business description does not substantiate real offerings, address, opening hours, prices, credentials or testimonials. See [authority](10-AUTHORITY-AND-DECISIONS.md).

## Current offline tool scope

From the WHPS checkout, install validation dependencies, then write to a **new outside directory**:

```sh
python3 -m pip install -r requirements.txt
node scripts/intake-wix-handoff.mjs /path/to/original-wix-prompt.txt ../new-site-workspace
node scripts/validate-manifest.mjs ../new-site-workspace/site.manifest.json
```

The script rejects an existing output directory or a path inside WHPS, including through symlinked parents. Its atomic staging preserves prompt text and SHA-256, extracts and cross-checks repeated identifiers and writes a site manifest marked as **unverified**. The validator checks its full JSON Schema and original file integrity. **The script does not download ZIP files, create a Git repository, call Wix APIs, set up an OAuth app, install Wix solutions, build or release.** For an existing site checkout, do not point this new-directory-only tool at its root.

## Wix preflight occurs in the website project

1. Acquire the **actual** Wix-provided archive through an authorised route, note the source and checksum, and inspect its project structure.
2. Compare original prompt Site ID / Client ID with `wix.config.json.siteId` / `.appId` if available; stop on mismatch rather than recreating identity.
3. Record framework, dependency manifests, output directory and platform constraints before editing code.
4. Audit current Wix apps/resources with authorised read-only site access where available.
5. Select the Wix **create/connect/iterate** path based on the actual source and current official skill, not on directory emptiness alone.
6. Keep the actual site source, Wix identifiers, business documents and release evidence **inside that site's repository**, not WHPS.

The offline archive auditor can check structure, paths and identifier agreement, but a `wix-original` flag is **a claim**, not independently verified provenance. It also does not prove a Wix deployment.

## Related documentation

- [Operating model](01-OPERATING-MODEL.md)
- [Project adoption](07-PROJECT-ADOPTION.md)
- [Wix resource governance](03-WIX-RESOURCE-GOVERNANCE.md)
- [Verification/security](08-VERIFICATION-SECURITY.md)
