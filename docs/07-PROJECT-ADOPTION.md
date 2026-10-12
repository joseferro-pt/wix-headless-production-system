# Adoption by an independent website repository

## Preflight
1. Create or identify an independent **website repository**, separate from WHPS.
2. Keep the user's exact Wix-generated prompt and downloaded archive there; inspect and validate the existing Wix binding.
3. Select an explicit WHPS version/tag and record it in the website-local documentation.
4. Copy or generate site-local AGENTS, Control Room and business brief from the reusable blueprints.
5. Complete site-specific requirements and decisions in the website repository, not in WHPS.
6. Follow the current official Wix skill for the actual managed create/connect/iterate path.
7. Run tests, obtain production approval as required, release from the website checkout and record verified outcomes there.

## Version pinning
Initially, record the WHPS Git tag and commit manually in the site repository. Later, the installer can generate a lockfile and support safe, reviewed upgrades.

## Boundary diagram
WHPS (generic tools & releases) -> Website A (version N, Wix site A).
WHPS (generic tools & releases) -> Website B (version N-1, Wix site B).
Upgrades are explicit, not propagated automatically. No website pushes its live records upstream into WHPS.

## Original Wix handoff
The Wix prompt is technical bootstrap evidence, not a confirmed business brief. Site IDs belong in the website only. Never re-initialize a correctly bound Wix site simply because a new checkout is empty.
