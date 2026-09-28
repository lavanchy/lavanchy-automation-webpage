// Plausible-Init + Ziele, eingebunden von src/components/Analytics.astro.
// Eigene Datei statt Inline-Skript, damit die CSP (script-src 'self') ohne Hash greift.
window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init()

document.addEventListener('click', function (e) {
  var link = e.target.closest && e.target.closest('a[href^="https://cal.meetergo.com/"]');
  if (link) plausible('Erstgespräch Klick', { props: { seite: location.pathname } });
});

window.addEventListener('message', function (e) {
  if (e.origin !== 'https://tally.so' || typeof e.data !== 'string') return;
  try {
    if (JSON.parse(e.data).event === 'Tally.FormSubmitted') {
      plausible('Kontaktformular gesendet', { props: { seite: location.pathname } });
    }
  } catch (_) {}
});
