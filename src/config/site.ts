export const siteConfig = {
  name: 'Lavanchy Automation',
  url: 'https://lavanchyautomation.ch',
  bookingUrl: 'https://cal.meetergo.com/loic-lavanchy/30-min-meeting-or-loic-lavanchy',
  ctaLabel: 'Kostenloses Erstgespräch buchen',
  phone: '+41 79 687 81 28',
  email: 'lo.lavanchy@gmail.com',
  linkedin: 'https://www.linkedin.com/in/loic-lavanchy/',
  address: {
    legalName: 'Lavanchy Automation, Einzelunternehmen, Loïc Lavanchy',
    street: 'Rue du Centre 53',
    zipCity: '1025 St-Sulpice VD',
    country: 'Schweiz',
  },
  // RAV-Auflage bis zu diesem Datum: keine Preise, kein Angebots-/Bestellformular.
  // Erlaubt sind: Erstgespräch-CTA (oben), ein allgemeines Kontaktformular
  // (Name/E-Mail/Nachricht) und der Hinweis auf kostenlose Fallstudien.
  ravRestrictionActive: true,
  ravRestrictionEndDate: '2026-09-29',
} as const;

export const locales = ['de'] as const;
export const defaultLocale = 'de' as const;

export const nav = [
  { label: 'Startseite', href: '/de/' },
  { label: 'Leistungen', href: '/de/leistungen/' },
  { label: 'Referenzen', href: '/de/referenzen/' },
  { label: 'Partner', href: '/de/partner/' },
  { label: 'Über mich', href: '/de/ueber-mich/' },
  { label: 'Blog', href: '/de/blog/' },
  { label: 'Kontakt', href: '/de/kontakt/' },
] as const;
