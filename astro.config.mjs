// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lavanchyautomation.ch',
  integrations: [sitemap()],
  redirects: {
    '/': '/de/'
  },
  i18n: {
    defaultLocale: 'de',
    // Später ergänzen: 'fr', 'en' — Ordner unter src/content/<locale>/ anlegen, hier eintragen.
    locales: ['de'],
    routing: {
      prefixDefaultLocale: true
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});