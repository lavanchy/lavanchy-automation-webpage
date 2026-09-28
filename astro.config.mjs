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
  // Kleines CSS direkt ins HTML: spart den render-blockierenden Request (PageSpeed).
  build: {
    inlineStylesheets: 'always'
  },
  // Content-Security-Policy als <meta> mit automatischen Hashes für alle Inline-Skripte
  // und -Styles. frame-ancestors geht nur per HTTP-Header, siehe nginx.conf.
  // Neue Drittdienste (Scripts, iframes, APIs) müssen hier freigegeben werden.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://analytics.lavanchyautomation.ch https://tally.so",
        "frame-src https://tally.so",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ],
      scriptDirective: {
        resources: ["'self'", 'https://analytics.lavanchyautomation.ch', 'https://tally.so']
      },
      // Tally (embed.js) injiziert ein <style> mit Lade-Animationen. Ändert Tally dieses CSS,
      // meldet die Konsole auf /kontakt/ einen CSP-Fehler mit dem neuen Hash; dann hier ersetzen.
      // Das Formular selbst funktioniert auch ohne (nur die Animation fehlt).
      styleDirective: {
        hashes: ['sha256-3PQtmxQ/BySEL2pnhMPLSakz2xyTEZib3L6jthOOr6s=']
      }
    }
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