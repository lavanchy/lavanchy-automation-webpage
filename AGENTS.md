## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Rechtstexte (AGB, Datenschutz)

- Quelle: `src/content/{de,en,fr}/legal/agb.md` und `datenschutz.md`. Deutsch ist massgebend, EN/FR sind Übersetzungen.
- Rechtstexte nie still umformulieren: jede inhaltliche Änderung explizit auflisten, bei inhaltlichen Änderungen das «Stand»-Datum anpassen.
- Wird `agb.md` oder `datenschutz.md` geändert, im selben Arbeitsgang den Skill `/home/loic/projects/lavanchy-claude-skills/skills/legal/rechtsdokumente.md` nachziehen (Kernpunkte, «Aktueller Stand», Changelog), dort committen und pushen. Die Website ist führend, der Skill spiegelt sie.
- Neue Drittdienste, Embeds, Scripts, Cookies oder Formulare auf der Website: prüfen, ob die Datenschutzerklärung (DE/EN/FR) angepasst werden muss, und darauf hinweisen.
