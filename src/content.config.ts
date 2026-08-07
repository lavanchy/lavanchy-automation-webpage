import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Aktuell nur "de". Für fr/en: analoge Collections mit base './src/content/fr/...'
// bzw. './src/content/en/...' ergänzen, siehe README.

const seo = z.object({
  title: z.string(),
  description: z.string(),
});

const hero = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  subheadline: z.string(),
});

const statItem = z.object({
  value: z.string(),
  label: z.string(),
});

const titledText = z.object({
  title: z.string(),
  text: z.string(),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content/de/pages' }),
  schema: z.object({
    seo,
    hero: hero.extend({
      zusatztext: z.string(),
      ctaNote: z.string(),
    }),
    problem: z.object({
      headline: z.string(),
      items: z.array(titledText),
    }),
    angebot: z.object({
      headline: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.array(z.string()) })),
    }),
    kontrolle: z.object({
      headline: z.string(),
      text: z.array(z.string()),
    }),
    referenzabschnitt: z.object({
      headline: z.string(),
      text: z.string(),
      stats: z.array(statItem),
      linkLabel: z.string(),
      linkHref: z.string(),
    }),
    fallstudienHinweis: z.object({
      headline: z.string(),
      text: z.string(),
      ctaLabel: z.string(),
    }),
    ueberMichTeaser: z.object({
      headline: z.string(),
      text: z.array(z.string()),
      linkLabel: z.string(),
      linkHref: z.string(),
    }),
    abschlussCta: z.object({
      headline: z.string(),
      text: z.string(),
      buttonLabel: z.string(),
    }),
  }),
});

const leistungen = defineCollection({
  loader: glob({ pattern: 'leistungen.md', base: './src/content/de/pages' }),
  schema: z.object({
    seo,
    hero,
    n8n: z.object({
      headline: z.string(),
      intro: z.array(z.string()),
      bulletsHeadline: z.string(),
      bullets: z.array(z.string()),
      kiHeadline: z.string(),
      kiText: z.array(z.string()),
      tempoHeadline: z.string(),
      tempoText: z.string(),
      beispieleHeadline: z.string(),
      beispiele: z.array(titledText),
    }),
    zusammenarbeit: z.object({
      headline: z.string(),
      intro: z.string(),
      schritte: z.array(titledText),
    }),
    qualitaet: z.object({
      headline: z.string(),
      introSatz: z.string(),
      introBullets: z.array(z.string()),
      introAbschluss: z.string(),
      pruefungVorLink: z.string(),
      linkStephan: z.string(),
      pruefungZwischenLinks: z.string(),
      linkLexGeneralis: z.string(),
      pruefungNachLink: z.string(),
      linkUrl: z.string(),
      cards: z.array(titledText),
      hinweis: z.string(),
    }),
    managedKi: z.object({
      headline: z.string(),
      intro: z.array(z.string()),
      bulletsHeadline: z.string(),
      bullets: z.array(z.string()),
      grundsatzHeadline: z.string(),
      grundsatzText: z.string(),
    }),
    faq: z.object({
      headline: z.string(),
      intro: z.string(),
      gruppen: z.array(
        z.object({
          label: z.string(),
          items: z.array(z.object({ frage: z.string(), antwort: z.string() })),
        })
      ),
    }),
    fuerWen: z.object({ headline: z.string(), text: z.string() }),
    abschlussCta: z.object({ headline: z.string(), text: z.string(), buttonLabel: z.string() }),
  }),
});

const referenzen = defineCollection({
  loader: glob({ pattern: 'referenzen.md', base: './src/content/de/pages' }),
  schema: z.object({
    seo,
    hero,
    fallstudien: z.array(
      z.object({
        headline: z.string(),
        ausgangslage: z.array(z.string()),
        loesung: z.array(z.string()),
        mehrwert: z.array(z.string()),
        stats: z.array(statItem),
      })
    ),
    weitereIdeen: z.object({
      headline: z.string(),
      intro: z.string(),
      items: z.array(titledText),
    }),
    fallstudienHinweis: z.object({
      headline: z.string(),
      text: z.string(),
      ctaLabel: z.string(),
    }),
    abschlussCta: z.object({ headline: z.string(), text: z.string(), buttonLabel: z.string() }),
  }),
});

const partner = defineCollection({
  loader: glob({ pattern: 'partner.md', base: './src/content/de/pages' }),
  schema: z.object({
    seo,
    hero,
    warum: z.object({
      headline: z.string(),
      text: z.string(),
      items: z.array(z.string()),
    }),
    partners: z.array(
      z.object({
        name: z.string(),
        text: z.string(),
        url: z.string().optional(),
        logo: z.string().optional(),
      })
    ),
    kontaktHinweis: z.object({ text: z.string(), ctaLabel: z.string() }),
  }),
});

const ueberMich = defineCollection({
  loader: glob({ pattern: 'ueber-mich.md', base: './src/content/de/pages' }),
  schema: z.object({
    seo,
    hero,
    werdegang: z.object({ headline: z.string(), text: z.array(z.string()) }),
    wieIchArbeite: z.object({
      headline: z.string(),
      text: z.array(z.string()),
      grundsaetze: z.array(titledText),
    }),
    wieIchVorgehe: z.object({
      headline: z.string(),
      text: z.string(),
      schritte: z.array(titledText),
      abschlussText: z.string(),
    }),
    testimonials: z.array(
      z.object({
        name: z.string(),
        quote: z.string(),
        translationNote: z.string().optional(),
        role: z.string(),
      })
    ),
    linkedinNote: z.string(),
    persoenliches: z.object({
      headline: z.string(),
      intro: z.string(),
      items: z.array(z.string()),
    }),
    abschlussCta: z.object({ headline: z.string(), text: z.string(), buttonLabel: z.string() }),
  }),
});

const kontakt = defineCollection({
  loader: glob({ pattern: 'kontakt.md', base: './src/content/de/pages' }),
  schema: z.object({
    seo,
    hero,
    erstgespraech: z.object({
      headline: z.string(),
      note: z.string(),
      buttonLabel: z.string(),
    }),
    kontaktmoeglichkeiten: z.object({ headline: z.string() }),
    kontaktformular: z.object({
      headline: z.string(),
      text: z.string(),
      fields: z.array(z.string()),
      buttonLabel: z.string(),
      hinweis: z.string(),
    }),
    wasEuchErwartet: z.object({ headline: z.string(), text: z.string() }),
    standort: z.object({ text: z.string() }),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/de/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/de/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { home, leistungen, referenzen, partner, ueberMich, kontakt, legal, blog };
