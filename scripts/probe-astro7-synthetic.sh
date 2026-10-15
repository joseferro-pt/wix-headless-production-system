#!/usr/bin/env bash
# Dedicated WHPS experimental compatibility probe; never modify Wix or main.
set -euo pipefail
base="$(git rev-parse --show-toplevel)"
temp="$(mktemp -d)"
trap 'rm -rf "$temp"' EXIT
trial="$temp/astro7-synthetic"
mkdir -p "$trial"
# Fresh Actions checkout contains only the synthetic demo. Keep all trial changes
# outside the repository and discard them after the run.
cp -R "$base/frontend/astro-primitives/." "$trial/"
cd "$trial"
echo "::group::Experimental Astro 7 + @astrojs/react 7 candidate (not Wix)"
node -v
npm -v
npm ci --no-audit --no-fund
npm install --save-exact --no-audit --no-fund astro@7.3.8 @astrojs/react@7.0.1
node --input-type=module -e '
import { readFileSync } from "node:fs";
const pkg=JSON.parse(readFileSync("package.json","utf8"));
const lock=JSON.parse(readFileSync("package-lock.json","utf8"));
const exact={astro:"7.3.8","@astrojs/react":"7.0.1"};
for (const [dep,version] of Object.entries(exact)) {
  const actual=lock.packages["node_modules/"+dep]?.version;
  if(actual!==version||pkg.dependencies[dep]!==version)
    throw Error("Unexpected trial major or version: "+dep);
}
for(const x of ["react","react-dom","tailwindcss","@tailwindcss/vite"]) {
  if(!pkg.dependencies[x])throw Error("Missing reference dependency "+x);
}
console.log(JSON.stringify({
  kind:"WHPS ASTRO7 SYNTHETIC PROBE",lockfileVersion:lock.lockfileVersion,
  astro:lock.packages["node_modules/astro"]?.version,
  astroReact:lock.packages["node_modules/@astrojs/react"]?.version,
  react:lock.packages["node_modules/react"]?.version,
  tailwind:lock.packages["node_modules/tailwindcss"]?.version,
  tailwindVite:lock.packages["node_modules/@tailwindcss/vite"]?.version,
  node:process.version,liveWixVerified:false,
},null,2));
'
sha256sum package-lock.json
echo "::endgroup::"
echo "::group::Astro 7 static diagnostics / build in isolated trial"
npm run check
npm run build
echo "::endgroup::"
echo "::group::Astro 7 browser hydration, accessibility and responsive checks"
npx playwright install --with-deps chromium
npm run test:browser
echo "::endgroup::"
echo "PASS: synthetic-only Astro 7 candidate. Does not prove Wix-managed site compatibility."
