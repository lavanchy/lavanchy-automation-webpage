// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lavanchyautomation.ch',
  integrations: [
    sitemap({
      filter: (page) => !/\/blog\//.test(page),
    }),
  ],
  redirects: {
    '/': '/de/'
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'fr', 'en'],
    routing: {
      prefixDefaultLocale: true
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});