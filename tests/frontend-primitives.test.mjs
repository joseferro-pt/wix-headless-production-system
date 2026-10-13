import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = new URL('../frontend/astro-primitives/', import.meta.url);
const source = path => readFile(new URL(path, base), 'utf8');

test('Astro 5 reference pins major line and React and Tailwind remain optional islands/utilities', async () => {
  const p = JSON.parse(await source('package.json'));
  assert.equal(p.private, true);
  assert.match(p.dependencies.astro, /^\^5\./);
  assert.match(p.dependencies['@astrojs/react'], /^\^4\./);
  assert.match(p.dependencies['@tailwindcss/vite'], /^\^4\./);
  assert.match(p.dependencies.tailwindcss, /^\^4\./);
  assert.match(p.dependencies.react, /^\^19\./);
  const config = await source('astro.config.mjs');
  assert.match(config, /react\(\)/);
  assert.match(config, /tailwindcss\(\)/);
  assert.doesNotMatch(config, /@wix\/astro|wix\.config/);
});

test('no live Wix configuration or SDK tokens are embedded in reference sources', async () => {
  const list = [
    'src/layouts/SiteFrame.astro','src/components/Section.astro',
    'src/components/ContentCard.astro','src/components/ContentState.astro',
    'src/pages/index.astro','src/islands/FilterableList.tsx',
    'src/server/reader.ts','src/server/wix-capabilities.ts',
  ];
  for (const file of list) {
    const contents = await source(file);
    assert.doesNotMatch(contents, /^\s*import\s.*['"]@wix\//m, file);
    assert.doesNotMatch(contents, /wix\.config\.json|[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/, file);
    assert.doesNotMatch(contents, /process\.env\.[A-Z_]*(TOKEN|SECRET|KEY)/, file);
  }
});

test('islands receive only public serialisable data and cannot import backend SDK', async () => {
  const island = await source('src/islands/FilterableList.tsx');
  assert.match(island, /PublicListItem/);
  assert.match(island, /client/); // native React hooks and browser-local interaction only
  assert.doesNotMatch(island, /@wix\/|createClient|OAuthStrategy|ApiKeyStrategy|localStorage|sessionStorage|fetch\(/);
  assert.match(island, /safeHref/);
  assert.match(island, /role="status"/);
  assert.match(await source('src/pages/index.astro'), /client:idle/);
});

test('Astro page has semantic landmark, accessible states, skip link, generic design tokens', async () => {
  const layout = await source('src/layouts/SiteFrame.astro');
  const state = await source('src/components/ContentState.astro');
  const css = await source('src/styles/global.css');
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /<main id="main-content"/);
  assert.match(layout, /<html lang=/);
  assert.match(state, /role=\{state === 'error' \? 'alert' : 'status'\}/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /@import "tailwindcss"/);
  assert.match(css, /--whps-gutter/);
});

test('Wix app support wording documents business templates and explicitly rejects widget-only portability', async () => {
  const matrix = await readFile(new URL('../docs/20-ASTRO-WIX-COMPATIBILITY.md', import.meta.url), 'utf8');
  for (const feature of ['Stores','Bookings','Events','Blog','CMS','Forms','Members','Pricing Plans'])
    assert.ok(matrix.includes(feature),feature);
  assert.match(matrix, /Astro 6 is not supported/i);
  assert.match(matrix, /widget-only|widget-centric/i);
  assert.match(matrix, /not a live Wix compatibility certification/i);
  assert.match(matrix, /Wix's Astro integration/i);
  const capabilities = await source('src/server/wix-capabilities.ts');
  assert.match(capabilities, /widget-not-portable/);
  assert.match(capabilities, /verify-api-per-feature/);
});

test('site ownership and Wix-authorised context are mandatory in adoption guidance', async () => {
  const guide=await source('README.md');
  assert.match(guide, /Never replace|Never overwrite|Do not replace/i);
  assert.match(guide, /site.*repository/i);
  assert.match(guide, /wix\.config\.json/);
  assert.match(guide, /No Wix SDK|No Wix CLI/i);
  assert.match(guide, /Astro 6/i);
});
