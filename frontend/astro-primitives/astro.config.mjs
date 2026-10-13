import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Local demonstration only. An actual Wix-managed Astro site must preserve its
// Wix-generated config, adapter, authentication and extensions.
export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
