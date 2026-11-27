/* Sageify language preference for static GitHub Pages hosting.
 * Detect the browser language on the first home-page visit. Manual changes
 * are remembered across visits using the same-origin localStorage setting.
 */
(function () {
  'use strict';

  var storageKey = 'sageify.siteLanguage';

  function selectedLanguage() {
    try {
      var saved = window.localStorage.getItem(storageKey);
      return saved === 'he' || saved === 'en' ? saved : null;
    } catch (_) {
      return null; // Browsing still works if storage is blocked.
    }
  }

  function rememberLanguage(language) {
    if (language !== 'he' && language !== 'en') return;
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (_) {
      // Private browsing / blocked storage: honor the link for this visit.
    }
  }

  // Capture language-switch clicks before other scripts navigate away.
  // This also works for keyboard-activated links and nested link content.
  document.addEventListener('click', function (event) {
    var target = event.target;
    var link = target && typeof target.closest === 'function'
      ? target.closest('a[data-lang-link][hreflang]')
      : null;
    if (link) rememberLanguage(link.getAttribute('hreflang'));
  }, true);

  // URLs such as /en.html and /accessibility-en.html explicitly request
  // English: keep those shareable links intact rather than forcing a redirect.
  var page = window.location.pathname.split('/').pop();
  if (page !== '' && page !== 'index.html' && page !== 'accessibility.html') return;

  var browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || 'he';
  var preferredLanguage = selectedLanguage() || (/^(he|iw)(-|$)/i.test(browserLanguage) ? 'he' : 'en');
  if (preferredLanguage !== 'en') return;

  var destination = page === 'accessibility.html' ? 'accessibility-en.html' : 'en.html';
  var url = new URL(destination, window.location.href);
  url.search = window.location.search;
  url.hash = window.location.hash;
  window.location.replace(url.href);
})();
