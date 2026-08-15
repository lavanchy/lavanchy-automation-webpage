import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Content lebt pro Sprache unter src/content/<locale>/{pages,legal,blog}/, mit denselben
// Dateinamen wie unter de/. Jede Collection wird pro Sprache einmal registriert (Suffix Fr/En),
// alle nutzen dieselbe Schema-Definition. Siehe README für den Ablauf beim Ergänzen einer Sprache.

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

const homeSchema = z.object({
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
});

const leistungenSchema = z.object({
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
  mittenCta: z.object({
    headline: z.string(),
    text: z.string(),
    ctaLabel: z.string(),
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
});

const referenzenSchema = z.object({
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
});

const partnerSchema = z.object({
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
  kontaktHinweis: z.object({ headline: z.string(), text: z.string(), ctaLabel: z.string() }),
});

const ueberMichSchema = z.object({
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
});

const kontaktSchema = z.object({
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
    hinweis: z.string(),
  }),
  wasEuchErwartet: z.object({ headline: z.string(), text: z.string() }),
  abschluss: z.object({ text: z.string() }),
  standort: z.object({ text: z.string() }),
});

const legalSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  draft: z.boolean().default(false),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content/de/pages' }),
  schema: homeSchema,
});
const homeFr = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content/fr/pages' }),
  schema: homeSchema,
});
const homeEn = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content/en/pages' }),
  schema: homeSchema,
});

const leistungen = defineCollection({
  loader: glob({ pattern: 'leistungen.md', base: './src/content/de/pages' }),
  schema: leistungenSchema,
});
const leistungenFr = defineCollection({
  loader: glob({ pattern: 'leistungen.md', base: './src/content/fr/pages' }),
  schema: leistungenSchema,
});
const leistungenEn = defineCollection({
  loader: glob({ pattern: 'leistungen.md', base: './src/content/en/pages' }),
  schema: leistungenSchema,
});

const referenzen = defineCollection({
  loader: glob({ pattern: 'referenzen.md', base: './src/content/de/pages' }),
  schema: referenzenSchema,
});
const referenzenFr = defineCollection({
  loader: glob({ pattern: 'referenzen.md', base: './src/content/fr/pages' }),
  schema: referenzenSchema,
});
const referenzenEn = defineCollection({
  loader: glob({ pattern: 'referenzen.md', base: './src/content/en/pages' }),
  schema: referenzenSchema,
});

const partner = defineCollection({
  loader: glob({ pattern: 'partner.md', base: './src/content/de/pages' }),
  schema: partnerSchema,
});
const partnerFr = defineCollection({
  loader: glob({ pattern: 'partner.md', base: './src/content/fr/pages' }),
  schema: partnerSchema,
});
const partnerEn = defineCollection({
  loader: glob({ pattern: 'partner.md', base: './src/content/en/pages' }),
  schema: partnerSchema,
});

const ueberMich = defineCollection({
  loader: glob({ pattern: 'ueber-mich.md', base: './src/content/de/pages' }),
  schema: ueberMichSchema,
});
const ueberMichFr = defineCollection({
  loader: glob({ pattern: 'ueber-mich.md', base: './src/content/fr/pages' }),
  schema: ueberMichSchema,
});
const ueberMichEn = defineCollection({
  loader: glob({ pattern: 'ueber-mich.md', base: './src/content/en/pages' }),
  schema: ueberMichSchema,
});

const kontakt = defineCollection({
  loader: glob({ pattern: 'kontakt.md', base: './src/content/de/pages' }),
  schema: kontaktSchema,
});
const kontaktFr = defineCollection({
  loader: glob({ pattern: 'kontakt.md', base: './src/content/fr/pages' }),
  schema: kontaktSchema,
});
const kontaktEn = defineCollection({
  loader: glob({ pattern: 'kontakt.md', base: './src/content/en/pages' }),
  schema: kontaktSchema,
});

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/de/legal' }),
  schema: legalSchema,
});
const legalFr = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/fr/legal' }),
  schema: legalSchema,
});
const legalEn = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/en/legal' }),
  schema: legalSchema,
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/de/blog' }),
  schema: blogSchema,
});

export const collections = {
  home,
  homeFr,
  homeEn,
  leistungen,
  leistungenFr,
  leistungenEn,
  referenzen,
  referenzenFr,
  referenzenEn,
  partner,
  partnerFr,
  partnerEn,
  ueberMich,
  ueberMichFr,
  ueberMichEn,
  kontakt,
  kontaktFr,
  kontaktEn,
  legal,
  legalFr,
  legalEn,
  blog,
};
