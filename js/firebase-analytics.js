// Google Analytics 4 (gtag.js nativo) con cumplimiento estricto de Google Consent Mode v2.
// No usa Firebase Installations ni crea bases IndexedDB / _fid antes del consentimiento.
(function () {
  const GA_MEASUREMENT_ID = 'G-0C71EYB36J';

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  if (!window.__consentDefaultSet) {
    window.__consentDefaultSet = true;
    window.gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      region: [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
        'GB', 'CH'
      ],
      wait_for_update: 500
    });
    window.gtag('set', 'ads_data_redaction', true);
  }

  if (!window.__ga4Loaded) {
    window.__ga4Loaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }
})();
