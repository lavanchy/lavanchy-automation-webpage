export const siteConfig = {
  name: 'Lavanchy Automation',
  url: 'https://lavanchyautomation.ch',
  calendlyUrl: 'https://calendly.com/lo-lavanchy',
  ctaLabel: 'Kostenloses Erstgespräch buchen',
  // RAV-Auflage: bis zu diesem Datum keine Preise, kein Angebots-/Bestellformular,
  // einzige Handlungsaufforderung ist der Calendly-Link oben.
  ravRestrictionActive: true,
  ravRestrictionEndDate: '2026-09-29',
} as const;

export const locales = ['de'] as const;
export const defaultLocale = 'de' as const;

export const nav = [
  { label: 'Startseite', href: '/de/' },
  { label: 'Leistungen', href: '/de/leistungen/' },
  { label: 'Referenzen', href: '/de/referenzen/' },
  { label: 'Über mich', href: '/de/ueber-mich/' },
  { label: 'Blog', href: '/de/blog/' },
  { label: 'Kontakt', href: '/de/kontakt/' },
] as const;
