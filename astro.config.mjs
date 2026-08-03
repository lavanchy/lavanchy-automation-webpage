// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://lavanchyautomation.ch',
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