export const siteConfig = {
  name: 'Lavanchy Automation',
  url: 'https://lavanchyautomation.ch',
  bookingUrl: 'https://cal.meetergo.com/loic-lavanchy/30-min-meeting',
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

export const locales = ['de', 'fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export function getLocale(pathname: string): Locale {
  const match = locales.find((locale) => pathname.startsWith(`/${locale}/`));
  return match ?? defaultLocale;
}

// Für jede Sprache dieselbe URL-Struktur wie unter /de/ (siehe README) — nur Labels übersetzt.
export const navByLocale: Record<Locale, { label: string; href: string }[]> = {
  de: [
    { label: 'Startseite', href: '/de/' },
    { label: 'Leistungen', href: '/de/leistungen/' },
    { label: 'Referenzen', href: '/de/referenzen/' },
    { label: 'Partner', href: '/de/partner/' },
    { label: 'Über mich', href: '/de/ueber-mich/' },
    { label: 'Kontakt', href: '/de/kontakt/' },
  ],
  fr: [
    { label: 'Accueil', href: '/fr/' },
    { label: 'Prestations', href: '/fr/leistungen/' },
    { label: 'Références', href: '/fr/referenzen/' },
    { label: 'Partenaires', href: '/fr/partner/' },
    { label: 'À propos', href: '/fr/ueber-mich/' },
    { label: 'Contact', href: '/fr/kontakt/' },
  ],
  en: [
    { label: 'Home', href: '/en/' },
    { label: 'Services', href: '/en/leistungen/' },
    { label: 'References', href: '/en/referenzen/' },
    { label: 'Partners', href: '/en/partner/' },
    { label: 'About', href: '/en/ueber-mich/' },
    { label: 'Contact', href: '/en/kontakt/' },
  ],
};

export const ctaLabelByLocale: Record<Locale, string> = {
  de: 'Kostenloses Erstgespräch buchen',
  fr: 'Réserver un premier entretien gratuit',
  en: 'Book a free intro call',
};

export const countryByLocale: Record<Locale, string> = {
  de: 'Schweiz',
  fr: 'Suisse',
  en: 'Switzerland',
};

export const ogLocaleByLocale: Record<Locale, string> = {
  de: 'de_CH',
  fr: 'fr_CH',
  en: 'en_US',
};

export const uiByLocale: Record<Locale, { skipLink: string; navAriaLabel: string; menuOpen: string; menuClose: string; langSwitcherLabel: string }> = {
  de: {
    skipLink: 'Zum Hauptinhalt springen',
    navAriaLabel: 'Hauptnavigation',
    menuOpen: 'Menü öffnen',
    menuClose: 'Menü schliessen',
    langSwitcherLabel: 'Sprache wählen',
  },
  fr: {
    skipLink: 'Passer au contenu principal',
    navAriaLabel: 'Navigation principale',
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    langSwitcherLabel: 'Choisir la langue',
  },
  en: {
    skipLink: 'Skip to main content',
    navAriaLabel: 'Main navigation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    langSwitcherLabel: 'Choose language',
  },
};
