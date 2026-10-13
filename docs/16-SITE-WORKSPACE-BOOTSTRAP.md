# 16 — WHPS-002 · Independent website repository bootstrap

**Status:** WHPS-002 published in v0.2.0, not v0.1.0. R06.1's provenance checks are unreleased patch-candidate changes.
**Scope:** Offline local directory and Git initialisation only. No Wix login, API calls, remote repository creation, network fetches, CMS writes, client site deployments or purchases.

## Purpose

Create one **new independent website-local Git repository** outside the WHPS toolkit checkout. Copy site-scoped generic blueprints and a schema-valid initial manifest; never place a real handoff or client source inside WHPS. The user is responsible for opening a remote repository separately, reviewing what is committed, and maintaining their website's release lifecycle.

### Supported entry modes

| Mode | Required input | Bootstrap state | Guarantee |
|---|---|---|---|
| `wix-handoff` | Original, unchanged Wix-generated prompt | `HANDOFF_RECEIVED`; Wix binding **unverified** | Preserves the exact prompt and its checksum; reconciles syntactic Wix identifiers |
| `unbound-frontend` | New site key/output directory | `BLOCKED` until frontend/source and binding are assessed | Does **not** invent an identity or pretend a frontend exists |
| `existing-repository` | Existing site checkout | **Not supported by this new-directory CLI** | Refuses to overwrite any existing source. Use the [manual adoption protocol](07-PROJECT-ADOPTION.md) |

A mode in the site manifest schema does not automatically imply bootstrap automation for it.

## Development usage

Run these commands from a WHPS-002 source checkout on Node.js 22, Python 3.12 and a working Git CLI. Install the toolkit runtime requirements first:

```sh
python3 -m pip install -r requirements.txt

# Start a new, unbound frontend workspace (no Wix identity)
node scripts/bootstrap-site-workspace.mjs \
  --mode unbound-frontend \
  --output ../new-site

# OR: start from an original Wix handoff (do not use a real site in toolkit tests)
node scripts/bootstrap-site-workspace.mjs \
  --mode wix-handoff \
  --output ../new-wix-site \
  --handoff /path/to/original-wix-prompt.txt
```

The destination **must not exist** and its lowercase kebab-case directory name must equal `--project-key` if explicitly supplied. It must resolve **outside WHPS** even through a symlink. Each scaffold uses a temporary sibling directory, initialises Git locally on `main`, then renames it to the requested destination. The bootstrap leaves the initial commit, remote repository, author identity and GitHub permissions to the owner.

**R06.1 candidate guard:** Before generation, reject a WHPS checkout containing staged, unstaged, untracked or submodule changes. The configured local `origin` must be an accepted exact WHPS HTTPS/SSH remote spelling; other or missing remotes block. This checks **local Git configuration**, not authenticated remote ownership, and is **not included in v0.2.0**.

An existing site checkout must **never** be a destination. For an existing source repository, first inspect its binding, files, history and local ownership; then copy/adapt generic policies and explicitly record release adoption. No existing source is automatically merged or overwritten.

## Files created in the new website checkout

- `site.manifest.json`: conforms to manifest schema 0.1.0; no business facts or Wix verification invented.
- `whps.lock.json`: a **v2 lock**, validated by [the adoption-lock schema](../schemas/whps-adoption-lock.schema.json), with the actual generating `toolkitSource` repository, full local Git SHA, optional exact-match tag, state (`unreleased-checkout` or `tagged-checkout-unverified`) and `releaseVerification: not-performed`. The generator separately records the same SHA/tag, and `foundationBaseline` preserves the historic v0.1.0 reference. A local tag alone never certifies a published GitHub Release.
- `README.md`: website-local startup and approval steps.
- `AGENTS.md`, `docs/CONTROL-ROOM.md`, `docs/BUSINESS-BRIEF.md`: site-specific copies of **generic** source templates, with key and adopted foundation reference.
- `.gitignore`: basic secret and build output exclusions.
- `wix-handoff.original.txt`: only for `wix-handoff`; exact original content, stored in the independent site checkout.
- `.git/`: local, independent Git repository with branch `main` and **no initial commit**.

No `wix.config.json`, frontend, CMS collections, backend resources, authenticated sessions, deployment credentials or live-site claims are generated.

## Safety and verification

1. Check the original prompt's declared Wix Site/Client IDs against any **actual** downloaded Wix project before invoking Wix CLI operations. Archive provenance cannot be established by this scaffold.
2. Treat site `business.factsStatus: unknown`, `bindingVerified: false` or absent identity, and `productionReleaseApproved: false` as hard governance signals, not invitation to infer the missing facts.
3. Use the official current [Wix Headless skill](https://wix.com/headless/skill.md) for site-level technical integration; WHPS must not perform Wix writes from its own checkout.
4. Run the site-local manifest validator before later updates. Site-level build, resource reconciliation, release and verification belong to that site's workflow.
5. Examine generated files before committing or pushing. The basic `.gitignore` is **not** an exhaustive secret scanner and may require site-specific exclusions.

**Failure behaviour:** invalid flags/identities, an existing destination, paths inside WHPS (including symlinks) and failed file writes/Git initialisation block completion. A failed attempt cleans the staging directory; parent directories newly created for an output may remain. Concurrent malicious filesystem changes and remote Git hosting are outside this offline tool's guarantees.

## Release discipline

The published v0.1.0 toolkit does **not** include the bootstrap; the verified [`v0.2.0`](https://github.com/joseferro-pt/wix-headless-production-system/releases/tag/v0.2.0) does. The later R06.1 provenance fix requires a new, separately verified patch release. New website locks pin the actual generating checkout, but the release status remains unverified until the website operator checks the GitHub tag and release against that SHA; never imply this generator shipped in v0.1.0. Future version-lock upgrades and existing-repository adoption require a reviewed compatibility plan (WHPS-006).

See [system boundaries](06-SYSTEM-BOUNDARIES.md), [site adoption](07-PROJECT-ADOPTION.md), [roadmap](05-ROADMAP.md) and [Control Room](CONTROL-ROOM.md).
